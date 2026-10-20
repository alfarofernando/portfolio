import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePathname, resolveNavigationTarget } from '../src/utils/routeNavigation.js';

test('normaliza mayúsculas y barras finales en rutas', () => {
  assert.equal(normalizePathname('/portfolio/Solutions/'), '/portfolio/solutions');
  assert.equal(normalizePathname('/'), '/');
});

test('una posición guardada del historial prevalece sobre el hash en POP', () => {
  assert.deepEqual(
    resolveNavigationTarget({
      navigationType: 'POP',
      pathname: '/portfolio/',
      hash: '#projects',
      savedPosition: 740,
    }),
    { kind: 'restore', top: 740 },
  );
});

test('una URL directa con hash se resuelve aunque la navegación inicial sea POP', () => {
  assert.deepEqual(
    resolveNavigationTarget({
      navigationType: 'POP',
      pathname: '/portfolio/',
      hash: '#about',
      savedPosition: undefined,
    }),
    { kind: 'hash', sectionId: 'about' },
  );
});

test('las rutas alias de portada resuelven su sección sin hash', () => {
  assert.deepEqual(
    resolveNavigationTarget({ pathname: '/portfolio/Projects', hash: '' }),
    { kind: 'section', sectionId: 'projects' },
  );
  assert.deepEqual(
    resolveNavigationTarget({ pathname: '/portfolio/AboutMe', hash: '' }),
    { kind: 'section', sectionId: 'home' },
  );
});

test('una ruta normal sin hash vuelve arriba y un hash inválido no desaparece', () => {
  assert.deepEqual(
    resolveNavigationTarget({ pathname: '/portfolio/Experience', hash: '' }),
    { kind: 'top' },
  );
  assert.deepEqual(
    resolveNavigationTarget({ pathname: '/portfolio/', hash: '#missing' }),
    { kind: 'hash', sectionId: 'missing' },
  );
});
