import React, { useState, useEffect } from "react";
import {tableroVacio,DEMO,esTableroValido,resolverSudoku,esColocacionValida,cargarDesdeCadena,} from "./sudokuUtils";

function App() {
  const [fijas, setFijas] = useState(() => {
    const fijasGuardado = localStorage.getItem("sudoku_fijas");
    return fijasGuardado ? JSON.parse(fijasGuardado) : [];
  });
  const [mensaje, setMensaje] = useState("");
  const [corriendo, setCorriendo] = useState(false);
  const [dificultad, setDificultad] = useState("facil");
  const [board, setBoard] = useState(() => {
    const guardado = localStorage.getItem("sudoku_board");
    return guardado ? JSON.parse(guardado) : tableroVacio();
  });

  const [tiempo, setTiempo] = useState(() => {
    const tiempoGuardado = localStorage.getItem("sudoku_time");
    return tiempoGuardado ? Number(tiempoGuardado) : 0;
  });

  useEffect(() => {
    let intervalo = null;
    if (corriendo) intervalo = setInterval(() => setTiempo(t => t + 1), 1000);
    return () => clearInterval(intervalo);
  }, [corriendo]);

  useEffect(() => {
    localStorage.setItem("sudoku_board", JSON.stringify(board));
    localStorage.setItem("sudoku_time", tiempo);
    localStorage.setItem("sudoku_fijas", JSON.stringify(fijas));
  }, [board, tiempo, fijas]);

  const handleChange = (fila, col, valor) => {
    if (fijas[fila][col]) return;
    if (!/^[1-9]?$/.test(valor)) return;
    const nuevo = board.map(r => [...r]);
    nuevo[fila][col] = valor === "" ? 0 : Number(valor);
    setBoard(nuevo);
  };

  const validar = () => {
    setMensaje(
      esTableroValido(board)
        ? "Tablero válido"
        : "Tablero inválido"
    );
  };

  const limpiarNoFijas = (t, maskFijas) => {
    const base = t.map((fila, f) =>
      fila.map((v, c) => (maskFijas[f][c] ? v : 0))
    );
    return base;
  };

  const resolver = () => {
    const base = limpiarNoFijas(board, fijas);
    const { ok, solucion } = resolverSudoku(base);
    if (ok) {
      setBoard(solucion);
      setMensaje("Sudoku resuelto (corrigiendo los numeros incorrectos)");
    } else {
      setMensaje("No se pudo resolver");
    }
  };

  const limpiar = () => {
    setBoard(tableroVacio());
    setFijas(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setMensaje("Tablero limpio");
  };

  const generar = () => {
    const lista = DEMO[dificultad];
    if (!lista) return;
    const t = cargarDesdeCadena(lista[0]);
    const mask = t.map(fila => fila.map(v => v !== 0));
    setBoard(t);
    setFijas(mask);
    setMensaje("Sudoku generado");
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60), ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  return (
    <div className="container">
      <h1>Sudoku Solver</h1>
      <p className="sub">Proyecto con React (backtracking, validaciones y localStorage)</p>

      <div className="app">
        <section className="card">
          <div className="toolbar">
            <button className="primary" onClick={generar}>Generar Sudoku</button>
            <select value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
            </select>
            <button onClick={validar}>Validar</button>
            <button className="primary" onClick={resolver}>Resolver</button>
            <button className="danger" onClick={limpiar}>Limpiar</button>
          </div>

          <div id="grid" className="grid">
            {board.map((fila, f) =>
              fila.map((valor, c) => (
                <input
                  key={`${f}-${c}`}
                  className={`su ${fijas[f][c] && valor !== 0 ? "prefilled" : ""}`}
                  maxLength="1"
                  value={valor === 0 ? "" : valor}
                  disabled={fijas[f][c]}
                  onChange={(e) => handleChange(f, c, e.target.value)}
                />
              ))
            )}
          </div>

          <div id="message" className="msg">{mensaje}</div>
        </section>

        <aside className="card panel">
          <div className="stat">
            <span className="muted">Tiempo</span>
            <strong>{formatTime(tiempo)}</strong>
          </div>
          <div className="stat">
            <span className="muted">Celdas vacías</span>
            <strong>{board.flat().filter((x) => x === 0).length}</strong>
          </div>
          <div className="toolbar">
            <button onClick={() => setCorriendo(true)}>Iniciar</button>
            <button onClick={() => setCorriendo(false)}>Pausar</button>
            <button onClick={() => { setTiempo(0); setCorriendo(false); }}>Reiniciar</button>
          </div>
          <p className="foot">Estado y tiempo se guardan automáticamente.</p>
        </aside>
      </div>
    </div>
  );
}

export default App;
