import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeams, updateTeam } from '../../../services/api';
import { TeamEditContainer, TeamEditForm } from '../../Views/Teams/TeamEditStyle';

const TeamEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
        const team = data.find((t) => t.id === parseInt(id));
        if (team) {
          setName(team.name);
        } else {
          setError(new Error('Team not found.'));
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTeam(id, name);
      navigate('/teams');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <TeamEditContainer>
      <h2>Edit Team</h2>
      {error && <p>{error.message}</p>}
      <TeamEditForm onSubmit={onSubmit}>
        <label htmlFor="name">Team Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Save</button>
      </TeamEditForm>
    </TeamEditContainer>
  );
};

export default TeamEdit;
