'use client'

import { useState } from 'react'
import axios from 'axios'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import { useTasks } from '@/hooks/useTasks'
import { Task } from '@prisma/client'

export default function Home() {
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const { tasks, isLoading, isError, mutate } = useTasks(statusFilter, sortBy, sortOrder)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateTask = async (data: any) => {
    setIsCreating(true)
    try {
      // Optimistic update: tambahkan task sementara
      const optimisticTask = {
        id: Date.now(), // ID sementara
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      } as Task
      
      mutate([optimisticTask, ...tasks], false)
      
      // Kirim request ke API
      const response = await axios.post('/api/tasks', data)
      
      // Ganti task optimistik dengan yang asli dari server
      mutate(
        [response.data, ...tasks.filter((t: Task) => t.id !== optimisticTask.id)], 
        false
      )
      
    } catch (error) {
      console.error('Failed to create task:', error)
      // Jika error, kembalikan ke state sebelumnya
      mutate()
      alert('Failed to create task. Please try again.')
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (id: number, data: any) => {
    try {
      await axios.put(`/api/tasks/${id}`, data)
      mutate() // Refresh data
    } catch (error: any) {
      console.error('Update failed:', error)
      throw error
    }
  }

  const handleDelete = async (id: number) => {
    try {
      // Optimistic update: hapus task dari daftar
      const filteredTasks = tasks.filter((task: Task) => task.id !== id)
      mutate(filteredTasks, false)
      
      await axios.delete(`/api/tasks/${id}`)
      
      // Revalidate untuk memastikan data sinkron
      mutate()
    } catch (error: any) {
      console.error('Delete failed:', error)
      // Jika error, kembalikan ke state sebelumnya
      mutate()
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            To-Do List Application
          </h1>
          <p className="mt-2 text-gray-600">
            Full-stack task management application for AGIT Internship
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TaskList
                tasks={tasks}
                isLoading={isLoading}
                isError={isError}
                statusFilter={statusFilter}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onStatusFilterChange={setStatusFilter}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
            
            <div>
              <TaskForm 
                onSubmit={handleCreateTask} 
                isLoading={isCreating} 
              />
              
              <div className="p-6 mt-8 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-lg font-semibold">Application Info</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Built with Next.js 14 (App Router)</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Prisma ORM with SQLite</li>
                  <li>• SWR for data fetching</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Soft delete implementation</li>
                  <li>• Full CRUD operations</li>
                  <li>• Filtering and sorting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            AGIT Internship Technical Assessment • Full Stack Developer Position
          </p>
        </div>
      </footer>
    </div>
  )
}