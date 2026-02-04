# Vitae

A minimal Markdown-based resume generator that outputs both HTML and PDF.

> _Vitae_ - from Latin "Curriculum Vitae", also a nod to Vite.

## Features

- Write your resume in Markdown
- Customizable styles with TailwindCSS v4
- **8 built-in color themes**
- Auto-generates PDF on build
- Hot reload during development
- Print-friendly layout

## Tech Stack

- **Vite** - Fast build tool
- **TailwindCSS v4** - Utility-first CSS framework
- **Markdown-it** - Markdown parser with plugins
- **Puppeteer** - PDF generation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Google Chrome (for PDF generation)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

Generates HTML and PDF in the `dist/` folder:

```bash
pnpm build
```

## Usage

1. Edit your resume in `src/resume.md`
2. Customize styles in `src/styles/index.css`
3. Configure output settings in `vite.config.ts`:

```typescript
markdownToResume({
  pdfName: 'Your_Name_Resume',
  webTitle: 'Your Name - Resume',
  pdfMargin: 0,
  theme: 'ocean',
})
```

## Themes

8 built-in color themes are available:

| Theme      | Name           | Description                                |
| ---------- | -------------- | ------------------------------------------ |
| `ocean`    | Ocean Blue     | Classic deep blue, professional and stable |
| `forest`   | Forest Green   | Natural and fresh green tones              |
| `violet`   | Elegant Violet | Sophisticated and mysterious purple tones  |
| `sunset`   | Sunset Orange  | Warm and vibrant orange tones              |
| `rose`     | Rose Red       | Elegant and soft rose tones                |
| `midnight` | Midnight Black | Calm and restrained dark tones             |
| `sky`      | Sky Blue       | Bright and refreshing light blue tones     |
| `amber`    | Amber Gold     | Elegant and luxurious golden tones         |

To change the theme, update the `theme` option in `vite.config.ts`:

```typescript
// Use forest green theme
theme: 'forest'
```

## Project Structure

```
├── src/
│   ├── resume.md          # Your resume content
│   └── styles/
│       └── index.css      # TailwindCSS styles
├── core/
│   ├── index.ts           # PDF builder & Markdown config
│   ├── plugin.ts          # Vite plugin
│   └── themes.ts          # Theme definitions
├── dist/                  # Build output
└── vite.config.ts         # Vite configuration
```

## License

MIT
