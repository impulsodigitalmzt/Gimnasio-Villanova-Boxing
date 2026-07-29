/**
 * Feedback sonoro / háptico al detectar check-in en kiosco de recepción.
 */

export function playCheckInAlarm(kind: 'success' | 'duplicate' | 'error' = 'success') {
  if (typeof window === 'undefined') return;

  try {
    if (navigator.vibrate) {
      navigator.vibrate(
        kind === 'success' ? [40, 40, 80] : kind === 'duplicate' ? [30, 50, 30] : [120],
      );
    }
  } catch {
    // ignore
  }

  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    const tones =
      kind === 'success'
        ? [523.25, 659.25, 783.99]
        : kind === 'duplicate'
          ? [440, 440]
          : [220, 180];

    tones.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'error' ? 'sawtooth' : 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02 + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + index * 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.12);
      osc.stop(now + 0.32 + index * 0.12);
    });

    window.setTimeout(() => {
      void ctx.close();
    }, 900);
  } catch {
    // Sin audio: el overlay visual basta
  }
}

export function speakCheckInName(name: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(`Bienvenido, ${name}`);
    utter.lang = 'es-MX';
    utter.rate = 1.05;
    window.speechSynthesis.speak(utter);
  } catch {
    // ignore
  }
}
