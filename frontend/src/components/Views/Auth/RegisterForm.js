import React, { useState } from 'react';
import Alerts from '../../Alerts/Alerts';
import { createUser } from '../../../services/api';
import {
  RegisterContainer,
  RegisterFormWrapper,
  FormTitle,
  Form,
  FormLabel,
  FormInput,
  FormButton,
} from '../Tasks/RegisterFormStyle';


const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertData, setAlertData] = useState({ message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const response = await createUser(email, password);
        if (response.status === 201) {
          console.log('Kayıt yapıldı:', email, password);
          setAlertData({ message: 'Başarıyla kayıt oldunuz.', type: 'success' });
        }
      } catch (error) {
        console.error('Kayıt başarısız:', error);
        setAlertData({ message: 'Kayıt başarısız, lütfen tekrar deneyin.', type: 'error' });
      }
    } else {
      setAlertData({ message: 'Şifreler eşleşmiyor, lütfen kontrol edin.', type: 'error' });
    }
  };
  

  return (
    <RegisterContainer>
      <RegisterFormWrapper>
        <FormTitle>Kayıt Ol</FormTitle>
        {alertData.message && <Alerts message={alertData.message} type={alertData.type} />}
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
          <FormLabel>Şifre Doğrulama:</FormLabel>
          <FormInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormButton type="submit">Kayıt Ol</FormButton>
        </Form>
      </RegisterFormWrapper>
    </RegisterContainer>
  );
};

export default RegisterForm;
