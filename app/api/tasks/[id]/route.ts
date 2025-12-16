import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper untuk validasi ID
function isValidId(id: string): boolean {
  const num = parseInt(id)
  return !isNaN(num) && num > 0
}

// GET single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('GET task by ID:', id)
    
    if (!isValidId(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const taskId = parseInt(id)
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        deleted_at: null
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// PUT update task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('UPDATE task ID:', id)
    
    if (!isValidId(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const taskId = parseInt(id)
    
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        deleted_at: null
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Update hanya field yang dikirim
    const updateData: any = {
      updated_at: new Date()
    }
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData
    })

    console.log('Task updated successfully:', updatedTask.id)
    return NextResponse.json(updatedTask)
  } catch (error: any) {
    console.error('Error updating task:', error)
    console.error('Error details:', error.message)
    return NextResponse.json(
      { error: `Failed to update task: ${error.message}` },
      { status: 500 }
    )
  }
}

// DELETE task 
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('DELETE task ID:', id)
    
    if (!isValidId(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      )
    }

    const taskId = parseInt(id)
    
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        deleted_at: null
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { 
        deleted_at: new Date(),
        updated_at: new Date()
      }
    })

    console.log('Task deleted successfully:', taskId)
    return NextResponse.json({ 
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting task:', error)
    console.error('Error details:', error.message)
    return NextResponse.json(
      { error: `Failed to delete task: ${error.message}` },
      { status: 500 }
    )
  }
}