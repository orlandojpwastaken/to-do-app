import React, { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { auth, onAuthStateChanged , db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '../firebase';

import ProfileDialog from '../components/ProfileDialog';
import ToDoList from '../components/ToDoList';
import TaskDialog from '../components/TaskDialog';
import '../stylesheets/dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dialogState, setDialogState] = useState({
    open: false,
    isEditing: false,
    taskToEdit: null,
    formData: { title: '', description: '', date: '', time: '' },
    error: '',
    dateError: ''
  });

  // Handles opening and closing of the profile dialog
  const handleProfileOpen = () => {
    setProfileOpen(true);
    handleMenuClose();
  };

  // Fetches task documents from Firestore
  const fetchTasks = async () => {
    if (!auth.currentUser) return;
    
    const userTasksRef = collection(db, 'users', auth.currentUser.uid, 'to-do-tasks');
    const querySnapshot = await getDocs(userTasksRef);

    const tasksArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      deadline: doc.data().deadline?.toDate(),
    }));

    setTasks(tasksArray);
  };

  // Initial fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTasks(); 
      } else {
        console.log("No user logged in.");
      }
    });

    return () => unsubscribe(); 
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
    if (!auth.currentUser) return;
    
    const userTasksRef = collection(db, 'users', auth.currentUser.uid, 'to-do-tasks');
  
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
  
    if (dialogState.isEditing) {
      const existingTask = dialogState.taskToEdit;
      const taskData = { 
        title, 
        description, 
        deadline, 
        completed: existingTask.completed
      };
  
      await updateDoc(doc(userTasksRef, existingTask.id), taskData);
    } else {
      const taskData = { title, description, deadline, completed: false };
      await addDoc(userTasksRef, taskData);
    }
  
    fetchTasks();
    setDialogState({
      open: false,
      isEditing: false,
      taskToEdit: null,
      formData: { title: '', description: '', date: '', time: '' },
      error: '',
      dateError: ''
    });
  };

  // Handles toggling task completion state
  const handleToggle = async (id) => {
    if (!auth.currentUser) return;
    const task = tasks.find(task => task.id === id);
    const updatedTask = { ...task, completed: !task.completed };
    await updateDoc(doc(db, 'users', auth.currentUser.uid, 'to-do-tasks', id), updatedTask);
    fetchTasks();
  };

  // Handles deletion of tasks
  const handleDelete = async (id) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'to-do-tasks', id));
    fetchTasks();
  };  

  // Handle duplication of tasks
  const handleDuplicate = async (task) => {
    if (!auth.currentUser) return;
    
    const userTasksRef = collection(db, 'users', auth.currentUser.uid, 'to-do-tasks');
  
    const newDeadline = new Date(task.deadline);
    await addDoc(userTasksRef, {
      title: task.title,
      description: task.description,
      deadline: newDeadline,
      completed: task.completed,
    });
  
    fetchTasks();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Separates into 2 categories, completed and uncompleted tasks
  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="app-container">
      <AppBar position="static" sx={{ backgroundColor: '#005082' }}>
        <Toolbar>
          <img src={Logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WaveNote - Personal To-Do App
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <div className="header-spacing"></div>

      <div className="task-container-wrapper">
        <div className="task-list-container">
          <div className="task-header">
            <h3>Unfinished Tasks</h3>
            <Button
              sx={{
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '5px',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
                transition: 'background-color 0.3s ease',
              }}
              onClick={handleAddTask}
              className="add-task-button"
            >
              + Add Task
            </Button>
          </div>
          <ToDoList
            tasks={uncompletedTasks}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </div>
        <div className="task-list-container">
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

      <ProfileDialog open={profileOpen} handleClose={() => setProfileOpen(false)} />
    
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

export default Dashboard;
