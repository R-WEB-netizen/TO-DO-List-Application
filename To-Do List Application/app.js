const { useState, useEffect, useMemo, useCallback } = React;

// Sample Data
const SAMPLE_TASKS = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Finish writing the Q4 project proposal and submit to management",
    category: "Work",
    priority: "Critical",
    dueDate: "2025-10-26",
    isCompleted: false,
    progress: 75,
    isRecurring: false,
    recurringFrequency: null,
    subtasks: [
      { id: 1, text: "Research market trends", completed: true },
      { id: 2, text: "Write executive summary", completed: true },
      { id: 3, text: "Create budget breakdown", completed: false }
    ],
    createdAt: "2025-10-20",
    userId: "demo"
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Get milk, eggs, bread, vegetables, and fruits from supermarket",
    category: "Shopping",
    priority: "Medium",
    dueDate: "2025-10-25",
    isCompleted: false,
    progress: 0,
    isRecurring: true,
    recurringFrequency: "Weekly",
    subtasks: [],
    createdAt: "2025-10-24",
    userId: "demo"
  },
  {
    id: 3,
    title: "Morning workout routine",
    description: "30 minutes cardio and 20 minutes strength training",
    category: "Health",
    priority: "High",
    dueDate: "2025-10-25",
    isCompleted: true,
    progress: 100,
    isRecurring: true,
    recurringFrequency: "Daily",
    subtasks: [
      { id: 1, text: "Warm up - 5 mins", completed: true },
      { id: 2, text: "Cardio - 30 mins", completed: true },
      { id: 3, text: "Strength training - 20 mins", completed: true }
    ],
    createdAt: "2025-10-25",
    userId: "demo"
  },
  {
    id: 4,
    title: "Call dentist for appointment",
    description: "Schedule cleaning appointment for next month",
    category: "Personal",
    priority: "Low",
    dueDate: "2025-10-28",
    isCompleted: false,
    progress: 0,
    isRecurring: false,
    recurringFrequency: null,
    subtasks: [],
    createdAt: "2025-10-23",
    userId: "demo"
  },
  {
    id: 5,
    title: "Review team performance reports",
    description: "Analyze Q3 performance metrics and prepare feedback",
    category: "Work",
    priority: "High",
    dueDate: "2025-10-27",
    isCompleted: false,
    progress: 40,
    isRecurring: false,
    recurringFrequency: null,
    subtasks: [
      { id: 1, text: "Download reports from system", completed: true },
      { id: 2, text: "Analyze individual performance", completed: false },
      { id: 3, text: "Prepare feedback notes", completed: false }
    ],
    createdAt: "2025-10-22",
    userId: "demo"
  },
  {
    id: 6,
    title: "Organize home office",
    description: "Clean desk, organize cables, and file documents",
    category: "Personal",
    priority: "Medium",
    dueDate: "2025-10-30",
    isCompleted: false,
    progress: 20,
    isRecurring: false,
    recurringFrequency: null,
    subtasks: [],
    createdAt: "2025-10-21",
    userId: "demo"
  },
  {
    id: 7,
    title: "Submit expense report",
    description: "Compile receipts and submit October expense report",
    category: "Work",
    priority: "Critical",
    dueDate: "2025-10-24",
    isCompleted: false,
    progress: 60,
    isRecurring: true,
    recurringFrequency: "Monthly",
    subtasks: [
      { id: 1, text: "Collect all receipts", completed: true },
      { id: 2, text: "Enter data in system", completed: true },
      { id: 3, text: "Get manager approval", completed: false }
    ],
    createdAt: "2025-10-15",
    userId: "demo"
  },
  {
    id: 8,
    title: "Read book chapter",
    description: "Read chapter 5 of 'Atomic Habits'",
    category: "Personal",
    priority: "Low",
    dueDate: "2025-10-26",
    isCompleted: true,
    progress: 100,
    isRecurring: false,
    recurringFrequency: null,
    subtasks: [],
    createdAt: "2025-10-24",
    userId: "demo"
  },
  {
    id: 9,
    title: "Update software licenses",
    description: "Renew team software subscriptions before expiry",
    category: "Work",
    priority: "High",
    dueDate: "2025-10-23",
    isCompleted: false,
    progress: 0,
    isRecurring: false,
    recurringFrequency: null,
    subtasks: [
      { id: 1, text: "Check expiry dates", completed: false },
      { id: 2, text: "Get budget approval", completed: false },
      { id: 3, text: "Process renewals", completed: false }
    ],
    createdAt: "2025-10-20",
    userId: "demo"
  },
  {
    id: 10,
    title: "Meditation session",
    description: "15 minutes guided meditation",
    category: "Health",
    priority: "Medium",
    dueDate: "2025-10-25",
    isCompleted: true,
    progress: 100,
    isRecurring: true,
    recurringFrequency: "Daily",
    subtasks: [],
    createdAt: "2025-10-25",
    userId: "demo"
  }
];

