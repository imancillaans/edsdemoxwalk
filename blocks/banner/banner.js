import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the banner block
 * @param {Element} block The banner block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [
    titleRow, subtitleRow, cta1LinkRow, cta1TextRow, cta2LinkRow, cta2TextRow, imageRow,
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

  // Process CTA 1 (Primary Button)
  let cta1Link = '';
  let cta1Text = '';

  if (cta1LinkRow) {
    const cta1LinkCell = cta1LinkRow.querySelector(':scope > div');
    const link = cta1LinkCell?.querySelector('a');
    if (link) {
      cta1Link = link.getAttribute('href') || '';
    }
    cta1LinkRow.remove();
  }

  if (cta1TextRow) {
    const cta1LinkTextCell = cta1TextRow.querySelector(':scope > div');
    cta1Text = cta1LinkTextCell?.textContent.trim() || '';
    cta1TextRow.remove();
  }

  if (cta1Link && cta1Text) {
    const btn1 = document.createElement('a');
    btn1.href = cta1Link;
    btn1.className = 'button primary';
    btn1.textContent = cta1Text;
    buttonsWrapper.append(btn1);
  }

  // Process CTA 2 (Secondary Button)
  let cta2Link = '';
  let cta2Text = '';

  if (cta2LinkRow) {
    const cta2LinkCell = cta2LinkRow.querySelector(':scope > div');
    const link = cta2LinkCell?.querySelector('a');
    if (link) {
      cta2Link = link.getAttribute('href') || '';
    }
    cta2LinkRow.remove();
  }

  if (cta2TextRow) {
    const cta2LinkTextCell = cta2TextRow.querySelector(':scope > div');
    cta2Text = cta2LinkTextCell?.textContent.trim() || '';
    cta2TextRow.remove();
  }

  if (cta2Link && cta2Text) {
    const btn2 = document.createElement('a');
    btn2.href = cta2Link;
    btn2.className = 'button secondary';
    btn2.textContent = cta2Text;
    buttonsWrapper.append(btn2);
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

  // Append both sections to block
  block.append(bannerContent);
  block.append(bannerImage);
}
