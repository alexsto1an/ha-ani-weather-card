// Aircraft for the plane fly-overs, drawn from real dimensions.
//
// Each family is a small 3D model in metres, after one real aircraft: the
// fuselage as cross-sections along its length, the wings and tail as flat
// surfaces with their sweep and dihedral, the engines as bodies of
// revolution. It's drawn from the side, as a plane passing in the distance
// is seen from the ground: from a little below (VIEW_ELEVATION_DEG), so the
// far wing and engine hang just under the fuselage and the near wingtip's
// lights show. The ICAO type code each flight reports picks the family.
//
// Axes: s is the distance back from the nose, y is lateral (+y the far
// side, the left wing of a plane flying right), z is up from the bottom of
// the fuselage. On screen, x = L - s, so the nose points right.

export type AircraftFamily = 'narrow' | 'wide' | 'quad' | 'rear' | 'prop' | 'light' | 'heli';

export type AircraftLightKind = 'nav' | 'strobe' | 'beacon' | 'tail';

export interface AircraftDrawing {
    /** The silhouette, nose to the right */
    svg: string;
    /** Height over width of the drawing */
    aspect: number;
    /** The aircraft's length over the drawing's width (props and rotors reach past it) */
    lengthFrac: number;
    /** Where the fuselage's middle sits, as a percentage from the top */
    midTop: number;
    /** Lights seen from this side, as percentages of the drawing */
    lights: { kind: AircraftLightKind; left: number; top: number }[];
}

type P3 = [number, number, number];

interface Surface {
    rootLE: number; rootChord: number; semispan: number; sweep: number; tipChord: number;
    z: number; dihedral: number;
    /** Where the straight inboard trailing edge meets the swept one, as a fraction of the span */
    kink?: number;
    /** A raked tip: the last part of the span with a steeper leading edge */
    raked?: { frac: number; sweep: number };
    winglet?: { h: number; cant: number; rootChord: number; tipChord: number; sweep: number };
    /** A straight wing: constant chord inboard of the kink */
    constantInboard?: boolean;
}

interface Pod {
    y: number; s: number; len: number; r: number; z: number;
    kind?: 'fan' | 'prop' | 'pod';
    /** On the rear fuselage, on a short stub, not under the wing */
    rear?: boolean;
    /** Propeller radius, for a turboprop */
    prop?: number;
}

interface Spec {
    /** Length, m */
    L: number;
    body: {
        D: number; H: number;
        nose: { len: number; tipZ: number };
        tail: { len: number; tipZ: number; tipR: number; topExp?: number; botExp?: number };
        /** A raised top: the 747's upper deck, a helicopter's engine deck */
        hump?: { from: number; rise: number; flatTo: number; to: number; h: number };
    };
    wing?: Surface;
    ht?: Omit<Surface, 'kink'>;
    fin: { rootLE: number; rootChord: number; h: number; sweep: number; tipChord: number; dorsal: number };
    /** A T-tail: the tailplane on top of the fin */
    tTail?: { semispan: number; sweep: number; tipChord: number; dihedral: number };
    engines?: Pod[];
    pods?: Pod[];
    props?: { s: number; y: number; z: number; R: number }[];
    struts?: { s: number; y: number };
    wheels?: { s: number; y: number; z: number; R: number; w: number }[];
    rotor?: { s: number; z: number; R: number };
    skids?: { from: number; to: number; z: number; legs: number[] };
    /** Lights where there's no wing: a helicopter's */
    lights?: { nav: P3; strobe: P3; beacon: P3; tail: P3 };
}

