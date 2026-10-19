import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const services = JSON.parse(
  readFileSync(new URL('../content/services.json', import.meta.url), 'utf8'),
);
const catalog = JSON.parse(
  readFileSync(new URL('../content/projects.json', import.meta.url), 'utf8'),
);
const projects = Array.isArray(catalog) ? catalog : catalog.projects;

test('hay cinco servicios bilingües con evidencia del catálogo', () => {
  assert.equal(services.length, 5);
  assert.equal(new Set(services.map(({ id }) => id)).size, services.length);

  const projectIds = new Set(projects.map(({ id }) => id));
  for (const service of services) {
    assert.ok(service.id);
    for (const language of ['es', 'en']) {
      assert.ok(service.copy[language].title.trim(), `${service.id} ${language} title`);
      assert.ok(service.copy[language].description.trim(), `${service.id} ${language} description`);
      assert.ok(service.copy[language].benefit.trim(), `${service.id} ${language} benefit`);
    }
    assert.ok(service.evidenceProjectIds.length > 0, `${service.id} needs evidence`);
    for (const id of service.evidenceProjectIds) {
      assert.ok(projectIds.has(id), `${service.id} references unknown project ${id}`);
    }
  }
});
