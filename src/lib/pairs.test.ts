import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deal, flip, initial, isWon, settle } from './pairs.ts';

// Six pairs laid out in order: cards 0 and 1 match, 2 and 3 match, and so on.
const ordered = () => initial([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);

test('deal returns every pair id exactly twice', () => {
  for (const random of [Math.random, () => 0, () => 0.999]) {
    const cards = deal(6, random);
    assert.equal(cards.length, 12);
    for (let id = 0; id < 6; id += 1) {
      assert.equal(cards.filter((card) => card === id).length, 2, `pair ${id}`);
    }
  }
});

test('deal follows the random source', () => {
  assert.notDeepEqual(deal(6, () => 0), deal(6, () => 0.999));
});

test('the first card of a move turns face up without counting', () => {
  const state = flip(ordered(), 4);
  assert.deepEqual(state.faceUp, [4]);
  assert.equal(state.moves, 0);
  assert.equal(state.locked, false);
});

test('turning the same card twice changes nothing', () => {
  const once = flip(ordered(), 4);
  assert.equal(flip(once, 4), once);
});

test('an index outside the board is ignored', () => {
  const state = ordered();
  assert.equal(flip(state, 12), state);
  assert.equal(flip(state, -1), state);
});

test('a matching second card keeps both and counts one move', () => {
  const state = flip(flip(ordered(), 2), 3);
  assert.deepEqual([...state.matched].sort(), [2, 3]);
  assert.deepEqual(state.faceUp, []);
  assert.equal(state.moves, 1);
  assert.equal(state.locked, false);
});

test('a mismatch locks the board until it is settled', () => {
  const state = flip(flip(ordered(), 0), 2);
  assert.equal(state.locked, true);
  assert.equal(state.moves, 1);
  assert.deepEqual(state.faceUp, [0, 2]);
  assert.equal(state.matched.size, 0);

  assert.equal(flip(state, 4), state, 'no card turns while locked');

  const settled = settle(state);
  assert.deepEqual(settled.faceUp, []);
  assert.equal(settled.locked, false);
  assert.equal(settled.moves, 1);
});

test('settle leaves an unlocked board alone', () => {
  const state = flip(ordered(), 0);
  assert.equal(settle(state), state);
});

test('a matched card is ignored', () => {
  const state = flip(flip(ordered(), 0), 1);
  assert.equal(flip(state, 0), state);
  assert.equal(flip(state, 1), state);
});

test('the game is won exactly when all twelve cards are matched', () => {
  let state = ordered();
  assert.equal(isWon(state), false);
  for (let index = 0; index < 12; index += 1) {
    assert.equal(isWon(state), false, `before card ${index}`);
    state = flip(state, index);
  }
  assert.equal(isWon(state), true);
  assert.equal(state.moves, 6);
});
