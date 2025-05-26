import React, { useState, useEffect } from 'react';

// --- Mock API Simulation (formerly api.js) ---
let mockTasks = [
  { id: 1, title: 'Learn React Hooks', description: 'Understand useState, useEffect, and other core hooks.' },
  { id: 2, title: 'Build a Responsive UI', description: 'Apply Tailwind CSS classes for mobile-first design.' },
  { id: 3, title: 'Integrate API Calls', description: 'Simulate fetching, adding, updating, and deleting data.' },
  { id: 4, title: 'Set up GitHub Actions', description: 'Automate deployment to GitHub Pages.' },
];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

const fetchTasks = async () => {
  await simulateDelay();
  return [...mockTasks]; // Return a copy to avoid direct modification
};

const addTask = async (newTask) => {
  await simulateDelay();
  const newId = mockTasks.length > 0 ? Math.max(...mockTasks.map(task => task.id)) + 1 : 1;
  const taskToAdd = { id: newId, ...newTask };
  mockTasks.push(taskToAdd);
  return taskToAdd;
};

const updateTask = async (id, updatedTask) => {
  await simulateDelay();
  const index = mockTasks.findIndex(task => task.id === id);
  if (index !== -1) {
    mockTasks[index] = { id, ...updatedTask };
    return mockTasks[index];
  }
  return null;
};

const deleteTask = async (id) => {
  await simulateDelay();
  const initialLength = mockTasks.length;
  mockTasks = mockTasks.filter(task => task.id !== id);
  return mockTasks.length < initialLength;
};

// --- TaskList Component (formerly components/TaskList.js) ---
function TaskList({ tasks, onDelete, onEdit }) {
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No tasks yet. Add one above to get started!</p>
      ) : (
        <ul className="space-y-5">
          {tasks.map(task => (
            <li key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-shadow duration-300 ease-in-out">
              <div className="mb-3 sm:mb-0 sm:mr-4 flex-grow">
                <strong className="text-xl text-indigo-700 font-semibold block mb-1">{task.title}</strong>
                <p className="text-gray-700 text-base">{task.description}</p>
              </div>
              <div className="flex space-x-3 mt-3 sm:mt-0">
                <button
                  onClick={() => onEdit(task)}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- AddTask Component (formerly components/AddTask.js) ---
function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      await onAdd({ title, description });
      setTitle('');
      setDescription('');
    } else {
      // In a real app, use a modal or toast for messages, not alert()
      console.warn('Please fill in both title and description.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-5 text-center">Add New Task</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="add-title" className="block text-sm font-medium text-gray-700 mb-2">Task Title:</label>
          <input
            id="add-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
            placeholder="e.g., Prepare presentation slides"
          />
        </div>
        <div>
          <label htmlFor="add-description" className="block text-sm font-medium text-gray-700 mb-2">Task Description:</label>
          <textarea
            id="add-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 h-32 resize-y transition duration-200 ease-in-out text-base"
            placeholder="e.g., Gather all data, create compelling visuals, practice delivery."
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-indigo-700 text-white font-semibold text-lg rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-75 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

// --- EditTask Component (formerly components/EditTask.js) ---
function EditTask({ task, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && description.trim() && task) {
      await onSave({ id: task.id, title, description });
    } else if (!task) {
      console.warn('No task selected for update.');
    } else {
      console.warn('Please fill in both title and description.');
    }
  };

  return (
    <div className="mt-8 p-6 bg-yellow-50 rounded-xl shadow-lg border border-yellow-200">
      <h3 className="text-2xl font-bold text-yellow-800 mb-5 text-center">Edit Task</h3>
      {task ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">Task Title:</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out text-lg"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">Task Description:</label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 h-32 resize-y transition duration-200 ease-in-out text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-500 text-white font-semibold text-lg rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 text-center py-4">No task selected for editing.</p>
      )}
    </div>
  );
}

// --- Main App Component ---
function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    loadTasks();
  }, []);

  // Handler for adding a new task
  const handleAddTask = async (newTask) => {
    const addedTask = await addTask(newTask);
    setTasks((prevTasks) => [...prevTasks, addedTask]);
  };

  // Handler for deleting a task
  const handleDeleteTask = async (id) => {
    const success = await deleteTask(id);
    if (success) {
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
    } else {
      console.error('Failed to delete task.'); // Use console.error instead of alert
    }
  };

  // Handler to set a task for editing
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  // Handler for saving an edited task
  const handleSaveEditedTask = async (updatedTask) => {
    const updated = await updateTask(updatedTask.id, updatedTask);
    if (updated) {
      setTasks((prevTasks) =>
        prevTasks.map(task => (task.id === updated.id ? updated : task))
      );
      setEditingTask(null); // Clear editing state
    } else {
      console.error('Failed to update task.'); // Use console.error instead of alert
    }
  };

  // Handler to cancel editing
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    // Tailwind CSS for professional look
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 font-sans antialiased">
      {/* Load Inter font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 border border-gray-100">
          <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-10 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              My Professional Task Manager
            </span>
          </h1>

          {/* Add Task Section */}
          <div className="mb-10">
            <AddTask onAdd={handleAddTask} />
          </div>

          {/* Edit Task Section (conditionally rendered) */}
          {editingTask && (
            <div className="mb-10">
              <EditTask
                task={editingTask}
                onSave={handleSaveEditedTask}
                onCancel={handleCancelEdit}
              />
            </div>
          )}

          {/* Task List Section */}
          <div>
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
