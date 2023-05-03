import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteTeam } from '../../../services/api';
import { TeamDeleteContainer } from '../../Views/Teams/TeamDeleteStyle';

const TeamDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await deleteTeam(id);
      navigate('/teams');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <TeamDeleteContainer>
      <h2>Delete Team</h2>
      {error && <p>{error.message}</p>}
      <p>Are you sure you want to delete this team?</p>
      <button onClick={onSubmit}>Yes, delete</button>
      <button onClick={() => navigate('/teams')}>Cancel</button>
    </TeamDeleteContainer>
  );
};

export default TeamDelete;
