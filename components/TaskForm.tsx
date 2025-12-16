'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema } from '@/lib/validations'

interface TaskFormProps {
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export default function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending'
    }
  })

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    setSuccessMessage('')
    try {
      await onSubmit(data)
      reset()
      setSuccessMessage('Task created successfully!')
      
      // Hilangkan pesan sukses setelah 3 detik
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Create New Task</h2>
      
      {successMessage && (
        <div className="p-3 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message?.toString()}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Enter task description (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register('status')}
          className="w-full p-2 mt-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {(isLoading || isSubmitting) ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : 'Create Task'}
      </button>
    </form>
  )
}