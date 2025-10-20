import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanTicket } from './KanbanTicket'

interface Stage {
  id: string
  title: string
  order_index: number
}

interface Ticket {
  id: string
  title: string
  description: string | null
  stage_id: string
  message_id: string | null
  labels: string[] | null
  due_date: string | null
  notes: string | null
  order_index: number
  created_at: string
}

interface Message {
  id: string
  name: string
  email: string
  message: string
  resume_id: string | null
  status: string
  created_at: string
}

interface KanbanColumnProps {
  stage: Stage
  tickets: Ticket[]
  getMessageForTicket: (messageId: string | null) => Message | null
}

export function KanbanColumn({ stage, tickets, getMessageForTicket }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-900 rounded-xl p-4 min-h-[500px] transition-colors ${
        isOver ? 'bg-gray-800' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{stage.title}</h3>
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
          {tickets.length}
        </span>
      </div>

      <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <KanbanTicket
              key={ticket.id}
              ticket={ticket}
              message={getMessageForTicket(ticket.message_id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}