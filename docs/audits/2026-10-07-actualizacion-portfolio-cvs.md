# Actualización de portafolio y CV maestros

Fecha: 2026-10-07.

## Alcance editorial

Fuente canónica: el inventario técnico privado proporcionado por el titular, citado sin copiarlo al repositorio. Se integraron 15 casos principales y cuatro proyectos complementarios, con experiencia, stack y contribuciones documentadas. Las seis partes/repositorios de gFondos se presentan como un solo caso. Se corrigieron el título, seniority, educación, inglés, cronología, stack del Portal SGU y afirmaciones de liderazgo que no estaban respaldadas.

Los datos comerciales, métricas internas, contacto de terceros, credenciales, IPs y motivo de desvinculación se excluyeron del contenido público. El teléfono se unificó usando el valor del sitio y del CV EN anterior; la matriz editorial con decisiones y referencias fuente se conserva fuera del repositorio público.

## Cambios del portafolio

- Inicio, Sobre mí, experiencia, habilidades, footer y metadatos usan el perfil actualizado.
- Nueva página de Experiencia y catálogo filtrable con fichas de proyectos en español e inglés.
- IDs y slugs independientes del idioma; los slugs históricos del portafolio complementario siguen resolviendo.
- Los casos sin capturas muestran imagen institucional identificada o portada tipográfica; no muestran galerías vacías.
- Recursos visuales optimizados y locales. Sus páginas de origen, URL, transformaciones y ausencia de licencia explícita localizada están en `docs/assets/image-sources.json`.

## CV maestros

`content/profile.json`, `content/skills.json` y `content/projects.json` son la base editable. `scripts/generate_cvs.py` genera las vistas Markdown `docs/cv/cv-master-es.md` y `docs/cv/cv-master-en.md`, más los PDF actuales con texto seleccionable y dos páginas por idioma. La versión inglesa está redactada en inglés; ambas incluyen perfil, empleo, niveles de stack, 15 casos canónicos, práctica de ingeniería, formación e inglés B1.

## Verificación

### Validación local

- `npm run build`: correcto; Vite compiló 469 módulos y generó `dist/404.html` junto con los recursos bajo `/portfolio/`.
- Auditoría de contenido: 19 casos, 15 incluidos en CV, 36 slugs/alias únicos, 15/15 casos cubiertos y cero referencias a medios inexistentes.
- `git diff --check`: sin errores de whitespace.
- CV: cada PDF contiene dos páginas; se extrajo texto y se inspeccionaron visualmente las cuatro páginas. Los PDF servidos por `vite preview` responden `200` como `application/pdf`.
- `vite preview`: Inicio, Experiencia, catálogo, ambos PDF y manifest respondieron `200`; las rutas profundas de React devolvieron el shell SPA.
- Revisión manual en el navegador: catálogo con 19 casos, filtro por categoría, cambio ES/EN en catálogo y ficha conservando la identidad de ruta, alias histórico, entrada directa a Experiencia, ficha Wise sin galería vacía, Portal SGU sin enlace a un repositorio inaccesible y BarloGOW sin enlace a una página de otro alcance. El slug inexistente ofrece un enlace al catálogo. Se comprobaron las páginas nuevas en 320, 390, 768, 1024 y 1440 px, sin desbordamiento horizontal.
- `npm run lint`: no pasa por ocho errores y una advertencia en archivos/configuración existentes (`Navbar.jsx`, `LanguageContext.jsx`, `AnimatedContent.jsx`, `CustomCursor.jsx`, `tailwind.config.js`). Los dos avisos de props de `Navbar.jsx` también aparecen al lint del archivo en el commit base; los demás archivos listados no cambiaron en esta implementación. El lint no reportó errores en los módulos agregados.
- No se agregaron ni ejecutaron pruebas automatizadas, según el alcance acordado.

### Publicación

El remoto contiene `master` y `gh-pages`; el proyecto ya define `npm run deploy` para publicar `dist/` en `gh-pages`. Completar aquí los SHA de código y de publicación, y la verificación pública de las rutas y PDF después del push.
