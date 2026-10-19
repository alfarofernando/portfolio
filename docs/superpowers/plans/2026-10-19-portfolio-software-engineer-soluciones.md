# Plan de implementación: Software Engineer, soluciones y CV maestros

Estado: implementación terminada en la rama local `codex/portfolio-software-engineer-soluciones`. Build, pruebas focalizadas, CV y recorrido de preview verificados el 19/10/2026. La matriz al final distingue lo comprobado de las pruebas manuales que la herramienta no permitió completar. No se publicó el sitio.

> Ejecución: las etapas se completaron en el orden numerado en una rama aislada. Esta revisión conserva decisiones, evidencia y límites del trabajo para que el resultado sea verificable; no incluye publicación.

**Objetivo:** presentar a Fernando Alfaro como Software Engineer, ofrecer soluciones tecnológicas mediante una nueva pestaña y el pie del sitio, incorporar WhatsApp, entregar dos CV exhaustivos y mejorar el movimiento y el parallax.

**Arquitectura aplicada:** extender la aplicación con identidad/contacto compartidos, contenido comercial ES/EN y escenas de profundidad vinculadas al scroll. Generar los CV desde perfil, skills y los 19 proyectos existentes, con validación de salida y matriz de cobertura, sin duplicar el catálogo en un segundo modelo.

**Tecnologías:** React 18, React Router, Vite, Tailwind, Framer Motion y Python/ReportLab. Las pruebas de lógica usarán Node y unittest; no se añadirá un framework de UI para comprobar marcado.

**Referencia de alcance:** pedidos del usuario en este chat. Se propone que los dos CV sean español e inglés, siguiendo los archivos existentes. Los cargos históricos, las fechas y los títulos académicos conservarán su significado real.

## 1. Decisiones y cobertura del pedido

| Pedido | Entrega | Etapas |
|---|---|---|
| Software Engineer en todos lados | Marca, portada, presentación, SEO y títulos/pies de ambos CV coherentes | 1, 6, 8 |
| Nueva pestaña y venta de soluciones al pie | `/portfolio/Solutions`, navegación ES/EN y cierre comercial global único | 3, 4 |
| Assets que atraigan clientes | Una ilustración principal y tres apoyos gráficos originales | 5 |
| Globito de WhatsApp | Contacto fijo en todas las rutas, compartido con la landing y el pie | 1, 4 |
| Dos CV con toda la experiencia | PDF ES/EN, fuentes editables y matriz de cobertura de hechos | 1, 6 |
| Animaciones delicadas en todo el sitio | Entradas y microinteracciones coherentes en las áreas principales | 2, 7 |
| Mejorar el parallax fallido | Dos escenas vinculadas al scroll, con capas deterministas | 2, 5, 7 |

Se mantiene la portada profesional y se suma la entrada comercial. La landing tendrá lenguaje de negocio y evidencia real; no se reorganizará todo el sitio alrededor de la venta de servicios.

Los CV serán maestros de varias páginas, sin límite artificial de una o dos. La completitud se comprobará contra la fuente maestra y los proyectos adicionales respaldados del catálogo. No se convertirán indicaciones para buscar empleo ni repeticiones del inventario en experiencia adicional.

## 2. Base inspeccionada y límites de evidencia

- El sitio tiene ES/EN, claro/oscuro, portada, Experiencia, catálogo y detalles de proyectos.
- La identidad está repetida en `content/profile.json`, locales heredados/efectivos e `index.html`. El generador PDF también tiene un título independiente en `draw_footer()`.
- Los dos CV existen en `public/`, con fuentes en `docs/cv/` y generador `scripts/generate_cvs.py`. Tanto Markdown como PDF usan solamente `contributions[0]` por proyecto.
- Hay 19 casos en el catálogo y cuatro excluidos actualmente de CV: `portfolio-v1`, `alfateam`, `storepc`, `noteit`. `cvInclude` es una decisión editorial antigua, no una prueba de que esos proyectos deban faltar en un CV exhaustivo.
- Fuente maestra: `C:/Users/Ferny/Downloads/Fernando_Alfaro_Experiencia_Tecnica_Completa.md`, con consolidación declarada el 06/10/2026. Las experiencias posteriores requieren evidencia adicional antes de incorporarlas.
- Contacto configurado: `https://wa.me/5491152606455`. Perfil y locales tienen copias que deben unificarse.
- `src/main.jsx` ya tiene `MotionConfig reducedMotion="user"`. No se creará otro proveedor equivalente.
- `src/App.jsx` espera ventana, fuentes e imágenes no diferidas, agrega 500 ms y tiene un timeout de 28 s. Son valores del código; aún no se ha medido el comportamiento en navegador para esta implementación.
- El parallax descarta `mediaParallax` y `mutationSections`, no actualiza las variables CSS de desplazamiento y deja sin consumidor los atributos `data-parallax-media`. Crea 118 elementos aleatorios con recorridos por tiempo. La regla de movimiento reducido deja animaciones activas en wrappers.
- `App` actualiza SEO por idioma; Navbar, PortfolioLanding y algunas tarjetas realizan scroll por separado. El nuevo manejo por ruta debe reemplazar esos responsables superpuestos.
- Vite usa base `/portfolio/` y genera `404.html` para GitHub Pages. Preview local no reproduce por completo el hosting público ni confirma su publicación.