const FAMILY_SPECS: Record<AircraftFamily, Spec> = {
    // Airbus A320neo
    narrow: {
        L: 37.57,
        body: { D: 3.95, H: 4.14, nose: { len: 5.6, tipZ: 0.42 }, tail: { len: 10.5, tipZ: 0.66, tipR: 0.22 } },
        wing: { rootLE: 12.9, rootChord: 6.6, kink: 0.34, semispan: 17.9, sweep: 27, tipChord: 1.55, z: 0.7, dihedral: 5.1,
            winglet: { h: 2.4, cant: 12, rootChord: 1.3, tipChord: 0.45, sweep: 42 } },
        engines: [{ y: 5.75, s: 10.2, len: 5.1, r: 1.22, z: -0.25 }],
        ht: { rootLE: 31.0, rootChord: 3.9, semispan: 6.22, sweep: 32, tipChord: 1.3, z: 2.6, dihedral: 6 },
        fin: { rootLE: 29.0, rootChord: 6.2, h: 5.9, sweep: 38, tipChord: 2.0, dorsal: 2.2 },
    },
    // Boeing 787-9, Airbus A350-900
    wide: {
        L: 63.7,
        body: { D: 5.77, H: 5.97, nose: { len: 7.8, tipZ: 0.42 }, tail: { len: 16, tipZ: 0.66, tipR: 0.3 } },
        wing: { rootLE: 22.0, rootChord: 11.8, kink: 0.3, semispan: 30.0, sweep: 33, tipChord: 2.2, z: 1.0, dihedral: 6,
            raked: { frac: 0.13, sweep: 52 } },
        engines: [{ y: 9.8, s: 17.4, len: 7.0, r: 1.85, z: -0.7 }],
        ht: { rootLE: 53.0, rootChord: 6.8, semispan: 9.6, sweep: 36, tipChord: 2.1, z: 3.8, dihedral: 6 },
        fin: { rootLE: 49.8, rootChord: 10.0, h: 8.8, sweep: 40, tipChord: 3.1, dorsal: 3.5 },
    },
    // Boeing 747-8, with its upper deck
    quad: {
        L: 76.3,
        body: { D: 6.5, H: 6.9, nose: { len: 7.5, tipZ: 0.38 }, tail: { len: 19, tipZ: 0.66, tipR: 0.35 },
            hump: { from: 0, rise: 10, flatTo: 22, to: 30, h: 2.0 } },
        wing: { rootLE: 25.5, rootChord: 15.0, kink: 0.28, semispan: 34.2, sweep: 37.5, tipChord: 3.0, z: 1.0, dihedral: 7,
            raked: { frac: 0.1, sweep: 55 } },
        engines: [{ y: 12.2, s: 22.2, len: 7.4, r: 1.6, z: -0.4 }, { y: 21.2, s: 30.0, len: 7.0, r: 1.5, z: 0.8 }],
        ht: { rootLE: 62.5, rootChord: 8.4, semispan: 11.0, sweep: 38, tipChord: 2.6, z: 4.4, dihedral: 7 },
        fin: { rootLE: 58.5, rootChord: 13.0, h: 11.5, sweep: 45, tipChord: 3.8, dorsal: 4 },
    },
    // Bombardier CRJ900: engines by the tail, a T-tail. Business jets fly it at their own length.
    rear: {
        L: 36.2,
        body: { D: 2.69, H: 2.69, nose: { len: 4.6, tipZ: 0.36 }, tail: { len: 10.5, tipZ: 0.6, tipR: 0.12, topExp: 1.5 } },
        wing: { rootLE: 15.2, rootChord: 4.6, kink: 0.25, semispan: 12.45, sweep: 27, tipChord: 1.05, z: 0.3, dihedral: 3,
            winglet: { h: 1.4, cant: 15, rootChord: 0.9, tipChord: 0.4, sweep: 45 } },
        engines: [{ y: 2.35, s: 24.2, len: 4.6, r: 0.82, z: 2.6, rear: true }],
        fin: { rootLE: 28.6, rootChord: 5.0, h: 3.9, sweep: 42, tipChord: 2.7, dorsal: 1.2 },
        tTail: { semispan: 4.3, sweep: 33, tipChord: 1.1, dihedral: -2 },
    },
    // ATR 72: a high straight wing, nacelles over the cabin line, a T-tail
    prop: {
        L: 27.17,
        body: { D: 2.57, H: 2.87, nose: { len: 3.2, tipZ: 0.42 }, tail: { len: 9.4, tipZ: 0.76, tipR: 0.12, botExp: 1.15 } },
        wing: { rootLE: 10.6, rootChord: 2.57, kink: 0.32, semispan: 13.5, sweep: 2, tipChord: 1.4, z: 2.95, dihedral: 2.5, constantInboard: true },
        engines: [{ y: 4.1, s: 7.4, len: 6.2, r: 0.62, z: 2.72, kind: 'prop', prop: 1.96 }],
        pods: [{ y: 1.3, s: 10.4, len: 4.8, r: 0.5, z: 0.25, kind: 'pod' }],
        fin: { rootLE: 20.4, rootChord: 4.3, h: 3.75, sweep: 38, tipChord: 1.95, dorsal: 3.5 },
        tTail: { semispan: 3.65, sweep: 14, tipChord: 1.1, dihedral: 0 },
    },
    // Cessna 172: a strut-braced high wing, fixed gear
    light: {
        L: 8.28,
        body: { D: 1.1, H: 1.45, nose: { len: 1.5, tipZ: 0.5 }, tail: { len: 4.9, tipZ: 0.66, tipR: 0.1, topExp: 0.8, botExp: 1.1 } },
        wing: { rootLE: 2.3, rootChord: 1.63, kink: 0.45, semispan: 5.5, sweep: 0, tipChord: 1.15, z: 1.5, dihedral: 1.7, constantInboard: true },
        props: [{ s: -0.05, y: 0, z: 0.72, R: 0.95 }],
        ht: { rootLE: 6.95, rootChord: 1.15, semispan: 1.73, sweep: 10, tipChord: 0.75, z: 0.92, dihedral: 0 },
        fin: { rootLE: 6.45, rootChord: 1.55, h: 1.15, sweep: 38, tipChord: 0.7, dorsal: 0.9 },
        struts: { s: 2.9, y: 2.6 },
        wheels: [{ s: 3.45, y: 1.2, z: -0.62, R: 0.19, w: 0.14 }, { s: 0.75, y: 0, z: -0.6, R: 0.17, w: 0.12 }],
    },
    // Airbus H135: a cabin pod and tail boom, the engine deck on top, skids
    heli: {
        L: 10.2,
        body: { D: 1.5, H: 1.55, nose: { len: 1.7, tipZ: 0.42 }, tail: { len: 6.0, tipZ: 0.62, tipR: 0.16, topExp: 0.45, botExp: 0.5 },
            hump: { from: 1.6, rise: 0.8, flatTo: 4.3, to: 5.3, h: 0.5 } },
        ht: { rootLE: 7.6, rootChord: 0.6, semispan: 1.3, sweep: 10, tipChord: 0.45, z: 1.05, dihedral: 0 },
        fin: { rootLE: 8.9, rootChord: 1.1, h: 1.25, sweep: 35, tipChord: 0.7, dorsal: 0 },
        rotor: { s: 3.2, z: 2.5, R: 5.1 },
        skids: { from: 1.5, to: 4.9, z: -0.5, legs: [2.2, 4.2] },
        lights: { nav: [7.95, -1.3, 1.05], strobe: [9.75, 0, 2.3], beacon: [3.2, 0, 0], tail: [10.1, 0, 1.2] },
    },
};

