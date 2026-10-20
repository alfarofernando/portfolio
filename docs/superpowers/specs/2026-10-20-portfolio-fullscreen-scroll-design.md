# Diseño: navegación por pantallas y posicionamiento del portafolio

Estado: implementación y revisión local completadas el 20/10/2026. La variante elegida usa JavaScript para avanzar una pantalla por gesto de rueda. El usuario autorizó el commit y push directos a master.

## Objetivo

Presentar a Fernando como Software Engineer, priorizar proyectos y experiencia, quitar la sección «Sobre mí» y dejar de mostrar la navegación como una barra flotante. En escritorio, cada bloque de contenido debe caber en una pantalla y un gesto vertical de rueda debe avanzar o retroceder exactamente un bloque. La entrada de tarjetas y contenido debe ser progresiva y perceptible, con una duración natural.

La navegación por pantallas se aplica a todas las rutas, incluidas Inicio, Experiencia, Soluciones, Catálogo, fichas de proyectos, 404 y contacto. En móvil y en ventanas bajas el sitio conserva el desplazamiento normal para evitar comprimir o cortar contenido.

## Alcance

- Retirar «Sobre mí» de la landing y del menú en español e inglés. La ruta antigua se conserva como alias que lleva al inicio, sin volver a mostrar la sección.
- Presentar el rol y titular público como «Software Engineer» en ambos idiomas. «Full Stack» puede describir el alcance técnico, pero no sustituye ese titular.
- Retirar Junior, Becario, Trainee y términos equivalentes de la identidad, copy, metadatos y CV descargables publicados por el portafolio. Mantener empresa, fechas, funciones y progresión Tier 1→2 cuando estén respaldadas; usar Software Engineer como título de rol en ES y EN.
- Convertir la barra superior en un encabezado compacto en el flujo del documento. No permanece fija ni pegada al borde al desplazarse.
- Dividir cada ruta del sitio en paneles completos sin omitir información: Inicio, Experiencia, Soluciones, Catálogo, fichas, página no encontrada y cierre de contacto.
- Añadir animaciones de entrada progresiva a los paneles, tarjetas y bloques relevantes.
- Mantener rutas, idioma, tema, descargas, galerías, filtros, enlaces y datos existentes, salvo la sección eliminada y las etiquetas de posicionamiento indicadas.

## Fuera de alcance

- Ejecutar un despliegue manual. El push a `master` autorizado por el usuario puede activar el workflow de publicación existente.
- Cambiar la fuente técnica canónica que está fuera del repositorio.
- No añadir servicios, capacidades, métricas, proyectos o responsabilidades sin respaldo.
- Rediseñar el parallax o los fondos decorativos por separado.
- Añadir dependencias para scroll o animación; el proyecto ya usa Framer Motion y el navegador ofrece eventos de rueda.

## Base actual inspeccionada

- La portada se compone de bienvenida, proyectos, una vista previa de experiencia y «Sobre mí». La sección final no tiene identificador propio en el menú; la barra está declarada fija.
- Experiencia combina encabezado, responsabilidades, casos profesionales, educación e inglés dentro de una página larga.
- El catálogo presenta la colección filtrable en una grilla continua. Las fichas agrupan descripción, contexto, rol, aportes, resultados, galería y enlaces en una página larga.
- El cierre global actualmente separa CTA y footer. En escritorio, ese contenido debe caber en un panel final compartido; el pie legal y sus enlaces siguen visibles.
- Las cadenas de posicionamiento aparecen en los locales, el perfil, el HTML y manifest estáticos, los Markdown de CV y el generador de PDF. Cambiar solo la portada dejaría títulos incompatibles en otros idiomas y documentos.
- La aplicación ya tiene soporte ES/EN, tema claro/oscuro, React Router, Framer Motion y preferencias de movimiento reducido.

## Estructura de pantallas

Todas las pantallas comparten un encabezado semántico, un área de contenido limitada a la altura disponible y una navegación anterior/siguiente discreta dentro del panel. El primer panel de cada ruta comparte la pantalla con el encabezado estático. Los paneles siguientes ocupan el alto visible completo. No se introduce un segundo contenedor con scroll vertical anidado.

| Ruta | Secuencia propuesta |
|---|---|
| Portada | Presentación y perfil; tecnologías y herramientas; proyectos destacados distribuidos en grupos; experiencia resumida; cierre de contacto |
| Experiencia | Empresa y resumen; responsabilidades distribuidas si hiciera falta; casos profesionales en grupos que quepan; formación e inglés; cierre de contacto |
| Soluciones | Presentación; servicios en grupos que quepan; proceso; cierre de contenido y contacto |
| Catálogo | Introducción y filtros; proyectos en grupos medidos para el viewport; los filtros siguen disponibles en los paneles de resultados; cierre de contacto |
| Ficha | Resumen y tecnologías; contexto, rol, aportes y resultados distribuidos por bloques legibles; galería; enlaces y navegación a otros proyectos; cierre de contacto |
| Proyecto inexistente | Mensaje y regreso al catálogo en una pantalla; cierre común compacto |

