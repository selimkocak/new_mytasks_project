// frontend\src\components\Tasks\TaskItem.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'; // Import React Modal
import {
  TaskItemContainer,
  TaskTitle,
  TaskDescription,
  TaskActions,
  ViewIconContainer,
} from '../../Views/Tasks/TaskItemStyle';
import TaskView from '../TaskView';
import { Button } from 'react-bootstrap';
import TaskDelete from '../../Tasks/Delete/TaskDelete'; // Import TaskDelete
import {deleteModalStyle} from '../../Views/Tasks/TasksModalStyle';

function TaskItem({ task }) {
  const { id, username, title, description, status, completed } = task;

  let backgroundColor;
  switch (status) {
    case 'Planlanan':
      backgroundColor = '#FFCC80';
      break;
    case 'Devam Eden':
      backgroundColor = '#80DEEA';
      break;
    case 'Tamamlanan':
      backgroundColor = '#C5E1A5';
      break;
    default:
      backgroundColor = '#FFFFFF';
      break;
  }

  const truncatedDescription = description.substring(0, 180);
  const isTruncated = description.length > 180;

  const [showTaskView, setShowTaskView] = useState(false);

  const toggleTaskView = () => {
    setShowTaskView(!showTaskView);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false); // Add this line

  const openDeleteModal = () => setShowDeleteModal(true); // Add this line
  const closeDeleteModal = () => setShowDeleteModal(false); // Add this line

  return (
    <TaskItemContainer completed={task.status === 'Tamamlanan'} style={{ backgroundColor }}>
      <div>
        <TaskTitle>{title}</TaskTitle>
        <TaskDescription completed={completed}>
          {isTruncated ? truncatedDescription + '...' : description}
        </TaskDescription>
      </div>
      {isTruncated && (
        <ViewIconContainer onClick={toggleTaskView}>👁️</ViewIconContainer> // Bu satırı değiştirin
      )}
      <TaskActions>
      <div>
          <Button variant="info" size="sm">{username}</Button>
          </div>
         <Button variant="info" size="sm">{id}</Button>
       <div >
        <Link to={`/tasks/edit/${task.id}`}>
          <Button variant="success" size="sm">Edit</Button>
        </Link>
        </div>

        <div>
          <Button variant="danger" size="sm" onClick={openDeleteModal}>
            Delete
          </Button>
        </div>
       </TaskActions>
       <Modal
        isOpen={showDeleteModal}
        onRequestClose={closeDeleteModal}
        style={deleteModalStyle} // Özel stilimizi kullanarak Modal bileşenini güncelleyin
      >
        <TaskDelete task={task} onCancel={closeDeleteModal} />
      </Modal>

      {showTaskView && (
        <TaskView task={task} onClose={toggleTaskView} />
      )}
    </TaskItemContainer>
  );
}
export default TaskItem;