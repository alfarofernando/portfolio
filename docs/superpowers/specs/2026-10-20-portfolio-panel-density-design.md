# Diseño: reducir paneles con tarjetas más compactas

## Contexto

La revisión anterior implementó navegación por paneles completos en las rutas del portafolio. En el commit `2335d47` el catálogo agrupa tres proyectos por panel en desktop ancho y dos en desktop medio; Inicio muestra dos proyectos destacados por panel; Experiencia divide responsabilidades y casos relacionados; Soluciones separa servicios, proceso y cierre; cada ficha de proyecto separa contexto y enlaces. El usuario pidió compactar las tarjetas y reducir paneles en todo el sitio.

## Objetivo

Reducir el número de pantallas de desplazamiento en las rutas existentes mediante mayor densidad de tarjetas y unión de contenido breve que cabe en el mismo viewport. Conservar íntegros los textos, tecnologías, etiquetas, CTA, enlaces, galerías, temas, idiomas, navegación por teclado y scroll natural en móvil.

## Diseño aprobado en conversación

1. **Densidad compartida de tarjetas.** Reducir la altura de las imágenes de tarjetas de proyecto, padding y separación interior. Compactar de manera equivalente las tarjetas de servicios, casos de Experiencia y contexto/enlaces de fichas. Mantener el cuerpo de texto en un tamaño legible (mínimo 14 px); no truncar ni ocultar información.
2. **Inicio y catálogo.** Agrupar tres destacados por panel en viewport de 1280 px o más y mantener dos por panel entre 1024–1279 px. En Catálogo, agrupar cuatro proyectos en desktop ancho y tres entre 1024–1279 px; las columnas corresponden a cuatro y tres tarjetas, respectivamente. Los filtros continúan disponibles en cada panel y al cambiar categoría se vuelve al primer resultado.
3. **Experiencia.** Mostrar las cinco responsabilidades en un panel compacto y agrupar los cinco casos profesionales destacados en grupos de hasta tres tarjetas. Educación e idioma continúan juntos en su panel actual.
4. **Soluciones.** Mostrar los cinco servicios en un solo panel desktop. Entre 1024–1279 px, usar una fila compacta de cinco tarjetas; desde 1280 px, usar tres columnas en dos filas y colocar descripción/beneficio en subcolumnas para que el panel quepa en 720 px. Mantener el cuerpo en 14 px o más. Unir proceso y CTA de cierre en un panel, sin quitar texto ni enlaces.
5. **Fichas de proyectos.** Unir las tarjetas de contexto y rol con la navegación de enlaces externos/catálogo. La galería sigue separada para conservar su espacio e interacción horizontal. El resumen y los datos que ya estén presentes permanecen intactos.
6. **Identificadores y hashes.** Los cambios de composición no deben dejar hashes directos de paneles fusionados sin destino. El panel unido acepta los ids anteriores como alias; hashes a grupos numerados que ya no existan resuelven a un panel equivalente del mismo grupo, limitado al último grupo disponible. Las rutas y slugs no cambian.
7. **Responsive y movimiento.** Por debajo de los umbrales existentes para scroll por panel, el contenido sigue el flujo natural y usa columnas de lectura cómoda. El fallback del navbar reserva su altura real mientras carga y los paneles eliminan el margen de ancla heredado del navbar fijo para mantener alineados los enlaces directos. Se conservan las galerías, el movimiento reducido y la animación progresiva actual.

## Límites

- No modificar el contenido factual ni eliminar tarjetas, texto, tecnologías, referencias, enlaces, galerías o CTAs.
- No reducir el tamaño de cuerpo por debajo de 14 px ni ocultar información para hacer entrar más elementos.
- No cambiar las rutas públicas, el menú, la identidad Software Engineer ni el controlador de rueda existente.
- No añadir dependencias.

## Criterios de aceptación

1. A 1280×720 y 1366×768, Inicio, Catálogo, Experiencia y Soluciones muestran los grupos anteriores completos sin recorte ni scroll vertical interno; se reduce el número de paneles en cada una de esas rutas.
2. El Catálogo muestra cuatro proyectos por grupo a partir de 1280 px y tres entre 1024–1279 px. Todos los proyectos y filtros siguen accesibles.
3. Inicio muestra tres proyectos destacados por panel en desktop ancho; Experiencia reúne cinco responsabilidades en un panel y hasta tres casos destacados por grupo.
4. Soluciones presenta los cinco servicios en un panel sin overflow en 1024×700, 1280×720 y 1366×768; usa cinco columnas entre 1024–1279 px y tres desde 1280 px. Mantiene los tres pasos, cierre y enlaces en el panel combinado.
5. Cada ficha combina contexto/rol y enlaces en un panel, mantiene resumen y galería, y no pierde datos específicos del proyecto.
6. Los ids antiguos `solutions-closing` y `project-links` siguen resolviendo al panel combinado. Un hash numérico de grupo reducido llega a un grupo equivalente válido; atrás/adelante y foco siguen sincronizados.
7. En 390×844 y 768×1024 el scroll es natural, las tarjetas mantienen lectura y controles, y las galerías conservan la navegación horizontal.
8. Compilación, ESLint dirigido y revisión visual de las rutas desktop y móvil no reportan regresiones. No se agregan ni ejecutan pruebas automatizadas sin solicitud explícita.

## Riesgos y validación

- Cuatro columnas estrechan el catálogo; comprobar legibilidad de títulos, chips y enlaces sin truncar descripciones.
- Las cinco tarjetas de Soluciones ocupan dos filas; medir el panel combinado con el header estático en 1280×720 y ajustar padding/márgenes antes de tocar tipografía.
- Inicio incluye título y descripción junto con el primer grupo destacado; la compactación debe hacer caber tres tarjetas sin recortar la introducción.
- Al fusionar paneles cambia el conjunto de ids válidos. Mantener alias para destinos fusionados y fallback estable para grupos históricos numerados.
- Validar manualmente en ambos temas e idiomas, una ficha con galería, los filtros, hashes directos, foco de encabezado, navegación atrás/adelante y scroll móvil.

## Áreas afectadas

- Tarjetas compartidas y media: `src/pages/Projects/components/ProjectCard.jsx`, `src/components/ProjectMedia.jsx`.
- Agrupación de proyectos: `src/pages/Projects/Projects.jsx`, `src/pages/Projects/ProjectCatalog.jsx`.
- Conteo y densidad de secciones: `src/pages/Experience/Experience.jsx`, `src/pages/Solutions/Solutions.jsx`, `src/pages/Projects/components/ProjectPage.jsx`.
- Alias y restauración de paneles: `src/components/ScreenPanel.jsx`, `src/context/ScreenScrollContext.jsx`.
- Altura estable del navbar al cargar y cálculo del primer panel: `src/App.jsx`, `src/index.css`.

## Estado

Implementación y validación visual completas. El ajuste responsive de Soluciones usa cinco columnas entre 1024–1279 px y tres desde 1280 px; el espacio vertical de la fila compacta cabe en 1024×700 sin desbordar. La reserva de altura del navbar y el margen cero de los paneles mantienen alineados los hashes directos. Revisión de código y publicación en master pendientes.
