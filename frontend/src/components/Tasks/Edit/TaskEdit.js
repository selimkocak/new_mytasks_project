// frontend/src/components/Tasks/TaskEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateTask, fetchTasks } from '../../../services/api';
import {
  Container,
  Card,
  Title,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  TextArea,
  SubmitButton,
} from '../../Views/Tasks/TaskEditSytle';

function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Planlanan');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const tasks = await fetchTasks();
        const task = tasks.find((t) => t.id === parseInt(id));
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setDeadline(task.deadline);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTaskById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await updateTask(id, title, description, status, deadline, token);
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Edit Task</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="title">Title:</FormLabel>
            <FormControl
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="description">Description:</FormLabel>
            <TextArea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></TextArea>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="status">Status:</FormLabel>
            <FormControl
              as="select"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planlanan">Planlanan</option>
              <option value="Devam Eden">Devam Eden</option>
              <option value="Tamamlanan">Tamamlanan</option>
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="deadline">Deadline:</FormLabel>
            <FormControl
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </FormGroup>
          <SubmitButton type="submit">Save</SubmitButton>
        </Form>
      </Card>
    </Container>
  );
}

export default TaskEdit;
