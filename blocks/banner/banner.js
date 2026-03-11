import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the banner block
 * @param {Element} block The banner block element
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

  // Create banner content wrapper (left side)
  const bannerContent = document.createElement('div');
  bannerContent.className = 'banner-content';

  // Process title
  if (titleRow) {
    const titleCell = titleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const title = document.createElement('h1');
      title.className = 'banner-title';
      moveInstrumentation(titleCell, title);
      title.textContent = titleText;
      bannerContent.append(title);
    }
    titleRow.remove();
  }

  // Process subtitle
  if (subtitleRow) {
    const subtitleCell = subtitleRow.querySelector(':scope > div');

    if (subtitleCell && subtitleCell.textContent.trim()) {
      const subtitle = document.createElement('div');
      subtitle.className = 'banner-subtitle';
      moveInstrumentation(subtitleCell, subtitle);

      while (subtitleCell.firstChild) {
        subtitle.append(subtitleCell.firstChild);
      }

      bannerContent.append(subtitle);
    }
    subtitleRow.remove();
  }

  // Process buttons
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'banner-buttons';

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
    bannerContent.append(buttonsWrapper);
  }

  // Create banner image wrapper (right side)
  const bannerImage = document.createElement('div');
  bannerImage.className = 'banner-image';

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
        bannerImage.append(optimizedPic);
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
  block.append(bannerContent);
  block.append(bannerImage);

  // Debug: Log sizing info
  setTimeout(() => {
    const section = block.closest('.section');
    const wrapper = block.parentElement;
    console.log('=== BANNER SIZING DEBUG ===');
    console.log('Section:', section?.className);
    console.log('  width:', section?.offsetWidth, 'scrollWidth:', section?.scrollWidth);
    console.log('Wrapper:', wrapper?.className);
    console.log('  width:', wrapper?.offsetWidth, 'scrollWidth:', wrapper?.scrollWidth);
    console.log('Banner:', block.className);
    console.log('  width:', block.offsetWidth, 'scrollWidth:', block.scrollWidth);
    console.log('  computed width:', getComputedStyle(block).width);
    console.log('  computed box-sizing:', getComputedStyle(block).boxSizing);
    console.log('  computed padding:', getComputedStyle(block).padding);
  }, 100);
}
