import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanTicket } from './KanbanTicket'
import { Plus, Settings } from 'lucide-react'
import { supabase } from '../lib/supabase'

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

export function KanbanBoard() {
  const [stages, setStages] = useState<Stage[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch stages
      const { data: stagesData, error: stagesError } = await supabase
        .from('kanban_stages')
        .select('*')
        .order('order_index', { ascending: true })

      if (stagesError && stagesError.code !== 'PGRST116') {
        throw stagesError
      }

      if (stagesData && stagesData.length > 0) {
        setStages(stagesData)
      } else {
        // Create default stages
        const defaultStages = [
          { title: 'New', order_index: 0 },
          { title: 'In Progress', order_index: 1 },
          { title: 'Review', order_index: 2 },
          { title: 'Completed', order_index: 3 },
        ]

        const { data: createdStages, error: createError } = await supabase
          .from('kanban_stages')
          .insert(defaultStages)
          .select()

        if (createError) throw createError
        setStages(createdStages || [])
      }

      // Fetch tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('kanban_tickets')
        .select('*')
        .order('order_index', { ascending: true })

      if (ticketsError && ticketsError.code !== 'PGRST116') {
        throw ticketsError
      }

      setTickets(ticketsData || [])

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (messagesError && messagesError.code !== 'PGRST116') {
        throw messagesError
      }

      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error fetching kanban data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const ticket = tickets.find(t => t.id === active.id)
    setActiveTicket(ticket || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTicket(null)

    if (!over) return

    const activeTicket = tickets.find(t => t.id === active.id)
    if (!activeTicket) return

    const overId = over.id as string
    const overStage = stages.find(s => s.id === overId)
    const overTicket = tickets.find(t => t.id === overId)

    let newStageId = activeTicket.stage_id
    let newOrderIndex = activeTicket.order_index

    if (overStage) {
      // Dropped on a stage
      newStageId = overStage.id
      const stageTickets = tickets.filter(t => t.stage_id === overStage.id)
      newOrderIndex = stageTickets.length
    } else if (overTicket) {
      // Dropped on another ticket
      newStageId = overTicket.stage_id
      newOrderIndex = overTicket.order_index
    }

    if (newStageId !== activeTicket.stage_id || newOrderIndex !== activeTicket.order_index) {
      try {
        const { error } = await supabase
          .from('kanban_tickets')
          .update({
            stage_id: newStageId,
            order_index: newOrderIndex,
            updated_at: new Date().toISOString()
          })
          .eq('id', activeTicket.id)

        if (error) throw error

        // Update local state
        setTickets(tickets.map(ticket =>
          ticket.id === activeTicket.id
            ? { ...ticket, stage_id: newStageId, order_index: newOrderIndex }
            : ticket
        ))
      } catch (error) {
        console.error('Error updating ticket:', error)
        // Don't redirect on error, just log it
      }
    }
  }

  const getTicketsForStage = (stageId: string) => {
    return tickets.filter(ticket => ticket.stage_id === stageId)
  }

  const getMessageForTicket = (messageId: string | null) => {
    if (!messageId) return null
    return messages.find(m => m.id === messageId) || null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Message Management</h2>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Manage Stages</span>
          </button>
          <button className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Ticket</span>
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              tickets={getTicketsForStage(stage.id)}
              getMessageForTicket={getMessageForTicket}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTicket ? (
            <KanbanTicket
              ticket={activeTicket}
              message={getMessageForTicket(activeTicket.message_id)}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}