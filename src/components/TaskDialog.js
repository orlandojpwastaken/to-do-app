import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormHelperText } from '@mui/material';

// Reusable TextField component
const TaskDialogTextField = ({ label, name, value, onChange, type = 'text' }) => (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      type={type}
      className="task-dialog-input"
      InputLabelProps={{
        shrink: true,
      }}
    />
  );  

const TaskDialog = ({
  open,
  handleClose,
  isEditing,
  newTask,
  handleInputChange,
  handleSubmit,
  dateError,
  error,
}) => {
  const isSubmitDisabled = !!dateError || !newTask.title || !newTask.description;

  return (
    <Dialog open={open} onClose={handleClose} className="task-dialog">
      <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <TaskDialogTextField
          label="Title"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
        />
        <TaskDialogTextField
          label="Description"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <div className="task-dialog-date-time">
          <TaskDialogTextField
            label="Date"
            name="date"
            value={newTask.date}
            onChange={handleInputChange}
            type="date"
          />
          <TaskDialogTextField
            label="Time"
            name="time"
            value={newTask.time}
            onChange={handleInputChange}
            type="time"
          />
        </div>
        {dateError && <FormHelperText error>{dateError}</FormHelperText>}
        {error && <FormHelperText error>{error}</FormHelperText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={isSubmitDisabled}
        >
          {isEditing ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;