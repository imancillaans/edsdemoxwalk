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

    // Process each cell in the row
    [...row.children].forEach((cell) => {
      // Check for icon/image
      const picture = cell.querySelector('picture');
      const icon = cell.querySelector('.icon');

      if (picture) {
        const serviceIcon = document.createElement('div');
        serviceIcon.className = 'service-icon';

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

        li.append(serviceIcon);
      } else if (icon) {
        const serviceIcon = document.createElement('div');
        serviceIcon.className = 'service-icon';
        moveInstrumentation(icon, serviceIcon);
        serviceIcon.append(icon);
        li.append(serviceIcon);
      } else {
        // Service content (title, description, link)
        const serviceContent = document.createElement('div');
        serviceContent.className = 'service-content';
        moveInstrumentation(cell, serviceContent);

        while (cell.firstChild) {
          serviceContent.append(cell.firstChild);
        }

        li.append(serviceContent);
      }
    });

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
