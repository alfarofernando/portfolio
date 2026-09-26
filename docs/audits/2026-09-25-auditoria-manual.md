# Auditoría manual del portafolio

**Fecha:** 2026-09-25<br>
**URL local:** `http://127.0.0.1:5173/portfolio/`<br>
**Alcance:** auditoria visual/funcional, correcciones locales y publicacion en GitHub Pages; sin cambios de contenido sujetos a confirmacion.

## Recorrido realizado

- Inicio, navegación por anclas, CTA «Ver proyectos» y navegación desde el menú móvil.
- Cambio de tema oscuro/claro y de idioma español/inglés; al terminar se restauraron tema oscuro, idioma español y el tamaño de pantalla original.
- Seis tarjetas de proyecto a la vista; detalle CVGenio, navegación anterior/siguiente de galería, retorno a proyectos, ruta directa y ruta de proyecto inexistente.
- Sobre mí, línea de tiempo y pie de página.
- Vistas de 320×740, 390×844, 768×1024 y 1024×768, además del tamaño inicial del navegador.
- Consola del navegador: sin errores ni advertencias registrados durante esta sesión.

Las capturas se emitieron junto a cada acción en esta conversación. Cuando el primer fotograma coincidió con una transición de navegación o animación, también se capturó el estado estabilizado.

## Hallazgos

| ID | Prioridad | Hallazgo | Evidencia y ubicación |
|---|---|---|---|
| V-01 | Alta | La regla global `p { text-align: justify }` abre huecos entre palabras en móvil. También desalineó el título del estado «Proyecto no encontrado». | Vistas de inicio, experiencia y proyecto inexistente a 320–390 px. `src/index.css:34` |
| V-02 | Alta | El nodo de la línea de tiempo se superpone con los primeros caracteres de cada fecha en móvil. | «Sobre mí» a 320 y 390 px. `src/pages/AboutMe/AboutMe.jsx:43` |
| V-03 | Media | La imagen principal muestra el logo AlfaDev, mientras su alternativa accesible dice «Retrato de Fernando Alfaro». | Hero en escritorio y móvil. `src/pages/Homepage/Welcome.jsx:97`, `src/locales/locales.js:59,302`, `src/assets/profile.webp` |
| V-04 | Media | Las portadas de proyectos se recortan de forma desigual por `object-cover`; en especial, los logos del Portfolio V1 y Portal SGU pierden parte de la imagen. | Tarjetas en la sección Proyectos. `src/pages/Projects/Projects.jsx` |
| C-01 | Alta | CVGenio tiene una imagen real y cinco posiciones de galería: cuatro muestran «Preview pendiente». | Detalle CVGenio y carrusel. `src/pages/Projects/components/Data.jsx:79` |
| C-02 | Media | La descripción de CVGenio publica literalmente `${API_BASE}` en español e inglés. | Detalle CVGenio. `src/locales/locales.js:203,446` |
| C-03 | Por confirmar | CVGenio tiene `link: null`, por lo que no ofrece enlace de repositorio o demo. Confirmar si es intencional antes de completar la ficha. | `src/pages/Projects/components/Data.jsx:61` |
| C-04 | Por confirmar | El pie ofrece CV, GitHub, LinkedIn y WhatsApp, sin correo directo ni formulario. Confirmar si esos canales cubren el contacto esperado. | `src/components/Footer.jsx` |
| T-01 | Verificación de publicación | La ruta directa y el slug inexistente funcionan en Vite local. Antes de publicar, comprobar el acceso directo y la recarga de `/portfolio/Projects/cvgenio` en GitHub Pages, además de los iconos/manifest con base `/portfolio/`. | `vite.config.js` (`base: '/portfolio/'`), `index.html` |
| T-02 | Baja | Vite avisa que `caniuse-lite` tiene 21 meses de antigüedad. Actualizar la base de Browserslist en una tarea de mantenimiento y revisar el lockfile. | Salida del servidor local al iniciar |

## Plan de corrección

### 1. Corregir los problemas visuales de lectura y alineación

