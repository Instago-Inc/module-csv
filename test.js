const t = require('utest@latest');
const csv = require('csv@latest');

t.test('parse basic with quotes', () => {
  const input = 'a,b,c\n1,hello,3\n2,"hi, there",4\n3,"He said ""ok""",5\n';
  const p = csv.parse(input);
  t.expect(p.ok).toBe(true);
  t.expect(Array.isArray(p.data)).toBe(true);
  t.expect(p.data.length).toBe(4);
  t.expect(p.data[2][1]).toBe('hi, there');
  t.expect(p.data[3][1]).toBe('He said "ok"');
});

t.test('toObjects/fromObjects roundtrip', () => {
  const input = 'a,b,c\n1,hello,3\n2,world,4\n';
  const p = csv.parse(input);
  const objs = csv.toObjects(p.data);
  t.expect(objs.ok).toBe(true);
  t.expect(objs.data.length).toBe(2);
  const fr = csv.fromObjects(objs.data);
  t.expect(fr.ok).toBe(true);
  const s = csv.stringify(fr.data.rows);
  t.expect(s.ok).toBe(true);
  t.expect(typeof s.data).toBe('string');
});

t.test('semicolon delimiter', () => {
  const semi = 'x;y\n10;20\n30;40\n';
  const p2 = csv.parse(semi, { delimiter: ';' });
  t.expect(p2.ok).toBe(true);
  const s2 = csv.stringify(p2.data, { delimiter: ';' });
  t.expect(s2.ok).toBe(true);
});

module.exports = { run: async (opts) => { await t.run(Object.assign({ quiet: true }, opts)); t.reset(); } };
