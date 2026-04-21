import { motion, AnimatePresence } from 'framer-motion'

export default function BenchDrawer({ open, onClose, benchPlayers, onSubstitute, selectedFieldPlayer }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 border-t border-red-500/50 rounded-t-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-600 rounded-full" />
            </div>

            <div className="px-4 pb-2 pt-1 flex items-center justify-between">
              <h3
                className="text-red-400 font-bold text-sm tracking-widest"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                BANQUILLO
              </h3>
              {selectedFieldPlayer && (
                <p className="text-gray-400 text-[10px]">
                  Intercambiando: <span className="text-white font-bold">{selectedFieldPlayer.alias}</span>
                </p>
              )}
            </div>

            <div className="overflow-x-auto pb-6">
              <div className="flex gap-2 px-4" style={{ width: 'max-content' }}>
                {benchPlayers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectedFieldPlayer && onSubstitute(selectedFieldPlayer.id, p.id)}
                    disabled={!selectedFieldPlayer}
                    className={`
                      flex flex-col items-center justify-center min-w-[64px] h-16 rounded-xl border transition-all
                      ${selectedFieldPlayer
                        ? 'border-red-500/60 bg-black/60 hover:bg-red-600/30 hover:border-red-400 active:scale-95'
                        : 'border-gray-700/40 bg-black/30 opacity-50 cursor-default'}
                    `}
                  >
                    <span className="text-white font-black text-base leading-none">{p.dorsal}</span>
                    <span className="text-gray-300 text-[9px] mt-0.5 truncate max-w-[58px] text-center px-1">{p.name}</span>
                    <span className="text-red-400 text-[8px] font-bold">{p.alias}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
