# Portfolio screen navigation and animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Make every portfolio route navigate through complete desktop panels, one panel per vertical wheel gesture, with a static header and progressive content entrances.

**Architecture:** A single provider inside BrowserRouter owns panel lookup, wheel normalization, gesture locking, URL hashes and route-position restoration. A reusable ScreenPanel marks each complete section and provides previous/next controls; individual routes divide their existing content without dropping it.

**Tech Stack:** React 18, React Router 7, Framer Motion, CSS and DOM wheel events already available in the project.

**Spec:** [2026-10-20-portfolio-fullscreen-scroll-design.md](../specs/2026-10-20-portfolio-fullscreen-scroll-design.md)

## Global Constraints

- En escritorio, cada bloque de contenido debe caber en una pantalla y un gesto vertical de rueda debe avanzar o retroceder exactamente un bloque.
- La navegación por pantallas se aplica a Inicio, Experiencia, Soluciones, Catálogo, fichas de proyectos y página no encontrada. En móvil y en ventanas bajas el sitio conserva el desplazamiento normal.
- Convertir la barra superior en un encabezado compacto en el flujo del documento. No permanece fija ni pegada al borde al desplazarse.
- Dividir cada ruta larga en paneles completos sin omitir información.
- Añadir animaciones de entrada progresiva a los paneles, tarjetas y bloques relevantes.
- Mantener rutas, idioma, tema, descargas, galerías, filtros, enlaces y datos existentes, salvo la sección eliminada y las etiquetas de posicionamiento indicadas.
- No añadir dependencias para scroll o animación; el proyecto ya usa Framer Motion y eventos de rueda nativos.
- La composición desktop del cierre reúne CTA, enlaces profesionales, CV, disponibilidad y pie legal en un panel final compartido.

## Review Focus

- Un trackpad con cola inercial o un evento delta grande produce un solo movimiento por gesto.
- Un gesto horizontal en la galería, Ctrl+rueda, un control editable o un botón conserva su acción.
- Un hash directo, cambio de idioma, navegación de tarjeta, atrás/adelante y alias AboutMe aterrizan en el panel correcto sin scroll duplicado; Soluciones y 404 también usan paneles.
- Un cambio de tamaño que cruza los límites desktop/móvil activa o desactiva el controlador sin dejar scroll bloqueado.
- prefers-reduced-motion al cargar y al cambiar durante la sesión omite animaciones y desplazamiento suave.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| src/context/ScreenScrollContext.jsx | Control único de eventos, paneles y API de navegación |
| src/components/ScreenPanel.jsx | Sección de pantalla completa, encabezado y controles anterior/siguiente |
| src/App.jsx | Encabezado estático y panel común de contacto/footer |
| src/components/Navbar.jsx | Links de ruta y navegación entre paneles |
| src/router/Router.jsx | Rutas existentes y alias antiguo de AboutMe |
| src/components/RouteEffects.jsx | Metadatos y foco de ruta, sin scroll competidor |
| src/pages/AboutMe/AboutMe.jsx | Sección retirada del producto |
| src/pages/Homepage/PortfolioLanding.jsx | Secuencia de paneles de portada |
| src/pages/Homepage/Welcome.jsx | Presentación adaptada a la altura disponible |
| src/pages/Projects/Projects.jsx | Panel de proyectos destacados |
| src/pages/Experience/components/ExperiencePreview.jsx | Panel de resumen de experiencia |
| src/pages/Experience/Experience.jsx | Grupos completos de experiencia, responsabilidades, casos y formación |
| src/pages/Projects/ProjectCatalog.jsx | Grupos de catálogo con filtros persistentes |
| src/pages/Projects/components/ProjectPage.jsx | Paneles de resumen, aportes, galería y enlaces |
| src/pages/Projects/components/ProjectCard.jsx | Navegación a fichas sin scroll directo |
| src/pages/Projects/components/ProjectGallery.jsx | Galería horizontal que conserva sus gestos |
| src/components/ProjectMedia.jsx | Proporción acotada opcional para imágenes de fichas |
| src/pages/Solutions/Solutions.jsx | Presentación, grupos de servicios y proceso |
| src/components/motion/Reveal.jsx y src/components/motion/motionTokens.js | Entradas progresivas de contenido y tarjetas |
| src/components/SubFooter.jsx y src/components/Footer.jsx | Contenido integrado en un panel final |
| src/locales/locales.js | Nombres ES/EN para contacto, progreso y controles |
| src/index.css | Alturas, límites, foco y fallback responsive |

