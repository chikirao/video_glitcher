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

  const formatOptionLabels = {
    auto: "AUTO",
    mp4: "MP4",
    webm: "WEBM",
    ogg: "OGG",
    mov: "MOV"
  };

  const uiText = {
    en: {
      heroLede:
        "Upload a clip, adjust the mutation envelope, inspect the live preview, and record the current render directly in the browser.",
      actionLabel: "Session",
      actionNote:
        "Upload a file and keep refining the current setup. The preview updates as the parameters move.",
      uploadVideo: "Upload video",
      randomize: "Randomize",
      exportFormat: "Export format",
      exportRender: "Export render",
      restart: "Restart",
      previewKicker: "Preview",
      noVideoLoaded: "No video loaded",
      dropTitle: "Drop a video here or use the upload control above.",
      dropNote:
        "MP4 and WebM remain the most reliable formats. Protected container sections stay intact while mutations move through the payload.",
      dropOverlayTitle: "Release the file to replace the current session.",
      dropOverlayNote: "Both players will refresh and the guarded ranges will be recalculated.",
      outputKicker: "Output",
      livePreview: "Live preview",
      sourceKicker: "Source",
      originalSync: "Original sync",
      syncReferencePlayer: "Sync reference player",
      resumePlaybackAfterRender: "Resume playback after render",
      loopPlayback: "Loop playback",
      mutationMap: "Mutation Map",
      byteActivity: "Byte activity across the file",
      controls: "Controls",
      controlsNote: "Tight adjustments and immediate feedback.",
      presets: "Presets",
      startingPoints: "Starting points",
      presetCodecDust: "Light",
      presetDatamoshLite: "Lobotomy",
      presetTapeBurst: "Schizophrenia",
      presetChecksumPanic: "Stroke",
      mutation: "Mutation",
      engineSettings: "Engine settings",
      mode: "Mode",
      seed: "Seed",
      reroll: "Reroll",
      intensity: "Intensity",
      density: "Density",
      chunkSize: "Chunk size",
      focusInFile: "Focus in file",
      guardRails: "Guard rails",
      autoHeal: "Auto-heal if the preview stops decoding",
      sessionData: "Session data",
      currentAnalysis: "Current analysis",
      mutablePayload: "Mutable payload",
      risk: "Risk",
      operations: "Operations",
      recoveries: "Recoveries",
      defaultStatusLine: "Upload a video to begin the container analysis and first render pass.",
      standby: "standby",
      previewReady: "Preview ready",
      analyzingContainer: "Analyzing container",
      readingFile: "Reading the file and locating guarded mutation ranges.",
      safariCompatibilityMode:
        "Safari compatibility mode is active. Preview rendering uses a more conservative profile.",
      inlineWorkerError:
        "The inline Web Worker could not start. Try Chromium, Firefox, or open the project through a local HTTP server.",
      workerError:
        "The Web Worker could not start. Try opening the project through a local HTTP server.",
      videoFileRequired: "A video file is required. Mutation starts after the container analysis completes.",
      safariFileLoaded: "File loaded. Safari uses a more conservative profile with stronger guard rails.",
      largeFile: "Large files can take noticeably longer to rebuild in the live preview.",
      analysisComplete: "Container analysis complete. {bytes} available across {ranges} guarded ranges.",
      verifyingRender: "Verifying render",
      runningDecodeProbe: "Running a decode probe before replacing the preview.",
      updatingPreview: "Updating preview",
      newRenderAssembled: "New render assembled: {operations} operations, risk {risk}.",
      previewDecodeFailed: "Preview decode failed",
      renderTooDamaged: "The current render is too damaged. Reduce intensity or density.",
      recoveryLimitReached: "Recovery limit reached",
      autoHealExhausted:
        "Auto-heal exhausted its attempts. Reduce intensity or density, or increase guard rails.",
      retryingRecovery: "Retrying recovery",
      probeRejected:
        "The decode probe rejected the render before the player switch. Rebuilding with stronger protection.",
      previewDidNotDecode: "The preview did not decode. Rebuilding with stronger protection.",
      renderingPreview: "Rendering preview",
      play: "Play",
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      mediaRecorderUnavailable: "MediaRecorder is not available in this browser, so export is unavailable.",
      exportFormatUnsupported: "The selected export format is not supported in this browser.",
      recordingStableExport: "Recording a more stable export from the current preview.",
      downloadComplete: "Download complete: recorded a fresh {format} export for more stable playback.",
      exportFailed:
        "Export failed. {label} could not be recorded in this browser, or the current render is too unstable.",
      rendering: "Rendering...",
      formatStandby: "format: standby",
      strategyIdle: "strategy: idle",
      bytesTouched: "{value} touched",
      riskLow: "low",
      riskMedium: "medium",
      riskHigh: "high"
    },
    ru: {
      heroLede:
        "Загрузи ролик, настрой мутацию, проверь превью и при необходимости запиши текущий рендер прямо в браузере.",
      actionLabel: "Сессия",
      actionNote: "Загрузи файл и продолжай настройку. Превью обновляется по мере изменения параметров.",
      uploadVideo: "Загрузить видео",
      randomize: "Рандом",
      exportFormat: "Формат экспорта",
      exportRender: "Экспорт рендера",
      restart: "С начала",
      previewKicker: "Превью",
      noVideoLoaded: "Видео не загружено",
      dropTitle: "Перетащи сюда видео или используй кнопку загрузки выше.",
      dropNote:
        "Лучше всего работают MP4 и WebM. Защищенные части контейнера остаются нетронутыми, а мутация уходит в payload.",
      dropOverlayTitle: "Отпусти файл, чтобы заменить текущую сессию.",
      dropOverlayNote: "Оба плеера обновятся, а безопасные диапазоны будут пересчитаны заново.",
      outputKicker: "Результат",
      livePreview: "Live preview",
      sourceKicker: "Исходник",
      originalSync: "Оригинал",
      syncReferencePlayer: "Синхронить референс",
      resumePlaybackAfterRender: "Продолжать после рендера",
      loopPlayback: "Зациклить воспроизведение",
      mutationMap: "Карта мутаций",
      byteActivity: "Активность байтов по файлу",
      controls: "Управление",
      controlsNote: "Точные настройки и мгновенный отклик.",
      presets: "Пресеты",
      startingPoints: "Стартовые точки",
      presetCodecDust: "лайт",
      presetDatamoshLite: "лоботомия",
      presetTapeBurst: "шизофрения",
      presetChecksumPanic: "инсульт",
      mutation: "Мутация",
      engineSettings: "Настройки движка",
      mode: "Режим",
      seed: "Сид",
      reroll: "Сменить",
      intensity: "Интенсивность",
      density: "Плотность",
      chunkSize: "Размер чанка",
      focusInFile: "Фокус по файлу",
      guardRails: "Guard rails",
      autoHeal: "Автовосстановление, если превью перестает декодироваться",
      sessionData: "Данные сессии",
      currentAnalysis: "Текущий анализ",
      mutablePayload: "Изменяемый payload",
      risk: "Риск",
      operations: "Операции",
      recoveries: "Восстановления",
      defaultStatusLine: "Загрузи видео, чтобы начать анализ контейнера и первый проход рендера.",
      standby: "ожидание",
      previewReady: "Превью готово",
      analyzingContainer: "Анализ контейнера",
      readingFile: "Читаю файл и ищу безопасные диапазоны для мутации.",
      safariCompatibilityMode:
        "Включен Safari-режим совместимости. Превью рендерится в более осторожном профиле.",
      inlineWorkerError:
        "Не удалось запустить встроенный Web Worker. Попробуй Chromium, Firefox или локальный HTTP-сервер.",
      workerError: "Не удалось запустить Web Worker. Попробуй открыть проект через локальный HTTP-сервер.",
      videoFileRequired: "Нужен именно видеофайл. Мутация стартует после анализа контейнера.",
      safariFileLoaded: "Файл загружен. Для Safari включен более осторожный профиль и усиленные guard rails.",
      largeFile: "Большие файлы могут заметно дольше пересобираться в live preview.",
      analysisComplete: "Анализ контейнера завершен. Доступно {bytes} в {ranges} безопасных диапазонах.",
      verifyingRender: "Проверка рендера",
      runningDecodeProbe: "Запускаю decode probe перед заменой превью.",
      updatingPreview: "Обновление превью",
      newRenderAssembled: "Новый рендер собран: {operations} операций, риск {risk}.",
      previewDecodeFailed: "Превью не декодируется",
      renderTooDamaged: "Текущий рендер слишком поврежден. Уменьши intensity или density.",
      recoveryLimitReached: "Лимит восстановления достигнут",
      autoHealExhausted:
        "Auto-heal исчерпал попытки. Уменьши intensity или density, либо увеличь guard rails.",
      retryingRecovery: "Повторное восстановление",
      probeRejected: "Decode probe отклонил рендер до замены плеера. Пересобираю с усиленной защитой.",
      previewDidNotDecode: "Превью не декодируется. Пересобираю с усиленной защитой.",
      renderingPreview: "Сборка превью",
      play: "Play",
      pause: "Pause",
      mute: "Без звука",
      unmute: "Со звуком",
      mediaRecorderUnavailable: "В этом браузере нет MediaRecorder, поэтому экспорт недоступен.",
      exportFormatUnsupported: "Выбранный формат экспорта не поддерживается этим браузером.",
      recordingStableExport: "Записываю более стабильный экспорт из текущего превью.",
      downloadComplete: "Готово: записан новый {format} файл для более стабильного воспроизведения.",
      exportFailed: "Экспорт не удался. {label} не записался в этом браузере или текущий рендер слишком нестабилен.",
      rendering: "Рендер...",
      formatStandby: "format: ожидание",
      strategyIdle: "strategy: idle",
      bytesTouched: "{value} изменено",
      riskLow: "низкий",
      riskMedium: "средний",
      riskHigh: "высокий"
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
    ui: {
      theme: "light",
      language: "ru",
      decodeStatusKey: "standby",
      decodeStatusLevel: "idle",
      decodeStatusValues: null,
      statusLineKey: "defaultStatusLine",
      statusLineValues: null
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
    exportFormatPicker: document.getElementById("exportFormatPicker"),
    exportFormatTrigger: document.getElementById("exportFormatTrigger"),
    exportFormatValue: document.getElementById("exportFormatValue"),
    exportFormatMenu: document.getElementById("exportFormatMenu"),
    exportFormatOptions: Array.from(document.querySelectorAll("[data-export-format-option]")),
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
    themeToggle: document.getElementById("themeToggle"),
    languageToggle: document.getElementById("languageToggle"),
    translatableNodes: Array.from(document.querySelectorAll("[data-i18n]")),
    seekButtons: Array.from(document.querySelectorAll("[data-seek]"))
  };

  init();

  function init() {
    initPreferences();
    initThemeAndLanguageControls();
    initExportFormatPicker();
    applyStaticTranslations();
    initControls();
    initDragAndDrop();
    initPlaybackSync();
    applyLoopState();
    updateSettingsUI();
    updateTransportButtons();
    resetRenderState();
    detectCompatibilityProfile();
    initWorker();
  }

  function initPreferences() {
    applyTheme(getCookie("video_glitcher_theme") || "light");
    applyLanguage(getCookie("video_glitcher_language") || "ru");
  }

  function initThemeAndLanguageControls() {
    elements.themeToggle.addEventListener("click", function () {
      applyTheme(state.ui.theme === "dark" ? "light" : "dark");
    });

    elements.languageToggle.addEventListener("click", function () {
      applyLanguage(state.ui.language === "ru" ? "en" : "ru");
    });
  }

  function initExportFormatPicker() {
    syncExportFormatPicker();

    elements.exportFormatTrigger.addEventListener("click", function () {
      if (elements.exportFormatMenu.hidden) {
        openFormatMenu();
        return;
      }

      closeFormatMenu();
    });

    elements.exportFormatTrigger.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFormatMenu();
        focusSelectedFormatOption();
      }
    });

    elements.exportFormatSelect.addEventListener("change", syncExportFormatPicker);

    elements.exportFormatOptions.forEach(function (optionButton, index) {
      optionButton.addEventListener("click", function () {
        setExportFormat(optionButton.dataset.exportFormatOption || "auto");
        closeFormatMenu();
        elements.exportFormatTrigger.focus();
      });

      optionButton.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeFormatMenu();
          elements.exportFormatTrigger.focus();
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          elements.exportFormatOptions[(index + 1) % elements.exportFormatOptions.length].focus();
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          elements.exportFormatOptions[
            (index - 1 + elements.exportFormatOptions.length) % elements.exportFormatOptions.length
          ].focus();
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!elements.exportFormatPicker.contains(event.target)) {
        closeFormatMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeFormatMenu();
      }
    });
  }

  function applyTheme(theme) {
    state.ui.theme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", state.ui.theme);
    elements.themeToggle.setAttribute("aria-pressed", String(state.ui.theme === "dark"));
    setCookie("video_glitcher_theme", state.ui.theme);
    drawMutationMap((state.lastRenderMeta && state.lastRenderMeta.mapBins) || []);
  }

  function applyLanguage(language) {
    state.ui.language = language === "en" ? "en" : "ru";
    document.documentElement.lang = state.ui.language;
    elements.languageToggle.textContent = state.ui.language.toUpperCase();
    setCookie("video_glitcher_language", state.ui.language);
    applyStaticTranslations();
    refreshLocalizedRuntimeText();
    updateTransportButtons();
    syncExportFormatPicker();
  }

  function applyStaticTranslations() {
    elements.translatableNodes.forEach(function (node) {
      node.textContent = translate(node.dataset.i18n);
    });

    if (!state.sourceFile) {
      elements.fileLabel.textContent = translate("noVideoLoaded");
    }

    elements.exportButton.textContent = state.exportInProgress
      ? translate("rendering")
      : translate("exportRender");
  }

  function refreshLocalizedRuntimeText() {
    elements.decodeStatus.textContent = translate(state.ui.decodeStatusKey, state.ui.decodeStatusValues);
    elements.decodeStatus.className = "decode-status decode-status-" + state.ui.decodeStatusLevel;
    elements.statusLine.textContent = translate(state.ui.statusLineKey, state.ui.statusLineValues);

    if (!state.analysis) {
      elements.formatBadge.textContent = translate("formatStandby");
      elements.strategyBadge.textContent = translate("strategyIdle");
    }

    if (!state.sourceFile) {
      elements.fileLabel.textContent = translate("noVideoLoaded");
    }

    elements.exportButton.textContent = state.exportInProgress
      ? translate("rendering")
      : translate("exportRender");

    elements.riskValue.textContent = localizeRiskLabel(elements.riskValue.dataset.riskLabel || "low");
  }

  function translate(key, values) {
    const current = uiText[state.ui.language] || uiText.ru;
    const fallback = uiText.en || {};
    const template = current[key] || fallback[key] || key;
    return template.replace(/\{(\w+)\}/g, function (_, token) {
      return values && values[token] != null ? String(values[token]) : "";
    });
  }

  function localizeRiskLabel(label) {
    const riskKeyMap = {
      low: "riskLow",
      medium: "riskMedium",
      high: "riskHigh"
    };

    return translate(riskKeyMap[label] || label);
  }

  function setCookie(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value) + "; max-age=31536000; path=/";

    try {
      window.localStorage.setItem(name, value);
    } catch (error) {}
  }

  function getCookie(name) {
    const pattern = "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)";
    const match = document.cookie.match(new RegExp(pattern));
    if (match) {
      return decodeURIComponent(match[1]);
    }

    try {
      return window.localStorage.getItem(name) || "";
    } catch (error) {
      return "";
    }
  }

  function setExportFormat(value) {
    const normalizedValue = formatOptionLabels[value] ? value : "auto";
    elements.exportFormatSelect.value = normalizedValue;
    syncExportFormatPicker();
  }

  function syncExportFormatPicker() {
    const selection = elements.exportFormatSelect.value || "auto";
    elements.exportFormatValue.textContent = formatOptionLabels[selection] || formatOptionLabels.auto;
    elements.exportFormatOptions.forEach(function (optionButton) {
      optionButton.setAttribute(
        "aria-selected",
        String(optionButton.dataset.exportFormatOption === selection)
      );
    });
  }

  function openFormatMenu() {
    elements.exportFormatMenu.hidden = false;
    elements.exportFormatTrigger.setAttribute("aria-expanded", "true");
  }

  function closeFormatMenu() {
    elements.exportFormatMenu.hidden = true;
    elements.exportFormatTrigger.setAttribute("aria-expanded", "false");
  }

  function focusSelectedFormatOption() {
    const activeButton = elements.exportFormatOptions.find(function (optionButton) {
      return optionButton.dataset.exportFormatOption === elements.exportFormatSelect.value;
    });

    (activeButton || elements.exportFormatOptions[0]).focus();
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
    setStatusLine("safariCompatibilityMode");
  }

  function initWorker() {
    const workerConfig = resolveWorkerConfig();

    try {
      state.worker = new Worker(workerConfig.url);
      state.worker.addEventListener("message", handleWorkerMessage);
      state.worker.addEventListener("error", function () {
        setDecodeStatus("workerError", "error");
        setStatusLine(workerConfig.errorMessageKey);
      });
    } catch (error) {
      setDecodeStatus("workerError", "error");
      setStatusLine(workerConfig.errorMessageKey);
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
        errorMessageKey: "inlineWorkerError"
      };
    }

    return {
      url: "glitch-worker.js",
      errorMessageKey: "workerError"
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

    setStatusLine("videoFileRequired");
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
      setDecodeStatus("previewReady", "live");
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
    setDecodeStatus("analyzingContainer", "idle");
    setStatusLine("readingFile");

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
      setStatusLine("safariFileLoaded");
    }

    if (file.size > 320 * 1024 * 1024) {
      setStatusLine("largeFile");
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
    elements.strategyBadge.textContent = "strategy: " + (analysis.strategyLabel || "guarded range");
    elements.mutableBytesValue.textContent = formatBytes(analysis.totalMutableBytes || 0);
    setStatusLine("analysisComplete", {
      bytes: formatBytes(analysis.totalMutableBytes || 0),
      ranges: String(analysis.rangeCount || 0)
    });
  }

  function updateRenderTelemetry(meta) {
    elements.mutatedBytesLabel.textContent = translate("bytesTouched", {
      value: formatBytes(meta.mutatedBytes || 0)
    });
    elements.renderLatencyLabel.textContent = String(meta.elapsedMs || 0) + " ms";
    elements.operationsValue.textContent = String(meta.operations || 0);
    elements.riskValue.dataset.riskLabel = meta.riskLabel || "low";
    elements.riskValue.textContent = localizeRiskLabel(meta.riskLabel || "low");
    elements.recoveryValue.textContent = String(state.recoveries);
    drawMutationMap(meta.mapBins || []);
  }

  function applyPreviewBuffer(buffer, meta) {
    const mimeType = (state.sourceFile && state.sourceFile.type) || meta.preferredMime || "video/mp4";
    const blob = new Blob([buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const currentTime = Number.isFinite(elements.previewVideo.currentTime) ? elements.previewVideo.currentTime : 0;
    const resume = !elements.previewVideo.paused;

    setDecodeStatus("verifyingRender", "warning");
    setStatusLine("runningDecodeProbe");

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
      setDecodeStatus("updatingPreview", "warning");
      setStatusLine("newRenderAssembled", {
        operations: String(meta.operations || 0),
        risk: localizeRiskLabel(meta.riskLabel || "low")
      });
    }).catch(function () {
      URL.revokeObjectURL(url);
      handlePreviewError(true);
    });
  }

  function handlePreviewError(fromProbe) {
    if (!state.sourceFile || !getSettings().autoHeal) {
      setDecodeStatus("previewDecodeFailed", "error");
      setStatusLine("renderTooDamaged");
      return;
    }

    if (state.recoveries >= 3) {
      setDecodeStatus("recoveryLimitReached", "error");
      setStatusLine("autoHealExhausted");
      return;
    }

    state.recoveries += 1;
    elements.recoveryValue.textContent = String(state.recoveries);
    setDecodeStatus("retryingRecovery", "warning");
    setStatusLine(fromProbe ? "probeRejected" : "previewDidNotDecode");
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
    setDecodeStatus("renderingPreview", "idle");

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

    elements.playPauseButton.textContent = isPaused ? translate("play") : translate("pause");
    elements.muteButton.textContent = isMuted ? translate("unmute") : translate("mute");
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
      setStatusLine("mediaRecorderUnavailable");
      return;
    }

    const exportPreset = resolveExportPreset(elements.exportFormatSelect.value);
    if (!exportPreset) {
      setStatusLine("exportFormatUnsupported");
      return;
    }

    state.exportInProgress = true;
    elements.exportButton.disabled = true;
    elements.exportButton.textContent = translate("rendering");
    setStatusLine("recordingStableExport");

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

      setStatusLine("downloadComplete", {
        format: extension.replace(".", "").toUpperCase()
      });
    } catch (error) {
      setStatusLine("exportFailed", { label: exportPreset.label });
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
      elements.exportButton.textContent = translate("exportRender");
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
    const styles = getComputedStyle(document.documentElement);

    context.fillStyle = styles.getPropertyValue("--canvas-bg").trim() || "#f3f3f3";
    context.fillRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, styles.getPropertyValue("--canvas-start").trim() || "rgba(17, 17, 17, 0.12)");
    gradient.addColorStop(0.5, styles.getPropertyValue("--canvas-mid").trim() || "rgba(17, 17, 17, 0.28)");
    gradient.addColorStop(1, styles.getPropertyValue("--canvas-end").trim() || "rgba(17, 17, 17, 0.18)");
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

    context.strokeStyle = styles.getPropertyValue("--canvas-line").trim() || "#d4d4d4";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, height - 12);
    context.lineTo(width, height - 12);
    context.stroke();
  }

  function setDecodeStatus(key, level, values) {
    state.ui.decodeStatusKey = key;
    state.ui.decodeStatusLevel = level;
    state.ui.decodeStatusValues = values || null;
    elements.decodeStatus.textContent = translate(key, values);
    elements.decodeStatus.className = "decode-status decode-status-" + level;
  }

  function setStatusLine(key, values) {
    state.ui.statusLineKey = key;
    state.ui.statusLineValues = values || null;
    elements.statusLine.textContent = translate(key, values);
  }

  function resetRenderState() {
    state.lastRenderMeta = null;
    state.lastRenderBuffer = null;
    state.analysis = null;
    state.renderSequence = 0;
    state.activePreviewRequestId = 0;

    elements.exportButton.disabled = true;
    elements.operationsValue.textContent = "0";
    elements.riskValue.dataset.riskLabel = "low";
    elements.riskValue.textContent = localizeRiskLabel("low");
    elements.mutableBytesValue.textContent = "0 MB";
    elements.mutatedBytesLabel.textContent = translate("bytesTouched", { value: "0 B" });
    elements.renderLatencyLabel.textContent = "0 ms";
    elements.formatBadge.textContent = translate("formatStandby");
    elements.strategyBadge.textContent = translate("strategyIdle");
    elements.fileLabel.textContent = translate("noVideoLoaded");
    setDecodeStatus("standby", "idle");
    setStatusLine("defaultStatusLine");
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
        { label: "MP4 H.264", mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", extension: ".mp4" },
        { label: "MP4", mimeType: "video/mp4", extension: ".mp4" },
        { label: "WEBM VP9", mimeType: "video/webm;codecs=vp9,opus", extension: ".webm" },
        { label: "WEBM VP8", mimeType: "video/webm;codecs=vp8,opus", extension: ".webm" },
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
