/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// THEME TYPE CONFIGURATIONS
// ============================================================================

/**
 * Configuration for each theme type supported by AEM UI Solution
 *
 * @typedef {Object} ThemeTypeConfig
 * @property {string} selector - CSS selector for the themed element
 * @property {RegExp} variantPattern - Regex to extract variant names from CSS
 * @property {boolean} usesWrapper - Whether to wrap element in variant div
 * @property {string} baseClassName - Base class name for elements
 * @property {string} description - Human-readable description
 * @property {string} applierFunction - Name of function to apply this theme
 */
const THEME_TYPES = {
  button: {
    selector: '.acc-button--link',
    variantPattern: /^\.(\w+(?:-\w+)*)\s+\.acc-button--link\s*\{/gm,
    usesWrapper: true,
    baseClassName: 'button',
    description: 'Button variants from theme.css',
    applierFunction: 'applyButtonVariant',
    modelFieldSuffix: 'Variant',
  },
  separator: {
    selector: '.acc-separator__spacer',
    variantPattern: /^\.(\w+(?:-\w+)*)\s+\.acc-separator__spacer\s*\{/gm,
    usesWrapper: true,
    baseClassName: 'separator',
    description: 'Separator variants from theme.css',
    applierFunction: 'applySeparatorVariant',
    modelFieldSuffix: 'SeparatorVariant',
  },
  typography: {
    selector: '.text-',
    variantPattern: /^\.(text-[\w-]+)(?:\s*,|\s*\{)/gm,
    usesWrapper: false,
    baseClassName: null,
    description: 'Typography styles from theme.css',
    applierFunction: 'applyTypographyStyle',
    modelFieldSuffix: 'TypographyStyle',
  },
};

// ============================================================================
// THEME.CSS PARSER
// ============================================================================

/**
 * Parse theme.css and extract variants for a specific theme type
 * @param {string} cssContent - Content of theme.css
 * @param {ThemeTypeConfig} themeConfig - Configuration for theme type
 * @returns {string[]} Array of variant names
 */
function extractVariants(cssContent, themeConfig) {
  const variants = new Set();
  const matches = Array.from(cssContent.matchAll(themeConfig.variantPattern));

  matches.forEach((match) => {
    const variantName = match[1];
    // Skip responsive variants (--mobile, --tablet suffixes)
    if (!variantName.includes('--')) {
      variants.add(variantName);
    }
  });

  return Array.from(variants).sort();
}

/**
 * Parse theme.css and extract all theme types
 * @param {string} themeCssPath - Path to theme.css
 * @returns {Object} Object with theme types as keys and variant arrays as values
 */
function parseThemeCss(themeCssPath) {
  console.log('📖 Reading theme.css...');
  const cssContent = fs.readFileSync(themeCssPath, 'utf-8');

  const themeData = {};

  Object.entries(THEME_TYPES).forEach(([themeType, config]) => {
    const variants = extractVariants(cssContent, config);
    themeData[themeType] = {
      variants,
      config,
    };
    console.log(`✅ Found ${variants.length} ${themeType} variants`);
    console.log(`   Variants: ${variants.join(', ')}`);
  });

  return themeData;
}

// ============================================================================
// VARIANT FILE GENERATOR
// ============================================================================

/**
 * Generate variant JavaScript object for a theme type
 * @param {string[]} variants - Array of variant names
 * @param {ThemeTypeConfig} config - Theme configuration
 * @returns {string} JavaScript code
 */
function generateVariantObject(variants, config) {
  const variantEntries = variants.map((variant) => {
    const label = variant
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `  '${variant}': {
    name: '${variant}',
    label: '${label}',
    className: '${variant}',
    usesWrapper: ${config.usesWrapper},
    baseClassName: ${config.baseClassName ? `'${config.baseClassName}'` : 'null'},
  }`;
  });

  return `{
${variantEntries.join(',\n')}
}`;
}

/**
 * Generate complete variant file content
 * @param {string} themeType - Type of theme (button, separator, typography)
 * @param {string[]} variants - Array of variant names
 * @param {ThemeTypeConfig} config - Theme configuration
 * @returns {string} Complete file content
 */
function generateVariantFileContent(themeType, variants, config) {
  const functionName = `get${themeType.charAt(0).toUpperCase() + themeType.slice(1)}Variants`;
  const variantObject = generateVariantObject(variants, config);

  return `/* eslint-disable */
/**
 * ${config.description}
 * AUTO-GENERATED by scripts/generate-theme-variants.js
 * DO NOT EDIT MANUALLY - changes will be overwritten
 *
 * To update: npm run build:variants
 *
 * Theme type: ${themeType}
 * Total variants: ${variants.length}
 * Uses wrapper: ${config.usesWrapper}
 * Applier function: ${config.applierFunction}
 */

/**
 * Get available ${themeType} variants from theme.css
 * @returns {Object} Object mapping variant names to their configuration
 */
export default function ${functionName}() {
  return ${variantObject};
}
`;
}

// ============================================================================
// MODEL OPTIONS GENERATOR
// ============================================================================

/**
 * Generate model options for a theme type
 * @param {string[]} variants - Array of variant names
 * @returns {Array} Array of option objects for model JSON
 */
function generateModelOptions(variants) {
  return variants.map((variant) => {
    const label = variant
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      name: `[variant-${variant}]`,
      value: `[variant-${variant}]`,
      label,
    };
  });
}

/**
 * Update model file with generated options for a specific field
 * @param {string} modelPath - Path to model JSON file
 * @param {Array} options - Array of option objects
 * @param {string} fieldSuffix - Suffix to identify field (e.g., 'Variant', 'SeparatorVariant')
 */
function updateModelFile(modelPath, options, fieldSuffix) {
  if (!fs.existsSync(modelPath)) {
    console.log(`⚠️  Model file not found: ${modelPath}`);
    return;
  }

  const modelContent = fs.readFileSync(modelPath, 'utf-8');
  const model = JSON.parse(modelContent);

  let updated = false;

  // Find all fields ending with the specified suffix
  model.fields.forEach((field) => {
    if (field.name && field.name.endsWith(fieldSuffix)) {
      field.options = options;
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(modelPath, JSON.stringify(model, null, 2));
    console.log(`✅ Updated ${path.basename(modelPath)}`);
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main function to generate all theme variants
 */
async function main() {
  console.log('🎨 Generating theme variants from theme.css...\n');

  const THEME_CSS_PATH = path.join(__dirname, '../styles/theme.css');

  // Parse theme.css
  const themeData = parseThemeCss(THEME_CSS_PATH);
  console.log('');

  // Generate variant files for each theme type
  const componentsToUpdate = [
    'banner',
    'cta',
    'meet-the-team',
    'services',
    'contact-form',
  ];

  Object.entries(themeData).forEach(([themeType, { variants, config }]) => {
    console.log(`\n📝 Generating ${themeType} variant files...`);

    const fileContent = generateVariantFileContent(themeType, variants, config);
    const fileName = `${themeType}-variants.js`;

    // Write variant file for each component
    componentsToUpdate.forEach((component) => {
      const variantFilePath = path.join(__dirname, `../blocks/${component}/${fileName}`);
      fs.writeFileSync(variantFilePath, fileContent);
      console.log(`   ✅ blocks/${component}/${fileName}`);
    });

    // Generate model options
    const options = generateModelOptions(variants);

    // Update model files
    console.log(`\n📋 Updating model files with ${themeType} options...`);
    componentsToUpdate.forEach((component) => {
      const modelPath = path.join(__dirname, `../models/_${component}.json`);
      updateModelFile(modelPath, options, config.modelFieldSuffix);
    });
  });

  // Run build:json to compile all models
  console.log('\n🔨 Running npm run build:json...');
  execSync('npm run build:json', { stdio: 'inherit' });

  console.log('\n✅ Built component-models.json');

  // Summary
  console.log('\n✅ Done! Theme variants generated successfully.\n');
  console.log('📦 Files updated:');
  Object.keys(themeData).forEach((themeType) => {
    componentsToUpdate.forEach((component) => {
      console.log(`   - blocks/${component}/${themeType}-variants.js`);
    });
  });

  console.log('\n📋 Models updated:');
  componentsToUpdate.forEach((component) => {
    console.log(`   - models/_${component}.json`);
  });

  console.log('   - component-models.json');
}

// Run main function
main().catch((error) => {
  console.error('❌ Error generating theme variants:', error);
  process.exit(1);
});
