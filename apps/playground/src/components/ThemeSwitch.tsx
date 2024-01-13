import React from "react";
import { ConfigProvider, theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

type Props = {
  theme: string;
  children: any;
};

const ThemeSwitch: React.FC<Props> = (props) => {
  return (
    <ConfigProvider theme={{ algorithm: props.theme === "dark" ? darkAlgorithm : defaultAlgorithm }}>
      {props.children}
    </ConfigProvider>
  );
};

export default ThemeSwitch;
