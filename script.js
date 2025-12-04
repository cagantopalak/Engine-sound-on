      const startBtn = document.getElementById("startBtn");
      const interfaceDiv = document.getElementById("interface");
      const overlay = document.getElementById("overlay");
      const throttleInput = document.getElementById("throttle");
      const valDisplay = document.getElementById("valDisplay");
      const bgContainer = document.getElementById("bgContainer");
      const uiLayer = document.getElementById("uiLayer");

      let audioCtx;
      let carrier, modulator, modulatorGain, masterGain;
      let currentThrottleVal = 0;
      let frameCount = 0; // To track time for cycling colors

      function initAudio() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(audioCtx.destination);

        carrier = audioCtx.createOscillator();
        carrier.type = "triangle";
        carrier.frequency.value = 100;

        modulator = audioCtx.createOscillator();
        modulator.type = "sine";
        modulator.frequency.value = 15;

        modulatorGain = audioCtx.createGain();
        modulatorGain.gain.value = 500;

        modulator.connect(modulatorGain);
        modulatorGain.connect(carrier.frequency);
        carrier.connect(masterGain);

        carrier.start();
        modulator.start();

        overlay.style.display = "none";
        interfaceDiv.style.display = "block";

        requestAnimationFrame(visualLoop);
        throttleInput.value = 0;
        updateEngine(0);
      }

      function updateEngine(value) {
        const val = parseFloat(value);
        currentThrottleVal = val;

        valDisplay.innerText = val.toFixed(2);

        if (!audioCtx) return;
        const now = audioCtx.currentTime;

        // Audio Logic (Same as before)
        let targetVolume = val > 0.01 ? 0.5 : 0;
        const baseFreq = 100 + val * 600; // Slightly higher pitch cap
        const wobbleSpeed = 15 + val * 35;

        masterGain.gain.setTargetAtTime(targetVolume, now, 0.1);
        carrier.frequency.setTargetAtTime(baseFreq, now, 0.1);
        modulator.frequency.setTargetAtTime(wobbleSpeed, now, 0.1);
      }

      // --- THE "ACID" LOOP ---
      function visualLoop() {
        frameCount++;

        if (currentThrottleVal > 0) {
          // 1. SHAKE CALCULATION
          // At max throttle, shake is 40px (Extreme)
          const shakeIntensity = currentThrottleVal * 40;

          // 2. ROTATION CALCULATION
          // Screen tilts left and right dramatically at high speed
          // Uses Sine wave to create a "dizzy" swaying motion
          const rotation =
            Math.sin(frameCount * 0.1) * (currentThrottleVal * 15);

          // 3. ZOOM / PULSE
          // Screen pulses in and out
          const scale =
            1 +
            currentThrottleVal * 0.2 +
            Math.sin(frameCount * 0.5) * (currentThrottleVal * 0.05);

          const randomX = (Math.random() - 0.5) * shakeIntensity;
          const randomY = (Math.random() - 0.5) * shakeIntensity;

          // 4. COLOR PSYCHEDELICS (CSS Filters)
          // Hue Rotate: Spins the color wheel based on speed
          // Saturation: Goes from 100% to 500% (Fried colors)
          // Contrast: Increases to make it look sharp/intense
          const hueSpeed = frameCount * (currentThrottleVal * 10); // Spins faster at high throttle
          const saturation = 100 + currentThrottleVal * 400;
          const contrast = 100 + currentThrottleVal * 50;

          // Apply to Background
          bgContainer.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${rotation}deg) scale(${scale})`;
          bgContainer.style.filter = `hue-rotate(${hueSpeed}deg) saturate(${saturation}%) contrast(${contrast}%)`;

          // Apply separate, slightly different shake to UI so it feels detached/floating
          const uiShake = currentThrottleVal * 10;
          const uiX = (Math.random() - 0.5) * uiShake;
          const uiY = (Math.random() - 0.5) * uiShake;
          uiLayer.style.transform = `translate(${uiX}px, ${uiY}px)`;
        } else {
          // Reset to calm state
          bgContainer.style.transform = `translate(0px, 0px) rotate(0deg) scale(1)`;
          bgContainer.style.filter = `hue-rotate(0deg) saturate(100%) contrast(100%)`;
          uiLayer.style.transform = `translate(0px, 0px)`;
        }

        requestAnimationFrame(visualLoop);
      }

      startBtn.addEventListener("click", () => {
        initAudio();
      });

      throttleInput.addEventListener("input", (e) => {
        updateEngine(e.target.value);
      });