/**
 * Business jets fly the rear-engine shape at their own length (m), which is
 * half a CRJ's for the smallest. ICAO type codes.
 */
const BIZJET_LENGTHS: Record<string, number> = {
    C510: 12.4, C525: 13.0, C25M: 13.0, C25A: 14.4, C25B: 15.6, C25C: 16.3, C550: 14.4, C560: 14.9, C56X: 15.8,
    C650: 16.9, C680: 19.4, C68A: 19.0, C700: 22.3, C750: 22.0,
    CL30: 20.9, CL35: 20.9, CL60: 20.9, GL5T: 29.5, GLEX: 30.3, GL7T: 33.8,
    G150: 17.3, G280: 20.4, GLF3: 25.3, GLF4: 26.9, GLF5: 29.4, GLF6: 30.4, GA5C: 27.2, GA6C: 29.4, GA7C: 33.5, GA8C: 30.4,
    LJ31: 14.8, LJ35: 14.8, LJ40: 16.9, LJ45: 17.7, LJ60: 17.9, LJ75: 17.7,
    FA10: 13.9, FA20: 17.2, FA50: 18.5, F900: 20.2, F2TH: 20.2, FA7X: 23.2, FA8X: 24.5, FA6X: 25.7,
    E50P: 12.8, E55P: 15.9, E545: 19.7, E550: 20.7, E35L: 26.3,
    PC24: 16.9, HDJT: 13.0, PRM1: 14.0, BE40: 14.8, H25B: 15.6, H25C: 15.6, SF50: 9.4, EA50: 10.4,
};

