import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the CTA block
 * @param {Element} block The CTA block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  const [
    titleRow,
    subtitleRow,
    cta1Row,
    cta2Row,
    imageRow,
    backgroundImageRow,
    backgroundOverlayRow,
  ] = rows;

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
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'cta-buttons';

  // Process CTA 1 (Primary Button) - collapsed field
  if (cta1Row) {
    const cta1Cell = cta1Row.querySelector(':scope > div');
    const link = cta1Cell?.querySelector('a');

    if (link) {
      const btn1 = document.createElement('a');
      btn1.href = link.getAttribute('href') || '';
      btn1.className = 'button primary';
      btn1.textContent = link.textContent.trim();
      moveInstrumentation(link, btn1);
      buttonsWrapper.append(btn1);
    }
    cta1Row.remove();
  }

  // Process CTA 2 (Secondary Button) - collapsed field
  if (cta2Row) {
    const cta2Cell = cta2Row.querySelector(':scope > div');
    const link = cta2Cell?.querySelector('a');

    if (link) {
      const btn2 = document.createElement('a');
      btn2.href = link.getAttribute('href') || '';
      btn2.className = 'button secondary';
      btn2.textContent = link.textContent.trim();
      moveInstrumentation(link, btn2);
      buttonsWrapper.append(btn2);
    }
    cta2Row.remove();
  }

  if (buttonsWrapper.children.length > 0) {
    ctaContent.append(buttonsWrapper);
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

  // Append both sections to block
  block.append(ctaContent);
  block.append(ctaImage);
}