## Interfaces compartidas

En src/context/ScreenScrollContext.jsx exportar ScreenScrollProvider y useScreenScroll. La API pública que consumen la barra y los paneles es:

```js
const { goToPanel, movePanel, activePanelId, panelIds } = useScreenScroll();
goToPanel('projects');
movePanel(1); // siguiente
movePanel(-1); // anterior
```

En src/components/ScreenPanel.jsx exportar un componente con esta interfaz:

```jsx
<ScreenPanel id="projects" titleId="projects-title">
  <h2 id="projects-title">...</h2>
  {children}
</ScreenPanel>
```

El componente asigna id y data-screen-panel, mantiene orden semántico, y dibuja los controles anterior/siguiente. El provider consulta esos atributos una vez al montar la ruta y al cambiarla; no hace que cada tarjeta registre listeners.

### Task 1: Crear la API común y el panel semántico

**Files:**
- Create: src/context/ScreenScrollContext.jsx
- Create: src/components/ScreenPanel.jsx
- Modify: src/App.jsx
- Modify: src/index.css

**Produces:** ScreenScrollProvider, useScreenScroll y ScreenPanel conforme a las interfaces anteriores.

- [ ] **Step 1: Marcar el contenedor de la aplicación**

  Dentro de BrowserRouter, envolver el contenido de App con ScreenScrollProvider para que Navbar, Router y cierre de contacto compartan una única instancia.

  ```jsx
  <ScreenScrollProvider>
    <Navbar />
    <main><Router /></main>
    <ScreenPanel id="contact">...</ScreenPanel>
  </ScreenScrollProvider>
  ```

- [ ] **Step 2: Implementar ScreenPanel**

  Añadir el atributo data-screen-panel con el id estable, encabezado semántico, contenedor de contenido y botones Anterior/Siguiente que llamen movePanel(-1) y movePanel(1). Ocultar/desactivar el botón sin destino.

- [ ] **Step 3: Implementar elegibilidad y delta normalizado**

  Activar solo con viewport de al menos 1024 px por 700 px y cuando la ruta tenga data-screen-panel. Normalizar deltaMode antes de acumular:

  ```js
  const scale = event.deltaMode === 1
    ? 16
    : event.deltaMode === 2
      ? window.innerHeight
      : 1;
  const deltaY = event.deltaY * scale;
  ```

- [ ] **Step 4: Añadir listener único y limpieza**

  Registrar wheel con passive:false dentro de un solo useEffect. Limpiar el listener y todos los temporizadores al salir de la ruta, desmontar el provider o abandonar el modo desktop. Usar un umbral inicial de 48 px y un periodo de inactividad de 180 ms; ajustar esos valores durante la revisión manual de ratón y trackpad.

- [ ] **Step 5: Dejar intactos gestos y controles ajenos al cambio de panel**

  Ignorar eventos con Ctrl, gestos predominantemente horizontales, y eventos originados en input, textarea, select, botones de rango o contenido contenteditable. Conservar la rueda nativa en esos casos y en cualquier evento sin destino válido. No interceptar teclas de desplazamiento ni mover el foco al avanzar con rueda.

- [ ] **Step 6: Definir movimiento y límites**

  Para panel actual index i, el destino es paneles[i + Math.sign(deltaY)]. Si no existe, no llamar preventDefault. Si existe, prevenir el scroll nativo, activar un solo destino y bloquear nuevos pasos hasta terminar el desplazamiento y la cola de eventos inerciales.

- [ ] **Step 7: Añadir estilos base y fallback**

  Definir la primera pantalla como alto disponible bajo el header estático y las restantes como 100svh. Para ancho menor a 1024 px o alto menor a 700 px, quitar alturas forzadas y permitir flujo natural; nunca añadir overflow-y:auto a un panel.

### Task 2: Centralizar navegación y quitar el bloque «Sobre mí»

