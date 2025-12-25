import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import * as puppeteer from 'puppeteer-core'
import MarkdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItContainer from 'markdown-it-container'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export const pdfBuilder = async (options: {
  name?: string
  margin?: number | Record<string, any>
  puppeteerExecutablePath?: string
}) => {
  const { name, margin, puppeteerExecutablePath } = options
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteerExecutablePath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  })
  const page = await browser.newPage()
  
  // Read HTML and inline CSS to avoid file:// protocol issues
  const distDir = resolve(__dirname, '../dist')
  let html = fs.readFileSync(resolve(distDir, 'index.html'), 'utf-8')
  
  // Find and inline CSS
  const cssMatch = html.match(/href="\.\/([^"]+\.css)"/)
  if (cssMatch) {
    const cssFile = cssMatch[1]
    const css = fs.readFileSync(resolve(distDir, cssFile), 'utf-8')
    html = html.replace(
      `<link rel="stylesheet" crossorigin href="./${cssFile}">`,
      `<style>${css}</style>`
    )
  }
  
  await page.setContent(html, { waitUntil: 'networkidle0' })

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