const DEMO_USER = {
  username: "demo",
  email: "demo@example.com",
  password: "demo123"
};

// Utility functions
const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const formatDate = (dateString) => {
  if (!dateString) return "No deadline";
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays <= 7) return `In ${diffDays} days`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Login Component
function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      if (formData.username === DEMO_USER.username && formData.password === DEMO_USER.password) {
        onLogin({ username: DEMO_USER.username, email: DEMO_USER.email });
      } else {
        setError('Invalid credentials. Try demo/demo123');
      }
    } else {
      // Register logic
      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email');
        return;
      }
      onLogin({ username: formData.username, email: formData.email });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-branding">
        <h1>TaskFlow</h1>
        <p>Manage your daily tasks with ease. Stay organized, stay productive.</p>
      </div>
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="subtitle">{isLogin ? 'Sign in to your account' : 'Sign up to get started'}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="btn btn-primary">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          
          <div className="toggle-form">
            {isLogin ? "Don't have an account?" : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleComplete(task.id)}
        />
        <div className="task-card-content">
          <h3 className={`task-title ${task.isCompleted ? 'completed' : ''}`}>
            {task.title}
          </h3>
          <p className="task-description">{task.description}</p>
          
          <div className="task-meta">
            <span className="badge badge-category">{task.category}</span>
            <span className={`badge badge-priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            <span className={`badge badge-date ${isOverdue(task.dueDate) && !task.isCompleted ? 'overdue' : ''}`}>
              {formatDate(task.dueDate)}
            </span>
            {task.isRecurring && (
              <span className="badge badge-recurring">↻ {task.recurringFrequency}</span>
            )}
          </div>
          
          {task.progress > 0 && (
            <div className="task-progress">
              <div className="progress-label">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${task.progress}%` }}></div>
              </div>
            </div>
          )}
          
          {task.subtasks.length > 0 && (
            <div className="task-subtasks">
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-gray)', marginBottom: 'var(--space-1)' }}>
                Subtasks: {completedSubtasks}/{totalSubtasks}
              </div>
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
                  <input type="checkbox" checked={subtask.completed} readOnly />
                  <span>{subtask.text}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="task-actions">
            <button className="icon-btn" onClick={() => onEdit(task)}>
              ✏️ Edit
            </button>
            <button className="icon-btn delete" onClick={() => onDelete(task.id)}>
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Modal Component
function TaskModal({ task, onSave, onClose }) {
  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    dueDate: '',
    progress: 0,
    isRecurring: false,
    recurringFrequency: 'Daily',
    subtasks: []
  });
  const [newSubtask, setNewSubtask] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setFormData({
        ...formData,
        subtasks: [...formData.subtasks, { id: Date.now(), text: newSubtask, completed: false }]
      });
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (id) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter(st => st.id !== id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Task title is required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Progress</label>
              <div className="slider-container">
                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                  className="slider"
                />
                <span className="progress-value">{formData.progress}%</span>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  id="recurring-checkbox"
                />
                <label htmlFor="recurring-checkbox">Recurring Task</label>
              </div>
            </div>
            
            {formData.isRecurring && (
              <div className="form-group">
                <label>Frequency</label>
                <select name="recurringFrequency" value={formData.recurringFrequency} onChange={handleChange}>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label>Subtasks</label>
              <div className="subtask-list">
                {formData.subtasks.map(subtask => (
                  <div key={subtask.id} className="subtask-input-group">
                    <input type="text" value={subtask.text} readOnly />
                    <button type="button" className="btn-sm btn-danger" onClick={() => handleRemoveSubtask(subtask.id)}>
                      Remove
                    </button>
                  </div>
                ))}
                <div className="subtask-input-group">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  />
                  <button type="button" className="btn-add-subtask" onClick={handleAddSubtask}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Kanban Board Component
function KanbanBoard({ tasks, onToggleComplete, onEdit, onDelete }) {
  const todoTasks = tasks.filter(t => !t.isCompleted && t.progress < 50);
  const inProgressTasks = tasks.filter(t => !t.isCompleted && t.progress >= 50);
  const completedTasks = tasks.filter(t => t.isCompleted);

  const Column = ({ title, tasks, count }) => (
    <div className="kanban-column">
      <div className="kanban-header">
        <span>{title}</span>
        <span className="kanban-count">{count}</span>
      </div>
      <div className="kanban-tasks">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="kanban-board">
      <Column title="To Do" tasks={todoTasks} count={todoTasks.length} />
      <Column title="In Progress" tasks={inProgressTasks} count={inProgressTasks.length} />
      <Column title="Completed" tasks={completedTasks} count={completedTasks.length} />
    </div>
  );
}

// Progress Dashboard Component
function ProgressDashboard({ tasks }) {
  useEffect(() => {
    // Completion Rate Pie Chart
    const completedCount = tasks.filter(t => t.isCompleted).length;
    const pendingCount = tasks.length - completedCount;
    
    const pieCtx = document.getElementById('completionChart');
    if (pieCtx) {
      new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [completedCount, pendingCount],
            backgroundColor: ['#10B981', '#F59E0B']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Tasks by Category Bar Chart
    const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
    const categoryCounts = categories.map(cat => tasks.filter(t => t.category === cat).length);
    
    const barCtx = document.getElementById('categoryChart');
    if (barCtx) {
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Tasks',
            data: categoryCounts,
            backgroundColor: '#4F46E5'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // Tasks by Priority Doughnut Chart
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    const priorityCounts = priorities.map(p => tasks.filter(t => t.priority === p).length);
    
    const doughnutCtx = document.getElementById('priorityChart');
    if (doughnutCtx) {
      new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: priorities,
          datasets: [{
            data: priorityCounts,
            backgroundColor: ['#EF4444', '#F59E0B', '#FCD34D', '#10B981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // Weekly Progress Line Chart
    const lineCtx = document.getElementById('weeklyChart');
    if (lineCtx) {
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Tasks Completed',
            data: [2, 1, 3, 2, 1, 2, 2],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }, [tasks]);

  const completedThisWeek = tasks.filter(t => t.isCompleted).length;
  const avgProgress = Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length);

  return (
    <div>
      <div className="metrics-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="metric-card">
          <div className="metric-value">{completedThisWeek}</div>
          <div className="metric-label">Completed This Week</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{avgProgress}%</div>
          <div className="metric-label">Average Progress</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{tasks.filter(t => t.isRecurring).length}</div>
          <div className="metric-label">Recurring Tasks</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{tasks.filter(t => isOverdue(t.dueDate) && !t.isCompleted).length}</div>
          <div className="metric-label">Overdue Tasks</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Completion Rate</h3>
          <div className="chart-container">
            <canvas id="completionChart"></canvas>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Tasks by Category</h3>
          <div className="chart-container">
            <canvas id="categoryChart"></canvas>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Priority Distribution</h3>
          <div className="chart-container">
            <canvas id="priorityChart"></canvas>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Weekly Progress</h3>
          <div className="chart-container">
            <canvas id="weeklyChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

// Confirmation Dialog Component
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <span className="toast-message">{message}</span>
    </div>
  );
}

// Main Dashboard Component
function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [view, setView] = useState('list'); // 'list', 'kanban', 'progress'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (categoryFilter !== 'All' && task.category !== categoryFilter) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter !== 'All') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'Today' && diffDays !== 0) return false;
        if (dateFilter === 'Tomorrow' && diffDays !== 1) return false;
        if (dateFilter === 'This Week' && (diffDays < 0 || diffDays > 7)) return false;
        if (dateFilter === 'Overdue' && diffDays >= 0) return false;
        if (dateFilter === 'No Deadline' && task.dueDate) return false;
      }
      
      return true;
    });
  }, [tasks, searchQuery, categoryFilter, priorityFilter, dateFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = total - completed;
    const overdue = tasks.filter(t => isOverdue(t.dueDate) && !t.isCompleted).length;
    
    return { total, completed, pending, overdue };
  }, [tasks]);

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted, progress: task.isCompleted ? task.progress : 100 }
        : task
    ));
    showToast('Task updated successfully');
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData }
          : task
      ));
      showToast('Task updated successfully');
    } else {
      // Add new task
      const newTask = {
        ...taskData,
        id: Date.now(),
        isCompleted: false,
        createdAt: new Date().toISOString().split('T')[0],
        userId: user.username
      };
      setTasks([newTask, ...tasks]);
      showToast('Task created successfully');
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    setDeleteConfirm(taskId);
  };

  const confirmDelete = () => {
    setTasks(tasks.filter(task => task.id !== deleteConfirm));
    setDeleteConfirm(null);
    showToast('Task deleted successfully');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>TaskFlow</h1>
        </div>
        <div className="navbar-user">
          <span className="user-greeting">Welcome, {user.username}!</span>
          <button className="btn btn-secondary btn-sm" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="stats-panel">
            <h3>Overview</h3>
            <div className="stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completed</span>
              <span className="stat-value" style={{ color: 'var(--secondary)' }}>{stats.completed}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending</span>
              <span className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Overdue</span>
              <span className="stat-value" style={{ color: 'var(--danger)' }}>{stats.overdue}</span>
            </div>
          </div>

          <div className="filter-section">
            <h4>Categories</h4>
            <ul className="filter-list">
              {['All', 'Work', 'Personal', 'Shopping', 'Health', 'Other'].map(cat => (
                <li
                  key={cat}
                  className={`filter-item ${categoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  <span>{cat}</span>
                  <span className="filter-count">
                    {cat === 'All' ? tasks.length : tasks.filter(t => t.category === cat).length}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h4>Priority</h4>
            <ul className="filter-list">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(priority => (
                <li
                  key={priority}
                  className={`filter-item ${priorityFilter === priority ? 'active' : ''}`}
                  onClick={() => setPriorityFilter(priority)}
                >
                  <span>{priority}</span>
                  <span className="filter-count">
                    {priority === 'All' ? tasks.length : tasks.filter(t => t.priority === priority).length}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h4>Due Date</h4>
            <ul className="filter-list">
              {['All', 'Today', 'Tomorrow', 'This Week', 'Overdue', 'No Deadline'].map(date => (
                <li
                  key={date}
                  className={`filter-item ${dateFilter === date ? 'active' : ''}`}
                  onClick={() => setDateFilter(date)}
                >
                  {date}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <div className="content-header">
            <h2>My Tasks</h2>
            <div className="header-actions">
              <div className="view-toggle">
                <button
                  className={view === 'list' ? 'active' : ''}
                  onClick={() => setView('list')}
                >
                  📋 List
                </button>
                <button
                  className={view === 'kanban' ? 'active' : ''}
                  onClick={() => setView('kanban')}
                >
                  📊 Kanban
                </button>
                <button
                  className={view === 'progress' ? 'active' : ''}
                  onClick={() => setView('progress')}
                >
                  📈 Progress
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleAddTask}>
                + Add Task
              </button>
            </div>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {view === 'list' && (
            <div className="task-list">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <h3>No tasks found</h3>
                  <p>Try adjusting your filters or create a new task</p>
                </div>
              )}
            </div>
          )}

          {view === 'kanban' && (
            <KanbanBoard
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}

          {view === 'progress' && (
            <ProgressDashboard tasks={tasks} />
          )}
        </main>
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);