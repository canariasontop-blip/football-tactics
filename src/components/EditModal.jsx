import { useEffect, useRef } from 'react'

export default function EditModal({ player, onSave, onClose }) {
  const nameRef = useRef(null)
  const dorsalRef = useRef(null)

  useEffect(() => {
    // pequeño delay para que el teclado móvil no tape el modal mientras aparece
    const t = setTimeout(() => nameRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(player.id, {
      alias: nameRef.current.value.trim() || player.alias,
      dorsal: Number(dorsalRef.current.value) || player.dorsal,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-6 px-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d0d0d 0%, #1a0a0a 100%)',
          border: '1px solid rgba(255,0,0,0.4)',
          boxShadow: '0 0 40px rgba(255,0,0,0.15), 0 20px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-red-500/20">
          <p
            className="text-red-400 text-[10px] tracking-[0.25em] uppercase"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Editar Jugador
          </p>
          <p className="text-white font-bold text-xl mt-0.5">
            #{player.dorsal} — {player.alias}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Dorsal */}
          <div className="flex flex-col gap-2">
            <label
              className="text-red-400/80 text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Dorsal
            </label>
            <input
              ref={dorsalRef}
              type="number"
              inputMode="numeric"
              min="1"
              max="99"
              defaultValue={player.dorsal}
              className="w-full bg-white/5 border border-white/10 focus:border-red-500 text-white text-2xl font-black text-center rounded-xl px-4 py-3 outline-none transition-colors"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            />
          </div>

          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label
              className="text-red-400/80 text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Nombre / Posición
            </label>
            <input
              ref={nameRef}
              type="text"
              maxLength={12}
              defaultValue={player.alias}
              placeholder="Ej: MESSI, ST, CB..."
              className="w-full bg-white/5 border border-white/10 focus:border-red-500 text-white text-xl font-bold text-center rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-white/20 uppercase"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 font-semibold rounded-xl py-3 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 font-bold rounded-xl py-3 text-white text-sm transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: '0 0 20px rgba(220,38,38,0.4)',
              }}
            >
              GUARDAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
