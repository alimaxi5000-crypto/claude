// Independent reader for binary GTA V clip dictionaries (.ycd, RSC7 version 46).
// Written from the documented structure layouts (CodeWalker.Core Resources/Clip.cs,
// ResourceBaseTypes.cs, RpfFile.cs) but sharing no code with the writer: it is used to prove
// that every generated file is structurally valid and decodes back to the source data.
// Works in Node and in the browser (pass an inflateRaw implementation).

const SYS_BASE = 0x50000000;

export function sizeFromFlags(flags) {
  const s0 = ((flags >>> 27) & 0x1) << 0;
  const s1 = ((flags >>> 26) & 0x1) << 1;
  const s2 = ((flags >>> 25) & 0x1) << 2;
  const s3 = ((flags >>> 24) & 0x1) << 3;
  const s4 = ((flags >>> 17) & 0x7f) << 4;
  const s5 = ((flags >>> 11) & 0x3f) << 5;
  const s6 = ((flags >>> 7) & 0xf) << 6;
  const s7 = ((flags >>> 5) & 0x3) << 7;
  const s8 = ((flags >>> 4) & 0x1) << 8;
  const ss = flags & 0xf;
  return (0x200 << ss) * (s0 + s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8);
}

export const CHANNEL_TYPES = [
  'StaticQuaternion', 'StaticVector3', 'StaticFloat', 'RawFloat', 'QuantizeFloat',
  'IndirectQuantizeFloat', 'LinearFloat', 'CachedQuaternion1', 'CachedQuaternion2',
];

class Mem {
  constructor(u8, errors) {
    this.u8 = u8;
    this.dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    this.errors = errors;
  }
  check(off, len, what) {
    if (off < 0 || off + len > this.u8.length) throw new Error(`out of bounds: ${what} @${off}+${len} (size ${this.u8.length})`);
  }
  u8at(o) { this.check(o, 1, 'u8'); return this.u8[o]; }
  u16(o) { this.check(o, 2, 'u16'); return this.dv.getUint16(o, true); }
  u32(o) { this.check(o, 4, 'u32'); return this.dv.getUint32(o, true); }
  i32(o) { this.check(o, 4, 'i32'); return this.dv.getInt32(o, true); }
  f32(o) { this.check(o, 4, 'f32'); return this.dv.getFloat32(o, true); }
  // 64-bit pointer -> offset into the system segment (null -> -1).
  ptr(o, what) {
    const lo = this.u32(o), hi = this.u32(o + 4);
    if (lo === 0 && hi === 0) return -1;
    if (hi !== 0) throw new Error(`pointer high dword not zero (${what})`);
    if ((lo & 0xf0000000) >>> 0 !== SYS_BASE) throw new Error(`pointer outside system segment: 0x${lo.toString(16)} (${what})`);
    const off = lo - SYS_BASE;
    this.check(off, 1, `pointer target ${what}`);
    return off;
  }
  cstr(o) {
    let s = '';
    for (let i = o; i < this.u8.length; i++) {
      const c = this.u8[i];
      if (c === 0) return s;
      s += String.fromCharCode(c);
    }
    throw new Error('unterminated string');
  }
}

