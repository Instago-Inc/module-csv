# module/csv - V8 module

Turn CSV strings into usable rows or objects, and go back to CSV when you need a file-ready export. This module keeps things straightforward so workflows can parse, format, and share data without extra dependencies.

It is designed to fit the lightweight V8 runtime used by Instago. Learn more at https://instago.ai.

## Technical reference

Exports:
- `parse(str, { headers?, delimiter? }) -> { ok, data, error }`
- `stringify(rowsOrObjs, { headers?, delimiter? }) -> { ok, data, error }`
- `toObjects(rows, headers?) -> { ok, data, error }`
- `fromObjects(objs) -> { ok, data, error }`

Usage:
- `parse` returns `data` as an array of rows (each row is an array of strings).
- `stringify` accepts either rows (arrays) or objects; when using objects, pass `headers` to control column order.
- `toObjects` uses the first row as headers unless an explicit `headers` array is provided.
- `fromObjects` returns `{ headers, rows }` where headers are derived from the first object.

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
