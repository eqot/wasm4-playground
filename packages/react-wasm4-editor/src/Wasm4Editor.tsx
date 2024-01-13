import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

type Props = {
  file?: { name: string; code: string };
  theme?: string;
  onMount?: (editor: any) => void;
  onChange: (value: string) => void;
};

const contents = new Map<string, string>();

export const Wasm4Editor = (props: Props) => {
  const [counterForUpdate, forceUpdate] = useState(0);

  useEffect(() => {
    const filename = props.file?.name;
    if (filename && contents.get(filename) !== props.file?.code) {
      contents.set(filename, props.file?.code || "");
      forceUpdate(counterForUpdate + 1);
    }
  }, [props.file]);

  const handleChange = (value: string | undefined) => {
    if (!value) return;

    const filename = props.file?.name;
    if (filename) {
      contents.set(filename, value);
    }

    props.onChange(value);
  };

  return (
    <Editor
      path={props.file?.name}
      defaultValue={props.file?.code}
      theme={props.theme === "dark" ? "vs-dark" : ""}
      onMount={props.onMount}
      onChange={handleChange}
      key={counterForUpdate}
    />
  );
};
