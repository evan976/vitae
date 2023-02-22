import { defineConfig } from 'vite'
import markdownItImsize from 'markdown-it-imsize'
import markdownToResume from './core/plugin'

export default defineConfig({
  base: './',
  plugins: [
    markdownToResume({
      markdown: (md) => {
        md.use(markdownItImsize)
      },
      pdfName: '前端开发_邬继华_社招_18006416535',
      pdfMargin: 0,
      webTitle: '前端开发_邬继华_社招_18006416535',
    })
  ],
  build: {
    assetsDir: './'
  }
})
