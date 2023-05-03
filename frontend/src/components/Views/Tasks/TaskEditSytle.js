// frontend/src/components/Views/TaskEditStyle.js
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 1rem;
  text-align: center;
`;

export const Form = styled.form``;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const FormLabel = styled.label`
  font-size: 16px;
  margin-bottom: 0.5rem;
`;

export const FormControl = styled.input`
  font-size: 16px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
`;

export const TextArea = styled.textarea`
  font-size: 16px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  resize: none;
`;

export const FormCheck = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

export const SubmitButton = styled.button`
  font-size: 16px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
