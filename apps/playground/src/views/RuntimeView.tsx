import React from "react";
import { theme } from "antd";

import { Wasm4 } from "react-wasm4";

type Props = {
  wasm: Uint8Array | null;
  url: string | null;
};

const { useToken } = theme;

const RuntimeView: React.FC<Props> = (props) => {
  const { token } = useToken();
  const theme = token.colorBgBase.startsWith("#0") ? "dark" : "light";

  return <Wasm4 {...props} theme={theme} />;
};

export default RuntimeView;