## 3. Reglas de implementación

- Identidad y contacto proceden de `content/profile.json`. Mantener `profile.copy.es.role` y `profile.copy.en.role` en `Software Engineer`. Los locales consumen ese título; `index.html` se valida aparte por ser HTML estático.
- Los servicios viven en `content/services.json`. El CV reutiliza `content/profile.json`, `content/skills.json` y `content/projects.json`; `docs/cv/cv-coverage.md` registra cobertura y hashes. El navegador no importa la matriz ni agrega el inventario completo al bundle.
- Conservar rutas, galerías, enlaces profesionales, ambas descargas y contenido respaldado. Wise Capital/gFondos seguirá siendo un caso consolidado; productos de NetOne no se presentarán como empleadores separados.
- Mantener inglés B1/Intermediate y distinguir experiencia productiva, trabajo puntual y formación. No crear seniority, métricas ni responsabilidades no respaldadas.
- Reutilizar `SubFooter` para el único cierre comercial global. No agregar un segundo bloque equivalente al final de Soluciones.
- No sumar formularios sin backend, testimonios ficticios, precios ni compromisos de entrega/soporte no acordados.
- No agregar dependencias que dupliquen capacidades existentes. No ampliar el refactor a áreas que no sirven a este pedido.
- Preservar cambios existentes y registrar baseline antes de editar. Las casillas se completarán con evidencia durante la ejecución.
- No ejecutar deploy ni push como parte de esta preparación o de la validación local.

## 4. Mapa de responsabilidades

| Archivo | Responsabilidad |
|---|---|
| `content/profile.json`, `src/locales/locales.js`, `index.html` | Identidad, contacto y copia localizada existente |
| `content/services.json` | Cinco ofertas con `id`, `copy.es`, `copy.en`, `evidenceProjectIds` |
| `src/utils/contact.js` | URL de WhatsApp pura, sin dependencias del DOM o imports de JSON |
| `src/components/RouteEffects.jsx` | Único responsable de SEO y política de foco/scroll por navegación |
| `src/components/motion/Reveal.jsx`, `src/components/motion/motionTokens.js` | Entradas y tiempos compartidos |
| `src/components/motion/ParallaxScene.jsx` | Progreso local y capas decorativas del parallax |
| `src/components/ParallaxBackground/` | Fondo global simplificado, sin partículas ni controlador de scroll duplicado |
| `src/pages/Solutions/Solutions.jsx` | Landing comercial |
| `src/components/WhatsAppButton.jsx` | Botón fijo, accesible y adaptado a móvil |
| `content/profile.json`, `content/skills.json`, `content/projects.json`, `docs/cv/cv-coverage.md` | Hechos fuente y validación de cobertura para CV |
| `scripts/generate_cvs.py`, `scripts/test_generate_cvs.py` | Generación y pruebas del contenido/documentos |
| `tests/contact.test.mjs`, `tests/services.test.mjs` | Lógica de contacto e integridad de referencias comerciales |
| `docs/audits/2026-10-19-soluciones-cvs.md` | Resultados, capturas, recorrido visual, límites de validación y rutas de evidencia |

Los nombres nuevos son contratos propuestos, no archivos ya existentes. Los componentes se extraerán solo cuando tengan una responsabilidad propia; no se crearán capas adicionales por cada bloque de texto. En cada etapa: reproducir o fijar primero el comportamiento que se cambia, implementar, ejecutar su aceptación y registrar el resultado antes de avanzar. Las pruebas automatizadas se reservan para lógica y generación; el acabado visual se comprueba en la aplicación.

## Etapa 0 — Línea base y preparación

Depende de: nada. Entrega: estado previo y herramientas verificadas.

