//frontend\src\services\api.js kodlarım
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createTask = (title, description, status, team_membership, deadline, token) => {
  return api.post("/tasks/", {
    title,
    description,
    status,
    team_membership,
    deadline
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};

export const updateTask = (id, title, description, status, team_membership, deadline, token) => {
  return api.put(`/tasks/${id}/`, {
    title,
    description,
    status,
    team_membership,
    deadline
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};

export const deleteTask = async (id, token) => {
  try {
    const response = await api.delete(`/tasks/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      console.error('Error:', response);
      throw new Error('Failed to delete task');
    }

    return true;
  } catch (error) {
    console.error('Error:', error.response || error);
    throw error;
  }
};

export const createUser = async (email, password, first_name, last_name) => {
  try {
    const response = await api.post('/custom_user/register/', {
      email,
      password,
      first_name,
      last_name,
    });
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/token/', {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

//frontend\src\services\api.js görevleri listelem kodlarım
export const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await api.get('/custom_user/tasks/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};


// Takım oluşturma frontend\src\services\api.js kodlarım
export const createTeam = (team_name, team_manager, team_members, team_color, team_symbol, memberships, token) => {
  return api.post("/teams/", {
    team_name,
    team_manager,
    team_members,
    team_color,
    team_symbol,
    memberships,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};


// Takım güncelleme
export const updateTeam = (id, team_name, team_manager, team_members, team_color, team_symbol, token) => {
  return api.put(`/teams/${id}/`, {
    team_name,
    team_manager: [team_manager],
    team_members: team_members.map(member => member.id),
    team_color,
    team_symbol
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};

// Takım silme
export const deleteTeam = async (id, token) => {
  try {
    const response = await api.delete(`/teams/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      console.error('Error:', response);
      throw new Error('Failed to delete team');
    }

    return true;
  } catch (error) {
    console.error('Error:', error.response || error);
    throw error;
  }
};

// Takım listeleme
export const fetchTeams = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await api.get('/teams/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await api.get('/custom_user/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Kullanıcı e-postalarını almak için fonksiyon
export const getUserEmail = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await api.get('/custom_user/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user emails:', error);
    throw error;
  }
};

// kullanıcıların üye oldukları takım listesi için fonksiyon frontend\src\services\api.js
export const getUserTeamMembership = (token) => {
  return api.get(`/custom_user/teams/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

