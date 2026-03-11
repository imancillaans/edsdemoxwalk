import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the banner block
 * @param {Element} block The banner block element
 */
export default function decorate(block) {
  const [imageRow, contentRow] = [...block.children];

  // Process banner image
  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const bannerImage = document.createElement('div');
      bannerImage.className = 'banner-image';
      moveInstrumentation(imageRow, bannerImage);
      bannerImage.append(picture);

      // Optimize image
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          true,
          [{ media: '(min-width: 900px)', width: '2000' }, { width: '1200' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }

      block.prepend(bannerImage);
      imageRow.remove();
    }
  }

  // Process banner content
  if (contentRow) {
    const bannerContent = document.createElement('div');
    bannerContent.className = 'banner-content';
    moveInstrumentation(contentRow, bannerContent);

    // Move all content from row to banner-content
    while (contentRow.firstElementChild) {
      bannerContent.append(contentRow.firstElementChild);
    }

    block.append(bannerContent);
    contentRow.remove();
  }
}
