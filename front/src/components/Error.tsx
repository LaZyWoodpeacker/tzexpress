import type { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const Error: FC<IProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Error;
