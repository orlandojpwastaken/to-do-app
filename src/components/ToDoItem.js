import React, { useState, useCallback } from 'react';
import { Card, CardContent, IconButton, Menu, MenuItem, Checkbox } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ToDoItem({ todo, onToggle, onEdit, onDelete, onDuplicate }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuAction = useCallback((action) => {
    handleMenuClose();
    switch (action) {
      case 'edit':
        onEdit(todo);
        break;
      case 'delete':
        onDelete(todo.id);
        break;
      case 'duplicate':
        onDuplicate(todo);
        break;
      default:
        break;
    }
  }, [handleMenuClose, onEdit, onDelete, onDuplicate, todo]);

  const completedStyles = todo.completed ? {
    textDecoration: 'line-through',
    color: '#888',
    opacity: 0.6
  } : {};

  const formattedDeadline = new Date(todo.deadline).toLocaleString();

  return (
    <Card
      sx={{
        margin: '10px',
        padding: '10px',
        position: 'relative',
        backgroundColor: '#f0f4f8',
        borderRadius: '8px',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
    >
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            inputProps={{ 'aria-label': 'checkbox' }}
          />

          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <h3 className="todo-title" style={{ ...completedStyles, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {todo.title}
            </h3>
            <p className="todo-desc" style={{ ...completedStyles, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {todo.description}
            </p>
            <p className="todo-deadline" style={{ fontSize: '12px', color: '#888' }}>
              Deadline: {formattedDeadline}
            </p>
          </div>

          <IconButton onClick={handleMenuOpen} className="todo-actions" sx={{ flexShrink: 0 }}>
            <MoreVertIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleMenuAction('edit')}>Edit</MenuItem>
            <MenuItem onClick={() => handleMenuAction('delete')}>Delete</MenuItem>
            <MenuItem onClick={() => handleMenuAction('duplicate')}>Duplicate</MenuItem>
          </Menu>
        </div>
      </CardContent>
    </Card>
  );
}

export default ToDoItem;