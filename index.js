// Minimal CSV parser/stringifier with helpers
// API:
// - parse(str, { headers?, delimiter=',' }) -> { ok, data: rows, error? }
// - stringify(rowsOrObjs, { headers?, delimiter=',' }) -> { ok, data: string }
// - toObjects(rows, headers?) -> { ok, data: objects[] }
// - fromObjects(objs) -> { ok, data: { headers, rows } }

(function(){
  function parse(str, opts){
    try {
      const s = '' + (str || '');
      const delim = (opts && opts.delimiter) || ',';
      const rows = [];
      let row = [], field = '';
      let i = 0, inQuotes = false;
      while (i < s.length){
        const ch = s[i++];
        if (inQuotes){
          if (ch === '"'){
            if (s[i] === '"'){ field += '"'; i++; } else { inQuotes = false; }
          } else { field += ch; }
        } else {
          if (ch === '"') { inQuotes = true; }
          else if (ch === delim) { row.push(field); field = ''; }
          else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
          else if (ch === '\r') { /* ignore, handle on \n */ }
          else { field += ch; }
        }
      }
      // push last unless it's a pure trailing empty row from terminal newline
      if (!(field === '' && row.length === 0 && (s.endsWith('\n') || s.endsWith('\r\n')))) {
        row.push(field); rows.push(row);
      }
      if (opts && opts.headers === true && rows.length > 1) {
        // First row is header; keep as-is (caller may call toObjects)
      }
      return { ok:true, data: rows };
    } catch (e){ return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  function needsQuote(v, delim){
    return /["\n\r]/.test(v) || v.indexOf(delim) >= 0 || (/^\s|\s$/.test(v));
  }

  function stringify(rowsOrObjs, opts){
    try {
      const delim = (opts && opts.delimiter) || ',';
      const headers = opts && opts.headers;
      let out = '';
      if (Array.isArray(rowsOrObjs) && rowsOrObjs.length && typeof rowsOrObjs[0] === 'object' && !Array.isArray(rowsOrObjs[0])){
        // Objects mode
        const objs = rowsOrObjs;
        let hdrs = Array.isArray(headers) ? headers.slice() : Object.keys(objs[0] || {});
        if (Array.isArray(headers)){
          out += hdrs.map(v => {
            v = '' + (v==null?'':v);
            return needsQuote(v, delim) ? '"' + v.replace(/"/g,'""') + '"' : v;
          }).join(delim) + '\n';
        }
        for (const o of objs){
          const row = hdrs.map(k => {
            let v = o!=null && Object.prototype.hasOwnProperty.call(o,k) ? (o[k]==null?'':o[k]) : '';
            v = '' + v;
            return needsQuote(v, delim) ? '"' + v.replace(/"/g,'""') + '"' : v;
          }).join(delim);
          out += row + '\n';
        }
        return { ok:true, data: out };
      } else {
        // Array rows mode
        const rows = Array.isArray(rowsOrObjs) ? rowsOrObjs : [];
        for (const r of rows){
          const row = (Array.isArray(r)?r:[r]).map(v => {
            v = '' + (v==null?'':v);
            return needsQuote(v, delim) ? '"' + v.replace(/"/g,'""') + '"' : v;
          }).join(delim);
          out += row + '\n';
        }
        return { ok:true, data: out };
      }
    } catch (e){ return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  function toObjects(rows, headers){
    try {
      if (!Array.isArray(rows) || !rows.length) return { ok:true, data: [] };
      let hdrs = Array.isArray(headers) ? headers : rows[0];
      const start = Array.isArray(headers) ? 0 : 1;
      const out = [];
      for (let i=start;i<rows.length;i++){
        const r = rows[i] || [];
        const o = {};
        for (let c=0;c<hdrs.length;c++){ const k = '' + (hdrs[c] == null ? '' : hdrs[c]); o[k] = r[c]; }
        out.push(o);
      }
      return { ok:true, data: out };
    } catch (e){ return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  function fromObjects(objs){
    try {
      const arr = Array.isArray(objs) ? objs : [];
      const headers = arr.length ? Object.keys(arr[0]) : [];
      const rows = [ headers.slice() ];
      for (const o of arr){ rows.push(headers.map(k => o!=null && Object.prototype.hasOwnProperty.call(o,k) ? o[k] : '')); }
      return { ok:true, data: { headers, rows } };
    } catch (e){ return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  module.exports = { parse, stringify, toObjects, fromObjects };
})();
