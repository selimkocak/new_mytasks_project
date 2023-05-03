import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomNavbar from './components/Navbar/Navbar';
import LoginForm from './components/Views/Auth/LoginForm';
import RegisterForm from './components/Views/Auth/RegisterForm';
import TaskCreate from './components/Tasks/Create/TaskCreate';
import TaskEdit from './components/Tasks/Edit/TaskEdit';
import TaskDelete from './components/Tasks/Delete/TaskDelete';
import Logout from './components/Views/Auth/Logout';
import Auth from './utils/auth';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskManager from './components/Tasks/Manager/TaskManager';
import TeamList from './components/Teams/List/TeamList'; // İçe aktarma
import TeamCreate from './components/Teams/Create/TeamCreate'; // İçe aktarma
import TeamEdit from './components/Teams/Edit/TeamEdit'; // İçe aktarma
import TeamDelete from './components/Teams/Delete/TeamDelete'; // İçe aktarma

const ProtectedRoutes = React.memo(() => {
  const navigate = useNavigate();
  if (!Auth.isAuthenticated()) {
    return <LoginForm />;
  }

  const handleAction = (action, task) => {
    console.log(action, task);
    if (action === 'create') {
      navigate('/tasks/create');
    } else if (action === 'createTeam') {
      navigate('/teams/create');
    }
  };
  

  return (
    <Routes>
      <Route path="/tasks" element={<TaskManager />} />
      <Route path="/tasks/create" element={<TaskCreate />} />
      <Route path="/tasks/edit/:id" element={<TaskEdit />} />
      <Route path="/tasks/delete/:id" element={<TaskDelete />} />
      <Route path="/teams" element={<TeamList />} /> {/* Yeni Route */}
      <Route path="/teams/create" element={<TeamCreate />} /> {/* Yeni Route */}
      <Route path="/teams/edit/:id" element={<TeamEdit />} /> {/* Yeni Route */}
      <Route path="/teams/delete/:id" element={<TeamDelete />} /> {/* Yeni Route */}
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<TaskManager onAction={handleAction} />} />
    </Routes>
  );
});

function App() {
  return (
    <AuthContext.Provider value={Auth}>
      <Router>
        <div>
          <CustomNavbar />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<ProtectedRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
export default App;
