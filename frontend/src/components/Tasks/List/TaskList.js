//frontend\src\components\Tasks\List\TaskList.js kodlarım
import React, { useState, useEffect } from 'react';
import { fetchTasks, fetchUserTeams } from '../../../services/api';
import {
  TaskListContainer,
  TaskColumn,
} from '../../Views/Tasks/TaskListStyle';
import TaskStatus from '../Status/TaskStatus';

function TaskList({ tasks, onAction, filterValue }) {
  const [localTasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userTeamsResponse = await fetchUserTeams(token);
        const userTeams = userTeamsResponse.data;
        const allTasks = [];

        for (const team of userTeams) {
          const teamTasksResponse = await fetchTasks(team.id, token);
          const teamTasks = teamTasksResponse.data;
          allTasks.push(...teamTasks);
        }

        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(tasks)) {
      setTasks(tasks);
    }
  }, [tasks]);

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

  const filteredTasks = Array.isArray(localTasks) ? localTasks.filter((task) => {
    if (!filterValue) return true;
    return filterByDate(task);
  }) : [];

  
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
    const fetchData = async () => {
      try {
        const userTeams = await fetchUserTeams();
        const allTasks = [];
  
        for (const team of userTeams) {
          const teamTasks = await fetchTasks(team.id);
          allTasks.push(...teamTasks);
        }
  
        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchData(setTasks);
  }, []);
  
  useEffect(() => {
    console.log("localTasks:", localTasks);
    if (Array.isArray(tasks)) {
      setTasks(tasks);
    }
  }, [tasks, localTasks]);

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