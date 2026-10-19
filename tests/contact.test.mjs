import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { getWhatsAppUrl } from '../src/utils/contact.js';

const profile = JSON.parse(
  readFileSync(new URL('../content/profile.json', import.meta.url), 'utf8'),
);

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
  assert.equal(
    es.searchParams.get('text'),
    'Hola Fernando, me gustaría conversar sobre una solución tecnológica para mi negocio.',
  );
  assert.equal(
    en.searchParams.get('text'),
    "Hi Fernando, I'd like to discuss a technology solution for my business.",
  );
  assert.equal(
    getWhatsAppUrl(profile.links.whatsapp, 'invalid'),
    getWhatsAppUrl(profile.links.whatsapp, 'es'),
  );
});
