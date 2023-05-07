//frontend\src\components\Tasks\Header\TaskHeader.js kodlarım
import React, { useState } from 'react';
import { TaskHeaderContainer, Button } from '../../Views/Tasks/TaskHeaderStyle';
import TeamCreate from '../../Teams/Create/TeamCreate';
import TaskCreate from '../Create/TaskCreate';

function TaskHeader({ onTaskCreated }) {
  const [isTeamCreateModalOpen, setIsTeamCreateModalOpen] = useState(false);

  const closeTeamCreateModal = () => {
    setIsTeamCreateModalOpen(false);
  };

  return (
    <TaskHeaderContainer>
      <TaskCreate onTaskCreated={onTaskCreated} />

      <Button onClick={() => setIsTeamCreateModalOpen(true)}>Create Team</Button>

      <TeamCreate isOpen={isTeamCreateModalOpen} onTeamCreated={closeTeamCreateModal} />
    </TaskHeaderContainer>
  );
}
export default TaskHeader;