1. Quitar la justificación como regla global y dejarla solo en piezas donde se haya elegido deliberadamente. Revisar títulos, tarjetas, CTA, timeline y estados de error en ambos temas e idiomas.
2. Reubicar el nodo de la línea de tiempo fuera del área del texto o reservarle un margen fijo en móvil.
3. Corregir el media del hero: usar un retrato real que coincida con el texto alternativo o describir el logo como logo.
4. Definir el tratamiento de portada por proyecto: conservar logos completos con `object-contain` y encuadrar capturas con `object-cover` y foco configurable.

### 2. Completar y validar el contenido de proyectos

1. Reemplazar las cuatro posiciones vacías de CVGenio por capturas reales o reducir el carrusel a los medios disponibles.
2. Sustituir `${API_BASE}` por una descripción pública comprensible y revisar exactitud técnica en ES/EN.
3. Confirmar si CVGenio puede mostrar una demo o repositorio; si no, ajustar su ficha para que la ausencia de enlace sea intencional.
4. Revisar las seis portadas, las galerías, los textos alternativos y los enlaces externos de cada proyecto.

### 3. Verificar responsive, navegación y publicación

1. Repetir la revisión en 320, 390, 768, 1024 y 1440 px: encabezado, tarjetas, timeline, galería, CTA y pie, en oscuro/claro y ES/EN.
2. Confirmar que menú móvil y desktop, anclas, CTA, detalle/volver, galería y estado inexistente siguen funcionando con teclado y tacto.
3. Probar en la publicación de GitHub Pages la carga directa y la recarga de un detalle; comprobar rutas de PDF, iconos y manifest bajo `/portfolio/`.
4. Confirmar si se agrega correo directo/formulario y revisar que la ficha destaque seis proyectos aunque la métrica diga «7+».

## Criterios de cierre

- Ningún texto del flujo queda con espaciado artificial o cubierto por marcadores a 320–390 px.
- Retrato, texto alternativo y encuadre de las seis tarjetas representan correctamente su contenido.
- Las galerías no presentan espacios de muestra sin completar y las descripciones no exponen variables de plantilla.
- No hay desbordamiento horizontal ni solapamiento en 320, 390, 768, 1024 y 1440 px.
- Las rutas de detalle cargan tanto desde navegación como por acceso directo en el hosting final; enlaces de CV y contacto apuntan al destino esperado.

## Ampliación de segunda pasada — 2026-09-25

### Alcance adicional y comprobaciones

- Abrí las seis fichas: CVGenio, Portafolio V1, AlfaTeam, StorePC, NoteIt y Portal SGU. Revisé títulos, texto, tecnologías, captura principal, cantidad de posiciones y enlaces visibles.
- Galerías encontradas: CVGenio tiene 1 captura y 4 posiciones vacías; Portafolio V1 1; AlfaTeam 12; StorePC 17; NoteIt 10; Portal SGU 7.
- Cambié idioma y tema desde una ficha, probé el menú móvil desde el detalle y seguí su enlace a Proyectos. La navegación volvió a la grilla y cerró el menú.
- Repetí la ficha CVGenio a 390×844 y 320×740. No vi un desbordamiento lateral general, pero los textos de las posiciones vacías se filtran por los bordes del carrusel y se mezclan con la captura activa.
- Los seis detalles cargaron sus imágenes y textos. Los controles de galería respondieron al menos en CVGenio y AlfaTeam; en AlfaTeam seleccioné también la diapositiva 12.
- Las peticiones locales HEAD a los CV español e inglés devolvieron 200 con tipo application/pdf.
- Cada acción del navegador se capturó en pantalla y los estados de transición se volvieron a fotografiar cuando la primera imagen aún no estaba asentada. Las imágenes quedan visibles en esta conversación; no generé archivos de captura dentro del repositorio.
- No modifiqué componentes ni datos del producto.

### Hallazgos nuevos

