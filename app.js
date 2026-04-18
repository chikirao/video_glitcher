"use strict";

(function () {
  const siteConfig = window.GLITCHY_SITE || {};
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

  const releaseConfig = {
    version: siteConfig.version || "1.2.2",
    defaultDesktopProfile: "balanced",
    defaultAppleProfile: "apple-canvas",
    defaultExportStrategy: "stable"
  };

  const renderProfileConfigs = {
    standard: {
      engine: "binary",
      decodeTimeoutMs: 2600,
      probeTimeoutMs: 2200,
      requireFrameProbe: false,
      controlClamp: null
    },
    balanced: {
      engine: "binary",
      decodeTimeoutMs: 3200,
      probeTimeoutMs: 2800,
      requireFrameProbe: false,
      controlClamp: {
        guardMin: 78
      }
    },
    "apple-canvas": {
      engine: "visual",
      decodeTimeoutMs: 3400,
      probeTimeoutMs: 2600,
      requireFrameProbe: false,
      controlClamp: {
        intensityMax: 62,
        densityMax: 58,
        chunkSizeMax: 18,
        guardMin: 22,
        autoHeal: false,
        disableAutoplay: true
      }
    },
    "apple-safe": {
      engine: "binary",
      decodeTimeoutMs: 4800,
      probeTimeoutMs: 4400,
      requireFrameProbe: true,
      controlClamp: {
        intensityMax: 28,
        densityMax: 14,
        chunkSizeMax: 6,
        guardMin: 90,
        autoHeal: true,
        disableAutoplay: true
      }
    },
    "apple-ultra-safe": {
      engine: "binary",
      decodeTimeoutMs: 5600,
      probeTimeoutMs: 5200,
      requireFrameProbe: true,
      controlClamp: {
        intensityMax: 20,
        densityMax: 10,
        chunkSizeMax: 3,
        guardMin: 94,
        autoHeal: true,
        disableAutoplay: true
      }
    }
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
      autoHeal: "Auto-heal",
      autoHealHint:
        "This helps the app automatically reduce the current render when the browser stops decoding the preview.",
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
      riskHigh: "high",
      renderLab: "Render lab",
      renderLabNote:
        "Open this page with ?lab=1 to compare experimental render and export strategies without touching the default flow.",
      renderProfile: "Render profile",
      labExportStrategy: "Export mode",
      labActiveProfile: "Active profile",
      labDetectedDevice: "Detected device",
      labDecodeProbe: "Decode probe",
      labResolvedExport: "Resolved export",
      labProfileAuto: "Auto detect",
      labProfileStandard: "Standard",
      labProfileBalanced: "Balanced",
      labProfileAppleCanvas: "Apple canvas",
      labProfileAppleSafe: "Apple safe",
      labProfileAppleUltra: "Apple ultra-safe",
      labExportAuto: "Auto",
      labExportStable: "Stable re-record",
      labExportDirect: "Fast binary",
      labDeviceApple: "Apple / Safari",
      labDeviceDesktop: "Desktop / other",
      labProbeBasic: "Basic metadata",
      labProbeFrame: "Frame advance",
      pipelineBadge: "pipeline: {profile} + {export}",
      renderEngineBadgeBinary: "binary",
      renderEngineBadgeVisual: "canvas fx",
      balancedCompatibilityMode:
        "Balanced render profile is active. Large files use a more conservative mutation budget.",
      appleCanvasCompatibilityMode:
        "Apple canvas profile is active. Safari preview now uses a separate frame compositor instead of binary corruption.",
      appleUltraCompatibilityMode:
        "Apple ultra-safe profile is active. Mutations are minimized to protect decoding on Safari and iPhone.",
      appleCanvasFileLoaded:
        "File loaded. Apple canvas mode uses the original video as a stable source and renders glitches over it frame by frame.",
      fastExportStarted: "Preparing a direct binary export from the verified render.",
      fastExportComplete:
        "Download complete: the current mutated file was saved without real-time re-recording.",
      exportFallbackDirect:
        "Stable recording failed, so the app saved the verified mutated file directly instead.",
      mediaRecorderUnavailable:
        "MediaRecorder is not available in this browser. Use Fast binary export in the render lab.",
      mediaModeNavigation: "Media mode",
      tabVideo: "video",
      tabPhoto: "photo",
      tabAudio: "audio",
      photoActionNote:
        "Upload an image and bend the real file bytes. The preview stays local and avoids fake visual overlays.",
      uploadPhoto: "Upload photo",
      imageRenderFormat: "Render format",
      renderPhoto: "Render photo",
      noPhotoLoaded: "No photo loaded",
      photoDropTitle: "Drop an image here or use the upload control above.",
      photoDropNote:
        "JPEG and BMP stay stable most often. PNG and GIF use a more cautious mutation budget to remain decodable.",
      photoDropOverlayNote:
        "The preview and reference refresh together, and guarded mutation ranges will be recalculated.",
      photoLivePreview: "Live preview",
      originalStill: "Original still",
      photoByteActivity: "Byte activity across the image",
      photoControls: "Photo",
      photoControlsNote: "Binary corruption with decode verification and a safer render export.",
      photoEffectStrip: "Effects",
      photoEffectStripNote: "Bands, fractures, and hard JPEG break-up",
      photoPresetJpegFracture: "jpeg fracture",
      photoPresetScanDrift: "scan drift",
      photoPresetPaletteBruise: "palette bruise",
      photoPresetCrcPanic: "crc panic",
      photoPresetJpegCollapse: "jpeg collapse",
      imageEngineSettings: "Image engine settings",
      photoEffectMode: "Effect",
      photoSeed: "Seed",
      photoDamage: "Damage",
      photoCount: "Count",
      photoRepeats: "Repeats",
      photoStartBias: "Start bias",
      photoQuality: "Quality",
      photoAutoHealHint:
        "This verifies each glitched image before it replaces the preview and automatically softens unstable renders.",
      photoAutoHeal: "Verify decode",
      photoAutoTune: "Autotune decode",
      photoCurrentAnalysis: "Current photo analysis",
      photoDefaultStatusLine:
        "Upload a photo to build guarded ranges and the first live binary preview.",
      photoReadingFile: "Reading the image and locating safer mutation ranges.",
      photoAnalysisComplete:
        "Image analysis complete. {bytes} available across {ranges} guarded ranges.",
      photoPreviewReady: "Photo preview ready",
      photoVerifying: "Verifying image preview",
      photoRendering: "Rendering image preview",
      photoPreviewDecodeFailed: "Image preview failed to decode",
      photoRetrying: "Retrying a safer image render",
      photoRenderSaved: "Photo render saved.",
      photoRenderFailed: "Photo render failed. The current glitch could not be exported safely.",
      photoFileRequired: "An image file is required for the photo mode.",
      audioActionNote:
        "Upload audio, blend in artifacts, inspect the live result, and export a fresh local render.",
      uploadAudio: "Upload audio",
      audioRenderFormat: "Export format",
      renderAudio: "Render audio",
      noAudioLoaded: "No audio loaded",
      audioDropTitle: "Drop an audio file here or use the upload control above.",
      audioDropNote:
        "The engine combines stutter, wow/flutter, hiss, and buffer repeats into a local preview render.",
      audioDropOverlayNote: "Both players and the effect timeline will refresh after the next local render.",
      audioLivePreview: "Live preview",
      audioStageNote: "The render is built locally and immediately replaces the preview player.",
      audioOriginalNote: "Keep the dry reference nearby to compare attacks, hiss, and structural breaks.",
      audioActivity: "Effect activity across the timeline",
      audioControls: "Audio",
      audioControlsNote: "Local effect rendering: tape drag, noise bursts, stutter, and buffer damage.",
      audioSceneStrip: "Scenes",
      audioSceneStripNote: "Tape ruin, buffer slips, and harder signal abuse",
      audioPresetTapeRuin: "tape ruin",
      audioPresetBufferSkip: "buffer skip",
      audioPresetVhsWhine: "vhs whine",
      audioPresetPcmBruise: "pcm bruise",
      audioEngineSettings: "Audio engine settings",
      audioEffectMode: "Effect",
      audioSeed: "Seed",
      audioDrive: "Drive",
      audioBursts: "Bursts",
      audioWindow: "Buffer window",
      audioFocus: "Timeline focus",
      audioContainment: "Containment",
      audioLimiterHint:
        "Keeps aggressive renders from clipping too hard when noise bursts and stutters pile up.",
      audioLimiter: "Limit peaks",
      audioPeakLimiter: "Peak limiter",
      audioCurrentAnalysis: "Current audio analysis",
      audioDuration: "Duration",
      audioSampleRate: "Sample rate",
      audioDefaultStatusLine:
        "Upload audio to build the first local preview render and the effect timeline.",
      audioReadingFile: "Decoding audio and preparing the local render engine.",
      audioPreviewReady: "Audio preview ready",
      audioRendering: "Rendering audio preview",
      audioRenderSaved: "Audio render saved.",
      audioRenderFailed: "Audio render failed. The current setup could not be exported.",
      audioFileRequired: "An audio file is required for the audio mode."
      ,
      appleVideoNoticeKicker: "Attention",
      appleVideoNoticeTitle: "Video glitching currently works very poorly on Apple devices.",
      appleVideoNoticeBody:
        "Video corruption on iPhone, iPad, and macOS Safari is unstable right now, so it is better to try the photo or audio modes instead.",
      appleVideoNoticeOk: "OK"
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
      autoHeal: "Автовосстановление",
      autoHealHint:
        "Это нужно для того, чтобы при ошибке декодирования приложение автоматически ослабляло текущий рендер.",
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
      riskHigh: "высокий",
      renderLab: "Render lab",
      renderLabNote:
        "Открывай страницу с ?lab=1, чтобы сравнивать экспериментальные режимы рендера и экспорта отдельно от обычного сценария.",
      renderProfile: "Профиль рендера",
      labExportStrategy: "Режим экспорта",
      labActiveProfile: "Активный профиль",
      labDetectedDevice: "Определённое устройство",
      labDecodeProbe: "Decode probe",
      labResolvedExport: "Итоговый экспорт",
      labProfileAuto: "Автоопределение",
      labProfileStandard: "Standard",
      labProfileBalanced: "Balanced",
      labProfileAppleCanvas: "Apple canvas",
      labProfileAppleSafe: "Apple safe",
      labProfileAppleUltra: "Apple ultra-safe",
      labExportAuto: "Авто",
      labExportStable: "Стабильный rerecord",
      labExportDirect: "Быстрый бинарник",
      labDeviceApple: "Apple / Safari",
      labDeviceDesktop: "Desktop / other",
      labProbeBasic: "Базовый metadata",
      labProbeFrame: "Проверка кадров",
      pipelineBadge: "pipeline: {profile} + {export}",
      renderEngineBadgeBinary: "binary",
      renderEngineBadgeVisual: "canvas fx",
      balancedCompatibilityMode:
        "Включен balanced-профиль рендера. Для больших файлов бюджет мутаций автоматически осторожнее.",
      appleCanvasCompatibilityMode:
        "Включен Apple canvas профиль. Для Safari превью теперь строится отдельным кадровым композитором, а не порчей бинарника.",
      appleUltraCompatibilityMode:
        "Включен Apple ultra-safe профиль. Мутации максимально ослаблены, чтобы Safari и iPhone чаще держали декодирование.",
      appleCanvasFileLoaded:
        "Файл загружен. В Apple canvas режиме исходное видео остаётся стабильным источником, а глитчи рисуются поверх кадр за кадром.",
      fastExportStarted: "Готовлю прямой бинарный экспорт из уже проверенного рендера.",
      fastExportComplete:
        "Готово: текущий мутированный файл сохранён без realtime-перезаписи через MediaRecorder.",
      exportFallbackDirect:
        "Стабильная перезапись не удалась, поэтому приложение сохранило напрямую уже проверенный мутированный файл.",
      mediaRecorderUnavailable:
        "В этом браузере нет MediaRecorder. Используй режим «Быстрый бинарник» в render lab.",
      mediaModeNavigation: "Режим медиа",
      tabVideo: "видео",
      tabPhoto: "фото",
      tabAudio: "аудио",
      photoActionNote:
        "Загрузи изображение и ломай байты фото. Превью строится локально.",
      uploadPhoto: "Загрузить фото",
      imageRenderFormat: "Формат рендера",
      renderPhoto: "Рендер фото",
      noPhotoLoaded: "Фото не загружено",
      photoDropTitle: "Перетащи сюда изображение или используй кнопку загрузки выше.",
      photoDropNote:
        "JPEG и BMP держатся стабильнее всего. Для PNG и GIF приложение осторожнее ограничивает мутации, чтобы файл оставался декодируемым.",
      photoDropOverlayNote:
        "Превью и референс обновятся вместе, а безопасные диапазоны будут пересчитаны заново.",
      photoLivePreview: "Live preview",
      originalStill: "Оригинал",
      photoByteActivity: "Активность байтов по изображению",
      photoControls: "Фото",
      photoControlsNote: "Бинарный corruption с проверкой декодирования и более безопасным render export.",
      photoEffectStrip: "Эффекты",
      photoEffectStripNote: "Полосы, развалы и жёсткая JPEG-ломаность",
      photoPresetJpegFracture: "jpeg fracture",
      photoPresetScanDrift: "scan drift",
      photoPresetPaletteBruise: "palette bruise",
      photoPresetCrcPanic: "crc panic",
      photoPresetJpegCollapse: "jpeg collapse",
      imageEngineSettings: "Настройки image engine",
      photoEffectMode: "Эффект",
      photoSeed: "Сид",
      photoDamage: "Повреждение",
      photoCount: "Количество",
      photoRepeats: "Повторения",
      photoStartBias: "Начальное значение",
      photoQuality: "Качество",
      photoAutoHealHint:
        "Перед заменой превью приложение проверяет, что глитч ещё декодируется, и автоматически смягчает слишком опасный рендер.",
      photoAutoHeal: "Проверять декодирование",
      photoAutoTune: "Автонастройка декода",
      photoCurrentAnalysis: "Текущий анализ фото",
      photoDefaultStatusLine:
        "Загрузи фото, чтобы построить безопасные диапазоны и первое живое бинарное превью.",
      photoReadingFile: "Читаю изображение и ищу более безопасные диапазоны для мутации.",
      photoAnalysisComplete:
        "Анализ изображения завершён. Доступно {bytes} в {ranges} безопасных диапазонах.",
      photoPreviewReady: "Фото-превью готово",
      photoVerifying: "Проверяю превью изображения",
      photoRendering: "Собираю превью изображения",
      photoPreviewDecodeFailed: "Превью изображения не декодируется",
      photoRetrying: "Пересобираю более безопасный image render",
      photoRenderSaved: "Рендер фото сохранён.",
      photoRenderFailed: "Рендер фото не удался. Текущий глитч не получилось безопасно экспортировать.",
      photoFileRequired: "Для фото-режима нужен именно файл изображения.",
      audioActionNote:
        "Загрузи аудио, подмешай артефакты, послушай live result и сохрани новый локальный рендер.",
      uploadAudio: "Загрузить аудио",
      audioRenderFormat: "Формат экспорта",
      renderAudio: "Рендер аудио",
      noAudioLoaded: "Аудио не загружено",
      audioDropTitle: "Перетащи сюда аудиофайл или используй кнопку загрузки выше.",
      audioDropNote:
        "Движок сочетает stutter, wow/flutter, hiss и buffer repeats в локальном preview-рендере.",
      audioDropOverlayNote: "Оба плеера и таймлайн эффектов обновятся после следующего локального рендера.",
      audioLivePreview: "Live preview",
      audioStageNote: "Рендер строится локально и сразу заменяет preview player.",
      audioOriginalNote: "Держи dry-референс рядом, чтобы сравнивать атаку, hiss и развалы структуры.",
      audioActivity: "Активность эффектов по таймлайну",
      audioControls: "Аудио",
      audioControlsNote: "Локальный effect render: tape drag, шумовые всплески, stutter и buffer damage.",
      audioSceneStrip: "Сцены",
      audioSceneStripNote: "Лента, срывы буфера и жёсткий перегиб сигнала",
      audioPresetTapeRuin: "tape ruin",
      audioPresetBufferSkip: "buffer skip",
      audioPresetVhsWhine: "vhs whine",
      audioPresetPcmBruise: "pcm bruise",
      audioEngineSettings: "Настройки audio engine",
      audioEffectMode: "Эффект",
      audioSeed: "Сид",
      audioDrive: "Драйв",
      audioBursts: "Всплески",
      audioWindow: "Окно буфера",
      audioFocus: "Фокус таймлайна",
      audioContainment: "Сдерживание",
      audioLimiterHint:
        "Сдерживает пики, когда noise bursts и stutter начинают слишком сильно клиппить итоговый рендер.",
      audioLimiter: "Сдерживать пики",
      audioPeakLimiter: "Пик-лимитер",
      audioCurrentAnalysis: "Текущий анализ аудио",
      audioDuration: "Длительность",
      audioSampleRate: "Sample rate",
      audioDefaultStatusLine:
        "Загрузи аудио, чтобы собрать первое локальное превью и таймлайн эффектов.",
      audioReadingFile: "Декодирую аудио и подготавливаю локальный render engine.",
      audioPreviewReady: "Аудио-превью готово",
      audioRendering: "Собираю аудио-превью",
      audioRenderSaved: "Рендер аудио сохранён.",
      audioRenderFailed: "Рендер аудио не удался. Текущую конфигурацию не получилось экспортировать.",
      audioFileRequired: "Для аудио-режима нужен именно аудиофайл.",
      appleVideoNoticeKicker: "Внимание",
      appleVideoNoticeTitle: "На устройствах Apple видеорежим сейчас работает очень плохо.",
      appleVideoNoticeBody:
        "Видео-карраптинг на iPhone, iPad и macOS Safari пока нестабилен, поэтому лучше попробовать фото- или аудио-режим.",
      appleVideoNoticeOk: "Окей"
    }
  };

  const searchParams = new URLSearchParams(window.location.search);

  const state = {
    sourceFile: null,
    sourceDuration: 0,
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
      activeMedia: "video",
      decodeStatusKey: "standby",
      decodeStatusLevel: "idle",
      decodeStatusValues: null,
      statusLineKey: "defaultStatusLine",
      statusLineValues: null
    },
    heroTitleObserver: null,
    heroTitleFrame: 0,
    heroMorphFrame: 0,
    visual: {
      rafId: 0,
      enabled: false,
      currentSettings: null,
      holdFrameUntil: 0,
      bufferReady: false,
      width: 0,
      height: 0,
      bufferCanvas: document.createElement("canvas"),
      bufferContext: null
    },
    exportProgress: {
    rafId: 0,
    startedAt: 0,
    estimatedMs: 0,
    settleTimeoutId: 0,
    exitTimeoutId: 0
    },
    compatibility: {
      requestedProfile: "auto",
      profile: releaseConfig.defaultDesktopProfile,
      detectedDevice: "",
      decodeTimeoutMs: 3200,
      probeTimeoutMs: 2800,
      requireFrameProbe: false,
      engine: "binary"
    },
    lab: {
      enabled: searchParams.get("lab") === "1",
      exportStrategy: "auto"
    }
  };

  const elements = {
    fileInput: document.getElementById("fileInput"),
    topbar: document.querySelector(".topbar"),
    hero: document.querySelector(".hero"),
    previewPanel: document.querySelector(".preview-panel"),
    dropZone: document.getElementById("dropZone"),
    dropOverlay: document.getElementById("dropOverlay"),
    playerShell: document.getElementById("playerShell"),
    previewVideo: document.getElementById("previewVideo"),
    previewCanvas: document.getElementById("previewCanvas"),
    originalVideo: document.getElementById("originalVideo"),
    formatBadge: document.getElementById("formatBadge"),
    strategyBadge: document.getElementById("strategyBadge"),
    profileBadge: document.getElementById("profileBadge"),
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
    exportButtonProgress: document.querySelector(".export-button-progress"),
    exportButtonLabelBase: document.getElementById("exportButtonLabelBase"),
    exportButtonLabelFill: document.getElementById("exportButtonLabelFill"),
    exportFormatSelect: document.getElementById("exportFormatSelect"),
    exportFormatPicker: document.getElementById("exportFormatPicker"),
    exportFormatTrigger: document.getElementById("exportFormatTrigger"),
    exportFormatValue: document.getElementById("exportFormatValue"),
    exportFormatMenu: document.getElementById("exportFormatMenu"),
    exportFormatOptions: Array.from(document.querySelectorAll("[data-export-format-option]")),
    videoPresetButtons: Array.from(document.querySelectorAll("[data-preset]")),
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
    renderLabPanel: document.getElementById("renderLabPanel"),
    labProfileSelect: document.getElementById("labProfileSelect"),
    labExportStrategySelect: document.getElementById("labExportStrategySelect"),
    labActiveProfileValue: document.getElementById("labActiveProfileValue"),
    labDetectedDeviceValue: document.getElementById("labDetectedDeviceValue"),
    labDecodeProbeValue: document.getElementById("labDecodeProbeValue"),
    labResolvedExportValue: document.getElementById("labResolvedExportValue"),
    themeToggle: document.getElementById("themeToggle"),
    languageToggle: document.getElementById("languageToggle"),
    appleVideoNotice: document.getElementById("appleVideoNotice"),
    appleVideoNoticeButton: document.getElementById("appleVideoNoticeButton"),
    appleVideoNoticeDismissNodes: Array.from(document.querySelectorAll("[data-notice-dismiss]")),
    brandLink: document.getElementById("brandLink"),
    topbarTitle: document.getElementById("topbarTitle"),
    heroTitleBridge: document.getElementById("heroTitleBridge"),
    modeSwitch: document.querySelector(".mode-switch"),
    mobileModePicker: document.getElementById("mobileModePicker"),
    mobileModeTrigger: document.getElementById("mobileModeTrigger"),
    mobileModeValue: document.getElementById("mobileModeValue"),
    mobileModeMenu: document.getElementById("mobileModeMenu"),
    mobileModeOptions: Array.from(document.querySelectorAll("[data-mobile-media-option]")),
    modeTabs: Array.from(document.querySelectorAll("[data-media-tab]")),
    mediaPanels: Array.from(document.querySelectorAll("[data-media-panel]")),
    heroCopy: document.querySelector(".hero-copy"),
    heroTitle: document.getElementById("heroTitle"),
    translatableNodes: Array.from(document.querySelectorAll("[data-i18n]")),
    translatableTitleNodes: Array.from(document.querySelectorAll("[data-i18n-title]")),
    translatableAriaNodes: Array.from(document.querySelectorAll("[data-i18n-aria-label]")),
    seekButtons: Array.from(document.querySelectorAll("[data-seek]"))
  };
  let photoStudio = null;
  let audioStudio = null;
  window.GlitchyShared = {
    translate: translate,
    localizeRiskLabel: localizeRiskLabel,
    formatBytes: formatBytes,
    randomInteger: randomInteger,
    createSeededRandom: createSeededRandom,
    clamp01: clamp01,
    clampNumber: clampNumber,
    drawMutationMap: drawMutationMap,
    downloadBlob: downloadBlob,
    getLanguage: function () {
      return state.ui.language;
    },
    getTheme: function () {
      return state.ui.theme;
    }
  };

  init();

  function init() {
    state.visual.bufferContext = state.visual.bufferCanvas.getContext("2d", { alpha: false });
    initPreferences();
    initThemeAndLanguageControls();
    initHeroTitleFit();
    initHeroMorph();
    initModeSwitch();
    initMobileModePicker();
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
    initRenderLab();
    initWorker();
    photoStudio = createPhotoStudio();
    audioStudio = createAudioStudio();
    switchMediaMode(state.ui.activeMedia);
    initAppleVideoNotice();
  }

  function initHeroTitleFit() {
    requestHeroTitleFit();

    const handleResize = function () {
      requestHeroTitleFit();
    };

    window.addEventListener("resize", handleResize);

    if (typeof ResizeObserver === "function" && elements.heroCopy) {
      const observer = new ResizeObserver(function () {
        requestHeroTitleFit();
      });

      observer.observe(elements.heroCopy);
      state.heroTitleObserver = observer;
    }
  }

  function requestHeroTitleFit() {
    if (!elements.heroTitle || !elements.heroCopy) {
      return;
    }

    if (state.heroTitleFrame) {
      cancelAnimationFrame(state.heroTitleFrame);
    }

    state.heroTitleFrame = requestAnimationFrame(syncHeroTitleSize);
  }

  function syncHeroTitleSize() {
    const title = elements.heroTitle;
    const container = elements.heroCopy;

    if (!title || !container) {
      return;
    }

    const containerStyle = window.getComputedStyle(container);
    const containerWidth =
      container.clientWidth -
      parseFloat(containerStyle.paddingLeft || "0") -
      parseFloat(containerStyle.paddingRight || "0");

    if (!containerWidth) {
      return;
    }

    const targetWidth = containerWidth * 0.978;
    const minSize = Math.max(48, Math.floor(containerWidth * 0.16));
    let low = minSize;
    let high = Math.max(minSize + 1, Math.floor(containerWidth * 0.42));
    let best = minSize;

    title.style.fontSize = high + "px";
    while (measureHeroTitleWidth(title) < targetWidth) {
      best = high;
      high = Math.floor(high * 1.12);
      title.style.fontSize = high + "px";
      if (high > 1200) {
        break;
      }
    }

    for (let step = 0; step < 14; step += 1) {
      const next = (low + high) / 2;
      title.style.fontSize = next + "px";

      if (measureHeroTitleWidth(title) <= targetWidth) {
        best = next;
        low = next;
      } else {
        high = next;
      }
    }

    title.style.fontSize = Math.floor(best) + "px";
    state.heroTitleFrame = 0;
    requestHeroMorphUpdate();
  }

  function measureHeroTitleWidth(title) {
    if (!title) {
      return 0;
    }

    if (typeof document.createRange === "function" && title.firstChild) {
      const range = document.createRange();
      range.selectNodeContents(title);
      const width = range.getBoundingClientRect().width;

      if (width) {
        return width;
      }
    }

    return title.getBoundingClientRect().width;
  }

  function initHeroMorph() {
    if (!elements.topbar || !elements.heroTitle || !elements.topbarTitle || !elements.heroTitleBridge) {
      return;
    }

    window.addEventListener("scroll", requestHeroMorphUpdate, { passive: true });
    window.addEventListener("resize", requestHeroMorphUpdate);
    requestHeroMorphUpdate();
  }

  function requestHeroMorphUpdate() {
    if (state.heroMorphFrame) {
      return;
    }

    state.heroMorphFrame = requestAnimationFrame(syncHeroMorph);
  }

  function getTopbarTitleTargetRect() {
    const topbar = elements.topbar;
    const title = elements.topbarTitle;

    if (!topbar || !title) {
      return null;
    }

    const topbarRect = topbar.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    const titleWidth = titleRect.width || measureHeroTitleWidth(title);
    const titleHeight = titleRect.height || parseFloat(window.getComputedStyle(title).fontSize || "0");
    const centerY = topbarRect.top + topbarRect.height * 0.5;
    let centerX = topbarRect.left + topbarRect.width * 0.5;

    if (window.innerWidth > 920 && elements.brandLink && elements.modeSwitch) {
      const brandRect = elements.brandLink.getBoundingClientRect();
      const switchRect = elements.modeSwitch.getBoundingClientRect();
      const horizontalPadding = 20;
      const minCenterX = brandRect.right + horizontalPadding + titleWidth * 0.5;
      const maxCenterX = switchRect.left - horizontalPadding - titleWidth * 0.5;

      if (maxCenterX > minCenterX) {
        centerX = clampNumber((brandRect.right + switchRect.left) * 0.5, minCenterX, maxCenterX);
      }
    }

    return {
      left: centerX - titleWidth * 0.5,
      top: centerY - titleHeight * 0.5,
      width: titleWidth,
      height: titleHeight,
      centerX: centerX,
      centerY: centerY
    };
  }

  function syncHeroMorph() {
    const topbar = elements.topbar;
    const hero = elements.hero;
    const heroTitle = elements.heroTitle;
    const topbarTitle = elements.topbarTitle;
    const bridge = elements.heroTitleBridge;
    const isMobile = window.innerWidth <= 720;
    const scrollTop = window.scrollY || window.pageYOffset || 0;

    state.heroMorphFrame = 0;

    if (!topbar || !hero || !heroTitle || !topbarTitle || !bridge) {
      return;
    }

    topbar.classList.toggle("is-stuck", scrollTop > 2);

    if (isMobile) {
      heroTitle.style.opacity = "1";
      topbarTitle.style.opacity = "0";
      topbarTitle.style.left = "50%";
      topbarTitle.style.top = "50%";
      topbarTitle.style.transform = "translate3d(-50%, -50%, 0)";
      bridge.style.opacity = "0";
      return;
    }

    const travel = Math.max(96, Math.round(hero.offsetHeight * 0.78));
    const progress = clampNumber(scrollTop / travel, 0, 1);
    const motionStart = 0.015;
    const motionEnd = 0.9;
    const motionProgress = clampNumber((progress - motionStart) / Math.max(0.001, motionEnd - motionStart), 0, 1);
    const eased = smoothStep(motionProgress);
    const sourceRect = heroTitle.getBoundingClientRect();
    const targetRect = getTopbarTitleTargetRect();
    const heroStyle = window.getComputedStyle(heroTitle);

    if (targetRect) {
      topbarTitle.style.left = (targetRect.centerX - topbar.getBoundingClientRect().left).toFixed(2) + "px";
      topbarTitle.style.top = (targetRect.centerY - topbar.getBoundingClientRect().top).toFixed(2) + "px";
    }

    topbarTitle.style.opacity = progress >= motionEnd ? "1" : "0";
    topbarTitle.style.transform = "translate3d(-50%, -50%, 0)";
    heroTitle.style.opacity = progress <= motionStart ? "1" : "0";

    if (!targetRect || !sourceRect.width || !targetRect.width) {
      bridge.style.opacity = "0";
      return;
    }

    bridge.textContent = heroTitle.textContent || "Glitchy";
    bridge.style.fontSize = heroStyle.fontSize;
    bridge.style.left = "0";
    bridge.style.top = "0";
    bridge.style.transform = "translate3d(" + lerp(sourceRect.left, targetRect.left, eased).toFixed(2) + "px, " + lerp(sourceRect.top, targetRect.top, eased).toFixed(2) + "px, 0) scale(" + lerp(1, targetRect.width / Math.max(1, sourceRect.width), eased).toFixed(4) + ")";
    bridge.style.opacity = motionProgress > 0 && motionProgress < 1 ? "1" : "0";
  }

  function smoothStep(value) {
    const clamped = clampNumber(value, 0, 1);
    return clamped * clamped * (3 - 2 * clamped);
  }

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function initPreferences() {
    applyTheme(getCookie("video_glitcher_theme") || "light");
    applyLanguage(getCookie("video_glitcher_language") || getPreferredLanguageFromNavigator());
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
    if (state.exportInProgress) {
      syncExportButtonProgressFrame();
    }
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
    refreshLabPanel();
    if (photoStudio) {
      photoStudio.refreshLocalizedText();
    }
    if (audioStudio) {
      audioStudio.refreshLocalizedText();
    }
  }

  function applyStaticTranslations() {
    elements.translatableNodes.forEach(function (node) {
      node.textContent = translate(node.dataset.i18n);
    });

    elements.translatableTitleNodes.forEach(function (node) {
      node.title = translate(node.dataset.i18nTitle);
    });

    elements.translatableAriaNodes.forEach(function (node) {
      node.setAttribute("aria-label", translate(node.dataset.i18nAriaLabel));
    });

    if (!state.sourceFile) {
      elements.fileLabel.textContent = translate("noVideoLoaded");
    }

    syncMobileModePicker();
    syncExportButtonLabel();
    refreshLabPanel();
  }

  function initAppleVideoNotice() {
    if (!elements.appleVideoNotice || !elements.appleVideoNoticeButton) {
      return;
    }

    elements.appleVideoNoticeButton.addEventListener("click", dismissAppleVideoNotice);
    elements.appleVideoNoticeDismissNodes.forEach(function (node) {
      node.addEventListener("click", dismissAppleVideoNotice);
    });

    maybeShowAppleVideoNotice();
  }

  function maybeShowAppleVideoNotice() {
    if (!elements.appleVideoNotice) {
      return;
    }

    const forcedNotice = searchParams.get("apple-notice") === "1";
    const alreadyDismissed = !forcedNotice && getCookie("glitchy_apple_video_notice_ack_v1_2_0") === "1";
    const detectedDevice = forcedNotice ? "apple" : getDetectedDeviceFromNavigator();

    if (detectedDevice !== "apple" || alreadyDismissed) {
      elements.appleVideoNotice.hidden = true;
      return;
    }

    elements.appleVideoNotice.hidden = false;
  }

  function dismissAppleVideoNotice() {
    setCookie("glitchy_apple_video_notice_ack_v1_2_0", "1");
    if (elements.appleVideoNotice) {
      elements.appleVideoNotice.hidden = true;
    }
  }

  function initModeSwitch() {
    elements.modeTabs.forEach(function (button) {
      button.addEventListener("click", function () {
        switchMediaMode(button.dataset.mediaTab || "video");
      });
    });
  }

  function initMobileModePicker() {
    if (!elements.mobileModeTrigger || !elements.mobileModeMenu) {
      return;
    }

    syncMobileModePicker();

    elements.mobileModeTrigger.addEventListener("click", function () {
      if (elements.mobileModeMenu.hidden) {
        openMobileModeMenu();
        return;
      }

      closeMobileModeMenu();
    });

    elements.mobileModeTrigger.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMobileModeMenu();
        focusSelectedMobileModeOption();
      }
    });

    elements.mobileModeOptions.forEach(function (button, index) {
      button.addEventListener("click", function () {
        switchMediaMode(button.dataset.mobileMediaOption || "video");
        closeMobileModeMenu();
        elements.mobileModeTrigger.focus();
      });

      button.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeMobileModeMenu();
          elements.mobileModeTrigger.focus();
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          elements.mobileModeOptions[(index + 1) % elements.mobileModeOptions.length].focus();
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          elements.mobileModeOptions[
            (index - 1 + elements.mobileModeOptions.length) % elements.mobileModeOptions.length
          ].focus();
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!elements.mobileModePicker.contains(event.target)) {
        closeMobileModeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileModeMenu();
      }
    });
  }

  function switchMediaMode(mode) {
    const nextMode = mode === "photo" || mode === "audio" ? mode : "video";
    state.ui.activeMedia = nextMode;

    elements.modeTabs.forEach(function (button) {
      const isActive = (button.dataset.mediaTab || "video") === nextMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    elements.mediaPanels.forEach(function (panel) {
      panel.hidden = (panel.dataset.mediaPanel || "video") !== nextMode;
    });

    if (nextMode !== "video") {
      elements.previewVideo.pause();
      elements.originalVideo.pause();
    }

    if (nextMode !== "audio" && audioStudio) {
      audioStudio.pausePlayers();
    }

    syncMobileModePicker();
    closeMobileModeMenu();
    requestHeroTitleFit();
    requestHeroMorphUpdate();
  }

  function syncMobileModePicker() {
    if (!elements.mobileModeValue) {
      return;
    }

    const key = state.ui.activeMedia === "photo" ? "tabPhoto" : state.ui.activeMedia === "audio" ? "tabAudio" : "tabVideo";
    elements.mobileModeValue.dataset.i18n = key;
    elements.mobileModeValue.textContent = translate(key);

    elements.mobileModeOptions.forEach(function (button) {
      const isActive = (button.dataset.mobileMediaOption || "video") === state.ui.activeMedia;
      button.setAttribute("aria-selected", String(isActive));
    });
  }

  function openMobileModeMenu() {
    elements.mobileModeMenu.hidden = false;
    elements.mobileModeTrigger.setAttribute("aria-expanded", "true");
  }

  function closeMobileModeMenu() {
    if (!elements.mobileModeMenu || !elements.mobileModeTrigger) {
      return;
    }

    elements.mobileModeMenu.hidden = true;
    elements.mobileModeTrigger.setAttribute("aria-expanded", "false");
  }

  function focusSelectedMobileModeOption() {
    const selectedButton = elements.mobileModeOptions.find(function (button) {
      return button.getAttribute("aria-selected") === "true";
    });

    (selectedButton || elements.mobileModeOptions[0] || elements.mobileModeTrigger).focus();
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

    syncExportButtonLabel();
    elements.riskValue.textContent = localizeRiskLabel(elements.riskValue.dataset.riskLabel || "low");
    updatePipelineBadges();
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

  function normalizeCompatibilityProfile(value) {
    if (value === "safari") {
      return "apple-safe";
    }

    if (value === "apple-canvas") {
      return "apple-canvas";
    }

    if (value === "apple-ultra") {
      return "apple-ultra-safe";
    }

    if (
      value === "auto" ||
      value === "standard" ||
      value === "balanced" ||
      value === "apple-canvas" ||
      value === "apple-safe" ||
      value === "apple-ultra-safe"
    ) {
      return value;
    }

    return "auto";
  }

  function normalizeExportStrategy(value) {
    if (value === "stable" || value === "direct") {
      return value;
    }

    return "auto";
  }

  function getRenderProfileLabelKey(profile) {
    const labelKeys = {
      standard: "labProfileStandard",
      balanced: "labProfileBalanced",
      "apple-canvas": "labProfileAppleCanvas",
      "apple-safe": "labProfileAppleSafe",
      "apple-ultra-safe": "labProfileAppleUltra"
    };

    return labelKeys[profile] || "labProfileBalanced";
  }

  function getResolvedExportLabelKey(strategy) {
    const labelKeys = {
      auto: "labExportAuto",
      stable: "labExportStable",
      direct: "labExportDirect"
    };

    return labelKeys[strategy] || "labExportAuto";
  }

  function getDetectedDeviceLabelKey(device) {
    return device === "apple" ? "labDeviceApple" : "labDeviceDesktop";
  }

  function getDecodeProbeLabelKey(requireFrameProbe) {
    return requireFrameProbe ? "labProbeFrame" : "labProbeBasic";
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
    state.lab.exportStrategy = normalizeExportStrategy(searchParams.get("export"));
    applyCompatibilityProfile(normalizeCompatibilityProfile(searchParams.get("compat")), false);
  }

  function getReleaseDefaultCompatibilityProfile(detectedDevice) {
    return detectedDevice === "apple"
      ? releaseConfig.defaultAppleProfile
      : releaseConfig.defaultDesktopProfile;
  }

  function applyCompatibilityProfile(requestedProfile, shouldSyncUrl) {
    const detectedDevice = getDetectedDeviceFromNavigator();
    const normalizedRequested = normalizeCompatibilityProfile(requestedProfile);
    const activeProfile = normalizedRequested === "auto"
      ? getReleaseDefaultCompatibilityProfile(detectedDevice)
      : normalizedRequested;

    state.compatibility = buildCompatibilityState(activeProfile, normalizedRequested, detectedDevice);
    applyCompatibilityControlClamp();
    applyPreviewEngineMode();
    refreshLabPanel();
    updatePipelineBadges();

    if (shouldSyncUrl) {
      syncRenderLabUrl();
    }

    if (state.compatibility.profile === "apple-canvas") {
      setStatusLine("appleCanvasCompatibilityMode");
      return;
    }

    if (state.compatibility.profile === "apple-safe") {
      setStatusLine("safariCompatibilityMode");
      return;
    }

    if (state.compatibility.profile === "apple-ultra-safe") {
      setStatusLine("appleUltraCompatibilityMode");
      return;
    }

    if (state.compatibility.profile === "balanced" && normalizedRequested !== "auto") {
      setStatusLine("balancedCompatibilityMode");
    }
  }

  function buildCompatibilityState(profile, requestedProfile, detectedDevice) {
    const config = renderProfileConfigs[profile] || renderProfileConfigs.balanced;

    return {
      requestedProfile: requestedProfile || "auto",
      profile: profile in renderProfileConfigs ? profile : "balanced",
      detectedDevice: detectedDevice || "desktop",
      decodeTimeoutMs: config.decodeTimeoutMs,
      probeTimeoutMs: config.probeTimeoutMs,
      requireFrameProbe: Boolean(config.requireFrameProbe),
      engine: config.engine || "binary"
    };
  }

  function getDetectedDeviceFromNavigator() {
    const userAgent = navigator.userAgent || "";
    const platform = navigator.platform || "";
    const vendor = navigator.vendor || "";
    const userAgentDataPlatform = navigator.userAgentData && navigator.userAgentData.platform
      ? navigator.userAgentData.platform
      : "";
    const touchPoints = Number(navigator.maxTouchPoints || 0);
    const isIOS = /iPad|iPhone|iPod/i.test(userAgent)
      || /iPad|iPhone|iPod/i.test(platform)
      || /iPad|iPhone|iPod/i.test(userAgentDataPlatform)
      || (platform === "MacIntel" && touchPoints > 1);
    const isMac = /Macintosh|Mac OS X|Mac_PowerPC|MacIntel/i.test(userAgent)
      || /^Mac/i.test(platform)
      || /^Mac/i.test(userAgentDataPlatform);
    const isAppleVendor = /Apple/i.test(vendor);

    return isIOS || isMac || isAppleVendor ? "apple" : "desktop";
  }

  function getPreferredLanguageFromNavigator() {
    const languages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ""];
    const normalized = languages
      .filter(Boolean)
      .map(function (language) {
        return String(language).toLowerCase();
      });
    const prefersRussian = normalized.some(function (language) {
      return language.indexOf("ru") === 0;
    });

    return prefersRussian ? "ru" : "en";
  }

  function applyCompatibilityControlClamp() {
    const config = renderProfileConfigs[state.compatibility.profile] || renderProfileConfigs.balanced;
    const clamp = config.controlClamp;

    if (!clamp) {
      return;
    }

    const current = getSettings();
    const next = Object.assign({}, current);

    if (typeof clamp.intensityMax === "number") {
      next.intensity = Math.min(next.intensity, clamp.intensityMax);
    }

    if (typeof clamp.densityMax === "number") {
      next.density = Math.min(next.density, clamp.densityMax);
    }

    if (typeof clamp.chunkSizeMax === "number") {
      next.chunkSize = Math.min(next.chunkSize, clamp.chunkSizeMax);
    }

    if (typeof clamp.guardMin === "number") {
      next.guard = Math.max(next.guard, clamp.guardMin);
    }

    if (typeof clamp.autoHeal === "boolean") {
      next.autoHeal = clamp.autoHeal;
    }

    if (clamp.disableAutoplay) {
      elements.autoplayToggle.checked = false;
    }

    applySettings(next);
  }

  function initRenderLab() {
    if (!elements.renderLabPanel) {
      return;
    }

    elements.renderLabPanel.hidden = !state.lab.enabled;

    if (!state.lab.enabled) {
      return;
    }

    elements.labProfileSelect.value = state.compatibility.requestedProfile;
    elements.labExportStrategySelect.value = state.lab.exportStrategy;
    elements.labProfileSelect.addEventListener("change", function () {
      applyCompatibilityProfile(elements.labProfileSelect.value, true);
      if (state.sourceFile) {
        scheduleRender(true);
      }
    });
    elements.labExportStrategySelect.addEventListener("change", function () {
      state.lab.exportStrategy = normalizeExportStrategy(elements.labExportStrategySelect.value);
      refreshLabPanel();
      updatePipelineBadges();
      syncRenderLabUrl();
    });
    refreshLabPanel();
  }

  function refreshLabPanel() {
    if (!state.lab.enabled || !elements.renderLabPanel) {
      return;
    }

    elements.labProfileSelect.value = state.compatibility.requestedProfile;
    elements.labExportStrategySelect.value = state.lab.exportStrategy;
    elements.labActiveProfileValue.textContent = translate(getRenderProfileLabelKey(state.compatibility.profile));
    elements.labDetectedDeviceValue.textContent = translate(
      getDetectedDeviceLabelKey(state.compatibility.detectedDevice)
    );
    elements.labDecodeProbeValue.textContent = translate(
      getDecodeProbeLabelKey(state.compatibility.requireFrameProbe)
    );
    elements.labResolvedExportValue.textContent = translate(
      getResolvedExportLabelKey(resolveActiveExportStrategy())
    );
  }

  function syncRenderLabUrl() {
    if (!window.history || typeof window.history.replaceState !== "function") {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    if (state.lab.enabled) {
      params.set("lab", "1");
    } else {
      params.delete("lab");
    }

    if (state.compatibility.requestedProfile === "auto") {
      params.delete("compat");
    } else {
      params.set("compat", state.compatibility.requestedProfile);
    }

    if (state.lab.exportStrategy === "auto") {
      params.delete("export");
    } else {
      params.set("export", state.lab.exportStrategy);
    }

    const nextQuery = params.toString();
    const nextUrl = window.location.pathname + (nextQuery ? "?" + nextQuery : "") + window.location.hash;

    window.history.replaceState({}, "", nextUrl);
  }

  function resolveActiveExportStrategy() {
    const selectedStrategy = normalizeExportStrategy(state.lab.exportStrategy);

    if (selectedStrategy !== "auto") {
      if (selectedStrategy === "direct" && state.compatibility.engine === "visual") {
        return releaseConfig.defaultExportStrategy;
      }

      return selectedStrategy;
    }

    return releaseConfig.defaultExportStrategy;
  }

  function applyPreviewEngineMode() {
    const useVisualEngine = state.compatibility.engine === "visual";

    state.visual.enabled = useVisualEngine;
    elements.previewCanvas.hidden = !useVisualEngine;
    elements.previewVideo.classList.toggle("preview-video-underlay", useVisualEngine);

    if (!useVisualEngine) {
      stopVisualRenderer();
      updateExportButtonState();
      return;
    }

    if (state.sourceFile && state.originalUrl && elements.previewVideo.src !== state.originalUrl) {
      const shouldResume = !elements.previewVideo.paused;
      const previousTime = Number.isFinite(elements.previewVideo.currentTime) ? elements.previewVideo.currentTime : 0;

      state.pendingPlayback = {
        resume: shouldResume,
        time: previousTime
      };
      elements.previewVideo.src = state.originalUrl;
      elements.previewVideo.load();
    }

    resizeVisualCanvas();
    updateExportButtonState();
    requestVisualFrame();
  }

  function shouldUseVisualEngine() {
    return state.compatibility.engine === "visual";
  }

  function updatePipelineBadges() {
    const profileLabel = translate(getRenderProfileLabelKey(state.compatibility.profile));
    const exportMode = translate(getResolvedExportLabelKey(resolveActiveExportStrategy()));

    elements.profileBadge.textContent = translate("pipelineBadge", {
      profile: profileLabel,
      export: exportMode
    });
  }

  function getEstimatedExportDurationMs() {
    if (!state.sourceFile || !state.sourceDuration) {
      return null;
    }

    const strategy = resolveActiveExportStrategy();
    const baseDurationMs = state.sourceDuration * 1000;

    if (strategy === "direct") {
      return 900;
    }

    if (shouldUseVisualEngine()) {
      return Math.max(1800, Math.round(baseDurationMs * 1.08 + 1800));
    }

    return Math.max(1400, Math.round(baseDurationMs * 1.03 + 1200));
  }

  function syncExportButtonLabel() {
    const label = translate(state.exportInProgress ? "rendering" : "exportRender");

    elements.exportButtonLabelBase.textContent = label;
    elements.exportButtonLabelFill.textContent = label;
    elements.exportButton.setAttribute("aria-label", label);
  }

  function startExportButtonProgress() {
    const now = typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();

    stopExportButtonProgressAnimation();
    clearExportButtonProgressTimers();

    elements.exportButton.classList.remove("is-export-complete", "is-export-settling");

    state.exportProgress.startedAt = now;
    state.exportProgress.estimatedMs = Math.max(900, getEstimatedExportDurationMs() || 900);

    renderExportButtonProgress(0, false);
    state.exportProgress.rafId = window.requestAnimationFrame(syncExportButtonProgressFrame);
  }

  function stopExportButtonProgressAnimation() {
    if (state.exportProgress.rafId) {
      window.cancelAnimationFrame(state.exportProgress.rafId);
      state.exportProgress.rafId = 0;
    }
  }

  function clearExportButtonProgressTimers() {
    if (state.exportProgress.settleTimeoutId) {
      window.clearTimeout(state.exportProgress.settleTimeoutId);
      state.exportProgress.settleTimeoutId = 0;
    }

    if (state.exportProgress.exitTimeoutId) {
      window.clearTimeout(state.exportProgress.exitTimeoutId);
      state.exportProgress.exitTimeoutId = 0;
    }
  }

  function syncExportButtonProgressFrame(frameTime) {
    if (!state.exportInProgress) {
      stopExportButtonProgressAnimation();
      return;
    }

    const now = typeof frameTime === "number"
      ? frameTime
      : typeof performance !== "undefined" && typeof performance.now === "function"
        ? performance.now()
        : Date.now();
    const elapsedMs = Math.max(0, now - state.exportProgress.startedAt);
    const estimatedMs = Math.max(900, state.exportProgress.estimatedMs || 900);
    const progressRatio = clamp01(elapsedMs / estimatedMs);

    renderExportButtonProgress(progressRatio, false);
    state.exportProgress.rafId = window.requestAnimationFrame(syncExportButtonProgressFrame);
  }

  function renderExportButtonProgress(progressRatio, complete) {
    const clampedProgress = clamp01(progressRatio || 0);

    // До завершения держим кнопку немного недозаполненной
    const visualProgress = complete ? 1 : Math.min(clampedProgress, 0.94);

    // Фон заполняется трансформацией
    elements.exportButtonProgress.style.transform = "scaleX(" + visualProgress + ")";

    // Текст не тянем, а просто открываем слева направо
    const hiddenRightPercent = Math.max(0, (1 - visualProgress) * 100);
    elements.exportButtonLabelFill.style.clipPath =
      "inset(0 " + hiddenRightPercent + "% 0 0 round 999px)";

    const hasVisibleProgress = complete || visualProgress > 0;

    elements.exportButton.classList.toggle("is-exporting", hasVisibleProgress && !complete);
    elements.exportButton.classList.toggle("is-export-complete", !!complete);

    if (!hasVisibleProgress) {
      elements.exportButtonProgress.style.opacity = "0";
      elements.exportButtonLabelFill.style.opacity = "0";
    } else {
      elements.exportButtonProgress.style.opacity = "1";
      elements.exportButtonLabelFill.style.opacity = "1";
    }
  }

  async function finishExportButtonProgress() {
    stopExportButtonProgressAnimation();
    clearExportButtonProgressTimers();

    // Сначала мгновенно доводим кнопку до 100%
    renderExportButtonProgress(1, true);

    // Держим полное заполнение чуть дольше, чтобы было видно завершение
    await new Promise(function (resolve) {
      state.exportProgress.settleTimeoutId = window.setTimeout(resolve, 700);
    });
    state.exportProgress.settleTimeoutId = 0;

    // Запускаем мягкое "распухание"
    elements.exportButton.classList.remove("is-exporting", "is-export-complete");
    elements.exportButton.classList.add("is-export-settling");

    await new Promise(function (resolve) {
      state.exportProgress.exitTimeoutId = window.setTimeout(resolve, 280);
    });
    state.exportProgress.exitTimeoutId = 0;

    elements.exportButton.classList.remove("is-export-settling");
  }

  function resetExportButtonProgress() {
    stopExportButtonProgressAnimation();
    clearExportButtonProgressTimers();

    state.exportProgress.startedAt = 0;
    state.exportProgress.estimatedMs = 0;

    elements.exportButton.classList.remove(
      "is-exporting",
      "is-export-complete",
      "is-export-settling"
    );

    elements.exportButtonProgress.style.transform = "scaleX(0)";
    elements.exportButtonLabelFill.style.clipPath = "inset(0 100% 0 0 round 999px)";
    elements.exportButtonProgress.style.opacity = "0";
    elements.exportButtonLabelFill.style.opacity = "0";
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
      clearChipSelection(elements.videoPresetButtons);
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
      clearChipSelection(elements.videoPresetButtons);
      elements.seedInput.value = String(randomInteger(100, 999999));
      updateSettingsUI();
      scheduleRender();
    });

    document.querySelectorAll("[data-setting]").forEach(function (input) {
      const eventName = input.type === "checkbox" ? "change" : "input";
      input.addEventListener(eventName, function () {
        clearChipSelection(elements.videoPresetButtons);
        updateSettingsUI();
        scheduleRender();
      });
    });

    elements.videoPresetButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const preset = presets[button.dataset.preset];
        if (preset) {
          setActiveChip(elements.videoPresetButtons, button.dataset.preset || "");
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

  function setActiveChip(buttons, id) {
    buttons.forEach(function (button) {
      const isActive = (button.dataset.preset || "") === id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function clearChipSelection(buttons) {
    buttons.forEach(function (button) {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
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

    ["play", "pause", "volumechange", "loadedmetadata", "emptied", "seeked"].forEach(function (type) {
      elements.previewVideo.addEventListener(type, updateTransportButtons);
    });

    elements.previewVideo.addEventListener("error", function () {
      if (shouldUseVisualEngine()) {
        setDecodeStatus("previewDecodeFailed", "error");
        setStatusLine("renderTooDamaged");
        return;
      }

      handlePreviewError();
    });

    elements.previewVideo.addEventListener("loadedmetadata", function () {
      updateSourceDuration();
      resizeVisualCanvas();
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
      updateSourceDuration();
      if (state.pendingPlayback.resume && elements.autoplayToggle.checked) {
        elements.previewVideo.play().catch(function () {});
      }
      updateTransportButtons();
      syncReferenceVideo();
      requestVisualFrame();
    });

    elements.previewVideo.addEventListener("play", function () {
      requestVisualFrame();
    });

    elements.previewVideo.addEventListener("pause", function () {
      if (shouldUseVisualEngine()) {
        drawVisualPreviewFrame();
      }
    });

    elements.previewVideo.addEventListener("seeked", function () {
      if (shouldUseVisualEngine()) {
        drawVisualPreviewFrame();
      }
    });

    elements.originalVideo.addEventListener("loadedmetadata", updateSourceDuration);
  }

  function updateSourceDuration() {
    const duration = Number.isFinite(elements.originalVideo.duration) && elements.originalVideo.duration > 0
      ? elements.originalVideo.duration
      : Number.isFinite(elements.previewVideo.duration) && elements.previewVideo.duration > 0
        ? elements.previewVideo.duration
        : 0;

    state.sourceDuration = duration || 0;
    updatePipelineBadges();
  }

  async function loadFile(file) {
    resetRenderState();
    state.sourceFile = file;
    state.sourceDuration = 0;
    state.recoveries = 0;
    state.dragDepth = 0;
    clearDropIndicators();
    refreshLabPanel();
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
    applyPreviewEngineMode();
    applyLoopState();
    updateTransportButtons();
    updateExportButtonState();
    updatePipelineBadges();

    const buffer = await file.arrayBuffer();
    const transferBuffer = buffer.slice(0);

    applyCompatibilityControlClamp();

    if (state.compatibility.profile === "apple-canvas") {
      setStatusLine("appleCanvasFileLoaded");
    } else if (state.compatibility.profile === "apple-safe" || state.compatibility.profile === "apple-ultra-safe") {
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

    if (shouldUseVisualEngine()) {
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
    updatePipelineBadges();
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

  function updateExportButtonState() {
    const hasVisualExport =
      shouldUseVisualEngine() &&
      Boolean(state.sourceFile) &&
      typeof MediaRecorder !== "undefined" &&
      typeof elements.previewCanvas.captureStream === "function";
    const hasBinaryExport = Boolean(state.lastRenderBuffer);

    elements.exportButton.disabled = state.exportInProgress || (!hasVisualExport && !hasBinaryExport);
  }

  function applyPreviewBuffer(buffer, meta) {
    if (shouldUseVisualEngine()) {
      return;
    }

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
      updateExportButtonState();
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
    refreshLabPanel();
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
      if (shouldUseVisualEngine()) {
        requestVisualRender();
        return;
      }

      requestRender(0);
    }, immediate ? 0 : 150);
  }

  function getCompatibilityAdjustedSettings(recoveryLevel) {
    const settings = getSettings();
    const config = renderProfileConfigs[state.compatibility.profile] || renderProfileConfigs.balanced;
    const clamp = config.controlClamp;

    settings.recoveryLevel = recoveryLevel || 0;
    settings.compatibilityProfile = state.compatibility.profile;
    settings.sourceFileSize = state.sourceFile ? state.sourceFile.size : 0;

    if (!clamp) {
      return settings;
    }

    if (typeof clamp.intensityMax === "number") {
      settings.intensity = Math.min(settings.intensity, clamp.intensityMax);
    }

    if (typeof clamp.densityMax === "number") {
      settings.density = Math.min(settings.density, clamp.densityMax);
    }

    if (typeof clamp.chunkSizeMax === "number") {
      settings.chunkSize = Math.min(settings.chunkSize, clamp.chunkSizeMax);
    }

    if (typeof clamp.guardMin === "number") {
      settings.guard = Math.max(settings.guard, clamp.guardMin);
    }

    if (typeof clamp.autoHeal === "boolean") {
      settings.autoHeal = clamp.autoHeal;
    }

    return settings;
  }

  function requestRender(recoveryLevel) {
    if (!state.sourceFile || !state.analysis) {
      return;
    }

    const settings = getCompatibilityAdjustedSettings(recoveryLevel);
    state.renderSequence += 1;
    setDecodeStatus("renderingPreview", "idle");

    state.worker.postMessage({
      type: "render",
      requestId: state.renderSequence,
      settings: settings
    });
  }

  function requestVisualRender() {
    if (!state.sourceFile) {
      return;
    }

    state.lastRenderBuffer = null;
    state.lastRenderMeta = buildVisualTelemetry();
    updateRenderTelemetry(state.lastRenderMeta);
    updateExportButtonState();
    setDecodeStatus("previewReady", "live");
    setStatusLine("newRenderAssembled", {
      operations: String(state.lastRenderMeta.operations || 0),
      risk: localizeRiskLabel(state.lastRenderMeta.riskLabel || "low")
    });
    requestVisualFrame();
  }

  function buildVisualTelemetry() {
    const settings = getCompatibilityAdjustedSettings(0);
    const intensityNorm = clamp01(settings.intensity / 100);
    const densityNorm = clamp01(settings.density / 100);
    const guardNorm = clamp01(settings.guard / 100);
    const operations = Math.max(8, Math.round(16 + densityNorm * 84 + intensityNorm * 72));
    const estimatedTouched = state.analysis
      ? Math.round(state.analysis.totalMutableBytes * (0.004 + densityNorm * 0.018))
      : Math.round(18000 * (0.4 + densityNorm));
    const riskScore = intensityNorm * 0.52 + densityNorm * 0.34 + (1 - guardNorm) * 0.14;

    return {
      format: state.analysis ? state.analysis.format : "LIVE",
      preferredMime: state.sourceFile ? state.sourceFile.type : "",
      profile: state.compatibility.profile,
      elapsedMs: 8,
      mutatedBytes: estimatedTouched,
      operations: operations,
      riskLabel: riskScore < 0.36 ? "low" : riskScore < 0.68 ? "medium" : "high",
      mapBins: buildVisualMapBins(settings),
      recoveryLevel: 0,
      guardApplied: Math.round(guardNorm * 100)
    };
  }

  function buildVisualMapBins(settings) {
    const bins = new Array(48).fill(0);
    const focusNorm = clamp01((settings.focus || 0) / 100);
    const densityNorm = clamp01((settings.density || 0) / 100);
    const intensityNorm = clamp01((settings.intensity || 0) / 100);
    const spread = 0.08 + (1 - densityNorm) * 0.32;

    for (let index = 0; index < bins.length; index += 1) {
      const position = index / Math.max(1, bins.length - 1);
      const delta = Math.abs(position - focusNorm);
      const falloff = Math.max(0, 1 - delta / spread);
      bins[index] = Math.round((falloff * (0.35 + densityNorm * 0.65) + intensityNorm * 0.08) * 100);
    }

    return bins;
  }

  function requestVisualFrame() {
    if (!shouldUseVisualEngine() || state.visual.rafId) {
      return;
    }

    state.visual.rafId = window.requestAnimationFrame(function () {
      state.visual.rafId = 0;
      drawVisualPreviewFrame();

      if (shouldUseVisualEngine() && !elements.previewVideo.paused && !elements.previewVideo.ended) {
        requestVisualFrame();
      }
    });
  }

  function stopVisualRenderer() {
    if (state.visual.rafId) {
      window.cancelAnimationFrame(state.visual.rafId);
      state.visual.rafId = 0;
    }

    state.visual.holdFrameUntil = 0;
    state.visual.bufferReady = false;

    const context = elements.previewCanvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, elements.previewCanvas.width, elements.previewCanvas.height);
    }

    if (state.visual.bufferContext) {
      state.visual.bufferContext.clearRect(0, 0, state.visual.bufferCanvas.width, state.visual.bufferCanvas.height);
    }
  }

  function resizeVisualCanvas() {
    const sourceWidth = elements.previewVideo.videoWidth || elements.originalVideo.videoWidth || 0;
    const sourceHeight = elements.previewVideo.videoHeight || elements.originalVideo.videoHeight || 0;

    if (!sourceWidth || !sourceHeight) {
      return;
    }

    const maxPixels = state.compatibility.detectedDevice === "apple" ? 960 * 540 : 1280 * 720;
    const scale = Math.min(1, Math.sqrt(maxPixels / (sourceWidth * sourceHeight)));
    const width = Math.max(2, Math.round(sourceWidth * scale));
    const height = Math.max(2, Math.round(sourceHeight * scale));

    if (state.visual.width === width && state.visual.height === height) {
      return;
    }

    state.visual.width = width;
    state.visual.height = height;
    state.visual.bufferReady = false;
    elements.previewCanvas.width = width;
    elements.previewCanvas.height = height;
    state.visual.bufferCanvas.width = width;
    state.visual.bufferCanvas.height = height;
  }

  function drawVisualPreviewFrame() {
    if (!shouldUseVisualEngine() || !state.sourceFile) {
      return;
    }

    if (elements.previewVideo.readyState < 2) {
      return;
    }

    resizeVisualCanvas();

    if (!state.visual.width || !state.visual.height) {
      return;
    }

    renderVisualFrame({
      sourceVideo: elements.previewVideo,
      targetCanvas: elements.previewCanvas,
      bufferCanvas: state.visual.bufferCanvas,
      bufferContext: state.visual.bufferContext,
      settings: getCompatibilityAdjustedSettings(0),
      holdState: state.visual
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
    if (
      !state.sourceFile ||
      state.exportInProgress ||
      (!shouldUseVisualEngine() && !state.lastRenderBuffer)
    ) {
      return;
    }

    state.exportInProgress = true;
    startExportButtonProgress();
    updateExportButtonState();
    syncExportButtonLabel();
    refreshLabPanel();

    let exportStrategy = resolveActiveExportStrategy();
    let exportPreset = null;
    let exportCompleted = false;

    try {
      if (exportStrategy !== "direct") {
        exportPreset = resolveExportPreset(elements.exportFormatSelect.value);

        if (!exportPreset || typeof MediaRecorder === "undefined") {
          if (state.lab.exportStrategy === "auto" && !shouldUseVisualEngine() && state.lastRenderBuffer) {
            exportStrategy = "direct";
          } else {
            setStatusLine(exportPreset ? "mediaRecorderUnavailable" : "exportFormatUnsupported");
            return;
          }
        }
      }

      if (exportStrategy === "direct") {
        setStatusLine("fastExportStarted");
        downloadCurrentBinaryRender();
        setStatusLine("fastExportComplete");
        exportCompleted = true;
        return;
      }

      setStatusLine("recordingStableExport");

      const renderedBlob = shouldUseVisualEngine()
        ? await recordVisualExport(exportPreset)
        : await recordExportFromBuffer(exportPreset);
      const extension = exportPreset.extension;

      downloadBlob(renderedBlob, buildRecordedExportName(extension));
      setStatusLine("downloadComplete", {
        format: extension.replace(".", "").toUpperCase()
      });
      exportCompleted = true;
    } catch (error) {
      if (exportStrategy !== "direct" && state.lab.exportStrategy === "auto") {
        try {
          downloadCurrentBinaryRender();
          setStatusLine("exportFallbackDirect");
          exportCompleted = true;
          return;
        } catch (fallbackError) {}
      }

      setStatusLine("exportFailed", {
        label: translate(getResolvedExportLabelKey(exportStrategy))
      });
    } finally {
      if (exportCompleted) {
        await finishExportButtonProgress();
      }

      state.exportInProgress = false;
      syncExportButtonLabel();
      resetExportButtonProgress();
      updateExportButtonState();
      refreshLabPanel();
    }
  }

  async function recordExportFromBuffer(exportPreset) {
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
      sourceVideo.defaultPlaybackRate = 1;
      sourceVideo.playbackRate = 1;

      await waitForMediaEvent(sourceVideo, "loadedmetadata", getAdaptiveTimeout(state.compatibility.decodeTimeoutMs));
      await waitForMediaEvent(sourceVideo, "canplay", getAdaptiveTimeout(state.compatibility.decodeTimeoutMs));

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

      recorder.start(1000);

      const playbackStart = sourceVideo.play();
      if (playbackStart && typeof playbackStart.then === "function") {
        await playbackStart;
      }

      await waitForPlaybackCompletion(sourceVideo, 1);

      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      await stopPromise;

      if (!chunks.length) {
        throw new Error("No recorded chunks");
      }

      return new Blob(chunks, { type: exportPreset.mimeType });
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
    }
  }

  async function recordVisualExport(exportPreset) {
    if (typeof MediaRecorder === "undefined") {
      throw new Error("MediaRecorder unavailable");
    }

    const exportVideo = document.createElement("video");
    const exportCanvas = document.createElement("canvas");
    const exportContext = exportCanvas.getContext("2d", { alpha: false });
    const exportBufferCanvas = document.createElement("canvas");
    const exportBufferContext = exportBufferCanvas.getContext("2d", { alpha: false });
    const exportHoldState = {
      holdFrameUntil: 0,
      bufferReady: false
    };
    const chunks = [];
    let recorder;
    let stream;
    let rafId = 0;

    try {
      resizeVisualCanvas();
      exportCanvas.width = Math.max(2, state.visual.width || elements.previewCanvas.width || 960);
      exportCanvas.height = Math.max(2, state.visual.height || elements.previewCanvas.height || 540);
      exportBufferCanvas.width = exportCanvas.width;
      exportBufferCanvas.height = exportCanvas.height;

      exportVideo.src = state.originalUrl;
      exportVideo.preload = "auto";
      exportVideo.playsInline = true;
      exportVideo.muted = false;
      exportVideo.volume = 0;
      exportVideo.crossOrigin = "anonymous";

      await waitForMediaEvent(exportVideo, "loadedmetadata", getAdaptiveTimeout(state.compatibility.decodeTimeoutMs));
      await waitForMediaEvent(exportVideo, "canplay", getAdaptiveTimeout(state.compatibility.decodeTimeoutMs));

      stream = combineCanvasAndMediaAudioStream(exportCanvas.captureStream(30), exportVideo);
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

      const drawLoop = function () {
        renderVisualFrame({
          sourceVideo: exportVideo,
          targetCanvas: exportCanvas,
          targetContext: exportContext,
          bufferCanvas: exportBufferCanvas,
          bufferContext: exportBufferContext,
          settings: getCompatibilityAdjustedSettings(0),
          holdState: exportHoldState
        });

        if (!exportVideo.paused && !exportVideo.ended) {
          rafId = window.requestAnimationFrame(drawLoop);
        }
      };

      recorder.start(1000);
      const playbackStart = exportVideo.play();
      if (playbackStart && typeof playbackStart.then === "function") {
        await playbackStart;
      }

      drawLoop();
      await waitForPlaybackCompletion(exportVideo, 1);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      await stopPromise;

      if (!chunks.length) {
        throw new Error("No visual export chunks");
      }

      return new Blob(chunks, { type: exportPreset.mimeType });
    } finally {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }

      exportVideo.pause();
      exportVideo.removeAttribute("src");
      exportVideo.load();
    }
  }

  function downloadCurrentBinaryRender() {
    const mimeType =
      (state.sourceFile && state.sourceFile.type) ||
      (state.lastRenderMeta && state.lastRenderMeta.preferredMime) ||
      "application/octet-stream";
    const directBlob = new Blob([state.lastRenderBuffer], { type: mimeType });
    const extension = getSourceFileExtension();

    downloadBlob(directBlob, buildDirectExportName(extension));
  }

  function buildRecordedExportName(extension) {
    const baseName = state.sourceFile.name.replace(/(\.[^./\\]+)$/, "");
    const settings = getSettings();

    return baseName + "-rendered-" + settings.mode + "-" + settings.seed + extension;
  }

  function buildDirectExportName(extension) {
    const baseName = state.sourceFile.name.replace(/(\.[^./\\]+)$/, "");
    const settings = getSettings();

    return baseName + "-direct-" + settings.mode + "-" + settings.seed + extension;
  }

  function getSourceFileExtension() {
    const match = state.sourceFile && state.sourceFile.name.match(/(\.[^./\\]+)$/);

    if (match) {
      return match[1];
    }

    return ".bin";
  }

  function downloadBlob(blob, fileName) {
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  function renderVisualFrame(renderState) {
    const sourceVideo = renderState.sourceVideo;
    const targetCanvas = renderState.targetCanvas;
    const targetContext =
      renderState.targetContext || targetCanvas.getContext("2d", { alpha: false });
    const bufferCanvas = renderState.bufferCanvas;
    const bufferContext = renderState.bufferContext;
    const holdState = renderState.holdState || { holdFrameUntil: 0 };

    if (!sourceVideo || !targetCanvas || !targetContext || sourceVideo.readyState < 2) {
      return;
    }

    const width = targetCanvas.width;
    const height = targetCanvas.height;
    const settings = renderState.settings || getCompatibilityAdjustedSettings(0);
    const intensityNorm = clamp01((settings.intensity || 0) / 100);
    const densityNorm = clamp01((settings.density || 0) / 100);
    const chunkNorm = clamp01((settings.chunkSize || 1) / 24);
    const focusNorm = clamp01((settings.focus || 0) / 100);
    const guardNorm = clamp01((settings.guard || 0) / 100);
    const bucket = Math.floor(sourceVideo.currentTime * (6 + densityNorm * 24));
    const rng = createSeededRandom((settings.seed || defaultSettings.seed) + bucket * 9973);
    const now = performance.now();
    const hasBufferedFrame = Boolean(holdState.bufferReady && bufferCanvas.width && bufferCanvas.height);

    if (now >= holdState.holdFrameUntil) {
      targetContext.save();
      targetContext.globalCompositeOperation = "source-over";
      targetContext.globalAlpha = 1;
      targetContext.filter = "none";
      targetContext.drawImage(sourceVideo, 0, 0, width, height);
      targetContext.restore();

      if (
        (settings.mode === "stutter" || settings.mode === "hybrid") &&
        densityNorm > 0.12 &&
        rng() > 0.72
      ) {
        holdState.holdFrameUntil = now + 50 + densityNorm * 120;
      }
    } else if (hasBufferedFrame) {
      targetContext.drawImage(bufferCanvas, 0, 0, width, height);
    }

    const activeBandCenter = Math.max(0.1, Math.min(0.9, focusNorm));
    const sliceCount = Math.max(2, Math.round(4 + densityNorm * 18));
    const maxOffset = Math.max(8, Math.round((26 + intensityNorm * 180) * (0.4 + chunkNorm)));

    for (let index = 0; index < sliceCount; index += 1) {
      const influence = 1 - Math.min(1, Math.abs(index / Math.max(1, sliceCount - 1) - activeBandCenter));
      const sliceHeight = Math.max(6, Math.round(height * (0.012 + chunkNorm * 0.06 + rng() * 0.028)));
      const centerY = Math.round(height * activeBandCenter + (rng() - 0.5) * height * (0.35 + densityNorm * 0.45));
      const sliceY = clampNumber(centerY - Math.floor(sliceHeight * 0.5), 0, Math.max(0, height - sliceHeight));
      const direction = rng() > 0.5 ? 1 : -1;
      const shift = Math.round(direction * maxOffset * (0.2 + influence * 0.8) * (0.35 + rng()));
      const source =
        hasBufferedFrame && (settings.mode === "stutter" || settings.mode === "smear")
          ? bufferCanvas
          : sourceVideo;

      targetContext.drawImage(source, 0, sliceY, width, sliceHeight, shift, sliceY, width, sliceHeight);

      if (settings.mode === "shuffle" || settings.mode === "hybrid") {
        const secondaryShift = Math.round(-shift * (0.2 + rng() * 0.5));
        targetContext.drawImage(sourceVideo, 0, sliceY, width, sliceHeight, secondaryShift, sliceY, width, sliceHeight);
      }
    }

    if (intensityNorm > 0.08) {
      const rgbShift = Math.max(1, Math.round(2 + intensityNorm * 14));

      targetContext.save();
      targetContext.globalAlpha = 0.15 + intensityNorm * 0.16;
      targetContext.globalCompositeOperation = "screen";
      targetContext.drawImage(sourceVideo, rgbShift, 0, width - rgbShift, height, 0, 0, width - rgbShift, height);
      targetContext.restore();

      targetContext.save();
      targetContext.globalAlpha = 0.08 + intensityNorm * 0.12;
      targetContext.globalCompositeOperation = "difference";
      targetContext.drawImage(sourceVideo, 0, 0, width - rgbShift, height, rgbShift, 0, width - rgbShift, height);
      targetContext.restore();
    }

    const barCount = Math.max(3, Math.round(6 + densityNorm * 22));
    for (let index = 0; index < barCount; index += 1) {
      const lineHeight = Math.max(1, Math.round(1 + rng() * 6 + chunkNorm * 8));
      const y = Math.round(rng() * (height - lineHeight));
      const alpha = 0.04 + intensityNorm * 0.14 + rng() * 0.08;

      targetContext.fillStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
      targetContext.fillRect(0, y, width, lineHeight);
    }

    if (settings.mode === "xor" || settings.mode === "bitflip" || settings.mode === "hybrid") {
      const noiseCount = Math.round(10 + densityNorm * 56);

      for (let index = 0; index < noiseCount; index += 1) {
        const blockWidth = Math.max(3, Math.round(6 + rng() * 28 + intensityNorm * 36));
        const blockHeight = Math.max(2, Math.round(2 + rng() * 18 + chunkNorm * 26));
        const x = Math.round(rng() * Math.max(1, width - blockWidth));
        const y = Math.round(rng() * Math.max(1, height - blockHeight));
        const alpha = 0.05 + intensityNorm * 0.18 + (1 - guardNorm) * 0.08;

        targetContext.fillStyle = rng() > 0.5
          ? "rgba(255,255,255," + alpha.toFixed(3) + ")"
          : "rgba(0,0,0," + (alpha * 0.68).toFixed(3) + ")";
        targetContext.fillRect(x, y, blockWidth, blockHeight);
      }
    }

    bufferContext.clearRect(0, 0, width, height);
    bufferContext.drawImage(targetCanvas, 0, 0, width, height);
    holdState.bufferReady = true;
  }

  function drawMutationMap(mapBins, targetCanvas) {
    const canvas = targetCanvas || elements.mutationCanvas;
    if (!canvas) {
      return;
    }
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
    stopVisualRenderer();
    resetExportButtonProgress();
    state.lastRenderMeta = null;
    state.lastRenderBuffer = null;
    state.analysis = null;
    state.sourceDuration = 0;
    state.renderSequence = 0;
    state.activePreviewRequestId = 0;

    elements.operationsValue.textContent = "0";
    elements.riskValue.dataset.riskLabel = "low";
    elements.riskValue.textContent = localizeRiskLabel("low");
    elements.mutableBytesValue.textContent = "0 MB";
    elements.mutatedBytesLabel.textContent = translate("bytesTouched", { value: "0 B" });
    elements.renderLatencyLabel.textContent = "0 ms";
    elements.formatBadge.textContent = translate("formatStandby");
    elements.strategyBadge.textContent = translate("strategyIdle");
    elements.fileLabel.textContent = translate("noVideoLoaded");
    clearChipSelection(elements.videoPresetButtons);
    setDecodeStatus("standby", "idle");
    setStatusLine("defaultStatusLine");
    updateTransportButtons();
    drawMutationMap([]);
    updateExportButtonState();
    updatePipelineBadges();
    refreshLabPanel();
  }

  function cleanupUrls() {
    stopVisualRenderer();
    if (state.worker) {
      state.worker.terminate();
    }
    if (state.workerObjectUrl) {
      URL.revokeObjectURL(state.workerObjectUrl);
    }
    if (state.heroTitleObserver) {
      state.heroTitleObserver.disconnect();
    }
    if (state.heroTitleFrame) {
      cancelAnimationFrame(state.heroTitleFrame);
    }
    if (state.heroMorphFrame) {
      cancelAnimationFrame(state.heroMorphFrame);
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

  function createSeededRandom(seed) {
    let stateValue = Math.abs(Math.floor(seed) || 1) % 4294967295 || 1;

    return function () {
      stateValue += 0x6d2b79f5;
      let value = Math.imul(stateValue ^ (stateValue >>> 15), stateValue | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp01(value) {
    return Math.min(Math.max(value, 0), 1);
  }

  function clampNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function clampTime(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getAdaptiveTimeout(baseTimeoutMs) {
    if (!state.sourceFile) {
      return baseTimeoutMs;
    }

    const extraSteps = Math.floor(state.sourceFile.size / (48 * 1024 * 1024));
    return baseTimeoutMs + Math.min(6000, extraSteps * 550);
  }

  function readPresentedFrames(video) {
    if (video && typeof video.getVideoPlaybackQuality === "function") {
      const quality = video.getVideoPlaybackQuality();

      if (quality && typeof quality.totalVideoFrames === "number") {
        return quality.totalVideoFrames;
      }
    }

    if (video && typeof video.webkitDecodedFrameCount === "number") {
      return video.webkitDecodedFrameCount;
    }

    return null;
  }

  function waitForMediaEvent(media, eventName, timeoutMs) {
    return new Promise(function (resolve, reject) {
      let timeoutId = 0;

      if (
        (eventName === "loadedmetadata" && media.readyState >= 1) ||
        (eventName === "loadeddata" && media.readyState >= 2) ||
        (eventName === "canplay" && media.readyState >= 3)
      ) {
        resolve();
        return;
      }

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

  function waitForPlaybackCompletion(video, playbackRate) {
    return new Promise(function (resolve, reject) {
      const normalizedRate = playbackRate && playbackRate > 0 ? playbackRate : 1;
      const playbackDuration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      const stallTimeoutMs = Math.max(12000, getAdaptiveTimeout(12000));
      const maxRuntimeMs = Math.max(
        30000,
        Math.min(
          30 * 60 * 1000,
          Math.round(playbackDuration * 1000 * (1.6 / normalizedRate) + getAdaptiveTimeout(15000))
        )
      );
      let lastPosition = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      let lastProgressTs = performance.now();
      const startedAt = performance.now();

      const finish = function () {
        cleanup();
        resolve();
      };

      const fail = function (reason) {
        cleanup();
        reject(new Error(reason));
      };

      const onEnded = function () {
        finish();
      };

      const onError = function () {
        fail("Playback failed before export completed");
      };

      const intervalId = window.setInterval(function () {
        const now = performance.now();
        const position = Number.isFinite(video.currentTime) ? video.currentTime : 0;
        const duration = Number.isFinite(video.duration) ? video.duration : playbackDuration;

        if (duration && position >= Math.max(0, duration - 0.08)) {
          finish();
          return;
        }

        if (position > lastPosition + 0.03) {
          lastPosition = position;
          lastProgressTs = now;
        }

        if (now - lastProgressTs > stallTimeoutMs) {
          fail("Playback stalled before export completed");
          return;
        }

        if (now - startedAt > maxRuntimeMs) {
          fail("Playback timed out before export completed");
        }
      }, 250);

      const cleanup = function () {
        video.removeEventListener("ended", onEnded);
        video.removeEventListener("error", onError);
        window.clearInterval(intervalId);
      };

      video.addEventListener("ended", onEnded, { once: true });
      video.addEventListener("error", onError, { once: true });
    });
  }

  function verifyPreviewBlob(previewUrl) {
    const probeVideo = document.createElement("video");
    const timeoutMs = getAdaptiveTimeout(state.compatibility.probeTimeoutMs);

    return new Promise(function (resolve, reject) {
      let done = false;
      let timeoutId = 0;
      let frameProbePromise = null;

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
        if (!state.compatibility.requireFrameProbe && Number.isFinite(probeVideo.duration) && probeVideo.duration > 0) {
          return finalize(resolve);
        }
      };

      const onCanPlay = function () {
        if (!state.compatibility.requireFrameProbe) {
          finalize(resolve);
          return;
        }

        if (!frameProbePromise) {
          frameProbePromise = runFrameAdvanceProbe(probeVideo, Math.max(1200, timeoutMs - 600));
          frameProbePromise.then(function () {
            finalize(resolve);
          }).catch(function () {
            finalize(function () {
              reject(new Error("preview frame probe timeout"));
            });
          });
        }
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

      probeVideo.preload = state.compatibility.requireFrameProbe ? "auto" : "metadata";
      probeVideo.muted = true;
      probeVideo.playsInline = true;
      probeVideo.addEventListener("loadedmetadata", onLoadedMetadata);
      probeVideo.addEventListener("canplay", onCanPlay);
      probeVideo.addEventListener("error", onError);
      probeVideo.src = previewUrl;
      probeVideo.load();
    });
  }

  function runFrameAdvanceProbe(video, timeoutMs) {
    return new Promise(function (resolve, reject) {
      let done = false;
      let intervalId = 0;
      let timeoutId = 0;
      let frameCallbackId = 0;
      let callbackFrames = 0;
      const supportsFrameCallback = typeof video.requestVideoFrameCallback === "function";
      const startTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      const startFrameCount = readPresentedFrames(video);

      const cleanup = function () {
        if (intervalId) {
          window.clearInterval(intervalId);
        }
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
        if (frameCallbackId && typeof video.cancelVideoFrameCallback === "function") {
          video.cancelVideoFrameCallback(frameCallbackId);
        }
        video.pause();
      };

      const finish = function (handler) {
        if (done) {
          return;
        }
        done = true;
        cleanup();
        handler();
      };

      const hasFrameAdvanced = function (metadata) {
        const currentFrameCount = readPresentedFrames(video);
        const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;

        if (currentFrameCount != null && startFrameCount != null && currentFrameCount >= startFrameCount + 2) {
          return true;
        }

        if (metadata && typeof metadata.presentedFrames === "number" && metadata.presentedFrames >= 2) {
          return true;
        }

        if (!supportsFrameCallback && currentFrameCount == null) {
          return currentTime >= startTime + 0.18;
        }

        return false;
      };

      const playbackStart = video.play();
      if (playbackStart && typeof playbackStart.then === "function") {
        playbackStart.catch(function () {});
      }

      if (supportsFrameCallback) {
        const onFrame = function (_, metadata) {
          callbackFrames += 1;

          if (callbackFrames >= 2 || hasFrameAdvanced(metadata)) {
            finish(resolve);
            return;
          }

          frameCallbackId = video.requestVideoFrameCallback(onFrame);
        };

        frameCallbackId = video.requestVideoFrameCallback(onFrame);
      }

      intervalId = window.setInterval(function () {
        if (hasFrameAdvanced()) {
          finish(resolve);
        }
      }, 80);

      timeoutId = window.setTimeout(function () {
        finish(function () {
          reject(new Error("frame probe timeout"));
        });
      }, timeoutMs);
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

  function combineCanvasAndMediaAudioStream(canvasStream, mediaElement) {
    const videoTracks = canvasStream.getVideoTracks();
    let audioTracks = [];

    try {
      const mediaStream = typeof mediaElement.captureStream === "function"
        ? mediaElement.captureStream()
        : typeof mediaElement.mozCaptureStream === "function"
          ? mediaElement.mozCaptureStream()
          : null;

      if (mediaStream) {
        audioTracks = mediaStream.getAudioTracks();
      }
    } catch (error) {
      audioTracks = [];
    }

    if (!audioTracks.length) {
      return canvasStream;
    }

    return new MediaStream(videoTracks.concat(audioTracks));
  }

  function resolveExportPreset(selection) {
    if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
      return null;
    }

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
