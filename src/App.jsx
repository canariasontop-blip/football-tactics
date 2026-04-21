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

  // debounced persistence
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
    <div className="w-screen h-[100dvh] overflow-hidden relative">
      <Field
        players={players}
        onMove={handleMove}
        onUpdate={handleUpdate}
        fieldRef={fieldRef}
      />

      {/* ── Top-left: XI INICIAL ── */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm border border-red-500/40 rounded-lg px-3 py-1.5">
          <p
            className="text-red-400 font-bold text-xs tracking-[0.2em] leading-none"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            XI INICIAL
          </p>
          <p
            className="text-white/50 text-[9px] tracking-widest mt-0.5"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {formation}
          </p>
        </div>
      </div>

      {/* ── Top-right: controles ── */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <ExportButton fieldRef={fieldRef} />
        <FormationSelector current={formation} onChange={handleFormationChange} />
        <button
          onClick={handleReset}
          className="bg-black/60 backdrop-blur-sm border border-red-500/50 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600/20 transition-colors"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          RST
        </button>
      </div>

      {/* ── Hint ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <p className="text-white/30 text-[9px] text-center tracking-widest"
          style={{ fontFamily: 'Orbitron, sans-serif' }}>
          TAP · EDITAR &nbsp;|&nbsp; DRAG · MOVER
        </p>
      </div>
    </div>
  )
}