| ID | Prioridad | Hallazgo | Evidencia y ubicación |
|---|---|---|---|
| V-05 | Alta | En CVGenio a 320 y 390 px aparecen fragmentos del texto de las diapositivas de muestra vecinas por encima de la captura activa. El carrusel deja ver parte de esos paneles y sus mensajes incompletos. | Captura móvil de la ficha CVGenio; `src/pages/Projects/components/ProjectPage.jsx` y estilos de galería en `src/index.css`. |
| V-06 | Media | Las galerías de AlfaTeam (12 imágenes) y StorePC (17) tienen más miniaturas que las que caben en la fila visible del detalle. La fila termina recortada y no muestra una indicación clara para descubrir las restantes. | Capturas completas de AlfaTeam y StorePC; `src/pages/Projects/components/ProjectPage.jsx`, `src/index.css`. |
| C-05 | Alta | Si se cambia a inglés desde una ficha abierta desde una tarjeta, el encabezado y el pie se traducen, pero la descripción del proyecto permanece en español. La ruta conserva el objeto localizado que recibió en `location.state` y no lo vuelve a resolver con el idioma actual. | Cambio ES→EN en AlfaTeam; `src/pages/Projects/components/ProjectPage.jsx`, datos EN en `src/locales/locales.js`. |
| C-06 | Por confirmar | Una captura de AlfaTeam muestra una tarjeta interna de curso llamada «lea» con texto «lea». Confirmar si es dato legítimo de demostración o contenido de prueba; reemplazar la imagen si no debe exhibirse. | Diapositiva 12 de la galería AlfaTeam; recurso en `src/assets/images/AlfaTeam/12.webp`. |
| A-01 | Baja | Con la interfaz en español, los nombres accesibles que expone la galería siguen en inglés («Previous Slide», «Next Slide», «Go to Slide»). | Árbol de accesibilidad de las fichas AlfaTeam, StorePC y Portal SGU. |
| T-03 | Verificación de publicación | Los favicons y el manifiesto usan rutas desde la raíz del dominio, mientras Vite publica el sitio bajo `/portfolio/`; el manifiesto también apunta sus iconos a esa raíz. En GitHub Pages esto puede pedir recursos fuera de la carpeta del proyecto. Es un riesgo inferido por las rutas fuente, pendiente de comprobar en producción. | `index.html`, `public/manifest.json`, `vite.config.js`. |

### Plan ampliado y priorizado

#### Fase 0 — Confirmar contenido antes de preparar recursos

1. Confirmar si CVGenio tendrá una demo o un repositorio público. Si no habrá enlace, mantener esa ausencia deliberadamente y revisar el texto que invita a abrir un repositorio.
2. Confirmar qué capturas de CVGenio están disponibles y si las cuatro posiciones vacías deben eliminarse o completarse.
3. Verificar si el curso «lea» de AlfaTeam corresponde a contenido real que se quiere publicar.
4. Confirmar si «7+ proyectos en producción» describe otros proyectos no incluidos en la grilla actual de seis y si CV/email deben agregarse como canales de contacto.

#### Fase 1 — Arreglar lectura, alineación e imágenes comunes

1. Retirar la justificación aplicada globalmente a todos los párrafos y elegir alineación por componente; revisar hero, tarjetas, detalle, timeline, CTA y estado 404 en ES/EN.
2. Corregir el solapamiento del nodo y las fechas de la timeline a 320–390 px.
3. Alinear el retrato del hero con su texto alternativo: usar el retrato correcto o describir el logo que realmente se muestra.
4. Definir encuadre según tipo de imagen. Mostrar logos completos; ajustar posición y recorte de capturas con contenido. Revisar las seis tarjetas, en especial Portafolio V1 y Portal SGU.

Archivos de referencia: `src/index.css`, `src/pages/AboutMe/AboutMe.jsx`, `src/pages/Homepage/Welcome.jsx`, `src/locales/locales.js`, `src/pages/Projects/Projects.jsx` y `src/pages/Projects/components/Data.jsx`.

#### Fase 2 — Resolver localización y completar fichas

