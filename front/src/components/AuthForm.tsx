import { message, type FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useAuthMutation } from "../store/api/user.api";
import { Link, useNavigate } from "react-router";

type FieldType = {
  username?: string;
  password?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const AuthForm = () => {
  const [validate, setValidate] = useState(false);
  const [sendRequest] = useAuthMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (values.username && values.password) {
      try {
        const result = await sendRequest({
          login: values.username,
          password: values.password,
        });
        console.log(result);
        if (!result.error) {
          message.info("Вы авторизованы");
          navigate("/");
        } else {
          // @ts-expect-error
          message.error(result.error?.data.error || "Неизвестная ошибка");
        }
      } catch (e) {}
    }
  };

  const validateForm = () => {
    setValidate(true);
  };

  useEffect(() => {
    validateForm();
  }, []);

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 600, paddingTop: "2em" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item<FieldType>
          label="Имя пользователя"
          name="username"
          initialValue="login"
          rules={[{ required: true, message: "Введите login" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          initialValue="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password onChange={validateForm} />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" disabled={!validate}>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <Link to="/reg">Зарегистрироваться</Link>
    </div>
  );
};

export default AuthForm;
