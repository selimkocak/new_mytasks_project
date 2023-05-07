// frontend\src\components\Tasks\Create\actions.js
import { createTask } from '../../../services/api';

export const createNewTask = async (title, description, status, team_membership, deadline) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await createTask(title, description, status, team_membership, deadline, token);
    const newTask = response.data;

    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    // Hata durumunda döndürülecek değeri belirlemek için burayı güncelleyin, örneğin null döndürebilirsiniz:
    return null;
  }
};

