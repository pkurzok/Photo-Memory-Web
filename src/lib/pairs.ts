// The rules of the pairs game on the homepage. No DOM access and no imports, so that Node can
// run the tests on this file directly.

export type State = {
  // The pair id of every card, in board order.
  cards: number[];
  // Indices of the cards turned in the current move: none, one, or a mismatched two.
  faceUp: number[];
  // Indices of the cards whose pair has been found.
  matched: Set<number>;
  moves: number;
  // True while a mismatched pair is shown; settle() turns it back.
  locked: boolean;
};

// A shuffled board: every id from 0 to pairCount - 1 twice.
export function deal(pairCount: number, random: () => number = Math.random): number[] {
  const cards = Array.from({ length: pairCount * 2 }, (_, index) => Math.floor(index / 2));
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  return cards;
}

export function initial(cards: number[]): State {
  return { cards, faceUp: [], matched: new Set(), moves: 0, locked: false };
}

// Turns the card at `index`. Returns the same state when the card cannot be turned.
export function flip(state: State, index: number): State {
  const known = index >= 0 && index < state.cards.length;
  if (!known || state.locked || state.matched.has(index) || state.faceUp.includes(index)) return state;
  if (state.faceUp.length === 0) return { ...state, faceUp: [index] };

  const first = state.faceUp[0];
  const moves = state.moves + 1;
  if (state.cards[first] === state.cards[index]) {
    return { ...state, faceUp: [], matched: new Set([...state.matched, first, index]), moves };
  }
  return { ...state, faceUp: [first, index], moves, locked: true };
}

// Turns a mismatched pair back.
export function settle(state: State): State {
  return state.locked ? { ...state, faceUp: [], locked: false } : state;
}

export function isWon(state: State): boolean {
  return state.matched.size === state.cards.length;
}
