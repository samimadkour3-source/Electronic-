export type SimComponentType =
  | 'battery'
  | 'resistor'
  | 'potentiometer'
  | 'led'
  | 'diode'
  | 'zener'
  | 'switch'
  | 'ldr'
  | 'fuse'
  | 'buzzer'
  | 'ground';

export interface SimComponent {
  id: string;
  type: SimComponentType;
  label: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  /** Resistance in Ohms (for resistor/ldr), Voltage in V (for battery) */
  value: number;
  /** Switch closed state */
  closed?: boolean;
  /** LDR light percentage 0 (dark) .. 100 (bright) */
  lightLevel?: number;
}

export interface SimWire {
  id: string;
  fromCompId: string;
  fromPort: 0 | 1;
  toCompId: string;
  toPort: 0 | 1;
}

export interface ComponentSimResult {
  voltageDrop: number; // V_port1 - V_port0 or V_port0 - V_port1
  currentMa: number;
  powerMw: number;
  conducting: boolean;
  brightness: number; // 0..1 for LED
  overcurrent: boolean;
}

export interface CircuitSimOutput {
  nodeVoltages: Record<string, number>; // key: `${compId}:${port}`
  components: Record<string, ComponentSimResult>;
  status: 'ok' | 'short_circuit' | 'no_power' | 'empty';
  messageAr: string;
  messageFr: string;
  messageEn: string;
}

function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  if (n === 0) return [];
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      const val = Math.abs(M[row][col]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = row;
      }
    }
    if (maxVal < 1e-12) continue;

    [M[col], M[maxRow]] = [M[maxRow], M[col]];
    const pivot = M[col][col];
    for (let j = col; j <= n; j++) {
      M[col][j] /= pivot;
    }
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row][col];
      if (Math.abs(factor) < 1e-15) continue;
      for (let j = col; j <= n; j++) {
        M[row][j] -= factor * M[col][j];
      }
    }
  }

  return M.map((row) => row[n]);
}

export function getEffectiveResistance(comp: SimComponent): number {
  if (comp.type === 'resistor' || comp.type === 'potentiometer') return Math.max(1, comp.value);
  if (comp.type === 'switch') return comp.closed ? 0.05 : 1e8;
  if (comp.type === 'fuse') return comp.closed === false ? 1e8 : 0.1;
  if (comp.type === 'buzzer') return 250;
  if (comp.type === 'ldr') {
    const light = comp.lightLevel ?? 50;
    // Exponential curve from 100kOhm (0% light) down to 400 Ohm (100% light)
    return Math.round(100000 * Math.pow(0.004, light / 100));
  }
  return 1000;
}

