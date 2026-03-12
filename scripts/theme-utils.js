/**
 * Theme utilities for variant-based styling
 * Handles multiple theme types (buttons, separators, typography) using CSS classes from theme.css
 *
 * Theme types supported:
 * - Buttons: Wrapped in variant div with .acc-button--link class
 * - Separators: Wrapped in variant div with .acc-separator__spacer class
 * - Typography: Direct class application (.text-* classes)
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
  /* eslint-disable no-console */
  console.log('>>> applyButtonVariant called');
  console.log('  Button:', button);
  console.log('  Button tag:', button.tagName);
  console.log('  Button current classes:', button.className);
  console.log('  Variant properties:', variantProperties);
  /* eslint-enable no-console */

  if (!button || !variantProperties || !variantProperties.className) {
    /* eslint-disable no-console */
    console.log('  Returning button without wrapper (missing data)');
    /* eslint-enable no-console */
    return button;
  }

  // Create wrapper div with the variant class
  const wrapper = document.createElement('div');
  wrapper.className = variantProperties.className;

  /* eslint-disable no-console */
  console.log('  Created wrapper div with class:', wrapper.className);
  /* eslint-enable no-console */

  // Add acc-button--link class to the button
  button.classList.add('acc-button--link');

  /* eslint-disable no-console */
  console.log('  Added acc-button--link to button, new classes:', button.className);
  /* eslint-enable no-console */

  // Add button to wrapper
  wrapper.appendChild(button);

  /* eslint-disable no-console */
  console.log('  Appended button to wrapper');
  console.log('  Wrapper HTML:', wrapper.outerHTML);
  console.log('  Wrapper children:', wrapper.children.length);
  console.log('<<< applyButtonVariant returning wrapper\n');
  /* eslint-enable no-console */

  return wrapper;
}

/**
 * Wraps a separator element in a div with the variant class
 * This allows theme.css classes like .gray_line .acc-separator__spacer to work
 *
 * @param {HTMLElement} separator - The separator element
 * @param {Object} variantProperties - Variant configuration with className property
 * @returns {HTMLElement} - The wrapper div
 */
export function applySeparatorVariant(separator, variantProperties) {
  if (!separator || !variantProperties || !variantProperties.className) {
    return separator;
  }

  // Create wrapper div with the variant class
  const wrapper = document.createElement('div');
  wrapper.className = variantProperties.className;

  // Add acc-separator__spacer class to the separator
  separator.classList.add('acc-separator__spacer');

  // Add separator to wrapper
  wrapper.appendChild(separator);

  return wrapper;
}

/**
 * Applies typography style directly to an element
 * Typography styles don't use wrappers - class is applied directly
 *
 * @param {HTMLElement} element - The element to style
 * @param {Object} variantProperties - Variant configuration with className property
 * @returns {HTMLElement} - The same element with class applied
 */
export function applyTypographyStyle(element, variantProperties) {
  if (!element || !variantProperties || !variantProperties.className) {
    return element;
  }

  // Add typography class directly to element
  element.classList.add(variantProperties.className);

  return element;
}

/**
 * Generic function to apply any theme variant
 * Automatically detects whether to use wrapper or direct class application
 *
 * @param {HTMLElement} element - The element to apply theme to
 * @param {Object} variantProperties - Variant configuration
 * @param {string} variantProperties.className - CSS class name
 * @param {boolean} variantProperties.usesWrapper - Whether to wrap element
 * @param {string} variantProperties.baseClassName - Base class to add to element
 *   (e.g., 'acc-button--link')
 * @returns {HTMLElement} - Either wrapper div or the element itself
 */
export function applyThemeVariant(element, variantProperties) {
  if (!element || !variantProperties || !variantProperties.className) {
    return element;
  }

  if (variantProperties.usesWrapper) {
    // Create wrapper div with variant class
    const wrapper = document.createElement('div');
    wrapper.className = variantProperties.className;

    // Add base class to element if specified
    if (variantProperties.baseClassName) {
      element.classList.add(variantProperties.baseClassName);
    }

    // Add element to wrapper
    wrapper.appendChild(element);

    return wrapper;
  }

  // Direct class application (for typography)
  element.classList.add(variantProperties.className);
  return element;
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
  applySeparatorVariant,
  applyTypographyStyle,
  applyThemeVariant,
  decorateVariants,
};
