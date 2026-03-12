import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import getButtonVariants from './button-variants.js';
import { applyButtonVariant } from '../../scripts/theme-utils.js';

/**
 * Decorates the meet-the-team block
 * @param {Element} block The meet-the-team block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Destructure rows based on model field order
  // Note: cta1LinkText and cta2LinkText are NOT separate rows - the text is in the link element
  const [
    sectionTitleRow,
    titleRow,
    imageRow,
    descriptionRow,
    cta1LinkRow,
    cta1VariantRow,
    cta2LinkRow,
    cta2VariantRow,
    backgroundImageRow,
    backgroundOverlayRow,
    classesRow,
    textSizeRow,
  ] = rows;

  // Create main container
  const container = document.createElement('div');
  container.className = 'meet-the-team-container';

  // Process section title
  if (sectionTitleRow) {
    const titleCell = sectionTitleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'meet-the-team-section-title';
      moveInstrumentation(titleCell, sectionTitle);
      sectionTitle.textContent = titleText;
      container.append(sectionTitle);
    }
    sectionTitleRow.remove();
  }

  // Process person image
  if (imageRow) {
    const imageCell = imageRow.querySelector(':scope > div');
    const picture = imageCell?.querySelector('picture');

    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'meet-the-team-image';

        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt || 'Team member',
          false,
          [{ width: '300' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
        container.append(imageWrapper);
      }
    }
    imageRow.remove();
  }

  // Process main title
  if (titleRow) {
    const titleCell = titleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const title = document.createElement('h2');
      title.className = 'meet-the-team-title';
      moveInstrumentation(titleCell, title);
      title.textContent = titleText;
      container.append(title);
    }
    titleRow.remove();
  }

  // Process description
  if (descriptionRow) {
    const descCell = descriptionRow.querySelector(':scope > div');

    if (descCell && descCell.textContent.trim()) {
      const description = document.createElement('div');
      description.className = 'meet-the-team-description';
      moveInstrumentation(descCell, description);

      while (descCell.firstChild) {
        description.append(descCell.firstChild);
      }

      container.append(description);
    }
    descriptionRow.remove();
  }

  // Process buttons
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'meet-the-team-buttons';
  const variants = getButtonVariants();

  // Process CTA 1 (Primary Button)
  if (cta1LinkRow) {
    const linkCell = cta1LinkRow.querySelector(':scope > div');
    const link = linkCell?.querySelector('a');

    if (link) {
      const btn1 = document.createElement('a');
      btn1.href = link.getAttribute('href') || '';
      btn1.className = 'button';
      btn1.textContent = link.textContent.trim();
      moveInstrumentation(link, btn1);

      // Apply variant styling
      let variantName = 'purple'; // default
      if (cta1VariantRow) {
        const variantCell = cta1VariantRow.querySelector(':scope > div');
        const variantText = variantCell?.textContent.trim();
        const match = variantText?.match(/\[variant-([^\]]+)\]/);
        if (match) {
          [, variantName] = match;
        }
        cta1VariantRow.remove();
      }

      // Apply variant and get wrapper (or button if no variant)
      const buttonElement = variants[variantName]
        ? applyButtonVariant(btn1, variants[variantName])
        : btn1;

      buttonsWrapper.append(buttonElement);
    }
    cta1LinkRow.remove();
  }

  // Process CTA 2 (Secondary Button)
  if (cta2LinkRow) {
    const linkCell = cta2LinkRow.querySelector(':scope > div');
    const link = linkCell?.querySelector('a');

    if (link) {
      const btn2 = document.createElement('a');
      btn2.href = link.getAttribute('href') || '';
      btn2.className = 'button';
      btn2.textContent = link.textContent.trim();
      moveInstrumentation(link, btn2);

      // Apply variant styling
      let variantName = 'outline'; // default for secondary button
      if (cta2VariantRow) {
        const variantCell = cta2VariantRow.querySelector(':scope > div');
        const variantText = variantCell?.textContent.trim();
        const match = variantText?.match(/\[variant-([^\]]+)\]/);
        if (match) {
          [, variantName] = match;
        }
        cta2VariantRow.remove();
      }

      // Apply variant and get wrapper (or button if no variant)
      const buttonElement = variants[variantName]
        ? applyButtonVariant(btn2, variants[variantName])
        : btn2;

      buttonsWrapper.append(buttonElement);
    }
    cta2LinkRow.remove();
  }

  if (buttonsWrapper.children.length > 0) {
    container.append(buttonsWrapper);
  }

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