1. En `ProjectPage`, resolver la ficha a partir del slug y del idioma activo en cada render; evitar que el objeto guardado al entrar desde la tarjeta deje texto obsoleto al alternar ES/EN.
2. Corregir la traducción de textos visibles y accesibles en ambos idiomas. Sustituir la variable de entorno impresa literalmente en CVGenio por una explicación pública y legible.
3. Completar la galería CVGenio con capturas autorizadas o reducir sus cinco posiciones a los medios reales.
4. Ajustar el carrusel para que una captura activa no comparta el encuadre con mensajes de diapositivas vecinas. Comprobar especialmente 320, 390 y 768 px.
5. Dar a la fila de miniaturas de 12 y 17 elementos desplazamiento visible y descubrible por ratón, tacto y teclado; la miniatura activa debe permanecer a la vista.
6. Revisar cada recurso, texto alternativo, enlace de repositorio/demo y mensaje de ausencia. Validar el contenido de la captura AlfaTeam 12 antes de reemplazarla.

Archivos de referencia: `src/pages/Projects/components/ProjectPage.jsx`, `src/pages/Projects/components/Data.jsx` y `src/locales/locales.js`.

#### Fase 3 — Teclado, lectores de pantalla y movimiento

1. Localizar los nombres accesibles de navegación de la galería; en español deben anunciar anterior, siguiente y número de diapositiva en español.
2. Recorrer con Tab y Enter el encabezado, las tarjetas, los controles del carrusel, el botón Volver, CTA y enlaces del pie. Mantener un indicador de foco visible en cada control.
3. Confirmar que se puede elegir cada miniatura y avanzar/retroceder sin ratón; revisar los roles de estado que informa la galería.
4. Mantener el menú móvil operable y con foco lógico al abrir, navegar a una sección y cerrar.
5. Revisar contraste de texto, bordes y foco en ambos temas con medición; mantener el comportamiento de movimiento reducido ya previsto por las hojas de estilo.

Archivos de referencia: `src/components/Navbar.jsx`, `src/locales/locales.js`, `src/pages/Projects/components/ProjectPage.jsx` y `src/index.css`.

#### Fase 4 — Responsive y publicación bajo subruta

1. Repetir la grilla, las seis fichas, galerías largas, timeline, CTA y pie a 320, 390, 768, 1024 y 1440 px, con ES/EN y ambos temas. Incluir orientación vertical y revisar el contenido más largo de cada vista.
2. Comprobar por acceso directo y recarga que funcionan `/portfolio/` y cada `/portfolio/Projects/<slug>` en GitHub Pages.
3. Comprobar bajo `/portfolio/` las rutas de imágenes, PDFs, favicon, manifest e iconos PWA. Si quedan en la raíz del dominio, ajustar los enlaces al base de Vite y las rutas dentro del manifiesto.
4. Confirmar el estado 404 para un slug inexistente y revisar solicitudes fallidas/errores del navegador después de recorrer cada ruta.

Archivos de referencia: `index.html`, `public/manifest.json`, `vite.config.js` y las rutas de CV bajo `public/`.

### Criterios adicionales de aceptación

- Un cambio ES/EN actualiza también la descripción y los detalles de la ficha ya abierta, sin navegación adicional ni recarga.
- No se imprime la variable API_BASE ni texto «Preview pendiente» en una posición que parezca una captura terminada; cada imagen visible queda completa y sus miniaturas se pueden alcanzar.
- En 320 y 390 px el carrusel no mezcla textos de diapositivas vecinas con la activa; en todos los tamaños no hay recorte accidental de controles ni scroll horizontal del documento.
- Los nombres accesibles de controles y diapositivas coinciden con el idioma seleccionado; teclado y tacto alcanzan la primera y última diapositiva.
- Los logos de tarjetas no se cortan; el retrato y su alternativa describen el mismo recurso.
- PDFs, iconos, manifest y recursos internos responden desde el prefijo `/portfolio/` en el hosting final, y una recarga de cada ficha conserva la ruta válida.

