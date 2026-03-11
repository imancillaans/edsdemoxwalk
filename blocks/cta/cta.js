import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the CTA block
 * @param {Element} block The CTA block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, subtitleRow, buttonsRow, imageRow] = rows;

  // Create CTA content wrapper (left side)
  const ctaContent = document.createElement('div');
  ctaContent.className = 'cta-content';

  // Process title
  if (titleRow) {
    const titleCell = titleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const title = document.createElement('h2');
      title.className = 'cta-title';
      moveInstrumentation(titleCell, title);
      title.textContent = titleText;
      ctaContent.append(title);
    }
    titleRow.remove();
  }

  // Process subtitle
  if (subtitleRow) {
    const subtitleCell = subtitleRow.querySelector(':scope > div');

    if (subtitleCell && subtitleCell.textContent.trim()) {
      const subtitle = document.createElement('div');
      subtitle.className = 'cta-subtitle';
      moveInstrumentation(subtitleCell, subtitle);

      while (subtitleCell.firstChild) {
        subtitle.append(subtitleCell.firstChild);
      }

      ctaContent.append(subtitle);
    }
    subtitleRow.remove();
  }

  // Process buttons
  if (buttonsRow) {
    const buttonsCell = buttonsRow.querySelector(':scope > div');

    if (buttonsCell && buttonsCell.textContent.trim()) {
      const buttons = document.createElement('div');
      buttons.className = 'cta-buttons';
      moveInstrumentation(buttonsCell, buttons);

      // Move all button content
      while (buttonsCell.firstChild) {
        buttons.append(buttonsCell.firstChild);
      }

      ctaContent.append(buttons);
    }
    buttonsRow.remove();
  }

  // Create CTA image wrapper (right side)
  const ctaImage = document.createElement('div');
  ctaImage.className = 'cta-image';

  // Process hero image
  if (imageRow) {
    const imageCell = imageRow.querySelector(':scope > div');
    const picture = imageCell?.querySelector('picture');

    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          false,
          [{ media: '(min-width: 900px)', width: '800' }, { width: '600' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        ctaImage.append(optimizedPic);
      }
    }
    imageRow.remove();
  }

  // Append both sections to block
  block.append(ctaContent);
  block.append(ctaImage);
}
