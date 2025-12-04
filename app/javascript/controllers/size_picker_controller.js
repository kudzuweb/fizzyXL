import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog", "option"]

  connect() {
    this.buffer = ""
    this.bufferTimeout = null
    this.originalHighlight = this.optionTargets.find(opt =>
      opt.classList.contains("btn--reversed")
    )
  }

  toggle(event) {
    if (this.shouldIgnore(event)) return

    event.preventDefault()

    const dialogController = this.application.getControllerForElementAndIdentifier(this.element, "dialog")

    if (this.dialogTarget.hasAttribute("open")) {
      dialogController.close()
    } else {
      dialogController.open()
      this.initializeHighlight()
    }
  }

  initializeHighlight() {
    // Always assign to keep visual and internal state synchronized
    this.currentHighlight = this.optionTargets.find(opt =>
      opt.classList.contains("btn--reversed")
    )
  }

  resetHighlight() {
    this.optionTargets.forEach(opt => {
      opt.classList.remove("btn--reversed")
    })
    if (this.originalHighlight) {
      this.originalHighlight.classList.add("btn--reversed")
    }
  }

  shouldIgnore(event) {
    return event.defaultPrevented || event.target.closest("input, textarea, lexxy-editor")
  }

  handleKeydown(event) {
    if (!this.dialogTarget.hasAttribute("open")) return

    if (event.metaKey || event.ctrlKey || event.altKey) return

    if (event.key === "Enter") {
      event.preventDefault()
      this.submitHighlighted()
      return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      this.navigateOptions(event.key === "ArrowDown" ? 1 : -1)
      return
    }

    // Skip 'z' - let toggle action handle it
    if (event.key.toLowerCase() === "z") return

    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      event.preventDefault()
      this.addToBuffer(event.key.toLowerCase())
    }
  }

  navigateOptions(direction) {
    const options = this.optionTargets

    let currentIndex = options.findIndex(opt =>
      opt.classList.contains("btn--reversed")
    )

    if (currentIndex === -1) {
      currentIndex = direction === 1 ? -1 : options.length
    }

    const nextIndex = (currentIndex + direction + options.length) % options.length

    this.highlightOption(options[nextIndex])
  }

  addToBuffer(char) {
    clearTimeout(this.bufferTimeout)

    this.buffer += char

    this.matchSize(this.buffer)

    this.bufferTimeout = setTimeout(() => {
      this.buffer = ""
    }, 500)
  }

  matchSize(input) {
    const match = this.optionTargets.find(option => {
      const sizeValue = option.dataset.sizeValue
      return sizeValue && sizeValue.toLowerCase() === input
    })

    if (match) {
      this.highlightOption(match)
    }
  }

  highlightOption(option) {
    this.optionTargets.forEach(opt => {
      opt.classList.remove("btn--reversed")
    })

    option.classList.add("btn--reversed")
    this.currentHighlight = option
  }

  submitHighlighted() {
    if (this.currentHighlight) {
      this.currentHighlight.click()
    }
  }
}
