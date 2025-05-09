import type { ConfigurableDocument } from '../_configurable'
import { defaultDocument } from '../_configurable'
/* this implementation is original ported from https://github.com/streamich/react-use by Vadim Dalecky */
import { useEventListener } from '../useEventListener'

function isFocusedElementEditable() {
  const { activeElement, body } = document

  if (!activeElement)
    return false

  // If not element has focus, we assume it is not editable, too.
  if (activeElement === body)
    return false

  // Assume <input> and <textarea> elements are editable.
  switch (activeElement.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return true
  }

  // Check if any other focused element id editable.
  return activeElement.hasAttribute('contenteditable')
}

function isTypedCharValid({
  keyCode,
  metaKey,
  ctrlKey,
  altKey,
}: KeyboardEvent) {
  if (metaKey || ctrlKey || altKey)
    return false

  // 0...9
  if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105))
    return true

  // A...Z
  if (keyCode >= 65 && keyCode <= 90)
    return true

  // All other keys.
  return false
}

/**
 * Fires when users start typing on non-editable elements.
 *
 * @see https://vueuse.org/onStartTyping
 * @param callback
 * @param options
 */
export function onStartTyping(callback: (event: KeyboardEvent) => void, options: ConfigurableDocument = {}) {
  const { document = defaultDocument } = options

  const keydown = (event: KeyboardEvent) => {
    if (!isFocusedElementEditable() && isTypedCharValid(event)) {
      callback(event)
    }
  }

  if (document)
    useEventListener(document, 'keydown', keydown, { passive: true })
}
