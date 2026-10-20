// Writes clip dictionaries in the CodeWalker/Sollumz "ycd.xml" format, which
// tools/ycdtool converts into a binary .ycd with CodeWalker.Core.
// Layout and conventions follow Sollumz' exporter (ycd/ycdexport.py) and CodeWalker's
// YcdXml reader (GameFiles/FileTypes/YcdFile.cs, Resources/Clip.cs):
//  * tracks: 0 bone translation (vec3), 1 bone rotation (quat), 5 mover translation, 6 mover rotation
//  * BoneIds sorted by boneId | (track << 16); Unk0 = component format (0 vec3, 1 quat, 2 float)
//  * Animation.Unknown10 flag 16 = has root motion (mover tracks)
//  * quaternion sign continuity (GTA interpolates components linearly without a dot check)

export function joaat(str) {
  let h = 0;
  const s = str.toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i)) >>> 0;
    h = (h + (h << 10)) >>> 0;
    h = (h ^ (h >>> 6)) >>> 0;
  }
  h = (h + (h << 3)) >>> 0;
  h = (h ^ (h >>> 11)) >>> 0;
  h = (h + (h << 15)) >>> 0;
  return h >>> 0;
}

export const TRACK = { BonePosition: 0, BoneRotation: 1, MoverPosition: 5, MoverRotation: 6 };
const FORMAT = { 0: 0, 1: 1, 5: 0, 6: 1 };

