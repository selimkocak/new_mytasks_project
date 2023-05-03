import React, { useState } from 'react';
import { loginUser, setAuthToken } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginFormWrapper,
  Form,
  FormTitle,
  FormLabel,
  FormInput,
  FormButton,
} from '../../Views/Tasks/LoginFormStyle';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
  
      if (response.status === 200) {
        console.log('Giriş yapıldı:', email, password);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setAuthToken(response.data.access);
        await navigate('/tasks');
        window.location.reload();
      }
    } catch (error) {
      console.error('Giriş başarısız:', error);
    }
  };

  return (
    <LoginContainer>
      <LoginFormWrapper>
        <FormTitle>Giriş Yap</FormTitle>
        <Form onSubmit={handleSubmit}>
          <FormLabel>Email:</FormLabel>
          <FormInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormLabel>Şifre:</FormLabel>
          <FormInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormButton type="submit">Giriş Yap</FormButton>
        </Form>
      </LoginFormWrapper>
    </LoginContainer>
  );
};

export default LoginForm;