- [x] Leer instrucciones `AGENTS.md` aplicables, registrar rama y `git status --short`, y preservar trabajo previo. Resolver aislamiento con `using-git-worktrees` al comenzar la implementación.
- [x] Ejecutar `npm run build` y `npm run lint` antes de cambios; registrar salidas y códigos de retorno. El paquete actual no declara un script de tests.
- [x] Levantar `npm run dev -- --host 127.0.0.1`, registrar URL efectiva y capturas de Inicio, Experiencia, catálogo, detalle, navegación, pie y descargas actuales.
- [x] Medir carga visible y recursos nuevos/previos con caché deshabilitada en el mismo viewport/equipo. Reproducir imagen lenta/fallida y scroll del fondo actual, registrando diferencias entre animación por tiempo y por desplazamiento.
- [x] Al iniciar artefactos, leer habilidades PDF e imagen aplicables y localizar runtime/librerías con `load_workspace_dependencies`. Registrar el ejecutable Python efectivo y herramientas de extracción/renderizado; no instalar herramientas sin comprobar las disponibles.

Aceptación: baseline real en el informe; ningún fallo se etiqueta como preexistente sin comparación.

## Etapa 1 — Identidad, contacto y fuentes de contenido

Depende de: 0. Entrega: datos que consumirán las etapas siguientes.

- [x] Usar `Software Engineer` en perfil ES/EN y sustituir sobrescrituras de marca, hero, presentación y SEO. Conservar nombres reales de cargos históricos/cursos. Incluir el pie PDF entre los consumidores; los documentos se regeneran en la etapa 6.
- [x] Crear `getWhatsAppUrl(whatsappUrl, language = 'es')`: usar `new URL(whatsappUrl)` y `searchParams.set('text', mensaje)`, con fallback de idioma a español. Mensajes: ES «Hola Fernando, me gustaría conversar sobre una solución tecnológica para mi negocio.»; EN «Hi Fernando, I'd like to discuss a technology solution for my business.».
- [x] Pasar siempre `profile.links.whatsapp` desde los consumidores y retirar copias operativas del número en locales. El email para enlaces `mailto:` también procede del perfil.
- [x] Definir los cinco servicios: sitios/landing pages, sistemas a medida, APIs/integraciones, automatización de procesos y mantenimiento/mejoras. Cada entrada tiene título, descripción y beneficio ES/EN, con referencias a casos existentes por `evidenceProjectIds`.
- [x] Identificar hechos de experiencia y referencias de fuente antes de resumirlos: perfil, skills y 19 proyectos del catálogo; contrastar el inventario técnico canónico para acotar las afirmaciones y los casos complementarios. La cobertura se verifica contra texto extraído de las cuatro salidas, incluidos todos los aportes y resultados.
- [x] Registrar nombre, fecha de revisión y SHA-256 de los archivos fuente en la matriz generada. Si cambia una fuente antes de la entrega, revisar los hechos afectados. El hash identifica la versión revisada; no sustituye leer ni comprobar su contenido.
- [x] Crear pruebas focalizadas de contacto y referencias de servicios antes de consumirlos en UI. Ejecutar `node --test tests/contact.test.mjs tests/services.test.mjs`; configurar globals Node solo para esos archivos en ESLint si es necesario.

Aceptación: un destinatario compartido, todos los servicios traducidos y referencias válidas, sin actualizar a mano Markdown/PDF generados.

## Etapa 2 — Movimiento, carga inicial y parallax

Depende de: 0–1. Entrega: reglas y componentes reutilizables antes de construir Soluciones.

