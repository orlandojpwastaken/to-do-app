import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '../firebase';
import ToDoList from '../components/ToDoList';
import TaskDialog from '../components/TaskDialog';
import '../stylesheets/dashboard.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [dialogState, setDialogState] = useState({
    open: false,
    isEditing: false,
    taskToEdit: null,
    formData: { title: '', description: '', date: '', time: '' },
    error: '',
    dateError: ''
  });

  // Fetches task documents from Firestore
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, 'to-do-tasks'));
    const tasksArray = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data, deadline: data.deadline?.toDate() };
    });
    setTasks(tasksArray);
  };

  // Initial fetching
  useEffect(() => {
    fetchTasks();
  }, []);

  // Task validation checking
  const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

  const handleDateValidation = (date, time) => {
    if (!isValidDate(date)) return 'Please enter a valid date.';
    const deadlineDate = new Date(`${date}T${time}`);
    if (isNaN(deadlineDate)) return 'The date and time are not valid.';
    if (deadlineDate < new Date()) return 'The date and time cannot be in the past.';
    return '';
  };

  // Handles events when input data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDialogState((prevState) => ({
      ...prevState,
      formData: { ...prevState.formData, [name]: value },
      dateError: name === 'date' || name === 'time' ? '' : prevState.dateError
    }));
  };

  // Opens the task dialog for editing existing tasks
  const handleEdit = (task) => {
    const deadline = task.deadline instanceof Date ? task.deadline : new Date(task.deadline.seconds * 1000);
    setDialogState({
      open: true,
      isEditing: true,
      taskToEdit: task,
      formData: {
        title: task.title,
        description: task.description,
        date: deadline.toISOString().split('T')[0],
        time: deadline.toTimeString().split(' ')[0].slice(0, 5),
      },
      error: '',
      dateError: ''
    });
  };

  // Opens the task dialog for adding new tasks
  const handleAddTask = () => {
    setDialogState({
      open: true,
      isEditing: false,
      taskToEdit: null,
      formData: { title: '', description: '', date: '', time: '' },
      error: '',
      dateError: ''
    });
  };

  // Handles closing dialogs
  const handleDialogClose = () => {
    setDialogState(prevState => ({ ...prevState, open: false }));
  };

  // Submit form data (add or edit task)
  const handleSubmit = async () => {
    const { title, description, date, time } = dialogState.formData;
    const dateError = handleDateValidation(date, time);
    
    if (dateError) {
      setDialogState(prevState => ({ ...prevState, dateError }));
      return;
    }

    if (!title || !description) {
      setDialogState(prevState => ({ ...prevState, error: 'Please fill in the title and description.' }));
      return;
    }

    const deadline = new Date(`${date}T${time}`);
    const taskData = { title, description, deadline, completed: false };

    if (dialogState.isEditing) {
      await updateDoc(doc(db, 'to-do-tasks', dialogState.taskToEdit.id), taskData);
    } else {
      await addDoc(collection(db, 'to-do-tasks'), taskData);
    }

    fetchTasks();
    setDialogState({ open: false, isEditing: false, taskToEdit: null, formData: { title: '', description: '', date: '', time: '' }, error: '', dateError: '' });
  };

  // Handles toggling task completion state
  const handleToggle = async (id) => {
    const task = tasks.find(task => task.id === id);
    const updatedTask = { ...task, completed: !task.completed };
    await updateDoc(doc(db, 'to-do-tasks', id), updatedTask);
    fetchTasks();
  };

  // Handles deletion of tasks
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'to-do-tasks', id));
    fetchTasks();
  };

  // Handle duplication of tasks
  const handleDuplicate = async (task) => {
    const newDeadline = new Date(task.deadline);
    await addDoc(collection(db, 'to-do-tasks'), {
      title: task.title,
      description: task.description,
      deadline: newDeadline,
      completed: task.completed,
    });
    fetchTasks();
  };

  // Separates into 2 categories, completed and uncompleted tasks
  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="app-container">
      <h2 className="header">My To-Do List</h2>
      <div className="task-container">
        <div className="task-list">
          <div className="task-header">
            <h3>Unfinished Tasks</h3>
            <Button sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '5px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#45a049',
              },
              transition: 'background-color 0.3s ease', // Smooth transition on hover
            }} onClick={handleAddTask} className="add-task-button"
            >+ Add Task</Button>
          </div>
          <ToDoList
            tasks={uncompletedTasks}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </div>
        <div className="task-list">
          <div className="task-header">
            <h3>Completed Tasks</h3>
          </div>
          <ToDoList
            tasks={completedTasks}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </div>
      </div>
      <TaskDialog
        open={dialogState.open}
        handleClose={handleDialogClose}
        isEditing={dialogState.isEditing}
        newTask={dialogState.formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        dateError={dialogState.dateError}
        error={dialogState.error}
      />
    </div>
  );
};

export default App;