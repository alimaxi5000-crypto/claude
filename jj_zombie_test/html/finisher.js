// Finisher UI. Renders only what Lua sends; holds no logic that decides anything.
// Messages: fin:open, fin:progress, fin:time, fin:press, fin:result, fin:close (see docs/NUI_CONTRACT.md)
(() => {
  const $ = (id) => document.getElementById(id);
  const fin = $('fin'), fill = $('fin-fill'), timeEl = $('fin-time'), key = document.querySelector('.fin-key');
  const result = $('result');
  let timeLimitMs = 7000;
  let resultTimer = null;

  const setVar = (k, v) => document.documentElement.style.setProperty(k, v);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function open(d) {
    if (d.ui) {
      if (d.ui.AccentColor) setVar('--accent', d.ui.AccentColor);
      if (d.ui.DangerColor) setVar('--danger', d.ui.DangerColor);
      fin.classList.toggle('center', d.ui.Position === 'center');
    }
    $('fin-key').textContent = String(d.key || 'E').slice(0, 3).toUpperCase();
    $('fin-text').textContent = d.text?.push ?? '';
    $('fin-press').textContent = d.text?.press ?? '';
    const th = d.thresholds || { ZombieWinsBelow: 35, PlayerWinsAbove: 70 };
    $('mark-low').style.left = `${clamp(th.ZombieWinsBelow, 0, 100)}%`;
    $('mark-high').style.left = `${clamp(th.PlayerWinsAbove, 0, 100)}%`;
    timeLimitMs = (d.timeLimit || 7) * 1000;
    timeEl.style.width = '100%';
    progress({ value: d.progress ?? 30, danger: 0.5 });
    result.className = 'result hidden';
    fin.classList.remove('hidden');
  }
  function progress(d) {
    const v = clamp(Number(d.value) || 0, 0, 100);
    fill.style.width = `${v}%`;
    fin.classList.toggle('danger', (d.danger ?? 1 - v / 100) > 0.62);
  }
  function time(d) {
    timeEl.style.width = `${clamp((d.remainingMs / timeLimitMs) * 100, 0, 100)}%`;
  }
  function press() {
    key.classList.add('down');
    setTimeout(() => key.classList.remove('down'), 70);
  }
  function showResult(d) {
    fin.classList.add('hidden');
    result.textContent = d.text || '';
    result.className = `result ${d.result === 'bite' ? 'bite' : 'ok'}`;
    clearTimeout(resultTimer);
    resultTimer = setTimeout(() => {
      result.classList.add('fade');
      resultTimer = setTimeout(() => { result.className = 'result hidden'; }, 700);
    }, 1100);
  }
  function close() {
    fin.classList.add('hidden');
  }

  const handlers = {
    'fin:open': open, 'fin:progress': progress, 'fin:time': time, 'fin:press': press,
    'fin:result': showResult, 'fin:close': close,
  };
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d.type !== 'string') return;
    const h = handlers[d.type];
    if (h) h(d);
    else if ((d.type === 'sfx' || d.type === 'loop') && window.JJZSound) window.JJZSound.handle(d);
  });
  window.JJZFin = { open, progress, time, press, showResult, close };
})();