**Files:**
- Modify: src/App.jsx
- Modify: src/components/Navbar.jsx
- Modify: src/router/Router.jsx
- Modify: src/components/RouteEffects.jsx
- Delete: src/pages/AboutMe/AboutMe.jsx
- Modify: src/pages/Homepage/PortfolioLanding.jsx
- Modify: src/pages/Projects/components/ProjectCard.jsx
- Modify: src/locales/locales.js

**Consumes:** useScreenScroll.

- [ ] **Step 1: Reemplazar handlers de sección en Navbar**

  Cambiar scrollToSection por goToPanel. Mantener enlaces del router para Experience y Projects/all. El header continúa en flujo normal, sin fixed, sticky, top offsets ni wrapper flotante.

- [ ] **Step 2: Retirar el scroll duplicado de PortfolioLanding**

  Quitar el useEffect que interpreta pathname/hash y los helpers scrollToSection. Mantener el mismo destino usando el provider después de que los paneles estén montados.

- [ ] **Step 3: Limpiar la sección y menú AboutMe**

  Retirar import y render de AboutMe desde PortfolioLanding y quitar el ítem y claves de locales que solo sirven a ese bloque.

- [ ] **Step 4: Preservar la ruta antigua**

  En Router, importar Navigate y hacer que /portfolio/AboutMe redirija a /portfolio/#home con replace. Mantener Home, Projects, Experience, catalog y slug actuales.

- [ ] **Step 5: Unificar efectos de ruta y panel**

  En RouteEffects, retirar el manejo propio de scroll y restauración vertical para que ScreenScrollProvider sea la única autoridad de panel y posición. Mantener la actualización SEO por ruta/idioma y el foco de h1 con preventScroll al navegar por Link; el foco nunca debe lanzar un segundo desplazamiento.

- [ ] **Step 6: Quitar scroll directo de las tarjetas**

  En ProjectCard, retirar window.scrollTo del onClick. Dejar que Router cambie la ruta y que el provider aplique una sola política de panel al montar la ficha.

- [ ] **Step 7: Recorrer aliases y menú**

  En local, abrir Inicio, activar Inicio/Proyectos/Experiencia y verificar que /portfolio/AboutMe llega al panel inicial. Usar atrás/adelante y confirmar que la ruta cambia una sola vez y el foco no se roba al usar rueda.

### Task 3: Reorganizar portada y cierre global

**Files:**
- Modify: src/pages/Homepage/PortfolioLanding.jsx
- Modify: src/pages/Homepage/Welcome.jsx
- Modify: src/pages/Projects/Projects.jsx
- Modify: src/pages/Experience/components/ExperiencePreview.jsx
- Modify: src/components/SubFooter.jsx
- Modify: src/components/Footer.jsx
- Modify: src/App.jsx
- Modify: src/locales/locales.js

**Consumes:** ScreenPanel and useScreenScroll.

- [ ] **Step 1: Definir paneles de portada**

  En PortfolioLanding, ordenar Welcome, una pantalla independiente de tecnologías, Projects y ExperiencePreview en paneles con ids home, technologies, projects y experience; los proyectos destacados pueden continuar en grupos adicionales medidos. Dejar el cierre global como panel contact desde App para que no se duplique en rutas.

  ```jsx
  <ScreenPanel id="home"><Welcome /></ScreenPanel>
  <ScreenPanel id="technologies"><TechCarousel /></ScreenPanel>
  <ScreenPanel id="projects"><Projects /></ScreenPanel>
  <ScreenPanel id="experience"><ExperiencePreview /></ScreenPanel>
  ```

- [ ] **Step 2: Ajustar Welcome y destacados**

  En App, quitar el padding superior excesivo actual de main (`pt-28 md:pt-32`) para que el primer panel comparta la pantalla con el encabezado estático. Reducir solo espaciado decorativo y tamaños que exceden la pantalla. Mantener nombre, rol, resumen factual, estadísticas, retrato, descargas y contacto. Presentar tecnologías en su panel independiente.

- [ ] **Step 3: Compactar paneles de preview**

  En Projects y ExperiencePreview conservar título, descripción, tarjetas destacadas y enlaces. Dividir los proyectos destacados en paneles de dos tarjetas al detectar que tres exceden la altura disponible en 1280×720; no truncar texto.