/** ICAO type codes by family, checked in order (a C-130 before the Cessnas); anything else flies as a narrow-body. */
const FAMILY_CODES: [AircraftFamily, RegExp][] = [
    ['heli', /^(EC\d\d|H1[2-7]\d|H160|AS3\d|AS5[05]|AS6[15]|SA3\d\d|A1[0-8]9|AW\d{2,3}|R22|R44|R66|B06T?|B47G|B4(07|12|27|29|30)|B505|B212|B222|B230|BK17|S76|S92|S61|H60|UH1|MI8|MI17|NH90|EH10|MD52|MD60|H500|EXPL|ALO[23])$/],
    ['prop', /^(AT\d\w|ATP|DH8\w|DHC[678]|SF34|SB20|D328|D228|JS3\d|JS41|B190|BE20|BE30|BE9L|BE99|L410|AN2[4-8]|AN3[02]|AN12|Y12|E120|F27|F50|SW4|C212|CN35|C295|BN2P|P180|C130|A400|P3|SH36|MA60|IL18)$/],
    ['light', /^(C1\d\d|C2[0-1]\d|C3\d\d|C4\d\d|P28\w|PA\d\d|P32R|P46T|SR2\d|DA\d\d|DV20|BE3\d|BE2[3-4]|M20\w|RV\d+|DR40|TB\d+|AA5|G115|C42|PC6|PC7|PC9|PC12|PC21|TBM\d|M600|C208|T6|EV97|CRUZ|J3|PITT|XL2|S22T|TOBA)$/],
    ['quad', /^(B74\w|BLCF|A38\w|A34\w|IL96|IL76|IL62|A124|A225|B703|DC8\w|C5M?|C17|B461|B462|B463|RJ70|RJ85|RJ1H|VC10|K35R)$/],
    ['wide', /^(A30\w|A310|A33\w|A35\w|B76\w|B77\w|B78\w|MD11|DC10|L101|IL86|A3ST|BSCA)$/],
    ['rear', /^(CRJ\w|CL60|CL30|CL35|E135|E145|E35L|E45X|E50P|E55P|E545|E550|MD8\w|MD90|B712|DC9\w|F70|F100|F28|BA11|T134|T154|YK42|GL\w{2}|G150|G280|GLF\d|GA\dC|LJ\d\d|C5[0-9]\w|C6[58]\w|C700|C750|C25\w|C510|C525|FA\w{2}|F900|F2TH|PC24|HDJT|PRM1|BE40|H25\w|SF50|EA50|ASTR|GALX)$/],
];

/** The family to draw for an ICAO type code; unknown or missing codes fly as a narrow-body. */
export function aircraftFamily(code: string): AircraftFamily {
    const c = (code || '').trim().toUpperCase();
    if (!c) return 'narrow';
    for (const [family, pattern] of FAMILY_CODES) if (pattern.test(c)) return family;
    return 'narrow';
}

/** The aircraft's length in metres: a business jet's own, else its family's. */
export function aircraftLength(code: string, family: AircraftFamily = aircraftFamily(code)): number {
    return BIZJET_LENGTHS[(code || '').trim().toUpperCase()] ?? FAMILY_SPECS[family].L;
}

/** An A320's length, for which the card's base plane size (PLANE_WIDTH_PX) is set. */
const REFERENCE_LENGTH_M = 37.57;
/** Below 1, bigger aircraft look bigger but less so than in life: a 747 is 1.5 A320s, not 2. */
const LENGTH_EXPONENT = 0.6;
export const MIN_PLANE_PX = 16;
/** So a low jumbo never covers the temperature */
export const MAX_PLANE_PX = 80;

