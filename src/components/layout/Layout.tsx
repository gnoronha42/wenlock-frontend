import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    PieChartOutlined,
    BookOutlined,
    RightOutlined,
    LeftOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Tooltip } from 'antd';
import "./style.css"
import { WenLockLogoCollapsed, WenLockLogoMini } from '../../assets';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { logout } from '../../hooks/slices/authSlice';

const { Header, Sider, Content } = Layout;

const App = ({ children }: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const [title, setTitle] = useState("");
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userName = user?.fullName;
    const userInitial = userName?.charAt(0);


    const location = useLocation();
    useEffect(() => {
        const routeTitleMap: { [key: string]: string } = {
            '/': 'Login',
            '/forgot-password': 'Forgot Password',
            '/home': 'Home',
            '/user-list': 'Usuários',
            '/user': 'Cadastro de Usuário',
            '/user-edit/:id': 'Editar Usuário',
        };

        const title = routeTitleMap[location.pathname] || 'Editar Usuário';
        document.title = title;

        setTitle(title);

    }, [location.pathname]);



    const handleLogout = () => {

        dispatch(logout());
        window.location.href = '/';
    };

    return (
        <Layout
            style={{
                height: "100vh"
            }}
        >
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <div className="logo">

                    <img src={collapsed ? WenLockLogoCollapsed : WenLockLogoMini} alt="Logo" className="logo-image" />
                    <Button
                        type="text"
                        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            position: "absolute",
                            fontSize: '12px',
                            width: 24,
                            right: "-15px",
                            height: 24,
                            backgroundColor: "#F2F2F2",
                            borderRadius: "50px"

                        }}
                    />
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <PieChartOutlined />,
                            label: 'Home',
                            onClick: () => window.location.href = '/home',
                        },
                        {
                            key: '2',
                            icon: <BookOutlined />,
                            label: 'Controle de Acesso',
                            children: [
                                {
                                    key: '2-1',
                                    icon: <UserOutlined />,

                                    label: 'Usuários',
                                    onClick: () => window.location.href = '/user-list',
                                },
                            ],
                        },

                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ display: "flex", padding: 0, background: colorBgContainer, justifyContent: "flex-end" }}>
                    <Tooltip title="Sair" placement="bottom">
                        <div className="circle" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <span className="userName">{userInitial}</span>
                        </div>
                    </Tooltip>
                </Header>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowLeftOutlined style={{ cursor: 'pointer', marginRight: '10px', marginTop: "12px", marginLeft: "10px" }} onClick={() => window.history.back()} />
                    <h1 style={{ color: "black", fontSize: "30px" }}>{title}</h1>
                </div>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;