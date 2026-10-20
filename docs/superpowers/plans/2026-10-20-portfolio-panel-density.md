# Reducción de paneles del portafolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reducir la cantidad de paneles de scroll en todas las rutas principales del portafolio compactando tarjetas y agrupando contenido sin perder información.

**Architecture:** Mantener `ScreenPanel` como unidad de navegación y concentrar la compactación en las tarjetas actuales. Ajustar los grupos por breakpoint en las páginas que ya los generan, unir paneles breves relacionados y extender el contrato de hashes para que los enlaces históricos lleguen a los paneles resultantes. No cambiar rutas ni el controlador de rueda.

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router, Framer Motion ya instalado, `ScreenScrollContext` existente.

**Spec:** `docs/superpowers/specs/2026-10-20-portfolio-panel-density-design.md`

## Global Constraints

- No modificar el contenido factual ni eliminar tarjetas, texto, tecnologías, referencias, enlaces, galerías o CTAs.
- No reducir el tamaño de cuerpo por debajo de 14 px ni ocultar información para hacer entrar más elementos.
- No cambiar las rutas públicas, el menú, la identidad Software Engineer ni el controlador de rueda existente.
- No añadir dependencias.
- Por debajo de los umbrales existentes para scroll por panel, el contenido sigue el flujo natural y usa columnas de lectura cómoda. Se conservan las galerías, el movimiento reducido y la animación progresiva actual.

## Review Focus

- Viewports desktop bajos con header estático (1024×700, 1280×720 y 1366×768): confirmar que servicios, última fila, CTAs y controles caben en el panel y no generan scroll interno. Verificar en Task 6, Steps 2–3.
- Apertura directa de paneles con navbar lazy: confirmar que su altura reservada evita un corrimiento antes de que termine de cargar. Verificar hashes al inicio de Task 6, Step 3.
- Cruces de breakpoint (1024 px, 1279 px y 1280 px): confirmar que el conteo de tarjetas coincide con el número de columnas y no deja huecos ni desborda el panel. Verificar Inicio, Catálogo, Experiencia y Soluciones en Task 6, Steps 2–3.
- Cambio de filtro estando en un panel posterior del Catálogo: confirmar que vuelve al primer grupo filtrado, actualiza total/controles y deja los resultados accesibles. Verificar manualmente el flujo del Catálogo en Task 6, Step 3.
- Hashes viejos de paneles fusionados o grupos que ya no existen: confirmar que llegan al panel combinado o al último grupo equivalente, con foco coherente y navegación atrás/adelante operativa. Verificar enlaces directos y browser history en Task 6, Step 3.
- Móvil, galería ausente/presente y movimiento reducido: confirmar scroll natural, enlaces y controles accesibles, y que el cambio de densidad no depende de animación para mostrar contenido. Verificar en 390×844 y 768×1024 en Task 6, Step 3.

---

### Task 1: Compactar tarjetas compartidas de proyectos

**Files:**
- Modify: `src/components/ProjectMedia.jsx`
- Modify: `src/pages/Projects/components/ProjectCard.jsx`

**Interfaces:**
- Consumes: `ProjectMedia` recibe `compact`; `ProjectCard` la usa para Inicio y Catálogo.
- Produces: tarjetas de proyecto más bajas para ambas vistas sin cambiar el modo `detail` de las fichas.

- [x] **Step 1: Reducir la altura solo del media compacto**

En `ProjectMedia.jsx`, cambiar el frame de `compact` de `h-44` a una altura desktop compacta de `h-32 sm:h-36`. Dejar intactos los frames `detail` y no compactos.

- [x] **Step 2: Reducir padding y gaps de ProjectCard**

En `ProjectCard.jsx`, pasar el contenedor de `p-4 sm:p-5` a `p-3 sm:p-4`; reducir `mt-5`, `gap-4` y los gaps verticales internos a `mt-3`/`gap-3`. Mantener descripción en `text-sm` y no quitar tecnologías, links, badges ni CTAs.

- [x] **Step 3: Revisar lint de los componentes modificados**

Run: `npx eslint src/components/ProjectMedia.jsx src/pages/Projects/components/ProjectCard.jsx`
Expected: salida vacía y código de salida `0`.

- [x] **Step 4: Confirmar el diff y guardar el entregable**

