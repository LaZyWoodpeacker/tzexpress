import { Link, useParams } from "react-router";
import {
  useDeleteNewsMutation,
  useGetOneNewsQuery,
} from "../store/api/news.api";
import draftToHtml from "draftjs-to-html";
import { useMemo } from "react";
import { Button, Card, Modal, Space, Typography } from "antd";
import { useAppSelector } from "../store/store";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Error from "./Error";

const { Title, Paragraph, Text } = Typography;

const OneNews = () => {
  const username = useAppSelector((state) => state.settings.login);
  const { id } = useParams();
  const { data } = useGetOneNewsQuery(id || "");
  const [deletePost] = useDeleteNewsMutation();

  const view = useMemo(() => {
    if (data?.text) {
      const markup = draftToHtml(JSON.parse(data.text), {
        trigger: "#",
        separator: " ",
      });
      return markup;
    }
    return "<p>Нет текста</p>";
  }, [data]);

  if (data?.error) return <Error>{data.error}</Error>;

  return (
    <Card
      style={{ width: 800 }}
      cover={
        <div style={{ padding: "10px" }}>
          <Title level={4} style={{ marginBottom: "16px" }}>
            {data?.title}
          </Title>
          {username === data?.author?.login && (
            <div>
              <Link to={`/edit/${id}`}>Редактировать</Link>
              <Button
                type="link"
                onClick={() => {
                  Modal.confirm({
                    icon: <ExclamationCircleFilled />,
                    title: "Вы уверены что хотите удалить новость?",
                    okText: "Да",
                    cancelText: "Нет",
                    okType: "danger",
                    async onOk() {
                      await deletePost({ id });
                      window.location.href = "/";
                    },
                    onCancel() {},
                  });
                }}
              >
                Удалить
              </Button>
            </div>
          )}
          {!!data?.images?.length && (
            <img
              alt="example"
              src={data?.images[0].filename}
              style={{ width: "100%", borderRadius: "4px" }}
            />
          )}
          <Space style={{ marginTop: "8px" }}>
            {!!data?.images?.length &&
              data.images
                .slice(1)
                .map((image) => (
                  <img
                    src={image.filename}
                    alt=""
                    key={image.name}
                    style={{ width: "200px", borderRadius: "4px" }}
                  />
                ))}
          </Space>
        </div>
      }
    >
      <Paragraph>
        <p dangerouslySetInnerHTML={{ __html: view }}></p>
      </Paragraph>
      <Text type="secondary" style={{ fontSize: "12px" }}>
        Автор: {data?.author?.login}
      </Text>
    </Card>
  );
};

export default OneNews;
