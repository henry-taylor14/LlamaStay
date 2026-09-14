// Runnable check for the pieces that have real logic: the api layer contract,
// the color vocabulary shared with the backend, and the ledger derivations.
// Needs the backend running: npm run dev (or: cd backend && go run . serve)
import PocketBase from 'pocketbase';
import { FIBER_COLORS, colorHex, entryNo, isOverdue } from './src/lib/llama.js';
import { formatDate, toDateInputValue } from './src/lib/dates.js';

const PB_URL = 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);

let failed = 0;
const check = (label, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`);
  if (!cond) failed++;
};
const die = (label, e) => {
  console.error(`FAIL  ${label}:`, e.message);
  process.exit(1);
};

// ---- derivations -----------------------------------------------------
check('entryNo pads to three digits', entryNo(0) === '001' && entryNo(9) === '010');
check('isOverdue flags a record older than a year', isOverdue('2025-06-15 00:00:00.000Z'));
check('isOverdue leaves a recent record alone', !isOverdue(new Date().toISOString()));
check('isOverdue tolerates a missing date', isOverdue('') === false);
check('colorHex resolves a known color', colorHex('Tan') === '#C9A876');
check('colorHex falls back for an unknown one', colorHex('Chartreuse') === 'var(--wool)');
check(
  'dates format in UTC, not local',
  formatDate('2026-09-04 00:00:00.000Z') === 'Sep 4, 2026',
  formatDate('2026-09-04 00:00:00.000Z')
);
check(
  'date input value survives the space separator',
  toDateInputValue('2026-09-04 00:00:00.000Z') === '2026-09-04'
);

// ---- color vocabulary matches the backend ---------------------------
// The form offers these; the collection's select field must accept them, or
// saving fails with a validation error rather than looking wrong.
for (const { name } of FIBER_COLORS) {
  try {
    const r = await pb.collection('llamas').create({ name: `_probe_${name}`, color: name });
    await pb.collection('llamas').delete(r.id);
    check(`backend accepts color "${name}"`, true);
  } catch (e) {
    check(`backend accepts color "${name}"`, false, e.message);
  }
}

// ---- api layer -------------------------------------------------------
const api = {
  fetchAll: () => pb.collection('llamas').getFullList({ sort: 'created,id' }),
  create: d => pb.collection('llamas').create(d),
  update: (id, d) => pb.collection('llamas').update(id, d),
  remove: id => pb.collection('llamas').delete(id),
  shear: id => pb.send(`/api/llamas/${id}/shear`, { method: 'POST' }),
};

// Matches what the create form sends: name and color only.
const created = await api.create({ name: '_probe_entry', color: 'Purple' }).catch(e => die('create', e));
check('backend stamps the shear date on create', Boolean(created.lastShear), created.lastShear);

const all = await api.fetchAll().catch(e => die('fetchAll', e));
check('list comes back in ledger order', all.at(-1).id === created.id, `last = ${all.at(-1).name}`);

// Matches what the edit form sends: only fields the form owns.
const updated = await api
  .update(created.id, {
    name: '_probe_amended',
    color: 'Green',
    lastShear: new Date(Date.now() - 3.9 * 86400000).toISOString(),
    lastShearAmount: 12,
  })
  .catch(e => die('update with form-owned fields only', e));
check('update returns the full record', updated.name === '_probe_amended' && updated.lastShearAmount === 12);

const sheared = await api.shear(created.id).catch(e => die('shear', e));
check('shear math: 3.9 days -> 1mm, not 0', sheared.lastShearAmount === 1, `${sheared.lastShearAmount}mm`);

await api.remove(created.id).catch(e => die('remove', e));
check('remove', !(await api.fetchAll()).some(l => l.id === created.id));

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
