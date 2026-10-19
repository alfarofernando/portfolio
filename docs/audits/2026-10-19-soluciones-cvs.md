# Revisión local de identidad, Soluciones, movimiento y CV

## Base de ejecución

- Fecha de referencia: 19/10/2026.
- Rama aislada: `codex/portfolio-software-engineer-soluciones`, iniciada desde `111b22d`.
- Worktree: `C:/Users/Ferny/.codex/worktrees/portfolio-software-engineer-soluciones/portfolio-v.2`.
- Runtime: Node 22.23.3, npm 10.9.9, Python 3.12.14 (runtime de Codex).
- El repo no contiene un `AGENTS.md`; las instrucciones globales aplicables estaban vacías.
- `npm ci` no produjo salida ni completó después de ~60 s y se interrumpió. Para el trabajo local se enlazó `node_modules` al árbol íntegro del checkout, cuyo `HEAD` y lockfile coinciden. El árbol parcial de instalación se guardó como `node_modules.incomplete` para retirarlo tras verificar.

## Línea base antes de los cambios de producto

- `npm run build`: pasó desde el worktree; Vite 6.0.4 transformó 469 módulos. Generó el sitio base `/portfolio/`, incluyendo `dist/404.html`.
- `npm run lint`: no entregó resultado después de más de dos minutos; se interrumpió. La corrida con `--ignore-pattern node_modules/**` también quedó sin salida y se interrumpió. Por eso lint queda inconcluso en la línea base y no se atribuye un fallo a los archivos del proyecto.
- `GET http://127.0.0.1:5173/portfolio/`: HTTP 200. Captura con el navegador Codex a 1280 × 720; la portada y la navegación accesible renderizaron.
- Recorrido directo de `/portfolio/Experience` y `/portfolio/Projects/wise-capital`: ambas rutas montaron contenido, responsabilidades, contribuciones y enlaces.
- Estado medido en la portada: 4092 px de alto, scroll inicial de 88 px, siete imágenes (seis lazy), ninguna rota y diez `data-parallax-media` sin respuesta visible en la posición inicial. El título aún decía «Desarrollador Full Stack Junior» y no existía acceso a Soluciones ni botón flotante de WhatsApp.
- El parallax se apoyaba en fondos animados por tiempo y marcas de contenido; la primera captura mostraba puntos y brillos, pero por sí sola no permite medir suavidad ni profundidad ligada al scroll.
- Los errores de consola observados procedían de una extensión del navegador; no se atribuyen al sitio.

## Evidencia visual

Las capturas de portada, Experiencia y el caso Wise Capital se tomaron y revisaron en el navegador local durante la ejecución. El API de navegador disponible devuelve imágenes para inspección, pero no ofrece una ruta para guardarlas desde esta sesión; por ello no hay PNG versionables en esta carpeta. El recorrido final queda documentado por URL, viewport, estado accesible y revisión visual directa.

## Resultado final

Implementación terminada en la rama local `codex/portfolio-software-engineer-soluciones`; no se publicó el sitio.

### Cambios entregados

- Identidad y metadatos de perfil/portfolio expresan **Software Engineer** en español e inglés. Se conservan los nombres históricos de puestos y cursos.
- Nueva página `/portfolio/Solutions` con cinco servicios bilingües, enlaces a evidencia del catálogo, proceso de trabajo, CTA comercial al pie e ilustraciones SVG originales. El acceso a Soluciones aparece en la navegación; WhatsApp queda fijo, accesible y usa un único mensaje localizado.
- Las entradas animadas usan tokens compartidos, duración breve y respeto por movimiento reducido. El parallax usa progreso local de scroll y tres distancias acotadas; ya no depende del movimiento aleatorio por tiempo que no respondía al desplazamiento.
- La navegación coordina scroll, foco, título/meta y `aria-current`; el menú móvil cierra con Escape y devuelve el foco.
- Los dos CV contienen los 19 proyectos del catálogo, con tres contribuciones y dos resultados por proyecto, más perfil, responsabilidades, tecnologías, skills, formación, nivel de idioma y enlaces. Cada PDF tiene seis páginas A4.

### Verificación final

- `npm run build`: pasó con Vite 6.0.4, 482 módulos y base `/portfolio/`. El bundle JS principal es 423.36 KB (136.90 KB gzip).
- `node --test tests/contact.test.mjs tests/services.test.mjs tests/motion.test.mjs tests/navigation.test.mjs`: 9/9 pasaron, incluida la normalización de mayúsculas y barras finales.
- `python -m unittest scripts.test_generate_cvs`: 7/7 pasaron después de regenerar los dos Markdown, ambos PDF y la matriz de fuentes. Incluye comprobación de las salidas extraídas, links PDF, fallo de traducción, omisión intermedia, fallo de generación y rollback de cinco destinos.
- ESLint dirigido a los archivos JS/JSX del cambio y `tests`: pasó. La corrida global `npm run lint` de la línea base no entregó resultado tras más de dos minutos; no se presenta como suite global aprobada.
- `git diff --check`: sin errores de whitespace tras corregir el final de CSS.
- Preview local: la portada, `/Solutions`, `/Experience` y `/Projects/wise-capital` y ambos PDF respondieron HTTP 200. `dist/404.html` existe; el preview usa fallback de la SPA. No se hizo comprobación en hosting público.
- En el navegador a 360, 390, 768, 1024 y 1440 px, `document.documentElement.scrollWidth` no excedió `innerWidth`; hero y WhatsApp siguieron visibles. Se comprobó Soluciones → Wise Capital → atrás (scroll restaurado a 1441 px), URL inicial `#projects` (sección alcanzada), recuperación de proyecto inexistente, `aria-current`, menú Escape y cambios ES/EN y de tema manteniendo foco/scroll. La ruta `/Solutions/` también fue verificada y su CTA al pie conduce al catálogo, igual que `/Solutions`.
- Los links de WhatsApp en ambos idiomas conservan el mismo destinatario y un solo parámetro `text`. Se validó el destino local; no se abrió WhatsApp ni se envió un mensaje.
- Las capas de parallax tuvieron una respuesta reversible al scroll, con amplitudes distintas; el texto y el CTA permanecen estables. Las pruebas de lógica también comprueban límites y direcciones del desplazamiento.
- Los CV finales se extrajeron y renderizaron para revisión visual de sus seis páginas por idioma. Renders: `artifacts.local/qa/2026-10-19/cv-es-final-{1..6}.png` y `cv-en-final-{1..6}.png`. La matriz [cv-coverage.md](../cv/cv-coverage.md) registra fuentes, fecha de revisión y SHA-256.

### Límites de evidencia

El navegador Codex permitió revisar las capturas del sitio en vivo, pero no exportarlas a una ruta local; por eso no hay PNG del sitio versionados. Tampoco se simuló una imagen lenta/fallida, el cambio de preferencia de movimiento reducido en vivo ni zoom exacto al 200 %. La matriz del plan identifica esos casos. Las cinco anchuras responsive y el menú móvil sí se comprobaron directamente.
