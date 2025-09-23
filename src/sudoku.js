export function tableroVacio() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function esColocacionValida(tablero, fila, col, num) {
  for (let i = 0; i < 9; i++) {
    if (tablero[fila][i] === num || tablero[i][col] === num) return false;
  }
  let bf = Math.floor(fila / 3) * 3;
  let bc = Math.floor(col / 3) * 3;
  for (let f = bf; f < bf + 3; f++) {
    for (let c = bc; c < bc + 3; c++) {
      if (tablero[f][c] === num) return false;
    }
  }
  return true;
}

export function esTableroValido(tablero) {
  for (let f = 0; f < 9; f++) {
    for (let c = 0; c < 9; c++) {
      let v = tablero[f][c];
      if (v !== 0) {
        tablero[f][c] = 0;
        if (!esColocacionValida(tablero, f, c, v)) return false;
        tablero[f][c] = v;
      }
    }
  }
  return true;
}

export function resolverSudoku(tablero) {
  function buscarVacia(tablero) {
    for (let f = 0; f < 9; f++) {
      for (let c = 0; c < 9; c++) {
        if (tablero[f][c] === 0) return [f, c];
      }
    }
    return null;
  }

  let pasos = 0;

  function retroceso() {
    let hueco = buscarVacia(tablero);
    if (!hueco) return true;
    let [f, c] = hueco;
    for (let n = 1; n <= 9; n++) {
      if (esColocacionValida(tablero, f, c, n)) {
        tablero[f][c] = n;
        pasos++;
        if (retroceso()) return true;
        tablero[f][c] = 0;
      }
    }
    return false;
  }

  let resuelto = retroceso();
  return { ok: resuelto, pasos };
}
