import { Button, Form, Input, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import type { UploadFile } from "antd/es/upload";
import RichEditor from "./RichEditor";
import { useNavigate, useParams } from "react-router";
import {
  useChangeNewsMutation,
  useGetOneNewsQuery,
} from "../store/api/news.api";
import Error from "./Error";

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const EditNewsForm = () => {
  const { id } = useParams();
  const { data, isSuccess } = useGetOneNewsQuery(id || "", {
    refetchOnMountOrArgChange: true,
  });
  const [sendRequest] = useChangeNewsMutation();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>();
  const [text, setText] = useState<string>();
  const [richValue, setRichValue] = useState<string>("");
  const [removedFiles] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageList, setImageList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (isSuccess) {
      setTitle(data.title);
      setRichValue(data.text || "");
      setImageList(
        // @ts-expect-error
        data.images.map((e) => ({
          name: e.name,
          thumbUrl: `/${e.filename}`,
        }))
      );
      setFileList(
        // @ts-expect-error
        data.files.map((e: { name: string; filename: string }) => ({
          name: e.name,
          thumbUrl: `/${e.filename}`,
        }))
      );
    }
  }, [isSuccess]);

  const onSubmit = async () => {
    if (title && text) {
      const form = new FormData();
      form.append("title", title || "");
      form.append("text", text || "");
      imageList.forEach((e) => {
        if (e instanceof File) form.append("images", e, e.name);
      });
      fileList.forEach((e) => {
        if (e instanceof File) form.append("files", e, e.name);
      });
      removedFiles.forEach((e) => {
        form.append("removedFiles[]", e);
      });
      removedImages.forEach((e) => {
        form.append("removedImages[]", e);
      });
      try {
        const result = await sendRequest({ id, form });
        if (result?.error && "status" in result.error) {
          if (result.error?.status === 401) message.error("Не авторизован");
        } else {
          navigate("/");
        }
      } catch (e) {}
    } else {
      message.error("Заголовок и текст статьи обязателен");
    }
  };

  const uploadImageProps = useMemo(
    () => ({
      beforeUpload: async (file: UploadFile) => {
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
        if (imageList.some((item) => item.uid === file.uid)) {
          setImageList((imageList) =>
            imageList.filter((item) => item.uid !== file.uid)
          );
          if (!(file instanceof File)) {
            // @ts-expect-error
            setRemovedImages((state) => [...state, file.thumbUrl]);
          }
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

  if (data?.error) return <Error>{data.error}</Error>;

  return (
    <Form layout="vertical" style={{ width: "800px", paddingTop: "2em" }}>
      <Form.Item label="Заголовок">
        <Input onChange={(e) => setTitle(e.target.value)} value={title} />
      </Form.Item>
      <Form.Item label="Изображение">
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
      <Form.Item label="Текст новости">
        <RichEditor onChange={onText} initialValue={richValue} />
      </Form.Item>
      <Form.Item name="files" label="Дополнительные файлы">
        <Upload {...uploadFileProps} fileList={fileList}>
          <Button icon={<UploadOutlined />}>Документы</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onSubmit}>
          Изменить статью
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditNewsForm;
