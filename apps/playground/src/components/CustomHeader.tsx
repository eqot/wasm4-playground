import React from "react";
import { Layout, theme } from "antd";

const { Header } = Layout;

type Props = {
  children: any;
};

const { useToken } = theme;

const CustomHeader: React.FC<Props> = (props) => {
  const { token } = useToken();

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: "24px",
        background: token.colorBgContainer,
        borderBottom: "1px solid " + token.colorSplit,
      }}
    >
      {props.children}
    </Header>
  );
};

export default CustomHeader;
