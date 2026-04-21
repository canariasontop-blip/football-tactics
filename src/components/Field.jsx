import { useRef, useState, useCallback } from 'react'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import Player from './Player'
import EditModal from './EditModal'

const FIELD_RATIO = 3 / 4

export default function Field({ players, onMove, onUpdate, fieldRef: externalRef }) {
  const internalRef = useRef(null)
  const fieldRef = externalRef || internalRef
  const [editingPlayer, setEditingPlayer] = useState(null)

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragEnd = useCallback(({ active, delta }) => {
    const field = fieldRef.current
    if (!field) return
    const { width, height } = field.getBoundingClientRect()
    const player = players.find((p) => p.id === active.id)
    if (!player) return
    onMove(active.id,
      Math.min(96, Math.max(4, player.x + (delta.x / width) * 100)),
      Math.min(97, Math.max(3, player.y + (delta.y / height) * 100))
    )
  }, [players, onMove, fieldRef])

  const handleEdit = useCallback((player) => setEditingPlayer(player), [])
  const handleSave = useCallback((id, data) => onUpdate(id, data), [onUpdate])

  return (
    <>
      <div className="w-screen h-[100dvh] bg-black flex items-center justify-center overflow-hidden">
        <DndContext sensors={sensors} modifiers={[restrictToParentElement]} onDragEnd={handleDragEnd}>
          <div
            ref={fieldRef}
            className="relative overflow-hidden"
            style={{
              aspectRatio: `${FIELD_RATIO}`,
              height: `min(100dvh, calc(100vw * ${1 / FIELD_RATIO}))`,
              width: `min(100vw, calc(100dvh * ${FIELD_RATIO}))`,
            }}
          >
            <img
              src="/campo.jpg"
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
              style={{ zIndex: 0 }}
            />
            {players.map((player) => (
              <Player key={player.id} player={player} onEdit={handleEdit} />
            ))}
          </div>
        </DndContext>
      </div>

      {editingPlayer && (
        <EditModal player={editingPlayer} onSave={handleSave} onClose={() => setEditingPlayer(null)} />
      )}
    </>
  )
}
