import styled from 'styled-components';

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const RegisterFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
`;

export const FormTitle = styled.h2`
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FormLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
`;

export const FormInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
`;

export const FormButton = styled.button`
  background-color: #2c3e50;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #34495e;
  }
`;
