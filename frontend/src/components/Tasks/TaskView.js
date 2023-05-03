// frontend\src\components\Tasks\TaskView.js
import React from 'react';
import { TaskViewContainer } from '../Views/Tasks/TaskViewStyle';

const TaskView = ({ task, onClose }) => {
  return (
    <TaskViewContainer>
      <button onClick={onClose}>Close</button>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </TaskViewContainer>
  );
};

export default TaskView;
