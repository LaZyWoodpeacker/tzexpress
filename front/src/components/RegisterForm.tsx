import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useRegisterUserMutation } from "../store/api/user.api";
import { useNavigate } from "react-router";

type FieldType = {
  username?: string;
  password?: string;
  passwordconfirm?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const RegisterForm = () => {
  const [validate, setValidate] = useState(false);
  const [sendRequest] = useRegisterUserMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      if (values.username && values.password) {
        const result = await sendRequest({
          login: values.username,
          password: values.password,
        });
        if (!result.error) {
          message.info("Вы зарегистрированы");
          navigate("/");
        } else {
          // @ts-expect-error
          message.error(result.error?.data.error || "Неизвестная ошибка");
        }
      }
    } catch (e) {}
  };

  const validateForm = () => {
    setValidate(
      form.getFieldValue("password") === form.getFieldValue("passwordconfirm")
    );
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
        style={{ maxWidth: 600 }}
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
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          initialValue="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password onChange={validateForm} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Подтвердить пароль"
          name="passwordconfirm"
          initialValue="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password onChange={validateForm} />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" disabled={!validate}>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
