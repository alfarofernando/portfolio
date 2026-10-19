import assert from 'node:assert/strict';
import test from 'node:test';
import { getParallaxOffset } from '../src/components/motion/motionTokens.js';

test('el progreso local mueve cada plano alrededor de su posición neutral', () => {
  assert.equal(getParallaxOffset(0, 32), -32);
  assert.equal(getParallaxOffset(0.25, 32), -16);
  assert.equal(getParallaxOffset(0.5, 32), 0);
  assert.equal(getParallaxOffset(1, 32), 32);
});

test('el desplazamiento se acota al progreso y distancia configurados', () => {
  assert.equal(getParallaxOffset(-1, 8), -8);
  assert.equal(getParallaxOffset(2, 8), 8);
  assert.equal(getParallaxOffset(0.5, 0), 0);
});
