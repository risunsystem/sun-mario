/**
 * Sunset Lover 风格 - Web Audio API 合成背景音乐（无需下载）
 */
(function () {
  let audioCtx = null;
  let isPlaying = false;
  let timer = null;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function freq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  function playTone(ctx, note, start, duration, vol, type) {
    type = type || "sine";
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq(note), start);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }

  function chord(ctx, notes, start, duration, vol) {
    notes.forEach((n, i) => {
      playTone(ctx, n, start, duration, vol * (0.5 - i * 0.1), "sine");
      playTone(ctx, n + 12, start, duration, vol * 0.1, "triangle");
    });
  }

  function runLoop() {
    const ctx = getCtx();
    const bpm = 86;
    const beat = 60 / bpm;
    const bar = beat * 4;
    const loopLen = bar * 4;

    const chords = [
      [57, 60, 64],
      [53, 57, 60],
      [48, 52, 55],
      [55, 59, 62]
    ];

    const melody = [
      [76, 0], [74, 0.5], [72, 1], [74, 2], [76, 2.5], [79, 3],
      [76, 4], [74, 4.5], [72, 5], [69, 5.5], [67, 6], [69, 7],
      [72, 7.5], [74, 8], [76, 9], [74, 9.5], [72, 10], [69, 11], [67, 12]
    ];

    function schedule(offset) {
      for (let b = 0; b < 4; b++) {
        const t = offset + b * bar;
        chord(ctx, chords[b], t, bar * 0.9, 0.14);
      }
      melody.forEach(([note, pos]) => {
        const t = offset + pos * beat;
        playTone(ctx, note, t, beat * 0.4, 0.06, "sine");
        playTone(ctx, note + 12, t, beat * 0.4, 0.02, "triangle");
      });
    }

    const now = ctx.currentTime;
    schedule(now);
    schedule(now + loopLen);

    if (isPlaying) {
      timer = setTimeout(runLoop, (loopLen * 1000) - 50);
    }
  }

  window.SunsetMusic = {
    play() {
      if (isPlaying) return;
      isPlaying = true;
      const ctx = getCtx();
      if (ctx.state === "suspended") ctx.resume();
      runLoop();
    },
    stop() {
      isPlaying = false;
      if (timer) clearTimeout(timer);
      timer = null;
    }
  };
})();
