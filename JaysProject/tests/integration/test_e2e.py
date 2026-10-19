#!/usr/bin/env python3
"""End-to-end tests: real jays-server and jays-client processes over TCP/UDP.

Usage: test_e2e.py --bin-dir build/bin --project-dir .
Only the Python standard library is used.
"""
import argparse
import json
import os
import socket
import struct
import subprocess
import sys
import tempfile
import threading
import time
import traceback

EXE = ".exe" if os.name == "nt" else ""
RESULTS = []


def free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
    # make sure the UDP port is free as well
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as u:
        u.bind(("127.0.0.1", port))
    return port


class Proc:
    """A child process whose JSON log lines are collected on a thread."""

    def __init__(self, args, stdin=False):
        self.args = args
        self.lines = []
        self.raw = []
        self.p = subprocess.Popen(
            args,
            stdin=subprocess.PIPE if stdin else subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        self._t = threading.Thread(target=self._read, daemon=True)
        self._t.start()

    def _read(self):
        for line in self.p.stdout:
            line = line.rstrip("\n")
            self.raw.append(line)
            try:
                self.lines.append(json.loads(line))
            except json.JSONDecodeError:
                pass

    def messages(self, component=None):
        return [l["msg"] for l in list(self.lines) if component is None or l.get("component") == component]

    def has(self, text, component=None):
        return any(text in m for m in self.messages(component))

    def wait_for(self, text, component=None, timeout=10.0):
        end = time.time() + timeout
        while time.time() < end:
            if self.has(text, component):
                return True
            if self.p.poll() is not None and not self._t.is_alive():
                break
            time.sleep(0.02)
        return self.has(text, component)

    def send(self, line):
        self.p.stdin.write(line + "\n")
        self.p.stdin.flush()

    def wait(self, timeout=15):
        try:
            rc = self.p.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            self.p.kill()
            rc = self.p.wait()
        self._t.join(timeout=2)
        return rc

    def stop(self):
        if self.p.poll() is None:
            self.p.terminate()
        return self.wait(5)

    def dump(self):
        return "\n".join(self.raw[-60:])


def test(fn):
    RESULTS.append(fn)
    return fn


class Ctx:
    def __init__(self, bin_dir, project_dir):
        self.server_exe = os.path.join(bin_dir, "jays-server" + EXE)
        self.client_exe = os.path.join(bin_dir, "jays-client" + EXE)
        self.project = project_dir
        self.cfg = os.path.join(project_dir, "server", "data", "server.cfg")
        self.resources = os.path.join(project_dir, "server", "data", "resources")

    def server(self, port, cfg=None, console=False, extra=()):
        args = [self.server_exe, "--config", cfg or self.cfg, "--resources", self.resources,
                "--endpoint", f"127.0.0.1:{port}", "--log-format", "json"]
        if not console:
            args.append("--no-console")
        s = Proc(args + list(extra), stdin=console)
        if not s.wait_for("ready", "server", timeout=10):
            raise AssertionError("server did not start:\n" + s.dump())
        return s

    def client(self, *args):
        return Proc([self.client_exe, "--log-format", "json", "--no-console"] + list(args))


def check(cond, msg, *procs):
    if not cond:
        details = "\n".join(f"--- {' '.join(p.args[:3])} ...\n{p.dump()}" for p in procs)
        raise AssertionError(msg + ("\n" + details if details else ""))


# ---------------------------------------------------------------------------


@test
def two_clients_exchange_chat_and_events(ctx):
    port = free_port()
    srv = ctx.server(port)
    try:
        bob = ctx.client("--connect", f"127.0.0.1:{port}", "--name", "Bob", "--quit-after", "2500")
        check(bob.wait_for("active", "state"), "Bob did not become active", bob, srv)
        alice = ctx.client("--connect", f"127.0.0.1:{port}", "--name", "Alice",
                           "--exec", "say hello from alice", "--exec", "ping", "--quit-after", "800")
        check(alice.wait(15) == 0, "Alice exit code", alice, srv)
        check(bob.wait(15) == 0, "Bob exit code", bob, srv)

        # server -> client event with export + convar data
        check(alice.has("[welcome] Hello, Alice! Welcome to the Jays Project V0.1 test server"),
              "welcome event", alice)
        # client -> server -> all clients broadcast
        check(bob.has("[chat] Alice: hello from alice"), "Bob received Alice's chat", bob)
        check(alice.has("[ping] event round trip"), "ping round trip", alice)
        # deferral update reached the client before join
        check(alice.has("server: Checking Alice...", "connect"), "deferral update", alice)
        # server-side lifecycle events
        check(srv.wait_for("player Alice joined as id"), "playerJoining", srv)
        check(srv.wait_for("player 2 (Alice) says: hello from Alice"), "net event on server", srv)
        check(srv.wait_for("left: Disconnected: Quit."), "playerDropped", srv)
        # states are reported in order
        states = [m.split(":")[0] for m in alice.messages("state")]
        check(states[:6] == ["connecting", "handshaking", "downloading", "loading", "active", "disconnected"],
              f"state sequence {states}", alice)
    finally:
        srv.stop()


@test
def banned_player_is_rejected(ctx):
    port = free_port()
    srv = ctx.server(port)
    try:
        c = ctx.client("--connect", f"127.0.0.1:{port}", "--name", "banned")
        rc = c.wait(10)
        check(rc == 4, f"expected exit 4 (rejected), got {rc}", c)
        check(c.has("rejected: You are banned from this test server.", "state"), "kick reason", c)
        check(srv.wait_for("Rejected banned"), "server logged rejection", srv)
    finally:
        srv.stop()


@test
def connection_failure_is_reported(ctx):
    port = free_port()  # nothing listens here
    start = time.time()
    c = ctx.client("--connect", f"127.0.0.1:{port}", "--timeout", "1500")
    rc = c.wait(10)
    check(rc == 3, f"expected exit 3 (connect failed), got {rc}", c)
    check(any("connection failed" in m for m in c.messages("state")), "failure state", c)
    check(time.time() - start < 6, "failure took too long")

    bad = ctx.client("--connect", "not-an-address:abc")
    check(bad.wait(10) == 3, "invalid address exit code", bad)


@test
def probe_reports_fxserver_compatible_info(ctx):
    port = free_port()
    srv = ctx.server(port)
    try:
        p = subprocess.run([ctx.client_exe, "--probe", f"127.0.0.1:{port}", "--timeout", "2000", "--log-level", "error"],
                           capture_output=True, text=True, timeout=20)
        check(p.returncode == 0, f"probe exit {p.returncode}: {p.stdout} {p.stderr}")
        data = json.loads(p.stdout.strip().splitlines()[-1])
        check(data["getinfo"]["hostname"] == "Jays Project Dev Server", "getinfo hostname")
        check(data["getinfo"]["sv_maxclients"] == "8", "getinfo maxclients")
        check("jays-basic" in data["info"]["resources"], "info.json resources")
        check(data["dynamic"]["clients"] == 0, "dynamic.json clients")
        check(data["players"] == [], "players.json")
    finally:
        srv.stop()

    # probing a dead endpoint fails cleanly
    p = subprocess.run([ctx.client_exe, "--probe", f"127.0.0.1:{free_port()}", "--timeout", "600", "--log-level", "error"],
                       capture_output=True, text=True, timeout=20)
    check(p.returncode == 3, f"dead probe exit {p.returncode}")


def frame(msg_type, body=b""):
    return struct.pack("<IB", len(body) + 1, msg_type) + body


def jstr(s):
    b = s.encode()
    return struct.pack("<I", len(b)) + b


def read_frame(sock, timeout=5):
    sock.settimeout(timeout)
    buf = b""
    while len(buf) < 5:
        chunk = sock.recv(4096)
        if not chunk:
            return None, None
        buf += chunk
    length, msg_type = struct.unpack("<IB", buf[:5])
    while len(buf) < 4 + length:
        chunk = sock.recv(4096)
        if not chunk:
            return None, None
        buf += chunk
    return msg_type, buf[5:4 + length]


@test
def protocol_violations_are_handled(ctx):
    port = free_port()
    srv = ctx.server(port)
    try:
        # wrong protocol version -> Reject frame
        with socket.create_connection(("127.0.0.1", port), timeout=5) as s:
            s.sendall(b"JAYSNP01" + frame(1, struct.pack("<I", 99) + jstr("Mallory") + jstr("abc") + jstr("x")))
            t, body = read_frame(s)
            check(t == 3, f"expected Reject frame, got {t}", srv)
            check(b"version mismatch" in body, f"reject reason {body!r}", srv)

        # garbage instead of a preamble -> connection closed
        with socket.create_connection(("127.0.0.1", port), timeout=5) as s:
            s.sendall(b"\x00\x01garbage-bytes")
            s.settimeout(5)
            check(s.recv(100) == b"", "server should close garbage connections", srv)

        # oversized frame after a valid preamble -> connection closed
        with socket.create_connection(("127.0.0.1", port), timeout=5) as s:
            s.sendall(b"JAYSNP01" + struct.pack("<IB", 0x7FFFFFFF, 1))
            s.settimeout(5)
            data = s.recv(100)
            check(data == b"" or data[4] == 11, "oversized frame should be refused", srv)

        # events before the handshake are not accepted
        with socket.create_connection(("127.0.0.1", port), timeout=5) as s:
            s.sendall(b"JAYSNP01" + frame(8, jstr("jays-chat:send") + struct.pack("<i", 0) + jstr("\x91\xa1x")))
            t, body = read_frame(s)
            check(t == 11, f"expected Disconnect frame, got {t}", srv)

        # unknown HTTP path
        with socket.create_connection(("127.0.0.1", port), timeout=5) as s:
            s.sendall(b"GET /nope HTTP/1.0\r\n\r\n")
            s.settimeout(5)
            data = b""
            while True:
                chunk = s.recv(4096)
                if not chunk:
                    break
                data += chunk
            check(data.startswith(b"HTTP/1.1 404"), f"404 expected: {data[:40]!r}", srv)

        # the server is still healthy afterwards
        c = ctx.client("--connect", f"127.0.0.1:{port}", "--name", "Carol", "--quit-after", "200")
        check(c.wait(15) == 0, "server still accepts players", c, srv)
    finally:
        srv.stop()


@test
def server_full_and_console_commands(ctx):
    port = free_port()
    with tempfile.TemporaryDirectory() as tmp:
        cfg = os.path.join(tmp, "small.cfg")
        with open(cfg, "w") as f:
            f.write(f'exec "{ctx.cfg}"\nsv_maxclients 1\n')
        srv = ctx.server(port, cfg=cfg, console=True)
        try:
            first = ctx.client("--connect", f"127.0.0.1:{port}", "--name", "First", "--quit-after", "3000")
            check(first.wait_for("active", "state"), "first player active", first, srv)
            second = ctx.client("--connect", f"127.0.0.1:{port}", "--name", "Second")
            check(second.wait(10) == 4, "second player should be rejected", second)
            check(second.has("server is full", "state"), "full reason", second)

            srv.send("status")
            check(srv.wait_for("1 player(s)", "console"), "status output", srv)
            srv.send("players")  # restricted resource command, allowed from console
            check(srv.wait_for("[1] First ping="), "players command", srv)
            srv.send("say maintenance soon")
            check(first.wait_for("[server] maintenance soon", "chat"), "say reached client", first, srv)
            srv.send("clientkick 1 bye")
            check(first.wait(10) == 5, "kicked client exit code 5", first)
            check(first.has("disconnected by server: bye", "state"), "kick reason", first)
            srv.send("stop jays-chat")
            check(srv.wait_for("Stopped resource jays-chat"), "stop resource", srv)
            srv.send("start jays-chat")
            check(srv.wait_for("Started resource jays-chat"), "start resource", srv)
            srv.send("nosuchcommand")
            check(srv.wait_for("No such command", "console"), "unknown command", srv)
            srv.send("quit")
            check(srv.wait(10) == 0, "server quit cleanly", srv)
        finally:
            srv.stop()


@test
def config_errors_fail_startup(ctx):
    p = subprocess.run([ctx.server_exe, "--config", os.path.join(ctx.project, "does-not-exist.cfg"), "--no-console"],
                       capture_output=True, text=True, timeout=20)
    check(p.returncode == 1, f"exit code {p.returncode}")
    check("could not open config file" in p.stdout, "error message: " + p.stdout)

    port = free_port()
    blocker = ctx.server(port)
    try:
        p = subprocess.run([ctx.server_exe, "--config", ctx.cfg, "--endpoint", f"127.0.0.1:{port}", "--no-console"],
                           capture_output=True, text=True, timeout=20)
        check(p.returncode == 1 and "bind/listen" in p.stdout, "port in use should fail: " + p.stdout)
    finally:
        blocker.stop()


@test
def client_local_resource_mode(ctx):
    res_dir = os.path.join(ctx.project, "tests", "data", "local-resources")
    c = ctx.client("--local-resources", res_dir, "--exec", "localtest 3", "--quit-after", "500")
    check(c.wait(10) == 0, "local mode exit code", c)
    check(c.has("local resource loaded"), "script ran", c)
    check(c.has("command localtest got 3"), "command ran", c)
    check(c.has("TriggerServerEvent(local:event): not connected"), "server event without server is reported", c)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bin-dir", required=True)
    ap.add_argument("--project-dir", required=True)
    ap.add_argument("-k", default="")
    a = ap.parse_args()
    ctx = Ctx(os.path.abspath(a.bin_dir), os.path.abspath(a.project_dir))

    failed = 0
    for fn in RESULTS:
        if a.k and a.k not in fn.__name__:
            continue
        start = time.time()
        try:
            fn(ctx)
            print(f"[PASS] {fn.__name__} ({time.time() - start:.1f}s)", flush=True)
        except Exception as e:  # noqa: BLE001 - report every failure
            failed += 1
            print(f"[FAIL] {fn.__name__}: {e}", flush=True)
            if not isinstance(e, AssertionError):
                traceback.print_exc()
    print(f"\n{len(RESULTS) - failed if not a.k else '-'} passed, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
