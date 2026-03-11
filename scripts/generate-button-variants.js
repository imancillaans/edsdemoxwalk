#!/usr/bin/env node

/**
 * Auto-generates button variants from theme.css design tokens
 *
 * Usage: node scripts/generate-button-variants.js
 *
 * This script:
 * 1. Reads theme.css and extracts CSS custom properties
 * 2. Generates button variants based on color tokens
 * 3. Creates button-variants.js files
 * 4. Updates component models with variant options
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* eslint-enable no-underscore-dangle */

const THEME_CSS_PATH = path.join(__dirname, '../styles/theme.css');
const BANNER_VARIANTS_PATH = path.join(__dirname, '../blocks/banner/button-variants.js');
const CTA_VARIANTS_PATH = path.join(__dirname, '../blocks/cta/button-variants.js');

/**
 * Parse CSS custom properties from theme.css
 */
function parseCSSTokens(cssContent) {
  const tokens = {};
  const customPropRegex = /--([a-zA-Z0-9_-]+):\s*([^;]+);/g;

  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = customPropRegex.exec(cssContent)) !== null) {
    const [, name, value] = match;
    tokens[`--${name}`] = value.trim();
  }

  return tokens;
}

/**
 * Group tokens by category
 */
function groupTokens(tokens) {
  const groups = {
    primary: {},
    secondary: {},
    grey: {},
    header: {},
  };

  Object.entries(tokens).forEach(([name, value]) => {
    if (name.startsWith('--prm-primary_')) {
      groups.primary[name] = value;
    } else if (name.startsWith('--snd-secondary_')) {
      groups.secondary[name] = value;
    } else if (name.startsWith('--grey-')) {
      groups.grey[name] = value;
    } else if (name.startsWith('--header-')) {
      groups.header[name] = value;
    }
  });

  return groups;
}

/**
 * Generate button variant configurations
 */
function generateButtonVariants(tokenGroups) {
  const variants = {};

  // Primary variants (Orange)
  if (tokenGroups.primary['--prm-primary_600']) {
    variants['primary-orange'] = {
      componentVariantTitle: 'Primary Orange',
      componentVariantDefault: 'true',
      backgroundColor: '--prm-primary_600',
      backgroundColorHover: '--prm-primary_700',
      textColor: '--grey-white',
      textColorHover: '--grey-white',
      borderColor: '--prm-primary_600',
      borderColorHover: '--prm-primary_700',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };

    variants['secondary-orange'] = {
      componentVariantTitle: 'Secondary Orange (Outline)',
      backgroundColor: 'transparent',
      backgroundColorHover: 'rgba(242, 109, 0, 0.1)',
      textColor: '--prm-primary_600',
      textColorHover: '--prm-primary_700',
      borderColor: '--prm-primary_600',
      borderColorHover: '--prm-primary_700',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };
  }

  // Secondary variants (Purple)
  if (tokenGroups.secondary['--snd-secondary_600']) {
    variants['primary-purple'] = {
      componentVariantTitle: 'Primary Purple',
      backgroundColor: '--snd-secondary_600',
      backgroundColorHover: '--snd-secondary_700',
      textColor: '--grey-white',
      textColorHover: '--grey-white',
      borderColor: '--snd-secondary_600',
      borderColorHover: '--snd-secondary_700',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };

    variants['secondary-purple'] = {
      componentVariantTitle: 'Secondary Purple (Outline)',
      backgroundColor: 'transparent',
      backgroundColorHover: 'rgba(102, 28, 105, 0.1)',
      textColor: '--snd-secondary_600',
      textColorHover: '--snd-secondary_700',
      borderColor: '--snd-secondary_600',
      borderColorHover: '--snd-secondary_700',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };
  }

  // Grey variants
  if (tokenGroups.grey['--grey-grey_700']) {
    variants.dark = {
      componentVariantTitle: 'Dark',
      backgroundColor: '--grey-grey_700',
      backgroundColorHover: '--grey-grey_800',
      textColor: '--grey-white',
      textColorHover: '--grey-white',
      borderColor: '--grey-grey_700',
      borderColorHover: '--grey-grey_800',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };

    variants['dark-outline'] = {
      componentVariantTitle: 'Dark Outline',
      backgroundColor: 'transparent',
      backgroundColorHover: 'rgba(0, 0, 0, 0.05)',
      textColor: '--grey-grey_700',
      textColorHover: '--grey-grey_800',
      borderColor: '--grey-grey_700',
      borderColorHover: '--grey-grey_800',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };
  }

  if (tokenGroups.grey['--grey-black']) {
    variants.black = {
      componentVariantTitle: 'Black',
      backgroundColor: '--grey-black',
      backgroundColorHover: '--grey-grey_800',
      textColor: '--grey-white',
      textColorHover: '--grey-white',
      borderColor: '--grey-black',
      borderColorHover: '--grey-grey_800',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };
  }

  if (tokenGroups.grey['--grey-white']) {
    variants.white = {
      componentVariantTitle: 'White Solid',
      backgroundColor: '--grey-white',
      backgroundColorHover: '--grey-grey_100',
      textColor: '--grey-grey_700',
      textColorHover: '--grey-grey_800',
      borderColor: '--grey-white',
      borderColorHover: '--grey-grey_100',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };

    variants['white-outline'] = {
      componentVariantTitle: 'White Outline',
      backgroundColor: 'transparent',
      backgroundColorHover: 'rgba(255, 255, 255, 0.1)',
      textColor: '--grey-white',
      textColorHover: '--grey-white',
      borderColor: '--grey-white',
      borderColorHover: '--grey-white',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };
  }

  // Header style (if exists)
  if (tokenGroups.header['--header-background']) {
    variants.header = {
      componentVariantTitle: 'Header Style',
      backgroundColor: '--header-background',
      backgroundColorHover: '--snd-secondary_700',
      textColor: '--header-foreground',
      textColorHover: '--header-foreground',
      borderColor: '--header-background',
      borderColorHover: '--snd-secondary_700',
      borderRadius: '50',
      paddingLeftRight: '32',
      paddingBottomTop: '14',
      borderWidth: '2',
      typography: 'text-button-md',
      fontWeight: '600',
    };
  }

  // Text-only variants
  variants['text-orange'] = {
    componentVariantTitle: 'Text Orange',
    backgroundColor: 'transparent',
    backgroundColorHover: 'transparent',
    textColor: '--prm-primary_600',
    textColorHover: '--prm-primary_700',
    borderColor: 'transparent',
    borderColorHover: 'transparent',
    borderRadius: '50',
    paddingLeftRight: '32',
    paddingBottomTop: '14',
    borderWidth: '0',
    typography: 'text-button-md',
    fontWeight: '600',
    textDecoration: 'underline',
  };

  variants['text-white'] = {
    componentVariantTitle: 'Text White',
    backgroundColor: 'transparent',
    backgroundColorHover: 'transparent',
    textColor: '--grey-white',
    textColorHover: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'transparent',
    borderColorHover: 'transparent',
    borderRadius: '50',
    paddingLeftRight: '32',
    paddingBottomTop: '14',
    borderWidth: '0',
    typography: 'text-button-md',
    fontWeight: '600',
    textDecoration: 'underline',
  };

  // Size variants
  variants.large = {
    componentVariantTitle: 'Large Primary',
    backgroundColor: '--prm-primary_600',
    backgroundColorHover: '--prm-primary_700',
    textColor: '--grey-white',
    textColorHover: '--grey-white',
    borderColor: '--prm-primary_600',
    borderColorHover: '--prm-primary_700',
    borderRadius: '50',
    paddingLeftRight: '48',
    paddingBottomTop: '20',
    borderWidth: '2',
    typography: 'text-button-lg',
    fontWeight: '700',
  };

  variants.small = {
    componentVariantTitle: 'Small',
    backgroundColor: '--prm-primary_600',
    backgroundColorHover: '--prm-primary_700',
    textColor: '--grey-white',
    textColorHover: '--grey-white',
    borderColor: '--prm-primary_600',
    borderColorHover: '--prm-primary_700',
    borderRadius: '50',
    paddingLeftRight: '24',
    paddingBottomTop: '10',
    borderWidth: '2',
    typography: 'text-button-sm',
    fontWeight: '600',
  };

  return variants;
}

