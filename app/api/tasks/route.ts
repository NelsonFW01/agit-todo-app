import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build filter
    const where: any = { deleted_at: null }
    if (status && status !== '' && status !== 'all') {
      where.status = status
    }

    // Build sorting
    let orderBy: any = {}
    if (sortBy === 'created_at' || sortBy === 'updated_at') {
      orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc'
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder === 'asc' ? 'asc' : 'desc'
    } else {
      orderBy.created_at = 'desc'
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating task:', body)
    
    // Validasi sederhana
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        status: body.status || 'pending'
      }
    })

    console.log('Task created:', task)
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}