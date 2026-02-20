# Non‑Functional Requirements — Puzzle Pets

## NFR-100: Performance
- NFR-101: Must be usable on mid-range mobile devices without noticeable UI jank.
- NFR-102: Avoid heavy runtime dependencies unless justified (bundle discipline).

## NFR-200: Reliability & offline
- NFR-201: After first load, core gameplay must work offline (PWA caching).
- NFR-202: Saves must be durable across refresh and app restarts.
- NFR-203: Save schema must be versioned and migratable.

## NFR-300: Accessibility
- NFR-301: Touch targets sized for small kids and older hands.
- NFR-302: Color is never the only cue (shape/outline/labels supported).
- NFR-303: Support reduced motion and readable typography.

## NFR-400: Security & privacy
- NFR-401: No collection of personal data in MVP.
- NFR-402: No third-party ad/tracking SDKs.
- NFR-403: If analytics are later added, they must be privacy-respecting and optional.

## NFR-500: Maintainability (AI-agent friendly)
- NFR-501: Clear module boundaries (puzzles are plugins/modules).
- NFR-502: Unit tests for puzzle engines (pure logic).
- NFR-503: E2E tests for navigation and save durability.
- NFR-504: Small diffs + traceability maintained (`traceability.md` updated as needed).

## NFR-600: Content safety
- NFR-601: Kid-safe tone and visuals; no predatory retention design.