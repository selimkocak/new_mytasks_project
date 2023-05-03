//frontend\src\components\Tasks\List\TaskList.js kodlarım
import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../../../services/api';
import {
  TaskListContainer,
  TaskColumn,
} from '../../Views/Tasks/TaskListStyle';
import TaskStatus from '../Status/TaskStatus';

function TaskList({ tasks, onAction, filterValue, onFilterChange }) {
  const [localTasks, setTasks] = useState([]);

  const filterByDate = (task) => {
    const now = new Date();
    const taskDeadline = new Date(task.deadline);
    const oneDayInMs = 24 * 60 * 60 * 1000;

    switch (filterValue) {
      case 'today':
        return taskDeadline.toDateString() === now.toDateString();
      case 'thisWeek':
        return taskDeadline < new Date(now.getTime() + 7 * oneDayInMs) && taskDeadline >= now;
      case 'nextWeek':
        return taskDeadline < new Date(now.getTime() + 14 * oneDayInMs) && taskDeadline >= new Date(now.getTime() + 7 * oneDayInMs);
      case 'thisMonth':
        return taskDeadline.getMonth() === now.getMonth() && taskDeadline.getFullYear() === now.getFullYear();
      case 'nextMonth':
        return taskDeadline.getMonth() === now.getMonth() + 1 && taskDeadline.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const filteredTasks = localTasks.filter((task) => {
    if (!filterValue) return true;
    return filterByDate(task);
  });;
  
  const filteredPlannedTasks = filteredTasks.filter(
    (task) => !task.completed && task.status === 'Planlanan'
  );
  const filteredOngoingTasks = filteredTasks.filter(
    (task) => !task.completed && task.status === 'Devam Eden'
  );
  const filteredCompletedTasks = filteredTasks.filter(
    (task) => task.completed || task.status === 'Tamamlanan'
  );

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    setTasks(tasks);
  }, [tasks]);

return (
    <TaskListContainer>
    
      <TaskColumn>
        <TaskStatus
          title="Planlanan"
          tasks={filteredPlannedTasks}
          color="#F7C04A"
          onAction={(action, task) => {
            console.log(action, task);
            onAction(action, task);
          }}
        />
      </TaskColumn>
      <TaskColumn>
        <TaskStatus
          title="Devam Eden"
          tasks={filteredOngoingTasks}
          color="#3F497F"
          onAction={(action, task) => {
            console.log(action, task);
            onAction(action, task);
          }}
        />
      </TaskColumn>
      <TaskColumn>
        <TaskStatus
          title="Tamamlanan"
          tasks={filteredCompletedTasks}
          color="#539165"
          onAction={(action, task) => {
            console.log(action, task);
            onAction(action, task);
          }}
        />
      </TaskColumn>
    </TaskListContainer>
  );
}
export default TaskList;