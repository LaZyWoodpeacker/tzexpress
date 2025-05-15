import { Button, Layout, Modal } from "antd";
import { Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useNavigate } from "react-router";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {
  UserOutlined,
  LoginOutlined,
  ExclamationCircleFilled,
  MenuOutlined,
} from "@ant-design/icons";
import { logout } from "../store/features/app.slice";

const MainLayout = () => {
  const username = useAppSelector((state) => state.settings.login);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px", display: "flex" }}>
          <Button
            shape="circle"
            icon={<MenuOutlined />}
            onClick={() => navigate("/")}
          />
          <div style={{ flexGrow: 1 }}></div>

          <Button
            icon={username ? <LoginOutlined /> : <UserOutlined />}
            onClick={() => {
              if (!username) navigate("/auth");
              else {
                Modal.confirm({
                  icon: <ExclamationCircleFilled />,
                  title: "Вы уверены что хотите выйти?",
                  okText: "Да",
                  cancelText: "Нет",
                  okType: "danger",
                  onOk() {
                    dispatch(logout());
                  },
                  onCancel() {},
                });
              }
            }}
          >
            {username || "Войти"}
          </Button>
        </div>
      </Header>
      <Content
        style={{
          padding: "0 48px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Demo ©
        <Button
          onClick={async () => {
            Modal.confirm({
              icon: <ExclamationCircleFilled />,
              title: "Вы уверены что хотите отчистить базу?",
              okText: "Да",
              cancelText: "Нет",
              okType: "danger",
              async onOk() {
                await fetch("/api/clear");
                window.location.href = "/";
              },
              onCancel() {},
            });
          }}
        >
          Отчистить базу
        </Button>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
