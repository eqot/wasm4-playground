import { useEffect, useRef } from "react";

import { getWasm4app, setWasm, setTheme } from "./utils";

type Props = {
  wasm: Uint8Array | null;
  url: string | null;
  theme?: string;
};

export const Wasm4 = (props: Props) => {
  const isVisible = props.wasm || props.url;

  const iframe = useRef<HTMLIFrameElement>(null);

  const params = props.url ? `?url=${props.url}` : "";
  const url = `./vendor/wasm4/index.html${params}`;

  const loadWasm = () => {
    if (props.url) return;

    setWasm(props.wasm);
  };

  useEffect(() => {
    loadWasm();
  }, [props.wasm]);

  useEffect(() => {
    setTheme(props.theme);
  }, [props.theme]);

  function handleLoad() {
    if (!iframe?.current) return;

    getWasm4app(iframe.current);
    setTheme(props.theme);
    loadWasm();
  }

  return (
    isVisible && (
      <iframe
        width="100%"
        height="100%"
        style={{ border: "none" }}
        src={url}
        title="Wasm4 runtime"
        ref={iframe}
        onLoad={handleLoad}
      />
    )
  );
};
