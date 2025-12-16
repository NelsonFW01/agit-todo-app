'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'

interface TaskItemProps {
  task: {
    id: number
    title: string
    description: string | null
    status: string
    created_at: string
    updated_at: string
  }
  onUpdate: (id: number, data: any) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState(task.status)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      await onUpdate(task.id, { title, description, status })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update task:', error)
      alert('Failed to update task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true)
      try {
        await onDelete(task.id)
      } catch (error) {
        console.error('Failed to delete task:', error)
        alert('Failed to delete task')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }

  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            disabled={isLoading}
            placeholder="Task description"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isLoading || !title.trim()}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              {task.description && (
                <p className="mt-1 text-gray-600">{task.description}</p>
              )}
            </div>
            <span className={clsx(
              'px-3 py-1 text-sm font-medium rounded-full',
              statusColors[task.status] || 'bg-gray-100 text-gray-800'
            )}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              <div>Created: {format(new Date(task.created_at), 'MMM d, yyyy HH:mm')}</div>
              <div>Updated: {format(new Date(task.updated_at), 'MMM d, yyyy HH:mm')}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}