- [ ] **Step 4: Integrar SubFooter y Footer**

  En App, envolver CTA, contactos, disponibilidad y pie legal en un único ScreenPanel contact. Retirar márgenes externos que suman una pantalla adicional. En móvil, restituir el orden de flujo habitual.

- [ ] **Step 5: Revisar la portada en ambos idiomas y temas**

  Recorrer home, projects, experience y contact con 1366×768 y 1440×900. Confirmar que cada panel completo cabe y que CV, WhatsApp, links y CTA funcionan.

### Task 4: Dividir Experiencia en paneles completos

**Files:**
- Modify: src/pages/Experience/Experience.jsx
- Modify: src/locales/locales.js
- Read: content/profile.json

- [ ] **Step 1: Crear panel de empresa y resumen**

  Envolver periodo, empresa, rol Software Engineer y resumen en un ScreenPanel experience-intro.

- [ ] **Step 2: Repartir responsabilidades sin omisiones**

  Conservar el orden de profile.copy[language].employment.responsibilities. Agrupar elementos consecutivos para que ningún panel exceda el alto; cada panel tiene un h2 visible y todos los puntos se mantienen.

- [ ] **Step 3: Repartir casos profesionales**

  Agrupar las tarjetas de proyectos profesionales en filas que quepan. Mantener enlaces a catálogo y a cada detalle. Usar ids estables experience-cases-1, experience-cases-2, etc.

- [ ] **Step 4: Presentar formación e inglés**

  Crear panel experience-education con todos los estudios, periodos e idioma inglés. Mantener texto B1 y no reformularlo como nivel superior.

- [ ] **Step 5: Revisar Experience con viewport corto**

  A 1366×768, confirmar que responsabilidades largas y formación no quedan cortadas. A 390×844, confirmar el flujo continuo sin salto forzado.

### Task 5: Dividir el catálogo en grupos y conservar filtros

**Files:**
- Modify: src/pages/Projects/ProjectCatalog.jsx
- Modify: src/pages/Projects/components/ProjectCard.jsx
- Modify: src/locales/locales.js

- [ ] **Step 1: Preparar grupos ordenados**

  Mantener el orden de getProjects y el filtro de categoría actual. En ProjectCatalog.jsx, definir localmente la función chunk(items, size) que agrega items.slice(index, index + size) a grupos contiguos. Comenzar con tres tarjetas por panel en 1280 px o más y dos entre 1024 y 1279 px. Guardar el tamaño en estado, calcularlo al montar y recalcularlo en resize; quitar el listener al desmontar. Si la revisión visual detecta desborde, bajar a un proyecto por panel para ese rango.

  ```js
  const cardsPerPanel = window.innerWidth >= 1280 ? 3 : 2;
  const projectPages = chunk(visibleProjects, cardsPerPanel);
  ```

- [ ] **Step 2: Renderizar panel de introducción y resultados**

  Crear un panel de título/descripción/filtros y un panel por grupo con id projects-page-N. Repetir filtros compactos en cada panel de resultados para que no dependan de una barra fija.

- [ ] **Step 3: Reiniciar grupo al cambiar filtro**

  Cuando cambia la categoría, volver al primer panel de resultados y recalcular grupos desde visibleProjects. Mantener estado accesible con aria-pressed.

- [ ] **Step 4: Conservar la ficha y repositorio**

  Confirmar que cada tarjeta conserva imagen, título, categoría, descripción, tecnologías, enlace al detalle y repositorio disponible.

- [ ] **Step 5: Recorrer todas las categorías**

  En 1280×720 avanzar por los grupos de cada categoría. Confirmar que ningún proyecto falta, los filtros funcionan desde un panel posterior y el cambio a /Projects/:slug abre su pantalla inicial. Tres tarjetas en el catálogo caben a este tamaño; los destacados de Inicio se reducen a dos por pantalla.

### Task 6: Dividir fichas de proyecto sin afectar galerías

**Files:**
- Modify: src/pages/Projects/components/ProjectPage.jsx
- Modify: src/pages/Projects/components/ProjectGallery.jsx
- Modify: src/components/ProjectMedia.jsx
- Modify: src/locales/locales.js