/**
 * How long the aircraft looks on the card, in px: the base size at the
 * altitude's scale, larger for longer aircraft. A legibility choice, not
 * true scale: true scale would make a low 747 cover the temperature and a
 * business jet at cruise a speck.
 */
export function planeLengthPx(lengthM: number, altitudeScale: number, basePx: number): number {
    const px = basePx * altitudeScale * (lengthM / REFERENCE_LENGTH_M) ** LENGTH_EXPONENT;
    return Math.min(MAX_PLANE_PX, Math.max(MIN_PLANE_PX, px));
}

/** How far below the plane the viewer is, in degrees: a plane in the distance */
export const VIEW_ELEVATION_DEG = 3;

const rad = (d: number) => (d * Math.PI) / 180;
const ell = (t: number) => Math.sqrt(Math.max(0, t * (2 - t)));
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Fuselage at station s: bottom and top heights and the half-width */
function section(spec: Spec, s: number): { zb: number; zt: number; a: number } {
    const { D, H, nose, tail, hump } = spec.body;
    let zb = 0, zt = H, a = D / 2;
    const noseZ = nose.tipZ * H;
    if (s < nose.len * 1.3) {
        if (s < nose.len * 0.8) zb = noseZ * (1 - ell(clamp01(s / (nose.len * 0.8))));
        zt = noseZ + (H - noseZ) * ell(clamp01(s / (nose.len * 1.3)));
        a = (D / 2) * ell(clamp01(s / nose.len));
    }
    if (s > spec.L - tail.len) {
        const u = clamp01((s - (spec.L - tail.len)) / tail.len);
        const tipZ = tail.tipZ * H;
        zb = Math.max(zb, (tipZ - tail.tipR) * u ** (tail.botExp ?? 1.5));
        zt = Math.min(zt, H - (H - (tipZ + tail.tipR)) * u ** (tail.topExp ?? 2.2));
        a = Math.max(tail.tipR, ((zt - zb) / 2) * (D / H));
    }
    if (hump && s >= hump.from && s < hump.to) {
        const base = hump.from === 0 ? noseZ : H;
        const top = s <= hump.flatTo
            ? base + (H + hump.h - base) * ell(clamp01((s - hump.from) / hump.rise))
            : H + hump.h * (0.5 + 0.5 * Math.cos(Math.PI * (s - hump.flatTo) / (hump.to - hump.flatTo)));
        zt = Math.max(zt, top);
    }
    return { zb, zt, a };
}

/** A wing or tailplane, both sides, plus where its tips are */
function surface(w: Surface, rootY: number): { polys: P3[][]; tip: (side: 1 | -1) => P3 } {
    const zAt = (y: number) => w.z + (y - rootY) * Math.tan(rad(w.dihedral));
    const leAt = (y: number) => {
        if (w.raked) {
            const yr = w.semispan * (1 - w.raked.frac);
            if (y > yr) return w.rootLE + (yr - rootY) * Math.tan(rad(w.sweep)) + (y - yr) * Math.tan(rad(w.raked.sweep));
        }
        return w.rootLE + (y - rootY) * Math.tan(rad(w.sweep));
    };
    const yk = rootY + (w.kink ?? 0) * (w.semispan - rootY);
    const tipLE = leAt(w.semispan);
    const outline: [number, number][] = [[w.rootLE, rootY]];
    if (w.raked) outline.push([leAt(w.semispan * (1 - w.raked.frac)), w.semispan * (1 - w.raked.frac)]);
    outline.push([tipLE, w.semispan], [tipLE + w.tipChord, w.semispan],
        [w.constantInboard ? leAt(yk) + w.rootChord : w.rootLE + w.rootChord, yk], [w.rootLE + w.rootChord, rootY]);
    const polys: P3[][] = [1, -1].map(side => outline.map(([s, y]) => [s, side * y, zAt(y)] as P3));
    if (w.winglet) {
        const g = w.winglet, z = zAt(w.semispan), le = tipLE + w.tipChord - g.rootChord;
        const back = g.h * Math.tan(rad(g.sweep));
        for (const side of [1, -1]) {
            const yo = side * (w.semispan + g.h * Math.sin(rad(g.cant)));
            polys.push([[le, side * w.semispan, z], [le + back, yo, z + g.h], [le + back + g.tipChord, yo, z + g.h], [le + g.rootChord, side * w.semispan, z]]);
        }
    }
    return { polys, tip: (side) => [tipLE + w.tipChord * 0.5, side * w.semispan, zAt(w.semispan)] };
}

