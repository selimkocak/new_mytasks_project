//frontend\src\components\Tasks\Status\TaskStatus.js kodlarım
import React from 'react';
import TaskItem from '../../Tasks/Item/TaskItem';
import { TaskStatusContainer, TaskStatusHeader } from '../../Views/Tasks/TaskStatusStyle';

function TaskStatus({ title, tasks, color }) {
  return (
    <TaskStatusContainer color={color}>
      <TaskStatusHeader>{title}</TaskStatusHeader>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </TaskStatusContainer>
  );
}
export default TaskStatus;