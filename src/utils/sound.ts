// Soft harmonic Web Audio synthesizer designed specifically for low-arousal sensory cueing (432Hz / 528Hz sine waves with slow attack/release)
export function playGentleSensoryChime(type: 'chime' | 'breath' | 'confirm' = 'chime') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';

    if (type === 'chime') {
      // Gentle two-note ascending fifth (C4 -> G4 in soft tuning)
      osc.frequency.setValueAtTime(256, now);
      osc.frequency.exponentialRampToValueAtTime(384, now + 0.65);
    } else if (type === 'breath') {
      osc.frequency.setValueAtTime(216, now);
      osc.frequency.exponentialRampToValueAtTime(288, now + 0.9);
    } else {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(426, now + 0.35);
    }

    // Slow attack and release to avoid auditory startle reflex (crucial for TEA Level 2)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.45);
  } catch {
    // AudioContext blocked or unsupported
  }
}

