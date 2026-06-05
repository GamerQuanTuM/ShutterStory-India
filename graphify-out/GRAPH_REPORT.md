# Graph Report - shutterstoryindia  (2026-06-05)

## Corpus Check
- 39 files · ~13,527 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 183 nodes · 229 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e17cba10`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `useMedia()` - 11 edges
2. `Shutter Story India` - 11 edges
3. `getSheetsClient()` - 7 edges
4. `getSheetId()` - 7 edges
5. `getSheetTab()` - 7 edges
6. `Next.js Framework` - 6 edges
7. `GET()` - 5 edges
8. `DELETE()` - 5 edges
9. `useAuth()` - 5 edges
10. `MediaItem` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Shutter Story India` --conceptually_related_to--> `RootLayout`  [INFERRED]
  README.md → app/layout.tsx
- `Shutter Story India` --conceptually_related_to--> `Home Page`  [INFERRED]
  README.md → app/page.tsx
- `Next.js TypeScript Declarations` --references--> `Next.js Framework`  [EXTRACTED]
  next-env.d.ts → README.md
- `Shutter Story India` --conceptually_related_to--> `pnpm Workspace Configuration`  [INFERRED]
  README.md → pnpm-workspace.yaml
- `sharp Image Optimization` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  pnpm-workspace.yaml → README.md

## Hyperedges (group relationships)
- **Next.js App Router Pattern** — app_root_layout, app_home_page [INFERRED 0.90]
- **Project Build Toolchain** — eslint_config_mjs, postcss_config_mjs, next_config_ts, tailwindcss [INFERRED 0.85]
- **Default Next.js Public Directory Icons** — filestem_public_file, filestem_public_globe, filestem_public_next, filestem_public_vercel, filestem_public_window [EXTRACTED 1.00]
- **Next.js + Vercel Branding Assets** — filestem_public_next, filestem_public_vercel, concept_nextjs, concept_vercel [EXTRACTED 1.00]

## Communities (19 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (15): PLACEHOLDER_IMAGES, Props, PLACEHOLDER_THUMBS, Props, MediaContext, MediaContextType, MediaItem, MediaProvider() (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (22): DATA_FILE, DELETE(), readStore(), writeStore(), envFile, envPath, idx, key (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (16): Next.js Breaking Changes Rules, Home Page, RootLayout, CLAUDE.md Reference, create-next-app, Geist Font, Next.js TypeScript Declarations, Next.js Framework (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (5): Home(), SERVICES, FOOTER_LINKS, NAV_LINKS, TESTIMONIALS

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (6): geistMono, geistSans, inter, metadata, playfair, ThemeProvider()

### Community 5 - "Community 5"
Cohesion: 0.53
Nodes (8): POST(), getSheetId(), getSheetsClient(), getSheetTab(), SCOPES, DELETE(), GET(), PATCH()

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (7): AuthContext, AuthContextType, AuthProvider(), useAuth(), DashboardLayout(), NAV, LoginPage()

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (7): DATA_FILE, envFile, envPath, idx, key, redis, value

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (7): code:javascript (function doPost(e) {), code:env (GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s), code:bash (pnpm run dev), Step 1 — Create a Google Sheet, Step 2 — Add Apps Script, Step 3 — Deploy It, Step 4 — Add URL to `.env.local`

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (6): DATA_FILE, envFile, envPath, idx, key, value

### Community 10 - "Community 10"
Cohesion: 0.47
Nodes (5): DATA_FILE, POST(), readStore(), UPLOAD_DIR, writeStore()

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (5): Next.js Framework, Vercel Platform, Globe Icon (Web/International), Next.js Logo, Vercel Logo

## Knowledge Gaps
- **75 isolated node(s):** `eslintConfig`, `nextConfig`, `config`, `playfair`, `inter` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useMedia()` connect `Community 0` to `Community 3`, `Community 6`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Shutter Story India` (e.g. with `eslint.config.mjs` and `next.config.ts`) actually correct?**
  _`Shutter Story India` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `config` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._