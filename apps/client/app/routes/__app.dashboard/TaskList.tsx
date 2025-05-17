import { fetchTasks, deleteTask } from '../../api/task.service';
import { useTaskStore } from '../../store/task.store';
import { Task } from '../../types/tasks.interface';
import { z } from 'zod';
import { useEffect, useState } from 'react';

// Define the schema using zod
const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['COMPLETED', 'IN_PROGRESS', 'PENDING']),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function TaskList() {
  const { setSelectedTask } = useTaskStore();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formValues, setFormValues] = useState<TaskFormValues>({
    title: '',
    description: '',
    status: 'PENDING',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
      setIsLoading(false);
    };
    loadTasks();
  }, []);

  const handleDelete = async (taskId: string) => {
    setIsDeleting(true);
    await deleteTask(taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setIsDeleting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validateForm = () => {
    try {
      taskSchema.parse(formValues);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Edit Task:', formValues);
      setFormValues({ title: '', description: '', status: 'PENDING' });
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          {formErrors.description && <p className="text-red-500">{formErrors.description}</p>}
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formValues.status}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
          </select>
          {formErrors.status && <p className="text-red-500">{formErrors.status}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task: Task) => (
          <li
            key={task.id}
            className="border p-2 flex justify-between items-center rounded"
          >
            <div>
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs ${
                  task.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setSelectedTask(task)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 hover:text-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
