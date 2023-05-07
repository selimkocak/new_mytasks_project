//frontend\src\components\Tasks\Manager\TaskManager.js kodlarım 
import React, { useState, Suspense } from 'react';
import Modal from 'react-modal';
import Alert from '../../Alerts/Alerts';
import { handleTaskCreate, handleTaskEdit, handleTaskDelete, showFeedback } from './actions';
import { partial } from 'lodash';
import TaskList from '../List/TaskList';
import TaskHeader from '../Header/TaskHeader';
import TaskFilter from '../Filter/TaskFilter'; // Import TaskFilter
import { TaskManagerNavbar } from '../../Views/Tasks/TaskManagerStyle';
import { fetchTasks } from '../../../services/api';
//import TeamCreate from '../../Teams/Create/TeamCreate'; // Yeni ekip oluşturma bileşenini ekleyin

const TaskCreate = React.lazy(() => import('../Create/TaskCreate'));
const TaskEdit = React.lazy(() => import('../Edit/TaskEdit'));
const TaskDelete = React.lazy(() => import('../Delete/TaskDelete'));

Modal.setAppElement('#root');

function TaskManager() {
  // Yerel durumları tanımlayın
  const [tasks, setTasks] = useState([]); // tasks ve setTasks durumunu tanımlayın
  const [taskAction, setTaskAction] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');

  const handleAction = (action, task = null) => {
    setTaskAction(action);
    setSelectedTask(task);
  };
  const [filterValue, setFilterValue] = useState('');
  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleTaskCreated = async (newTask) => {
    try {
      const token = localStorage.getItem('access_token');
      const data = await fetchTasks(token);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  

  // handleNewTeamClick fonksiyonunu tanımlayın
  const handleNewTeamClick = () => {
    console.log('Create Team button clicked');
  };
  

  return (
    <>
      {feedbackMessage && <Alert type={feedbackType}>{feedbackMessage}</Alert>}

      <TaskManagerNavbar>
        <TaskHeader onTaskCreated={handleTaskCreated} handleNewTeamClick={handleNewTeamClick} />
        <TaskFilter onFilterChange={handleFilterChange} />
      </TaskManagerNavbar>
      <TaskList
        tasks={tasks}
        onAction={handleAction}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
      />

      <Modal isOpen={taskAction === 'create'} onRequestClose={() => setTaskAction(null)}>
        <Suspense fallback={<div>Loading...</div>}>
        <TaskCreate
        onCreate={partial(
          handleTaskCreate,
          handleTaskCreated,
          showFeedback.bind(null, setFeedbackType, setFeedbackMessage),
        )}
        onCancel={() => setTaskAction(null)}
      />

        </Suspense>
      </Modal>
      <Modal isOpen={taskAction === 'edit'} onRequestClose={() => setTaskAction(null)}>
        <Suspense fallback={<div>Loading...</div>}>
        <TaskEdit
        task={selectedTask}
        onEdit={partial(
          handleTaskEdit,
          setTasks,
          showFeedback.bind(null, setFeedbackType, setFeedbackMessage),
        )}
        onCancel={() => setTaskAction(null)}
      />

        </Suspense>
      </Modal>
      <Modal isOpen={taskAction === 'delete'} onRequestClose={() => setTaskAction(null)}>
        <Suspense fallback={<div>Loading...</div>}>
        <TaskDelete
        task={selectedTask}
        onDelete={partial(
          handleTaskDelete,
          setTasks,
          showFeedback.bind(null, setFeedbackType, setFeedbackMessage),
        )}
        onCancel={() => setTaskAction(null)}
      />

        </Suspense>
      </Modal>
    </>
  );
}
export default React.memo(TaskManager);