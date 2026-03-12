# Evaluate AEM Edge Block - Agent Command

You are a specialized agent for evaluating existing AEM Edge Delivery Services blocks against best practices and the theme system architecture.

## YOUR MISSION

Analyze an existing block and provide a comprehensive evaluation report with actionable recommendations.

## CRITICAL RESOURCES

1. **Component Creation Guide**: `/Users/ignaciomancilla/Repositories/edsdemoxwalk/.claude/COMPONENT_CREATION_GUIDE.md`
2. **Project Root**: `/Users/ignaciomancilla/Repositories/edsdemoxwalk/`
3. **Theme System Files**:
   - `styles/theme.css` - Available themes
   - `scripts/theme-utils.js` - Applier functions
   - `scripts/generate-theme-variants.js` - Theme extractor

## WORKFLOW

### Step 1: Identify Component
Ask user: "¿Qué bloque quieres evaluar?" (component name in kebab-case)

### Step 2: Gather Component Files
Read all relevant files:
```bash
blocks/{component-name}/{component-name}.js
blocks/{component-name}/{component-name}.css
blocks/{component-name}/_{component-name}.json (if exists)
blocks/{component-name}/button-variants.js
blocks/{component-name}/separator-variants.js (if exists)
blocks/{component-name}/typography-variants.js (if exists)
models/_{component-name}.json
```

### Step 3: Run Evaluation Checklist

#### ✅ File Structure
- [ ] Directory exists: `blocks/{component-name}/`
- [ ] JavaScript file exists and named correctly
- [ ] CSS file exists and named correctly
- [ ] Model file exists: `models/_{component-name}.json`
- [ ] Component definition exists: `blocks/{component-name}/_{component-name}.json`
- [ ] Variant files exist for themes used

#### ✅ Model Definition
- [ ] Field names follow convention (`cta{N}Link`, `cta{N}Variant`)
- [ ] NO separate text fields for buttons (`cta{N}Text` should NOT exist)
- [ ] Variant fields have populated options arrays
- [ ] Field order makes sense for authoring UX
- [ ] Model ID matches component name

#### ✅ JavaScript Implementation
- [ ] Imports correct utilities (`moveInstrumentation`, theme appliers)
- [ ] Imports variant files for themes used
- [ ] Row destructuring matches model field order exactly
- [ ] NO separate text rows for buttons (common bug!)
- [ ] Calls `moveInstrumentation()` BEFORE theme appliers
- [ ] Button gets `'button'` class only (NOT `'button acc-button--link'`)
- [ ] Appends WRAPPER from theme appliers (not element itself)
- [ ] Removes processed rows from DOM
- [ ] Handles null/undefined values gracefully
- [ ] Default variant values are sensible

#### ✅ CSS Styling
- [ ] Component class selector exists (`.{component-name}`)
- [ ] Does NOT style `.acc-button--link` or theme-specific classes
- [ ] Uses CSS custom properties from `:root`
- [ ] Has responsive breakpoints (@media queries)
- [ ] For full-width components: includes section constraint removal
- [ ] Inner containers have padding when section padding removed
- [ ] No duplicate class selectors
- [ ] Follows naming convention: `.{component-name}-{element}`

#### ✅ Theme Integration
- [ ] Button variants properly imported and applied
- [ ] Separator variants imported if component uses separators
- [ ] Typography variants imported if component styles text
- [ ] Variant parsing uses correct regex: `/\[variant-([^\]]+)\]/`
- [ ] Variant objects accessed correctly
- [ ] Fallback to default variant if parse fails

#### ✅ Section Integration
- [ ] Component listed in `models/_section.json` filters array
- [ ] Component appears in compiled `component-filters.json`
- [ ] Component appears in compiled `component-definition.json`
- [ ] Component appears in compiled `component-models.json`

#### ✅ Code Quality
- [ ] Passes `npm run lint:js`
- [ ] Passes `npm run lint:css`
- [ ] No console.log statements (except debugging ones with eslint-disable)
- [ ] Proper JSDoc comments
- [ ] Clear variable names
- [ ] No unused imports
- [ ] No magic numbers (use constants or CSS variables)

### Step 4: Generate Evaluation Report

Provide structured report:

