// Ped model -> skeleton key (browser-safe; used by the resolver and by the skeleton loader).
// Any other humanoid model uses the male skeleton (GTA plays the same clips on all humanoid
// peds; only bone lengths differ) and reports that the skeleton is not exact.
export const SKELETON_KEYS = ['male', 'female', 'zombie'];
export const MODEL_KEYS = { mp_m_freemode_01: 'male', mp_f_freemode_01: 'female', u_m_y_zombie_01: 'zombie' };
export function skeletonKeyFor(nameOrModel) {
  if (SKELETON_KEYS.includes(nameOrModel)) return { key: nameOrModel, exact: true };
  const k = MODEL_KEYS[String(nameOrModel || '').toLowerCase()];
  return k ? { key: k, exact: true } : { key: 'male', exact: false };
}
