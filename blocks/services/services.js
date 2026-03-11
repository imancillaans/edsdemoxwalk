import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Decorates the services block
 * @param {Element} block The services block element
 */
export default function decorate(block) {
  // Create services list
  const ul = document.createElement('ul');
  ul.className = 'services-list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'service-item';
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const [iconCell, titleCell, textCell] = cells;

    // Process icon (first cell)
    if (iconCell) {
      const picture = iconCell.querySelector('picture');
      const icon = iconCell.querySelector('.icon');

      if (picture || icon) {
        const serviceIcon = document.createElement('div');
        serviceIcon.className = 'service-icon';

        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(
              img.src,
              img.alt,
              false,
              [{ width: '200' }],
            );
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            serviceIcon.append(optimizedPic);
          }
        } else if (icon) {
          moveInstrumentation(icon, serviceIcon);
          serviceIcon.append(icon);
        }

        li.append(serviceIcon);
      }
    }

    // Process content (title + text combined)
    const serviceContent = document.createElement('div');
    serviceContent.className = 'service-content';

    // Add title
    if (titleCell && titleCell.textContent.trim()) {
      moveInstrumentation(titleCell, serviceContent);
      while (titleCell.firstChild) {
        serviceContent.append(titleCell.firstChild);
      }
    }

    // Add description
    if (textCell && textCell.textContent.trim()) {
      while (textCell.firstChild) {
        serviceContent.append(textCell.firstChild);
      }
    }

    if (serviceContent.childNodes.length > 0) {
      li.append(serviceContent);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