/**
 * Generate JavaScript file content
 */
function generateVariantsJS(variants) {
  const variantsJSON = JSON.stringify(variants, null, 2)
    .replace(/"([^"]+)":/g, '"$1":'); // Keep property names quoted

  return `/* eslint-disable */
/**
 * Button variants configuration
 * AUTO-GENERATED by scripts/generate-button-variants.js
 * DO NOT EDIT MANUALLY - changes will be overwritten
 *
 * To update: npm run build:variants
 */
export default function getButtonVariants() {
  return ${variantsJSON};
}
`;
}

/**
 * Generate model options for Universal Editor
 */
function generateModelOptions(variants) {
  return Object.keys(variants).map((key) => ({
    name: variants[key].componentVariantTitle,
    value: `[variant-${key}]`,
  }));
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Generating button variants from theme.css...\n');

  // Read theme.css
  const themeCSS = fs.readFileSync(THEME_CSS_PATH, 'utf-8');
  console.log('✅ Read theme.css');

  // Parse tokens
  const tokens = parseCSSTokens(themeCSS);
  console.log(`✅ Parsed ${Object.keys(tokens).length} CSS tokens`);

  // Group tokens
  const tokenGroups = groupTokens(tokens);
  console.log('✅ Grouped tokens by category');
  console.log(`   - Primary: ${Object.keys(tokenGroups.primary).length}`);
  console.log(`   - Secondary: ${Object.keys(tokenGroups.secondary).length}`);
  console.log(`   - Grey: ${Object.keys(tokenGroups.grey).length}`);
  console.log(`   - Header: ${Object.keys(tokenGroups.header).length}`);

  // Generate variants
  const variants = generateButtonVariants(tokenGroups);
  console.log(`\n✅ Generated ${Object.keys(variants).length} button variants`);

  // Generate JavaScript files
  const jsContent = generateVariantsJS(variants);
  fs.writeFileSync(BANNER_VARIANTS_PATH, jsContent);
  fs.writeFileSync(CTA_VARIANTS_PATH, jsContent);
  console.log('✅ Written button-variants.js files');

  // Generate model options
  const options = generateModelOptions(variants);
  console.log(`\n✅ Generated ${options.length} model options`);
  console.log('\n📋 Available variants:');
  options.forEach((opt) => {
    console.log(`   - ${opt.name}`);
  });

  console.log('\n✅ Done! Button variants generated successfully.');
  console.log('\n⚠️  Remember to update models/_banner.json and models/_cta.json');
  console.log('   with the new options if needed.');

  // Output JSON for easy copy-paste into models
  console.log('\n📝 Copy this to your model files:');
  console.log(JSON.stringify(options, null, 2));
}

main();
