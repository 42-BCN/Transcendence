# Browser Compatibility

## Supported Browsers

| Browser | Minimum Version | Status |
| ------- | --------------- | ------ |
| Chrome  | Last 2 versions | Fully supported |
| Firefox | Last 2 versions | Fully supported |
| Safari  | Last 2 versions | Fully supported |
| Edge    | Last 2 versions | Fully supported |

The project is configured via `browserslist` in `package.json` to target these browsers. Autoprefixer and Next.js/SWC use this configuration for CSS prefixing and JavaScript transpilation.

## Known Limitations

### WebGL (Three.js)

The game and robots features require WebGL support with hardware acceleration enabled.

- **Firefox**: Users must have hardware acceleration enabled (`about:config` → `layers.acceleration.force-enabled`).
- **Safari**: WebGL is supported from Safari 8+, but performance may vary on older devices.
- **Edge**: Full support via Chromium engine.
- **Fallback**: A user-friendly message is displayed if WebGL is unavailable, advising to enable hardware acceleration.

### Backdrop Filter (Glass UI)

The glass card effect uses `backdrop-filter: blur()` and `backdrop-saturate()`.

- **Chrome/Edge**: Full support.
- **Firefox**: Full support from Firefox 103+.
- **Safari**: Supported with `-webkit-backdrop-filter` prefix (handled by Autoprefixer).
- **Fallback**: When `backdrop-filter` is not supported, elements receive an opaque background via `@supports` rule.

### Dynamic Viewport Units (dvh)

The app uses `100dvh` for full-height layouts (addresses mobile browser toolbar issues).

- **Chrome**: Supported from v108+.
- **Firefox**: Supported from v116+.
- **Safari**: Supported from v15.4+.
- **Fallback**: Every `dvh` declaration has a preceding `100vh` (`h-screen`) fallback.

### Socket.IO Transport

WebSocket is preferred but HTTP long-polling is configured as a fallback transport. This ensures connectivity behind restrictive proxies or firewalls across all browsers.

### Viewport `interactiveWidget`

The `interactiveWidget: 'resizes-content'` viewport property (mobile keyboard behavior) is silently ignored by browsers that don't support it. No visual degradation.

### `text-box-trim` / `text-box-edge`

Used for precise text alignment, wrapped in `@supports`. Only Chrome 133+ currently supports it. No visual regression in other browsers — standard line-height is used instead.

## Testing

### Running Cross-Browser Tests

The project uses Vitest + Playwright for browser-based component testing across three engines:

```bash
# Run tests in Chromium only (default)
npm test

# Run tests in Firefox
npm run test:firefox

# Run tests in WebKit (Safari engine)
npm run test:webkit

# Run tests in all browsers
npm run test:all-browsers
```

### Manual Testing Checklist

When testing features manually, verify the following in each supported browser:

- [ ] Authentication flow (login, register, OAuth)
- [ ] Navigation (desktop sidebar, mobile drawer)
- [ ] Chat functionality (messages, real-time updates)
- [ ] Game (WebGL rendering, controls, matchmaking)
- [ ] Theme switching (dark/light mode)
- [ ] Glass card visual effects (blur, borders)
- [ ] Responsive layouts (mobile, tablet, desktop)
- [ ] Tooltips (animation on enter/exit)
- [ ] Drawer (overlay blur, slide animation)
- [ ] Form validation and autofill styling

### Installing Browser Engines for Testing

Playwright requires browser binaries to be installed:

```bash
npx playwright install chromium firefox webkit
```

## Architecture Decisions

### Why not `tailwindcss-animate`?

Animation keyframes (`animate-in`, `fade-in`, `slide-in-from-*`) are defined directly in `globals.css` rather than importing the `tailwindcss-animate` plugin. This provides:
- Zero additional dependency
- Full control over animation behavior
- Cross-browser compatible keyframes using CSS custom properties

### Why polling fallback in Socket.IO?

While WebSocket is the primary transport (lower latency), HTTP long-polling is kept as fallback to ensure connectivity in environments where WebSocket connections may be blocked (corporate firewalls, restrictive proxies).
