'use client'

import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: any[]
  isLoading: boolean
  isError: boolean
  statusFilter: string
  sortBy: string
  sortOrder: string
  onStatusFilterChange: (filter: string) => void
  onSortByChange: (sortBy: string) => void
  onSortOrderChange: (sortOrder: string) => void
  onUpdate: (id: number, data: any) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function TaskList({
  tasks,
  isLoading,
  isError,
  statusFilter,
  sortBy,
  sortOrder,
  onStatusFilterChange,
  onSortByChange,
  onSortOrderChange,
  onUpdate,
  onDelete
}: TaskListProps) {
  
  // Handler untuk mengubah sorting
  const handleSortChange = (value: string) => {
    if (value === 'title_asc') {
      onSortByChange('title')
      onSortOrderChange('asc')
    } else if (value === 'title_desc') {
      onSortByChange('title')
      onSortOrderChange('desc')
    } else if (value === 'created_at_asc') {
      onSortByChange('created_at')
      onSortOrderChange('asc')
    } else if (value === 'created_at_desc') {
      onSortByChange('created_at')
      onSortOrderChange('desc')
    } else if (value === 'updated_at_asc') {
      onSortByChange('updated_at')
      onSortOrderChange('asc')
    } else if (value === 'updated_at_desc') {
      onSortByChange('updated_at')
      onSortOrderChange('desc')
    }
  }

  // Get current sort value untuk dropdown
  const getCurrentSortValue = () => {
    return `${sortBy}_${sortOrder}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading tasks...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        Error loading tasks. Please try again.
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={getCurrentSortValue()}
            onChange={(e) => handleSortChange(e.target.value)}
            className="p-2 border rounded"
          >
            <optgroup label="Title">
              <option value="title_asc">Title (A → Z)</option>
              <option value="title_desc">Title (Z → A)</option>
            </optgroup>
            <optgroup label="Created Date">
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
            </optgroup>
            <optgroup label="Updated Date">
              <option value="updated_at_desc">Recently Updated</option>
              <option value="updated_at_asc">Least Recently Updated</option>
            </optgroup>
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          {statusFilter ? `No ${statusFilter.replace('_', ' ')} tasks found` : 'No tasks found. Create your first task!'}
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: any) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}