Run: `git diff --check`
Expected: salida vacía. Revisar que el diff solo reduzca dimensiones y espacios de los dos componentes.

```bash
git add src/components/ProjectMedia.jsx src/pages/Projects/components/ProjectCard.jsx
git commit -m "style: compact shared project cards"
```

---

### Task 2: Reducir paneles de Inicio y Catálogo

**Files:**
- Modify: `src/pages/Projects/Projects.jsx`
- Modify: `src/pages/Projects/ProjectCatalog.jsx`

**Interfaces:**
- Consumes: `ProjectCard` compacta de Task 1; `useScreenScroll().goToPanel` existente.
- Produces: Inicio agrupa 3 destacados por panel desde 1280 px y 2 entre 1024–1279 px; Catálogo agrupa 4 desde 1280 px, 3 entre 1024–1279 px y 2 bajo 1024 px.

- [x] **Step 1: Hacer adaptable el grupo de destacados de Inicio**

En `Projects.jsx`, importar `useEffect` y `useState`; definir `getFeaturedGroupSize = () => window.innerWidth >= 1280 ? 3 : 2`, inicializar el tamaño con guardia SSR y actualizarlo con `resize` pasivo, limpiando el listener al desmontar. Crear `groups` con ese tamaño. Mantener ids `projects` y `projects-featured-N`, la introducción solo en el primer grupo y el link al Catálogo en el último.

- [x] **Step 2: Sincronizar columnas de Inicio con el tamaño de grupo**

Usar dos columnas desde `sm` y tres desde `xl`; dejar el tamaño del grupo en dos antes de 1280 px para que los breakpoints coincidan con el contenido.

- [x] **Step 3: Elevar la densidad del Catálogo por breakpoint**

En `ProjectCatalog.jsx`, definir `getGroupSize = () => window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : 2`. Ajustar el grid a `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`. Conservar la introducción, filtros en cada panel, estado vacío y retorno al primer resultado al elegir categoría.

- [x] **Step 4: Revisar lint y build de la agrupación**

Run: `npx eslint src/pages/Projects/Projects.jsx src/pages/Projects/ProjectCatalog.jsx`
Expected: salida vacía y código de salida `0`.

Run: `npm run build`
Expected: Vite termina con código de salida `0`.

- [x] **Step 5: Guardar la reducción de Inicio y Catálogo**

Run: `git diff --check`
Expected: salida vacía.

```bash
git add src/pages/Projects/Projects.jsx src/pages/Projects/ProjectCatalog.jsx
git commit -m "feat: reduce home and catalog panels"
```

---

### Task 3: Mantener compatibilidad de hashes al fusionar paneles

**Files:**
- Modify: `src/components/ScreenPanel.jsx`
- Modify: `src/context/ScreenScrollContext.jsx`

**Interfaces:**
- Consumes: lista actual de nodos `[data-screen-panel]` y hash de React Router.
- Produces: `ScreenPanel` acepta `aliases: string[]`; el proveedor resuelve primero ids exactos, luego aliases, y para hashes con sufijo numérico inexistente usa el panel numerado más alto que comparte el prefijo.

- [x] **Step 1: Añadir aliases declarativos a ScreenPanel**

Extender props con `aliases = []` y escribir `data-screen-aliases={aliases.join(' ') || undefined}`. Mantener `id`, `titleId`, controles, orden de `panelIds` y navegación sin cambios.

- [x] **Step 2: Resolver hashes directos y aliases**

En `ScreenScrollContext.jsx`, agregar un resolver local con esta prioridad: `panel.id === hashId`; token exacto de `panel.dataset.screenAliases`; fallback numérico. El fallback debe extraer el prefijo y sufijo de `hashId`, listar paneles cuyo id tenga el mismo prefijo y un sufijo compuesto solo por dígitos, ordenar numéricamente y devolver el último candidato. Si no existe candidato, devolver `null` para conservar el comportamiento actual de ir al primer panel.

- [x] **Step 3: Usar el resolver en la restauración inicial y los cambios de ruta**

Reemplazar la búsqueda exacta de `hashPanel` dentro de `useLayoutEffect` por el nuevo resolver. Mantener la prioridad actual: hash resuelto, panel guardado para `POP`, primer panel. Mantener foco en destinos directos/resueltos y el scroll reducido respetando `prefers-reduced-motion`.

