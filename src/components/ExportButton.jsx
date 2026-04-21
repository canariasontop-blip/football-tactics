import { useState, useCallback } from 'react'
import { toPng } from 'html-to-image'

export default function ExportButton({ fieldRef }) {
  const [loading, setLoading] = useState(false)

  const handleCapture = useCallback(async () => {
    const node = fieldRef.current
    if (!node || loading) return
    setLoading(true)
    try {
      // Primera pasada: fuerza carga de recursos en el canvas
      await toPng(node, { cacheBust: true, pixelRatio: 1 })
      // Segunda pasada: captura real a 2× para alta resolución
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: false,
      })
      const link = document.createElement('a')
      link.download = 'alineacion-equipo.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
      alert('No se pudo exportar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [fieldRef, loading])

  return (
    <button
      onClick={handleCapture}
      disabled={loading}
      title="Exportar alineación como PNG"
      className="flex items-center gap-2 bg-black/60 border border-red-500/50 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-600/20 transition-colors disabled:opacity-40 active:scale-95"
      style={{ fontFamily: 'Orbitron, sans-serif' }}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )}
      {!loading && <span>FOTO</span>}
    </button>
  )
}
