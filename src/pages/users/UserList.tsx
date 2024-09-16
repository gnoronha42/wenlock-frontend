import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Space, message, Modal, Drawer, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './style.css';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/services/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { setIsEditing, setTotalUsers, setUsers } from '../../hooks/slices/userSlice';
import { User } from '../../types/IUser';
import { RootState } from '../../store';
import moment from 'moment';



const UserList: React.FC = () => {
  const dispatch = useDispatch();
  const { users, total } = useSelector((state: RootState) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);



  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users?page=${currentPage}&limit=${pageSize}`);
      const data = response.data;

      if (Array.isArray(data.users)) {
        dispatch(setUsers(data.users));
        dispatch(setTotalUsers(data.total));
      } else {
        console.error('Expected an array but got:', data.users);
      }
    } catch (error) {
      console.log('err');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {

    fetchUsers();
  }, [dispatch, currentPage, pageSize]);


  const handleAddUser = () => {
    navigate('/user');
  };


  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await api.delete(`/users/${selectedUser.id}`);
        message.success(`Usuário ${selectedUser.fullName} excluído com sucesso.`);
        dispatch(setUsers(users.filter((user: User) => user.id !== selectedUser.id)));
        setIsModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        message.error('Erro ao excluir o usuário.');
      }
    }
  };


  const handleEditUser = (user: User) => {
    const { password, ...userWithoutPassword } = user;
    dispatch(setIsEditing(true));
    navigate(`/user-edit/${user.id}`, { state: { user: userWithoutPassword } });
  };

  const showDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleViewUser = (user: User) => {
    setUserDetails(user);
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setUserDetails(null);
  };



  const columns = [
    {
      title: 'Nome',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (text: string, record: User) => (
        <Space size="large" style={{ display: "flex", justifyContent: "flex-end", marginRight: "15px" }}>
          <span onClick={() => handleViewUser(record)}><EyeOutlined /></span>
          <span onClick={() => handleEditUser(record)}><EditOutlined /></span>
          <span onClick={() => showDeleteModal(record)}><DeleteOutlined /></span>
        </Space>
      ),
    },
  ];

  return (
    <div className="userListContainer">
      <div className="header">
        <Input.Search
          placeholder="Pesquisar usuário"
          style={{ width: 200 }}
        />
        <Button className='buttonRegister' onClick={handleAddUser}> +  Cadastrar Usuário</Button>
      </div>

      <Drawer
        title="Visualizar Usuário"
        placement="right"
        onClose={handleCloseDrawer}
        visible={isDrawerVisible}
      >
        {userDetails && (
          <div className="drawer-content">
            <h3 className="drawer-subtitle">Dados do Usuário</h3>
            <Divider />
            <div className="user-info">
              <div className="grid-item">
                <span className="drawer-label">Nome:</span>
                <span>{userDetails.fullName}</span>
              </div>
              <div className="grid-item">
                <span className="drawer-label">Matrícula:</span>
                <span>{userDetails.id}</span>
              </div>
              <div className="grid-item">
                <span className="drawer-label">Email:</span>
                <span>{userDetails.email}</span>
              </div>
            </div>
            <h3 className="drawer-subtitle">Detalhes</h3>
            <Divider />
            <div className="details-info">
              <div className="grid-item">
                <span className="drawer-label">Data de criação:</span>
                <span>{moment(userDetails.createdAt).format('DD/MM/YYYY')}</span>
              </div>
              <div className="grid-item">
                <span className="drawer-label">Última edição:</span>
                <span>{userDetails.updatedAt ? moment(userDetails.updatedAt).format('DD/MM/YYYY') : 'Nenhuma'}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
      {users.length === 0 ? (
        <div className="noData">
          <p>Nenhum usuário registrado</p>
          <p>Clique em cadastrar usuário para começar a cadastrar</p>
        </div>
      ) : (
        <div>
          <Table
            rowKey="id"
            dataSource={users}
            columns={columns}
            bordered={false}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
                fetchUsers();
              },
            }}
            style={{ width: '100%' }}

          />
        </div>
      )}
      <Modal
        open={isModalOpen}
        onOk={handleDeleteUser}
        onCancel={handleCancel}
        okText="Sim"
        cancelText="Não"

        footer={[
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button key="cancel" onClick={handleCancel} style={{ marginRight: '8px' }}>
              Não
            </Button>
            <Button className='globalButton' key="ok" type="primary" onClick={handleDeleteUser}>
              Sim
            </Button>
          </div>
        ]}
      >
        <h2 style={{ textAlign: 'center', color: 'black' }}>Deseja Excluir?</h2>
        <p style={{ textAlign: 'center', color: 'black' }}>O usuário será excluído.</p>
      </Modal>
    </div>
  );
};

export default UserList;