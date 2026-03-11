# Quick Reference - Button Variant Components

> Ultra-condensed reference for Claude Code. See COMPONENT_CREATION_GUIDE.md for full details.

---

## 30-Second Pattern Summary

```javascript
// 1. Import
import getButtonVariants from './button-variants.js';
import { applyButtonVariant } from '../../scripts/theme-utils.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// 2. Get variants
const variants = getButtonVariants();

// 3. Create button
const btn = document.createElement('a');
btn.className = 'button'; // NOT acc-button--link!
moveInstrumentation(sourceElement, btn);

// 4. Parse variant
const match = text?.match(/\[variant-([^\]]+)\]/);
const variantName = match ? match[1] : 'purple';

// 5. Apply wrapper
const element = variants[variantName]
  ? applyButtonVariant(btn, variants[variantName])
  : btn;

// 6. Append WRAPPER (not button)
container.append(element);
```

---

## Critical Rules

| Rule | Explanation |
|------|-------------|
| ✅ Class is `'button'` | NOT `'button acc-button--link'` - that's added by applyButtonVariant |
| ✅ moveInstrumentation BEFORE applyButtonVariant | Preserves Universal Editor metadata |
| ✅ Append wrapper, not button | applyButtonVariant returns wrapper div |
| ✅ Regex is `/\[variant-([^\]]+)\]/` | Matches `[variant-purple]` format |
| ❌ Never style `.acc-button--link` in component CSS | That's theme.css territory |
| ❌ Never edit `button-variants.js` manually | Auto-generated, will be overwritten |
| ❌ Never edit `theme.css` | External design system, read-only |

---

## File Creation Sequence

```bash
# 1. Create structure
mkdir -p blocks/{name}
touch blocks/{name}/{name}.{js,css}
touch blocks/{name}/button-variants.js

# 2. Create placeholder
echo 'export default function getButtonVariants() { return {}; }' > blocks/{name}/button-variants.js

# 3. Create model
# See COMPONENT_CREATION_GUIDE.md for template

# 4. Update generator
# Add paths to scripts/generate-button-variants.js

# 5. Generate
npm run build:variants

# 6. Implement JS
# See pattern above

# 7. Test
npm run lint
```

---

## Model Field Pattern

```json
{
  "component": "aem-content",
  "name": "cta1Link",
  "label": "Primary Button Link"
},
{
  "component": "select",
  "name": "cta1Variant",
  "label": "Primary Button Style",
  "valueType": "string",
  "options": []
}
```

**Naming:** `cta{N}Link`, `cta{N}Text`, `cta{N}Variant` - generation script depends on this!

---

## CSS Rules

```css
/* ✅ DO THIS */
.component-buttons {
  display: flex;
  gap: 1rem;
}

.component-buttons .button {
  transition: all 0.3s ease;
}

.component-buttons .button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ❌ NEVER DO THIS */
.component-buttons .acc-button--link {
  background-color: red; /* NO! theme.css handles this */
}
```

---

## Debug Checklist

HTML structure should be:
```html
<div class="{variant-name}">
  <a href="..." class="button acc-button--link">Text</a>
</div>
```

If button has no styling:
1. Check: `button.classList` contains `acc-button--link`
2. Check: `button.parentElement.classList` contains variant name
3. Check: theme.css loaded in Network tab
4. Check: `applyButtonVariant()` was called

If dropdown empty:
1. Run `npm run build:variants`
2. Check field name ends with `Variant`
3. Check `generate-button-variants.js` includes component
4. Run `npm run build:json`

---

## generate-button-variants.js Update Pattern

```javascript
// Add after line 29
const NEW_COMPONENT_VARIANTS_PATH = path.join(__dirname, '../blocks/{name}/button-variants.js');
const NEW_COMPONENT_MODEL_PATH = path.join(__dirname, '../models/_{name}.json');

// Add after line 172
fs.writeFileSync(NEW_COMPONENT_VARIANTS_PATH, jsContent);

// Add after line 191
updateModelFile(NEW_COMPONENT_MODEL_PATH, options);

// Add after line 218
console.log('   - blocks/{name}/button-variants.js');
console.log('   - models/_{name}.json');
```

