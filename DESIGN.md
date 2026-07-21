# Cellular Beam Professional Pro — Design System

> Extracted from Stitch project `12210180142887188401` on 2026-07-21.

## Theme

- Mode: Light
- Primary brand color: `#3366CC`
- Headline/report font: Noto Serif
- Interface/body font: Hanken Grotesk
- Technical data font: JetBrains Mono

## Color Palette

### Brand and accents

| Token                        | Value     |
| ---------------------------- | --------- |
| `primary`                    | `#094CB2` |
| `primary-container`          | `#3366CC` |
| `on-primary`                 | `#FFFFFF` |
| `on-primary-container`       | `#E7EBFF` |
| `primary-fixed`              | `#D9E2FF` |
| `primary-fixed-dim`          | `#B1C5FF` |
| `on-primary-fixed`           | `#001946` |
| `on-primary-fixed-variant`   | `#00419D` |
| `inverse-primary`            | `#B1C5FF` |
| `secondary`                  | `#3A5F94` |
| `secondary-container`        | `#9FC2FE` |
| `on-secondary`               | `#FFFFFF` |
| `on-secondary-container`     | `#294F83` |
| `secondary-fixed`            | `#D5E3FF` |
| `secondary-fixed-dim`        | `#A7C8FF` |
| `on-secondary-fixed`         | `#001B3C` |
| `on-secondary-fixed-variant` | `#1F477B` |
| `tertiary`                   | `#863E00` |
| `tertiary-container`         | `#AB5100` |
| `on-tertiary`                | `#FFFFFF` |
| `on-tertiary-container`      | `#FFE8DB` |
| `tertiary-fixed`             | `#FFDBC8` |
| `tertiary-fixed-dim`         | `#FFB68A` |
| `on-tertiary-fixed`          | `#321300` |
| `on-tertiary-fixed-variant`  | `#743500` |

### Surfaces and neutrals

| Token                       | Value     |
| --------------------------- | --------- |
| `background`                | `#FBF9F8` |
| `on-background`             | `#1B1C1C` |
| `surface`                   | `#FBF9F8` |
| `surface-canvas`            | `#F8F9FA` |
| `surface-bleached`          | `#FFFFFF` |
| `surface-dim`               | `#DCD9D9` |
| `surface-bright`            | `#FBF9F8` |
| `surface-container-lowest`  | `#FFFFFF` |
| `surface-container-low`     | `#F6F3F2` |
| `surface-container`         | `#F0EDED` |
| `surface-container-high`    | `#EAE8E7` |
| `surface-container-highest` | `#E4E2E1` |
| `surface-variant`           | `#E4E2E1` |
| `surface-tint`              | `#2259BF` |
| `on-surface`                | `#1B1C1C` |
| `on-surface-variant`        | `#434653` |
| `inverse-surface`           | `#303030` |
| `inverse-on-surface`        | `#F3F0F0` |
| `outline`                   | `#737784` |
| `outline-variant`           | `#C3C6D5` |
| `border-subtle`             | `#E0E0E0` |
| `engineering-ink`           | `#1A1A1B` |

### Status and feedback

| Token                | Value     |
| -------------------- | --------- |
| `status-pass`        | `#2E7D32` |
| `status-fail`        | `#D32F2F` |
| `status-warning`     | `#ED6C02` |
| `error`              | `#BA1A1A` |
| `error-container`    | `#FFDAD6` |
| `on-error`           | `#FFFFFF` |
| `on-error-container` | `#93000A` |

## Typography

### Font roles

- **Noto Serif** — reports, formal documentation, and high-level headings.
- **Hanken Grotesk** — interface text, controls, labels, and supporting copy.
- **JetBrains Mono** — formulas, dimensions, calculated values, and tabular engineering data.

### Type scale

| Token              | Family         | Size | Weight | Line height | Letter spacing |
| ------------------ | -------------- | ---: | -----: | ----------: | -------------: |
| `report-h1`        | Noto Serif     | 34px |    700 |        44px |        -0.02em |
| `report-h1-mobile` | Noto Serif     | 28px |    700 |        36px |              — |
| `report-h2`        | Noto Serif     | 24px |    600 |        32px |              — |
| `report-body`      | Noto Serif     | 16px |    400 |        26px |              — |
| `ui-header-lg`     | Hanken Grotesk | 20px |    600 |        28px |              — |
| `ui-body-md`       | Hanken Grotesk | 14px |    400 |        20px |              — |
| `ui-label-sm`      | Hanken Grotesk | 12px |    600 |        16px |         0.05em |
| `data-mono`        | JetBrains Mono | 13px |    400 |        18px |              — |

## Usage Guidance

- Use Engineering Blue (`primary-container`) for primary actions and meaningful brand accents.
- Use `surface-canvas` for the application workspace and `surface-bleached` for cards and containers.
- Use `engineering-ink` or `on-surface` for high-emphasis text.
- Reserve status colors for calculation outcomes: pass, fail, and warning.
- Right-align numerical table data and render it with `data-mono`.
- Use Noto Serif for report content; keep operational UI text in Hanken Grotesk.