/** An engine nacelle, prop nacelle or fairing: radius along its length */
function podProfile(p: Pod): [number, number][] {
    return Array.from({ length: 25 }, (_, i) => {
        const t = i / 24;
        let r: number;
        if (p.kind === 'prop') r = t < 0.14 ? 0.15 + 0.85 * ell(t / 0.14) : t < 0.6 ? 1 : 1 - 0.75 * ((t - 0.6) / 0.4) ** 1.4;
        else if (p.kind === 'pod') r = t < 0.3 ? ell(t / 0.3) : 1 - 0.6 * ((t - 0.3) / 0.7) ** 2;
        else r = t < 0.55 ? 0.84 + 0.16 * ell(clamp01(t / 0.15)) : t < 0.92 ? 1 - 0.38 * ((t - 0.55) / 0.37) ** 1.3 : 0.62 - 0.35 * (t - 0.92) / 0.08;
        return [p.s + t * p.len, Math.max(0.01, r * p.r)];
    });
}

/** Draw a family from the side: the projection of its model, with its lights. */
function draw(spec: Spec): AircraftDrawing {
    const se = Math.sin(rad(VIEW_ELEVATION_DEG)), ce = Math.cos(rad(VIEW_ELEVATION_DEG));
    const up = (y: number, z: number) => -y * se + z * ce;
    const X = (s: number) => spec.L - s;
    const solid: [number, number][][] = [];
    const lines: [number, number][][] = [];
    const veils: [number, number][][] = [];
    const poly = (pts: P3[]) => solid.push(pts.map(([s, y, z]) => [X(s), up(y, z)]));
    const H = spec.body.H;

    // The fuselage's outline: the extremes of each cross-section, seen from here
    const top: [number, number][] = [], bot: [number, number][] = [];
    const n = 60;
    for (let i = 0; i <= n; i++) {
        const s = spec.L * (0.5 - 0.5 * Math.cos(Math.PI * i / n));
        const { zb, zt, a } = section(spec, s);
        const zc = (zt + zb) / 2, b = (zt - zb) / 2;
        const ext = Math.sqrt((a * se) ** 2 + (b * ce) ** 2);
        top.push([X(s), zc * ce + ext]);
        bot.push([X(s), zc * ce - ext]);
    }
    solid.push([...top, ...bot.slice().reverse()]);

    const rootY = (spec.body.D / 2) * 0.85;
    const wing = spec.wing ? surface(spec.wing, rootY) : null;
    wing?.polys.forEach(poly);
    if (spec.ht) surface(spec.ht, spec.body.D * 0.18).polys.forEach(poly);

    // The fin, with its dorsal fillet
    const fin = spec.fin;
    const finTopLE = fin.rootLE + fin.h * Math.tan(rad(fin.sweep));
    const finRootZ = section(spec, fin.rootLE).zt - 0.15;
    const finTopZ = section(spec, fin.rootLE).zt + fin.h;
    poly([
        [fin.rootLE - fin.dorsal, 0, section(spec, fin.rootLE - fin.dorsal).zt - 0.05],
        [fin.rootLE - fin.dorsal * 0.35, 0, finRootZ + 0.12 * fin.h],
        [fin.rootLE + 0.18 * fin.h * Math.tan(rad(fin.sweep)), 0, finRootZ + 0.2 * fin.h],
        [finTopLE, 0, finTopZ], [finTopLE + fin.tipChord, 0, finTopZ],
        [fin.rootLE + fin.rootChord, 0, section(spec, fin.rootLE + fin.rootChord).zt - 0.1],
        [fin.rootLE + fin.rootChord * 0.6, 0, finRootZ - 0.3],
    ]);
    if (spec.tTail) {
        const t = spec.tTail;
        surface({ rootLE: finTopLE - 0.2, rootChord: fin.tipChord + 0.4, semispan: t.semispan, sweep: t.sweep,
            tipChord: t.tipChord, z: finTopZ - 0.15, dihedral: t.dihedral }, 0).polys.forEach(poly);
    }

    // Engines and fairings, both sides, each with what holds it on
    for (const p of [...(spec.engines ?? []), ...(spec.pods ?? [])]) {
        for (const side of [1, -1] as const) {
            const y = side * p.y, uc = up(y, p.z);
            const profile = podProfile(p);
            solid.push([...profile.map(([s, r]) => [X(s), uc + r] as [number, number]),
                ...profile.slice().reverse().map(([s, r]) => [X(s), uc - r] as [number, number])]);
            if (p.rear) {
                poly([[p.s + p.len * 0.4, side * 0.9, p.z - 0.1], [p.s + p.len * 0.68, side * 0.9, p.z - 0.1],
                    [p.s + p.len * 0.66, side * (p.y - p.r * 0.8), p.z], [p.s + p.len * 0.44, side * (p.y - p.r * 0.8), p.z]]);
            } else if (p.kind !== 'pod' && spec.wing) {
                const w = spec.wing;
                const zw = w.z + (p.y - rootY) * Math.tan(rad(w.dihedral));
                const le = w.rootLE + (p.y - rootY) * Math.tan(rad(w.sweep));
                poly([[p.s + p.len * 0.3, y, p.z + p.r * 0.7], [p.s + p.len * 0.95, y, p.z + p.r * 0.5], [le + w.rootChord * 0.55, y, zw], [le - 0.2, y, zw]]);
            }
            // A spinning propeller is a faint line, edge-on
            if (p.prop) lines.push([[X(p.s - 0.05), uc - p.prop], [X(p.s - 0.05), uc + p.prop]]);
        }
    }
    for (const p of spec.props ?? []) lines.push([[X(p.s), up(p.y, p.z) - p.R], [X(p.s), up(p.y, p.z) + p.R]]);

    // A light aircraft's struts and wheels
    if (spec.struts) {
        const st = spec.struts, wz = spec.wing!.z;
        for (const side of [1, -1]) poly([[st.s, side * 0.5, 0.3], [st.s + 0.22, side * 0.5, 0.3], [st.s + 0.25, side * st.y, wz], [st.s, side * st.y, wz]]);
    }
    for (const wh of spec.wheels ?? []) {
        for (const side of wh.y ? [1, -1] : [0]) {
            const uc = up(side * wh.y, wh.z), ry = wh.R * ce + (wh.w / 2) * se;
            solid.push(Array.from({ length: 16 }, (_, i) => {
                const t = (i / 16) * Math.PI * 2;
                return [X(wh.s) + wh.R * Math.cos(t), uc + ry * Math.sin(t)] as [number, number];
            }));
            poly([[wh.s - 0.05, side * wh.y * 0.4, 0.15], [wh.s + 0.08, side * wh.y * 0.4, 0.15], [wh.s + 0.04, side * wh.y, wh.z], [wh.s - 0.04, side * wh.y, wh.z]]);
        }
    }

    // A helicopter's rotor (a faint disc, nearly edge-on), mast and skids
    if (spec.rotor) {
        const r = spec.rotor;
        veils.push(Array.from({ length: 32 }, (_, i) => {
            const t = (i / 32) * Math.PI * 2;
            return [X(r.s + r.R * Math.cos(t)), up(r.R * Math.sin(t), r.z)] as [number, number];
        }));
        poly([[r.s - 0.12, 0, H], [r.s + 0.12, 0, H], [r.s + 0.1, 0, r.z], [r.s - 0.1, 0, r.z]]);
        poly([[r.s - 0.45, 0, r.z - 0.08], [r.s + 0.45, 0, r.z - 0.08], [r.s + 0.3, 0, r.z + 0.12], [r.s - 0.3, 0, r.z + 0.12]]);
    }
    if (spec.skids) {
        const k = spec.skids;
        for (const side of [1, -1]) {
            const y = side * 1.0;
            poly([[k.from - 0.35, y, k.z + 0.25], [k.from, y, k.z + 0.04], [k.to, y, k.z + 0.04], [k.to, y, k.z - 0.04], [k.from, y, k.z - 0.04], [k.from - 0.4, y, k.z + 0.2]]);
            for (const s of k.legs) poly([[s - 0.05, side * 0.6, 0.1], [s + 0.05, side * 0.6, 0.1], [s + 0.05, y, k.z], [s - 0.05, y, k.z]]);
        }
    }

    // Lights, as they're placed: green on the right wingtip, red on the
    // left, white strobes at the tips, the red beacon on the belly, white
    // at the tail. From this side only the near wingtip shows; a far-side
    // light behind the fuselage is hidden.
    const fuselageAt = (x: number) => {
        const i = top.findIndex(([tx]) => tx <= x);
        return i < 0 ? null : { top: top[i][1], bot: bot[i][1] };
    };
    const lights: { kind: AircraftLightKind; x: number; u: number }[] = [];
    const light = (kind: AircraftLightKind, [s, y, z]: P3) => {
        const x = X(s), u = up(y, z), body = fuselageAt(x);
        if (y > 0 && body && u < body.top && u > body.bot) return;
        lights.push({ kind, x, u });
    };
    const anchors = spec.lights ?? (wing && {
        nav: wing.tip(-1),
        strobe: wing.tip(-1),
        beacon: [spec.wing!.rootLE + spec.wing!.rootChord * 0.45, 0, 0] as P3,
        tail: [spec.L - 0.1, 0, spec.body.tail.tipZ * H] as P3,
    });
    if (anchors) {
        light('nav', anchors.nav);
        light('strobe', anchors.strobe);
        light('beacon', anchors.beacon);
        light('tail', anchors.tail);
    }

    // The drawing's box, a little margin round everything
    const all = [...solid.flat(), ...lines.flat(), ...veils.flat()];
    const xs = all.map(p => p[0]), us = all.map(p => p[1]);
    const pad = spec.L * 0.015;
    const box = { x: Math.min(...xs) - pad, y: -(Math.max(...us) + pad) };
    const w = Math.max(...xs) - Math.min(...xs) + 2 * pad;
    const h = Math.max(...us) - Math.min(...us) + 2 * pad;
    const pt = ([x, u]: [number, number]) => `${x.toFixed(2)} ${(-u).toFixed(2)}`;
    const path = (shapes: [number, number][][], close: boolean) => shapes.map(s => 'M' + s.map(pt).join('L') + (close ? 'Z' : '')).join('');
    const pct = (x: number, u: number) => ({ left: ((x - box.x) / w) * 100, top: ((-u - box.y) / h) * 100 });
    const midS = spec.L * 0.5, mid = section(spec, midS);

    const svg = `<svg class="plane-svg" viewBox="${box.x.toFixed(2)} ${box.y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}" aria-hidden="true">`
        + `<path fill="currentColor" d="${path(solid, true)}"/>`
        + (veils.length ? `<path fill="currentColor" fill-opacity="0.22" d="${path(veils, true)}"/>` : '')
        + (lines.length ? `<path fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" vector-effect="non-scaling-stroke" d="${path(lines, false)}"/>` : '')
        + '</svg>';
    return {
        svg,
        aspect: h / w,
        lengthFrac: spec.L / w,
        midTop: pct(X(midS), ((mid.zt + mid.zb) / 2) * ce).top,
        lights: lights.map(l => ({ kind: l.kind, ...pct(l.x, l.u) })),
    };
}

const drawings = new Map<AircraftFamily, AircraftDrawing>();

/** A family's drawing, made the first time it flies. */
export function aircraftDrawing(family: AircraftFamily): AircraftDrawing {
    let drawing = drawings.get(family);
    if (!drawing) {
        drawing = draw(FAMILY_SPECS[family]);
        drawings.set(family, drawing);
    }
    return drawing;
}

/** Families with a nose that drops in forward flight: a helicopter flies tilted forward */
export const FORWARD_PITCH_DEG: Partial<Record<AircraftFamily, number>> = { heli: 4 };
