/**
 * Theme utilities for variant-based styling
 * Handles button variants using CSS classes from theme.css
 */

/**
 * Finds variant marker in block rows
 * Looks for patterns like [variant-purple]
 * @param {NodeList} divContainers - Block row elements
 * @returns {Object|null} - {index, value} or null
 */
export function findVariant(divContainers) {
  if (!divContainers || divContainers.length < 1) {
    return null;
  }

  const lastIndex = divContainers.length - 1;
  const lastDiv = divContainers[lastIndex];
  const text = lastDiv?.innerText?.trim() || '';

  const match = text.match(/\[variant-([^\]]+)\]/);

  if (match) {
    return { index: lastIndex, value: match[1] };
  }

  return null;
}

/**
 * Wraps a button element in a div with the variant class
 * This allows theme.css classes like .purple .acc-button--link to work
 *
 * @param {HTMLElement} button - The button element
 * @param {Object} variantProperties - Variant configuration with className property
 * @returns {HTMLElement} - The wrapper div
 */
export function applyButtonVariant(button, variantProperties) {
  if (!button || !variantProperties || !variantProperties.className) {
    return button;
  }

  // Create wrapper div with the variant class
  const wrapper = document.createElement('div');
  wrapper.className = variantProperties.className;

  // Add acc-button--link class to the button
  button.classList.add('acc-button--link');

  // Add button to wrapper
  wrapper.appendChild(button);

  return wrapper;
}

/**
 * Applies variant classes to elements based on [[variant: ...]] markers.
 * This is for inline variant markers in content.
 *
 * @param {HTMLElement} main - The root element to scan for variant markers.
 */
export function decorateVariants(main) {
  if (!main) return;

  // Create a TreeWalker to efficiently iterate only text nodes
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);

  const variantRegex = /^\s*\[\[variant:\s*([^\]]+)\]\]\s*$/;
  const toRemove = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.trim();
    const match = text.match(variantRegex);

    if (match) {
      const variantClass = match[1].trim();
      const parent = node.parentElement;

      // Apply to previous sibling element
      let prev = parent?.previousElementSibling;

      if (!prev && parent) {
        prev = parent.parentElement?.previousElementSibling;
      }

      if (prev) {
        prev.classList.add(variantClass);
        prev.dataset.variant = variantClass;
      }

      // Mark parent element for removal
      if (parent) toRemove.push(parent);
    }
  }

  // Remove all marker elements after traversal
  toRemove.forEach((el) => el.remove());
}

export default {
  findVariant,
  applyButtonVariant,
  decorateVariants,
};
