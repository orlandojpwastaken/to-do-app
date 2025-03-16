import React, { useMemo } from 'react';
import ToDoItem from './ToDoItem';

function ToDoList({ tasks, onToggle, onEdit, onDelete, onDuplicate, listTitle }) {
  const renderedTasks = useMemo(
    () => tasks.map((task) => (
      <ToDoItem
        key={task.id}
        todo={task}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
      />
    )),
    [tasks, onToggle, onEdit, onDelete, onDuplicate]
  );

  return (
    <div className="task-list-container">
      <h3 className="task-list-title">{listTitle}</h3>
      <div className="task-grid">
        {renderedTasks}
      </div>
    </div>
  );
}

export default ToDoList;
