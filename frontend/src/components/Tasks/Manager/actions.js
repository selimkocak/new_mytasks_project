import { createTask, updateTask, deleteTask } from '../../../services/api';

export const handleTaskCreate = async (task, onTaskCreate, showFeedback) => {
  try {
    const token = localStorage.getItem('access_token');
    const { title, description } = task;
    const response = await createTask(title, description, 'todo', new Date(), token);

    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to create task');
    }

    onTaskCreate(response.data);
    showFeedback('success', 'Task created successfully');
  } catch (error) {
    console.error('Error creating task:', error);
    showFeedback('error', 'Failed to create task');
  }
};

export const handleTaskEdit = async (task, onTaskEdit, showFeedback) => {
  try {
    const updatedTask = await updateTask(task);
    onTaskEdit(updatedTask);
    showFeedback('Görev başarıyla güncellendi.');
  } catch (error) {
    showFeedback('Görev güncellenemedi. Lütfen tekrar deneyin.', 'error');
  }
};

export const handleTaskDelete = async (task, onTaskDelete, showFeedback) => {
  try {
    await deleteTask(task.id);
    onTaskDelete(task);
    showFeedback('Görev başarıyla silindi.');
  } catch (error) {
    showFeedback('Görev silinemedi. Lütfen tekrar deneyin.', 'error');
  }
};

export const showFeedback = (setFeedbackType, setFeedbackMessage, type, message) => {
  setFeedbackType(type);
  setFeedbackMessage(message);
  setTimeout(() => {
    setFeedbackMessage('');
  }, 3000);
};

