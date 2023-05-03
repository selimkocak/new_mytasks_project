//frontend\src\components\Teams\Create\TeamCreate.js kodlarım
import React, { useState, useEffect } from 'react';
import useForm from '../../../hooks/useForm';
import { FormGroup, FormLabel, FormControl, SubmitButton, Form } from '../../Views/Tasks/TaskCreateStyle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { createNewTeam } from './actions';
import { getUserEmail } from '../../../services/api';
import Select from 'react-select';
import Button from '@mui/material/Button';

function TeamCreate({ isOpen, onTeamCreated }) {
  const initialValues = {
    team_name: '',
    team_manager: '',
    team_color: '#000000',
    team_symbol: '',
    team_members: [], // Bu satırı ekleyin
    memberships: [{ user: '', role: '' }],
  };
      
  const [values, handleChange, resetForm] = useForm(initialValues);
  const { team_name, team_manager, team_members, team_color, team_symbol, memberships } = values;
  const [users, setUsers] = useState([]);
  const roleOptions = [
    { value: 'Team Manager', label: 'Team Manager' },
    { value: 'Team Member', label: 'Team Member' },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const fetchedUsers = await getUserEmail();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTeam = await createNewTeam(team_name, team_manager, team_members, team_color, team_symbol, memberships);
      resetForm();
      if (onTeamCreated) {
        onTeamCreated(newTeam);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };
  // Kullanıcıları Select bileşenine uygun formatta dönüştürün
  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.email,
    dataEmail: user.email,
  }));

  const handleTeamManagerChange = (selectedOption) => {
    handleChange({
      target: {
        id: 'team_manager',
        value: selectedOption.dataEmail,
      },
    });
  };

  const handleTeamMembersChange = (selectedOptions) => {
    handleChange({
      target: {
        id: 'team_members',
        value: selectedOptions.map(option => option.dataEmail),
      },
    });
  };

  const addMembership = () => {
    handleChange({
      target: {
        id: 'memberships',
        value: [...memberships, { user: '', role: '' }],
      },
    });
  };


  return (
    <>
     <Dialog open={isOpen} onClose={onTeamCreated}>
        <DialogTitle>Create Team</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="team_name">Team Name:</FormLabel>
              <FormControl
                type="text"
                id="team_name"
                value={team_name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="team_manager">Team Manager:</FormLabel>
              <Select
                id="team_manager"
                value={userOptions.find(
                  (option) => option.dataEmail === team_manager
                )}
                onChange={handleTeamManagerChange}
                options={userOptions}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="team_members">Team Members:</FormLabel>
              <Select
                id="team_members"
                isMulti
                value={team_members.map((email) =>
                  userOptions.find((option) => option.dataEmail === email)
                )}
                onChange={handleTeamMembersChange}
                options={userOptions}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="team_color">Team Color:</FormLabel>
              <FormControl
                type="color"
                id="team_color"
                value={team_color}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="team_symbol">Team Symbol:</FormLabel>
              <FormControl
                type="text"
                id="team_symbol"
                value={team_symbol}
                onChange={handleChange}
              />
            </FormGroup>
            <h3>MEMBERSHIPS</h3>
{memberships.map((membership, index) => (
  <FormGroup key={index}>
    <FormLabel htmlFor={`user_${index}`}>User:</FormLabel>
    <Select
      id={`user_${index}`}
      value={userOptions.find(
        (option) => option.dataEmail === membership.user
      )}
      onChange={(selectedOption) => {
        const newMemberships = [...memberships];
        newMemberships[index].user = selectedOption.dataEmail;
        handleChange({
          target: {
            id: 'memberships',
            value: newMemberships,
          },
        });
      }}
      options={userOptions}
    />
  <FormLabel htmlFor={`role_${index}`}>Role:</FormLabel>
  <Select
    id={`role_${index}`}
    value={roleOptions.find(
      (option) => option.value === membership.role
    )}
    onChange={(selectedOption) => {
      const newMemberships = [...memberships];
      newMemberships[index].role = selectedOption.value;
      handleChange({
        target: {
          id: 'memberships',
          value: newMemberships,
        },
      });
    }}
    options={roleOptions}
  />
    <Button
      variant="danger"
      size="sm"
      onClick={() => {
        handleChange({
          target: {
            id: 'memberships',
            value: memberships.filter((_, i) => i !== index),
          },
        });
      }}
    >
      Delete
    </Button>
  </FormGroup>
))}
<Button onClick={addMembership}>Add another Membership</Button>      
            <DialogActions>
              <SubmitButton type="submit">Create Team</SubmitButton>
             
            </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default TeamCreate;