# Changelog

Все заметные изменения проекта фиксируются здесь и дублируются в GitHub Releases.

## v1.3.1

- Smoothed the first four photo glitch presets so image corruption ramps up less destructively.
- Added layered PNG glitch rendering with a JPEG Collapse base pass followed by the selected effect.
- Kept JPEG Collapse available as its own standalone photo effect without applying it twice for PNG.

## v1.3.0

- Added point glitch mode for audio with an explicit target moment and radius instead of the old timeline focus behavior.
- Added matching point glitch controls for video so corruption can target a chosen time window or cover the full file when disabled.
- Added double-click numeric editing for slider values, including timecode-aware editing for point glitch controls.
- Fixed light/dark theme redraw for audio waveforms and mutation activity charts so they update immediately without a page refresh.

## v1.2.2

- Added a public open-source footer with version, Telegram, source, license, and privacy links.
- Added `LICENSE`, `license.html`, and `privacy.html` for GitHub Pages-friendly legal and privacy entry points.
- Moved the public site version to `site-config.js` so the app footer and static pages use one shared value.
- Updated project documentation to reflect local browser-side processing, MIT licensing, and privacy information.

## v1.2.1

- Исправлена адаптация шапки в промежуточных desktop/tablet-ширинах: компактный `Glitchy` и переключение режимов больше не конфликтуют между собой.
- Подправлен sticky header и логика морфинга заголовка в диапазонах, где раньше надпись могла наезжать на `видео / фото / аудио`.
- Исправлена загрузка аудио на iPhone/iPad: audio picker теперь принимает расширенный набор iOS-совместимых аудиоформатов и не блокирует выбор треков из `Files`.

## v1.2.0

- Видео, фото и аудио объединены в один локальный мультимедийный интерфейс с переключением режимов прямо в шапке.
- Для фото добавлены более выразительные corruption-эффекты и отдельный `jpeg collapse` / `Extreme JPEG` режим.
- Для аудио усилен локальный glitch-рендер, добавлен более агрессивный характер эффектов и более удобное preview-поведение.
- Шапка стала sticky, а большой `Glitchy` получил анимированный desktop-переход в header и отдельный мобильный режим с dropdown-переключателем медиа.
- Убраны лишние preview-бейджи, выровнены контролы, упрощена dark/mobile-подача и добавлено предупреждение для Apple-устройств о нестабильности video glitch режима.

## v1.1.1

- Релизный поток закреплен на `balanced` профиле рендера и `stable re-record` экспорте как на самом надежном сочетании для Windows-ноутбуков и длинных роликов.
- Полностью убран `Turbo` экспорт из интерфейса и основной логики, чтобы в релизе не оставалось ускоренного, но ломающего длительность режима.
- Кнопка экспорта получила встроенный прогресс: заливка идет внутри самой кнопки, текст инвертируется по мере заполнения, а финальный догон до 100% происходит только после реального завершения экспорта.
- Добавлен полноценный favicon/app icon набор: `favicon.ico`, PNG-иконки разных размеров, `apple-touch-icon`, Android icons, `site.webmanifest` и Windows tile config.
- Обновлены README, `ios-test.html` и инструкция публикации под ветку `codex/rendering-fix-lab` и релиз `v1.1.1`.

## v1.1.0

- Полностью обновлен интерфейс: новый hero-блок, переработанная сетка, панели, типографика и визуальный ритм страницы.
- Добавлены переключатели темы и языка, обновлены основные CTA и форматный пикер экспорта.
- Улучшены пресеты, блоки управления и структура превью для более быстрого сценария "загрузил, настроил, экспортировал".
- Усилен Safari-safe поток: добавлены compatibility mode, отдельная `ios-test.html` страница и более осторожная обработка превью/декодирования.
- Обновлены стили, логика интерфейса и вспомогательные ассеты под новый дизайн.

## v1.0.0

- Базовый публичный релиз с GitHub Pages деплоем.
