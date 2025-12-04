import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog", "option"]

  connect() {
    this.buffer = ""
    this.bufferTimeout = null
    // Store reference to the originally selected option for restoration
    this.originalHighlight = this.optionTargets.find(opt =>
      opt.classList.contains("btn--reversed")
    )
  }

  toggle(event) {
    // Toggle dialog open/close on 'z' keypress
    // Skip if user is typing in an input, textarea, or editor
    if (this.shouldIgnore(event)) return

    event.preventDefault()

    // Delegate to dialog controller for proper state management
    const dialogController = this.application.getControllerForElementAndIdentifier(this.element, "dialog")

    if (this.dialogTarget.hasAttribute("open")) {
      dialogController.close()
    } else {
      dialogController.open()
      // Initialize currentHighlight to the already selected option
      this.initializeHighlight()
    }
  }

  initializeHighlight() {
    // Find the option that's already highlighted (current size)
    // Always assign to keep visual and internal state synchronized
    this.currentHighlight = this.optionTargets.find(opt =>
      opt.classList.contains("btn--reversed")
    )
  }

  resetHighlight() {
    // Restore highlight to the originally selected option
    // This runs when dialog closes without a selection being made
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

    // Skip 'z' - let toggle action handle it for closing the dialog
    if (event.key.toLowerCase() === "z") return

    // Handle character input for size selection
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
