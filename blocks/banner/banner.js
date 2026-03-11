import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the banner block
 * @param {Element} block The banner block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [imageRow, titleRow, subtitleRow, buttonsRow] = rows;

  // Process background image
  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const bannerImage = document.createElement('div');
      bannerImage.className = 'banner-image';

      // Optimize image for background
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          true,
          [{ media: '(min-width: 900px)', width: '2000' }, { width: '1200' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        bannerImage.append(optimizedPic);
      }

      block.prepend(bannerImage);
      imageRow.remove();
    }
  }

  // Create banner content wrapper
  const bannerContent = document.createElement('div');
  bannerContent.className = 'banner-content';

  // Process title
  if (titleRow && titleRow.textContent.trim()) {
    const title = document.createElement('h1');
    title.className = 'banner-title';
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.textContent.trim();
    bannerContent.append(title);
    titleRow.remove();
  }

  // Process subtitle
  if (subtitleRow && subtitleRow.textContent.trim()) {
    const subtitle = document.createElement('div');
    subtitle.className = 'banner-subtitle';
    moveInstrumentation(subtitleRow, subtitle);
    while (subtitleRow.firstChild) {
      subtitle.append(subtitleRow.firstChild);
    }
    bannerContent.append(subtitle);
    subtitleRow.remove();
  }

  // Process buttons
  if (buttonsRow) {
    const buttons = document.createElement('div');
    buttons.className = 'banner-buttons';
    moveInstrumentation(buttonsRow, buttons);

    // Move all button content
    while (buttonsRow.firstChild) {
      buttons.append(buttonsRow.firstChild);
    }

    bannerContent.append(buttons);
    buttonsRow.remove();
  }

  block.append(bannerContent);
}
