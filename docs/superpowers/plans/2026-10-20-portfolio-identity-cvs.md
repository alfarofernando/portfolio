# Portfolio identity and CV wording Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Present Fernando as Software Engineer across the portfolio and its downloadable CVs, removing novice-status labels while keeping employment facts accurate.

**Architecture:** Use content/profile.json as the shared source for current role and employment facts. Keep the same identity in localized copy and static metadata, then regenerate the Markdown and PDF CV outputs through the existing Python generator.

**Tech Stack:** React, Vite, localized JavaScript objects, JSON, Python, ReportLab.

**Spec:** [2026-10-20-portfolio-fullscreen-scroll-design.md](../specs/2026-10-20-portfolio-fullscreen-scroll-design.md)

## Global Constraints

- Presentar el rol y titular público como «Software Engineer» en ambos idiomas. «Full Stack» puede describir el alcance técnico, pero no sustituye ese titular.
- Retirar Junior, Becario, Trainee y términos equivalentes de la identidad, copy, metadatos y CV descargables publicados por el portafolio. Revisar también sinónimos como Intern, Internship, Entry-level, Apprentice, Pasante, Practicante y Aprendiz cuando describan el nivel o tipo de contratación.
- Mantener empresa, fechas, funciones y progresión Tier 1→2 cuando estén respaldadas; presentar el rol como Software Engineer en ambos idiomas, sin añadir nivel o responsabilidad.
- No añadir servicios, capacidades, métricas, proyectos o responsabilidades sin respaldo.
- No añadir dependencias; este plan no requiere nuevas capacidades de runtime.

## Review Focus

- Titular ES/EN: comprobar las etiquetas visibles de portada, navegación, experiencia y footer en ambos idiomas.
- Puesto histórico: comprobar que los CV conservan empresa, periodo, título Software Engineer, Tier 1→2 y funciones respaldadas.
- Metadatos: comprobar title, description y manifest tanto en el HTML estático como en el cambio de idioma de la SPA.
- PDFs: comprobar texto seleccionable, encabezado y footer en ambos documentos regenerados.
- Búsqueda global de etiquetas de nivel: distinguir la redacción pública de nombres o documentación interna que no se publica.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| content/profile.json | Fuente bilingüe del rol, resumen y empleo |
| content/projects.json | Datos de aportes mostrados en catálogo, fichas y CV |
| src/locales/locales.js | Títulos, navegación, SEO, presentación y footer ES/EN |
| index.html | Metadatos estáticos de la ruta inicial |
| public/manifest.json | Nombre y descripción instalable |
| scripts/generate_cvs.py | Salida Markdown, metadatos PDF y pie del PDF |
| scripts/test_generate_cvs.py | Expectativas existentes para el texto generado del proyecto relacionado |
| docs/cv/cv-master-es.md | CV español generado |
| docs/cv/cv-master-en.md | CV inglés generado |
| public/cv-AlfaroFernando-Esp.pdf | PDF español generado |
| public/cv-AlfaroFernando-Eng.pdf | PDF inglés generado |

### Task 1: Alinear la fuente de perfil y los textos de identidad ES/EN

**Files:**
- Modify: content/profile.json
- Modify: content/projects.json
- Modify: src/locales/locales.js

**Interface:** La propiedad copy[language].role seguirá siendo la fuente del rol en cada idioma. Los componentes continuarán leyendo esas propiedades mediante el perfil y locales existentes.

- [ ] **Step 1: Actualizar el rol principal**

  En las dos entradas de content/profile.json, conservar `copy[language].role` como `Software Engineer` y alinear también el empleo con ese título, conservando la progresión documentada:

  ```json
  "copy": {
    "es": { "employment": { "role": "Software Engineer · Tier 1 → Tier 2" } },
    "en": { "employment": { "role": "Software Engineer · Tier 1 → Tier 2" } }
  }
  ```

  En `content/projects.json`, reescribir solo la referencia a acompañar a un becario/intern como acompañamiento a otro desarrollador, conservando el alcance real de liderazgo técnico del proyecto.

  ```json
  "role": "Desarrollo full stack y liderazgo técnico acotado del proyecto, con acompañamiento a otro desarrollador."
  "role": "Full-stack development and project-scoped technical leadership, supporting another developer."
  ```

- [ ] **Step 2: Alinear los locales activos y heredados**

  En src/locales/locales.js, cambiar títulos de marca, subheading, resumen de footer y títulos SEO para que presenten Software Engineer en ES y EN. Revisar cada objeto locale y sus variantes existentes, no solo el primer bloque coincidente.

  Mantener las tecnologías y el resumen factual. No agregar seniority; reemplazar etiquetas de nivel en cadenas públicas y retirar las claves de texto que solo servían a la sección Sobre mí.

