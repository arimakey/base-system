import { useState } from 'react'
import { Task } from '../../types/tasks.interface'

enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  // Create task
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: TaskStatus.PENDING,
      userId: 'temp-user-id',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setNewTaskDescription('')
  }

  // Update task status
  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status, updatedAt: new Date() } : task
    ))
  }

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
          className="border p-2 rounded"
        />
        <textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          className="border p-2 rounded"
          rows={3}
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex flex-col gap-2 border p-4 rounded">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{task.title}</h3>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
            {task.description && (
              <p className="text-gray-600">{task.description}</p>
            )}
            <div className="flex items-center gap-2">
              <select
                value={task.status}
                onChange={(e) => handleUpdateStatus(task.id, e.target.value as TaskStatus)}
                className="border rounded p-1"
              >
                {Object.values(TaskStatus).map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">
                Updated: {task.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
