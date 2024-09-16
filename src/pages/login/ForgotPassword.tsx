import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Input, Form, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import { RootState } from '../../store';

import './style.css';
import { loginFailure, loginSuccess } from '../../hooks/slices/authSlice';
import { WenLockForgotPassword, WenLockLoginLogo, WenLockLogo } from '../../assets';
import CustomButton from '../../components/Button/CustomButton';
import api from '../../hooks/services/apiService';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector((state: RootState) => state.auth.error);

    const handleLogin = async (e: React.FormEvent) => { // Altere para async
        e.preventDefault();
        const newErrors: { email?: string; password?: string } = {};
    
        // ... validação existente ...
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            try {
                const response = await api.post('/users/forgot-password', { email }); // Chamada de API
                if (response.status === 201) {
                    message.success("email enviado")
                }
            } catch (error) {
                dispatch(loginFailure('Erro ao enviar email de recuperação')); // Tratamento de erro
            }
        }
    };

    const handleBackToLogin = () => {
        navigate('/');
    };

    return (
        <div className='loginPage'>
            <div className='imageContainer'>

                <img src={WenLockForgotPassword} alt="Login Image" />
            </div>
            <div className='formContainer'>
                <Card bordered={false} className="loginCard">
                    <img src={WenLockLogo} alt="" />
                    <h2>Recuperação de senha</h2>
                    <p style={{ textAlign: "left" }} >Insira seu e-mail para a recuperar sua senha</p>
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

                        {authError && <div className="error">{authError}</div>}
                        <CustomButton color={"#0290A4"} title="Recuperar" />
                        <p onClick={handleBackToLogin}>Voltar para o Login</p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;


