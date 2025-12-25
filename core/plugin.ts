import { resolve } from 'path'
import fs from 'fs-extra'
import { createFilter } from '@rollup/pluginutils'
import { minify as minifyHtml } from 'html-minifier-terser'
import { createMarkdownIt, pdfBuilder, __dirname } from './index'
import MarkdownIt from 'markdown-it'

export default function plugin(options: {
  pdfName: string
  webTitle: string
  markdown: (md: MarkdownIt) => void
  pdfMargin: number | Record<string, any>
}) {
  const { pdfName, webTitle, markdown, pdfMargin } = options

  return {
    name: 'build',
    enforce: 'post' as const,

    transformIndexHtml(html: string) {
      const md = createMarkdownIt(markdown)
      const readme = fs.readFileSync(resolve(__dirname, '../src/resume.md')).toString()

      return html.replace('#[title]', webTitle || pdfName || 'resume').replace('#[content]', md.render(readme))
    },

    transform(val: any, id: unknown) {
      const filter = createFilter(['**/*.md'])
      if (!filter(id)) return null

      return {
        code: `export default ${JSON.stringify(val)}`
      };
    },

    async generateBundle(_: any, bundle: Record<string, any>) {
      for (const info of Object.values(bundle)) {
        const filter = createFilter(['**/*.html'])
        if (info.type === 'asset' && filter(info.fileName) && typeof info.source === 'string') {
          info.source = await minifyHtml(info.source, {
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
          })
        }
      }
    },

    async closeBundle() {
      await pdfBuilder({
        name: pdfName,
        margin: pdfMargin
      })
    }
  }
}