- [ ] **Step 1: Crear panel de resumen**

  Poner categoría, título, media principal, descripción y tecnologías en project-overview. Mantener el enlace de regreso al catálogo. Añadir a ProjectMedia una opción de ajuste que la ficha active explícitamente para usar una relación de aspecto acotada y mostrar la imagen completa; las tarjetas compactas conservan su presentación actual.

- [ ] **Step 2: Separar contexto y rol de aportes y resultados**

  Poner contexto/rol y listas completas de aportes/resultados en bloques consecutivos project-details-1, project-details-2 según altura. Mantener cada texto y su etiqueta.

- [ ] **Step 3: Dar a la galería su panel**

  Renderizar ProjectGallery dentro de project-gallery. Dejar que su interacción horizontal siga respondiendo a flechas y miniaturas; el controlador global ignorará deltaX predominante.

- [ ] **Step 4: Mantener enlaces externos y navegación**

  Crear panel project-links con enlace al repositorio, sitio oficial/demo cuando existan, catálogo y siguiente/anterior proyecto si ya puede derivarse del orden de catálogo.

- [ ] **Step 5: Conservar recuperación de slug inválido**

  Hacer que el estado Proyecto no encontrado ocupe una pantalla con enlace al catálogo y que después pueda alcanzarse el cierre común.

- [ ] **Step 6: Revisar fichas contrastantes**

  Abrir una ficha sin capturas, una con varias capturas y una con listas largas. Recorrer resumen, datos, galería y enlaces sin pérdida de foco ni scroll bloqueado.

### Task 7: Dividir Soluciones y la página no encontrada

**Files:**
- Modify: src/pages/Solutions/Solutions.jsx
- Modify: src/router/Router.jsx
- Read: content/services.json
- Modify: src/locales/locales.js

- [ ] **Step 1: Hacer de la presentación de Soluciones un panel completo**

  Envolver el hero existente en `solutions-overview`; ajustar alturas y márgenes para que comparta el alto disponible bajo el header. Conservar sus enlaces de WhatsApp y Catálogo, textos e ilustración.

- [ ] **Step 2: Agrupar los servicios sin perder evidencia relacionada**

  Dividir los servicios de `content/services.json` en paneles consecutivos según el espacio real (hasta tres tarjetas en >=1280 px y dos entre 1024–1279 px). Mantener título, descripción, beneficio y todos los enlaces a proyectos relacionados en cada tarjeta.

- [ ] **Step 3: Presentar proceso y cierre de contenido**

  Crear paneles separados `solutions-process` y `solutions-closing`. Conservar los tres pasos, título, descripción y enlace al catálogo; evitar repetir el panel global de contacto.

- [ ] **Step 4: Dar una pantalla a la ruta no encontrada**

  Envolver el mensaje 404 y el enlace al Inicio en un ScreenPanel identificado. Después sigue el cierre global común desde App.

- [ ] **Step 5: Recorrer Soluciones en ambos idiomas**

  En 1280×720, avanzar desde hero por servicios, proceso y cierre. Confirmar que todas las tarjetas y referencias a proyectos aparecen y sus enlaces navegan al panel inicial correcto. La revisión adicional del Inicio se hizo a 1366×768.

### Task 8: Aplicar animación progresiva y movimiento reducido

**Files:**
- Modify: src/components/motion/Reveal.jsx
- Modify: src/components/motion/motionTokens.js
- Modify: src/pages/Projects/components/ProjectCard.jsx
- Modify: src/pages/Projects/ProjectCatalog.jsx
- Modify: src/pages/Projects/components/ProjectPage.jsx
- Modify: src/pages/Experience/Experience.jsx
- Modify: src/pages/Solutions/Solutions.jsx
- Modify: src/index.css

- [ ] **Step 1: Ajustar la velocidad y distancia de entrada compartidas**

  Ajustar el wrapper Reveal existente para entradas de opacity 0→1 y y 16→0, duration 0.5 s y delay de 0.09 s entre tarjetas/bloques. Mantener viewport.once para que un gesto de rueda no reinicie varias veces el mismo bloque.

  ```js
  const reveal = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  ```

