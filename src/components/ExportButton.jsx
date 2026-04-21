import { useState, useCallback } from 'react'
import { toPng } from 'html-to-image'

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

// Convierte la URL de la imagen a base64 para evitar CORS en el canvas
async function toDataUrl(url) {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export default function ExportButton({ fieldRef }) {
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState(false)

  const handleCapture = useCallback(async () => {
    const node = fieldRef.current
    if (!node || loading) return
    setLoading(true)
    setHint(false)

    // Busca el <img> del campo dentro del contenedor
    const imgEl = node.querySelector('img')
    const originalSrc = imgEl?.src

    try {
      // 1. Pre-carga la imagen del campo como base64 (evita CORS)
      if (imgEl) {
        const base64 = await toDataUrl('/campo.jpg')
        imgEl.src = base64
        // Espera a que el DOM procese el nuevo src
        await new Promise((r) => setTimeout(r, 100))
      }

      // 2. Primera pasada para "calentar" el canvas
      await toPng(node, { cacheBust: true, pixelRatio: 1 })

      // 3. Captura real a 2× resolución
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 })

      if (isIOS) {
        // iOS Safari no soporta download — abre en pestaña nueva
        const win = window.open()
        win.document.write(
          `<html><head><title>Alineación</title><meta name="viewport" content="width=device-width"/></head>` +
          `<body style="margin:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh">` +
          `<img src="${dataUrl}" style="max-width:100%;max-height:90vh;object-fit:contain"/>` +
          `<p style="color:white;font-family:sans-serif;font-size:14px;margin-top:12px;text-align:center">` +
          `Mantén presionado la imagen → <strong>Guardar en fotos</strong></p>` +
          `</body></html>`
        )
        setHint(true)
      } else {
        const link = document.createElement('a')
        link.download = 'alineacion-equipo.png'
        link.href = dataUrl
        link.click()
      }
    } catch (err) {
      console.error('Export failed:', err)
      alert('Error al exportar. Intenta de nuevo.')
    } finally {
      // Restaura el src original del img
      if (imgEl && originalSrc) imgEl.src = originalSrc
      setLoading(false)
    }
  }, [fieldRef, loading])

  return (
    <div className="flex flex-col items-center gap-1">
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
        <span>{loading ? 'GENERANDO...' : 'FOTO'}</span>
      </button>
      {hint && isIOS && (
        <p className="text-white/50 text-[9px] text-center" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Mantén la imagen → Guardar
        </p>
      )}
    </div>
  )
}
