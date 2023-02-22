import './styles/index.scss'
import './resume.md'

const printButton = document.getElementById('print-button') as HTMLElement

printButton.addEventListener('click', (event) => {
  event.preventDefault()
  window.print()
})