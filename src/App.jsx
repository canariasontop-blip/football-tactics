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
    <div className="w-screen h-[100dvh] overflow-hidden relative">
      {/* Campo ocupa toda la pantalla, centrado con barras negras arriba/abajo */}
      <Field
        players={players}
        onMove={handleMove}
        onUpdate={handleUpdate}
        fieldRef={fieldRef}
      />

      {/* ── BARRA INFERIOR — sobre el espacio negro debajo del campo ── */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 py-3 bg-black/80 backdrop-blur-sm border-t border-red-500/20"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <ExportButton fieldRef={fieldRef} />
        <FormationSelector current={formation} onChange={handleFormationChange} />
        <button
          onClick={handleReset}
          className="bg-black/60 border border-red-500/50 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          RST
        </button>
      </div>

      {/* ── BADGE XI INICIAL — esquina superior izquierda con safe area ── */}
      <div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)', paddingLeft: '12px' }}
      >
        <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg px-3 py-1.5">
          <p className="text-red-400 font-black text-xs tracking-widest leading-none"
             style={{ fontFamily: 'Orbitron, sans-serif' }}>
            XI INICIAL
          </p>
          <p className="text-white/40 text-[9px] tracking-widest mt-0.5"
             style={{ fontFamily: 'Orbitron, sans-serif' }}>
            {formation}
          </p>
        </div>
      </div>
    </div>
  )
}