- [x] Crear tokens de entrada de 300–450 ms, desplazamiento de 8–16 px y microinteracciones de 150–200 ms. `Reveal({ children, className, delay = 0 })` anima una sola vez al entrar en pantalla. La suma de duración y retrasos de cada secuencia no superará 600 ms.
- [x] Reutilizar MotionConfig y `useReducedMotion`: quitar desplazamientos, retrasos escalonados y scroll suave bajo movimiento reducido, también al cambiar la preferencia con la página abierta.
- [x] Sustituir la espera global de imágenes/fuentes y la demora fija por contenido renderizable de inmediato, con espacio reservado para medios y estados locales de carga/error cuando hagan falta. Evitar mantener scroll y contacto bloqueados por recursos no críticos. No quitar recuperación de errores al retirar la espera decorativa.
- [x] Retirar conjuntamente el estado `isBootLoading`, su overlay, temporizadores/listeners y el efecto que escribe `document.body.style.overflow` cuando dejen de ser necesarios. Mantener `aria-busy` solo en la región que realmente esté cargando; comprobar que ninguna limpieza tardía cambie el scroll o el estado de la página nueva.
- [x] Simplificar el fondo global a una composición estática de la paleta existente. Retirar generadores aleatorios, keyframes, variables y props sin uso; eliminar los atributos `data-parallax-media` abandonados.
- [x] Implementar `ParallaxScene({ children, layers, className })`: cada capa `{ id, content, distance }` comparte progreso local `useScroll` con offsets `['start end', 'end start']`; `useTransform` convierte progreso 0–1 en `-distance` a `distance`. Colocar los hooks de cada capa en un componente hijo estable, no dentro de un bucle de hooks en el padre.
- [x] Empezar con amplitudes 8/16/28 px en escritorio y 0/4/8 px hasta 768 px. El ajuste visual podrá subir hasta 48 px en escritorio. Cubrir con margen gráfico el desplazamiento máximo para no mostrar bordes vacíos.
- [x] Reservar tres planos: halo/trama, formas intermedias e ilustración. Usar posiciones deterministas. Las decoraciones quedan `aria-hidden` y sin interacción; texto y acciones conservan flujo y coordenadas estables.
- [x] Una sola capa controla cada `transform`; separar parallax y entrada en nodos distintos. Limitar el recorte a la decoración, sin recortar foco ni contenido. Mantener navegación y WhatsApp fuera de ancestros transformados.
- [x] Con movimiento reducido, fijar las capas a su posición neutral y desactivar animaciones de wrappers e interiores. Mantener la limpieza del listener de breakpoint y usar MotionValue para el scroll, sin actualizar estado React por cada píxel. El cambio en vivo de preferencia queda como comprobación manual pendiente.

Aceptación: una escena de Inicio responde al scroll y revierte al volver; en reposo no deriva. Probar dos posiciones realmente alcanzables del hero y ajustar hasta que la diferencia de planos sea perceptible en el recorrido manual. Guardar capturas comparables y desplazamientos observados; añadir un clip si hay grabación disponible. Las capturas solas no demuestran suavidad y la falta de grabador no bloquea la validación manual. Con preferencia reducida queda inmóvil.

## Etapa 3 — Navegación, SEO y comportamiento por ruta

Depende de: 1–2. Entrega: recorrido consistente al añadir una página nueva.

- [x] Preparar los enlaces y efectos compartidos para admitir `/portfolio/Solutions`, manteniendo aliases actuales de Inicio, proyectos y Sobre mí, ruta de Experiencia y catálogo/detalles. Conectar la ruta y su entrada visible junto con el componente real en etapa 4; esta etapa debe compilar sin importar un archivo futuro.
- [x] Crear `RouteEffects` con `useLocation` y `useNavigationType`, leyendo el idioma del contexto. Las rutas actuales son síncronas: ubicarlo en el contenido confirmado por el commit de React y resolver encabezados/secciones sobre ese DOM. No inventar una prop de disponibilidad sin productor; si posteriormente se justifica cargar una ruta de forma diferida, su boundary debe confirmar que se montó antes de actuar. Centralizar metadatos y política de navegación, retirando efectos equivalentes de App/PortfolioLanding y scroll directo de tarjetas.
- [x] Para PUSH/REPLACE sin hash, ir al inicio y enfocar el H1 con `preventScroll`; si una vista de recuperación no tiene encabezado, enfocar el contenedor principal con `tabIndex=-1`. Para hash, ir a la sección y enfocar su encabezado. Para POP, restaurar la posición guardada por `location.key` sin forzar foco ni volver al inicio. Cambiar idioma/tema no debe reiniciar scroll ni robar foco.
- [x] Distinguir primer ingreso de POP con historial guardado: una URL directa con hash debe llegar a su sección aunque `useNavigationType` informe POP. En regreso con posición conocida, esa posición prevalece sobre el hash; sin posición conocida, usar el destino de URL/alias y finalmente el inicio. Registrar posiciones al salir y mantener un único responsable: si se usa `history.scrollRestoration='manual'`, conservar el valor anterior y restaurarlo al desmontar. No alternar restauración propia y nativa en el mismo recorrido.
- [x] Al activar de nuevo el enlace de la sección actual, volver a su encabezado aunque el hash no cambie, mediante la misma acción compartida de navegación. Probar regreso al catálogo después de abrir un detalle y regreso desde un enlace externo, conservando filtros y scroll existentes cuando los haya.
- [x] Usar una única variable CSS para la separación con navbar fija mediante `scroll-margin-top`, eliminando offsets divergentes. Tratar sección desconocida con retorno a Inicio y caso inexistente con la vista de recuperación existente.
- [x] Actualizar título, descripción y Open Graph en cada cambio relevante de ruta/idioma sin dos efectos compitiendo. `index.html` conserva metadatos generales iniciales coherentes; no prometer previews sociales por ruta sin prerenderizado.
- [x] Usar links para navegación y botones para acciones. Marcar página activa con `aria-current="page"` y ubicación de sección con `aria-current="location"`. Menú con `aria-expanded`, `aria-controls`, cierre al navegar y retorno de foco al disparador al cerrar con Escape.
- [x] Adaptar el breakpoint del menú según espacio real, incluido EN y zoom. Mantener navbar, pie y WhatsApp montados al cambiar de ruta; las transiciones afectan solamente al contenido.

