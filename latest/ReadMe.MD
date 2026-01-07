# module/csv - V8 module

CSV gives workflows a simple way to turn text tables into usable data and back again, without extra dependencies or runtime setup. Use it when you need quick parsing, light formatting, or clean exports.

It is built for the lightweight V8 runtime used by Instago. Learn more at https://instago.ai.

## Technical reference

Exports:
- `parse(str, { headers?, delimiter? }) -> { ok, data, error }`
- `stringify(rowsOrObjs, { headers?, delimiter? }) -> { ok, data, error }`
- `toObjects(rows, headers?) -> { ok, data, error }`
- `fromObjects(objs) -> { ok, data, error }`

Usage:
- `parse` returns `data` as an array of rows (each row is an array of strings).
- `parse` accepts `delimiter` (default `,`); `headers` is accepted but does not alter parsing.
- `stringify` accepts either rows (arrays) or objects. In object mode, `headers` controls column order and adds a header row; otherwise headers are inferred and no header row is written.
- `toObjects` uses the first row as headers unless an explicit `headers` array is provided.
- `fromObjects` returns `{ headers, rows }` where headers come from the first object and rows include a header row.

Configuration:
- No environment configuration. `env.json` has no required or optional keys.

Examples:
```js
const csv = require('csv@latest');

const parsed = csv.parse('name,age\nJane,30');
const rows = parsed.ok ? parsed.data : [];
const objects = csv.toObjects(rows).data;

const out = csv.stringify(objects, { headers: ['name', 'age'] });
console.log(out.data);
```

```js
const csv = require('csv@latest');

const { data: grid } = csv.fromObjects([
  { product: 'Widget', qty: 2 },
  { product: 'Gadget', qty: 5 },
]);

const { data: csvText } = csv.stringify(grid.rows, { delimiter: ';' });
```
