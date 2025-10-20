import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Mail, Tag, MessageSquare } from 'lucide-react'

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

interface KanbanTicketProps {
  ticket: Ticket
  message: Message | null
  isDragging?: boolean
}

export function KanbanTicket({ ticket, message, isDragging = false }: KanbanTicketProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: ticket.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isBeingDragged = isDragging || isSortableDragging

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-800 rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all ${
        isBeingDragged ? 'opacity-50 rotate-2 scale-105' : 'hover:bg-gray-700'
      }`}
    >
      <h4 className="font-medium text-white mb-2 line-clamp-2">{ticket.title}</h4>
      
      {ticket.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-3">{ticket.description}</p>
      )}

      {message && (
        <div className="bg-gray-900 rounded p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{message.name}</span>
          </div>
          <p className="text-xs text-gray-300 line-clamp-2">{message.message}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {ticket.labels && ticket.labels.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="w-3 h-3 text-gray-400" />
              {ticket.labels.slice(0, 2).map((label, index) => (
                <span
                  key={index}
                  className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {ticket.due_date && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">
                {new Date(ticket.due_date).toLocaleDateString()}
              </span>
            </div>
          )}
          {ticket.notes && (
            <MessageSquare className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {new Date(ticket.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}