import { useState, useCallback } from 'react'
import { toPng } from 'html-to-image'

export default function ExportButton({ fieldRef }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null) // data URL para el modal

  const handleCapture = useCallback(async () => {
    const node = fieldRef.current
    if (!node || loading) return
    setLoading(true)

    try {
      // Primera pasada para que html-to-image precache los recursos
      await toPng(node, { cacheBust: true, pixelRatio: 1 })
      // Segunda pasada: captura real a 2×
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 })
      setPreview(dataUrl)
    } catch (err) {
      console.error('Export error:', err)
      alert('Error al generar la imagen. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [fieldRef, loading])

  const handleDownload = useCallback(() => {
    if (!preview) return
    const link = document.createElement('a')
    link.download = 'alineacion-equipo.png'
    link.href = preview
    link.click()
  }, [preview])

  return (
    <>
      <button
        onClick={handleCapture}
        disabled={loading}
        className="flex items-center gap-2 bg-black/60 border border-red-500/50 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        )}
        <span>{loading ? '...' : 'FOTO'}</span>
      </button>

      {/* Modal de preview — se muestra en la misma página, sin popups */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Imagen capturada */}
          <img
            src={preview}
            alt="Alineación"
            className="max-h-[75dvh] max-w-full object-contain rounded-xl"
            style={{ boxShadow: '0 0 40px rgba(255,0,0,0.3)' }}
          />

          {/* Instrucción iOS */}
          <p className="text-white/60 text-xs text-center mt-4 px-6"
             style={{ fontFamily: 'Orbitron, sans-serif' }}>
            iOS: mantén presionada la imagen → "Guardar en fotos"
          </p>

          {/* Botones */}
          <div className="flex gap-4 mt-5">
            {/* Descargar (funciona en Android/desktop) */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-5 py-3 rounded-xl active:scale-95 transition-transform"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              ↓ GUARDAR
            </button>

            {/* Cerrar */}
            <button
              onClick={() => setPreview(null)}
              className="bg-white/10 border border-white/20 text-white text-xs font-bold px-5 py-3 rounded-xl active:scale-95 transition-transform"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              CERRAR
            </button>
          </div>
        </div>
      )}
    </>
  )
}
