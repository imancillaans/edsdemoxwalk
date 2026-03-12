import { moveInstrumentation } from '../../scripts/scripts.js';
import getButtonVariants from './button-variants.js';
import { applyButtonVariant } from '../../scripts/theme-utils.js';

/**
 * Decorates the form block
 * @param {Element} block The form block element
 *
 * NOTE: This component uses hardcoded form labels and placeholders for better
 * Universal Editor experience. Only title, subtitle, button style, and background
 * settings are configurable.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Destructure rows based on model field order
  const [
    sectionTitleRow,
    titleRow,
    subtitleRow,
    submitButtonVariantRow,
    backgroundImageRow,
    backgroundOverlayRow,
    classesRow,
    textSizeRow,
  ] = rows;

  // Create main container
  const container = document.createElement('div');
  container.className = 'contact-form-container';

  // Process section title
  if (sectionTitleRow) {
    const titleCell = sectionTitleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'contact-form-section-title';
      moveInstrumentation(titleCell, sectionTitle);
      sectionTitle.textContent = titleText;
      container.append(sectionTitle);
    }
    sectionTitleRow.remove();
  }

  // Process main title
  if (titleRow) {
    const titleCell = titleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const title = document.createElement('h2');
      title.className = 'contact-form-title';
      moveInstrumentation(titleCell, title);
      title.textContent = titleText;
      container.append(title);
    }
    titleRow.remove();
  }

  // Process subtitle
  if (subtitleRow) {
    const subtitleCell = subtitleRow.querySelector(':scope > div');

    if (subtitleCell && subtitleCell.textContent.trim()) {
      const subtitle = document.createElement('div');
      subtitle.className = 'contact-form-subtitle';
      moveInstrumentation(subtitleCell, subtitle);

      while (subtitleCell.firstChild) {
        subtitle.append(subtitleCell.firstChild);
      }

      container.append(subtitle);
    }
    subtitleRow.remove();
  }

  // Create the actual form with hardcoded labels/placeholders
  const formElement = document.createElement('form');
  formElement.className = 'contact-form-element';

  // Name field
  const nameGroup = document.createElement('div');
  nameGroup.className = 'contact-form-group';

  const nameFieldLabel = document.createElement('label');
  nameFieldLabel.textContent = 'Name';
  nameFieldLabel.setAttribute('for', 'contact-form-name');

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'contact-form-name';
  nameInput.name = 'name';
  nameInput.placeholder = 'Enter your name';
  nameInput.required = true;

  nameGroup.append(nameFieldLabel, nameInput);

  // Email field
  const emailGroup = document.createElement('div');
  emailGroup.className = 'contact-form-group';

  const emailFieldLabel = document.createElement('label');
  emailFieldLabel.textContent = 'Email';
  emailFieldLabel.setAttribute('for', 'contact-form-email');

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'contact-form-email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Enter your email';
  emailInput.required = true;

  emailGroup.append(emailFieldLabel, emailInput);

  // Message field
  const messageGroup = document.createElement('div');
  messageGroup.className = 'contact-form-group';

  const messageFieldLabel = document.createElement('label');
  messageFieldLabel.textContent = 'Message';
  messageFieldLabel.setAttribute('for', 'contact-form-message');

  const messageTextarea = document.createElement('textarea');
  messageTextarea.id = 'contact-form-message';
  messageTextarea.name = 'message';
  messageTextarea.placeholder = 'Enter your message';
  messageTextarea.rows = 5;
  messageTextarea.required = true;

  messageGroup.append(messageFieldLabel, messageTextarea);

  // Add fields to form
  formElement.append(nameGroup, emailGroup, messageGroup);

  // Create submit button with variant
  const variants = getButtonVariants();
  let variantName = 'purple'; // default

  if (submitButtonVariantRow) {
    const variantCell = submitButtonVariantRow.querySelector(':scope > div');
    const variantText = variantCell?.textContent.trim();
    const match = variantText?.match(/\[variant-([^\]]+)\]/);
    if (match) {
      [, variantName] = match;
    }
    submitButtonVariantRow.remove();
  }

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button';
  submitButton.textContent = 'Send Message';

  // Apply variant and get wrapper (or button if no variant)
  const buttonElement = variants[variantName]
    ? applyButtonVariant(submitButton, variants[variantName])
    : submitButton;

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'contact-form-button-wrapper';
  buttonWrapper.append(buttonElement);

  formElement.append(buttonWrapper);

  // Create success message element (hidden by default)
  const successMessageElement = document.createElement('div');
  successMessageElement.className = 'contact-form-success-message';
  successMessageElement.textContent = 'Thank you! Your message has been sent.';
  successMessageElement.style.display = 'none';

  // Handle form submission
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    // Hide form and show success message
    formElement.style.display = 'none';
    successMessageElement.style.display = 'block';

    // Optional: Reset form after a delay and show it again
    setTimeout(() => {
      formElement.reset();
      formElement.style.display = 'block';
      successMessageElement.style.display = 'none';
    }, 5000); // Hide success message after 5 seconds
  });

  container.append(formElement, successMessageElement);

  // Process background image (optional)
  if (backgroundImageRow) {
    const bgImageCell = backgroundImageRow.querySelector(':scope > div');
    const picture = bgImageCell?.querySelector('picture');

    if (picture) {
      const img = picture.querySelector('img');
      if (img && img.src) {
        // Apply background image to the block
        block.style.backgroundImage = `url('${img.src}')`;
        block.style.backgroundSize = 'cover';
        block.style.backgroundPosition = 'center';
        block.style.backgroundRepeat = 'no-repeat';
        block.classList.add('has-background-image');
      }
    }
    backgroundImageRow.remove();
  }

  // Process background overlay intensity
  if (backgroundOverlayRow) {
    const overlayCell = backgroundOverlayRow.querySelector(':scope > div');
    const overlayValue = overlayCell?.textContent.trim();

    if (overlayValue && overlayValue !== 'none') {
      block.classList.add(`overlay-${overlayValue}`);
    }
    backgroundOverlayRow.remove();
  }

  // Process background color classes (handled automatically by framework)
  if (classesRow) {
    classesRow.remove();
  }

  // Process text size
  if (textSizeRow) {
    const textSizeCell = textSizeRow.querySelector(':scope > div');
    const textSize = textSizeCell?.textContent.trim();
    if (textSize && ['text-small', 'text-large'].includes(textSize)) {
      block.classList.add(textSize);
    }
    textSizeRow.remove();
  }

  // Append container to block
  block.append(container);
}
