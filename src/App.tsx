/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus, TaskPriority, TaskFormData, COLUMNS, VALIDATION_RULES, NotificationInfo } from './types';

const STORAGE_KEY = 'kanban-tasks';
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK_DAYS = 7;
const DUE_SOON_DAYS = 2;

// Default initial tasks for first-time visitors
const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Research UI components library',
    description: 'Explore modern accessible component kits and benchmark performance for web apps.',
    status: TaskStatus.ToDo,
    priority: 'high',
    dueDate: new Date(Date.now() + DAY * 3).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - DAY * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Design Kanban Board wireframes',
    description: 'Create responsive layouts for desktop, tablet, and mobile views with intuitive interactions.',
    status: TaskStatus.InProgress,
    priority: 'medium',
    dueDate: new Date(Date.now() + DAY * 1).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - DAY * 1).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Setup TypeScript project structure',
    description: 'Configure Vite, Tailwind CSS, TypeScript types, and local storage state persistence.',
    status: TaskStatus.Completed,
    priority: 'low',
    dueDate: new Date(Date.now() - DAY * 1).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - DAY * 3).toISOString(),
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage:', e);
    }
    return DEFAULT_TASKS;
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
    description?: string;
  }>({});

  // Notification state
  const [notification, setNotification] = useState<NotificationInfo | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Drag and drop state
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Save tasks to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [tasks]);

  // Global keydown (Escape closes modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Modal focus
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);

    const newNotification: NotificationInfo = {
      id: Date.now().toString(),
      message,
      type,
      isFadingOut: false,
    };
    setNotification(newNotification);

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification((prev) => (prev ? { ...prev, isFadingOut: true } : null));
      fadeOutTimeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, 300);
    }, 3000);
  };

  const openModal = () => {
    setEditingTaskId(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setEditingTaskId(taskId);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
    setErrors({});
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { title?: string; dueDate?: string; description?: string } = {};
    let isValid = true;

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Task title is required';
      isValid = false;
    } else if (trimmedTitle.length < VALIDATION_RULES.title.minLength) {
      newErrors.title = `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
      isValid = false;
    } else if (trimmedTitle.length > VALIDATION_RULES.title.maxLength) {
      newErrors.title = `Title must be less than ${VALIDATION_RULES.title.maxLength} characters`;
      isValid = false;
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
        isValid = false;
      }
    }

    if (formData.description.length > VALIDATION_RULES.description.maxLength) {
      newErrors.description = `Description must be less than ${VALIDATION_RULES.description.maxLength} characters`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingTaskId) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                dueDate: formData.dueDate,
              }
            : t
        )
      );
      closeModal();
      showNotification('Task updated successfully!', 'success');
    } else {
      // Add new task
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: TaskStatus.ToDo,
        priority: formData.priority,
        dueDate: formData.dueDate,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
      closeModal();
      showNotification('Task added successfully!', 'success');
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showNotification('Task deleted successfully!', 'success');
  };

  const isDueSoon = (dueDate: string): boolean => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / DAY);
    return diff >= 0 && diff <= DUE_SOON_DAYS;
  };

  const getTaskNumber = (taskId: string): string => {
    const index = tasks.findIndex((t) => t.id === taskId);
    return String(index + 1).padStart(3, '0');
  };

  const getTimeAgo = (createdAt: string): string => {
    const created = new Date(createdAt);
    const diff = Date.now() - created.getTime();
    const minutes = Math.floor(diff / MINUTE);
    const hours = Math.floor(diff / HOUR);
    const days = Math.floor(diff / DAY);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < WEEK_DAYS) return `${days}d ago`;
    return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
    }
    setDraggingTaskId(null);
  };

  const priorityStyles = {
    high: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      dot: 'bg-red-500',
      label: 'High Priority',
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      dot: 'bg-amber-500',
      label: 'Medium',
    },
    low: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      dot: 'bg-blue-500',
      label: 'Low',
    },
  };

  const columnThemes = {
    [TaskStatus.ToDo]: {
      icon: 'text-slate-500',
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      statusDot: 'bg-slate-300',
    },
    [TaskStatus.InProgress]: {
      icon: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      statusDot: 'bg-amber-400',
    },
    [TaskStatus.Completed]: {
      icon: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      statusDot: 'bg-emerald-500',
    },
  };

  const statusBtnClass =
    'text-[11px] px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer';

  return (
    <div id="app" className="min-h-screen flex flex-col bg-slate-100 font-[Inter] text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`notification ${notification.type} ${
            notification.isFadingOut ? 'fade-out' : ''
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-table-columns text-2xl"></i>
            <h1 className="text-xl font-bold tracking-tight">Kanban</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openModal}
              className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              id="add-task-btn"
              title="Create Task"
            >
              <i className="fa-solid fa-plus text-base"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          {/* Modal Content */}
          <div
            id="task-modal"
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 id="modal-title" className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <i
                  id="modal-icon"
                  className={`fa-solid ${
                    editingTaskId ? 'fa-pen-to-square' : 'fa-plus-circle'
                  } text-indigo-500`}
                ></i>
                <span>{editingTaskId ? 'Edit Task' : 'Create New Task'}</span>
              </h2>
              <button
                type="button"
                onClick={closeModal}
                id="close-modal-btn"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form id="task-form" className="p-5" onSubmit={handleFormSubmit} noValidate>
              {/* Task Title */}
              <div className="mb-4">
                <label
                  htmlFor="task-title"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
                >
                  <i className="fa-solid fa-heading text-slate-400"></i>
                  <span>Task Title</span> <span className="text-red-500">*</span>
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  id="task-title"
                  name="title"
                  placeholder="What needs to be done?"
                  autoComplete="off"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all placeholder:text-slate-400 ${
                    errors.title
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
                {errors.title && (
                  <p id="title-error" className="text-red-500 text-xs mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Priority & Due Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="task-priority"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
                  >
                    <i className="fa-solid fa-flag text-slate-400"></i>
                    <span>Priority</span>
                  </label>
                  <select
                    id="task-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as TaskPriority })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="task-due-date"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
                  >
                    <i className="fa-regular fa-calendar text-slate-400"></i>
                    <span>Due Date</span>
                  </label>
                  <input
                    type="date"
                    id="task-due-date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => {
                      setFormData({ ...formData, dueDate: e.target.value });
                      if (errors.dueDate) setErrors({ ...errors, dueDate: undefined });
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                      errors.dueDate
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  />
                  {errors.dueDate && (
                    <p id="date-error" className="text-red-500 text-xs mt-1">
                      {errors.dueDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <label
                  htmlFor="task-description"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
                >
                  <i className="fa-solid fa-align-left text-slate-400"></i>
                  <span>Description</span>
                </label>
                <textarea
                  id="task-description"
                  name="description"
                  placeholder="Add more details about this task..."
                  rows={3}
                  maxLength={VALIDATION_RULES.description.maxLength}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all resize-none placeholder:text-slate-400 ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                ></textarea>
                <div className="flex justify-between items-center mt-1">
                  {errors.description && (
                    <p id="description-error" className="text-red-500 text-xs">
                      {errors.description}
                    </p>
                  )}
                  <p
                    id="char-count"
                    className={`text-xs ml-auto ${
                      formData.description.length > VALIDATION_RULES.description.maxLength
                        ? 'text-red-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {formData.description.length}/{VALIDATION_RULES.description.maxLength}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  id="cancel-btn"
                  onClick={closeModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-btn"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <i
                    className={`fa-solid ${
                      editingTaskId ? 'fa-save' : 'fa-plus'
                    }`}
                  ></i>
                  <span id="submit-btn-text">
                    {editingTaskId ? 'Save Changes' : 'Add Task'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <main className="flex-1 px-4 py-8 bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/30">
        <div id="columns-container" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);
            const theme = columnThemes[column.id];
            const isDragOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                data-status={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`bg-white/60 backdrop-blur-sm rounded-2xl p-5 flex flex-col min-h-[500px] border shadow-sm transition-all duration-200 ${
                  isDragOver
                    ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-200'
                    : 'border-slate-200/50'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 ${theme.bg} rounded-xl flex items-center justify-center`}>
                    <i className={`${column.icon} ${theme.icon} text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-slate-800">{column.title}</h2>
                    <p className="text-xs text-slate-400">
                      {columnTasks.length} {columnTasks.length === 1 ? 'task' : 'tasks'}
                    </p>
                  </div>
                </div>

                {/* Tasks List */}
                <div
                  className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 -mr-1"
                  id={`tasks-${column.id}`}
                >
                  {columnTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <i className="fa-regular fa-folder-open text-4xl mb-3 opacity-50"></i>
                      <p className="text-sm">No tasks yet</p>
                      <p className="text-xs mt-1">Click + to add one</p>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const priority = priorityStyles[task.priority] || priorityStyles.medium;
                      const formattedDate = task.dueDate
                        ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '';
                      const isPast =
                        task.dueDate &&
                        new Date(task.dueDate + 'T00:00:00') < new Date(new Date().setHours(0, 0, 0, 0)) &&
                        task.status !== TaskStatus.Completed;
                      const isSoon =
                        task.dueDate &&
                        !isPast &&
                        isDueSoon(task.dueDate) &&
                        task.status !== TaskStatus.Completed;
                      const isCompleted = task.status === TaskStatus.Completed;
                      const timeAgo = getTimeAgo(task.createdAt);
                      const taskNumber = getTaskNumber(task.id);
                      const isCardDragging = draggingTaskId === task.id;

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          data-task-id={task.id}
                          className={`group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                            isPast ? 'ring-2 ring-red-100 border-red-200' : ''
                          } ${isCompleted ? 'opacity-75' : ''} ${
                            isCardDragging ? 'opacity-40 scale-95' : ''
                          }`}
                        >
                          {/* Top Bar */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${theme.statusDot}`}></span>
                              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                #{taskNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => openEditModal(task.id)}
                                className="edit-btn text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                title="Edit task"
                              >
                                <i className="fa-solid fa-pen text-xs pointer-events-none"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="delete-btn text-slate-400 hover:text-red-500 hover:bg-red-50 w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                title="Delete task"
                              >
                                <i className="fa-solid fa-trash-can text-xs pointer-events-none"></i>
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <h3
                            className={`font-semibold text-slate-800 mb-2 leading-snug ${
                              isCompleted ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {task.title}
                          </h3>

                          {/* Description */}
                          {task.description && (
                            <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Tags Row */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {/* Priority Badge */}
                            <span
                              className={`${priority.bg} ${priority.text} text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></span>
                              {priority.label}
                            </span>

                            {isPast && (
                              <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                Overdue
                              </span>
                            )}

                            {isSoon && (
                              <span className="bg-orange-100 text-orange-600 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
                                Due Soon
                              </span>
                            )}

                            {isCompleted && (
                              <span className="bg-emerald-100 text-emerald-600 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                <i className="fa-solid fa-check"></i>
                                Done
                              </span>
                            )}
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 text-xs text-slate-400 pb-3 mb-3 border-b border-slate-100">
                            {formattedDate && (
                              <div
                                className={`flex items-center gap-1.5 ${
                                  isPast ? 'text-red-500' : isSoon ? 'text-orange-500' : ''
                                }`}
                              >
                                <i className="fa-regular fa-calendar"></i>
                                <span>{formattedDate}</span>
                              </div>
                            )}
                            <div
                              className="flex items-center gap-1.5"
                              title={`Created ${new Date(task.createdAt).toLocaleString()}`}
                            >
                              <i className="fa-regular fa-clock"></i>
                              <span>{timeAgo}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {task.status !== TaskStatus.ToDo && (
                              <button
                                type="button"
                                onClick={() => updateTaskStatus(task.id, TaskStatus.ToDo)}
                                className={`status-btn ${statusBtnClass} bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700`}
                              >
                                <i className="fa-solid fa-arrow-rotate-left pointer-events-none"></i>
                                <span>To Do</span>
                              </button>
                            )}

                            {task.status !== TaskStatus.InProgress && (
                              <button
                                type="button"
                                onClick={() => updateTaskStatus(task.id, TaskStatus.InProgress)}
                                className={`status-btn ${statusBtnClass} bg-amber-100 text-amber-700 hover:bg-amber-200`}
                              >
                                <i className="fa-solid fa-play pointer-events-none"></i>
                                <span>Start</span>
                              </button>
                            )}

                            {task.status !== TaskStatus.Completed && (
                              <button
                                type="button"
                                onClick={() => updateTaskStatus(task.id, TaskStatus.Completed)}
                                className={`status-btn ${statusBtnClass} bg-emerald-100 text-emerald-700 hover:bg-emerald-200`}
                              >
                                <i className="fa-solid fa-check pointer-events-none"></i>
                                <span>Complete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