export function simulateCircuit(
  components: SimComponent[],
  wires: SimWire[]
): CircuitSimOutput {
  if (components.length === 0) {
    return {
      nodeVoltages: {},
      components: {},
      status: 'empty',
      messageAr: 'اسحب العناصر إلى لوحة العمل وقم بتوصيل أطرافها لبدء المحاكاة.',
      messageFr: 'Glissez ou ajoutez des composants sur le plan et reliez leurs bornes pour simuler.',
      messageEn: 'Drag or add components onto the board and connect their terminals to start simulating.',
    };
  }

  const batteries = components.filter((c) => c.type === 'battery');
  if (batteries.length === 0) {
    return {
      nodeVoltages: {},
      components: {},
      status: 'no_power',
      messageAr: 'أضف بطارية (مصدر جهد) ووصّلها بالدائرة لرؤية الفولتية والتيار.',
      messageFr: 'Ajoutez une pile (source de tension) et reliez-la au circuit pour voir tensions et courants.',
      messageEn: 'Add a DC battery source and connect it to the circuit to measure voltage and current.',
    };
  }

  // Build terminal keys and Union-Find for electrical nodes
  const parent: Record<string, string> = {};
  const find = (k: string): string => {
    if (!parent[k]) parent[k] = k;
    if (parent[k] !== k) parent[k] = find(parent[k]);
    return parent[k];
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };

  for (const c of components) {
    find(`${c.id}:0`);
    if (c.type !== 'ground') {
      find(`${c.id}:1`);
    }
  }

  for (const w of wires) {
    union(`${w.fromCompId}:${w.fromPort}`, `${w.toCompId}:${w.toPort}`);
  }

  // Group ground terminals together
  const groundComps = components.filter((c) => c.type === 'ground');
  let groundRoot: string;
  if (groundComps.length > 0) {
    groundRoot = find(`${groundComps[0].id}:0`);
    for (let i = 1; i < groundComps.length; i++) {
      union(`${groundComps[0].id}:0`, `${groundComps[i].id}:0`);
    }
    groundRoot = find(`${groundComps[0].id}:0`);
  } else {
    // Auto-reference negative terminal (port 0) of first battery as 0V
    groundRoot = find(`${batteries[0].id}:0`);
  }

  // Map non-ground roots to indices 0..numNodes-1
  const rootToIdx: Record<string, number> = {};
  let numNodes = 0;
  for (const k of Object.keys(parent)) {
    const r = find(k);
    if (r !== groundRoot && rootToIdx[r] === undefined) {
      rootToIdx[r] = numNodes++;
    }
  }

  const getNodeIdx = (compId: string, port: 0 | 1): number => {
    const r = find(`${compId}:${port}`);
    return r === groundRoot ? -1 : rootToIdx[r];
  };

  // Iterative piecewise solver for diodes/LEDs and Zener diodes
  const diodeState: Record<string, 'fwd' | 'rev_zener' | 'off'> = {};
  for (const c of components) {
    if (c.type === 'diode' || c.type === 'led' || c.type === 'zener') {
      diodeState[c.id] = 'fwd';
    }
  }

  let finalNodeV: number[] = new Array(numNodes).fill(0);
  let finalBatteryCurrents: Record<string, number> = {};

  for (let iter = 0; iter < 10; iter++) {
    // Voltage sources = batteries + conducting diodes/LEDs (modeled as Vf source + R_on)
    const voltageSources: {
      id: string;
      nPos: number;
      nNeg: number;
      voltage: number;
      seriesR: number;
    }[] = [];

    for (const b of batteries) {
      voltageSources.push({
        id: b.id,
        nPos: getNodeIdx(b.id, 1), // port 1 = +
        nNeg: getNodeIdx(b.id, 0), // port 0 = -
        voltage: b.value,
        seriesR: 0.05, // tiny internal resistance prevents singular loops
      });
    }

    const numVS = voltageSources.length;
    const size = numNodes + numVS;
    const A: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));
    const z: number[] = new Array(size).fill(0);

    // Small leakage conductance to ground for floating islands (prevents singular matrix)
    for (let i = 0; i < numNodes; i++) {
      A[i][i] += 1e-9;
    }

    const stampResistor = (n1: number, n2: number, r: number) => {
      const g = 1 / Math.max(0.01, r);
      if (n1 >= 0) A[n1][n1] += g;
      if (n2 >= 0) A[n2][n2] += g;
      if (n1 >= 0 && n2 >= 0) {
        A[n1][n2] -= g;
        A[n2][n1] -= g;
      }
    };

    const stampCurrentSource = (nFrom: number, nTo: number, current: number) => {
      if (nFrom >= 0) z[nFrom] -= current;
      if (nTo >= 0) z[nTo] += current;
    };

    for (const c of components) {
      if (
        c.type === 'resistor' ||
        c.type === 'potentiometer' ||
        c.type === 'switch' ||
        c.type === 'ldr' ||
        c.type === 'fuse' ||
        c.type === 'buzzer'
      ) {
        const n0 = getNodeIdx(c.id, 0);
        const n1 = getNodeIdx(c.id, 1);
        stampResistor(n0, n1, getEffectiveResistance(c));
      } else if (c.type === 'diode' || c.type === 'led' || c.type === 'zener') {
        // Port 0 = Anode (+), Port 1 = Cathode (-)
        const nA = getNodeIdx(c.id, 0);
        const nK = getNodeIdx(c.id, 1);
        const vf = c.type === 'led' ? 2.0 : 0.7;
        const rOn = c.type === 'led' ? 18 : 8;
        const st = diodeState[c.id];
        if (st === 'fwd') {
          stampResistor(nA, nK, rOn);
          stampCurrentSource(nA, nK, vf / rOn);
        } else if (st === 'rev_zener' && c.type === 'zener') {
          const vz = Math.max(2.4, c.value || 5.1);
          stampResistor(nK, nA, 6);
          stampCurrentSource(nK, nA, vz / 6);
        } else {
          stampResistor(nA, nK, 1e7);
        }
      }
    }

    // Stamp batteries with tiny series resistance
    voltageSources.forEach((vs, k) => {
      const idx = numNodes + k;
      if (vs.nPos >= 0) {
        A[vs.nPos][idx] += 1;
        A[idx][vs.nPos] += 1;
      }
      if (vs.nNeg >= 0) {
        A[vs.nNeg][idx] -= 1;
        A[idx][vs.nNeg] -= 1;
      }
      A[idx][idx] -= vs.seriesR;
      z[idx] = vs.voltage;
    });

    const sol = solveLinearSystem(A, z);
    if (!sol) break;

    finalNodeV = sol.slice(0, numNodes);
    finalBatteryCurrents = {};
    voltageSources.forEach((vs, k) => {
      finalBatteryCurrents[vs.id] = -sol[numNodes + k]; // positive current leaving + terminal
    });

    // Check diode/LED/Zener state convergence
    let changed = false;
    for (const c of components) {
      if (c.type === 'diode' || c.type === 'led' || c.type === 'zener') {
        const nA = getNodeIdx(c.id, 0);
        const nK = getNodeIdx(c.id, 1);
        const vA = nA >= 0 ? finalNodeV[nA] : 0;
        const vK = nK >= 0 ? finalNodeV[nK] : 0;
        const vf = c.type === 'led' ? 2.0 : 0.7;
        const rOn = c.type === 'led' ? 18 : 8;
        const vDiff = vA - vK;
        const curState = diodeState[c.id];
        let nextState: 'fwd' | 'rev_zener' | 'off' = 'off';

        if (c.type === 'zener') {
          const vz = Math.max(2.4, c.value || 5.1);
          if (curState === 'fwd') {
            nextState = (vDiff - vf) / rOn > 1e-5 ? 'fwd' : -vDiff > vz ? 'rev_zener' : 'off';
          } else if (curState === 'rev_zener') {
            nextState = (-vDiff - vz) / 6 > 1e-5 ? 'rev_zener' : vDiff > vf ? 'fwd' : 'off';
          } else {
            nextState = vDiff > vf ? 'fwd' : -vDiff > vz ? 'rev_zener' : 'off';
          }
        } else {
          const current = curState === 'fwd' ? (vDiff - vf) / rOn : vDiff / 1e7;
          nextState = (curState === 'fwd' ? current > 1e-5 : vDiff > vf) ? 'fwd' : 'off';
        }

        if (nextState !== curState) {
          diodeState[c.id] = nextState;
          changed = true;
        }
      }
    }
    if (!changed) break;
  }

  // Collect outputs
  const nodeVoltages: Record<string, number> = {};
  for (const c of components) {
    const idx0 = getNodeIdx(c.id, 0);
    nodeVoltages[`${c.id}:0`] = idx0 >= 0 ? Number(finalNodeV[idx0].toFixed(2)) : 0;
    if (c.type !== 'ground') {
      const idx1 = getNodeIdx(c.id, 1);
      nodeVoltages[`${c.id}:1`] = idx1 >= 0 ? Number(finalNodeV[idx1].toFixed(2)) : 0;
    }
  }

  const compResults: Record<string, ComponentSimResult> = {};
  let hasShortCircuit = false;
  let hasActiveFlow = false;

  for (const c of components) {
    const v0 = nodeVoltages[`${c.id}:0`] ?? 0;
    const v1 = nodeVoltages[`${c.id}:1`] ?? 0;

    if (c.type === 'ground') {
      compResults[c.id] = {
        voltageDrop: 0,
        currentMa: 0,
        powerMw: 0,
        conducting: true,
        brightness: 0,
        overcurrent: false,
      };
      continue;
    }

    if (c.type === 'battery') {
      const iAmps = finalBatteryCurrents[c.id] ?? 0;
      const iMa = Math.abs(iAmps * 1000);
      if (iMa > 2000) hasShortCircuit = true;
      if (iMa > 0.05) hasActiveFlow = true;
      compResults[c.id] = {
        voltageDrop: Number(Math.abs(v1 - v0).toFixed(2)),
        currentMa: Number(iMa.toFixed(1)),
        powerMw: Number((Math.abs(v1 - v0) * iMa).toFixed(1)),
        conducting: iMa > 0.05,
        brightness: 0,
        overcurrent: iMa > 2000,
      };
      continue;
    }

    if (
      c.type === 'resistor' ||
      c.type === 'potentiometer' ||
      c.type === 'switch' ||
      c.type === 'ldr' ||
      c.type === 'fuse' ||
      c.type === 'buzzer'
    ) {
      const r = getEffectiveResistance(c);
      const vDrop = Math.abs(v0 - v1);
      const iMa = (vDrop / r) * 1000;
      if (iMa > 0.05) hasActiveFlow = true;
      const fuseLimitMa = Math.max(50, c.value || 250);
      const overcurrent = c.type === 'fuse' ? iMa > fuseLimitMa : c.type === 'buzzer' ? vDrop > 9 : false;
      const brightness = c.type === 'buzzer' && vDrop >= 2.5 ? Math.min(1, vDrop / 5) : 0;
      compResults[c.id] = {
        voltageDrop: Number(vDrop.toFixed(2)),
        currentMa: Number(iMa.toFixed(2)),
        powerMw: Number((vDrop * iMa).toFixed(1)),
        conducting: iMa > 0.01,
        brightness,
        overcurrent,
      };
      continue;
    }

    if (c.type === 'diode' || c.type === 'led' || c.type === 'zener') {
      const st = diodeState[c.id];
      const vf = c.type === 'led' ? 2.0 : 0.7;
      const rOn = c.type === 'led' ? 18 : 8;
      const vDiff = v0 - v1; // Anode (0) - Cathode (1)
      let iMa = 0;
      if (st === 'fwd') {
        iMa = Math.max(0, ((vDiff - vf) / rOn) * 1000);
      } else if (st === 'rev_zener' && c.type === 'zener') {
        const vz = Math.max(2.4, c.value || 5.1);
        iMa = Math.max(0, ((-vDiff - vz) / 6) * 1000);
      }
      if (iMa > 0.05) hasActiveFlow = true;
      const brightness = c.type === 'led' && st === 'fwd' ? Math.min(1, iMa / 18) : 0;
      const overcurrent = c.type === 'led' && iMa > 30;
      compResults[c.id] = {
        voltageDrop: Number(Math.abs(vDiff).toFixed(2)),
        currentMa: Number(iMa.toFixed(2)),
        powerMw: Number((Math.abs(vDiff) * iMa).toFixed(1)),
        conducting: st !== 'off' && iMa > 0.05,
        brightness,
        overcurrent,
      };
    }
  }

  if (hasShortCircuit) {
    return {
      nodeVoltages,
      components: compResults,
      status: 'short_circuit',
      messageAr: 'تنبيه قصر (Short Circuit)! هناك مسار مباشر بدون مقاومة كافية بين قطبي البطارية.',
      messageFr: 'Alerte court-circuit ! Un chemin direct sans résistance suffisante relie les bornes de la pile.',
      messageEn: 'Short Circuit Alert! A low-resistance path directly shorts the battery terminals.',
    };
  }

  if (!hasActiveFlow) {
    return {
      nodeVoltages,
      components: compResults,
      status: 'ok',
      messageAr: 'الدائرة مفتوحة حالياً (لا يمر تيار). تأكد من إغلاق المسار أو تشغيل المفتاح أو فحص قطبية الدايود.',
      messageFr: 'Circuit ouvert (aucun courant). Fermez la boucle, actionnez l’interrupteur ou vérifiez la polarité.',
      messageEn: 'Open circuit (zero current flow). Complete the loop, close the switch, or check diode polarity.',
    };
  }

  return {
    nodeVoltages,
    components: compResults,
    status: 'ok',
    messageAr: 'الدائرة تعمل بنجاح! اضغط على أي عنصر أو طرف لقراءة الجهد والتيار بدقة.',
    messageFr: 'Circuit actif ! Cliquez sur un composant pour consulter sa tension, son courant et sa puissance.',
    messageEn: 'Circuit active! Tap any component to inspect live voltage drop, current, and power.',
  };
}
