# TypeForge `/typing` folder — Bootstrap edition

Drop-in typing trainer for a Next.js App Router project, styled with your
project's existing Bootstrap 5 + one scoped custom CSS file.

## Setup

1. Copy the `typing` folder into your `app/` directory → `app/typing/...`
2. That's it. This assumes Bootstrap is already linked globally in your
   project (as you have it):

   ```html
   <link rel="stylesheet" href="/front-assets/css/bootstrap.min.css" />
   ```

   `typing/layout.js` only imports `./typing.css` — it does **not** import
   Bootstrap again, so there's no duplicate stylesheet and no npm install
   needed.

Routes you get: `/typing`, `/typing/learn`, `/typing/learn/lesson?id=...`,
`/typing/practice`, `/typing/stats` — all static paths, no dynamic
`[param]` route segments, so this works on plain shared hosting.
Lesson selection is done with a normal query string
(`/typing/learn/lesson?id=home-row`) instead of `/typing/learn/[lessonId]`,
since dynamic segments need server-side rewrite rules most shared
hosts don't give you.

## Theme

Restyled to match resumesathi.com directly: Poppins type, the site's
red→blue `--gradient-btn` on primary buttons, `--rk-brand` /
`--rk-brand-light` for accents, and the same 15px-radius card look
used elsewhere on the site (`typing.css`). A sticky Home / Learn /
Practice / Stats tab bar (`_components/TypingSubNav.js`) now sits
under the main navbar on every `/typing/*` page so moving between
sections is a real click, not just a page label.

## What's inside

```
typing/
  layout.js            imports typing.css, renders local nav
  typing.css             all custom styling (colors, fonts, animations,
                           keycap effect) — layered on top of your
                           existing Bootstrap link
  page.js                landing page (interactive hero)
  learn/
    page.js               lesson list + progress
    lesson/page.js          lesson runner, reads ?id= from the query string
  practice/
    page.js               5 practice modes
  stats/
    page.js               dashboard (WPM trend, error heatmap, streaks)

  _components/            (underscore = not routable)
    TypingNav.js           F1–F4 style nav for these routes
    TypingEngine.js          core typing logic + keycap-trail effect
    Keyboard.js               live virtual keyboard, finger-color coded
    HeroDemo.js                self-cycling hero typing demo
    LessonRunner.js             drives a lesson's drills end-to-end

  _lib/                   (underscore = not routable)
    lessons.js              8 progressive lesson units
    wordBank.js               common-word generator
    texts.js                    original quotes + code snippets
    keyboardLayout.js            QWERTY layout + finger map
    stats.js                       localStorage read/write + aggregation
```

Verified with a clean `next build` (Next 14, App Router, plain `.js`,
Bootstrap classes only, no Tailwind, no path aliases — only relative
imports).

## Notes

- All quotes/code snippets are original — no copyrighted text.
- Keyboard accessible, respects `prefers-reduced-motion`, visible focus
  rings throughout.
- `_components` and `_lib` are prefixed with `_` so Next.js's App Router
  ignores them as routes.
- If your global Bootstrap link ever moves or changes path, nothing here
  needs to change — this folder doesn't reference that path directly.