- [ ] **Step 2: Aplicar Reveal a los grupos de contenido**

  Asegurar que encabezados, tarjetas, responsabilidades y bloques de detalle entren al hacerse visibles, con retrasos cortos y acotados. Aprovechar el wrapper compartido en vez de crear listeners de scroll por componente.

- [ ] **Step 3: Aplicar prefers-reduced-motion**

  Consultar useReducedMotion o el valor de MotionConfig existente. Cuando está activo, quitar desplazamiento y stagger, y cambiar el panel de inmediato. Escuchar cambios de preferencia durante la sesión.

- [ ] **Step 4: Revisar la secuencia**

  Avanzar y retroceder por landing, experiencia, soluciones, catálogo y fichas. Confirmar que tarjetas y bloques aparecen de forma progresiva a velocidad moderada y que botones y enlaces son visibles durante el movimiento.

### Task 9: Consolidar rutas, responsive y revisión visual

**Files:**
- Modify: src/context/ScreenScrollContext.jsx
- Modify: src/App.jsx
- Modify: src/router/Router.jsx
- Modify: src/components/RouteEffects.jsx
- Modify: src/index.css

- [ ] **Step 1: Completar hashes y ubicación**

  Resolver hashes reconocidos al entrar. Al cambiar de panel, usar replaceState con el hash del panel, no agregar entradas de historia. Conservar el objeto de estado que React Router mantiene en history.state al reemplazar URL. Guardar panel por location.key y restaurarlo en POP; cambiar idioma o tema no reinicia la ubicación.

- [ ] **Step 2: Verificar transiciones de breakpoint**

  Redimensionar entre 1024×700 y 1023×699 durante una ruta. Confirmar que el listener y bloqueo se limpian al desactivar paneles y que la página no conserva offsets. Se verificó el flujo natural en 390×844 y 768×1024 y el encaje desktop en 1280×720 y 1366×768; no se verificó el cruce exacto del umbral 1024×700.

- [ ] **Step 3: Recorrer todas las rutas con rueda y controles**

  Probar Inicio, Experiencia, Soluciones, grupos de Catálogo, una ficha sin capturas, una con galería, slug inexistente y ruta 404. Usar rueda y controles Anterior/Siguiente. La rueda manual avanzó un panel por gesto en Catálogo y la ficha StorePC; se revisaron también Inicio, Soluciones y 404.

- [ ] **Step 4: Recorrer idioma, tema, teclado y rutas**

  Probar ES/EN, claro/oscuro, links de menú, anchors, recarga directa, atrás/adelante y ruta antigua AboutMe. Confirmar el destino correcto y foco visible.

- [ ] **Step 5: Recorrer movimiento reducido y móvil**

  Revisar en 390×844 y 768×1024 que el scroll sea natural, las galerías mantengan interacción y el footer siga accesible. El comportamiento de movimiento reducido se inspeccionó en implementación, pero no se emuló con una preferencia del sistema durante este recorrido.

- [ ] **Step 6: Cerrar el recorrido con capturas**

  Levantar Vite en http://127.0.0.1:5173/portfolio/. Revisar capturas representativas de Portada, Experiencia, Soluciones, Catálogo y ficha a 1280×720/1366×768 y 390×844, registrando idioma, tema y panel. Las imágenes fueron inspeccionadas en el navegador; la herramienta de captura no ofrece una ruta de archivo para persistirlas en artifacts.local/qa/2026-10-20/.

- [ ] **Step 7: Revisar build y lint**

  Ejecutar npm run build y npm run lint. Corregir los errores que pertenezcan a los archivos modificados y guardar el resultado de cada comando en el informe de revisión. El lint completo puede señalar errores preexistentes fuera del cambio; ejecutar ESLint dirigido sobre los archivos modificados.

## Execution Handoff

Las tareas 1–3 de este plan comparten la API del coordinador; las tareas 4–8 construyen sobre ScreenPanel y pueden revisarse por ruta, y Task 9 reúne las interacciones del sitio. El plan de identidad/CV es independiente. Se recomienda ejecución nativa en una secuencia para mantener estables los contratos de navegación compartida.
