import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Burada çıkış işlemleri gerçekleştirilecek (ör. token temizleme, kullanıcı durumunu güncelleme)
    console.log('Çıkış yapıldı.');
    navigate('/login');
  };

  return (
    <div>
      <h2>Çıkış Yap</h2>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
};

export default Logout;
