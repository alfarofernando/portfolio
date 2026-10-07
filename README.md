# Portfolio de Fernando Alfaro

Sitio personal bilingüe en React/Vite publicado bajo `/portfolio/`. Resume experiencia en desarrollo full stack, integración de APIs, soporte de sistemas productivos y proyectos propios.

## Desarrollo local

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

La compilación de producción es `npm run build`. La publicación configurada para GitHub Pages usa `npm run deploy` y genera `dist/404.html` para las rutas SPA.

## Contenido

- `content/profile.json`: identidad, contacto, resumen, empleo y formación, en español e inglés.
- `content/skills.json`: tecnologías separadas por experiencia profesional, puntual y complementaria.
- `content/projects.json`: catálogo bilingüe, IDs y slugs permanentes, alias históricos, aportes, links y medios.
- `src/data/projectModel.js`: localización y resolución de fichas por slug o alias.

Para agregar un caso, completá los textos `copy.es` y `copy.en`, asigná un `id` y `slug` únicos, agregá los slugs anteriores a `aliases` y elegí `cvInclude` según el alcance defendible. Los proyectos profesionales sin enlace público deben conservar `links: []`; no derives una URL de un repositorio interno. La matriz de cobertura editorial se mantiene fuera del repositorio público.

La página de Experiencia está en `/portfolio/Experience`; el catálogo completo en `/portfolio/Projects/all`. Las rutas anteriores de proyecto se conservan mediante alias.

## Imágenes

Los recursos remotos seleccionados se guardan localmente bajo `src/assets/images/companies/` para no depender de terceros al cargar el sitio. La procedencia y el uso se documentan en `docs/assets/image-sources.json`. Logos y material institucional se presentan como identificación de empresa/proyecto, no como capturas de implementación. Los casos con pantallas propias usan sus galerías existentes. Si se incorpora una imagen, verificá que corresponde al proyecto, revisá sus condiciones de uso, optimizá el archivo y añadí alt text y pie bilingües a `src/data/media.js`.

## CV maestros

Los CV en español e inglés comparten la base de `content/profile.json`, `content/skills.json` y `content/projects.json`.

```powershell
python -m pip install reportlab
python scripts/generate_cvs.py
```

El script escribe las versiones Markdown generadas en `docs/cv/` y los PDF seleccionables en `public/`. Editá los JSON compartidos para actualizar el contenido. Antes de publicar, renderizá e inspeccioná visualmente todas las páginas de ambos archivos. El teléfono se unificó con el que estaba publicado en el sitio y el CV EN; corregilo en `content/profile.json` si debe actualizarse.

## Referencias de contenido

El sitio y este repositorio contienen una síntesis pública de la fuente técnica privada proporcionada por el titular. No copiar al repositorio esa fuente, credenciales, IPs, información de terceros ni datos operativos internos.
