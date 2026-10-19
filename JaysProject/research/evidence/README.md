# Evidence artifacts

| Path | What it is | How it was produced |
|---|---|---|
| `launcher/01-play-idle.png` … `05-connect-error.png` | Screenshots of the real launcher during the automated e2e test (Linux Electron 33.4.11, Xvfb) | `JAYS_EVIDENCE_DIR=../research/evidence/launcher xvfb-run -a npm test` |
| `rea/jays-client-exe.inspect-artifact.json` | REA artifact inventory of Jays' own Windows client | `npx rea-agents@6.7.0 inspect-artifact build-win/bin/jays-client.exe --format json` |
| `rea/jays-client-elf.binary-layout.json` | REA error showing the ELF layout provider is unavailable (pwntools missing) | `npx rea-agents@6.7.0 inspect-binary-layout build/bin/jays-client --format json` |
| `rea/fivem-legitimacy-dll.inspect-artifact.json` | Identification of FiveM's prebuilt `legitimacy.dll` (metadata only, F-025) | `npx rea-agents@6.7.0 inspect-artifact …/legitimacy/release/legitimacy.dll --format json` |
| `rea/windows-imports.txt` | DLL import tables of Jays' Windows executables | `x86_64-w64-mingw32-objdump -p` |
| `../source-analysis/fivem-submodules.txt` | Pinned submodule revisions of the FiveM snapshot | `git submodule status` |

Screenshots are captures of the running application, not mock-ups. A black capture of the
Windows build under Wine was discarded because it showed nothing (F-032).
