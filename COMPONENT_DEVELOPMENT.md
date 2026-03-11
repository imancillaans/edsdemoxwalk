# Guía de Desarrollo de Componentes - AEM Edge Delivery Services

Esta guía documenta las mejores prácticas y aprendizajes para crear componentes de bloques en AEM Edge Delivery Services con Universal Editor.

## Tabla de Contenidos

- [Conceptos Clave](#conceptos-clave)
- [Estructura de Archivos](#estructura-de-archivos)
- [Tipos de Campos y Field Collapse](#tipos-de-campos-y-field-collapse)
- [Decorators (JavaScript)](#decorators-javascript)
- [Estilos (CSS)](#estilos-css)
- [Componentes Full-Width](#componentes-full-width)
- [Debugging](#debugging)
- [Workflow de Desarrollo](#workflow-de-desarrollo)
- [Problemas Comunes](#problemas-comunes)

---

## Conceptos Clave

### Universal Editor
- **WYSIWYG authoring**: Los autores pueden editar contenido directamente en la página
- **Component Models**: Definen los campos y opciones de configuración de cada componente
- **Decorators**: Funciones JavaScript que transforman el DOM desde la estructura de tabla a la estructura final del componente
- **Instrumentation**: Atributos `data-aue-*` que permiten la edición en Universal Editor

### Field Collapse
**CRÍTICO**: Cuando defines dos campos con el patrón `{name}Link` + `{name}LinkText`, Universal Editor los **colapsa en una sola row**.

**Ejemplo:**
```json
{
  "component": "aem-content",
  "name": "cta1Link",
  "label": "Primary Button Link"
},
{
  "component": "text",
  "name": "cta1LinkText",
  "label": "Primary Button Text"
}
```

**Resultado en el DOM:**
- En lugar de 2 rows separadas, se genera 1 row con un `<a>` que contiene el link y el texto
- El decorator debe leer el link con: `row.querySelector('a')`
- El texto del link está en: `link.textContent`

---

## Estructura de Archivos

### 1. Model Definition (`models/_component-name.json`)

Define los campos que aparecerán en Universal Editor:

```json
{
  "id": "banner",
  "fields": [
    {
      "component": "text",
      "name": "title",
      "label": "Title",
      "valueType": "string"
    },
    {
      "component": "richtext",
      "name": "subtitle",
      "label": "Subtitle",
      "valueType": "string"
    },
    {
      "component": "aem-content",
      "name": "cta1Link",
      "label": "Primary Button Link"
    },
    {
      "component": "text",
      "name": "cta1LinkText",
      "label": "Primary Button Text",
      "valueType": "string"
    },
    {
      "component": "reference",
      "name": "image",
      "label": "Hero Image",
      "multi": false
    },
    {
      "component": "select",
      "name": "classes",
      "label": "Background Color",
      "valueType": "string",
      "options": [
        {"name": "Dark Blue (Default)", "value": ""},
        {"name": "Light", "value": "light"}
      ]
    }
  ]
}
```

**Tipos de campos comunes:**
- `text`: Campo de texto simple
- `richtext`: Editor de texto enriquecido
- `aem-content`: Selector de contenido/páginas (para links)
- `reference`: Selector de archivos (imágenes, documentos)
- `select`: Dropdown de opciones
- `multiselect`: Selección múltiple

### 2. Block Decorator (`blocks/component-name/component-name.js`)

**IMPORTANTE**: El decorator recibe rows colapsadas por el field collapse pattern.

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Con field collapse, tendrás MENOS rows de las que esperas
  // En este caso: 5 rows en lugar de 8 fields
  const [
    titleRow,      // field: title
    subtitleRow,   // field: subtitle
    cta1Row,       // fields: cta1Link + cta1LinkText (COLAPSADOS)
    cta2Row,       // fields: cta2Link + cta2LinkText (COLAPSADOS)
    imageRow,      // field: image
  ] = rows;
  // NOTA: El field "classes" NO aparece como row, se aplica automáticamente como clase CSS

  // Crear contenedor principal
  const content = document.createElement('div');
  content.className = 'banner-content';

  // Procesar título (simple text field)
  if (titleRow) {
    const titleCell = titleRow.querySelector(':scope > div');
    const titleText = titleCell?.textContent.trim();

    if (titleText) {
      const title = document.createElement('h1');
      title.className = 'banner-title';
      moveInstrumentation(titleCell, title);  // ¡CRÍTICO para Universal Editor!
      title.textContent = titleText;
      content.append(title);
    }
    titleRow.remove();
  }

  // Procesar subtitle (richtext field)
  if (subtitleRow) {
    const subtitleCell = subtitleRow.querySelector(':scope > div');

    if (subtitleCell && subtitleCell.textContent.trim()) {
      const subtitle = document.createElement('div');
      subtitle.className = 'banner-subtitle';
      moveInstrumentation(subtitleCell, subtitle);

      // Para richtext, copiar TODO el contenido (puede tener <p>, <strong>, etc.)
      while (subtitleCell.firstChild) {
        subtitle.append(subtitleCell.firstChild);
      }

      content.append(subtitle);
    }
    subtitleRow.remove();
  }

  // Procesar botones (COLLAPSED FIELDS)
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'banner-buttons';

  // CTA 1 - Link + Text colapsados en una row
  if (cta1Row) {
    const cta1Cell = cta1Row.querySelector(':scope > div');
    const link = cta1Cell?.querySelector('a');  // El link YA viene como <a>

    if (link) {
      const btn1 = document.createElement('a');
      btn1.href = link.getAttribute('href') || '';
      btn1.className = 'button primary';
      btn1.textContent = link.textContent.trim();  // El texto está en link.textContent
      moveInstrumentation(link, btn1);
      buttonsWrapper.append(btn1);
    }
    cta1Row.remove();
  }

  // CTA 2 - Link + Text colapsados
  if (cta2Row) {
    const cta2Cell = cta2Row.querySelector(':scope > div');
    const link = cta2Cell?.querySelector('a');

    if (link) {
      const btn2 = document.createElement('a');
      btn2.href = link.getAttribute('href') || '';
      btn2.className = 'button secondary';
      btn2.textContent = link.textContent.trim();
      moveInstrumentation(link, btn2);
      buttonsWrapper.append(btn2);
    }
    cta2Row.remove();
  }

  if (buttonsWrapper.children.length > 0) {
    content.append(buttonsWrapper);
  }

  // Procesar imagen (reference field)
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'banner-image';

  if (imageRow) {
    const imageCell = imageRow.querySelector(':scope > div');
    const picture = imageCell?.querySelector('picture');

    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          false,
          [
            { media: '(min-width: 900px)', width: '800' },
            { width: '600' }
          ],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
      }
    }
    imageRow.remove();
  }

  // Agregar todo al block
  block.append(content);
  block.append(imageWrapper);
}
```

**Reglas importantes del decorator:**
1. Usar `:scope > div` para seleccionar celdas de cada row
2. **SIEMPRE** llamar `moveInstrumentation()` al crear nuevos elementos
3. Remover las rows procesadas con `.remove()`
4. Para collapsed fields (Link + LinkText), buscar el `<a>` directamente en la celda
5. El field `classes` NO aparece como row, se aplica automáticamente

### 3. Block Styles (`blocks/component-name/component-name.css`)

```css
.banner {
  background: #0a1f44;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 4rem clamp(1rem, 5vw, 4rem);
  min-height: 500px;
  width: 100%;
  box-sizing: border-box;  /* CRÍTICO para full-width */
}

/* Estilos para las variantes del field "classes" */
.banner.light {
  background: #f8fafc;
}

.banner.dark {
  background: #0f172a;
}

.banner.purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 4. Registrar en component-models.json

```json
{
  "id": "component-models",
  "fields": [
    {
      "component": "container",
      "name": "models",
      "label": "Component Models",
      "fields": [
        {
          "component": "reference",
          "name": "banner",
          "value": "/models/banner"
        }
      ]
    }
  ]
}
```

### 5. Agregar al Section Filter

En `models/_section.json`:

```json
{
  "id": "section",
  "fields": [
    {
      "component": "multiselect",
      "name": "filter",
      "label": "Allowed Blocks",
      "options": [
        {"name": "Banner", "value": "banner"},
        {"name": "Hero", "value": "hero"},
        {"name": "Cards", "value": "cards"}
      ]
    }
  ]
}
```

---

## Componentes Full-Width

### Problema
Por defecto, AEM EDS tiene estilos globales que limitan el ancho:

```css
/* styles/styles.css */
main > .section > div {
  max-width: 1200px;
  margin: auto;
  padding: 0 24px;
}

@media (width >= 900px) {
  main > .section > div {
    padding: 0 32px;
  }
}
```

Esto hace que el wrapper (`.banner-wrapper`) tenga:
- `max-width: 1200px` → Limita el ancho
- `margin: auto` → Centra el contenido
- `padding: 0 24px` (o `0 32px`) → Agrega padding lateral

### Solución

En el CSS del componente, sobrescribir estos estilos:

```css
/* Remove default section padding for banner */
main .section:has(.banner) {
  padding: 0;
}

/* Remove wrapper constraints */
main .section:has(.banner) > div {
  max-width: none;
  margin: 0;
  padding: 0 !important;  /* !important para sobrescribir media queries */
}

/* El componente mismo tiene padding interno */
.banner {
  width: 100%;
  box-sizing: border-box;  /* Incluye padding en el width */
  padding: 4rem clamp(1rem, 5vw, 4rem);  /* Padding responsive */
}
```

**Por qué funciona:**
1. `main .section:has(.banner)` → Selecciona la section que contiene el banner
2. `> div` → Selecciona el wrapper directo (`.banner-wrapper`)
3. `max-width: none` → Permite full-width
4. `padding: 0 !important` → Elimina padding lateral (el `!important` es necesario para sobrescribir el media query)
5. `box-sizing: border-box` → Hace que `width: 100%` incluya el padding

---

## Debugging

### Debugging del Decorator

Para entender qué estructura recibe el decorator:

```javascript
export default function decorate(block) {
  const rows = [...block.children];

  // Debug: Log the structure
  console.log('Banner - Total rows:', rows.length);
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');
    console.log(`Row ${index}:`, cells.length, 'cells');
    cells.forEach((cell, cellIndex) => {
      console.log(`  Cell ${cellIndex}:`, cell.textContent.substring(0, 50));
    });
  });

  // ... resto del código
}
```

### Debugging de Sizing (Full-Width Issues)

```javascript
export default function decorate(block) {
  // ... código del decorator

  // Debug sizing
  setTimeout(() => {
    const section = block.closest('.section');
    const wrapper = block.parentElement;
    console.log('=== BANNER SIZING DEBUG ===');
    console.log('Section:', section?.className);
    console.log('  width:', section?.offsetWidth, 'scrollWidth:', section?.scrollWidth);
    console.log('Wrapper:', wrapper?.className);
    console.log('  width:', wrapper?.offsetWidth, 'scrollWidth:', wrapper?.scrollWidth);
    console.log('Banner:', block.className);
    console.log('  width:', block.offsetWidth, 'scrollWidth:', block.scrollWidth);
    console.log('  computed box-sizing:', getComputedStyle(block).boxSizing);
    console.log('  computed padding:', getComputedStyle(block).padding);
  }, 100);
}
```

**Qué buscar:**
- Si `scrollWidth > offsetWidth` → Hay overflow (scroll horizontal)
- `box-sizing` debería ser `border-box`
- El wrapper no debería tener `max-width` ni `padding`

---

## Workflow de Desarrollo

### 1. Desarrollo Local

```bash
# Instalar dependencias
npm install

# Lint durante desarrollo
npm run lint

# Fix lint automáticamente
npm run lint:fix
```

### 2. Commit y Deploy

```bash
# Ver cambios
git status
git diff

# Agregar archivos
git add blocks/banner/banner.js blocks/banner/banner.css models/_banner.json

# Commit
git commit -m "feat: Add banner component with full-width layout"

# Push (dispara GitHub Actions)
git push origin main
```

### 3. Verificar Deploy

1. GitHub Actions ejecuta build (1-2 min)
2. AEM compila los cambios (2-5 min adicionales)
3. Total: **3-7 minutos** desde push hasta que aparece en live

**URLs importantes:**
- GitHub Actions: `https://github.com/{org}/{repo}/actions`
- Universal Editor: `https://author-{program}-{env}.adobeaemcloud.com/...`
- Live site: `https://main--{repo}--{org}.aem.live/`

### 4. Verificar en Universal Editor

1. Abrir página en Universal Editor
2. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) o `Cmd+Shift+R` (Mac)
3. Agregar el componente desde el panel lateral
4. Verificar que todos los campos funcionen
5. Verificar que los estilos se apliquen correctamente

---

## Problemas Comunes

### 1. Componente no aparece en Universal Editor

**Causas:**
- No está en el section filter (`models/_section.json`)
- No está registrado en `models/_component-models.json`
- El modelo no tiene la propiedad `"id"`

**Solución:**
Verificar que el componente esté en ambos archivos.

### 2. Campos no aparecen o se ven vacíos

**Causa:**
El decorator espera más rows de las que recibe por field collapse.

**Solución:**
- Contar las rows esperadas considerando collapsed fields
- Usar `console.log` para ver la estructura real
- Ajustar el destructuring del decorator

### 3. Botón secundario o imagen no aparecen

**Causa:**
El decorator está destructurando incorrectamente las rows.

**Solución:**
```javascript
// INCORRECTO (esperando 8 rows)
const [titleRow, subtitleRow, cta1LinkRow, cta1TextRow, cta2LinkRow, cta2TextRow, imageRow, classesRow] = rows;

// CORRECTO (5 rows por field collapse)
const [titleRow, subtitleRow, cta1Row, cta2Row, imageRow] = rows;
```

### 4. Scroll horizontal / Componente se sale de la página

**Causa:**
- Wrapper tiene `max-width` y `padding`
- Componente tiene `width: 100%` + `padding` sin `box-sizing: border-box`

**Solución:**
```css
/* Sobrescribir wrapper */
main .section:has(.banner) > div {
  max-width: none;
  padding: 0 !important;
}

/* Componente */
.banner {
  width: 100%;
  box-sizing: border-box;
}
```

### 5. Estilos no se aplican después de deploy

**Causas:**
- Cache del navegador
- Deploy aún no completado

**Solución:**
- Esperar 3-7 minutos después del push
- Hard refresh: `Ctrl+Shift+R`
- Verificar en modo incógnito
- Revisar GitHub Actions para ver si el build falló

### 6. Universal Editor muestra error "Cannot read properties of null"

**Causa:**
El decorator está intentando acceder a elementos que no existen.

**Solución:**
Usar optional chaining (`?.`) en todo el código:

```javascript
const titleText = titleCell?.textContent.trim();
const link = cta1Cell?.querySelector('a');
```

### 7. Lint errors: "max-len" o "orphan collapsible field names"

**Causa:**
- Líneas muy largas (> 100 chars)
- Nombres de fields no siguen el patrón correcto

**Solución:**
```javascript
// Reformatear destructuring
const [
  titleRow,
  subtitleRow,
] = rows;

// Renombrar fields para seguir el patrón
// cta1Text → cta1LinkText
```

---

## Checklist de Componente Completo

Antes de considerar un componente terminado, verificar:

- [ ] Model definition creado en `models/_component-name.json`
- [ ] Decorator implementado en `blocks/component-name/component-name.js`
- [ ] Estilos creados en `blocks/component-name/component-name.css`
- [ ] Registrado en `models/_component-models.json`
- [ ] Agregado al section filter en `models/_section.json`
- [ ] Lint pasa sin errores: `npm run lint`
- [ ] Decorator maneja correctamente collapsed fields
- [ ] `moveInstrumentation()` llamado en todos los elementos editables
- [ ] Si es full-width, wrapper constraints sobrescritos
- [ ] `box-sizing: border-box` si usa padding + width 100%
- [ ] Responsive design (media queries)
- [ ] Variantes de estilo funcionan (si las hay)
- [ ] Testeado en Universal Editor
- [ ] Testeado en live site
- [ ] Documentación actualizada (si aplica)

---

## Ejemplo Completo: Banner Component

El componente Banner implementado en este proyecto es un ejemplo completo que incluye:

1. **5 fields** (que generan 5 rows por field collapse):
   - `title` (text)
   - `subtitle` (richtext)
   - `cta1Link` + `cta1LinkText` (collapsed)
   - `cta2Link` + `cta2LinkText` (collapsed)
   - `image` (reference)

2. **Field "classes"** para variantes de color:
   - Dark Blue (default)
   - Light
   - Dark
   - Purple

3. **Layout full-width** de borde a borde

4. **Responsive design** con media query a 900px

5. **Instrumentation correcta** para Universal Editor

**Archivos de referencia:**
- `models/_banner.json`
- `blocks/banner/banner.js`
- `blocks/banner/banner.css`

---

## Referencias

- [AEM Edge Delivery Services Docs](https://www.aem.live/)
- [Universal Editor Documentation](https://www.aem.live/developer/universal-editor-blocks)
- [Component Models Reference](https://www.aem.live/docs/forms/component-models)

---

**Última actualización:** 2026-03-11
