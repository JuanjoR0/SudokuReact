export function tableroVacio() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export const DEMO = {
  facil: [
    "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79"
  ],
  medio: [
    "..32....6....4..9.1.2...5..7...29....4.3.7.5....81...2..1...8.3.2..8....9....46.."
  ],
  dificil: [
    "...3..8..64.8...5.875.....15...7.2.6....9....2.9.8...54.....769.2...8.13..7..5..."
  ]
};

export function esColocacionValida(t, f, c, num) {
  for (let i = 0; i < 9; i++) {
    if (t[f][i] === num || t[i][c] === num) return false;
  }
  let bf = Math.floor(f / 3) * 3,
    bc = Math.floor(c / 3) * 3;
  for (let ff = bf; ff < bf + 3; ff++) {
    for (let cc = bc; cc < bc + 3; cc++) {
      if (t[ff][cc] === num) return false;
    }
  }
  return true;
}

export function esTableroValido(t) {
  for (let f = 0; f < 9; f++) {
    const seen = new Set();
    for (let c = 0; c < 9; c++) {
      const v = t[f][c];
      if (v === 0) continue;
      if (seen.has(v)) return false;
      seen.add(v);
    }
  }
  for (let c = 0; c < 9; c++) {
    const seen = new Set();
    for (let f = 0; f < 9; f++) {
      const v = t[f][c];
      if (v === 0) continue;
      if (seen.has(v)) return false;
      seen.add(v);
    }
  }
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const seen = new Set();
      for (let f = br; f < br + 3; f++) {
        for (let c = bc; c < bc + 3; c++) {
          const v = t[f][c];
          if (v === 0) continue;
          if (seen.has(v)) return false;
          seen.add(v);
        }
      }
    }
  }
  return true;
}

export function resolverSudoku(t) {
  function buscarVacia(tab) {
    for (let f = 0; f < 9; f++)
      for (let c = 0; c < 9; c++)
        if (tab[f][c] === 0) return [f, c];
    return null;
  }

  function retroceso(tab) {
    let pos = buscarVacia(tab);
    if (!pos) return true;
    let [f, c] = pos;
    for (let n = 1; n <= 9; n++) {
      if (esColocacionValida(tab, f, c, n)) {
        tab[f][c] = n;
        if (retroceso(tab)) return true;
        tab[f][c] = 0;
      }
    }
    return false;
  }

  let copia = JSON.parse(JSON.stringify(t));
  let ok = retroceso(copia);
  return { ok, solucion: copia };
}

export function cargarDesdeCadena(str) {
  let t = tableroVacio();
  for (let i = 0; i < 81; i++) {
    t[Math.floor(i / 9)][i % 9] = str[i] === "." ? 0 : Number(str[i]);
  }
  return t;
}
