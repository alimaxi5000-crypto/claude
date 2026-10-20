// Minimal JSON Schema (draft 2020-12 subset) validator, enough for the jj-anim schema:
// type, const, enum, properties, required, additionalProperties, propertyNames, minProperties,
// maxProperties, items, minItems, maxItems, minimum, maximum, minLength, maxLength, pattern,
// $ref (#/$defs/...). No dependencies, runs in Node and in the browser.
// Returns [{ path, keyword, message }] (empty = valid). Stops after `max` errors.

const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'number' ? (Number.isInteger(v) ? 'integer' : 'number') : typeof v);
const isType = (v, t) => (t === 'number' ? typeof v === 'number' && Number.isFinite(v) : t === 'integer' ? Number.isInteger(v) : typeOf(v) === t);

export function validateSchema(schema, value, { max = 50 } = {}) {
  const errors = [];
  const reCache = new Map();
  const re = (p) => { if (!reCache.has(p)) reCache.set(p, new RegExp(p, 'u')); return reCache.get(p); };
  const resolve = (ref) => {
    if (!ref.startsWith('#/')) throw new Error(`unsupported $ref ${ref}`);
    return ref.slice(2).split('/').reduce((o, k) => o[k], schema);
  };
  const err = (path, keyword, message) => { if (errors.length < max) errors.push({ path, keyword, message }); };
  const walk = (s, v, path) => {
    if (errors.length >= max || s === true || s == null) return;
    if (s === false) { err(path, 'false', 'not allowed'); return; }
    if (s.$ref) { walk(resolve(s.$ref), v, path); return; }
    if ('const' in s && v !== s.const) { err(path, 'const', `must be ${JSON.stringify(s.const)}`); return; }
    if (s.enum && !s.enum.includes(v)) { err(path, 'enum', `must be one of ${s.enum.join(', ')}`); return; }
    if (s.type) {
      const types = [].concat(s.type);
      if (!types.some((t) => isType(v, t))) { err(path, 'type', `must be ${types.join('|')}`); return; }
    }
    if (typeof v === 'number') {
      if (s.minimum != null && v < s.minimum) err(path, 'minimum', `must be >= ${s.minimum}`);
      if (s.maximum != null && v > s.maximum) err(path, 'maximum', `must be <= ${s.maximum}`);
    }
    if (typeof v === 'string') {
      if (s.minLength != null && v.length < s.minLength) err(path, 'minLength', `too short`);
      if (s.maxLength != null && v.length > s.maxLength) err(path, 'maxLength', `longer than ${s.maxLength}`);
      if (s.pattern && !re(s.pattern).test(v)) err(path, 'pattern', `does not match ${s.pattern}`);
    }
    if (Array.isArray(v)) {
      if (s.minItems != null && v.length < s.minItems) err(path, 'minItems', `needs at least ${s.minItems} items`);
      if (s.maxItems != null && v.length > s.maxItems) { err(path, 'maxItems', `more than ${s.maxItems} items`); return; }
      if (s.items) v.forEach((x, i) => walk(s.items, x, `${path}[${i}]`));
    }
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const keys = Object.keys(v);
      if (s.minProperties != null && keys.length < s.minProperties) err(path, 'minProperties', `needs at least ${s.minProperties} entries`);
      if (s.maxProperties != null && keys.length > s.maxProperties) { err(path, 'maxProperties', `more than ${s.maxProperties} entries`); return; }
      for (const r of s.required || []) if (!(r in v)) err(path, 'required', `missing '${r}'`);
      for (const k of keys) {
        const kp = path ? `${path}.${k}` : k;
        if (s.propertyNames) walk(s.propertyNames, k, `${kp} (name)`);
        if (s.properties && k in s.properties) walk(s.properties[k], v[k], kp);
        else if (s.additionalProperties === false) err(kp, 'additionalProperties', 'unknown field');
        else if (s.additionalProperties && typeof s.additionalProperties === 'object') walk(s.additionalProperties, v[k], kp);
      }
    }
  };
  walk(schema, value, '');
  return errors;
}
