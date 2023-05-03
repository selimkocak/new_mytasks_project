import React, { useEffect, useState } from 'react';
import { fetchTeams } from '../../../services/api';
import { TeamListContainer, TeamListItem } from '../../Views/Teams/TeamListStyle';

const TeamList = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
        setTeams(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <TeamListContainer>
      <h2>Team List</h2>
      {teams.length > 0 ? (
        <ul>
          {teams.map((team) => (
            <TeamListItem key={team.id}>{team.name}</TeamListItem>
          ))}
        </ul>
      ) : (
        <p>No teams found.</p>
      )}
    </TeamListContainer>
  );
};

export default TeamList;
