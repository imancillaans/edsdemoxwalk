import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import getButtonVariants from './button-variants.js';
import { applyButtonVariant } from '../../scripts/theme-utils.js';

/**
 * Decorates the meet-the-team block
 * @param {Element} block The meet-the-team block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Destructure rows based on model field order
  const [
    sectionTitleRow,
    teamTitleRow,
    member1ImageRow,
    member1NameRow,
    member1RoleRow,
    member2ImageRow,
    member2NameRow,
    member2RoleRow,
    member3ImageRow,
    member3NameRow,
    member3RoleRow,
    member4ImageRow,
    member4NameRow,
    member4RoleRow,
    member5ImageRow,
    member5NameRow,
    member5RoleRow,
    member6ImageRow,
    member6NameRow,
    member6RoleRow,
    aboutTitleRow,
    aboutDescriptionRow,
    ctaLinkRow,
    ctaTextRow,
    ctaVariantRow,
  ] = rows;

  // Create main container
  const container = document.createElement('div');
  container.className = 'meet-the-team-container';

  // Process section title
  if (sectionTitleRow) {
    const titleCell = sectionTitleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'meet-the-team-section-title';
      moveInstrumentation(titleCell, sectionTitle);
      sectionTitle.textContent = titleText;
      container.append(sectionTitle);
    }
    sectionTitleRow.remove();
  }

  // Create team section
  const teamSection = document.createElement('div');
  teamSection.className = 'meet-the-team-section';

  // Process team title
  if (teamTitleRow) {
    const titleCell = teamTitleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const teamTitle = document.createElement('h2');
      teamTitle.className = 'meet-the-team-title';
      moveInstrumentation(titleCell, teamTitle);
      teamTitle.textContent = titleText;
      teamSection.append(teamTitle);
    }
    teamTitleRow.remove();
  }

  // Create team members grid
  const membersGrid = document.createElement('div');
  membersGrid.className = 'team-members-grid';

  // Process team members (6 members)
  const members = [
    { imageRow: member1ImageRow, nameRow: member1NameRow, roleRow: member1RoleRow },
    { imageRow: member2ImageRow, nameRow: member2NameRow, roleRow: member2RoleRow },
    { imageRow: member3ImageRow, nameRow: member3NameRow, roleRow: member3RoleRow },
    { imageRow: member4ImageRow, nameRow: member4NameRow, roleRow: member4RoleRow },
    { imageRow: member5ImageRow, nameRow: member5NameRow, roleRow: member5RoleRow },
    { imageRow: member6ImageRow, nameRow: member6NameRow, roleRow: member6RoleRow },
  ];

  members.forEach((member) => {
    const { imageRow, nameRow, roleRow } = member;

    // Check if member has at least an image
    if (imageRow) {
      const imageCell = imageRow.querySelector(':scope > div');
      const picture = imageCell?.querySelector('picture');

      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          // Create member card
          const memberCard = document.createElement('div');
          memberCard.className = 'team-member';

          // Create image wrapper
          const memberImageWrapper = document.createElement('div');
          memberImageWrapper.className = 'team-member-image';

          const optimizedPic = createOptimizedPicture(
            img.src,
            img.alt || 'Team member',
            false,
            [{ width: '200' }],
          );
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          memberImageWrapper.append(optimizedPic);
          memberCard.append(memberImageWrapper);

          // Process name
          if (nameRow) {
            const nameCell = nameRow.querySelector(':scope > div');
            const nameText = nameCell?.textContent.trim();

            if (nameText) {
              const memberName = document.createElement('div');
              memberName.className = 'team-member-name';
              moveInstrumentation(nameCell, memberName);
              memberName.textContent = nameText;
              memberCard.append(memberName);
            }
            nameRow.remove();
          }

          // Process role
          if (roleRow) {
            const roleCell = roleRow.querySelector(':scope > div');
            const roleText = roleCell?.textContent.trim();

            if (roleText) {
              const memberRole = document.createElement('div');
              memberRole.className = 'team-member-role';
              moveInstrumentation(roleCell, memberRole);
              memberRole.textContent = roleText;
              memberCard.append(memberRole);
            }
            roleRow.remove();
          }

          membersGrid.append(memberCard);
        }
      }
      imageRow.remove();
    }
  });

  if (membersGrid.children.length > 0) {
    teamSection.append(membersGrid);
  }

  if (teamSection.children.length > 0) {
    container.append(teamSection);
  }

  // Create about section
  const aboutSection = document.createElement('div');
  aboutSection.className = 'meet-the-team-about';

  // Process about title
  if (aboutTitleRow) {
    const titleCell = aboutTitleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const aboutTitle = document.createElement('h3');
      aboutTitle.className = 'about-title';
      moveInstrumentation(titleCell, aboutTitle);
      aboutTitle.textContent = titleText;
      aboutSection.append(aboutTitle);
    }
    aboutTitleRow.remove();
  }

  // Process about description
  if (aboutDescriptionRow) {
    const descCell = aboutDescriptionRow.querySelector(':scope > div');

    if (descCell && descCell.textContent.trim()) {
      const aboutDescription = document.createElement('div');
      aboutDescription.className = 'about-description';
      moveInstrumentation(descCell, aboutDescription);

      while (descCell.firstChild) {
        aboutDescription.append(descCell.firstChild);
      }

      aboutSection.append(aboutDescription);
    }
    aboutDescriptionRow.remove();
  }

  // Process CTA button
  const variants = getButtonVariants();

  if (ctaLinkRow) {
    const linkCell = ctaLinkRow.querySelector(':scope > div');
    const link = linkCell?.querySelector('a');

    if (link) {
      const btn = document.createElement('a');
      btn.href = link.getAttribute('href') || '';
      btn.className = 'button';
      btn.textContent = link.textContent.trim();
      moveInstrumentation(link, btn);

      // Parse variant
      let variantName = 'purple';
      if (ctaVariantRow) {
        const variantCell = ctaVariantRow.querySelector(':scope > div');
        const variantText = variantCell?.textContent.trim();
        const match = variantText?.match(/\[variant-([^\]]+)\]/);
        if (match) {
          [, variantName] = match;
        }
        ctaVariantRow.remove();
      }

      // Apply variant wrapper
      const buttonElement = variants[variantName]
        ? applyButtonVariant(btn, variants[variantName])
        : btn;

      aboutSection.append(buttonElement);
    }
    ctaLinkRow.remove();
    if (ctaTextRow) ctaTextRow.remove();
  }

  if (aboutSection.children.length > 0) {
    container.append(aboutSection);
  }

  // Append container to block
  block.append(container);
}
