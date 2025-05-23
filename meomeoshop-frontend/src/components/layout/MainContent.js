import React from 'react';
import { useLocation } from 'react-router-dom';

function MainContent({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <main className={isAdminPage ? 'admin-main' : ''}>
      {children}
    </main>
  );
}

export default MainContent; 