Aceptación: las rutas actuales, recarga, aliases, atrás/adelante y cambio de idioma conservan el destino, foco y posición esperados. Una ruta no puede sobrescribir el SEO de otra. Repetir estos casos desde Soluciones al conectarla en etapa 4.

## Etapa 4 — Landing, pie comercial y WhatsApp

Depende de: 1–3. Entrega: recorrido comercial funcional con recursos provisionales solo durante el desarrollo.

- [x] Construir Soluciones y conectar `/portfolio/Solutions` y su entrada Soluciones/Solutions en Navbar. Usar un H1 que presente el beneficio del software, bajada concreta y CTA a WhatsApp y al catálogo. Completar traducción inglesa equivalente y repetir desde aquí la aceptación de navegación de etapa 3.
- [x] Mostrar los cinco servicios con problemas/beneficios concretos. Añadir casos existentes, aclarando contribuciones en empresas y productos propios. Presentar proceso: entender necesidad, definir alcance, construir/validar y entregar/acompañar según acuerdo.
- [x] Reutilizar el cierre global de SubFooter: «¿Tenés una idea o un proceso que querés mejorar?», WhatsApp, correo y acceso a Soluciones donde aporte. Conservar acceso a experiencia, ambos CV y redes profesionales en Footer; evitar CTA de Soluciones que navegue a sí misma.
- [x] Integrar ParallaxScene en los heroes de Inicio y Soluciones. El pie y las fichas de servicios permanecen estables; reciben microinteracciones o Reveal según corresponda.
- [x] Montar WhatsApp en App fuera del fondo/escenas transformadas: área táctil mínima 44 × 44 px, safe area inferior, nombre accesible ES/EN, foco visible y tooltip accesible con teclado. No pulsar permanentemente.
- [x] Verificar todas las rutas, pie y hero con la misma utilidad de contacto; texto codificado una sola vez, apertura útil en escritorio/móvil y ningún envío automático. Respetar overlays realmente usados por el sitio, sin crear un gestor de modales nuevo para este pedido.
- [x] Mantener la landing como página sencilla. No introducir code splitting ni un error boundary nuevo solo por anticipación: comprobar el bundle y separar la ruta con carga/error locales únicamente si la medición justifica el cambio.

Aceptación: un cliente entiende qué puede contratar, ve trabajo real y llega al contacto desde la landing o cualquier página; quedan dos entradas reconocibles, profesional y comercial.

## Etapa 5 — Assets e integración visual

Depende de: 2 y 4. Entrega: cuatro recursos originales finales en `src/assets/images/solutions/`.

- [x] Crear una ilustración principal de producto/conexiones y tres apoyos para web, sistemas e integraciones/automatización. Coordinar composición con las tres capas del hero; usar SVG/CSS para gráficos geométricos y generación de imagen si la dirección requiere raster.
- [x] Mantener titulares y textos comerciales en HTML. Distinguir ilustración conceptual de capturas de trabajos reales; registrar origen y uso de cada recurso.
- [x] Reutilizar componentes visuales de los casos existentes y sus enlaces mediante los IDs de `evidenceProjectIds`. Las ilustraciones de servicio no se usarán como prueba de trabajos realizados. Priorizar que el visitante identifique servicio, evidencia y contacto; los adornos no deben competir con esas tres acciones.
- [x] Presupuesto total nuevo de imágenes: hasta 350 KB; principal hasta 200 KB y apoyos hasta 50 KB cada uno. Si el hero requiere capas separadas, el límite principal se aplica a la suma de sus archivos, no a cada capa.
- [x] Usar dimensiones/aspect-ratio reservados, formatos adecuados y variantes responsive si son necesarias. Imágenes del primer bloque sin lazy loading; diferir las inferiores. Verificar contraste, texto alternativo y ausencia de scroll horizontal.
- [x] Integrar recursos definitivos en ambas escenas y ambos temas. Comprobar que una imagen fallida no oculte el texto, el CTA ni rompa el espacio reservado; registrar cualquier excepción al presupuesto antes de cerrar la etapa.

