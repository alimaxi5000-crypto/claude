// Procedural sound design (WebAudio). No samples: every sound is synthesised from oscillators,
// filtered noise and envelopes, so there is nothing to license and nothing to download.
// API: JJZSound.handle({type:'sfx', name, volume, pitch}) / ({type:'loop', name, on, intensity})
(() => {
  let ctx = null, master = null, noiseBuf = null;
  const loops = {};

  function ac() {
    if (ctx) return ctx;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createDynamicsCompressor();
    master.threshold.value = -14; master.ratio.value = 4;
    master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = 0.97 * b + 0.03 * w; d[i] = w * 0.6 + b * 2.2; }
    return ctx;
  }
  const now = () => ctx.currentTime;

  function noise(dur) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf; s.loop = true;
    s.loopStart = Math.random() * 1.5; s.start(now(), Math.random() * 1.5, dur + 0.1);
    return s;
  }
  function gainEnv(t0, a, peak, hold, rel) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + a);
    g.gain.setValueAtTime(Math.max(0.0002, peak), t0 + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + hold + rel);
    return g;
  }
  function filter(type, freq, q) {
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q ?? 0.8;
    return f;
  }
  function out(node, vol) {
    const g = ctx.createGain(); g.gain.value = vol; node.connect(g); g.connect(master); return g;
  }

  // Low body thump (impacts, heartbeat).
  function thump(t0, freq, vol, len = 0.18) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * 1.8, t0);
    o.frequency.exponentialRampToValueAtTime(freq, t0 + 0.05);
    const g = gainEnv(t0, 0.004, vol, 0.01, len);
    o.connect(g); out(g, 1);
    o.start(t0); o.stop(t0 + len + 0.05);
  }
  // Filtered noise burst (cloth, breath, whoosh, crunch).
  function burst(t0, type, freq, q, vol, a, hold, rel, sweepTo) {
    const n = noise(a + hold + rel);
    const f = filter(type, freq, q);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t0 + a + hold + rel);
    const g = gainEnv(t0, a, vol, hold, rel);
    n.connect(f); f.connect(g); out(g, 1);
  }
  // Zombie voice: sawtooth through three formants, pitch wobble + growl roughness.
  function growl(t0, dur, pitch, vol, rise = 0) {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    const base = 62 * pitch;
    o.frequency.setValueAtTime(base, t0);
    o.frequency.linearRampToValueAtTime(base * (1 + rise), t0 + dur * 0.6);
    o.frequency.linearRampToValueAtTime(base * 0.85, t0 + dur);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 23 + Math.random() * 9;
    const lfoG = ctx.createGain(); lfoG.gain.value = base * 0.18;
    lfo.connect(lfoG); lfoG.connect(o.frequency);
    const env = gainEnv(t0, 0.06, vol, dur * 0.55, dur * 0.4);
    const mix = ctx.createGain(); mix.gain.value = 1;
    for (const [f, q, gv] of [[320, 4, 1.0], [780, 6, 0.6], [2300, 8, 0.25]]) {
      const bp = filter('bandpass', f * (0.9 + Math.random() * 0.2), q);
      const g = ctx.createGain(); g.gain.value = gv;
      o.connect(bp); bp.connect(g); g.connect(mix);
    }
    const rough = noise(dur);
    const rf = filter('bandpass', 600, 1.2);
    const rg = ctx.createGain(); rg.gain.value = 0.35;
    rough.connect(rf); rf.connect(rg); rg.connect(mix);
    mix.connect(env); out(env, 1);
    o.start(t0); lfo.start(t0); o.stop(t0 + dur + 0.1); lfo.stop(t0 + dur + 0.1);
  }

  const SFX = {
    growl: (v, p) => growl(now(), 0.9 + Math.random() * 0.6, p, 0.5 * v),
    roar: (v, p) => growl(now(), 1.3, p * 1.1, 0.75 * v, 0.35),
    grab: (v) => { const t = now(); thump(t, 70, 0.9 * v, 0.25); burst(t, 'bandpass', 1800, 0.7, 0.45 * v, 0.005, 0.05, 0.25); },
    snap: (v, p) => { const t = now(); burst(t, 'highpass', 3500 * p, 0.7, 0.5 * v, 0.001, 0.005, 0.04); burst(t + 0.07, 'highpass', 3200 * p, 0.7, 0.35 * v, 0.001, 0.005, 0.04); },
    shove: (v) => { const t = now(); burst(t, 'bandpass', 900, 0.6, 0.6 * v, 0.02, 0.05, 0.25, 300); thump(t + 0.05, 58, 1.0 * v, 0.35); },
    punch: (v) => { const t = now(); thump(t, 64, 1.0 * v, 0.28); burst(t, 'lowpass', 2400, 0.7, 0.5 * v, 0.002, 0.02, 0.12); },
    bite: (v) => {
      const t = now();
      for (let i = 0; i < 6; i++) burst(t + i * 0.035, 'highpass', 2200 + Math.random() * 1500, 1.2, 0.35 * v, 0.001, 0.01, 0.05);
      burst(t + 0.05, 'lowpass', 900, 1.5, 0.7 * v, 0.03, 0.12, 0.45, 200);
      growl(t, 0.6, 1.2, 0.5 * v, 0.2);
    },
    swipe: (v) => { const t = now(); burst(t, 'bandpass', 1400, 0.9, 0.5 * v, 0.03, 0.04, 0.18, 500); },
    gasp: (v) => { const t = now(); burst(t, 'bandpass', 1300, 1.4, 0.45 * v, 0.06, 0.12, 0.35, 900); },
  };

  // ---------------------------------------------------------------- loops
  function startLoop(name, intensity, volume) {
    if (loops[name]) { loops[name].intensity = intensity; loops[name].volume = volume; return; }
    const L = { intensity, volume, timer: null, on: true };
    loops[name] = L;
    const step = () => {
      if (!L.on) return;
      const t = now();
      let next = 1.0;
      if (name === 'heartbeat') {
        const bpm = 70 + 90 * L.intensity;
        thump(t, 48, 0.55 * L.volume * (0.6 + 0.4 * L.intensity), 0.16);
        thump(t + 0.22, 44, 0.4 * L.volume * (0.6 + 0.4 * L.intensity), 0.14);
        next = 60 / bpm;
      } else if (name === 'breath') {
        const rate = 0.9 - 0.45 * L.intensity;
        burst(t, 'bandpass', 1100, 1.0, 0.18 * L.volume, 0.08, rate * 0.25, rate * 0.4, 800);
        burst(t + rate * 0.75, 'bandpass', 700, 1.0, 0.12 * L.volume, 0.06, rate * 0.2, rate * 0.35, 500);
        next = rate * 1.5;
      } else if (name === 'struggle') {
        if (Math.random() < 0.35 + 0.4 * L.intensity) growl(t, 0.35 + Math.random() * 0.4, 1.0 + Math.random() * 0.2, 0.35 * L.volume * L.intensity);
        burst(t, 'bandpass', 2000, 0.6, 0.08 * L.volume, 0.02, 0.08, 0.15);
        next = 0.45 + Math.random() * 0.4;
      }
      L.timer = setTimeout(step, next * 1000);
    };
    step();
  }
  function stopLoop(name) {
    const names = name === '*' ? Object.keys(loops) : [name];
    for (const n of names) {
      const L = loops[n];
      if (L) { L.on = false; clearTimeout(L.timer); delete loops[n]; }
    }
  }

  window.JJZSound = {
    handle(d) {
      if (!ac()) return;
      if (ctx.state === 'suspended') ctx.resume();
      if (d.type === 'sfx') {
        const f = SFX[d.name];
        if (f) f(Math.max(0, Math.min(1.5, d.volume ?? 1)), Math.max(0.5, Math.min(2, d.pitch ?? 1)));
      } else if (d.type === 'loop') {
        if (d.on) startLoop(d.name, Math.max(0, Math.min(1, d.intensity ?? 0.5)), Math.max(0, Math.min(1.5, d.volume ?? 1)));
        else stopLoop(d.name);
      }
    },
    names: Object.keys(SFX),
  };
})();
