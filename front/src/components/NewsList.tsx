import { Card, FloatButton, Skeleton } from "antd";
import { useGetNewsQuery } from "../store/api/news.api";
import { useNavigate } from "react-router";
import Meta from "antd/es/card/Meta";

function NewsList() {
  const navigate = useNavigate();
  const { data } = useGetNewsQuery({});
  return (
    <div
      style={{
        padding: "1em 0",
        display: "flex",
        maxWidth: "800px",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      {data &&
        data.posts.map(
          (e: {
            _id: string;
            images: { name: string; filename: string }[];
            title: string;
            author: { login: string };
          }) => (
            <Card
              key={e._id}
              hoverable
              onClick={() => {
                navigate(`/${e._id}`);
              }}
              style={{ width: "800px" }}
              cover={
                e.images.length ? (
                  <img
                    alt="example"
                    src={`/${e.images[0].filename}`}
                    style={{
                      maxHeight: "300px",
                      maxWidth: "800px",
                    }}
                  />
                ) : (
                  <Skeleton.Image style={{ width: "100%", height: "300px" }} />
                )
              }
            >
              <Meta title={e.title} description={e.author.login} />
            </Card>
          )
        )}
      <FloatButton
        onClick={() => navigate("/add")}
        type="primary"
        style={{ width: "80px", height: "80px" }}
      />
    </div>
  );
}

export default NewsList;
