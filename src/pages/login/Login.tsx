import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Input, Form } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import { RootState } from '../../store';

import './style.css';
import { loginFailure, loginSuccess } from '../../hooks/slices/authSlice';
import { WenLockLoginLogo } from '../../assets';
import CustomButton from '../../components/Button/CustomButton';
import api from '../../hooks/services/apiService';

interface LoginResponse {
    accessToken: string;
    fullName: string;
    email: string;
  }

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector((state: RootState) => state.auth.error);

    const handleLogin = async (e: React.FormEvent) => { 
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};
    
      
        if (!email) {
            newErrors.email = 'Email é obrigatório';
        }
        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            try {
                const response: { data: LoginResponse } = await api.post('/users/login', { email, password });
                
                const { accessToken, fullName, email: userEmail } = response.data;
                dispatch(loginSuccess({ accessToken, fullName, email: userEmail }));
    
                localStorage.setItem('token', accessToken); 
                localStorage.setItem('user', JSON.stringify({ fullName, email: userEmail })); 
                navigate('/home');
            } catch (error) {
                dispatch(loginFailure('Credenciais inválidas'));
            }
        }
    }

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className='loginPage'>
            <div className='imageContainer'>

                <img src={WenLockLoginLogo} alt="Login Image" />
            </div>
            <div className='formContainer'>
                <Card bordered={false} className="loginCard">
                    <h1>Bem-vindo</h1>
                    <h2>Entrar com sua conta</h2>
                    <form onSubmit={handleLogin}>
                        <Form.Item validateStatus={errors.email ? 'error' : ''} help={errors.email}>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ marginBottom: '10px', borderRadius: '5px' }}
                            />
                        </Form.Item>
                        <Form.Item validateStatus={errors.password ? 'error' : ''} help={errors.password}>
                            <Input.Password
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ marginBottom: '10px', borderRadius: '5px' }}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                        {authError && <div className="error">{authError}</div>}
                        <CustomButton color={"#0290A4"} title="Entrar" />
                        <p onClick={handleForgotPassword}>Esqueci minha Senha</p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;


