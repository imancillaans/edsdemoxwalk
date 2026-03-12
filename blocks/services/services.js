import { moveInstrumentation } from '../../scripts/scripts.js';
import getButtonVariants from './button-variants.js';
import { applyButtonVariant } from '../../scripts/theme-utils.js';

/**
 * Icon SVG templates
 * Returns SVG markup for each icon type
 */
function getIconSVG(iconName) {
  const icons = {
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c-1.5 3-3 4.5-4.5 6C6 9.5 4.5 11 3 13.5c0 0 3 1.5 4.5 0S9 12 10.5 10.5C12 9 13.5 7.5 15 6c0 0-1.5 3-3 4.5s-3 3-4.5 4.5c0 0 1.5 3 4.5 3s4.5-1.5 6-3 3-3 4.5-4.5c1.5-1.5 3-4.5 3-6 0-1.5-1.5-3-3-3s-4.5 1.5-6 3z"/><circle cx="10" cy="14" r="1"/></svg>',
    lightbulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1 4 2 5.5V17h10v-2.5c1-1.5 2-3 2-5.5a7 7 0 0 0-7-7z"/><path d="M8.5 20h7M10 17v3M14 17v3"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M1 12h6m6 0h6m-4.5-7.5l4.5 4.5m-6 6l4.5 4.5m-13-4.5l4.5-4.5m6-6l4.5-4.5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-12"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L4 5v6c0 5.5 3.5 10.5 8 12 4.5-1.5 8-6.5 8-12V5l-8-3z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7l3-7z"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  };

  return icons[iconName] || icons.star; // default to star
}

/**
 * Decorates the services block
 * @param {Element} block The services block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Destructure rows based on model field order
  // Note: cta1LinkText and cta2LinkText are NOT separate rows - the text is in the link element
  const [
    sectionTitleRow,
    titleRow,
    subtitleRow,
    service1NameRow,
    service1IconRow,
    service1IconColorRow,
    service1DescriptionRow,
    service2NameRow,
    service2IconRow,
    service2IconColorRow,
    service2DescriptionRow,
    service3NameRow,
    service3IconRow,
    service3IconColorRow,
    service3DescriptionRow,
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
  container.className = 'services-container';

  // Process section title
  if (sectionTitleRow) {
    const titleCell = sectionTitleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'services-section-title';
      moveInstrumentation(titleCell, sectionTitle);
      sectionTitle.textContent = titleText;
      container.append(sectionTitle);
    }
    sectionTitleRow.remove();
  }

  // Process main title
  if (titleRow) {
    const titleCell = titleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const title = document.createElement('h2');
      title.className = 'services-title';
      moveInstrumentation(titleCell, title);
      title.textContent = titleText;
      container.append(title);
    }
    titleRow.remove();
  }

  // Process subtitle
  if (subtitleRow) {
    const subtitleCell = subtitleRow.querySelector(':scope > div');

    if (subtitleCell && subtitleCell.textContent.trim()) {
      const subtitle = document.createElement('div');
      subtitle.className = 'services-subtitle';
      moveInstrumentation(subtitleCell, subtitle);

      while (subtitleCell.firstChild) {
        subtitle.append(subtitleCell.firstChild);
      }

      container.append(subtitle);
    }
    subtitleRow.remove();
  }

  // Create services grid
  const servicesGrid = document.createElement('div');
  servicesGrid.className = 'services-grid';

  // Process 3 services
  const services = [
    {
      nameRow: service1NameRow,
      iconRow: service1IconRow,
      iconColorRow: service1IconColorRow,
      descriptionRow: service1DescriptionRow,
    },
    {
      nameRow: service2NameRow,
      iconRow: service2IconRow,
      iconColorRow: service2IconColorRow,
      descriptionRow: service2DescriptionRow,
    },
    {
      nameRow: service3NameRow,
      iconRow: service3IconRow,
      iconColorRow: service3IconColorRow,
      descriptionRow: service3DescriptionRow,
    },
  ];

  services.forEach((service) => {
    const {
      nameRow, iconRow, iconColorRow, descriptionRow,
    } = service;

    // Check if service has at least a name
    if (nameRow) {
      const nameCell = nameRow.querySelector(':scope > div');
      const nameText = nameCell?.textContent.trim();

      if (nameText) {
        // Create service card
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';

        // Process icon
        if (iconRow) {
          const iconCell = iconRow.querySelector(':scope > div');
          const iconValue = iconCell?.textContent.trim();

          if (iconValue) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'service-icon';
            iconWrapper.innerHTML = getIconSVG(iconValue);

            // Apply icon color if specified
            if (iconColorRow) {
              const iconColorCell = iconColorRow.querySelector(':scope > div');
              const iconColor = iconColorCell?.textContent.trim();
              if (iconColor && iconColor !== '') {
                iconWrapper.classList.add(iconColor);
              }
              iconColorRow.remove();
            }

            serviceCard.append(iconWrapper);
          }
          iconRow.remove();
        }

        // Add service name
        const serviceName = document.createElement('h3');
        serviceName.className = 'service-name';
        moveInstrumentation(nameCell, serviceName);
        serviceName.textContent = nameText;
        serviceCard.append(serviceName);
        nameRow.remove();

        // Process description
        if (descriptionRow) {
          const descCell = descriptionRow.querySelector(':scope > div');

          if (descCell && descCell.textContent.trim()) {
            const description = document.createElement('div');
            description.className = 'service-description';
            moveInstrumentation(descCell, description);

            while (descCell.firstChild) {
              description.append(descCell.firstChild);
            }

            serviceCard.append(description);
          }
          descriptionRow.remove();
        }

        servicesGrid.append(serviceCard);
      }
    }
  });

  if (servicesGrid.children.length > 0) {
    container.append(servicesGrid);
  }

  // Process buttons
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'services-buttons';
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
