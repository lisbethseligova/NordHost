# NordHost

Statická landing page pro nabídku dedikovaných serverů — nasazená na **https://nordhost.2marsa.cz**.

## Struktura

```
NordHost/
├── index.html                   # samotný web (single-file: HTML + inline CSS + inline JS)
├── .github/workflows/deploy.yml # CI/CD: push na main → rsync na VPS
├── .gitignore
└── README.md
```

## Deploy

Push na `main` → GitHub Actions → rsync přes SSH na VPS do `/var/www/nordhost/`.

Manuální spuštění:
```powershell
gh workflow run "Deploy" --repo lisbethseligova/NordHost
```

Sledování:
```powershell
gh run watch --repo lisbethseligova/NordHost
```

## Lokální preview

Žádný build, žádné dependencies. Stačí:
```powershell
# Python:
python -m http.server 8080

# Nebo prostě otevři index.html v prohlížeči
```

## První nasazení

Než tohle repo poprvé deployne, musí být na VPS hotová příprava — viz [`../../runbook-nordhost-deploy.md`](../../runbook-nordhost-deploy.md):

1. DNS A záznam `nordhost.2marsa.cz` → 37.46.211.203
2. `apt install rsync` na VPS *(řeší zároveň zaseklý Helix deploy)*
3. `/var/www/nordhost/` s vlastníkem `deploy:www-data`
4. nginx vhost + Let's Encrypt
5. GitHub Secrets: `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`

## Konvence

Repo sleduje stejný pattern jako ostatní weby v `_REPO/web/` (Helix, PBSMB, sscz, llama, dahareal, schinkmann). Workflow má navíc oproti Helixu:

- `concurrency` — zabraňuje, aby běžely dva deploye souběžně
- `Verify SSH + rsync na VPS` — předem zkontroluje, že rsync na VPS existuje a `/var/www/nordhost/` taky (jinak skončí s informativní chybou)
- `Smoke test` — po nasazení kontroluje, že web odpovídá HTTP 200

## Vlastnosti webu

- Statický web rozdělený do `index.html` + `css/style.css` + `js/app.js`
- Single-page demo flow: landing → katalog (5 serverů) → detail → checkout → potvrzení → portál (dashboard, server detail s tabs, faktury)
- Externí závislosti: pouze Google Fonts (Inter + Space Grotesk + JetBrains Mono)
- Responsive, dark/light mode toggle s persistencí přes `localStorage`
- Žádný build krok, žádné `node_modules`

## Sekce

- Hero s gradientem + animovaný terminál cursor
- Trust strip (uptime / aktivace / DC / support)
- Why NordHost — 6 USP karet
- Jak to funguje — 3-step process
- Datová centra — Praha CZ, Frankfurt DE
- FAQ (8 otázek, native `<details>`)
- Final CTA + footer

## Co dál (až bude potřeba)

- rozdělit CSS/JS do samostatných souborů (lepší cache)
- přidat sitemap.xml a robots.txt
- analytics (Plausible / Umami self-hosted)
- preconnect na fonts.gstatic.com pro rychlejší první vykreslení
