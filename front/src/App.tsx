import NewsList from "./components/NewsList";
import MainLayout from "./layouts/MainLayout";
import AddNewsForm from "./components/AddNewsForm";
import RegisterForm from "./components/RegisterForm";
import EditNewsForm from "./components/EditNewsForm";
import AuthForm from "./components/AuthForm";
import { useCheckQuery } from "./store/api/user.api";
import { BrowserRouter, Routes, Route } from "react-router";
import OneNews from "./components/OneNews";

function NewsApp() {
  useCheckQuery({});
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<NewsList />} />
          <Route path="/add" element={<AddNewsForm />} />
          <Route path="/reg" element={<RegisterForm />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/edit/:id" element={<EditNewsForm />} />
          <Route path="/:id" element={<OneNews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default NewsApp;
