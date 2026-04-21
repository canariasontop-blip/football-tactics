import { memo, useRef, useCallback } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'

// Jersey SVG — viewBox 0 0 60 56
function Jersey({ dorsal, glowing }) {
  return (
    <svg
      viewBox="0 0 60 56"
      width="56"
      height="52"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: glowing
          ? 'drop-shadow(0 0 8px #FF0000) drop-shadow(0 0 18px rgba(255,0,0,0.9))'
          : 'drop-shadow(0 0 5px #FF0000) drop-shadow(0 0 10px rgba(255,0,0,0.55))',
        overflow: 'visible',
      }}
    >
      {/* shirt body */}
      <path
        d="M 11,14 L 0,23 L 11,27 L 11,54 L 49,54 L 49,27 L 60,23 L 49,14 C 44,6 34,13 30,20 C 26,13 16,6 11,14 Z"
        fill="#111111"
        stroke="#FF0000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* collar fill */}
      <path
        d="M 49,14 C 44,6 34,13 30,20 C 26,13 16,6 11,14"
        fill="none"
        stroke="#FF0000"
        strokeWidth="2.2"
      />
      {/* dorsal number */}
      <text
        x="30"
        y="45"
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize="20"
        fontWeight="900"
        fontFamily="Orbitron, sans-serif"
        fill="white"
        style={{ userSelect: 'none' }}
      >
        {dorsal}
      </text>
    </svg>
  )
}

const Player = memo(function Player({ player, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
  })

  // Distinguish tap vs drag: track pointer travel distance
  const startXY = useRef({ x: 0, y: 0 })
  const travelRef = useRef(0)

  const handlePointerDown = useCallback((e) => {
    startXY.current = { x: e.clientX, y: e.clientY }
    travelRef.current = 0
  }, [])

  const handlePointerMove = useCallback((e) => {
    const dx = e.clientX - startXY.current.x
    const dy = e.clientY - startXY.current.y
    travelRef.current = Math.sqrt(dx * dx + dy * dy)
  }, [])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (travelRef.current < 8) {
      onEdit(player)
    }
  }, [player, onEdit])

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${player.x}%`,
        top: `${player.y}%`,
        touchAction: 'none',
        zIndex: isDragging ? 50 : 10,
      }}
      animate={
        transform
          ? { x: transform.x, y: transform.y }
          : { x: 0, y: 0 }
      }
      transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 26 }}
      {...attributes}
      {...listeners}
      className="-translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        {/* Ping ring while dragging */}
        {isDragging && (
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-[52px] rounded-sm border-2 border-red-500 animate-ping opacity-60 pointer-events-none"
          />
        )}

        {/* Jersey */}
        <Jersey dorsal={player.dorsal} glowing={isDragging} />

        {/* Name panel */}
        <div
          className="mt-[3px] bg-black/75 backdrop-blur-sm rounded px-2 py-[3px] text-center border border-red-500/30"
          style={{ minWidth: '60px', maxWidth: '76px' }}
        >
          <span
            className="text-white font-bold text-[11px] uppercase tracking-wide leading-none block truncate"
          >
            {player.alias}
          </span>
        </div>
      </div>
    </motion.div>
  )
})

export default Player
