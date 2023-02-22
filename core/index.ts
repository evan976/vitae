import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import * as puppeteer from 'puppeteer'
import MarkdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItContainer from 'markdown-it-container'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export const pdfBuilder = async (options: { name?: string; margin?: number | Record<string, any> }) => {
  const { name, margin } = options
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const url = 'file://' + resolve(__dirname, '../dist/index.html')
  await page.goto(url)

  const pdfOptions: Record<string, any> = {
    path: resolve(__dirname, `../dist/${name || 'resume'}.pdf`),
    format: 'A4',
    displayHeaderFooter: false,
    printBackground: true
  }

  if (margin || margin === 0) {
    if (['string', 'number'].includes(typeof margin)) {
      pdfOptions.margin = {}
      const keys = ['top', 'bottom', 'left', 'right']
      keys.forEach((k) => {
        pdfOptions.margin[k] = margin
      })
    }

    if (typeof margin === 'object') pdfOptions.margin = margin
  }

  await page.pdf(pdfOptions)

  await browser.close()
}

export const createMarkdownIt = (fn: (val: any) => void) => {
  const md = new MarkdownIt()

  if (typeof fn === 'function') fn(md)

  md.use(markdownItContainer, 'container', {
    validate: function (params: string) {
      const reg = /^.*$/
      return reg.test(params.trim())
    },

    render: function (tokens: { [x: string]: any }, idx: string | number) {
      const token = tokens?.[idx]
      const attrs = token?.attrs

      if (!attrs?.length) {
        return token.nesting === 1 ? '<div class="container">\n' : '</div>\n'
      }

      let attrsStr = ''
      attrs.forEach(([key, val]) => {
        attrsStr += ` ${key}="${val}"`
      })

      return token.nesting === 1 ? `<div${attrsStr}>\n` : `</div>\n`
    }
  })
  md.use(markdownItAttrs)

  return md
}
