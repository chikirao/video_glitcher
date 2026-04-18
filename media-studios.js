"use strict";

(function () {
  const IMAGE_DEFAULTS = {
    mode: "hybrid",
    intensity: 20,
    density: 12,
    chunkSize: 4,
    focus: 52,
    guard: 90,
    seed: 241,
    autoHeal: true
  };

  const IMAGE_PRESETS = {
    jpegFracture: {
      mode: "bitflip",
      intensity: 26,
      density: 18,
      chunkSize: 5,
      focus: 48,
      guard: 88
    },
    scanDrift: {
      mode: "scan-jump",
      intensity: 42,
      density: 26,
      chunkSize: 10,
      focus: 56,
      guard: 80
    },
    paletteBruise: {
      mode: "shuffle",
      intensity: 34,
      density: 28,
      chunkSize: 8,
      focus: 50,
      guard: 84
    },
    crcPanic: {
      mode: "xor",
      intensity: 52,
      density: 32,
      chunkSize: 10,
      focus: 64,
      guard: 74
    },
    jpegCollapse: {
      mode: "jpeg-crush",
      intensity: 68,
      density: 58,
      chunkSize: 14,
      focus: 54,
      guard: 42
    }
  };

  const AUDIO_DEFAULTS = {
    mode: "hybrid",
    intensity: 36,
    density: 28,
    chunkSize: 10,
    focus: 48,
    guard: 66,
    seed: 517,
    limiter: true
  };

  const AUDIO_PRESETS = {
    tapeRuin: {
      mode: "tape",
      intensity: 58,
      density: 34,
      chunkSize: 16,
      focus: 48,
      guard: 58
    },
    bufferSkip: {
      mode: "stutter",
      intensity: 66,
      density: 52,
      chunkSize: 18,
      focus: 54,
      guard: 46
    },
    vhsWhine: {
      mode: "dropout",
      intensity: 54,
      density: 40,
      chunkSize: 12,
      focus: 50,
      guard: 52
    },
    pcmBruise: {
      mode: "bytebend",
      intensity: 46,
      density: 26,
      chunkSize: 12,
      focus: 46,
      guard: 70
    }
  };

  let sharedAudioContext = null;
  let pngCrcTable = null;

  window.createPhotoStudio = function createPhotoStudio() {
    const api = getSharedApi();
    const elements = {
      fileInput: document.getElementById("photoFileInput"),
      previewPanel: document.getElementById("photoPreviewPanel"),
      dropZone: document.getElementById("photoDropZone"),
      dropOverlay: document.getElementById("photoDropOverlay"),
      shell: document.getElementById("photoShell"),
      fileLabel: document.getElementById("photoFileLabel"),
      formatBadge: document.getElementById("photoFormatBadge"),
      strategyBadge: document.getElementById("photoStrategyBadge"),
      pipelineBadge: document.getElementById("photoPipelineBadge"),
      decodeStatus: document.getElementById("photoDecodeStatus"),
      previewImage: document.getElementById("photoPreviewImage"),
      originalImage: document.getElementById("photoOriginalImage"),
      mutationCanvas: document.getElementById("photoMutationCanvas"),
      mutatedBytesLabel: document.getElementById("photoMutatedBytesLabel"),
      renderLatencyLabel: document.getElementById("photoRenderLatencyLabel"),
      mutableBytesValue: document.getElementById("photoMutableBytesValue"),
      riskValue: document.getElementById("photoRiskValue"),
      operationsValue: document.getElementById("photoOperationsValue"),
      recoveryValue: document.getElementById("photoRecoveryValue"),
      statusLine: document.getElementById("photoStatusLine"),
      randomizeButton: document.getElementById("photoRandomizeButton"),
      exportButton: document.getElementById("photoExportButton"),
      exportProgress: document.querySelector("#photoExportButton .export-button-progress"),
      exportLabelBase: document.getElementById("photoExportButtonLabelBase"),
      exportLabelFill: document.getElementById("photoExportButtonLabelFill"),
      exportFormatSelect: document.getElementById("photoExportFormatSelect"),
      modeInput: document.getElementById("photoModeInput"),
      seedInput: document.getElementById("photoSeedInput"),
      rerollSeedButton: document.getElementById("photoRerollSeedButton"),
      intensityInput: document.getElementById("photoIntensityInput"),
      intensityOutput: document.getElementById("photoIntensityOutput"),
      densityInput: document.getElementById("photoDensityInput"),
      densityOutput: document.getElementById("photoDensityOutput"),
      chunkSizeInput: document.getElementById("photoChunkSizeInput"),
      chunkSizeOutput: document.getElementById("photoChunkSizeOutput"),
      focusInput: document.getElementById("photoFocusInput"),
      focusOutput: document.getElementById("photoFocusOutput"),
      guardInput: document.getElementById("photoGuardInput"),
      guardOutput: document.getElementById("photoGuardOutput"),
      autoHealToggle: document.getElementById("photoAutoHealToggle"),
      presetButtons: Array.from(document.querySelectorAll("[data-photo-preset]"))
    };

    if (!elements.fileInput) {
      return {
        refreshLocalizedText: function () {},
        pausePlayers: function () {}
      };
    }

    const state = {
      sourceFile: null,
      originalBytes: null,
      originalUrl: "",
      previewUrl: "",
      analysis: null,
      recoveries: 0,
      exportInProgress: false,
      lastResult: null,
      scheduledRenderId: 0,
      renderRequestId: 0,
      dragDepth: 0,
      decodeStatusKey: "standby",
      decodeStatusLevel: "idle",
      statusLineKey: "photoDefaultStatusLine",
      statusLineValues: null
    };

    const progress = createButtonProgressController({
      button: elements.exportButton,
      progress: elements.exportProgress,
      labelBase: elements.exportLabelBase,
      labelFill: elements.exportLabelFill,
      labelKey: "renderPhoto"
    });

    init();

    return {
      refreshLocalizedText: refreshLocalizedText,
      pausePlayers: function () {}
    };

    function init() {
      syncSettingsUi();
      bindControls();
      resetSession();
    }

    function bindControls() {
      elements.fileInput.addEventListener("change", function (event) {
        const file = event.target.files && event.target.files[0];
        if (file) {
          loadFile(file);
        }
      });

      elements.randomizeButton.addEventListener("click", function () {
        clearActivePreset(elements.presetButtons);
        applySettings({
          mode: ["hybrid", "bitflip", "xor", "shuffle", "scan-jump", "jpeg-crush"][api.randomInteger(0, 6)],
          intensity: api.randomInteger(18, 68),
          density: api.randomInteger(10, 46),
          chunkSize: api.randomInteger(2, 16),
          focus: api.randomInteger(20, 82),
          guard: api.randomInteger(42, 94),
          seed: api.randomInteger(100, 999999)
        });
      });

      elements.rerollSeedButton.addEventListener("click", function () {
        clearActivePreset(elements.presetButtons);
        elements.seedInput.value = String(api.randomInteger(100, 999999));
        syncSettingsUi();
        scheduleRender(false);
      });

      [
        elements.modeInput,
        elements.seedInput,
        elements.intensityInput,
        elements.densityInput,
        elements.chunkSizeInput,
        elements.focusInput,
        elements.guardInput
      ].forEach(function (input) {
        input.addEventListener("input", function () {
          clearActivePreset(elements.presetButtons);
          syncSettingsUi();
          scheduleRender(false);
        });
      });

      elements.autoHealToggle.addEventListener("change", function () {
        clearActivePreset(elements.presetButtons);
        scheduleRender(false);
      });

      elements.presetButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          const preset = IMAGE_PRESETS[button.dataset.photoPreset || ""];
          if (preset) {
            setActivePreset(elements.presetButtons, button.dataset.photoPreset || "");
            applySettings(Object.assign({ seed: api.randomInteger(100, 999999) }, preset));
          }
        });
      });

      elements.exportButton.addEventListener("click", exportRender);

      bindDropZone({
        panel: elements.previewPanel,
        dropZone: elements.dropZone,
        overlay: elements.dropOverlay,
        hasFile: function () {
          return Boolean(state.sourceFile);
        },
        extractFile: function (event) {
          const file = getDroppedFile(event);
          return file && isImageFile(file) ? file : null;
        },
        onDropFile: loadFile,
        onInvalidDrop: function () {
          setStatusLine("photoFileRequired");
        },
        onDragDepthChange: function (depth) {
          state.dragDepth = depth;
        }
      });
    }

    function refreshLocalizedText() {
      progress.syncLabel();
      elements.decodeStatus.textContent = api.translate(state.decodeStatusKey);
      elements.decodeStatus.className = "decode-status decode-status-" + state.decodeStatusLevel;
      elements.statusLine.textContent = api.translate(state.statusLineKey, state.statusLineValues);
      if (!state.sourceFile) {
        elements.fileLabel.textContent = api.translate("noPhotoLoaded");
      }
      if (!state.analysis) {
        elements.formatBadge.textContent = api.translate("formatStandby");
        elements.strategyBadge.textContent = api.translate("strategyIdle");
      }
      elements.riskValue.textContent = api.localizeRiskLabel(elements.riskValue.dataset.riskLabel || "low");
      updateExportButtonState();
    }

    function resetSession() {
      window.clearTimeout(state.scheduledRenderId);
      state.renderRequestId += 1;
      state.sourceFile = null;
      state.originalBytes = null;
      state.analysis = null;
      state.lastResult = null;
      state.recoveries = 0;
      state.dragDepth = 0;
      state.statusLineKey = "photoDefaultStatusLine";
      state.statusLineValues = null;
      state.decodeStatusKey = "standby";
      state.decodeStatusLevel = "idle";
      revokeUrl(state.previewUrl);
      revokeUrl(state.originalUrl);
      state.previewUrl = "";
      state.originalUrl = "";
      elements.previewImage.removeAttribute("src");
      elements.originalImage.removeAttribute("src");
      elements.shell.classList.add("hidden");
      elements.dropZone.classList.remove("hidden", "is-over");
      elements.dropOverlay.classList.remove("is-active");
      elements.fileLabel.textContent = api.translate("noPhotoLoaded");
      elements.formatBadge.textContent = api.translate("formatStandby");
      elements.strategyBadge.textContent = api.translate("strategyIdle");
      elements.pipelineBadge.textContent = "render: binary + canvas";
      elements.mutableBytesValue.textContent = "0 B";
      elements.riskValue.dataset.riskLabel = "low";
      elements.riskValue.textContent = api.localizeRiskLabel("low");
      elements.operationsValue.textContent = "0";
      elements.recoveryValue.textContent = "0";
      elements.mutatedBytesLabel.textContent = api.translate("bytesTouched", { value: "0 B" });
      elements.renderLatencyLabel.textContent = "0 ms";
      api.drawMutationMap([], elements.mutationCanvas);
      clearActivePreset(elements.presetButtons);
      refreshLocalizedText();
      progress.reset();
    }

    function setDecodeStatus(key, level) {
      state.decodeStatusKey = key;
      state.decodeStatusLevel = level;
      elements.decodeStatus.textContent = api.translate(key);
      elements.decodeStatus.className = "decode-status decode-status-" + level;
    }

    function setStatusLine(key, values) {
      state.statusLineKey = key;
      state.statusLineValues = values || null;
      elements.statusLine.textContent = api.translate(key, values);
    }

    function syncSettingsUi() {
      elements.intensityOutput.value = elements.intensityInput.value;
      elements.densityOutput.value = elements.densityInput.value;
      elements.chunkSizeOutput.value = elements.chunkSizeInput.value;
      elements.focusOutput.value = elements.focusInput.value;
      elements.guardOutput.value = elements.guardInput.value;
    }

    function getSettings() {
      return {
        mode: elements.modeInput.value || IMAGE_DEFAULTS.mode,
        seed: Number(elements.seedInput.value) || IMAGE_DEFAULTS.seed,
        intensity: Number(elements.intensityInput.value) || IMAGE_DEFAULTS.intensity,
        density: Number(elements.densityInput.value) || IMAGE_DEFAULTS.density,
        chunkSize: Number(elements.chunkSizeInput.value) || IMAGE_DEFAULTS.chunkSize,
        focus: Number(elements.focusInput.value) || IMAGE_DEFAULTS.focus,
        guard: Number(elements.guardInput.value) || IMAGE_DEFAULTS.guard,
        autoHeal: elements.autoHealToggle.checked
      };
    }

    function applySettings(settingsPatch) {
      const next = Object.assign({}, getSettings(), settingsPatch || {});
      elements.modeInput.value = next.mode;
      elements.seedInput.value = String(next.seed);
      elements.intensityInput.value = String(next.intensity);
      elements.densityInput.value = String(next.density);
      elements.chunkSizeInput.value = String(next.chunkSize);
      elements.focusInput.value = String(next.focus);
      elements.guardInput.value = String(next.guard);
      elements.autoHealToggle.checked = next.autoHeal;
      syncSettingsUi();
      scheduleRender(true);
    }

    async function loadFile(file) {
      if (!isImageFile(file)) {
        setStatusLine("photoFileRequired");
        return;
      }

      resetSession();
      state.sourceFile = file;
      elements.fileLabel.textContent = file.name;
      elements.shell.classList.remove("hidden");
      elements.dropZone.classList.add("hidden");
      setDecodeStatus("photoRendering", "idle");
      setStatusLine("photoReadingFile");
      updateExportButtonState();

      state.originalUrl = URL.createObjectURL(file);
      elements.originalImage.src = state.originalUrl;
      elements.previewImage.src = state.originalUrl;

      const arrayBuffer = await file.arrayBuffer();
      state.originalBytes = new Uint8Array(arrayBuffer);
      state.analysis = analyzeImageBytes(state.originalBytes, file.type, file.name);
      updateAnalysisUi();
      scheduleRender(true);
    }

    function updateAnalysisUi() {
      if (!state.analysis) {
        return;
      }

      elements.formatBadge.textContent = "format: " + (state.analysis.format || "UNKNOWN").toUpperCase();
      elements.strategyBadge.textContent = "strategy: " + (state.analysis.strategyLabel || "binary");
      elements.pipelineBadge.textContent = "render: " + state.analysis.renderLabel;
      elements.mutableBytesValue.textContent = api.formatBytes(state.analysis.totalMutableBytes || 0);
      setStatusLine("photoAnalysisComplete", {
        bytes: api.formatBytes(state.analysis.totalMutableBytes || 0),
        ranges: String(state.analysis.rangeCount || 0)
      });
    }

    function scheduleRender(immediate) {
      if (!state.sourceFile || !state.analysis || !state.originalBytes) {
        return;
      }

      window.clearTimeout(state.scheduledRenderId);
      state.scheduledRenderId = window.setTimeout(function () {
        renderPreview(0);
      }, immediate ? 0 : 160);
    }

    function getRecoveredSettings(recoveryLevel) {
      const current = getSettings();
      const factor = 1 / (1 + recoveryLevel * 0.28);
      current.intensity = Math.max(2, Math.round(current.intensity * factor));
      current.density = Math.max(2, Math.round(current.density * factor));
      current.chunkSize = Math.max(1, Math.round(current.chunkSize * factor));
      current.guard = Math.min(98, current.guard + recoveryLevel * 6);
      return current;
    }

    async function renderPreview(recoveryLevel) {
      if (!state.sourceFile || !state.analysis || !state.originalBytes) {
        return;
      }

      const requestId = ++state.renderRequestId;
      const settings = getRecoveredSettings(recoveryLevel);
      const startedAt = performance.now();
      setDecodeStatus("photoRendering", "idle");
      setStatusLine("photoRendering");

      let result;
      try {
        result = await renderImagePreviewResult(
          state.originalBytes,
          state.analysis,
          settings,
          api,
          state.originalUrl
        );
      } catch (error) {
        handlePreviewFailure(requestId, recoveryLevel);
        return;
      }

      const previewBlob = result.previewBlob || new Blob([result.bytes], {
        type: state.analysis.preferredMime || state.sourceFile.type || "image/jpeg"
      });
      const previewUrl = URL.createObjectURL(previewBlob);

      setDecodeStatus("photoVerifying", "warning");
      setStatusLine("photoVerifying");

      verifyImageUrl(previewUrl).then(function () {
        if (requestId !== state.renderRequestId) {
          URL.revokeObjectURL(previewUrl);
          return;
        }

        revokeUrl(state.previewUrl);
        state.previewUrl = previewUrl;
        state.lastResult = {
          bytes: result.bytes || null,
          blob: previewBlob,
          meta: {
            elapsedMs: Math.round(performance.now() - startedAt),
            mutatedBytes: result.mutatedBytes,
            operations: result.operations,
            riskLabel: result.riskLabel,
            mapBins: result.mapBins
          }
        };
        state.recoveries = recoveryLevel;

        elements.previewImage.src = previewUrl;
        elements.mutatedBytesLabel.textContent = api.translate("bytesTouched", {
          value: api.formatBytes(result.mutatedBytes || 0)
        });
        elements.renderLatencyLabel.textContent = String(state.lastResult.meta.elapsedMs) + " ms";
        elements.strategyBadge.textContent = "strategy: " + (result.strategyLabel || state.analysis.strategyLabel || "binary");
        elements.pipelineBadge.textContent = "render: " + (result.renderLabel || state.analysis.renderLabel || "binary + canvas");
        elements.operationsValue.textContent = String(result.operations || 0);
        elements.riskValue.dataset.riskLabel = result.riskLabel || "low";
        elements.riskValue.textContent = api.localizeRiskLabel(result.riskLabel || "low");
        elements.recoveryValue.textContent = String(state.recoveries);
        api.drawMutationMap(result.mapBins || [], elements.mutationCanvas);
        setDecodeStatus("photoPreviewReady", "live");
        setStatusLine("newRenderAssembled", {
          operations: String(result.operations || 0),
          risk: api.localizeRiskLabel(result.riskLabel || "low")
        });
        updateExportButtonState();
      }).catch(function () {
        URL.revokeObjectURL(previewUrl);
        handlePreviewFailure(requestId, recoveryLevel);
      });
    }

    function handlePreviewFailure(requestId, recoveryLevel) {
      if (requestId !== state.renderRequestId) {
        return;
      }

      if (getSettings().autoHeal && recoveryLevel < 3) {
        state.recoveries = recoveryLevel + 1;
        elements.recoveryValue.textContent = String(state.recoveries);
        setDecodeStatus("photoRetrying", "warning");
        setStatusLine("photoRetrying");
        renderPreview(recoveryLevel + 1);
        return;
      }

      setDecodeStatus("photoPreviewDecodeFailed", "error");
      setStatusLine("photoPreviewDecodeFailed");
      updateExportButtonState();
    }

    async function exportRender() {
      if (!state.previewUrl || state.exportInProgress) {
        return;
      }

      state.exportInProgress = true;
      updateExportButtonState();
      progress.start(820);

      try {
        const exportMeta = resolveImageExportMeta(elements.exportFormatSelect.value, state.sourceFile);
        const image = await loadImageElement(state.previewUrl);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: false });

        canvas.width = image.naturalWidth || image.width || 2;
        canvas.height = image.naturalHeight || image.height || 2;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const renderedBlob = await canvasToBlob(canvas, exportMeta.mimeType, exportMeta.quality);
        api.downloadBlob(renderedBlob, buildRenderedFileName(state.sourceFile.name, "-rendered-photo-", exportMeta.extension, getSettings()));
        setStatusLine("photoRenderSaved");
        await progress.finish();
      } catch (error) {
        setStatusLine("photoRenderFailed");
      } finally {
        state.exportInProgress = false;
        progress.reset();
        updateExportButtonState();
      }
    }

    function updateExportButtonState() {
      elements.exportButton.disabled = state.exportInProgress || !state.previewUrl;
    }
  };

  window.createAudioStudio = function createAudioStudio() {
    const api = getSharedApi();
    const elements = {
      fileInput: document.getElementById("audioFileInput"),
      previewPanel: document.getElementById("audioPreviewPanel"),
      dropZone: document.getElementById("audioDropZone"),
      dropOverlay: document.getElementById("audioDropOverlay"),
      shell: document.getElementById("audioShell"),
      fileLabel: document.getElementById("audioFileLabel"),
      formatBadge: document.getElementById("audioFormatBadge"),
      strategyBadge: document.getElementById("audioStrategyBadge"),
      pipelineBadge: document.getElementById("audioPipelineBadge"),
      decodeStatus: document.getElementById("audioDecodeStatus"),
      previewPlayer: document.getElementById("audioPreviewPlayer"),
      originalPlayer: document.getElementById("audioOriginalPlayer"),
      previewWaveform: document.getElementById("audioPreviewWaveform"),
      originalWaveform: document.getElementById("audioOriginalWaveform"),
      mutationCanvas: document.getElementById("audioMutationCanvas"),
      mutatedBytesLabel: document.getElementById("audioMutatedBytesLabel"),
      renderLatencyLabel: document.getElementById("audioRenderLatencyLabel"),
      durationValue: document.getElementById("audioDurationValue"),
      sampleRateValue: document.getElementById("audioSampleRateValue"),
      operationsValue: document.getElementById("audioOperationsValue"),
      recoveryValue: document.getElementById("audioRecoveryValue"),
      statusLine: document.getElementById("audioStatusLine"),
      randomizeButton: document.getElementById("audioRandomizeButton"),
      exportButton: document.getElementById("audioExportButton"),
      exportProgress: document.querySelector("#audioExportButton .export-button-progress"),
      exportLabelBase: document.getElementById("audioExportButtonLabelBase"),
      exportLabelFill: document.getElementById("audioExportButtonLabelFill"),
      exportFormatSelect: document.getElementById("audioExportFormatSelect"),
      modeInput: document.getElementById("audioModeInput"),
      seedInput: document.getElementById("audioSeedInput"),
      rerollSeedButton: document.getElementById("audioRerollSeedButton"),
      intensityInput: document.getElementById("audioIntensityInput"),
      intensityOutput: document.getElementById("audioIntensityOutput"),
      densityInput: document.getElementById("audioDensityInput"),
      densityOutput: document.getElementById("audioDensityOutput"),
      chunkSizeInput: document.getElementById("audioChunkSizeInput"),
      chunkSizeOutput: document.getElementById("audioChunkSizeOutput"),
      focusInput: document.getElementById("audioFocusInput"),
      focusOutput: document.getElementById("audioFocusOutput"),
      guardInput: document.getElementById("audioGuardInput"),
      guardOutput: document.getElementById("audioGuardOutput"),
      limiterToggle: document.getElementById("audioLimiterToggle"),
      loopToggle: document.getElementById("audioLoopToggle"),
      presetButtons: Array.from(document.querySelectorAll("[data-audio-preset]"))
    };

    if (!elements.fileInput) {
      return {
        refreshLocalizedText: function () {},
        pausePlayers: function () {}
      };
    }

    const state = {
      sourceFile: null,
      sourceBytes: null,
      sourceBuffer: null,
      renderBuffer: null,
      renderBlob: null,
      renderUrl: "",
      originalUrl: "",
      wavInfo: null,
      recoveries: 0,
      exportInProgress: false,
      scheduledRenderId: 0,
      renderRequestId: 0,
      dragDepth: 0,
      playbackMemory: null,
      decodeStatusKey: "standby",
      decodeStatusLevel: "idle",
      statusLineKey: "audioDefaultStatusLine",
      statusLineValues: null
    };

    const progress = createButtonProgressController({
      button: elements.exportButton,
      progress: elements.exportProgress,
      labelBase: elements.exportLabelBase,
      labelFill: elements.exportLabelFill,
      labelKey: "renderAudio"
    });

    init();

    return {
      refreshLocalizedText: refreshLocalizedText,
      pausePlayers: pausePlayers
    };

    function init() {
      syncSettingsUi();
      bindControls();
      resetSession();
    }

    function bindControls() {
      elements.fileInput.addEventListener("change", function (event) {
        const file = event.target.files && event.target.files[0];
        if (file) {
          loadFile(file);
        }
      });

      elements.randomizeButton.addEventListener("click", function () {
        clearActivePreset(elements.presetButtons);
        applySettings({
          mode: ["hybrid", "tape", "stutter", "bitcrush", "dropout", "bytebend"][api.randomInteger(0, 6)],
          intensity: api.randomInteger(28, 82),
          density: api.randomInteger(18, 72),
          chunkSize: api.randomInteger(4, 22),
          focus: api.randomInteger(18, 82),
          guard: api.randomInteger(34, 82),
          seed: api.randomInteger(100, 999999)
        });
      });

      elements.rerollSeedButton.addEventListener("click", function () {
        clearActivePreset(elements.presetButtons);
        elements.seedInput.value = String(api.randomInteger(100, 999999));
        syncSettingsUi();
        scheduleRender(false);
      });

      [
        elements.modeInput,
        elements.seedInput,
        elements.intensityInput,
        elements.densityInput,
        elements.chunkSizeInput,
        elements.focusInput,
        elements.guardInput
      ].forEach(function (input) {
        input.addEventListener("input", function () {
          clearActivePreset(elements.presetButtons);
          syncSettingsUi();
          scheduleRender(false);
        });
      });

      elements.limiterToggle.addEventListener("change", function () {
        clearActivePreset(elements.presetButtons);
        scheduleRender(false);
      });

      elements.loopToggle.addEventListener("change", applyLoopState);
      ["timeupdate", "play", "seeked", "ratechange", "pause"].forEach(function (eventName) {
        elements.previewPlayer.addEventListener(eventName, function () {
          storeAudioPlaybackMemory(elements.previewPlayer, state);
        });
      });
      elements.previewPlayer.addEventListener("ended", function () {
        storeAudioPlaybackMemory(elements.previewPlayer, state, false);
      });

      elements.presetButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          const preset = AUDIO_PRESETS[button.dataset.audioPreset || ""];
          if (preset) {
            setActivePreset(elements.presetButtons, button.dataset.audioPreset || "");
            applySettings(Object.assign({ seed: api.randomInteger(100, 999999) }, preset));
          }
        });
      });

      elements.exportButton.addEventListener("click", exportRender);

      bindDropZone({
        panel: elements.previewPanel,
        dropZone: elements.dropZone,
        overlay: elements.dropOverlay,
        hasFile: function () {
          return Boolean(state.sourceFile);
        },
        extractFile: function (event) {
          const file = getDroppedFile(event);
          return file && isAudioFile(file) ? file : null;
        },
        onDropFile: loadFile,
        onInvalidDrop: function () {
          setStatusLine("audioFileRequired");
        },
        onDragDepthChange: function (depth) {
          state.dragDepth = depth;
        }
      });
    }

    function pausePlayers() {
      elements.previewPlayer.pause();
      elements.originalPlayer.pause();
    }

    function applyLoopState() {
      const shouldLoop = elements.loopToggle.checked;
      elements.previewPlayer.loop = shouldLoop;
      elements.originalPlayer.loop = shouldLoop;
    }

    function refreshLocalizedText() {
      progress.syncLabel();
      elements.decodeStatus.textContent = api.translate(state.decodeStatusKey);
      elements.decodeStatus.className = "decode-status decode-status-" + state.decodeStatusLevel;
      elements.statusLine.textContent = api.translate(state.statusLineKey, state.statusLineValues);
      if (!state.sourceFile) {
        elements.fileLabel.textContent = api.translate("noAudioLoaded");
      }
      if (!state.sourceBuffer) {
        elements.formatBadge.textContent = api.translate("formatStandby");
        elements.strategyBadge.textContent = api.translate("strategyIdle");
      }
      updateExportButtonState();
    }

    function resetSession() {
      window.clearTimeout(state.scheduledRenderId);
      state.renderRequestId += 1;
      state.sourceFile = null;
      state.sourceBytes = null;
      state.sourceBuffer = null;
      state.renderBuffer = null;
      state.renderBlob = null;
      state.wavInfo = null;
      state.recoveries = 0;
      state.dragDepth = 0;
      state.playbackMemory = null;
      state.statusLineKey = "audioDefaultStatusLine";
      state.statusLineValues = null;
      state.decodeStatusKey = "standby";
      state.decodeStatusLevel = "idle";
      revokeUrl(state.renderUrl);
      revokeUrl(state.originalUrl);
      state.renderUrl = "";
      state.originalUrl = "";
      elements.previewPlayer.removeAttribute("src");
      elements.originalPlayer.removeAttribute("src");
      delete elements.previewPlayer.dataset.renderRequestId;
      elements.previewPlayer.load();
      elements.originalPlayer.load();
      elements.shell.classList.add("hidden");
      elements.dropZone.classList.remove("hidden", "is-over");
      elements.dropOverlay.classList.remove("is-active");
      elements.fileLabel.textContent = api.translate("noAudioLoaded");
      elements.formatBadge.textContent = api.translate("formatStandby");
      elements.strategyBadge.textContent = api.translate("strategyIdle");
      elements.pipelineBadge.textContent = "render: offline audio";
      elements.durationValue.textContent = "0.00s";
      elements.sampleRateValue.textContent = "0 Hz";
      elements.operationsValue.textContent = "0";
      elements.recoveryValue.textContent = "0";
      elements.mutatedBytesLabel.textContent = "0 ops";
      elements.renderLatencyLabel.textContent = "0 ms";
      api.drawMutationMap([], elements.mutationCanvas);
      drawWaveform(elements.previewWaveform, null);
      drawWaveform(elements.originalWaveform, null);
      clearActivePreset(elements.presetButtons);
      refreshLocalizedText();
      progress.reset();
    }

    function setDecodeStatus(key, level) {
      state.decodeStatusKey = key;
      state.decodeStatusLevel = level;
      elements.decodeStatus.textContent = api.translate(key);
      elements.decodeStatus.className = "decode-status decode-status-" + level;
    }

    function setStatusLine(key, values) {
      state.statusLineKey = key;
      state.statusLineValues = values || null;
      elements.statusLine.textContent = api.translate(key, values);
    }

    function syncSettingsUi() {
      elements.intensityOutput.value = elements.intensityInput.value;
      elements.densityOutput.value = elements.densityInput.value;
      elements.chunkSizeOutput.value = elements.chunkSizeInput.value;
      elements.focusOutput.value = elements.focusInput.value;
      elements.guardOutput.value = elements.guardInput.value;
    }

    function getSettings() {
      return {
        mode: elements.modeInput.value || AUDIO_DEFAULTS.mode,
        seed: Number(elements.seedInput.value) || AUDIO_DEFAULTS.seed,
        intensity: Number(elements.intensityInput.value) || AUDIO_DEFAULTS.intensity,
        density: Number(elements.densityInput.value) || AUDIO_DEFAULTS.density,
        chunkSize: Number(elements.chunkSizeInput.value) || AUDIO_DEFAULTS.chunkSize,
        focus: Number(elements.focusInput.value) || AUDIO_DEFAULTS.focus,
        guard: Number(elements.guardInput.value) || AUDIO_DEFAULTS.guard,
        limiter: elements.limiterToggle.checked
      };
    }

    function applySettings(settingsPatch) {
      const next = Object.assign({}, getSettings(), settingsPatch || {});
      elements.modeInput.value = next.mode;
      elements.seedInput.value = String(next.seed);
      elements.intensityInput.value = String(next.intensity);
      elements.densityInput.value = String(next.density);
      elements.chunkSizeInput.value = String(next.chunkSize);
      elements.focusInput.value = String(next.focus);
      elements.guardInput.value = String(next.guard);
      elements.limiterToggle.checked = next.limiter;
      syncSettingsUi();
      scheduleRender(true);
    }

    async function loadFile(file) {
      if (!isAudioFile(file)) {
        setStatusLine("audioFileRequired");
        return;
      }

      resetSession();
      state.sourceFile = file;
      elements.fileLabel.textContent = file.name;
      elements.shell.classList.remove("hidden");
      elements.dropZone.classList.add("hidden");
      setDecodeStatus("audioRendering", "idle");
      setStatusLine("audioReadingFile");
      updateExportButtonState();

      state.originalUrl = URL.createObjectURL(file);
      elements.originalPlayer.src = state.originalUrl;
      elements.originalPlayer.load();
      applyLoopState();

      const arrayBuffer = await file.arrayBuffer();
      state.sourceBytes = new Uint8Array(arrayBuffer);
      state.wavInfo = analyzeWavFile(state.sourceBytes);

      try {
        state.sourceBuffer = await decodeAudioArrayBuffer(arrayBuffer);
      } catch (error) {
        setDecodeStatus("audioRenderFailed", "error");
        setStatusLine("audioRenderFailed");
        return;
      }

      elements.formatBadge.textContent = "format: " + detectAudioLabel(file, state.wavInfo);
      elements.strategyBadge.textContent = state.wavInfo ? "strategy: wav byte bend ready" : "strategy: offline dsp chain";
      elements.pipelineBadge.textContent = state.wavInfo ? "render: wav byte bend + wav" : "render: offline audio + wav";
      elements.durationValue.textContent = formatSeconds(state.sourceBuffer.duration || 0);
      elements.sampleRateValue.textContent = String(state.sourceBuffer.sampleRate || 0) + " Hz";
      drawWaveform(elements.originalWaveform, state.sourceBuffer);
      scheduleRender(true);
    }

    function scheduleRender(immediate) {
      if (!state.sourceBuffer) {
        return;
      }

      window.clearTimeout(state.scheduledRenderId);
      state.scheduledRenderId = window.setTimeout(function () {
        renderPreview(0);
      }, immediate ? 0 : 180);
    }

    function getRecoveredSettings(recoveryLevel) {
      const current = getSettings();
      const factor = 1 / (1 + recoveryLevel * 0.24);
      current.intensity = Math.max(6, Math.round(current.intensity * factor));
      current.density = Math.max(6, Math.round(current.density * factor));
      current.chunkSize = Math.max(2, Math.round(current.chunkSize * factor));
      current.guard = Math.min(94, current.guard + recoveryLevel * 6);
      return current;
    }

    async function renderPreview(recoveryLevel) {
      if (!state.sourceBuffer) {
        return;
      }

      const requestId = ++state.renderRequestId;
      const startedAt = performance.now();
      const playbackState = captureAudioPlaybackState(elements.previewPlayer, state.playbackMemory);
      setDecodeStatus("audioRendering", "idle");
      setStatusLine("audioRendering");

      try {
        const result = await renderAudioMutation(
          state.sourceBuffer,
          state.sourceBytes,
          state.wavInfo,
          getRecoveredSettings(recoveryLevel),
          api
        );

        if (requestId !== state.renderRequestId) {
          return;
        }

        state.recoveries = recoveryLevel;
        state.renderBuffer = result.audioBuffer;
        state.renderBlob = result.renderBlob;
        revokeUrl(state.renderUrl);
        state.renderUrl = URL.createObjectURL(result.renderBlob);

        elements.previewPlayer.dataset.renderRequestId = String(requestId);
        state.playbackMemory = restoreAudioPlaybackState(elements.previewPlayer, playbackState, requestId);
        elements.previewPlayer.src = state.renderUrl;
        elements.previewPlayer.load();
        applyLoopState();
        drawWaveform(elements.previewWaveform, result.audioBuffer);
        elements.mutatedBytesLabel.textContent = result.mutatedLabel;
        elements.renderLatencyLabel.textContent = String(Math.round(performance.now() - startedAt)) + " ms";
        elements.operationsValue.textContent = String(result.operations || 0);
        elements.recoveryValue.textContent = String(state.recoveries);
        api.drawMutationMap(result.mapBins || [], elements.mutationCanvas);
        elements.strategyBadge.textContent = "strategy: " + result.strategyLabel;
        setDecodeStatus("audioPreviewReady", "live");
        setStatusLine("audioPreviewReady");
        updateExportButtonState();
      } catch (error) {
        if (recoveryLevel < 2) {
          state.recoveries = recoveryLevel + 1;
          elements.recoveryValue.textContent = String(state.recoveries);
          setDecodeStatus("retryingRecovery", "warning");
          setStatusLine("audioRendering");
          renderPreview(recoveryLevel + 1);
          return;
        }

        setDecodeStatus("audioRenderFailed", "error");
        setStatusLine("audioRenderFailed");
      }
    }

    async function exportRender() {
      if (!state.renderBlob || state.exportInProgress) {
        return;
      }

      state.exportInProgress = true;
      updateExportButtonState();
      progress.start(820);

      try {
        const exportMeta = resolveAudioExportMeta(elements.exportFormatSelect.value);
        api.downloadBlob(state.renderBlob, buildRenderedFileName(state.sourceFile.name, "-rendered-audio-", exportMeta.extension, getSettings()));
        setStatusLine("audioRenderSaved");
        await progress.finish();
      } catch (error) {
        setStatusLine("audioRenderFailed");
      } finally {
        state.exportInProgress = false;
        progress.reset();
        updateExportButtonState();
      }
    }

    function updateExportButtonState() {
      elements.exportButton.disabled = state.exportInProgress || !state.renderBlob;
    }
  };

  function getSharedApi() {
    if (!window.GlitchyShared) {
      throw new Error("GlitchyShared API is unavailable");
    }

    return window.GlitchyShared;
  }

  function createButtonProgressController(config) {
    const button = config.button;
    const progress = config.progress;
    const labelBase = config.labelBase;
    const labelFill = config.labelFill;
    const labelKey = config.labelKey;
    const state = {
      rafId: 0,
      startedAt: 0,
      estimatedMs: 0,
      settleTimeoutId: 0,
      exitTimeoutId: 0
    };

    syncLabel();

    return {
      start: start,
      finish: finish,
      reset: reset,
      syncLabel: syncLabel
    };

    function syncLabel() {
      const text = getSharedApi().translate(labelKey);
      labelBase.textContent = text;
      labelFill.textContent = text;
      button.setAttribute("aria-label", text);
    }

    function start(estimatedMs) {
      reset();
      state.startedAt = performance.now();
      state.estimatedMs = Math.max(650, estimatedMs || 650);
      renderFrame(0, false);
      state.rafId = window.requestAnimationFrame(tick);
    }

    function tick(now) {
      const elapsed = Math.max(0, now - state.startedAt);
      const ratio = Math.min(0.96, elapsed / Math.max(650, state.estimatedMs));
      renderFrame(ratio, false);
      state.rafId = window.requestAnimationFrame(tick);
    }

    function renderFrame(ratio, complete) {
      const visualRatio = complete ? 1 : Math.max(0, Math.min(0.98, ratio));
      progress.style.transform = "scaleX(" + visualRatio + ")";
      labelFill.style.clipPath = "inset(0 " + Math.round((1 - visualRatio) * 100) + "% 0 0 round 999px)";
      progress.style.opacity = complete || visualRatio > 0 ? "1" : "0";
      labelFill.style.opacity = complete || visualRatio > 0 ? "1" : "0";
      button.classList.toggle("is-exporting", !complete && visualRatio > 0);
      button.classList.toggle("is-export-complete", !!complete);
    }

    function finish() {
      return new Promise(function (resolve) {
        if (state.rafId) {
          window.cancelAnimationFrame(state.rafId);
          state.rafId = 0;
        }

        renderFrame(1, true);
        state.settleTimeoutId = window.setTimeout(function () {
          button.classList.remove("is-exporting", "is-export-complete");
          button.classList.add("is-export-settling");
          state.exitTimeoutId = window.setTimeout(function () {
            button.classList.remove("is-export-settling");
            resolve();
          }, 240);
        }, 420);
      });
    }

    function reset() {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
      if (state.settleTimeoutId) {
        window.clearTimeout(state.settleTimeoutId);
        state.settleTimeoutId = 0;
      }
      if (state.exitTimeoutId) {
        window.clearTimeout(state.exitTimeoutId);
        state.exitTimeoutId = 0;
      }
      progress.style.transform = "scaleX(0)";
      progress.style.opacity = "0";
      labelFill.style.opacity = "0";
      labelFill.style.clipPath = "inset(0 100% 0 0 round 999px)";
      button.classList.remove("is-exporting", "is-export-complete", "is-export-settling");
      syncLabel();
    }
  }

  function bindDropZone(config) {
    const panel = config.panel;
    const dropZone = config.dropZone;
    const overlay = config.overlay;
    let dragDepth = 0;

    panel.addEventListener("dragenter", function (event) {
      if (!isFileDrag(event)) {
        return;
      }
      event.preventDefault();
      dragDepth += 1;
      config.onDragDepthChange(dragDepth);
      if (config.hasFile()) {
        overlay.classList.add("is-active");
      } else {
        dropZone.classList.add("is-over");
      }
    });

    panel.addEventListener("dragover", function (event) {
      if (!isFileDrag(event)) {
        return;
      }
      event.preventDefault();
      if (config.hasFile()) {
        overlay.classList.add("is-active");
      } else {
        dropZone.classList.add("is-over");
      }
    });

    panel.addEventListener("dragleave", function (event) {
      if (!isFileDrag(event)) {
        return;
      }
      event.preventDefault();
      dragDepth = Math.max(0, dragDepth - 1);
      config.onDragDepthChange(dragDepth);
      if (dragDepth === 0) {
        dropZone.classList.remove("is-over");
        overlay.classList.remove("is-active");
      }
    });

    panel.addEventListener("drop", function (event) {
      if (!isFileDrag(event)) {
        return;
      }
      event.preventDefault();
      dragDepth = 0;
      config.onDragDepthChange(dragDepth);
      dropZone.classList.remove("is-over");
      overlay.classList.remove("is-active");
      const file = config.extractFile(event);
      if (file) {
        config.onDropFile(file);
      } else {
        config.onInvalidDrop();
      }
    });
  }

  function setActivePreset(buttons, presetId) {
    buttons.forEach(function (button) {
      const isActive = (button.dataset.photoPreset || button.dataset.audioPreset || "") === presetId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function clearActivePreset(buttons) {
    buttons.forEach(function (button) {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
  }

  function storeAudioPlaybackMemory(player, holder, resumeOverride) {
    if (!player.currentSrc || player.readyState < 1 || !Number.isFinite(player.duration) || player.duration <= 0) {
      return;
    }

    holder.playbackMemory = readPlayerPlaybackState(player, resumeOverride);
  }

  function readPlayerPlaybackState(player, resumeOverride) {
    return {
      time: Number.isFinite(player.currentTime) ? player.currentTime : 0,
      resume: typeof resumeOverride === "boolean" ? resumeOverride : (!player.paused && !player.ended),
      playbackRate: player.playbackRate || 1,
      stamp: performance.now()
    };
  }

  function projectPlaybackState(snapshot, now) {
    if (!snapshot) {
      return null;
    }

    const targetNow = typeof now === "number" ? now : performance.now();
    const rate = snapshot.playbackRate || 1;
    const elapsedSeconds = snapshot.resume
      ? Math.max(0, targetNow - (snapshot.stamp || targetNow)) / 1000 * rate
      : 0;

    return {
      time: Math.max(0, snapshot.time + elapsedSeconds),
      resume: !!snapshot.resume,
      playbackRate: rate,
      stamp: targetNow
    };
  }

  function captureAudioPlaybackState(player, fallback) {
    if (!player.currentSrc || player.readyState < 1 || !Number.isFinite(player.duration) || player.duration <= 0) {
      return projectPlaybackState(fallback) || {
        time: Number.isFinite(player.currentTime) ? player.currentTime : 0,
        resume: false,
        playbackRate: player.playbackRate || 1,
        stamp: performance.now()
      };
    }

    return readPlayerPlaybackState(player);
  }

  function restoreAudioPlaybackState(player, snapshot, requestId) {
    if (!snapshot) {
      return null;
    }

    const requestToken = String(requestId);
    const desiredSnapshot = projectPlaybackState(snapshot);
    const desiredTime = desiredSnapshot ? desiredSnapshot.time : snapshot.time;

    const applyTime = function () {
      if (player.dataset.renderRequestId !== requestToken) {
        return;
      }

      if (!Number.isFinite(player.duration) || player.duration <= 0) {
        return;
      }

      const maxTime = Math.max(0, player.duration - 0.05);
      try {
        player.currentTime = clamp(desiredTime, 0, maxTime);
      } catch (error) {}
    };

    player.addEventListener("loadedmetadata", applyTime, { once: true });
    player.addEventListener("canplay", function () {
      if (player.dataset.renderRequestId !== requestToken) {
        return;
      }
      applyTime();
      player.playbackRate = snapshot.playbackRate || 1;
      if (snapshot.resume) {
        const playback = player.play();
        if (playback && typeof playback.catch === "function") {
          playback.catch(function () {});
        }
      }
    }, { once: true });

    return desiredSnapshot;
  }

  function isFileDrag(event) {
    const types = event.dataTransfer && event.dataTransfer.types;
    if (!types) {
      return false;
    }

    return Array.isArray(types) ? types.indexOf("Files") !== -1 : Array.from(types).indexOf("Files") !== -1;
  }

  function getDroppedFile(event) {
    const files = event.dataTransfer && event.dataTransfer.files;
    return files && files[0] ? files[0] : null;
  }

  function isImageFile(file) {
    return !!(file && (file.type.indexOf("image/") === 0 || /\.(jpe?g|png|gif|bmp|webp)$/i.test(file.name)));
  }

  function isAudioFile(file) {
    return !!(file && (file.type.indexOf("audio/") === 0 || /\.(wav|mp3|ogg|oga|m4a|aac|flac|aif|aiff)$/i.test(file.name)));
  }

  function resolveImageExportMeta(selection, sourceFile) {
    if (selection === "jpeg") {
      return {
        mimeType: "image/jpeg",
        extension: ".jpg",
        quality: 0.92
      };
    }

    if (selection === "webp") {
      return {
        mimeType: "image/webp",
        extension: ".webp",
        quality: 0.92
      };
    }

    if (selection === "png") {
      return {
        mimeType: "image/png",
        extension: ".png",
        quality: 1
      };
    }

    if (sourceFile && /jpe?g/i.test(sourceFile.type)) {
      return {
        mimeType: "image/jpeg",
        extension: ".jpg",
        quality: 0.92
      };
    }

    return {
      mimeType: "image/png",
      extension: ".png",
      quality: 1
    };
  }

  function resolveAudioExportMeta() {
    return {
      mimeType: "audio/wav",
      extension: ".wav"
    };
  }

  function buildRenderedFileName(fileName, infix, extension, settings) {
    const baseName = stripExtension(fileName || "glitchy");
    return baseName + infix + settings.mode + "-" + settings.seed + extension;
  }

  function stripExtension(fileName) {
    return (fileName || "file").replace(/\.[^/.]+$/, "");
  }

  function revokeUrl(url) {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  function canvasToBlob(canvas, mimeType, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Canvas export failed"));
      }, mimeType, quality);
    });
  }

  function loadImageElement(url) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = function () {
        reject(new Error("Image load failed"));
      };
      image.src = url;
    });
  }

  function verifyImageUrl(url) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      let timeoutId = 0;

      const cleanup = function () {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        image.onload = null;
        image.onerror = null;
      };

      timeoutId = window.setTimeout(function () {
        cleanup();
        reject(new Error("Image preview timeout"));
      }, 3200);

      image.onload = function () {
        cleanup();
        resolve();
      };
      image.onerror = function () {
        cleanup();
        reject(new Error("Image decode failed"));
      };
      image.src = url;
    });
  }

  function analyzeImageBytes(bytes, mimeType, fileName) {
    const format = detectImageFormat(bytes, mimeType, fileName);
    let detail;

    if (format === "jpeg") {
      detail = analyzeJpeg(bytes);
    } else if (format === "png") {
      detail = analyzePng(bytes);
    } else if (format === "gif") {
      detail = analyzeGif(bytes);
    } else if (format === "bmp") {
      detail = analyzeBmp(bytes);
    } else {
      detail = analyzeGenericImage(bytes);
    }

    const totalMutableBytes = detail.ranges.reduce(function (sum, range) {
      return sum + Math.max(0, range.end - range.start);
    }, 0);

    return {
      format: format,
      preferredMime: detail.preferredMime,
      strategyLabel: detail.strategyLabel,
      renderLabel: detail.renderLabel,
      ranges: detail.ranges,
      rangeCount: detail.ranges.length,
      totalMutableBytes: totalMutableBytes,
      pngChunks: detail.pngChunks || []
    };
  }

  function detectImageFormat(bytes, mimeType, fileName) {
    if (mimeType.indexOf("jpeg") !== -1 || mimeType.indexOf("jpg") !== -1) {
      return "jpeg";
    }
    if (mimeType.indexOf("png") !== -1) {
      return "png";
    }
    if (mimeType.indexOf("gif") !== -1) {
      return "gif";
    }
    if (mimeType.indexOf("bmp") !== -1) {
      return "bmp";
    }

    if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8) {
      return "jpeg";
    }
    if (bytes.length > 8 && bytes[0] === 0x89 && readAscii(bytes, 1, 3) === "PNG") {
      return "png";
    }
    if (readAscii(bytes, 0, 6) === "GIF87a" || readAscii(bytes, 0, 6) === "GIF89a") {
      return "gif";
    }
    if (readAscii(bytes, 0, 2) === "BM") {
      return "bmp";
    }

    if (/\.jpe?g$/i.test(fileName || "")) {
      return "jpeg";
    }
    if (/\.png$/i.test(fileName || "")) {
      return "png";
    }
    if (/\.gif$/i.test(fileName || "")) {
      return "gif";
    }
    if (/\.bmp$/i.test(fileName || "")) {
      return "bmp";
    }

    return "generic";
  }

  function analyzeJpeg(bytes) {
    let offset = 2;
    let scanStart = -1;
    let eoiOffset = -1;

    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      while (offset < bytes.length && bytes[offset] === 0xff) {
        offset += 1;
      }

      const marker = bytes[offset];
      if (!marker) {
        break;
      }

      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
        offset += 1;
        continue;
      }

      if (offset + 2 >= bytes.length) {
        break;
      }

      const segmentLength = readUint16BE(bytes, offset + 1);
      if (marker === 0xda) {
        scanStart = offset + 1 + segmentLength;
        break;
      }

      offset += 1 + segmentLength;
    }

    for (let index = bytes.length - 2; index >= 2; index -= 1) {
      if (bytes[index] === 0xff && bytes[index + 1] === 0xd9) {
        eoiOffset = index;
        break;
      }
    }

    if (scanStart === -1 || eoiOffset === -1 || eoiOffset - scanStart < 64) {
      return analyzeGenericImage(bytes);
    }

    const margin = Math.min(2048, Math.max(48, Math.floor((eoiOffset - scanStart) * 0.012)));
    return {
      preferredMime: "image/jpeg",
      strategyLabel: "JPEG scan data",
      renderLabel: "jpeg bytes + canvas",
      ranges: [
        {
          start: scanStart + margin,
          end: eoiOffset - margin
        }
      ]
    };
  }

  function analyzePng(bytes) {
    const ranges = [];
    const pngChunks = [];
    let offset = 8;

    while (offset + 12 <= bytes.length) {
      const length = readUint32BE(bytes, offset);
      const type = readAscii(bytes, offset + 4, 4);
      const dataStart = offset + 8;
      const dataEnd = dataStart + length;
      const crcOffset = dataEnd;

      if (dataEnd + 4 > bytes.length) {
        break;
      }

      if (type === "IDAT") {
        const margin = Math.min(128, Math.max(6, Math.floor(length * 0.03)));
        if (length > margin * 2 + 6) {
          ranges.push({
            start: dataStart + margin,
            end: dataEnd - margin
          });
          pngChunks.push({
            chunkStart: offset,
            dataStart: dataStart,
            length: length,
            crcOffset: crcOffset
          });
        }
      }

      if (type === "IEND") {
        break;
      }

      offset = dataEnd + 4;
    }

    if (!ranges.length) {
      return analyzeGenericImage(bytes);
    }

    return {
      preferredMime: "image/png",
      strategyLabel: "PNG IDAT data",
      renderLabel: "idat bytes + canvas",
      ranges: ranges,
      pngChunks: pngChunks
    };
  }

  function analyzeGif(bytes) {
    let offset = 13;
    const packed = bytes[10] || 0;
    const ranges = [];

    if (packed & 0x80) {
      offset += 3 * Math.pow(2, (packed & 0x07) + 1);
    }

    while (offset < bytes.length) {
      const marker = bytes[offset];

      if (marker === 0x2c) {
        offset += 10;
        if (offset >= bytes.length) {
          break;
        }

        const imagePacked = bytes[offset - 1];
        if (imagePacked & 0x80) {
          offset += 3 * Math.pow(2, (imagePacked & 0x07) + 1);
        }

        offset += 1;
        while (offset < bytes.length) {
          const blockLength = bytes[offset];
          if (!blockLength) {
            offset += 1;
            break;
          }
          if (blockLength > 8) {
            ranges.push({
              start: offset + 2,
              end: offset + 1 + blockLength
            });
          }
          offset += blockLength + 1;
        }
      } else if (marker === 0x21) {
        offset += 2;
        while (offset < bytes.length) {
          const extensionLength = bytes[offset];
          offset += 1;
          if (!extensionLength) {
            break;
          }
          offset += extensionLength;
        }
      } else if (marker === 0x3b) {
        break;
      } else {
        offset += 1;
      }
    }

    if (!ranges.length) {
      return analyzeGenericImage(bytes);
    }

    return {
      preferredMime: "image/gif",
      strategyLabel: "GIF image data",
      renderLabel: "gif bytes + canvas",
      ranges: ranges
    };
  }

  function analyzeBmp(bytes) {
    if (bytes.length < 54) {
      return analyzeGenericImage(bytes);
    }

    const pixelOffset = readUint32LE(bytes, 10);
    const start = Math.min(bytes.length, pixelOffset + 32);
    const end = Math.max(start + 1, bytes.length - 16);

    return {
      preferredMime: "image/bmp",
      strategyLabel: "BMP pixel array",
      renderLabel: "bmp bytes + canvas",
      ranges: [
        {
          start: start,
          end: end
        }
      ]
    };
  }

  function analyzeGenericImage(bytes) {
    const start = Math.min(bytes.length, Math.max(512, Math.floor(bytes.length * 0.14)));
    const end = Math.max(start + 1, bytes.length - Math.max(128, Math.floor(bytes.length * 0.08)));

    return {
      preferredMime: "image/jpeg",
      strategyLabel: "Generic safe band",
      renderLabel: "binary + canvas",
      ranges: [
        {
          start: start,
          end: end
        }
      ]
    };
  }

  async function renderImagePreviewResult(sourceBytes, analysis, settings, api, originalUrl) {
    if (settings.mode === "jpeg-crush") {
      return renderExtremeJpegPreview(originalUrl, settings, api);
    }

    const binaryResult = renderImageMutation(sourceBytes, analysis, settings, api);
    return Object.assign({
      previewBlob: null,
      strategyLabel: analysis.strategyLabel || "binary",
      renderLabel: analysis.renderLabel || "binary + canvas"
    }, binaryResult);
  }

  async function renderExtremeJpegPreview(originalUrl, settings, api) {
    const intensityNorm = api.clamp01(settings.intensity / 100);
    const densityNorm = api.clamp01(settings.density / 100);
    const focusNorm = api.clamp01(settings.focus / 100);
    const guardNorm = api.clamp01(settings.guard / 100);
    const passes = Math.max(2, Math.round(2 + intensityNorm * 4 + densityNorm * 3));
    const sourceImage = await loadImageElement(originalUrl);
    const width = Math.max(2, sourceImage.naturalWidth || sourceImage.width || 2);
    const height = Math.max(2, sourceImage.naturalHeight || sourceImage.height || 2);
    const workCanvas = document.createElement("canvas");
    const workContext = workCanvas.getContext("2d", { alpha: false });
    const bufferCanvas = document.createElement("canvas");
    const bufferContext = bufferCanvas.getContext("2d", { alpha: false });
    let currentImage = sourceImage;
    let previousUrl = "";
    let previousBlob = null;

    workCanvas.width = width;
    workCanvas.height = height;
    bufferCanvas.width = width;
    bufferCanvas.height = height;

    try {
      for (let passIndex = 0; passIndex < passes; passIndex += 1) {
        const passRatio = passIndex / Math.max(1, passes - 1);
        const quality = clamp(
          0.28 - intensityNorm * 0.2 - densityNorm * 0.09 - passRatio * 0.08 + guardNorm * 0.03,
          0.018,
          0.32
        );
        const scale = clamp(
          0.96 - intensityNorm * 0.26 - densityNorm * 0.08 - passRatio * 0.06 + guardNorm * 0.04,
          0.38,
          0.98
        );
        const driftX = Math.round((focusNorm - 0.5) * width * (0.02 + intensityNorm * 0.08));
        const sliceCount = Math.max(2, Math.round(3 + densityNorm * 10 + intensityNorm * 4));

        bufferContext.clearRect(0, 0, width, height);
        bufferContext.fillStyle = "#000";
        bufferContext.fillRect(0, 0, width, height);
        bufferContext.imageSmoothingEnabled = passIndex % 2 === 0;
        bufferContext.drawImage(currentImage, 0, 0, width, height);

        workContext.clearRect(0, 0, width, height);
        workContext.fillStyle = "#000";
        workContext.fillRect(0, 0, width, height);
        workContext.imageSmoothingEnabled = false;
        workContext.drawImage(
          bufferCanvas,
          Math.max(0, Math.floor(width * (1 - scale) * 0.5)),
          Math.max(0, Math.floor(height * (1 - scale) * 0.5)),
          Math.max(1, Math.round(width * scale)),
          Math.max(1, Math.round(height * scale)),
          0,
          0,
          width,
          height
        );

        if (passIndex > 0) {
          bufferContext.clearRect(0, 0, width, height);
          bufferContext.drawImage(workCanvas, 0, 0, width, height);
          for (let sliceIndex = 0; sliceIndex < sliceCount; sliceIndex += 1) {
            const sliceHeight = Math.max(6, Math.round(height * (0.02 + densityNorm * 0.05) * (0.5 + passRatio)));
            const y = clamp(
              Math.round((sliceIndex / Math.max(1, sliceCount - 1)) * (height - sliceHeight) + (sliceIndex % 2 === 0 ? driftX : -driftX) * 0.25),
              0,
              Math.max(0, height - sliceHeight)
            );
            const shift = Math.round((passIndex % 2 === 0 ? 1 : -1) * (8 + intensityNorm * 42) * (0.3 + passRatio));
            workContext.drawImage(bufferCanvas, 0, y, width, sliceHeight, shift, y, width, sliceHeight);
          }
        }

        previousBlob = await canvasToBlob(workCanvas, "image/jpeg", quality);
        if (passIndex < passes - 1) {
          const nextUrl = URL.createObjectURL(previousBlob);
          currentImage = await loadImageElement(nextUrl);
          revokeUrl(previousUrl);
          previousUrl = nextUrl;
        }
      }
    } finally {
      revokeUrl(previousUrl);
    }

    return {
      bytes: null,
      previewBlob: previousBlob,
      mutatedBytes: previousBlob ? previousBlob.size : 0,
      operations: passes * Math.max(6, Math.round(10 + densityNorm * 22)),
      riskLabel: intensityNorm > 0.42 ? "high" : "medium",
      mapBins: buildSyntheticMapBins(focusNorm, densityNorm, intensityNorm),
      strategyLabel: "extreme jpeg recompress",
      renderLabel: "jpeg crush + canvas"
    };
  }

  function renderImageMutation(sourceBytes, analysis, settings, api) {
    const bytes = sourceBytes.slice();
    const intensityNorm = api.clamp01(settings.intensity / 100);
    const densityNorm = api.clamp01(settings.density / 100);
    const guardNorm = api.clamp01(settings.guard / 100);
    const focusNorm = api.clamp01(settings.focus / 100);
    const chunkNorm = api.clamp01(settings.chunkSize / 24);
    const formatScale = analysis.format === "png" ? 0.22 : analysis.format === "gif" ? 0.28 : analysis.format === "bmp" ? 1.08 : 0.86;
    const operationCount = Math.max(
      0,
      Math.min(
        analysis.format === "png" ? 1800 : 7200,
        Math.floor(analysis.totalMutableBytes * Math.pow(densityNorm, 1.6) * 0.0018 * formatScale)
      )
    );
    const chunkLimit = Math.max(1, Math.min(analysis.format === "png" ? 8 : 28, Math.floor(settings.chunkSize || 1)));
    const rng = api.createSeededRandom(settings.seed);
    const ranges = buildScopedRanges(analysis.ranges, bytes.length, guardNorm);
    const mapBins = new Array(48).fill(0);

    if (!ranges.length || !operationCount || intensityNorm <= 0) {
      return {
        bytes: bytes,
        mutatedBytes: 0,
        operations: 0,
        riskLabel: "low",
        mapBins: mapBins
      };
    }

    const weightedRanges = ranges.map(function (range) {
      const midpoint = ((range.start + range.end) * 0.5) / bytes.length;
      const distance = Math.abs(midpoint - focusNorm);
      return {
        start: range.start,
        end: range.end,
        weight: 0.2 + Math.pow(Math.max(0.01, 1 - distance), 2.3) * 4.2
      };
    });
    const totalWeight = weightedRanges.reduce(function (sum, range) {
      return sum + range.weight;
    }, 0);

    let mutatedBytes = 0;

    for (let opIndex = 0; opIndex < operationCount; opIndex += 1) {
      const range = pickWeightedRange(weightedRanges, totalWeight, rng);
      const rangeLength = range.end - range.start;
      if (rangeLength < 2) {
        continue;
      }

      const chunkSize = Math.min(rangeLength, Math.max(1, Math.floor(1 + rng() * Math.max(1, chunkLimit + chunkNorm * 8))));
      const target = randomInt(range.start, Math.max(range.start + 1, range.end - chunkSize + 1), rng);
      const mode = pickImageMode(settings.mode, rng);
      const touched = mutateImageChunk(bytes, analysis.format, target, chunkSize, range, intensityNorm, rng, mode);
      mutatedBytes += touched;
      mapBins[Math.min(mapBins.length - 1, Math.floor((target / bytes.length) * mapBins.length))] += touched;
    }

    if (analysis.format === "png" && analysis.pngChunks && analysis.pngChunks.length) {
      recomputePngCrcs(bytes, analysis.pngChunks);
    }

    return {
      bytes: bytes,
      mutatedBytes: mutatedBytes,
      operations: operationCount,
      riskLabel: estimateRisk(intensityNorm, densityNorm, guardNorm, formatScale),
      mapBins: mapBins
    };
  }

  function buildSyntheticMapBins(focusNorm, densityNorm, intensityNorm) {
    const bins = new Array(48).fill(0);
    const spread = 0.08 + (1 - densityNorm) * 0.26;
    let index;

    for (index = 0; index < bins.length; index += 1) {
      const position = index / Math.max(1, bins.length - 1);
      const distance = Math.abs(position - focusNorm);
      const falloff = Math.max(0, 1 - distance / spread);
      bins[index] = Math.round((falloff * (30 + densityNorm * 52) + intensityNorm * 18) * (0.6 + intensityNorm * 0.5));
    }

    return bins;
  }

  function buildScopedRanges(ranges, totalLength, guardNorm) {
    return ranges.reduce(function (acc, range) {
      const length = range.end - range.start;
      if (length < 2) {
        return acc;
      }
      const margin = Math.floor(Math.min(length * 0.38, (10 + length * 0.12) * guardNorm));
      const start = clamp(range.start + margin, 0, totalLength);
      const end = clamp(range.end - margin, 0, totalLength);
      if (end - start > 2) {
        acc.push({ start: start, end: end });
      }
      return acc;
    }, []);
  }

  function mutateImageChunk(bytes, format, target, chunkSize, range, intensityNorm, rng, mode) {
    const indices = [];
    let index;

    for (index = target; index < target + chunkSize && index < range.end; index += 1) {
      if (canMutateImageByte(bytes, index, format, range)) {
        indices.push(index);
      }
    }

    if (!indices.length) {
      return 0;
    }

    if (mode === "shuffle" || mode === "scan-jump") {
      return mutateImageBlock(bytes, indices, format, rng, mode);
    }

    let touched = 0;
    indices.forEach(function (currentIndex) {
      const original = bytes[currentIndex];
      const next = mutateImageByteValue(original, format, intensityNorm, rng, mode);
      if (next !== original) {
        bytes[currentIndex] = next;
        touched += 1;
      }
    });
    return touched;
  }

  function mutateImageBlock(bytes, indices, format, rng, mode) {
    const snapshot = indices.map(function (index) {
      return bytes[index];
    });
    const shift = Math.max(1, Math.floor(rng() * Math.max(1, indices.length - 1)));
    let touched = 0;

    indices.forEach(function (index, position) {
      const sourceIndex = mode === "shuffle"
        ? clamp(index + Math.floor((rng() - 0.5) * 96), 0, bytes.length - 1)
        : clamp(indices[(position + shift) % indices.length] + Math.floor((rng() - 0.5) * 48), 0, bytes.length - 1);
      let next = sanitizeImageByte(bytes[sourceIndex], format);
      if (mode === "scan-jump" && rng() > 0.58) {
        next = sanitizeImageByte(next ^ (0x0f + Math.floor(rng() * 96)), format);
      }
      if (bytes[index] !== next) {
        bytes[index] = next;
        touched += 1;
      }
    });

    if (!touched && indices.length > 1) {
      bytes[indices[0]] = sanitizeImageByte(snapshot[indices.length - 1], format);
      touched = 1;
    }

    return touched;
  }

  function mutateImageByteValue(value, format, intensityNorm, rng, mode) {
    let next = value;

    if (mode === "xor") {
      next = value ^ Math.max(1, Math.floor((7 + intensityNorm * 111) * rng()));
    } else {
      const bitCount = Math.max(1, Math.min(5, Math.floor(1 + intensityNorm * 5)));
      for (let step = 0; step < bitCount; step += 1) {
        next ^= 1 << Math.floor(rng() * 7);
      }
    }

    return sanitizeImageByte(next, format);
  }

  function sanitizeImageByte(value, format) {
    const next = value & 0xff;
    if (format === "jpeg" && next === 0xff) {
      return 0xfe;
    }
    return next;
  }

  function canMutateImageByte(bytes, index, format, range) {
    if (index <= range.start || index >= range.end) {
      return false;
    }

    if (format === "jpeg") {
      return bytes[index] !== 0xff && bytes[index - 1] !== 0xff;
    }

    return true;
  }

  function pickImageMode(mode, rng) {
    if (mode === "hybrid") {
      return ["bitflip", "xor", "shuffle", "scan-jump"][Math.floor(rng() * 4)];
    }
    return mode;
  }

  function estimateRisk(intensityNorm, densityNorm, guardNorm, scale) {
    const score = (intensityNorm * 0.52 + densityNorm * 0.32 + (1 - guardNorm) * 0.16) * (0.64 + scale);
    if (score < 0.38) {
      return "low";
    }
    if (score < 0.7) {
      return "medium";
    }
    return "high";
  }

  function pickWeightedRange(ranges, totalWeight, rng) {
    let target = rng() * totalWeight;
    for (let index = 0; index < ranges.length; index += 1) {
      target -= ranges[index].weight;
      if (target <= 0) {
        return ranges[index];
      }
    }
    return ranges[ranges.length - 1];
  }

  function randomInt(min, maxExclusive, rng) {
    if (maxExclusive <= min) {
      return min;
    }
    return min + Math.floor(rng() * (maxExclusive - min));
  }

  function recomputePngCrcs(bytes, chunks) {
    chunks.forEach(function (chunk) {
      const crc = pngCrc(bytes, chunk.chunkStart + 4, 4 + chunk.length);
      writeUint32BE(bytes, chunk.crcOffset, crc >>> 0);
    });
  }

  function pngCrc(bytes, start, length) {
    if (!pngCrcTable) {
      pngCrcTable = buildPngCrcTable();
    }

    let crc = 0xffffffff;
    for (let index = start; index < start + length; index += 1) {
      crc = pngCrcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function buildPngCrcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[n] = c >>> 0;
    }
    return table;
  }

  function analyzeWavFile(bytes) {
    if (bytes.length < 44 || readAscii(bytes, 0, 4) !== "RIFF" || readAscii(bytes, 8, 4) !== "WAVE") {
      return null;
    }

    let offset = 12;
    let fmt = null;
    let data = null;

    while (offset + 8 <= bytes.length) {
      const chunkId = readAscii(bytes, offset, 4);
      const chunkSize = readUint32LE(bytes, offset + 4);
      const chunkDataOffset = offset + 8;
      if (chunkDataOffset + chunkSize > bytes.length) {
        break;
      }

      if (chunkId === "fmt " && chunkSize >= 16) {
        fmt = {
          formatTag: readUint16LE(bytes, chunkDataOffset),
          channelCount: readUint16LE(bytes, chunkDataOffset + 2),
          sampleRate: readUint32LE(bytes, chunkDataOffset + 4),
          byteRate: readUint32LE(bytes, chunkDataOffset + 8),
          blockAlign: readUint16LE(bytes, chunkDataOffset + 12),
          bitsPerSample: readUint16LE(bytes, chunkDataOffset + 14)
        };
      } else if (chunkId === "data") {
        data = {
          dataOffset: chunkDataOffset,
          dataSize: chunkSize
        };
      }

      offset = chunkDataOffset + chunkSize + (chunkSize % 2);
    }

    if (!fmt || !data) {
      return null;
    }

    return {
      format: fmt,
      dataOffset: data.dataOffset,
      dataSize: data.dataSize
    };
  }

  async function decodeAudioArrayBuffer(arrayBuffer) {
    const context = getSharedAudioContext();
    const input = arrayBuffer.slice(0);
    return context.decodeAudioData(input);
  }

  async function renderAudioMutation(sourceBuffer, sourceBytes, wavInfo, settings, api) {
    if (settings.mode === "bytebend" && wavInfo) {
      return renderWavByteBend(sourceBytes, wavInfo, settings, api);
    }

    const renderedBuffer = cloneAudioBuffer(sourceBuffer);
    const sourceChannels = collectAudioChannels(sourceBuffer);
    const targetChannels = collectAudioChannels(renderedBuffer);
    const intensityNorm = api.clamp01(settings.intensity / 100);
    const densityNorm = api.clamp01(settings.density / 100);
    const chunkNorm = api.clamp01(settings.chunkSize / 24);
    const focusNorm = api.clamp01(settings.focus / 100);
    const rng = api.createSeededRandom(settings.seed);
    const operationCount = Math.max(
      8,
      Math.round(10 + densityNorm * 84 + intensityNorm * 46 + sourceBuffer.duration * (0.6 + densityNorm * 0.8))
    );
    const mapBins = new Array(48).fill(0);

    let operationIndex;
    for (operationIndex = 0; operationIndex < operationCount; operationIndex += 1) {
      const segmentLength = Math.max(
        256,
        Math.floor(sourceBuffer.sampleRate * (0.008 + chunkNorm * 0.24) * (0.45 + rng() * 1.4))
      );
      const center = Math.floor(sourceBuffer.length * focusNorm + (rng() - 0.5) * sourceBuffer.length * 0.55);
      const start = clamp(center - Math.floor(segmentLength * 0.5), 0, Math.max(0, sourceBuffer.length - segmentLength - 1));
      const effect = pickAudioEffect(settings.mode, rng);

      applyAudioEffect(effect, sourceChannels, targetChannels, start, segmentLength, intensityNorm, densityNorm, rng);
      if (settings.mode === "hybrid" && (intensityNorm > 0.28 || densityNorm > 0.24)) {
        applyAudioEffect(
          pickSecondaryAudioEffect(effect, rng),
          targetChannels,
          targetChannels,
          start,
          Math.max(64, Math.round(segmentLength * (0.6 + intensityNorm * 0.55))),
          intensityNorm,
          densityNorm,
          rng
        );
      }
      mapBins[Math.min(mapBins.length - 1, Math.floor((start / Math.max(1, sourceBuffer.length)) * mapBins.length))] += 1;
    }

    if (settings.limiter) {
      normalizeAudio(renderedBuffer, 0.88);
    }

    return {
      audioBuffer: renderedBuffer,
      renderBlob: encodeWavBlob(renderedBuffer),
      operations: operationCount,
      mapBins: mapBins,
      mutatedLabel: String(operationCount) + " ops",
      strategyLabel: "offline dsp chain"
    };
  }

  async function renderWavByteBend(sourceBytes, wavInfo, settings, api) {
    const bytes = sourceBytes.slice();
    const dataStart = wavInfo.dataOffset;
    const dataEnd = wavInfo.dataOffset + wavInfo.dataSize;
    const intensityNorm = api.clamp01(settings.intensity / 100);
    const densityNorm = api.clamp01(settings.density / 100);
    const guardNorm = api.clamp01(settings.guard / 100);
    const chunkNorm = api.clamp01(settings.chunkSize / 24);
    const rng = api.createSeededRandom(settings.seed);
    const mapBins = new Array(48).fill(0);
    const blockAlign = Math.max(1, (wavInfo.format && wavInfo.format.blockAlign) || 2);
    const margin = Math.min(4096, Math.max(blockAlign * 8, Math.floor((dataEnd - dataStart) * 0.04 * guardNorm)));
    const start = dataStart + margin;
    const end = dataEnd - margin;
    const operationCount = Math.max(8, Math.round((wavInfo.dataSize / 32768) * (4 + densityNorm * 24 + intensityNorm * 10)));
    let mutatedBytes = 0;

    if (end - start < 4) {
      throw new Error("WAV data range too small");
    }

    for (let index = 0; index < operationCount; index += 1) {
      const blockCount = Math.max(1, Math.round(1 + chunkNorm * 22 + intensityNorm * 8 + rng() * 6));
      const chunkLength = blockAlign * blockCount;
      const availableBlocks = Math.max(1, Math.floor((end - start - chunkLength) / blockAlign));
      const target = start + randomInt(0, availableBlocks, rng) * blockAlign;
      let step;
      for (step = 0; step < chunkLength; step += 1) {
        const offset = target + step;
        const original = bytes[offset];
        const mask = Math.max(1, Math.floor((11 + intensityNorm * 96) * rng()));
        bytes[offset] = (original ^ mask) & 0xff;
        mutatedBytes += 1;
      }
      mapBins[Math.min(mapBins.length - 1, Math.floor(((target - dataStart) / Math.max(1, wavInfo.dataSize)) * mapBins.length))] += 1;
    }

    const renderedBuffer = await decodeAudioArrayBuffer(bytes.buffer);
    if (settings.limiter) {
      normalizeAudio(renderedBuffer, 0.86);
    }

    return {
      audioBuffer: renderedBuffer,
      renderBlob: encodeWavBlob(renderedBuffer),
      operations: operationCount,
      mapBins: mapBins,
      mutatedLabel: api.formatBytes(mutatedBytes),
      strategyLabel: "wav byte bend"
    };
  }

  function pickAudioEffect(mode, rng) {
    if (mode === "hybrid" || mode === "bytebend") {
      return ["tape", "stutter", "bitcrush", "dropout"][Math.floor(rng() * 4)];
    }
    return mode;
  }

  function pickSecondaryAudioEffect(primaryEffect, rng) {
    const pool = ["tape", "stutter", "bitcrush", "dropout"].filter(function (effect) {
      return effect !== primaryEffect;
    });
    return pool[Math.floor(rng() * pool.length)];
  }

  function applyAudioEffect(effect, sourceChannels, targetChannels, start, segmentLength, intensityNorm, densityNorm, rng) {
    if (effect === "stutter") {
      applyStutterEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, rng);
      return;
    }
    if (effect === "bitcrush") {
      applyBitcrushEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, densityNorm);
      return;
    }
    if (effect === "dropout") {
      applyDropoutEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, rng);
      return;
    }
    applyTapeEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, densityNorm, rng);
  }

  function applyStutterEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, rng) {
    const cycleLength = Math.max(18, Math.floor(segmentLength * (0.02 + intensityNorm * 0.14) * (0.45 + rng())));

    targetChannels.forEach(function (targetChannel, channelIndex) {
      const sourceChannel = sourceChannels[channelIndex];
      let offset;
      for (offset = 0; offset < segmentLength && start + offset < targetChannel.length; offset += 1) {
        const cyclePosition = offset % cycleLength;
        const cycleIndex = Math.floor(offset / cycleLength);
        const reverse = intensityNorm > 0.46 && cycleIndex % 2 === 1;
        const sourceIndex = start + (reverse ? cycleLength - 1 - cyclePosition : cyclePosition);
        const gate = cyclePosition < Math.max(2, Math.floor(cycleLength * (0.18 + intensityNorm * 0.32)))
          ? 0.2 + rng() * 0.22
          : 1;
        targetChannel[start + offset] = sourceChannel[Math.min(sourceChannel.length - 1, sourceIndex)] * gate;
      }
    });
  }

  function applyBitcrushEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, densityNorm) {
    const holdSamples = Math.max(1, Math.floor(1 + densityNorm * 42 + intensityNorm * 12));
    const levels = Math.max(4, Math.floor(6 + (1 - intensityNorm) * 84));
    const drive = 1.12 + intensityNorm * 2.4;
    const threshold = 0.86 - intensityNorm * 0.34;

    targetChannels.forEach(function (targetChannel, channelIndex) {
      const sourceChannel = sourceChannels[channelIndex];
      let heldValue = 0;
      let offset;
      for (offset = 0; offset < segmentLength && start + offset < targetChannel.length; offset += 1) {
        if (offset % holdSamples === 0) {
          heldValue = Math.round(sourceChannel[start + offset] * levels) / levels;
        }
        targetChannel[start + offset] = softClipSample(heldValue * drive, threshold);
      }
    });
  }

  function applyDropoutEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, rng) {
    const dryLevel = 0.04 + (1 - intensityNorm) * 0.24;
    const noiseLevel = 0.08 + intensityNorm * 0.42;
    const burstLength = Math.max(24, Math.floor(segmentLength * (0.04 + intensityNorm * 0.22)));

    targetChannels.forEach(function (targetChannel, channelIndex) {
      const sourceChannel = sourceChannels[channelIndex];
      let offset;
      for (offset = 0; offset < segmentLength && start + offset < targetChannel.length; offset += 1) {
        const inBurst = offset % Math.max(1, burstLength) < Math.max(4, Math.floor(burstLength * 0.28));
        const noise = (rng() * 2 - 1) * noiseLevel;
        const inversion = inBurst && rng() > 0.42 ? -0.35 - intensityNorm * 0.4 : 1;
        targetChannel[start + offset] = sourceChannel[start + offset] * dryLevel * inversion + noise;
      }
    });
  }

  function applyTapeEffect(sourceChannels, targetChannels, start, segmentLength, intensityNorm, densityNorm, rng) {
    const wobbleDepth = 0.01 + intensityNorm * 0.09;
    const wobbleRate = 0.0012 + densityNorm * 0.02;
    const phase = rng() * Math.PI * 2;

    targetChannels.forEach(function (targetChannel, channelIndex) {
      const sourceChannel = sourceChannels[channelIndex];
      let readPosition = start;
      let offset;

      for (offset = 0; offset < segmentLength && start + offset < targetChannel.length; offset += 1) {
        const wobble = Math.sin((start + offset) * wobbleRate + phase) * wobbleDepth;
        const skip = rng() > 0.994 - intensityNorm * 0.08
          ? (rng() > 0.5 ? 1 : -1) * (3 + intensityNorm * 48)
          : 0;
        readPosition += 1 + wobble + skip;
        const index = clamp(Math.floor(readPosition), start, Math.max(start, Math.min(sourceChannel.length - 2, start + segmentLength - 2)));
        const frac = readPosition - index;
        const a = sourceChannel[index];
        const b = sourceChannel[Math.min(sourceChannel.length - 1, index + 1)];
        const hiss = (rng() * 2 - 1) * (0.006 + intensityNorm * 0.06);
        const pump = 0.72 + Math.sin((start + offset) * wobbleRate * 0.35 + phase) * (0.12 + intensityNorm * 0.3);
        targetChannel[start + offset] = softClipSample((a + (b - a) * frac) * pump + hiss, 0.9 - intensityNorm * 0.22);
      }
    });
  }

  function normalizeAudio(audioBuffer, maxPeak) {
    let peak = 0;
    let channelIndex;
    for (channelIndex = 0; channelIndex < audioBuffer.numberOfChannels; channelIndex += 1) {
      const channel = audioBuffer.getChannelData(channelIndex);
      let index;
      for (index = 0; index < channel.length; index += 1) {
        peak = Math.max(peak, Math.abs(channel[index]));
      }
    }

    if (!peak || peak <= maxPeak) {
      return;
    }

    const gain = maxPeak / peak;
    for (channelIndex = 0; channelIndex < audioBuffer.numberOfChannels; channelIndex += 1) {
      const output = audioBuffer.getChannelData(channelIndex);
      let index;
      for (index = 0; index < output.length; index += 1) {
        output[index] *= gain;
      }
    }
  }

  function softClipSample(value, threshold) {
    const limit = clamp(threshold, 0.12, 0.98);
    if (Math.abs(value) <= limit) {
      return value;
    }

    const sign = value < 0 ? -1 : 1;
    const excess = Math.abs(value) - limit;
    return sign * (limit + excess / (1 + excess));
  }

  function cloneAudioBuffer(audioBuffer) {
    const context = getSharedAudioContext();
    const clone = context.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
    let channelIndex;
    for (channelIndex = 0; channelIndex < audioBuffer.numberOfChannels; channelIndex += 1) {
      clone.getChannelData(channelIndex).set(audioBuffer.getChannelData(channelIndex));
    }
    return clone;
  }

  function collectAudioChannels(audioBuffer) {
    const channels = [];
    let channelIndex;
    for (channelIndex = 0; channelIndex < audioBuffer.numberOfChannels; channelIndex += 1) {
      channels.push(audioBuffer.getChannelData(channelIndex));
    }
    return channels;
  }

  function getSharedAudioContext() {
    if (!sharedAudioContext) {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) {
        throw new Error("AudioContext is unavailable");
      }
      sharedAudioContext = new AudioContextCtor();
    }
    return sharedAudioContext;
  }

  function encodeWavBlob(audioBuffer) {
    const channelCount = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const frameCount = audioBuffer.length;
    const dataLength = frameCount * channelCount * 2;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + dataLength, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channelCount, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channelCount * 2, true);
    view.setUint16(32, channelCount * 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, dataLength, true);

    const channelData = collectAudioChannels(audioBuffer);
    let offset = 44;
    let sampleIndex;
    for (sampleIndex = 0; sampleIndex < frameCount; sampleIndex += 1) {
      let channelIndex;
      for (channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
        const sample = clamp(channelData[channelIndex][sampleIndex], -1, 1);
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  function drawWaveform(canvas, audioBuffer) {
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    const styles = getComputedStyle(document.documentElement);
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);
    context.fillStyle = styles.getPropertyValue("--canvas-bg").trim() || "#f3f3f3";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = styles.getPropertyValue("--canvas-line").trim() || "#d4d4d4";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, height * 0.5);
    context.lineTo(width, height * 0.5);
    context.stroke();

    if (!audioBuffer) {
      return;
    }

    const channel = audioBuffer.getChannelData(0);
    const step = Math.max(1, Math.floor(channel.length / width));
    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, styles.getPropertyValue("--canvas-start").trim() || "rgba(17, 17, 17, 0.12)");
    gradient.addColorStop(0.5, styles.getPropertyValue("--canvas-mid").trim() || "rgba(17, 17, 17, 0.28)");
    gradient.addColorStop(1, styles.getPropertyValue("--canvas-end").trim() || "rgba(17, 17, 17, 0.18)");
    context.fillStyle = gradient;

    let x;
    for (x = 0; x < width; x += 1) {
      const start = x * step;
      let min = 1;
      let max = -1;
      let index;
      for (index = start; index < Math.min(channel.length, start + step); index += 1) {
        const sample = channel[index];
        if (sample < min) {
          min = sample;
        }
        if (sample > max) {
          max = sample;
        }
      }
      const top = (1 - max) * 0.5 * height;
      const bottom = (1 - min) * 0.5 * height;
      context.fillRect(x, top, 1, Math.max(1, bottom - top));
    }
  }

  function detectAudioLabel(file, wavInfo) {
    if (wavInfo) {
      return "WAV";
    }
    if (file.type) {
      const slashIndex = file.type.indexOf("/");
      return (slashIndex === -1 ? file.type : file.type.slice(slashIndex + 1)).toUpperCase();
    }
    const match = /\.([^.]+)$/i.exec(file.name || "");
    return match ? match[1].toUpperCase() : "AUDIO";
  }

  function formatSeconds(value) {
    return value.toFixed(value >= 10 ? 1 : 2) + "s";
  }

  function readAscii(bytes, offset, length) {
    let output = "";
    let index;
    for (index = 0; index < length && offset + index < bytes.length; index += 1) {
      output += String.fromCharCode(bytes[offset + index]);
    }
    return output;
  }

  function readUint16BE(bytes, offset) {
    return ((bytes[offset] << 8) | bytes[offset + 1]) >>> 0;
  }

  function readUint16LE(bytes, offset) {
    return (bytes[offset] | (bytes[offset + 1] << 8)) >>> 0;
  }

  function readUint32BE(bytes, offset) {
    return (
      ((bytes[offset] << 24) >>> 0) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]
    ) >>> 0;
  }

  function readUint32LE(bytes, offset) {
    return (
      bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      ((bytes[offset + 3] << 24) >>> 0)
    ) >>> 0;
  }

  function writeUint32BE(bytes, offset, value) {
    bytes[offset] = (value >>> 24) & 0xff;
    bytes[offset + 1] = (value >>> 16) & 0xff;
    bytes[offset + 2] = (value >>> 8) & 0xff;
    bytes[offset + 3] = value & 0xff;
  }

  function writeAscii(view, offset, text) {
    let index;
    for (index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
})();
