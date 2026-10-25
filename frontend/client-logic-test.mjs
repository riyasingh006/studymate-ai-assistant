// Standalone logic test for the new client modules (run against the raw source).
// Not part of the npm build; kept for quick verification and later CI adoption.
import { validateLength } from './src/utils/validate.js';
import { describeResult, resultToText, TOOL_META, TOOL_ORDER } from './src/utils/format.js';
import * as storage from './src/lib/storage.js';

const store = new Map();
const order = [];
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => {
      store.set(k, String(v));
      if (!order.includes(k)) order.push(k);
    },
    removeItem: (k) => store.delete(k),
    get length() {
      return store.size;
    },
    key: (i) => order[i] ?? null,
  },
};

let pass = 0;
let fail = 0;
function check(name, cond) {
  if (cond) pass += 1;
  else {
    fail += 1;
    console.log('FAIL:', name);
  }
}

// --- validate.js ---
check('required empty', validateLength('', { min: 20, max: 8000, label: 'Notes' }) != null);
check('too short', validateLength('abc', { min: 20, max: 8000, label: 'Notes' }) != null);
check('valid middle', validateLength('x'.repeat(50), { min: 20, max: 8000, label: 'Notes' }) == null);
check('too long', validateLength('x'.repeat(9000), { min: 20, max: 8000, label: 'Notes' }) != null);

// --- format.js ---
const summary = {
  main_topic: 'Testing',
  key_points: ['a'],
  important_definitions: [{ term: 't', definition: 'd' }],
  important_facts: ['f'],
  revision_summary: 'r',
};
check('summary title', describeResult('summarizer', summary).title === 'Testing');
check('summary toText', resultToText('summarizer', summary).includes('Important definitions'));
const quiz = { questions: [{ question: 'Q1?', options: ['a', 'b', 'c', 'd'], correct_answer: 'b', explanation: 'e' }] };
check('quiz title count', describeResult('quiz', quiz).title.includes('1 question'));
check('quiz toText', resultToText('quiz', quiz).includes('Q1?'));
check('improver toText', resultToText('improver', { improved_answer: 'X', missing_points: ['p'], improvement_explanation: 'why' }).split('\n').length >= 3);
check('explainer toText', resultToText('explainer', { explanation: 'e', steps: ['s1'], example: 'ex', takeaway: 'tk' }).toLowerCase().includes('takeaway'));
check('TOOL_META complete', TOOL_ORDER.length === 4 && Object.keys(TOOL_META).length === 4);

// --- storage.js: corrupt data ---
window.localStorage.setItem('studymate:results', '{not json');
check('corrupt results -> []', Array.isArray(storage.getResults()) && storage.getResults().length === 0);
window.localStorage.setItem('studymate:settings', 'garbage');
check('corrupt settings -> defaults', storage.getSettings().theme === 'dark');
window.localStorage.removeItem('studymate:results');
window.localStorage.removeItem('studymate:settings');

// --- storage.js: round-trip ---
const e1 = storage.addResult({ id: 'a', tool: 'summarizer', title: 'T', preview: 'P', data: { main_topic: 'T' }, saved: false, createdAt: new Date().toISOString() });
storage.addResult({ id: 'b', tool: 'quiz', title: 'Q', preview: '', data: { questions: [] }, saved: true, createdAt: new Date().toISOString() });
check('addResult returns entry', e1.id === 'a');
check('two entries', storage.getResults().length === 2);
window.localStorage.setItem('studymate:results', JSON.stringify([{ id: 'x', tool: 'quiz', data: {} }, 'nope', { nope: true }]));
check('getResults filters bad rows', storage.getResults().length === 1);
storage.saveResults([{ id: 'c', tool: 'explainer', title: 'C', data: { explanation: 'x' }, saved: true, createdAt: new Date().toISOString() }]);
check('saveResults replace', storage.getResults().length === 1);
check('toggleSaved on->off', storage.toggleSaved('c') === false);
storage.updateResult('c', { saved: true });
check('updateResult patch', storage.getResults()[0].saved === true);
storage.deleteResult('c');
check('deleteResult', storage.getResults().length === 0);

// --- settings round-trip ---
const s1 = storage.saveSettings({ defaultQuizDifficulty: 'hard' });
check('saveSettings merge', s1.defaultQuizDifficulty === 'hard' && s1.defaultSummaryLength === 'medium');
check('saveSettings persisted', storage.getSettings().defaultQuizDifficulty === 'hard');
check('usage bytes > 0', storage.storageUsageBytes() > 0);
storage.clearAllData();
check('clearAllData empties', storage.getResults().length === 0 && storage.storageUsageBytes() === 0);

console.log(`\nCLIENT-LOGIC RESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);