- [ ] **Step 3: Buscar etiquetas y equivalentes en las fuentes publicadas**

  Ejecutar una búsqueda con límites de palabra en las fuentes y artefactos publicados bajo content, src, public, docs/cv, index.html y public/manifest.json para Junior, Becario, Trainee, Intern, Internship, Entry-level, Entry level, Apprentice, Pasante, Practicante y Aprendiz. Corregir cualquier cadena pública que describa el nivel o tipo de contratación. Revisar cada coincidencia en contexto y conservar palabras técnicas como “internal” cuando no describen el nivel profesional.

### Task 2: Sincronizar metadatos estáticos y descripción instalable

**Files:**
- Modify: index.html
- Modify: public/manifest.json

**Interface:** Los metadatos de la SPA en locales y los estáticos de HTML/manifest deben comunicar el mismo rol en español.

- [ ] **Step 1: Actualizar título y descripciones iniciales**

  En index.html, reemplazar el rol anterior en description, og:title y title por Software Engineer. Mantener las tecnologías y la descripción factual existente.

- [ ] **Step 2: Actualizar el manifest**

  En public/manifest.json, cambiar description para que diga Software Engineer. Preservar nombre, idioma, iconos, colores y modo de presentación.

- [ ] **Step 3: Comparar copias ES/EN y estáticas**

  Buscar títulos y descripciones con los términos prohibidos en los cuatro archivos de fuentes. Verificar visualmente que la página ES inicial y el cambio a EN muestren el mismo posicionamiento, sin inconsistencias entre h1 y SEO.

### Task 3: Regenerar y revisar los CV públicos

**Files:**
- Modify: scripts/generate_cvs.py
- Modify: scripts/test_generate_cvs.py
- Regenerate: docs/cv/cv-master-es.md
- Regenerate: docs/cv/cv-master-en.md
- Regenerate: public/cv-AlfaroFernando-Esp.pdf
- Regenerate: public/cv-AlfaroFernando-Eng.pdf

**Interface:** scripts/generate_cvs.py lee el perfil y proyectos compartidos, genera ambas fuentes Markdown y ambos PDFs. Los títulos PDF se construyen con localized.role; el footer debe mantener la misma identidad Software Engineer.

- [ ] **Step 1: Actualizar el footer del generador**

  Confirmar en scripts/generate_cvs.py que el título, rol y footer de los PDFs salen de la identidad Software Engineer; no duplicar un rótulo fijo independiente. Actualizar la fecha de revisión de las fuentes a la fecha de generación.

- [ ] **Step 2: Mantener coherentes las expectativas existentes del generador**

  En scripts/test_generate_cvs.py, reemplazar las aserciones existentes que aceptaban la frase “becario/intern” por expectativas del texto nuevo sobre acompañar a otro desarrollador. No agregar casos ni ejecutar pruebas automatizadas dentro de este trabajo.

- [ ] **Step 3: Regenerar los cuatro artefactos**

  Ejecutar:

  ```powershell
  python scripts/generate_cvs.py
  ```

  Confirmar que se escribieron los dos Markdown y los dos PDF con los nombres existentes.

- [ ] **Step 4: Revisar fuentes y PDFs**

  Abrir ambos Markdown y PDFs. Confirmar que el encabezado y footer dicen Software Engineer, que las dos versiones conservan empleo, formación, tecnologías y contribuciones, y que cada PDF tiene texto seleccionable y no texto cortado.

- [ ] **Step 5: Buscar las etiquetas de nivel en salidas públicas**

  Buscar con límites de palabra Junior, Becario, Trainee, Internship, Intern, Entry-level, Apprentice, Pasante, Practicante y Aprendiz en content/profile.json, content/projects.json, src/locales/locales.js, index.html, public/manifest.json, docs/cv y texto extraído de ambos PDFs. Si la herramienta no puede extraer texto PDF, revisar visualmente encabezados, empleo, proyectos y footer en los dos documentos.

### Task 4: Revisar la integración local de identidad

**Files:**
- Read: src/components/Navbar.jsx
- Read: src/pages/Homepage/Welcome.jsx
- Read: src/components/Footer.jsx
- Read: src/pages/Experience/Experience.jsx

- [ ] **Step 1: Levantar la aplicación local**

  Ejecutar npm run dev -- --host 127.0.0.1 y abrir la URL local informada por Vite.

- [ ] **Step 2: Recorrer las vistas principales en español e inglés**

  Visitar Portada, Experiencia, Catálogo y una ficha. Cambiar idioma en cada vista relevante. Confirmar que Software Engineer aparece como título principal y no quedan etiquetas de nivel en cabecera, empleo o pie.

- [ ] **Step 3: Revisar tema y descargas**

  Cambiar tema claro/oscuro. Abrir ambos enlaces de CV y confirmar que corresponden al idioma seleccionado. Guardar capturas de Portada y Experiencia en ambos idiomas.

## Handoff

Este plan cubre identidad y documentos. El plan complementario de navegación por pantallas cubre el controlador de rueda, las rutas largas, el encabezado, el contacto y las animaciones.