Los grupos se definen por contenido real y espacio medido, no por una cantidad fija de tarjetas. Si un bloque excede la altura disponible, se divide en más paneles. No se reduce el texto hasta volverlo ilegible ni se oculta información para forzar el ajuste. Soluciones y 404 también usan el controlador global; Soluciones conserva todos los servicios, ejemplos relacionados y pasos de proceso en paneles propios.

El cierre de contacto reúne el CTA, enlaces profesionales, CV, disponibilidad y pie legal que ahora están repartidos entre SubFooter y Footer. La composición desktop es compacta y completa; en móvil recupera el flujo natural y la distribución actual de esos contenidos.

## Control de rueda en escritorio

Se prefiere un controlador JavaScript frente a CSS Scroll Snap porque el requisito es avanzar exactamente una pantalla por gesto, incluso cuando un trackpad emite eventos inerciales consecutivos.

- Activar el controlador cuando la ruta exponga paneles y el viewport tenga al menos 1024 px de ancho y 700 px de alto. En pantallas menores o ventanas bajas, usar scroll natural y conservar las mismas secciones.
- Registrar un único listener global mientras la ruta activa tenga paneles. Limpiar listener, temporizadores, observadores y bloqueo al desmontar o cambiar de ruta.
- Normalizar deltaY según deltaMode y agrupar los eventos que pertenecen a un gesto. Un gesto que supera el umbral produce un solo paso; el listener permanece bloqueado durante el desplazamiento y hasta que termina la cola inercial. No se encadenan pasos por eventos del mismo gesto.
- Usar desplazamiento suave de duración moderada. Con prefers-reduced-motion, cambiar de panel de inmediato y omitir los movimientos de entrada.
- Interceptar solo gestos predominantemente verticales. Rueda horizontal, zoom del navegador con Ctrl, controles de formulario y áreas editables conservan el comportamiento del navegador.
- Al primer o último panel, no capturar un gesto que no tenga destino. La página no queda encerrada por un listener.
- Los controles Anterior/Siguiente y los enlaces de sección llaman a la misma navegación de panel. Los botones son accesibles por teclado y permiten descubrir el comportamiento sin rueda.
- El teclado conserva el desplazamiento nativo del navegador. No interceptar teclas mientras el foco esté en controles o contenido editable.
- Un coordinador único resuelve cambios de ruta y paneles. Retirar los scrollTo directos que hoy se reparten entre la barra, la portada y las tarjetas, para evitar movimientos duplicados.
- En navegación directa o PUSH/REPLACE, ir al panel indicado por un hash reconocido o al primero. El hash antiguo de «Sobre mí» lleva al Inicio. Al moverse con rueda, actualizar el hash con replaceState cuando el panel tenga un identificador estable, sin crear una entrada de historial por pantalla.
- Guardar el panel de cada location.key. En POP, restaurar la pantalla previa si existe; sin posición previa, resolver el hash y luego usar el primer panel.

El listener no se ejecuta dentro de cada tarjeta ni de cada ruta. El contenedor de aplicación conoce los paneles activos y es el único responsable de medir destinos y mover la página. Esto evita controladores duplicados y saltos dobles de scroll.

## Barra superior y navegación

La barra se renderiza en el flujo normal al inicio de cada ruta. Conserva marca, idioma y tema, pero deja de cubrir contenido al desplazarse. Los enlaces de sección invocan el controlador común; las rutas de Experiencia, Soluciones, Catálogo y fichas siguen usando enlaces del router. La navegación anterior/siguiente en cada panel permite continuar sin mantener una barra flotante visible.

El alias /portfolio/AboutMe se redirige al Inicio. Se quitan el ítem de menú, el bloque de la portada y las claves de texto que solo existen para «Sobre mí».

## Posicionamiento y CV

«Software Engineer» pasa a ser el rol y encabezado de identidad en ES y EN. Las descripciones se mantienen concretas y basadas en la experiencia registrada. Los nombres de compañías, periodos, tareas y tecnologías no cambian por este ajuste.

El cambio alcanza el perfil compartido, todas las variantes activas de locales, SEO, metadatos estáticos, manifest, fuentes Markdown y PDFs públicos generados. Los títulos históricos que contienen una etiqueta de nivel se presentan como Software Engineer, conservando la progresión Tier 1→2 y las tareas respaldadas. El título no atribuye antigüedad, responsabilidad o alcance distintos de la evidencia disponible.

## Animación

