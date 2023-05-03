//frontend\src\components\Tasks\Create\TaskCreate.js kodlarım
import React, { useState, useEffect } from 'react';
import useForm from '../../../hooks/useForm';
import { FormGroup, FormLabel, FormControl, TextArea, SubmitButton, Form } from '../../Views/Tasks/TaskCreateStyle';
import { formatISO } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { createNewTask } from './actions';
import { getUserTeamMembership } from '../../../services/api';

function TaskCreate({ onTaskCreated, userId }) {
  const initialValues = {
    title: '',
    description: '',
    status: 'Planlanan',
    team_membership:'',
    deadline: '',
  };

  const [values, handleChange, resetForm] = useForm(initialValues);
  const { title, description, status, team_membership, deadline } = values; // Add team_membership
  const [open, setOpen] = useState(false);
  const [userTeams, setUserTeams] = useState([]);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = await createNewTask(title, description, status, team_membership, deadline);
    resetForm();
    handleClose();
    if (onTaskCreated) {
      onTaskCreated(newTask);
    }
  };
  
  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userTeamMemberships = await getUserTeamMembership(token);
        setUserTeams(userTeamMemberships.data);
      } catch (error) {
        console.error('Error fetching user teams:', error);
      }
    };
    fetchUserTeams();
  }, []);
  
   
return (
    <>
      <button onClick={handleOpen}>Create Task</button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="title">Title:</FormLabel>
              <FormControl
                type="text"
                id="title"
                value={title}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="description">Description:</FormLabel>
              <TextArea
                id="description"
                value={description}
                onChange={handleChange}
              ></TextArea>
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="status">Status:</FormLabel>
              <FormControl
                as="select"
                id="status"
                value={status}
                onChange={handleChange}
              >
                <option value="Planlanan">Planlanan</option>
                <option value="Devam Eden">Devam Eden</option>
                <option value="Tamamlanan">Tamamlanan</option>
              </FormControl>
              <FormGroup>
              <FormLabel htmlFor="team_membership">Team Membership:</FormLabel>
              <FormControl
                as="select"
                id="team_membership"
                value={team_membership}
                onChange={handleChange}
              >
                <option value="">Select a Team</option>
                {userTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name} 
                </option>
              ))}

              </FormControl>
            </FormGroup>
              <FormLabel htmlFor="deadline">Deadline:</FormLabel>
              <FormControl
                type="date"
                id="deadline"
                value={deadline}
                onChange={handleChange}
                min={formatISO(new Date(), { representation: 'date' })}
              />
            </FormGroup>
          </Form>
        </DialogContent>
        <DialogActions>
          <SubmitButton type="submit" onClick={handleSubmit}>
            Create Task
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default TaskCreate;