- [x] **Step 4: Revisar lint y build del contrato de hash**

Run: `npx eslint src/components/ScreenPanel.jsx src/context/ScreenScrollContext.jsx`
Expected: salida vacía y código de salida `0`.

Run: `npm run build`
Expected: Vite termina con código de salida `0`.

- [x] **Step 5: Guardar la compatibilidad de navegación**

Run: `git diff --check`
Expected: salida vacía.

```bash
git add src/components/ScreenPanel.jsx src/context/ScreenScrollContext.jsx
git commit -m "fix: resolve legacy portfolio panel hashes"
```

---

### Task 4: Reducir los paneles de Experiencia y Soluciones

**Files:**
- Modify: `src/pages/Experience/Experience.jsx`
- Modify: `src/pages/Solutions/Solutions.jsx`

**Interfaces:**
- Consumes: aliases de `ScreenPanel` de Task 3.
- Produces: Experiencia muestra las cinco responsabilidades en un panel y casos profesionales en grupos de hasta tres; Soluciones muestra los cinco servicios en un panel y une proceso con cierre.

- [x] **Step 1: Reunir las responsabilidades en un solo grupo**

En `Experience.jsx`, sustituir `chunk(profileCopy.employment.responsibilities, 4)` por la lista completa. Renderizar un único `ScreenPanel` `experience-responsibilities-1`; reducir padding y `space-y-3` a `space-y-2`, manteniendo cada elemento a `text-sm` y texto completo.

- [x] **Step 2: Agrupar casos de Experiencia de tres en tres**

Cambiar `chunk(projects, 2)` a `chunk(projects, 3)`, usar tres columnas desde `lg` y conservar dos columnas en tablet. Compactar las cards a `p-4`, preservando títulos, descripciones, enlaces y CTA al Catálogo.

- [x] **Step 3: Renderizar todos los servicios en un solo panel**

En `Solutions.jsx`, eliminar el import de hooks de React, `chunk`, `getGroupSize`, estado, efecto de resize y `servicePages`; mapear los cinco objetos `services` dentro de un solo `ScreenPanel` id `solutions-services-1`. Usar `sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-3`: cinco tarjetas en una fila entre 1024–1279 px y tres columnas en dos filas desde 1280 px. En desktop ancho, colocar descripción y beneficio en dos subcolumnas; mantenerlos apilados en tarjetas de la fila de cinco. Reducir artwork y padding/gaps y conservar textos, evidencia y enlaces completos, con cuerpo de 14 px o más.

- [x] **Step 4: Fusionar proceso y cierre conservando hashes**

Conservar `solutions-process` como id canónico y pasar `aliases={['solutions-closing']}`. Mover el bloque de cierre y su CTA dentro del mismo panel después de los tres pasos. Ajustar el espaciado vertical y mantener ambos títulos y todo su texto/enlaces.

- [x] **Step 5: Revisar lint y build de Experiencia y Soluciones**

Run: `npx eslint src/pages/Experience/Experience.jsx src/pages/Solutions/Solutions.jsx`
Expected: salida vacía y código de salida `0`.

Run: `npm run build`
Expected: Vite termina con código de salida `0`.

- [x] **Step 6: Guardar la reducción de Experiencia y Soluciones**

Run: `git diff --check`
Expected: salida vacía.

```bash
git add src/pages/Experience/Experience.jsx src/pages/Solutions/Solutions.jsx
git commit -m "feat: reduce experience and solutions panels"
```

---

### Task 5: Unir contexto y enlaces en las fichas de proyecto

**Files:**
- Modify: `src/pages/Projects/components/ProjectPage.jsx`

**Interfaces:**
- Consumes: alias `ScreenPanel` de Task 3 y datos actuales del proyecto.
- Produces: un solo panel `project-context` con contexto, rol, navegación al catálogo y enlaces externos; `project-links` queda como alias. Resumen y galería permanecen separados.

- [x] **Step 1: Añadir el alias antes de mover el panel de enlaces**

Pasar `aliases={['project-links']}` al `ScreenPanel` `project-context`, manteniendo `project-context` como destino canónico.