Usar Framer Motion ya instalado. Cada panel revela encabezado, bloque principal y tarjetas en una secuencia corta. Referencia inicial: 450–600 ms por entrada, separación de 80–120 ms entre tarjetas y desplazamiento breve de 12–18 px junto con opacidad. Ajustar a la velocidad normal solicitada y evitar animaciones prolongadas que retrasen lectura o controles.

La entrada comienza cuando un panel pasa a ser el destino activo y anima primero el contenido principal; las tarjetas siguen en grupos pequeños. Se reproduce al entrar a un panel, sin reiniciar repetidamente por cada evento de scroll. Hover y foco conservan transiciones cortas. Si el usuario prefiere movimiento reducido, el contenido aparece estático.

## Accesibilidad y adaptación

- Usar encabezados semánticos por panel, orden de foco estable y botones anteriores/siguientes con nombres accesibles.
- Mantener foco visible. No mover el foco por desplazamiento con rueda; al activar un enlace o botón de navegación, el destino puede recibir foco sin provocar un segundo scroll.
- El contraste, textos alternativos, idioma y tema actuales se conservan.
- En ancho menor a 1024 px o alto menor a 700 px se desactiva el paso forzado por rueda. El contenido fluye naturalmente, incluidas galerías y pie.
- No ocultar barras de scroll horizontales internas de galería ni interceptar sus gestos horizontales.

## Criterios de aceptación

1. En ventanas de escritorio elegibles, un gesto de rueda o trackpad avanza exactamente un panel. Su cola inercial no salta paneles. El gesto inverso vuelve un panel.
2. En los límites, en paneles interactivos y en galerías horizontales, el controlador no bloquea una acción válida.
3. Inicio, Experiencia, Soluciones, Catálogo, todas las fichas válidas, página no encontrada y contacto muestran paneles completos sin recorte ni scroll interno vertical.
4. Toda la información existente de proyectos y experiencia permanece accesible en los paneles. Los filtros y enlaces siguen funcionando.
5. Teclado, foco, menú, hashes, historial de rutas, español/inglés, tema claro/oscuro y rutas profundas siguen siendo utilizables.
6. El comportamiento es scroll natural en móvil y ventanas bajas; movimiento reducido evita desplazamiento animado y entradas.
7. «Sobre mí» ya no aparece en portada o menú y su ruta antigua conduce al Inicio.
8. No aparecen Junior, Becario, Trainee ni equivalentes en las superficies públicas, metadatos o PDFs. La identidad ES/EN dice Software Engineer y las afirmaciones históricas permanecen verificables.
9. Las tarjetas y bloques aparecen en una secuencia visible de velocidad moderada; las animaciones no ocultan controles ni interfieren con la rueda.
10. La validación visual recorre rutas en escritorio y móvil, ambos idiomas y temas. Se guardan capturas representativas del Inicio, Catálogo, Experiencia y una ficha.

## Riesgos y decisiones de implementación pendientes

- La rueda personalizada requiere distinguir un gesto físico de una secuencia inercial. El umbral, silencio y bloqueo deben calibrarse manualmente en ratón y trackpad; el controlador no debe avanzar dos veces por un gesto.
- El catálogo y las galerías tienen cantidades variables. El número de tarjetas o imágenes por panel debe ajustarse luego de medir tamaños reales a 1366×768 y 1440×900.
- La barra deja de estar visible después de salir de la primera pantalla. La navegación por paneles y los enlaces de ruta ofrecen continuidad sin volverla flotante.
- La preferencia reduced-motion debe comprobarse tanto al cargar como si cambia durante la sesión.

## Mapa de áreas afectadas

- Estructura de rutas y efectos de navegación.
- Layout de aplicación, encabezado, pie CTA/contacto y estilos globales.
- Landing, vista previa de experiencia, rutas de experiencia y soluciones, catálogo, página no encontrada y detalle.
- Modelo de contenido de perfil, locales ES/EN, HTML y manifest.
- Fuentes y generación de CV, junto con PDFs de distribución.
- Capturas y reporte de validación visual.

Los planes de identidad/CV y navegación por pantallas fueron aprobados. La implementación abarca código, contenido y CV. La revisión manual confirmó el encaje de paneles y la navegación en 1280×720 para Inicio, catálogo, Soluciones y una ficha con galería; el alias antiguo y la ruta 404 también se revisaron. El scroll natural se confirmó en 390×844 y 768×1024. La revisión de código corrigió el retorno al primer panel, la rueda sobre botones y el traslado de foco desde el navbar. El build pasa; ESLint dirigido a los archivos modificados pasa. `npm run lint` completo sigue reportando incidencias preexistentes en `LanguageContext.jsx`, `CustomCursor.jsx` y `tailwind.config.js`. El usuario autorizó el push directo a master.