Aceptación: cuatro assets integrados y sin placeholders finales, composición legible en móvil y amplitud de parallax que no revele márgenes vacíos.

## Etapa 6 — CV maestros exhaustivos y generación consistente

Depende de: 1; puede completarse después de 5 sin depender del diseño comercial. Entrega: ambos PDF/Markdown y cobertura verificada.

- [x] Reutilizar `content/profile.json`, `content/skills.json` y `content/projects.json` como fuentes únicas para identidad, formación, skills y proyectos. Evitar un segundo JSON de CV que duplique estos hechos; cada proyecto conserva su ID de catálogo y su contenido ES/EN.
- [x] Validar que los 19 proyectos, el perfil, responsabilidades, formación, skills y enlaces se rendericen una vez en cada idioma. Los ítems transversales mantienen su propia sección y no reciben IDs de proyecto inventados.
- [x] Cubrir Wise/gFondos, Netegia, BarloGOW/Wareg, MS GBP, MS Logistics, MS Notificaciones, AFIPMS, Rendición, Componentes, Intranet, AdrogueBus/Fonobus, Evolution, CVGenio, Portal SGU y Alfa:dev, más los cuatro casos adicionales cuando estén respaldados.
- [x] Incluir cronología, responsabilidades, contribuciones, tecnologías contextualizadas, integraciones, performance, seguridad, producción, infraestructura/CI/CD, calidad, documentación, IA aplicada, producto/comercial, formación/cursos e idiomas. No usar solamente el primer aporte ni la bandera antigua de selección como filtro.
- [x] Generar `docs/cv/cv-coverage.md` con fuentes revisadas, fecha y SHA-256; listar cada proyecto y los cuatro formatos de salida. La validación automática compara los hechos redactados con texto extraído de Markdown/PDF y comprueba idioma, enlaces y ausencia de aportes. La revisión humana del inventario original precede al chequeo automático.
- [x] Registrar fecha de corte y fuentes adicionales utilizadas; resolver vacíos que impidan sostener experiencia antes de declarar cobertura completa. Separar métricas históricas de resultados actuales y conocimientos de responsabilidades profesionales.
- [x] Refactorizar generador a carga/validación explícita de datos, sin leer archivos ni escribir salidas al importar el módulo de pruebas. Probarlo con fixtures pequeñas, sin depender de rutas privadas de Downloads.
- [x] Diseñar A4 de una columna, texto seleccionable, jerarquía, numeración y enlaces útiles. Mantener juntos título y primera línea; permitir dividir proyectos largos entre páginas. No encerrar todo un caso en KeepTogether ni reducir fuentes para forzarlo a entrar.
- [x] Usar el título compartido también en pies y metadatos PDF. Mantener nombres públicos: `public/cv-AlfaroFernando-Esp.pdf`, `public/cv-AlfaroFernando-Eng.pdf`, `docs/cv/cv-master-es.md`, `docs/cv/cv-master-en.md`.
- [x] Validar todos los datos ES/EN y generar las cuatro salidas en un directorio temporal. Comprobar contenido y PDFs antes de reemplazar destinos. Guardar copias previas y restaurarlas ante errores controlados durante el reemplazo; limpiar temporales al terminar. No describir cuatro renames como una operación atómica del sistema de archivos.
- [x] Añadir pruebas unittest para los 19 casos, todos los aportes/resultados, PDF largo con acentos y enlaces, traducción ausente, omisión deliberada, fallo de generación y rollback ante fallo al reemplazar.
- [x] Ejecutar generación y extraer texto para comprobar título, orden de lectura, cobertura y enlaces; renderizar y revisar todas las páginas de ambos idiomas, reparando cortes, caracteres o páginas vacías. No comparar hashes PDF como prueba de equivalencia: pueden cambiar por metadatos de fecha.
- [x] Comprobar cada contribución contra texto extraído de PDF y Markdown, normalizando Unicode y espacios/saltos. Verificar por separado las anotaciones de enlace; probar una omisión intermedia deliberada. La suite cubre los 19 proyectos, todas las contribuciones y resultados y detecta la omisión.
- [x] Guardar los renders de todas las páginas en `artifacts.local/qa/2026-10-19/`. Conservar capturas del sitio si el navegador permite exportarlas a un archivo; si no, registrar la limitación y revisar el estado visual en vivo.