const f32 = (v) => Math.fround(v);
// Float formatting: shortest round-trip representation of the float32 value.
export function fmt(v) {
  const x = f32(v);
  if (Object.is(x, -0)) return '0';
  if (Number.isInteger(x)) return String(x);
  // 9 significant digits always round-trip a float32.
  let s = x.toPrecision(9);
  if (s.includes('e')) return s;
  s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

// Make a quaternion series sign-continuous; returns a new array.
export function continuous(quats) {
  const out = [];
  let prev = null;
  for (const q of quats) {
    let c = q.slice();
    if (prev && prev[0] * c[0] + prev[1] * c[1] + prev[2] * c[2] + prev[3] * c[3] < 0) c = c.map((v) => -v);
    out.push(c);
    prev = c;
  }
  return out;
}

const QUANT_STEPS = 65535; // <= 16 bits per value

function floatChannel(values, ind) {
  let mn = Infinity, mx = -Infinity;
  for (const v of values) { const x = f32(v); if (x < mn) mn = x; if (x > mx) mx = x; }
  if (mx - mn < 1e-7) {
    return `${ind}<Item>\n${ind} <Type value="StaticFloat" />\n${ind} <Value value="${fmt(values[0])}" />\n${ind}</Item>\n`;
  }
  const quantum = Math.max((mx - mn) / QUANT_STEPS, 1e-7);
  const rows = [];
  for (let i = 0; i < values.length; i += 10) rows.push(`${ind}  ` + values.slice(i, i + 10).map(fmt).join(' '));
  return `${ind}<Item>\n${ind} <Type value="QuantizeFloat" />\n${ind} <Quantum value="${fmt(quantum)}" />\n${ind} <Offset value="${fmt(mn)}" />\n${ind} <Values>\n${rows.join('\n')}\n${ind} </Values>\n${ind}</Item>\n`;
}

function sequenceData(track, series, ind) {
  const isQuat = track === 1 || track === 6;
  const comps = isQuat ? 4 : 3;
  const data = isQuat ? continuous(series) : series;
  // Fully static track -> single static channel.
  let constant = true;
  for (let c = 0; c < comps && constant; c++) {
    const v0 = f32(data[0][c]);
    for (const d of data) if (Math.abs(f32(d[c]) - v0) > 1e-7) { constant = false; break; }
  }
  let body = '';
  if (constant) {
    if (isQuat) {
      // Static quaternions store xyz only and rebuild w >= 0: canonicalise.
      let q = data[0];
      if (q[3] < 0) q = q.map((v) => -v);
      body = `${ind}  <Item>\n${ind}   <Type value="StaticQuaternion" />\n${ind}   <Value x="${fmt(q[0])}" y="${fmt(q[1])}" z="${fmt(q[2])}" w="${fmt(q[3])}" />\n${ind}  </Item>\n`;
    } else {
      const v = data[0];
      body = `${ind}  <Item>\n${ind}   <Type value="StaticVector3" />\n${ind}   <Value x="${fmt(v[0])}" y="${fmt(v[1])}" z="${fmt(v[2])}" />\n${ind}  </Item>\n`;
    }
  } else {
    for (let c = 0; c < comps; c++) body += floatChannel(data.map((d) => d[c]), ind + '  ');
  }
  return `${ind}<Item>\n${ind} <Channels>\n${body}${ind} </Channels>\n${ind}</Item>\n`;
}

// clip: { name, frames (count), duration, tracks: [{ boneId, track, series: [[...], ...] }] }
export function animationXml(dict, clip) {
  const tracks = clip.tracks.slice().sort((a, b) => (a.boneId | (a.track << 16)) - (b.boneId | (b.track << 16)));
  const hasMover = tracks.some((t) => t.track === 5 || t.track === 6);
  const ind = '   ';
  let ids = '';
  let seq = '';
  for (const t of tracks) {
    if (t.series.length !== clip.frames) throw new Error(`${clip.name}: track ${t.boneId}/${t.track} has ${t.series.length} frames, expected ${clip.frames}`);
    ids += `${ind} <Item>\n${ind}  <BoneId value="${t.boneId}" />\n${ind}  <Track value="${t.track}" />\n${ind}  <Unk0 value="${FORMAT[t.track]}" />\n${ind} </Item>\n`;
    seq += sequenceData(t.track, t.series, ind + '    ');
  }
  // Signature must be unique per animation (used by the game's animation cache).
  const sig = (joaat(`${dict}/${clip.name}`) + 1) >>> 0;
  return `  <Item>
   <Hash>${clip.name}</Hash>
   <Unknown10 value="${hasMover ? 16 : 0}" />
   <FrameCount value="${clip.frames}" />
   <SequenceFrameLimit value="${clip.frames + 30}" />
   <Duration value="${fmt(clip.duration)}" />
   <Unknown1C>hash_${sig.toString(16).toUpperCase().padStart(8, '0')}</Unknown1C>
   <BoneIds>
${ids}   </BoneIds>
   <Sequences>
    <Item>
     <Hash>hash_00000000</Hash>
     <FrameCount value="${clip.frames}" />
     <SequenceData>
${seq}     </SequenceData>
    </Item>
   </Sequences>
  </Item>
`;
}

export function clipXml(clip) {
  return `  <Item>
   <Hash>${clip.name}</Hash>
   <Name>pack:/${clip.name}.clip</Name>
   <Type value="Animation" />
   <Unknown30 value="0" />
   <Tags />
   <Properties />
   <AnimationHash>${clip.name}</AnimationHash>
   <StartTime value="0" />
   <EndTime value="${fmt(clip.duration)}" />
   <Rate value="1" />
  </Item>
`;
}

export function dictionaryXml(dict, clips) {
  for (const c of clips) {
    if (c.name !== c.name.toLowerCase()) throw new Error(`clip name must be lowercase: ${c.name}`);
    if (!/^[a-z0-9_]+$/.test(c.name)) throw new Error(`clip name has invalid characters: ${c.name}`);
  }
  const names = new Set(clips.map((c) => c.name));
  if (names.size !== clips.length) throw new Error(`${dict}: duplicate clip names`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<ClipDictionary>
 <Clips>
${clips.map(clipXml).join('')} </Clips>
 <Animations>
${clips.map((c) => animationXml(dict, c)).join('')} </Animations>
</ClipDictionary>
`;
}