export function joaatLower(str) {
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

// Little-endian bitstream read of up to 32 bits.
function getBits(data, startBit, n) {
  let result = 0;
  for (let k = 0; k < n; k++) {
    const bit = startBit + k;
    const byte = data[bit >>> 3] ?? 0;
    if ((byte >>> (bit & 7)) & 1) result += 2 ** k;
  }
  return result;
}

function parseSequence(mem, off, numFramesAnim) {
  const seq = {
    hash: mem.u32(off),
    dataLength: mem.u32(off + 4),
    frameOffset: mem.u32(off + 12),
    rootRefsOffset: mem.u32(off + 16),
    numFrames: mem.u16(off + 22),
    frameLength: mem.u16(off + 24),
    indirectInts: mem.u16(off + 26),
    quantBits: mem.u16(off + 28),
    chunkSize: mem.u8at(off + 30),
    rootRefCounts: mem.u8at(off + 31),
  };
  mem.check(off + 32, seq.dataLength, 'sequence data');
  const data = mem.u8.subarray(off + 32, off + 32 + seq.dataLength);
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const N = seq.numFrames;
  let pos = 0;
  let listOff = seq.frameOffset + seq.frameLength * N;
  let itemOff = listOff + 18;
  const channels = [];
  const byType = [];
  let frameBitAcc = 0;
  for (let type = 0; type < 9; type++) {
    const count = dv.getUint16(listOff, true); listOff += 2;
    const list = [];
    for (let c = 0; c < count; c++) {
      const dataBits = dv.getUint16(itemOff, true); itemOff += 2;
      const ch = { type, typeName: CHANNEL_TYPES[type], seq: dataBits >> 2, index: dataBits & 3, dataOffset: pos / 4 };
      switch (type) {
        case 0: { // StaticQuaternion: xyz, w rebuilt >= 0
          const x = dv.getFloat32(pos, true), y = dv.getFloat32(pos + 4, true), z = dv.getFloat32(pos + 8, true);
          pos += 12;
          ch.value = [x, y, z, Math.sqrt(Math.max(1 - (x * x + y * y + z * z), 0))];
          break;
        }
        case 1:
          ch.value = [dv.getFloat32(pos, true), dv.getFloat32(pos + 4, true), dv.getFloat32(pos + 8, true)];
          pos += 12;
          break;
        case 2:
          ch.value = dv.getFloat32(pos, true); pos += 4;
          break;
        case 3:
          ch.bits = 32; ch.values = new Array(N);
          break;
        case 4:
          ch.bits = dv.getInt32(pos, true); ch.quantum = dv.getFloat32(pos + 4, true); ch.offset = dv.getFloat32(pos + 8, true);
          pos += 12; ch.values = new Array(N);
          if (ch.bits < 1 || ch.bits > 32) throw new Error(`QuantizeFloat with ${ch.bits} bits`);
          break;
        case 5: {
          ch.frameBits = dv.getInt32(pos, true); ch.valueBits = dv.getInt32(pos + 4, true); ch.numInts = dv.getInt32(pos + 8, true);
          ch.quantum = dv.getFloat32(pos + 12, true); ch.offset = dv.getFloat32(pos + 16, true);
          pos += 20;
          const nv = Math.min(Math.floor((ch.numInts * 32) / ch.valueBits), 2 ** ch.frameBits - 1);
          ch.table = [];
          for (let i = 0; i < nv; i++) ch.table.push(getBits(data, pos * 8 + i * ch.valueBits, ch.valueBits) * ch.quantum + ch.offset);
          pos += ch.numInts * 4;
          ch.bits = ch.frameBits; ch.values = new Array(N);
          break;
        }
        case 6:
          throw new Error('LinearFloat channels are not produced by this pipeline (reader does not decode them)');
        case 7: case 8:
          ch.quatIndex = ch.index;
          ch.index = type === 7 ? 3 : 4;
          ch.bits = 0;
          break;
        default: break;
      }
      ch.frameBitOffset = frameBitAcc;
      frameBitAcc += ch.bits && type !== 7 && type !== 8 ? ch.bits : 0;
      list.push(ch);
      channels.push(ch);
    }
    if (count % 4) itemOff += (4 - (count % 4)) * 2;
    byType.push(list);
  }
  // Per-frame data.
  for (let f = 0; f < N; f++) {
    let bit = (seq.frameOffset + seq.frameLength * f) * 8;
    for (let type = 0; type < 9; type++) {
      for (const ch of byType[type]) {
        if (type === 3) {
          const u = getBits(data, bit, 32); bit += 32;
          const b = new DataView(new ArrayBuffer(4)); b.setUint32(0, u, true);
          ch.values[f] = b.getFloat32(0, true);
        } else if (type === 4) {
          const u = getBits(data, bit, ch.bits); bit += ch.bits;
          ch.values[f] = u * ch.quantum + ch.offset;
        } else if (type === 5) {
          const u = getBits(data, bit, ch.frameBits); bit += ch.frameBits;
          if (u >= ch.table.length) throw new Error('IndirectQuantizeFloat index out of range');
          ch.values[f] = ch.table[u];
        }
      }
    }
    if (bit > (seq.frameOffset + seq.frameLength * (f + 1)) * 8) throw new Error(`frame ${f} overflows frame stride`);
  }
  // Root motion refs (6 bytes each).
  const nPos = (seq.rootRefCounts >> 4) & 0xf, nRot = seq.rootRefCounts & 0xf;
  seq.rootRefs = [];
  for (let i = 0; i < nPos + nRot; i++) {
    seq.rootRefs.push({
      kind: i < nPos ? 'position' : 'rotation',
      channelType: data[itemOff], channelIndex: data[itemOff + 1],
      dataIntOffset: data[itemOff + 2] | (data[itemOff + 3] << 8),
      frameBitOffset: data[itemOff + 4] | (data[itemOff + 5] << 8),
    });
    itemOff += 6;
  }
  if (itemOff !== data.length) throw new Error(`sequence data length mismatch: parsed ${itemOff}, stored ${data.length}`);
  if (seq.rootRefsOffset !== 32 + seq.dataLength - (nPos + nRot) * 6) throw new Error('RootMotionRefsOffset inconsistent');
  // Group channels into per-track sequences.
  const groups = new Map();
  for (const ch of channels) {
    if (!groups.has(ch.seq)) groups.set(ch.seq, []);
    groups.get(ch.seq)[ch.index] = ch;
  }
  seq.channels = channels;
  seq.groups = groups;
  return seq;
}

function evalGroup(group, f) {
  if (!group || !group[0]) throw new Error('empty channel group');
  const c0 = group[0];
  if (c0.type === 0) return c0.value.slice();
  if (c0.type === 1) return c0.value.slice();
  const comp = (ch, k) => (ch.type === 2 ? ch.value : ch.values ? ch.values[f] : NaN);
  const out = [];
  for (let k = 0; k < group.length; k++) {
    const ch = group[k];
    if (!ch) { out.push(NaN); continue; }
    if (ch.type === 7 || ch.type === 8) {
      const x = out[0], y = out[1], z = out[2];
      out.push(Math.sqrt(Math.max(0, 1 - (x * x + y * y + z * z))));
    } else out.push(comp(ch, k));
  }
  return out;
}

// Parse a whole .ycd file. Returns { header, clips, anims, errors } and throws on hard errors.
export function parseYcd(fileBytes, inflateRaw) {
  const errors = [];
  const u8 = fileBytes instanceof Uint8Array ? fileBytes : new Uint8Array(fileBytes);
  const hv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  if (u8.length < 16) throw new Error('file too small');
  const magic = hv.getUint32(0, true);
  if (magic !== 0x37435352) throw new Error('missing RSC7 header');
  const version = hv.getInt32(4, true);
  const sysFlags = hv.getUint32(8, true), gfxFlags = hv.getUint32(12, true);
  const sysSize = sizeFromFlags(sysFlags), gfxSize = sizeFromFlags(gfxFlags);
  const data = inflateRaw(u8.subarray(16));
  if (version !== 46) errors.push(`unexpected resource version ${version} (ycd = 46)`);
  if (data.length < sysSize + gfxSize) throw new Error(`decompressed ${data.length} bytes < declared ${sysSize}+${gfxSize}`);
  const mem = new Mem(data.subarray(0, sysSize), errors);
  const header = { version, sysFlags, gfxFlags, sysSize, gfxSize, decompressed: data.length };
  // ResourceFileBase + ClipDictionary.
  header.pagesInfo = mem.ptr(8, 'pages info');
  const animMapOff = mem.ptr(0x18, 'animation map');
  const clipsOff = mem.ptr(0x28, 'clips');
  const clipCap = mem.u16(0x30), clipEntries = mem.u16(0x32);
  // Animations.
  const anims = new Map();
  if (animMapOff >= 0) {
    const arrOff = mem.ptr(animMapOff + 0x18, 'anim buckets');
    const cap = mem.u16(animMapOff + 0x20), entries = mem.u16(animMapOff + 0x22);
    let found = 0;
    for (let b = 0; b < cap; b++) {
      let e = mem.ptr(arrOff + b * 8, 'anim bucket');
      while (e >= 0) {
        const hash = mem.u32(e);
        if (hash % cap !== b) errors.push(`animation 0x${hash.toString(16)} in wrong bucket ${b}`);
        const aOff = mem.ptr(e + 8, 'animation');
        anims.set(hash, parseAnimation(mem, aOff, hash));
        found++;
        e = mem.ptr(e + 16, 'anim next');
      }
    }
    if (found !== entries) errors.push(`animation map entries ${entries} != found ${found}`);
  }
  // Clips.
  const clips = new Map();
  if (clipsOff >= 0) {
    let found = 0;
    for (let b = 0; b < clipCap; b++) {
      let e = mem.ptr(clipsOff + b * 8, 'clip bucket');
      while (e >= 0) {
        const hash = mem.u32(e);
        if (hash % clipCap !== b) errors.push(`clip 0x${hash.toString(16)} in wrong bucket ${b}`);
        const cOff = mem.ptr(e + 8, 'clip');
        const type = mem.u32(cOff + 0x10);
        const nameOff = mem.ptr(cOff + 0x18, 'clip name');
        const name = nameOff >= 0 ? mem.cstr(nameOff) : null;
        const clip = { hash, type, name, nameLength: mem.u16(cOff + 0x20) };
        if (name && clip.nameLength !== name.length) errors.push(`clip ${name}: NameLength ${clip.nameLength} != ${name.length}`);
        if (type === 1) {
          const aOff = mem.ptr(cOff + 0x50, 'clip animation');
          clip.start = mem.f32(cOff + 0x58);
          clip.end = mem.f32(cOff + 0x5c);
          clip.rate = mem.f32(cOff + 0x60);
          clip.animOffset = aOff;
          // Link to the animation map entry by offset.
          for (const a of anims.values()) if (a.offset === aOff) clip.anim = a;
          if (!clip.anim) errors.push(`clip ${name}: animation pointer does not match any animation map entry`);
          clip.animHash = clip.anim ? clip.anim.hash : null;
        } else errors.push(`clip ${name}: unsupported clip type ${type}`);
        // Short name hash must match the map hash (lookup by name in game).
        if (name) {
          const short = name.replace(/^.*[\\/]/, '').replace(/\..*$/, '');
          if (joaatLower(short) !== hash) errors.push(`clip ${name}: map hash does not match name`);
          clip.shortName = short;
        }
        clips.set(hash, clip);
        found++;
        e = mem.ptr(e + 16, 'clip next');
      }
    }
    if (found !== clipEntries) errors.push(`clip map entries ${clipEntries} != found ${found}`);
  }
  return { header, clips: [...clips.values()], anims: [...anims.values()], errors };
}

function parseAnimation(mem, off, hash) {
  const a = {
    hash, offset: off,
    flags: mem.u8at(off + 0x10),
    frames: mem.u16(off + 0x14),
    sequenceFrameLimit: mem.u16(off + 0x16),
    duration: mem.f32(off + 0x18),
    signature: mem.u32(off + 0x1c),
    maxSeqBlockLength: mem.u32(off + 0x38),
    usageCount: mem.u32(off + 0x3c),
  };
  const seqArr = mem.ptr(off + 0x40, 'sequences');
  const seqCount = mem.u16(off + 0x48);
  const boneArr = mem.ptr(off + 0x50, 'bone ids');
  const boneCount = mem.u16(off + 0x58);
  a.boneIds = [];
  for (let i = 0; i < boneCount; i++) {
    a.boneIds.push({ boneId: mem.u16(boneArr + i * 4), format: mem.u8at(boneArr + i * 4 + 2), track: mem.u8at(boneArr + i * 4 + 3) });
  }
  for (let i = 1; i < a.boneIds.length; i++) {
    const p = a.boneIds[i - 1], c = a.boneIds[i];
    if ((p.boneId | (p.track << 16)) > (c.boneId | (c.track << 16))) throw new Error(`animation 0x${hash.toString(16)}: bone ids not sorted`);
  }
  a.sequences = [];
  for (let s = 0; s < seqCount; s++) a.sequences.push(parseSequence(mem, mem.ptr(seqArr + s * 8, 'sequence'), a.frames));
  // Decode tracks across sequences (frames are split by sequenceFrameLimit).
  a.tracks = a.boneIds.map((b, k) => ({ ...b, values: [] }));
  for (const sq of a.sequences) {
    for (let f = 0; f < sq.numFrames; f++) {
      a.tracks.forEach((t, k) => t.values.push(evalGroup(sq.groups.get(k), f)));
    }
    // Validate root refs point at mover channels.
    for (const r of sq.rootRefs) {
      const want = r.kind === 'position' ? 5 : 6;
      const ok = sq.channels.some((ch) => ch.type === r.channelType && Math.round(ch.dataOffset) === r.dataIntOffset && a.boneIds[ch.seq]?.track === want);
      if (!ok) throw new Error(`root ${r.kind} ref does not match a mover channel`);
    }
  }
  if (a.tracks.length && a.tracks[0].values.length < a.frames) throw new Error(`decoded ${a.tracks[0].values.length} frames < ${a.frames}`);
  return a;
}
