export const expressions = [
  { id: 'original', name: 'Original', edition: 'THE FIRST EXPRESSION', age: '10 silent years', description: 'Where the house began. Light of touch, generous in warmth, and honest about its patience.', aroma: 'Honey · Vanilla · Orchard fruit', palate: 'Soft toffee · Green apple · Light oak', finish: 'Clean · Gentle · Lingering' },
  { id: 'reserve', name: 'Reserve', edition: 'THE SIGNATURE EXPRESSION', age: '12 silent years', description: 'Our defining voice. Patiently rested in oak, with a depth that is unmistakably its own.', aroma: 'Vanilla · Oak · Smoke', palate: 'Caramel · Warm Spice · Dried Fruit', finish: 'Warm · Long · Velvety' },
  { id: 'edition', name: 'Édition', edition: 'THE PRIVATE EXPRESSION', age: 'A singular cask selection', description: 'An imagined tribute to the first keepers of Loch Veyr. Rare in spirit. Unhurried by nature.', aroma: 'Leather · Walnut · Rose', palate: 'Black cherry · Treacle · Cacao', finish: 'Deep · Warming · Persistent' },
] as const;
export const craftSteps = [
  { title: 'Select', detail: 'Heritage barley. Spring water. Nothing without purpose.', material: 'LAND & WATER' },
  { title: 'Distill', detail: 'Slow copper distillation. Only the quiet heart of the spirit.', material: 'COPPER & FIRE' },
  { title: 'Rest', detail: 'Seasoned oak. Highland winters. Years measured in stillness.', material: 'OAK & TIME' },
  { title: 'Refine', detail: 'Each cask considered. Each expression brought into balance.', material: 'INSTINCT & PRECISION' },
  { title: 'Bottle', detail: 'A sculpted vessel. A final signature. Nothing left to chance.', material: 'GLASS & CHARACTER' },
] as const;
export const storyWords = ['TIME.', 'PATIENCE.', 'CHARACTER.'] as const;
export const pourPhases = [
  { numeral: 'I', label: 'THE TILT', line: 'The decanter leans into the light.' },
  { numeral: 'II', label: 'THE POUR', line: 'Amber meets ice. The glass wakes.' },
  { numeral: 'III', label: 'THE SETTLE', line: 'Stillness returns. The moment is yours.' },
] as const;
export const reserveStages = [
  { word: 'AGED', line: 'Twelve silent winters in seasoned oak.' },
  { word: 'RESTED', line: 'Time does the quiet work.' },
  { word: 'REFINED', line: 'Each cask considered. Nothing left to chance.' },
  { word: 'REVEALED', line: 'Character, poured at last.' },
] as const;
export const tastingMoments = [
  { key: 'aroma', label: 'AROMA', notes: ['Vanilla', 'Oak', 'Smoke'], line: 'Breathe in slowly.' },
  { key: 'palate', label: 'PALATE', notes: ['Caramel', 'Warm Spice', 'Dried Fruit'], line: 'Let it unfold.' },
  { key: 'finish', label: 'FINISH', notes: ['Warm', 'Long', 'Velvety'], line: 'Stay a while.' },
] as const;
