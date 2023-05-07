// frontend\src\components\Tasks\Delete\TaskDelete.js kodlarım
import React from 'react';
import { Button } from 'react-bootstrap';
import { deleteTask } from '../../../services/api';

function TaskDelete({ task, onCancel }) {
  const handleDelete = async () => {
    try {
      await deleteTask(task.id, localStorage.getItem('access_token')); 
      
      console.log('Task deleted successfully');
      onCancel();
      // sayfayı yenileme ekle
      window.location.reload();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  return (
    <>
      <h3>Are you sure you want to delete this task?</h3>
        <div className="bd-example text-white example-margin" style={{marginRight: "auto"}}> 
      <Button variant="danger" size="sm" onClick={handleDelete}>
        Delete
      </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
        Cancel
      </Button>
      </div>
    </>
  );
}
export default TaskDelete;