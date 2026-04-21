import { useState, useEffect, useCallback, useRef } from 'react'
import Field from './components/Field'
import FormationSelector from './components/FormationSelector'
import ExportButton from './components/ExportButton'
import { FORMATIONS, DEFAULT_FORMATION } from './data/formations'
import './index.css'

function loadPlayers(formation) {
  try {
    const saved = localStorage.getItem('football-tactics-players')
    if (!saved) return FORMATIONS[formation]
    const savedPlayers = JSON.parse(saved)
    return FORMATIONS[formation].map((p) => {
      const s = savedPlayers.find((sp) => sp.id === p.id)
      return s ? { ...p, alias: s.alias, dorsal: s.dorsal } : p
    })
  } catch {
    return FORMATIONS[formation]
  }
}

export default function App() {
  const [formation, setFormation] = useState(DEFAULT_FORMATION)
  const [players, setPlayers] = useState(() => loadPlayers(DEFAULT_FORMATION))
  const fieldRef = useRef(null)
  const saveTimer = useRef(null)

  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem('football-tactics-players', JSON.stringify(players))
    }, 500)
    return () => clearTimeout(saveTimer.current)
  }, [players])

  const handleFormationChange = useCallback((f) => {
    setFormation(f)
    setPlayers((prev) =>
      FORMATIONS[f].map((np) => {
        const existing = prev.find((p) => p.id === np.id)
        return existing ? { ...np, alias: existing.alias, dorsal: existing.dorsal } : np
      })
    )
  }, [])

  const handleMove = useCallback((id, x, y) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)))
  }, [])

  const handleUpdate = useCallback((id, data) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }, [])

  const handleReset = useCallback(() => {
    setFormation(DEFAULT_FORMATION)
    setPlayers(FORMATIONS[DEFAULT_FORMATION])
  }, [])

  return (
    <div
      className="w-screen h-[100dvh] bg-black flex flex-col overflow-hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <div>
          <p
            className="text-red-400 font-black text-base leading-none tracking-widest"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            XI INICIAL
          </p>
          <p
            className="text-white/40 text-[10px] tracking-widest mt-0.5"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {formation}
          </p>
        </div>

        {/* Hint center */}
        <p
          className="text-white/25 text-[8px] tracking-widest text-center"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          TAP EDITAR{'\n'}DRAG MOVER
        </p>

        {/* Spacer to balance */}
        <div className="w-[72px]" />
      </div>

      {/* ── CAMPO ── flex-1 para llenar todo el espacio disponible */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Field
          players={players}
          onMove={handleMove}
          onUpdate={handleUpdate}
          fieldRef={fieldRef}
        />
      </div>

      {/* ── BOTTOM BAR ── donde los pulgares llegan fácil */}
      <div
        className="shrink-0 flex items-center justify-around px-6 py-3 border-t border-red-500/20 bg-black"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
      >
        {/* Exportar */}
        <ExportButton fieldRef={fieldRef} />

        {/* Formación */}
        <FormationSelector current={formation} onChange={handleFormationChange} />

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 bg-black/60 border border-red-500/50 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-600/20 transition-colors active:scale-95"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          RST
        </button>
      </div>
    </div>
  )
}
