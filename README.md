# tgcontest-web-app

A web messenger client for Telegram, built as an entry for a Telegram web app contest.

Unofficial project, not affiliated with Telegram.

## Status

Work in progress:

- Login screen: country picker with search, phone input.
- Main app shell: chat list, chat view, message input (static UI for now).
- The real Telegram connection via tdweb (TDLib compiled to WebAssembly) is
  started but not wired up yet; see `src/js/classes` for the current state.

## Stack

- Plain JavaScript (ES modules), SCSS
- webpack 4, Babel
- tdweb (TDLib in WebAssembly) for the planned MTProto connection
- simplebar for custom scrollbars

## Getting started

Requires Node.js 13 or older (node-sass 4 has no prebuilt binaries for newer
versions).

```sh
cp env.example .env
# fill in APP_ID and APP_HASH from https://my.telegram.org/apps
npm install
npm start
```

Open http://localhost:3000. Add `?login` to the URL to see the login screen.

## Project layout

```
src/html          page templates (index, login, app shell)
src/js            entry points, helpers, tdweb config
src/scss          styles
src/js/tdweb      prebuilt tdweb worker and wasm files
dist/img, dist/fonts   static assets (icons, fonts)
TelegramAPI_webogram/ vendored reference copy of a webogram-based
                  Telegram API wrapper, unused by the build
```

## License

MIT, except `TelegramAPI_webogram/`, which is a vendored copy of a
webogram-based library licensed under GPL-3.0.
