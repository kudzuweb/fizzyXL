import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog", "option"]

  connect() {
    this.buffer = ""
    this.bufferTimeout = null
  }

  toggle(event) {
    // Toggle dialog open/close on 'z' keypress
    event.preventDefault()

    if (this.dialogTarget.hasAttribute("open")) {
      this.dialogTarget.close()
    } else {
      this.dialogTarget.show()
    }
  }

  handleKeydown(event) {
    // Only handle when dialog is open
    if (!this.dialogTarget.hasAttribute("open")) return

    // Ignore special keys
    if (event.metaKey || event.ctrlKey || event.altKey) return

    // Handle Enter - submit highlighted option
    if (event.key === "Enter") {
      event.preventDefault()
      this.submitHighlighted()
      return
    }

    // Handle arrow keys for navigation
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      this.navigateOptions(event.key === "ArrowDown" ? 1 : -1)
      return
    }

    // Handle character input for size selection
    // Note: 'z' is fine here since no size starts with 'z' - toggle handles it separately
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      event.preventDefault()
      this.addToBuffer(event.key.toLowerCase())
    }
  }

  navigateOptions(direction) {
    // Get all option targets
    const options = this.optionTargets

    // Find currently highlighted option
    let currentIndex = options.findIndex(opt =>
      opt.classList.contains("btn--reversed")
    )

    // If none highlighted, start at first (down) or last (up)
    if (currentIndex === -1) {
      currentIndex = direction === 1 ? -1 : options.length
    }

    // Calculate next index with wrapping
    const nextIndex = (currentIndex + direction + options.length) % options.length

    // Highlight next option
    this.highlightOption(options[nextIndex])
  }

  addToBuffer(char) {
    // Clear previous timeout
    clearTimeout(this.bufferTimeout)

    // Add character to buffer
    this.buffer += char

    // Try to match a size
    this.matchSize(this.buffer)

    // Reset buffer after 500ms
    this.bufferTimeout = setTimeout(() => {
      this.buffer = ""
    }, 500)
  }

  matchSize(input) {
    // Find matching size option
    const match = this.optionTargets.find(option => {
      const sizeValue = option.dataset.sizeValue
      return sizeValue && sizeValue.toLowerCase() === input
    })

    if (match) {
      this.highlightOption(match)
    }
  }

  highlightOption(option) {
    // Remove highlight from all options
    this.optionTargets.forEach(opt => {
      opt.classList.remove("btn--reversed")
    })

    // Highlight matched option
    option.classList.add("btn--reversed")
    this.currentHighlight = option
  }

  submitHighlighted() {
    if (this.currentHighlight) {
      this.currentHighlight.click()
    }
  }
}