- [x] **Step 2: Colocar navegación y enlaces junto a contexto/rol**

Mover el bloque de `<nav aria-label={project.title}>` al panel `project-context`, después de las dos tarjetas de contexto/rol. Conservar el heading `project-links-title`, el enlace al Catálogo y cada `externalLinks`.

- [x] **Step 3: Eliminar el panel de enlaces duplicado**

Retirar el `ScreenPanel id="project-links"` original una vez movido su contenido. Mantener overview, arrays de contribuciones/resultados, galería condicional y slugs sin cambios.

- [x] **Step 4: Revisar lint y build de fichas**

Run: `npx eslint src/pages/Projects/components/ProjectPage.jsx`
Expected: salida vacía y código de salida `0`.

Run: `npm run build`
Expected: Vite termina con código de salida `0`.

- [x] **Step 5: Guardar la composición de las fichas**

Run: `git diff --check`
Expected: salida vacía.

```bash
git add src/pages/Projects/components/ProjectPage.jsx
git commit -m "feat: combine project context and links"
```

---

### Task 6: Verificación visual integrada y publicación en master

**Files:**
- Review: `src/pages/Projects/components/ProjectCard.jsx`, `src/pages/Projects/ProjectCatalog.jsx`, `src/pages/Experience/Experience.jsx`, `src/pages/Solutions/Solutions.jsx`, `src/pages/Projects/components/ProjectPage.jsx`, `src/components/ScreenPanel.jsx`, `src/context/ScreenScrollContext.jsx`, `src/App.jsx`, `src/index.css`.

**Interfaces:**
- Consumes: entregables de Tasks 1–5.
- Produces: cambio validado en las rutas principales y publicado en `origin/master`.

- [x] **Step 1: Construir y revisar lint dirigido final**

Run: `npm run build`
Expected: Vite termina con código de salida `0`.

Run: `npx eslint src/components/ProjectMedia.jsx src/pages/Projects/components/ProjectCard.jsx src/pages/Projects/Projects.jsx src/pages/Projects/ProjectCatalog.jsx src/components/ScreenPanel.jsx src/context/ScreenScrollContext.jsx src/pages/Experience/Experience.jsx src/pages/Solutions/Solutions.jsx src/pages/Projects/components/ProjectPage.jsx`
Expected: salida vacía y código de salida `0`.

- [x] **Step 2: Recorrer visualmente las rutas desktop**

Ejecutar `npm run dev -- --host 127.0.0.1` y revisar Inicio, Catálogo, Experiencia, Soluciones y una ficha con galería a 1280×720 y 1366×768. Confirmar paneles completos, tamaños de cuerpo legibles, conteos por breakpoint, filtros visibles y ausencia de overflow vertical interno.

- [x] **Step 3: Recorrer comportamiento responsive y de navegación**

Revisar 1024×700, 1279×720, 1280×720, 768×1024 y 390×844. Confirmar scroll natural bajo el breakpoint, todas las tarjetas y CTAs disponibles, una ficha con galería y otra sin galería, filtros al cambiar desde un panel posterior, temas claro/oscuro, español/inglés y contenido visible con movimiento reducido. Abrir hashes `#solutions-closing`, `#project-links`, `#projects-page-99`, `#experience-responsibilities-2` y `#experience-cases-99`; confirmar destino/foco y atrás/adelante.

- [ ] **Step 4: Confirmar estado limpio y que master no avanzó por separado**

Run: `git status --short`
Expected: salida vacía.

Run: `git fetch origin master`
Run: `git merge-base --is-ancestor origin/master HEAD`
Expected: código de salida `0`. Si la comprobación falla, ejecutar `git rebase origin/master`, resolver cualquier conflicto conservando los cambios aprobados y repetir build, ESLint y recorrido visual antes del push.

- [ ] **Step 5: Publicar el resultado autorizado**

Run: `git push origin HEAD:master`
Expected: actualización fast-forward de `master` al commit revisado.

Run: `git fetch origin master`
Run: `git rev-parse HEAD`
Run: `git rev-parse origin/master`
Expected: ambos hashes iguales y `git status --short` vacío.

No agregar ni ejecutar pruebas automatizadas; el control de calidad de este cambio consiste en build, ESLint dirigido y recorrido visual/manual.
