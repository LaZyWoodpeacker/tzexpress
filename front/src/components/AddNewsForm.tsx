import { Button, Form, Input, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { UploadFile } from "antd/es/upload";
import RichEditor from "./RichEditor";
import { useNavigate } from "react-router";
import { useAddNewsMutation } from "../store/api/news.api";

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddNewsForm = () => {
  const [sendRequest] = useAddNewsMutation();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>();
  const [text, setText] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageList, setImageList] = useState<UploadFile[]>([]);

  const onSubmit = async () => {
    if (title && text) {
      const form = new FormData();
      form.append("title", title || "");
      form.append("text", text || "");
      imageList.forEach((e) => {
        console.log(e);
      });
      imageList.forEach((e) => {
        // @ts-expect-error
        form.append("images", e, e.fileName);
      });
      fileList.forEach((e) => {
        // @ts-expect-error
        form.append("files", e, e.name);
      });
      try {
        const result = await sendRequest(form);
        if (result?.error && "status" in result.error) {
          if (result.error?.status === 401) message.error("Не авторизован");
        } else {
          navigate("/");
        }
      } catch (e) {
        if (e instanceof Error) message.error(e.message);
      }
    } else {
      message.error("Заголовок и текст статьи обязателен");
    }
  };

  const uploadImageProps = useMemo(
    () => ({
      beforeUpload: async (file: UploadFile<File>) => {
        if (
          !["image/png", "image/jpeg", "image/svg+xml"].includes(
            file?.type || ""
          )
        ) {
          setImageList((state) => [...state]);
          message.error(`${file.name} Это не изображение`);
          return false;
        }
        // @ts-expect-error
        file.thumbUrl = await getBase64(file);
        setImageList((state) => [...state, file]);
        return false;
      },
      onRemove: (file: UploadFile) => {
        if (fileList.some((item) => item.uid === file.uid)) {
          setImageList((fileList) =>
            fileList.filter((item) => item.uid !== file.uid)
          );
          return true;
        }
        return false;
      },
    }),
    [imageList]
  );

  const uploadFileProps = useMemo(
    () => ({
      beforeUpload: (file: UploadFile) => {
        if (
          ![
            "text/plain",
            "application/pdf",
            "application/rtf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file?.type || "")
        ) {
          setFileList((state) => [...state]);
          message.error(`${file.name} Это не документ`);
          return false;
        }
        setFileList((state) => [...state, file]);
        return false;
      },
      onRemove: (file: UploadFile) => {
        if (fileList.some((item) => item.uid === file.uid)) {
          setFileList((fileList) =>
            fileList.filter((item) => item.uid !== file.uid)
          );
          return true;
        }
        return false;
      },
    }),
    [fileList]
  );

  const onText = (text: object) => {
    setText(JSON.stringify(text));
  };

  return (
    <Form layout="vertical" style={{ width: "800px" }}>
      <Form.Item name="title" label="Заголовок">
        <Input onChange={(e) => setTitle(e.target.value)} />
      </Form.Item>
      <Form.Item name="image" label="Изображение">
        <Upload
          listType="picture"
          multiple={false}
          {...uploadImageProps}
          fileList={imageList}
        >
          <Button>
            <PlusOutlined />
            Добавить
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item name="text" label="Текст новости">
        <RichEditor onChange={onText} initialValue="" />
      </Form.Item>
      <Form.Item name="files" label="Дополнительные файлы">
        <Upload {...uploadFileProps} fileList={fileList}>
          <Button icon={<UploadOutlined />}>Документы</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onSubmit}>
          Добавить статью
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddNewsForm;
