import { useState, useRef, useEffect } from 'react'

const FORMATIONS = ['4-4-2', '4-3-3', '3-5-2', '5-4-1']

export default function FormationSelector({ current, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-red-500/50 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:border-red-400 transition-colors"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <span className="text-red-400">▶</span>
        {current}
        <span className="text-gray-400 text-[10px]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 bg-black/90 backdrop-blur-sm border border-red-500/40 rounded-lg overflow-hidden z-30 min-w-[90px]">
          {FORMATIONS.map((f) => (
            <button
              key={f}
              onClick={() => { onChange(f); setOpen(false) }}
              className={`
                w-full text-left px-3 py-2 text-xs font-bold transition-colors
                ${f === current
                  ? 'bg-red-600/40 text-white'
                  : 'text-gray-300 hover:bg-red-600/20 hover:text-white'}
              `}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
