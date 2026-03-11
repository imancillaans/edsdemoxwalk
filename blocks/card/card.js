import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the card block
 * @param {Element} block The card block element
 */
export default function decorate(block) {
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'card-wrapper';
  moveInstrumentation(block, cardWrapper);

  // Process each row
  [...block.children].forEach((row) => {
    const rowDiv = row.querySelector(':scope > div');
    if (!rowDiv) return;

    // Check if row contains an image
    const picture = rowDiv.querySelector('picture');
    if (picture) {
      const cardImage = document.createElement('div');
      cardImage.className = 'card-image';

      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          false,
          [{ width: '600' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }

      cardWrapper.append(cardImage);
    } else {
      // Text content (title, description, buttons)
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      moveInstrumentation(rowDiv, cardBody);

      // Move content
      while (rowDiv.firstChild) {
        cardBody.append(rowDiv.firstChild);
      }

      cardWrapper.append(cardBody);
    }
  });

  // Replace block content
  block.textContent = '';
  block.append(cardWrapper);

  // If the card contains a link, make the whole card clickable
  const link = block.querySelector('.card-body a.button');
  if (link) {
    cardWrapper.style.cursor = 'pointer';
    cardWrapper.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') {
        link.click();
      }
    });
  }
}
