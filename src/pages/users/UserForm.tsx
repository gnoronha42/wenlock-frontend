import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../hooks/services/apiService';
import { updateUser, addUser } from '../../hooks/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { User } from '../../types/IUser';

interface UserFormProps {
  
  onClose?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({  onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm(); 
  const location = useLocation();
  const initialData = location.state?.user; 
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const isEditing = useSelector((state: RootState) => state.users.isEditing); 


  useEffect(() => {
    if (isEditing && initialData) {
      form.setFieldsValue({
        fullName: initialData.fullName,
        registrationNumber: initialData.registrationNumber,
        email: initialData.email,
        password: '', 
        confirmPassword: '', 
      });
    }
  }, [isEditing, initialData, form]);


  const onFinish = async (values: User) => {
    try {
        if (initialData) { 
          const response = await api.put(`/users/${initialData.id}`, values); 
          dispatch(updateUser({ ...initialData, ...values })); 
          message.success('Usuário atualizado com sucesso!'); 
        } else { 
          const response = await api.post('/users', values); 
          dispatch(addUser(response.data)); 
          message.success('Usuário cadastrado com sucesso!'); 
        }
        navigate("/user-list");
    } catch (error) {
        message.error('Erro ao salvar usuário.'); 
    }
};


  const checkFormCompletion = () => {
    const { fullName, registrationNumber, email, password, confirmPassword } = form.getFieldsValue();
    if (fullName && registrationNumber && email && (!isPasswordEditable || (password && confirmPassword))) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false); 
  };

  const handleOk = () => {
    setIsModalVisible(false); 
    navigate("/user-list")
  };

  const handleCancelModal = () => {
    setIsModalVisible(false); 
  };
  

  return (
    <>
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialData}
      form={form} 
      onValuesChange={checkFormCompletion} 
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Insira o nome completo*"
            name="fullName"
            rules={[{ required: true, message: 'Por favor, insira o nome completo' }]}
          >
            <Input maxLength={50} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Insira o Nº da matrícula"
            name="registrationNumber"
            rules={[{ required: true, message: 'Por favor, insira o Nº da matrícula' }]}
          >
            <Input maxLength={10} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Insira o E-mail*"
            name="email"
            rules={[{ required: true, message: 'Por favor, insira o E-mail' }, { type: 'email', message: 'Por favor, insira um e-mail válido' }]}
          >
            <Input maxLength={40} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: isPasswordEditable, message: 'Por favor, insira a senha' }]} 
          >
            <Input.Password placeholder="Digite uma nova senha" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Repetir Senha"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: isPasswordEditable, message: 'Por favor, repita a senha' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As senhas não coincidem'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Repita a nova senha" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
    
        <Button 
              type="default" 
              onClick={handleCancel}
              style={{ marginRight: '8px' }}
            >
              Cancelar
            </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ backgroundColor: '#0290A4', borderColor: '#0290A4', marginRight: '8px' }} 
            disabled={!isFormComplete} 
          >
            {isEditing ? 'Salvar' : 'Cadastrar'}
          </Button>
          
        </div>
      </Form.Item>
    </Form>
    
    <Modal
    open={isModalVisible}
    okText="Sim"
    cancelText="Não"
    okButtonProps={{ style: { backgroundColor: '#0290A4', borderColor: '#0290A4' } }} 
    footer={[
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button key="cancel" onClick={handleCancel} style={{ marginRight: '8px' }}>
          Não
        </Button>
        <Button className='globalButton' key="ok" type="primary" onClick={handleOk}>
          Sim
        </Button>
      </div>
    ]}
  >
   <h2 style={{ textAlign: 'center', color: 'black' }}>Deseja Cancelar ?</h2>
   <p style={{ textAlign: 'center', color: 'black' }}>Os dados inseridos não serão salvos.</p>
  </Modal>

 
  </>
  );
};

export default UserForm;
