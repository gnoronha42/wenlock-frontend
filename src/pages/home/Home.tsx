import React from 'react';
import { WenLockHome } from '../../assets';
 import './style.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Home: React.FC = () => {
  
  const user = useSelector((state: RootState) => state.auth.user);
    
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return<div className="homeContainer">
      <div className="userInfo">
        <span className='title' >Olá {user?.fullName} ! </span>
        <span className='subtitle'>{currentDate}</span>
      </div>
      <div>
        <img className="mainImage" src={WenLockHome} alt="Home" />
      </div>
      <div className='welcomeText' >Bem-Vindo ao WenLock ! </div>
    </div>
}

export default Home;