## Ejecucion del plan - 2026-09-25

### Correcciones implementadas en el checkout local

- V-01 y V-02: quite la justificacion global de parrafos y reserve espacio/alinee los nodos de la linea de tiempo para fechas legibles en movil.
- V-03 y V-04: el hero ahora usa el retrato real; las portadas conservan los logos completos con `object-contain`.
- V-05, V-06, C-01 y A-01: reemplace el carrusel externo por una galeria accesible, traducida, operable con teclado y tacto, con miniaturas desplazables y solo medios existentes. CVGenio queda con 1 captura real y sin marcadores vacios.
- C-02 y C-05: quite `${API_BASE}` de las descripciones y hago que la ficha se resuelva con el idioma activo, incluso en una URL con slug heredado en espanol.
- T-02 y T-03: actualice la base de datos Browserslist; el manifiesto usa rutas relativas para sus iconos y `index.html` construye las rutas bajo `/portfolio/`.
- T-01: agregue la copia `dist/404.html` para el fallback de SPA de GitHub Pages. La comprobacion directa posterior a la publicacion se registra al final de este informe.
- La app respeta la preferencia de movimiento reducido del sistema.

### Verificacion posterior a los cambios

- `npm run build`: aprobado; genero `dist/404.html`. El `index.html` compilado referencia JS/CSS, iconos y manifest bajo `/portfolio/`; los iconos del manifest usan `./`.
- `git diff --check`: aprobado, con avisos informativos de conversion LF/CRLF de Git en Windows.
- Navegacion manual con capturas inline: inicio y retrato, seis tarjetas, timeline, galeria larga (12 y 17 diapositivas), galeria CVGenio, cambio de idioma, ruta heredada y slug inexistente en ES/EN. Se comprobo teclado, seleccion de miniatura y avance/retorno.
- Responsive: 320, 390, 768, 1024 y 1440 px. `documentElement.scrollWidth` igualo `clientWidth` en cada ancho; la grilla cambia de 1 a 2 y 3 columnas en los puntos observados. Tambien se restauro y comprobo el viewport normal de 1920 px.
- Las capturas quedaron visibles junto a las acciones en la conversacion; no se guardaron como archivos del repositorio.
- `npm run lint` sigue fallando por deuda previa en archivos no modificados: validacion de props en `Navbar.jsx`, `LanguageContext.jsx` y `AnimatedContent.jsx`; import React sin uso en `CustomCursor.jsx`; `require`/`module` sin definir en `tailwind.config.js`; ademas de un aviso de Fast Refresh en `LanguageContext.jsx`. La galeria nueva no agrega errores de lint.

### Pendientes de contenido y publicacion

- C-03: el propietario debe confirmar si CVGenio tendra demo/repositorio; se conserva la ausencia de enlace.
- C-04: confirmar si GitHub, LinkedIn y WhatsApp bastan o si se agregara correo/formulario.
- C-06: confirmar si la tarjeta interna «lea» de AlfaTeam es contenido legitimo antes de modificar o sustituir esa captura.
- Revisar con el propietario la metrica «7+ proyectos en produccion» frente a las seis fichas visibles; no altere ese dato.
- T-01/T-03: verificacion remota completada para la portada, el detalle CVGenio, la ruta inexistente, manifest, PDF ES e iconos; quedan cubiertos los casos principales de hosting.

### Publicacion y comprobacion remota - 2026-09-25

- `master` contiene el commit de codigo `7197480`; `gh-pages` publico `dist` en `8a2171a` mediante `npm run deploy`.
- `https://alfarofernando.github.io/portfolio/`, `manifest.json`, PDF ES y los seis recursos de iconos (ICO, PNG, Apple y Android) respondieron HTTP 200.
- La navegacion directa publicada a `/portfolio/Projects/cvgenio` cargo la ficha y su galeria. La ruta directa a `/portfolio/Projects/not-a-project` mostro `Proyecto no encontrado`, confirmando el fallback de SPA.
- Consola del navegador en ambos detalles: sin errores ni avisos.