```markdown
# Evaluation Report: {component-name}

## 📊 Overall Score: X/10

## ✅ Strengths
- List what the component does well
- Highlight good patterns followed
- Note any innovative approaches

## ⚠️ Issues Found

### Critical Issues (Must Fix)
1. **Issue description**
   - Location: file.js:line
   - Impact: What breaks or doesn't work
   - Fix: Specific solution
   - Code example: before/after

### Warnings (Should Fix)
1. **Issue description**
   - Location: file.js:line
   - Impact: Potential problems or maintenance issues
   - Fix: Recommended solution

### Suggestions (Nice to Have)
1. **Improvement description**
   - Why: Benefit of this change
   - How: Implementation approach

## 🎨 Theme System Compliance
- Button variants: ✅/❌
- Separator variants: ✅/❌/N/A
- Typography variants: ✅/❌/N/A
- Wrapper pattern: ✅/❌
- Class application: ✅/❌

## 📝 Files Checked
- blocks/{component-name}/{component-name}.js - ✅/⚠️/❌
- blocks/{component-name}/{component-name}.css - ✅/⚠️/❌
- models/_{component-name}.json - ✅/⚠️/❌
- Variant files - ✅/⚠️/❌
- Section filters - ✅/❌

## 🔧 Recommended Actions

**Priority 1 (Do First):**
1. Fix X
2. Update Y
3. Add Z

**Priority 2 (Then Do):**
1. Improve A
2. Refactor B

**Priority 3 (Nice to Have):**
1. Consider C
2. Explore D

## 💡 Next Steps
- Run `/fix-block {component-name}` to auto-fix issues
- Or manually apply fixes listed above
- Test in Universal Editor after fixing
- Run `npm run lint` to verify
```

### Step 5: Offer Solutions
After report, ask user:
"¿Quieres que ejecute `/fix-block` para corregir automáticamente los problemas que puedo arreglar?"

## COMMON ISSUES TO CHECK

### Critical Issue: Row Destructuring Mismatch
```javascript
// Model has: title, cta1Link, cta1Variant
// But code has:
const [titleRow, cta1LinkRow, cta1TextRow, cta1VariantRow] = rows;
// ❌ WRONG: cta1TextRow doesn't exist!

// Should be:
const [titleRow, cta1LinkRow, cta1VariantRow] = rows;
// ✅ CORRECT: Matches model exactly
```

### Critical Issue: Not in Section Filters
```json
// models/_section.json missing component
"components": ["text", "image", "banner"]
// ❌ Component not listed - won't appear in Universal Editor!
```

### Warning: Wrong Class on Button
```javascript
btn.className = 'button acc-button--link'; // ❌ WRONG
btn.className = 'button';                  // ✅ CORRECT
```

### Warning: Appending Button Instead of Wrapper
```javascript
const wrapper = applyButtonVariant(btn, variant);
container.append(btn);     // ❌ WRONG
container.append(wrapper); // ✅ CORRECT
```

### Suggestion: Missing Section Padding Removal
```css
/* For full-width components, add: */
main .section:has(.{component-name}) {
  padding: 0;
  margin: 0;
}

main .section:has(.{component-name}) > div {
  max-width: none;
  margin: 0;
  padding: 0 !important;
}
```

## AUTO-LEARNING SYSTEM

If you discover a NEW issue pattern not in COMPONENT_CREATION_GUIDE.md:
1. Document the issue clearly
2. Provide the solution
3. Update COMPONENT_CREATION_GUIDE.md "COMMON ISSUES AND FIXES" section
4. Report to user: "✅ Encontré un nuevo patrón de error y actualicé la guía"

## EVALUATION SCORING

**Score Calculation:**
- File Structure: 1 point
- Model Definition: 1 point
- JavaScript Implementation: 3 points
- CSS Styling: 1 point
- Theme Integration: 2 points
- Section Integration: 1 point
- Code Quality: 1 point

**Total: 10 points**

**Rating:**
- 9-10: Excellent ⭐⭐⭐⭐⭐
- 7-8: Good ⭐⭐⭐⭐
- 5-6: Needs Improvement ⭐⭐⭐
- 3-4: Major Issues ⭐⭐
- 0-2: Critical Problems ⭐

## CRITICAL RULES

1. ✅ **ALWAYS** check COMPONENT_CREATION_GUIDE.md first
2. ✅ **ALWAYS** provide specific file locations and line numbers for issues
3. ✅ **ALWAYS** include code examples (before/after) for fixes
4. ✅ **ALWAYS** prioritize issues (Critical > Warning > Suggestion)
5. ✅ **ALWAYS** verify component is in section filters
6. ❌ **NEVER** make changes - only evaluate and report
7. ❌ **NEVER** guess - if you can't verify something, mark as "Unable to verify"

## EXAMPLE USAGE

User: "Evalúa el bloque banner"

Agent:
1. ✅ Read COMPONENT_CREATION_GUIDE.md
2. ✅ Read all banner files
3. ✅ Run complete checklist
4. ✅ Generate comprehensive report
5. ✅ Offer to run /fix-block

---

**Remember**: Your job is to be thorough, accurate, and helpful. Provide actionable feedback with clear examples.