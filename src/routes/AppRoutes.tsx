// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/home/Home';
import Login from '../pages/login/Login';
import ForgotPassword from '../pages/login/ForgotPassword';
import UserForm from '../pages/users/UserForm';
import UserList from '../pages/users/UserList';




const isAuthenticated = () => {
  return !!localStorage.getItem('token'); 
};


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        }
      />


      <Route
        path="/user-list"
        element={
          <PrivateRoute>
            <Layout>
              <UserList />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/user"
        element={
          <PrivateRoute>
            <Layout>
              <UserForm />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/user-edit/:id"
        element={
          <PrivateRoute>
            <Layout>
              <UserForm />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
