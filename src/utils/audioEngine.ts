/**
 * Procedural Web Audio Engine for "Ma" (間)
 * Pure synthesized organic acoustic tones (singing bowl, rainfall, wind in grass, gentle stream).
 * No external audio files or network dependencies required.
 */

class MaAudioEngine {
  private ctx: AudioContext | null = null;
  private activeAmbientNodes: { [key: string]: AudioNode[] } = {};
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.7;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.1);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Resonant Tibetan / Zen Singing Bowl Chime
   * Generates fundamental and harmonic overtones with natural exponential dampening
   */
  public playSingingBowl(freq: number = 261.63, duration: number = 5.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Harmonic frequencies typical of bronze singing bowls
    const harmonics = [
      { ratio: 1.0, gain: 0.6, decay: duration },
      { ratio: 2.76, gain: 0.35, decay: duration * 0.8 },
      { ratio: 5.4, gain: 0.18, decay: duration * 0.55 },
      { ratio: 8.93, gain: 0.08, decay: duration * 0.4 },
    ];

    harmonics.forEach(({ ratio, gain, decay }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, now);

      // Subtle warm pitch vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(2.5, now);
      lfoGain.gain.setValueAtTime(0.8, now);
      lfo.connect(osc.frequency);
      lfo.start(now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(gain * 0.4, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
      lfo.stop(now + decay + 0.1);
    });
  }

  /**
   * Soft Wind in Prairie Grass
   */
  public startWind(): () => void {
    this.initContext();
    if (!this.ctx || !this.masterGain) return () => {};

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft low-frequency wind
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    // LFO to simulate gentle gusts
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // ~5.5s cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(filter.frequency);

    const ambientGain = this.ctx.createGain();
    ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    return () => {
      if (!this.ctx) return;
      ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        try {
          whiteNoise.stop();
          lfo.stop();
          whiteNoise.disconnect();
          filter.disconnect();
        } catch (_) {}
      }, 1300);
    };
  }

  /**
   * Eaves Rain Drops & Gentle Downpour
   */
  public startRain(): () => void {
    this.initContext();
    if (!this.ctx || !this.masterGain) return () => {};

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    rainGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);
    whiteNoise.start();

    // Occasional individual drop transient
    const dropInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      dropOsc.type = 'sine';
      const startF = 1200 + Math.random() * 800;
      dropOsc.frequency.setValueAtTime(startF, now);
      dropOsc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

      dropGain.gain.setValueAtTime(0.05, now);
      dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      dropOsc.connect(dropGain);
      dropGain.connect(this.masterGain);
      dropOsc.start(now);
      dropOsc.stop(now + 0.1);
    }, 450 + Math.random() * 400);

    return () => {
      clearInterval(dropInterval);
      if (!this.ctx) return;
      rainGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
          filter.disconnect();
        } catch (_) {}
      }, 1300);
    };
  }

  /**
   * Mountain Brook / Quiet Water Stream
   */
  public startStream(): () => void {
    this.initContext();
    if (!this.ctx || !this.masterGain) return () => {};

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter1.Q.setValueAtTime(3.5, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 2);

    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(gain);
    gain.connect(this.masterGain);

    noise.start();

    return () => {
      if (!this.ctx) return;
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        try {
          noise.stop();
          noise.disconnect();
        } catch (_) {}
      }, 1300);
    };
  }

  /**
   * Summer Night Crickets / Distant Birds
   */
  public startCrickets(): () => void {
    this.initContext();
    if (!this.ctx || !this.masterGain) return () => {};

    const cricketInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      // 3 rapid micro pulses
      for (let p = 0; p < 3; p++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4600 + Math.random() * 200, now + p * 0.04);
        gain.gain.setValueAtTime(0.001, now + p * 0.04);
        gain.gain.linearRampToValueAtTime(0.025, now + p * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p * 0.04 + 0.035);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + p * 0.04);
        osc.stop(now + p * 0.04 + 0.04);
      }
    }, 1800 + Math.random() * 600);

    return () => {
      clearInterval(cricketInterval);
    };
  }

  /**
   * Warm Hearth / Fireplace Subtle Crackle
   */
  public startFireplace(): () => void {
    this.initContext();
    if (!this.ctx || !this.masterGain) return () => {};

    // Soft bed of warm low rumble
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    // Random pops and crackles
    const popInterval = setInterval(() => {
      if (!this.ctx || !this.masterGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(140 + Math.random() * 180, now);
      popGain.gain.setValueAtTime(0.04, now);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      popOsc.connect(popGain);
      popGain.connect(this.masterGain);
      popOsc.start(now);
      popOsc.stop(now + 0.05);
    }, 600 + Math.random() * 800);

    return () => {
      clearInterval(popInterval);
      if (!this.ctx) return;
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
      setTimeout(() => {
        try {
          noise.stop();
          noise.disconnect();
          filter.disconnect();
        } catch (_) {}
      }, 1100);
    };
  }
}

export const soundEngine = new MaAudioEngine();
