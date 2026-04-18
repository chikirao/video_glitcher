# Glitchy

Glitchy is a static browser-based tool for glitching video, photo, and audio files locally.

The video mode mutates container and payload bytes. The photo mode uses file corruption with live preview and render export. The audio mode renders local glitch effects with preview and export. No install step is required for normal use.

## Demo

- GitHub Pages: [https://chikirao.github.io/video_glitcher/](https://chikirao.github.io/video_glitcher/)
- Apple test page: [https://chikirao.github.io/video_glitcher/ios-test.html](https://chikirao.github.io/video_glitcher/ios-test.html)

## Run locally

1. Clone or download the repository.
2. Open one of the launcher scripts if you want:
   - `Windows`: `open-video-glitcher.bat`
   - `macOS`: `open-video-glitcher.command`
   - `Linux`: `open-video-glitcher.sh`
3. Or just open `index.html` directly in a browser.

If a browser is strict with local file access, run a simple local server:

```powershell
py -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Features

- Video byte glitching with live preview and export controls.
- Photo corruption with binary mutation, presets, and render export.
- Audio glitch rendering with presets, waveform preview, and export.
- Dark theme and `RU/EN` interface toggle inside the app.

## Privacy

Glitchy is a client-side static site. User media files are processed locally in the browser for preview and export.

The app may store basic interface preferences locally, such as theme, language, or dismissed notices.

If the site is hosted on GitHub Pages, GitHub may process standard technical request data as the hosting provider.

See [privacy.html](./privacy.html) for the site privacy page.

## License

This project is licensed under the MIT License.

- License file: [LICENSE](./LICENSE)
- Web page: [license.html](./license.html)

## Releases

- GitHub Releases: [https://github.com/chikirao/video_glitcher/releases](https://github.com/chikirao/video_glitcher/releases)
- Local changelog: [CHANGELOG.md](./CHANGELOG.md)