---

## Absolute File Paths

Base: `/Users/ignaciomancilla/Repositories/edsdemoxwalk/`

**Read these:**
- `styles/theme.css` - Source of truth
- `scripts/theme-utils.js` - applyButtonVariant
- `scripts/scripts.js` - moveInstrumentation
- `blocks/banner/banner.js` - Reference implementation

**Modify these:**
- `scripts/generate-button-variants.js` - Add new component paths

**Create these:**
- `blocks/{name}/{name}.js`
- `blocks/{name}/{name}.css`
- `blocks/{name}/button-variants.js` (placeholder)
- `models/_{name}.json`

**Auto-generated:**
- `blocks/{name}/button-variants.js` (after npm run)
- `models/_{name}.json` options field
- `component-models.json`

---

## Default Variants

- **Primary button:** `'purple'`
- **Secondary button:** `'white-outline'`

Available variants (from theme.css):
- purple, black, white-outline, white, outline, white-outline-medium, orange-underline, nuevo, gray

---

## Row Order Must Match Model

If model has:
```json
["title", "description", "cta1Link", "cta1Text", "cta1Variant"]
```

Then JS must have:
```javascript
const [titleRow, descriptionRow, cta1LinkRow, cta1TextRow, cta1VariantRow] = rows;
```

**Order matters!** Universal Editor renders fields in order.

---

## Component Template Locations

Full templates in `COMPONENT_CREATION_GUIDE.md`:
- Single button component (Section 6)
- Two button component (Section 6)
- Model JSON templates (Section 3)
- CSS template (Section 7)

---

## Testing Commands

```bash
npm run lint                     # Check code quality
npm run build:variants          # Regenerate variants
npm run build:json              # Rebuild component-models.json
cat blocks/{name}/button-variants.js  # Verify generation
grep "acc-button--link" styles/theme.css  # Check available variants
```

---

## Common Mistakes

1. ❌ `btn.className = 'button acc-button--link'` - Too early!
2. ❌ `container.append(btn)` - Missing wrapper!
3. ❌ `applyButtonVariant(btn)` then `moveInstrumentation()` - Wrong order!
4. ❌ Editing `button-variants.js` manually - Will be overwritten!
5. ❌ Forgetting to run `npm run build:variants` - No options in dropdown!
6. ❌ Styling `.acc-button--link` in component CSS - Conflicts with theme!

---

## When User Asks to Create Component

1. Identify: How many buttons? What fields?
2. Create: Directory + 3 files
3. Model: Write JSON with correct field names
4. Update: generate-button-variants.js paths
5. Generate: `npm run build:variants`
6. Implement: JS following exact pattern
7. Style: CSS (layout only, no button colors)
8. Test: lint + verify in browser
9. Report: Files created + how to use

---

## Architecture Diagram

```
theme.css (.purple .acc-button--link {...})
    ↓
generate-button-variants.js (parses CSS)
    ↓
button-variants.js (config object)
    ↓
component.js (applyButtonVariant)
    ↓
HTML (<div class="purple"><a class="button acc-button--link">)
    ↓
CSS specificity (.purple .acc-button--link overrides .acc-button--link)
    ↓
Styled button
```

---

## Key Functions

**applyButtonVariant(button, variantProperties)**
- Input: button element with class `'button'`, variant object with `className`
- Process: Creates wrapper div, adds `acc-button--link` to button, appends button to wrapper
- Output: Returns wrapper div (NOT button)

**moveInstrumentation(from, to)**
- Copies `data-aue-*` and `data-richtext-*` attributes
- Required for Universal Editor editing
- Call BEFORE applyButtonVariant

**getButtonVariants()**
- Returns object with all available variants
- Auto-generated from theme.css
- Keys are variant names (e.g., 'purple', 'black')

---

## Regex Explained

```javascript
/\[variant-([^\]]+)\]/
```

- `\[` - Literal `[`
- `variant-` - Literal text
- `([^\]]+)` - Capture group: one or more non-`]` characters
- `\]` - Literal `]`

Matches: `[variant-purple]` → Captures: `purple`