Comandos, usando el Python verificado en etapa 0:

```powershell
python -m unittest discover -s scripts -p 'test_generate_cvs.py'
python scripts/generate_cvs.py
```

Aceptación: cero hechos relevantes sin correspondencia, ningún idioma incompleto, cuatro salidas coherentes y descargas desde el sitio comprobadas. La prueba de rollback cubre errores controlados; no promete recuperación automática frente a un corte abrupto del proceso/equipo.

## Etapa 7 — Armonización de páginas existentes

Depende de: 2–6. Entrega: acabado coherente del sitio completo.

- [x] Aplicar tokens a Inicio, Sobre mí, Experiencia, catálogo, detalles, navegación, menús y pies. Animar por bloque, con jerarquía y sin mover cada línea de texto ni encadenar transiciones que retrasen controles.
- [x] Revisar AnimatedContent y entradas ya existentes: una sola animación por bloque, sin espera doble al cambiar idioma y sin remontar escenas/controles persistentes.
- [x] Revisar foco visible, teclado y layout responsive; probar menú y retorno de foco con Escape. El zoom al 200 %, contraste automatizado y carga fallida de imágenes quedan fuera de la medición manual disponible y se señalan en la matriz.
- [x] Comparar el recorrido de scroll con/sin escenas en el mismo dispositivo y registrar pausas y trabajo de renderizado. Verificar que el parallax sigue siendo perceptible al quitar partículas y no desaparece visualmente detrás de superficies opacas.

Aceptación: el movimiento complementa la lectura; el sitio conserva todas sus acciones y sigue siendo utilizable con movimiento reducido.

## Etapa 8 — Verificación integral y entrega local

Depende de: 0–7. Entrega: cambios revisables, informe y evidencia.

- [x] Ejecutar pruebas focalizadas finales, build y lint aplicable. Comparar con baseline y documentar límites: build y suites focalizadas pasan; el `npm run lint` global no devolvió resultado en la línea base, así que se valida el conjunto modificado con ESLint dirigido.
- [x] Ejecutar `npm run preview -- --host 127.0.0.1` y recorrer el build con base `/portfolio/`. Comprobar rutas nuevas y existentes, assets, PDFs y existencia de `dist/404.html`; el preview local no acredita respuesta del hosting público.
- [x] Ejecutar y registrar la matriz siguiente. Guardar renders PDF completos bajo `artifacts.local/qa/2026-10-19/`. Las capturas web se revisan directamente; CUA no ofrece exportación a ruta local, limitación asentada en el informe.
- [x] Revisar el diff final: únicamente archivos necesarios, sin temporales, renders masivos ni dependencias accidentales en el producto. Las capturas/evidencias no se importan en la aplicación.
- [x] Actualizar el informe con comandos/resultados, cobertura de CV, recorrido y límites reales; enlazar PDFs, plan e informe.
- [x] Dejar lista la revisión local. Publicación y comprobación pública serán posteriores cuando el usuario indique publicar; un fallback local o un build exitoso no se presenta como validación de producción.

### Matriz de aceptación

| Área | Casos | Resultado exigido | Estado final |
|---|---|---|---|
| Identidad | Marca, metadata de páginas visitadas y título/perfil/pie de ambos PDF | Coherencia de Software Engineer; nombres históricos fieles | Cumplido en portada, Soluciones, detalle, perfil y PDFs; búsqueda sin el título junior anterior |
| ES/EN y temas | Soluciones ES/EN y temas oscuro/claro a 390 px | Texto y metadata traducidos; foco y scroll preservados | Cumplido en Soluciones; recorridos de todas las páginas no repetidos en ambos idiomas |
| Navegación | Soluciones, detalle Wise Capital, vuelta atrás, hash inicial, caso inexistente | Destino, active nav, recuperación, restauración de scroll | Cumplido para esos recorridos; aliases cubiertos por pruebas de lógica |
| Entrada e historial | URL inicial `#projects`, detalle → atrás | Resolver hash y restaurar posición conocida | Cumplido; no se abrió el enlace externo de WhatsApp |
| Responsive | 360, 390, 768, 1024 y 1440 px | Sin scroll horizontal; hero y WhatsApp visibles | Cumplido; zoom real al 200 % no medido |
| Contacto | CTA y botón fijo; mensajes ES/EN; teclado/móvil | Destinatario único, parámetro de texto único, sin envío automático | URL y controles verificados; no se abrió WhatsApp ni se envió mensaje |
| Recursos/carga | Integridad de SVG, lazy loading y espacio reservado | Texto/CTA disponibles y presupuesto respetado | Presupuesto comprobado; no se simuló una imagen fallida o lenta |
| Movimiento | Motion tokens, movimiento reducido y escucha de breakpoint | Transiciones breves, neutras con movimiento reducido, sin estado por píxel | Implementación y pruebas focalizadas; cambio en vivo de preferencia no simulado |
| Parallax | Inicio/Soluciones, dos posiciones y retorno | Planos diferenciados y reversibles, contenido estable | Cumplido visualmente y con medición del transform; no se detecta deriva |
| CV | 19 proyectos, múltiples aportes, acentos, links, todas las páginas y omisión intencional | Texto completo en ES/EN, seis páginas por idioma, legible | Cumplido; todas las páginas revisadas y renders guardados en `artifacts.local/qa/2026-10-19/` |
| Fallos CV | Traducción ausente, fallo de generación y fallo al reemplazar | Error explícito y rollback de las cinco salidas | Cumplido por 7 pruebas de unidad |
| Build/hosting | Build, preview, rutas, assets/PDF y fallback | Resultado local verificado; alcance público identificado | Cumplido localmente; publicación pendiente |

