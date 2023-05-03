//frontend\src\components\Teams\Create\actions.js kodlarım
import { createTeam } from '../../../services/api';

export const createNewTeam = async (team_name, team_manager, team_members, team_color, team_symbol, memberships) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await createTeam(
      team_name,
      team_manager,
      team_members,
      team_color,
      team_symbol,
      memberships, // Bu satırı ekleyin
      token
    );
    const newTeam = response.data;

    return newTeam;
  } catch (error) {
    console.error('Error creating team:', error);
  }
};