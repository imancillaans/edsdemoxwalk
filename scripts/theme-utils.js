/**
 * Theme utilities for variant-based styling
 * Adapted from ACME project for button variants in banner/CTA
 */

/**
 * Finds variant marker in block rows
 * Looks for patterns like [variant-primary-green]
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
 * Resolves a CSS variable or returns the value as-is
 * @param {string} value - Value that might be a CSS variable (--var-name) or literal
 * @returns {string} - CSS variable reference or literal value
 */
export function resolveCSSValue(value) {
  if (!value) return '';

  // If it starts with --, it's a CSS variable reference
  if (value.startsWith('--')) {
    return `var(${value})`;
  }

  // Otherwise return as-is
  return value;
}

/**
 * Applies variant styling to a button element
 * @param {HTMLElement} button - Button element to style
 * @param {Object} variantProperties - Variant configuration object
 */
export function applyButtonVariant(button, variantProperties) {
  if (!button || !variantProperties) return;

  // Apply typography class if specified
  if (variantProperties.typography) {
    button.classList.add(variantProperties.typography);
  }

  // Apply background color
  if (variantProperties.backgroundColor) {
    button.style.backgroundColor = resolveCSSValue(variantProperties.backgroundColor);
  }

  // Apply text color
  if (variantProperties.textColor) {
    button.style.color = resolveCSSValue(variantProperties.textColor);
  }

  // Apply border
  if (variantProperties.borderColor) {
    const borderWidth = variantProperties.borderWidth || '2';
    button.style.border = `${borderWidth}px solid ${resolveCSSValue(variantProperties.borderColor)}`;
  }

  // Apply border radius
  if (variantProperties.borderRadius) {
    button.style.borderRadius = `${variantProperties.borderRadius}px`;
  }

  // Apply padding
  if (variantProperties.paddingLeftRight && variantProperties.paddingBottomTop) {
    button.style.padding = `${variantProperties.paddingBottomTop}px ${variantProperties.paddingLeftRight}px`;
  }

  // Apply font weight
  if (variantProperties.fontWeight) {
    button.style.fontWeight = variantProperties.fontWeight;
  }

  // Apply text decoration
  if (variantProperties.textDecoration) {
    button.style.textDecoration = variantProperties.textDecoration;
  }

  // Apply hover styles via data attributes (CSS will use these)
  if (variantProperties.backgroundColorHover) {
    button.dataset.hoverBg = resolveCSSValue(variantProperties.backgroundColorHover);
  }

  if (variantProperties.textColorHover) {
    button.dataset.hoverColor = resolveCSSValue(variantProperties.textColorHover);
  }

  if (variantProperties.borderColorHover) {
    button.dataset.hoverBorder = resolveCSSValue(variantProperties.borderColorHover);
  }
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
  resolveCSSValue,
  applyButtonVariant,
  decorateVariants,
};
