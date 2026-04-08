"use strict";

(function () {
  const defaultSettings = {
    mode: "hybrid",
    intensity: 28,
    density: 18,
    chunkSize: 6,
    focus: 56,
    guard: 82,
    seed: 173,
    autoHeal: true
  };

  const presets = {
    codecDust: {
      mode: "bitflip",
      intensity: 18,
      density: 12,
      chunkSize: 2,
      focus: 48,
      guard: 88
    },
    datamoshLite: {
      mode: "smear",
      intensity: 42,
      density: 28,
      chunkSize: 8,
      focus: 52,
      guard: 68
    },
    tapeBurst: {
      mode: "stutter",
      intensity: 34,
      density: 32,
      chunkSize: 12,
      focus: 64,
      guard: 62
    },
    checksumPanic: {
      mode: "hybrid",
      intensity: 54,
      density: 20,
      chunkSize: 7,
      focus: 78,
      guard: 58
    }
  };

  const state = {
    sourceFile: null,
    originalUrl: "",
    previewUrl: "",
    worker: null,
    workerObjectUrl: "",
    analysis: null,
    lastRenderMeta: null,
    lastRenderBuffer: null,
    renderSequence: 0,
    activePreviewRequestId: 0,
    scheduledRender: 0,
    recoveries: 0,
    exportInProgress: false,
    dragDepth: 0,
    pendingPlayback: {
      resume: false,
      time: 0
    },
    compatibility: {
      profile: "standard",
      decodeTimeoutMs: 2600,
      probeTimeoutMs: 2200
    }
  };

  const elements = {
    fileInput: document.getElementById("fileInput"),
    previewPanel: document.querySelector(".preview-panel"),
    dropZone: document.getElementById("dropZone"),
    dropOverlay: document.getElementById("dropOverlay"),
    playerShell: document.getElementById("playerShell"),
    previewVideo: document.getElementById("previewVideo"),
    originalVideo: document.getElementById("originalVideo"),
    formatBadge: document.getElementById("formatBadge"),
    strategyBadge: document.getElementById("strategyBadge"),
    fileLabel: document.getElementById("fileLabel"),
    decodeStatus: document.getElementById("decodeStatus"),
    mutationCanvas: document.getElementById("mutationCanvas"),
    mutatedBytesLabel: document.getElementById("mutatedBytesLabel"),
    renderLatencyLabel: document.getElementById("renderLatencyLabel"),
    statusLine: document.getElementById("statusLine"),
    mutableBytesValue: document.getElementById("mutableBytesValue"),
    riskValue: document.getElementById("riskValue"),
    operationsValue: document.getElementById("operationsValue"),
    recoveryValue: document.getElementById("recoveryValue"),
    exportButton: document.getElementById("exportButton"),
    exportFormatSelect: document.getElementById("exportFormatSelect"),
    randomizeButton: document.getElementById("randomizeButton"),
    rerollSeedButton: document.getElementById("rerollSeedButton"),
    restartButton: document.getElementById("restartButton"),
    playPauseButton: document.getElementById("playPauseButton"),
    muteButton: document.getElementById("muteButton"),
    syncToggle: document.getElementById("syncToggle"),
    autoplayToggle: document.getElementById("autoplayToggle"),
    loopToggle: document.getElementById("loopToggle"),
    modeInput: document.getElementById("modeInput"),
    seedInput: document.getElementById("seedInput"),
    intensityInput: document.getElementById("intensityInput"),
    intensityOutput: document.getElementById("intensityOutput"),
    densityInput: document.getElementById("densityInput"),
    densityOutput: document.getElementById("densityOutput"),
    chunkSizeInput: document.getElementById("chunkSizeInput"),
    chunkSizeOutput: document.getElementById("chunkSizeOutput"),
    focusInput: document.getElementById("focusInput"),
    focusOutput: document.getElementById("focusOutput"),
    guardInput: document.getElementById("guardInput"),
    guardOutput: document.getElementById("guardOutput"),
    autoHealToggle: document.getElementById("autoHealToggle"),
    seekButtons: Array.from(document.querySelectorAll("[data-seek]"))
  };

  init();

  function init() {
    detectCompatibilityProfile();
    initWorker();
    initControls();
    initDragAndDrop();
    initPlaybackSync();
    applyLoopState();
    updateSettingsUI();
    updateTransportButtons();
    drawMutationMap([]);
  }

  function detectCompatibilityProfile() {
    const forcedProfile = new URLSearchParams(window.location.search).get("compat");
    const userAgent = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isMacSafari = /Macintosh/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|Chromium|Edg/.test(userAgent);
    const shouldUseConservative = forcedProfile === "safari" || isIOS || isMacSafari;

    if (!shouldUseConservative) {
      state.compatibility = {
        profile: "standard",
        decodeTimeoutMs: 2600,
        probeTimeoutMs: 2200
      };
      return;
    }

    state.compatibility = {
      profile: "safari-safe",
      decodeTimeoutMs: 4200,
      probeTimeoutMs: 3600
    };
    setStatusLine("Safari compatibility mode: включен более осторожный предпросмотр рендера.");
  }

  function initWorker() {
    const workerConfig = resolveWorkerConfig();

    try {
      state.worker = new Worker(workerConfig.url);
      state.worker.addEventListener("message", handleWorkerMessage);
      state.worker.addEventListener("error", function () {
        setDecodeStatus("Worker error", "error");
        setStatusLine(workerConfig.errorMessage);
      });
    } catch (error) {
      setDecodeStatus("Worker unavailable", "error");
      setStatusLine(workerConfig.errorMessage);
    }
  }

  function resolveWorkerConfig() {
    const inlineWorker = document.getElementById("glitchWorkerSource");
    const inlineSource = inlineWorker ? inlineWorker.textContent.trim() : "";

    if (inlineSource) {
      state.workerObjectUrl = URL.createObjectURL(
        new Blob([inlineSource], { type: "text/javascript" })
      );

      return {
        url: state.workerObjectUrl,
        errorMessage:
          "Не удалось запустить встроенный Web Worker. Попробуй Chromium, Firefox или открыть проект через локальный HTTP-сервер."
      };
    }

    return {
      url: "glitch-worker.js",
      errorMessage:
        "Не удалось запустить Web Worker. Попробуй открыть проект через локальный HTTP-сервер."
    };
  }

  function initControls() {
    elements.fileInput.addEventListener("change", async function (event) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        await loadFile(file);
      }
    });

    elements.randomizeButton.addEventListener("click", function () {
      applySettings({
        mode: ["hybrid", "smear", "stutter", "bitflip", "xor"][randomInteger(0, 5)],
        intensity: randomInteger(12, 62),
        density: randomInteger(8, 40),
        chunkSize: randomInteger(2, 16),
        focus: randomInteger(18, 88),
        guard: randomInteger(54, 90),
        seed: randomInteger(100, 999999)
      });
    });

    elements.rerollSeedButton.addEventListener("click", function () {
      elements.seedInput.value = String(randomInteger(100, 999999));
      updateSettingsUI();
      scheduleRender();
    });

    document.querySelectorAll("[data-setting]").forEach(function (input) {
      const eventName = input.type === "checkbox" ? "change" : "input";
      input.addEventListener(eventName, function () {
        updateSettingsUI();
        scheduleRender();
      });
    });

    document.querySelectorAll("[data-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        const preset = presets[button.dataset.preset];
        if (preset) {
          applySettings(Object.assign({ seed: randomInteger(100, 999999) }, preset));
        }
      });
    });

    elements.exportButton.addEventListener("click", exportCurrentRender);
    elements.restartButton.addEventListener("click", restartPlayback);
    elements.playPauseButton.addEventListener("click", togglePlayback);
    elements.muteButton.addEventListener("click", toggleMute);
    elements.loopToggle.addEventListener("change", applyLoopState);
    elements.syncToggle.addEventListener("change", function () {
      if (!elements.syncToggle.checked) {
        elements.originalVideo.pause();
        return;
      }
      syncReferenceVideo();
    });
    elements.seekButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        seekPreview(Number(button.dataset.seek || 0));
      });
    });
    window.addEventListener("beforeunload", cleanupUrls);
  }

  function initDragAndDrop() {
    elements.previewPanel.addEventListener("dragenter", handleDragEnter);
    elements.previewPanel.addEventListener("dragover", handleDragOver);
    elements.previewPanel.addEventListener("dragleave", handleDragLeave);
    elements.previewPanel.addEventListener("drop", handleDrop);
  }

  function handleDragEnter(event) {
    if (!isFileDrag(event)) {
      return;
    }

    event.preventDefault();
    state.dragDepth += 1;

    if (state.sourceFile) {
      elements.dropOverlay.classList.add("is-active");
    } else {
      elements.dropZone.classList.add("is-over");
    }
  }

  function handleDragOver(event) {
    if (!isFileDrag(event)) {
      return;
    }

    event.preventDefault();

    if (state.sourceFile) {
      elements.dropOverlay.classList.add("is-active");
    } else {
      elements.dropZone.classList.add("is-over");
    }
  }

  function handleDragLeave(event) {
    if (!isFileDrag(event)) {
      return;
    }

    event.preventDefault();
    state.dragDepth = Math.max(0, state.dragDepth - 1);

    if (state.dragDepth === 0) {
      clearDropIndicators();
    }
  }

  async function handleDrop(event) {
    if (!isFileDrag(event)) {
      return;
    }

    event.preventDefault();
    state.dragDepth = 0;
    clearDropIndicators();

    const file = extractVideoFile(event);
    if (file) {
      await loadFile(file);
      return;
    }

    setStatusLine("Нужен именно видеофайл. Бинарная мутация включается только после анализа контейнера.");
  }

  function clearDropIndicators() {
    elements.dropZone.classList.remove("is-over");
    elements.dropOverlay.classList.remove("is-active");
  }

  function isFileDrag(event) {
    const types = event.dataTransfer && event.dataTransfer.types;
    return Array.isArray(types) ? types.indexOf("Files") !== -1 : types ? Array.from(types).indexOf("Files") !== -1 : false;
  }

  function extractVideoFile(event) {
    const files = event.dataTransfer && event.dataTransfer.files;
    const file = files && files[0];
    return file && file.type.startsWith("video/") ? file : null;
  }

  function initPlaybackSync() {
    ["timeupdate", "play", "pause", "seeking", "ratechange"].forEach(function (type) {
      elements.previewVideo.addEventListener(type, syncReferenceVideo);
    });

    ["play", "pause", "volumechange", "loadedmetadata", "emptied"].forEach(function (type) {
      elements.previewVideo.addEventListener(type, updateTransportButtons);
    });

    elements.previewVideo.addEventListener("error", function () {
      handlePreviewError();
    });

    elements.previewVideo.addEventListener("loadedmetadata", function () {
      const desiredTime = Math.min(
        state.pendingPlayback.time || 0,
        Math.max(0, (elements.previewVideo.duration || 0) - 0.06)
      );

      if (desiredTime > 0) {
        try {
          elements.previewVideo.currentTime = desiredTime;
        } catch (error) {
          // Ignore failed seek on broken previews.
        }
      }
    });

    elements.previewVideo.addEventListener("canplay", function () {
      setDecodeStatus("Превью декодируется", "live");
      if (state.pendingPlayback.resume && elements.autoplayToggle.checked) {
        elements.previewVideo.play().catch(function () {});
      }
      updateTransportButtons();
      syncReferenceVideo();
    });
  }

  async function loadFile(file) {
    resetRenderState();
    state.sourceFile = file;
    state.recoveries = 0;
    state.dragDepth = 0;
    clearDropIndicators();
    elements.recoveryValue.textContent = "0";
    elements.fileLabel.textContent = file.name;
    elements.dropZone.classList.add("hidden");
    elements.playerShell.classList.remove("hidden");
    setDecodeStatus("Анализ контейнера...", "idle");
    setStatusLine("Читаю файл и ищу безопасные диапазоны для мутации байтов.");

    if (state.originalUrl) {
      URL.revokeObjectURL(state.originalUrl);
    }
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
      state.previewUrl = "";
    }

    state.originalUrl = URL.createObjectURL(file);
    elements.originalVideo.src = state.originalUrl;
    elements.previewVideo.src = state.originalUrl;
    elements.originalVideo.load();
    elements.previewVideo.load();
    applyLoopState();
    updateTransportButtons();

    const buffer = await file.arrayBuffer();
    const transferBuffer = buffer.slice(0);

    if (state.compatibility.profile === "safari-safe") {
      applySettings({
        intensity: Math.min(Number(elements.intensityInput.value), 32),
        density: Math.min(Number(elements.densityInput.value), 18),
        guard: Math.max(Number(elements.guardInput.value), 86),
        autoHeal: true
      });
      elements.autoplayToggle.checked = false;
      setStatusLine("Файл загружен. Для Safari активирован безопасный профиль: меньше повреждений + усиленные guard rails.");
    }

    if (file.size > 320 * 1024 * 1024) {
      setStatusLine("Файл большой, поэтому live preview может пересобираться заметно медленнее.");
    }

    state.worker.postMessage(
      {
        type: "load-source",
        buffer: transferBuffer,
        fileName: file.name,
        mimeType: file.type
      },
      [transferBuffer]
    );
  }

  function handleWorkerMessage(event) {
    const message = event.data || {};

    if (message.type === "source-ready") {
      state.analysis = message.analysis;
      updateAnalysisUI(message.analysis);
      scheduleRender(true);
      return;
    }

    if (message.type === "render-complete") {
      if (message.requestId < state.activePreviewRequestId) {
        return;
      }

      state.activePreviewRequestId = message.requestId;
      state.lastRenderMeta = message.meta;
      state.lastRenderBuffer = message.buffer;
      updateRenderTelemetry(message.meta);
      applyPreviewBuffer(message.buffer, message.meta);
    }
  }

  function updateAnalysisUI(analysis) {
    elements.formatBadge.textContent = "format: " + (analysis.format || "UNKNOWN");
    elements.strategyBadge.textContent = "strategy: " + (analysis.strategyLabel || "safe band");
    elements.mutableBytesValue.textContent = formatBytes(analysis.totalMutableBytes || 0);
    setStatusLine(
      "Контейнер разобран. Доступно для глитча " +
        formatBytes(analysis.totalMutableBytes || 0) +
        " в " +
        String(analysis.rangeCount || 0) +
        " диапазонах."
    );
  }

  function updateRenderTelemetry(meta) {
    elements.mutatedBytesLabel.textContent = formatBytes(meta.mutatedBytes || 0) + " touched";
    elements.renderLatencyLabel.textContent = String(meta.elapsedMs || 0) + " ms";
    elements.operationsValue.textContent = String(meta.operations || 0);
    elements.riskValue.textContent = meta.riskLabel || "low";
    elements.recoveryValue.textContent = String(state.recoveries);
    drawMutationMap(meta.mapBins || []);
  }

  function applyPreviewBuffer(buffer, meta) {
    const mimeType = (state.sourceFile && state.sourceFile.type) || meta.preferredMime || "video/mp4";
    const blob = new Blob([buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const currentTime = Number.isFinite(elements.previewVideo.currentTime) ? elements.previewVideo.currentTime : 0;
    const resume = !elements.previewVideo.paused;

    setDecodeStatus("Проверяю новый render перед заменой превью...", "warning");
    setStatusLine("Выполняю decode probe, чтобы не останавливать воспроизведение на несовместимом рендере.");

    verifyPreviewBlob(url).then(function () {
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }

      state.previewUrl = url;
      state.pendingPlayback = {
        time: currentTime,
        resume: resume
      };

      elements.previewVideo.src = url;
      elements.previewVideo.load();
      elements.exportButton.disabled = false;
      applyLoopState();
      updateTransportButtons();
      setDecodeStatus("Пробую декодировать новый render...", "warning");
      setStatusLine(
        "Собран новый render: " +
          String(meta.operations || 0) +
          " операций, риск " +
          String(meta.riskLabel || "low") +
          "."
      );
    }).catch(function () {
      URL.revokeObjectURL(url);
      handlePreviewError(true);
    });
  }

  function handlePreviewError(fromProbe) {
    if (!state.sourceFile || !getSettings().autoHeal) {
      setDecodeStatus("Браузер не смог декодировать превью", "error");
      setStatusLine("Текущая версия ролика слишком повреждена. Ослабь intensity или density.");
      return;
    }

    if (state.recoveries >= 3) {
      setDecodeStatus("Не удалось восстановить декодирование", "error");
      setStatusLine("Auto-heal исчерпал попытки. Уменьши intensity, density или увеличь guard rails.");
      return;
    }

    state.recoveries += 1;
    elements.recoveryValue.textContent = String(state.recoveries);
    setDecodeStatus("Decode error, запускаю recovery...", "warning");
    setStatusLine(
      fromProbe
        ? "Decode probe отклонил рендер до замены плеера. Пересобираю с усиленной защитой."
        : "Preview не декодируется, повторяю render с усиленной защитой контейнера."
    );
    requestRender(state.recoveries);
  }

  function scheduleRender(immediate) {
    if (!state.sourceFile || !state.analysis) {
      return;
    }

    window.clearTimeout(state.scheduledRender);
    state.scheduledRender = window.setTimeout(function () {
      requestRender(0);
    }, immediate ? 0 : 150);
  }

  function requestRender(recoveryLevel) {
    if (!state.sourceFile || !state.analysis) {
      return;
    }

    const settings = getSettings();
    settings.recoveryLevel = recoveryLevel || 0;
    settings.compatibilityProfile = state.compatibility.profile;
    if (state.compatibility.profile === "safari-safe") {
      settings.intensity = Math.min(settings.intensity, 38);
      settings.density = Math.min(settings.density, 20);
      settings.guard = Math.max(settings.guard, 88);
      settings.chunkSize = Math.min(settings.chunkSize, 10);
    }
    state.renderSequence += 1;
    setDecodeStatus("Собираю новый binary glitch...", "idle");

    state.worker.postMessage({
      type: "render",
      requestId: state.renderSequence,
      settings: settings
    });
  }

  function getSettings() {
    return {
      mode: elements.modeInput.value,
      seed: Number(elements.seedInput.value) || defaultSettings.seed,
      intensity: Number(elements.intensityInput.value),
      density: Number(elements.densityInput.value),
      chunkSize: Number(elements.chunkSizeInput.value),
      focus: Number(elements.focusInput.value),
      guard: Number(elements.guardInput.value),
      autoHeal: elements.autoHealToggle.checked
    };
  }

  function applySettings(settingsPatch) {
    const merged = Object.assign({}, getSettings(), settingsPatch || {});
    elements.modeInput.value = merged.mode;
    elements.seedInput.value = String(merged.seed);
    elements.intensityInput.value = String(merged.intensity);
    elements.densityInput.value = String(merged.density);
    elements.chunkSizeInput.value = String(merged.chunkSize);
    elements.focusInput.value = String(merged.focus);
    elements.guardInput.value = String(merged.guard);
    if (typeof merged.autoHeal === "boolean") {
      elements.autoHealToggle.checked = merged.autoHeal;
    }
    updateSettingsUI();
    scheduleRender(true);
  }

  function updateSettingsUI() {
    elements.intensityOutput.value = elements.intensityInput.value;
    elements.densityOutput.value = elements.densityInput.value;
    elements.chunkSizeOutput.value = elements.chunkSizeInput.value;
    elements.focusOutput.value = elements.focusInput.value;
    elements.guardOutput.value = elements.guardInput.value;
  }

  function applyLoopState() {
    const shouldLoop = elements.loopToggle.checked;
    elements.previewVideo.loop = shouldLoop;
    elements.originalVideo.loop = shouldLoop;
  }

  function restartPlayback() {
    if (!state.sourceFile) {
      return;
    }

    try {
      elements.previewVideo.currentTime = 0;
      if (elements.syncToggle.checked) {
        elements.originalVideo.currentTime = 0;
      }
      syncReferenceVideo();
    } catch (error) {}
  }

  function togglePlayback() {
    if (!state.sourceFile) {
      return;
    }

    if (elements.previewVideo.paused) {
      elements.previewVideo.play().catch(function () {});
      return;
    }

    elements.previewVideo.pause();
  }

  function toggleMute() {
    if (!state.sourceFile) {
      return;
    }

    elements.previewVideo.muted = !elements.previewVideo.muted;
    updateTransportButtons();
  }

  function seekPreview(deltaSeconds) {
    if (!state.sourceFile || !Number.isFinite(elements.previewVideo.duration)) {
      return;
    }

    const duration = elements.previewVideo.duration || 0;
    const nextTime = clampTime(elements.previewVideo.currentTime + deltaSeconds, 0, duration);

    try {
      elements.previewVideo.currentTime = nextTime;
      syncReferenceVideo();
    } catch (error) {}
  }

  function updateTransportButtons() {
    const hasVideo = Boolean(state.sourceFile);
    const isPaused = elements.previewVideo.paused;
    const isMuted = elements.previewVideo.muted;

    elements.restartButton.disabled = !hasVideo;
    elements.playPauseButton.disabled = !hasVideo;
    elements.muteButton.disabled = !hasVideo;
    elements.seekButtons.forEach(function (button) {
      button.disabled = !hasVideo;
    });

    elements.playPauseButton.textContent = isPaused ? "Play" : "Пауза";
    elements.muteButton.textContent = isMuted ? "Включить звук" : "Выключить звук";
  }

  function syncReferenceVideo() {
    if (!elements.syncToggle.checked || !state.originalUrl || !state.sourceFile) {
      return;
    }

    const preview = elements.previewVideo;
    const original = elements.originalVideo;

    if (!Number.isFinite(preview.currentTime)) {
      return;
    }

    const duration = Number.isFinite(original.duration) ? original.duration : preview.currentTime + 1;
    const targetTime = Math.min(preview.currentTime, Math.max(0, duration - 0.06));

    if (Math.abs(original.currentTime - targetTime) > 0.12) {
      try {
        original.currentTime = targetTime;
      } catch (error) {}
    }

    original.playbackRate = preview.playbackRate;

    if (preview.paused) {
      original.pause();
    } else if (original.paused) {
      original.play().catch(function () {});
    }
  }

  async function exportCurrentRender() {
    if (!state.lastRenderBuffer || !state.sourceFile || state.exportInProgress) {
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setStatusLine("В этом браузере нет MediaRecorder, поэтому render export недоступен.");
      return;
    }

    const exportPreset = resolveExportPreset(elements.exportFormatSelect.value);
    if (!exportPreset) {
      setStatusLine("Выбранный формат экспорта не поддерживается этим браузером.");
      return;
    }

    state.exportInProgress = true;
    elements.exportButton.disabled = true;
    elements.exportButton.textContent = "Rendering...";
    setStatusLine("Рендерю стабильную экспорт-версию из текущего glitch preview.");

    const playbackMimeType = state.sourceFile.type || "video/mp4";
    const playbackBlob = new Blob([state.lastRenderBuffer], { type: playbackMimeType });
    const playbackUrl = URL.createObjectURL(playbackBlob);
    const sourceVideo = document.createElement("video");
    const chunks = [];
    let recorder;
    let stream;

    try {
      sourceVideo.src = playbackUrl;
      sourceVideo.preload = "auto";
      sourceVideo.playsInline = true;
      sourceVideo.muted = true;
      sourceVideo.loop = false;
      sourceVideo.crossOrigin = "anonymous";

      await waitForMediaEvent(sourceVideo, "loadedmetadata", state.compatibility.decodeTimeoutMs);
      await waitForMediaEvent(sourceVideo, "canplay", state.compatibility.decodeTimeoutMs);

      stream = createRecordingStream(sourceVideo);
      recorder = new MediaRecorder(stream, { mimeType: exportPreset.mimeType });

      recorder.addEventListener("dataavailable", function (event) {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      });

      const stopPromise = new Promise(function (resolve, reject) {
        recorder.addEventListener("stop", resolve, { once: true });
        recorder.addEventListener("error", function () {
          reject(new Error("MediaRecorder error"));
        }, { once: true });
      });

      recorder.start(250);

      const playbackStart = sourceVideo.play();
      if (playbackStart && typeof playbackStart.then === "function") {
        await playbackStart;
      }

      await waitForMediaEvent(sourceVideo, "ended", Math.max(15000, state.compatibility.decodeTimeoutMs * 4));

      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      await stopPromise;

      if (!chunks.length) {
        throw new Error("No recorded chunks");
      }

      const extension = exportPreset.extension;
      const baseName = state.sourceFile.name.replace(/(\.[^./\\]+)$/, "");
      const settings = getSettings();
      const renderedBlob = new Blob(chunks, { type: exportPreset.mimeType });
      const downloadUrl = URL.createObjectURL(renderedBlob);
      const anchor = document.createElement("a");

      anchor.href = downloadUrl;
      anchor.download = baseName + "-rendered-" + settings.mode + "-" + settings.seed + extension;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(downloadUrl);

      setStatusLine(
        "Готово: скачан заново записанный render в " +
          extension.replace(".", "").toUpperCase() +
          ", он должен воспроизводиться стабильнее битого бинарника."
      );
    } catch (error) {
      setStatusLine(
        "Render export не удался. Формат " +
          exportPreset.label +
          " либо не пережил запись в этом браузере, либо текущий glitch слишком нестабилен."
      );
    } finally {
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }

      sourceVideo.pause();
      sourceVideo.removeAttribute("src");
      sourceVideo.load();
      URL.revokeObjectURL(playbackUrl);
      state.exportInProgress = false;
      elements.exportButton.textContent = "Render export";
      elements.exportButton.disabled = !state.lastRenderBuffer;
    }
  }

  function drawMutationMap(mapBins) {
    const canvas = elements.mutationCanvas;
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const bins = Array.isArray(mapBins) && mapBins.length ? mapBins : new Array(48).fill(0);
    const maxValue = Math.max(1, Math.max.apply(null, bins));

    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(4, 8, 15, 0.92)";
    context.fillRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(101, 242, 199, 0.18)");
    gradient.addColorStop(0.5, "rgba(139, 212, 255, 0.28)");
    gradient.addColorStop(1, "rgba(255, 132, 95, 0.24)");
    context.fillStyle = gradient;

    const gap = 6;
    const barWidth = (width - gap * (bins.length + 1)) / bins.length;

    bins.forEach(function (value, index) {
      const normalized = value / maxValue;
      const barHeight = Math.max(6, normalized * (height - 24));
      const x = gap + index * (barWidth + gap);
      const y = height - barHeight - 12;
      context.fillRect(x, y, barWidth, barHeight);
    });

    context.strokeStyle = "rgba(255, 255, 255, 0.08)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, height - 12);
    context.lineTo(width, height - 12);
    context.stroke();
  }

  function setDecodeStatus(text, level) {
    elements.decodeStatus.textContent = text;
    elements.decodeStatus.className = "decode-status decode-status-" + level;
  }

  function setStatusLine(text) {
    elements.statusLine.textContent = text;
  }

  function resetRenderState() {
    state.lastRenderMeta = null;
    state.lastRenderBuffer = null;
    state.analysis = null;
    state.renderSequence = 0;
    state.activePreviewRequestId = 0;

    elements.exportButton.disabled = true;
    elements.operationsValue.textContent = "0";
    elements.riskValue.textContent = "low";
    elements.mutableBytesValue.textContent = "0 MB";
    elements.mutatedBytesLabel.textContent = "0 bytes";
    elements.renderLatencyLabel.textContent = "0 ms";
    elements.formatBadge.textContent = "format: standby";
    elements.strategyBadge.textContent = "strategy: idle";
    updateTransportButtons();
    drawMutationMap([]);
  }

  function cleanupUrls() {
    if (state.worker) {
      state.worker.terminate();
    }
    if (state.workerObjectUrl) {
      URL.revokeObjectURL(state.workerObjectUrl);
    }
    if (state.originalUrl) {
      URL.revokeObjectURL(state.originalUrl);
    }
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
  }

  function formatBytes(bytes) {
    if (!bytes) {
      return "0 B";
    }

    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
    const value = bytes / Math.pow(1024, index);
    return value.toFixed(value >= 10 || index === 0 ? 0 : 1) + " " + units[index];
  }

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function clampTime(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function waitForMediaEvent(media, eventName, timeoutMs) {
    return new Promise(function (resolve, reject) {
      let timeoutId = 0;
      const onSuccess = function () {
        cleanup();
        resolve();
      };
      const onError = function () {
        cleanup();
        reject(new Error(eventName + " failed"));
      };
      const cleanup = function () {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        media.removeEventListener(eventName, onSuccess);
        media.removeEventListener("error", onError);
      };

      if (timeoutMs && timeoutMs > 0) {
        timeoutId = window.setTimeout(function () {
          cleanup();
          reject(new Error(eventName + " timeout"));
        }, timeoutMs);
      }

      media.addEventListener(eventName, onSuccess, { once: true });
      media.addEventListener("error", onError, { once: true });
    });
  }

  function verifyPreviewBlob(previewUrl) {
    const probeVideo = document.createElement("video");
    const timeoutMs = state.compatibility.probeTimeoutMs;

    return new Promise(function (resolve, reject) {
      let done = false;
      let timeoutId = 0;

      const cleanup = function () {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        probeVideo.pause();
        probeVideo.removeAttribute("src");
        probeVideo.load();
        probeVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
        probeVideo.removeEventListener("canplay", onCanPlay);
        probeVideo.removeEventListener("error", onError);
      };

      const finalize = function (handler) {
        if (done) {
          return;
        }
        done = true;
        cleanup();
        handler();
      };

      const onLoadedMetadata = function () {
        if (Number.isFinite(probeVideo.duration) && probeVideo.duration > 0) {
          return finalize(resolve);
        }
      };

      const onCanPlay = function () {
        finalize(resolve);
      };

      const onError = function () {
        finalize(function () {
          reject(new Error("preview probe decode error"));
        });
      };

      timeoutId = window.setTimeout(function () {
        finalize(function () {
          reject(new Error("preview probe timeout"));
        });
      }, timeoutMs);

      probeVideo.preload = "metadata";
      probeVideo.muted = true;
      probeVideo.playsInline = true;
      probeVideo.addEventListener("loadedmetadata", onLoadedMetadata);
      probeVideo.addEventListener("canplay", onCanPlay);
      probeVideo.addEventListener("error", onError);
      probeVideo.src = previewUrl;
      probeVideo.load();
    });
  }

  function createRecordingStream(sourceVideo) {
    if (typeof sourceVideo.captureStream === "function") {
      return sourceVideo.captureStream();
    }

    if (typeof sourceVideo.mozCaptureStream === "function") {
      return sourceVideo.mozCaptureStream();
    }

    const canvas = document.createElement("canvas");
    const width = Math.max(2, sourceVideo.videoWidth || 1280);
    const height = Math.max(2, sourceVideo.videoHeight || 720);
    const context = canvas.getContext("2d", { alpha: false });
    let rafId = 0;

    canvas.width = width;
    canvas.height = height;

    const drawFrame = function () {
      context.drawImage(sourceVideo, 0, 0, width, height);
      if (!sourceVideo.paused && !sourceVideo.ended) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    sourceVideo.addEventListener("play", function () {
      cancelAnimationFrame(rafId);
      drawFrame();
    });

    sourceVideo.addEventListener("pause", function () {
      cancelAnimationFrame(rafId);
    });

    sourceVideo.addEventListener("ended", function () {
      cancelAnimationFrame(rafId);
    });

    return canvas.captureStream(30);
  }

  function resolveExportPreset(selection) {
    const presets = {
      auto: [
        { label: "WEBM VP9", mimeType: "video/webm;codecs=vp9,opus", extension: ".webm" },
        { label: "WEBM VP8", mimeType: "video/webm;codecs=vp8,opus", extension: ".webm" },
        { label: "MP4 H.264", mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", extension: ".mp4" },
        { label: "MP4", mimeType: "video/mp4", extension: ".mp4" },
        { label: "OGG", mimeType: "video/ogg;codecs=theora,opus", extension: ".ogv" },
        { label: "MOV", mimeType: "video/quicktime", extension: ".mov" }
      ],
      webm: [
        { label: "WEBM VP9", mimeType: "video/webm;codecs=vp9,opus", extension: ".webm" },
        { label: "WEBM VP8", mimeType: "video/webm;codecs=vp8,opus", extension: ".webm" },
        { label: "WEBM", mimeType: "video/webm", extension: ".webm" }
      ],
      mp4: [
        { label: "MP4 H.264", mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", extension: ".mp4" },
        { label: "MP4", mimeType: "video/mp4", extension: ".mp4" }
      ],
      ogg: [
        { label: "OGG", mimeType: "video/ogg;codecs=theora,opus", extension: ".ogv" },
        { label: "OGG Basic", mimeType: "video/ogg", extension: ".ogv" }
      ],
      mov: [
        { label: "MOV", mimeType: "video/quicktime", extension: ".mov" }
      ]
    };

    const candidates = presets[selection] || presets.auto;

    for (let index = 0; index < candidates.length; index += 1) {
      if (MediaRecorder.isTypeSupported(candidates[index].mimeType)) {
        return candidates[index];
      }
    }

    return null;
  }
})();