Los anchos intermedios se prueban para límites de layout/nav. Los enlaces externos se verifican por destino y comportamiento; un bloqueo de automatización no basta para declarar un enlace roto. El nuevo SEO se valida en el DOM y en el HTML inicial según su alcance, sin prometer prerenderizado.

### Pruebas de lógica: contrato concreto

`tests/services.test.mjs` comprobará cinco IDs únicos, textos ES/EN no vacíos y `evidenceProjectIds` resolubles en el catálogo; `tests/contact.test.mjs` comprobará destinatario, mensajes distintos, codificación y fallback de idioma. Ejemplo de contacto:

```javascript
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { getWhatsAppUrl } from '../src/utils/contact.js';

const profile = JSON.parse(readFileSync(new URL('../content/profile.json', import.meta.url), 'utf8'));

test('el idioma cambia el mensaje y conserva el destinatario', () => {
  const expected = new URL(profile.links.whatsapp);
  const es = new URL(getWhatsAppUrl(profile.links.whatsapp, 'es'));
  const en = new URL(getWhatsAppUrl(profile.links.whatsapp, 'en'));
  for (const url of [es, en]) {
    assert.equal(url.origin, expected.origin);
    assert.equal(url.pathname, expected.pathname);
    assert.equal(url.searchParams.getAll('text').length, 1);
    assert.ok(url.searchParams.get('text').trim());
  }
  assert.notEqual(es.searchParams.get('text'), en.searchParams.get('text'));
  assert.equal(es.searchParams.get('text'), 'Hola Fernando, me gustaría conversar sobre una solución tecnológica para mi negocio.');
  assert.equal(en.searchParams.get('text'), "Hi Fernando, I'd like to discuss a technology solution for my business.");
  assert.equal(getWhatsAppUrl(profile.links.whatsapp, 'invalid'), getWhatsAppUrl(profile.links.whatsapp, 'es'));
});
```

La utilidad no importa JSON; componentes lo leen como ya hace Vite y los tests mediante `readFileSync`. Los tests de lógica no sustituyen pruebas reales de navegación, parallax o renderizado PDF.

## 5. Revisión del propio plan

- Cobertura: todos los pedidos tienen entrega, etapa responsable y criterio de aceptación.
- Dependencias: las etapas numeradas son el orden de ejecución; contacto y movimiento se definen antes de sus consumidores.
- Alcance: conservar contenido y recorridos, con trabajo comercial, CV y parallax separados por responsabilidad y revisables como entregas.
- Evidencia: baseline, pruebas de lógica, recorrido del build y revisión visual de PDF/movimiento cubren aspectos distintos; no se intercambian sus conclusiones.
- Estado de implementación: tareas completadas; las filas con límites en la matriz registran los casos no simulados. La revisión local no equivale a publicación ni a validación de hosting público.

### Ajustes de esta última revisión

- Eliminada la señal de contenido listo sin contrato; la política se apoya en el montaje real de las rutas actuales.
- Especificados ingreso inicial con hash, navegación repetida e historial para evitar pérdida de posición.
- Incluida la limpieza conjunta del overlay, bloqueo de scroll y temporizadores de carga.
- Identificada la versión de las fuentes y comprobada la cobertura sobre salidas PDF/Markdown, incluyendo enlaces y una omisión deliberada en pruebas.
- Fijado el contrato mínimo del contenido CV y evitada una dependencia obligatoria de herramientas de grabación.
