import React, { useRef, useState } from "react";
import { Flex, theme } from "antd";

import EditorTabs from "../components/EditorTabs";
import { Wasm4Editor } from "react-wasm4-editor";
import type { CodeFile } from "../languages";

type Props = {
  files: CodeFile[];
  onEditorChange: (value: CodeFile[]) => void;
};

const { useToken } = theme;

const EditorView: React.FC<Props> = (props) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  if (activeFileIndex >= props.files.length) setActiveFileIndex(0);
  const file = props.files[activeFileIndex];

  const editorRef = useRef(null);

  const keys = props.files.map((file) => file.name);

  const { token } = useToken();
  const theme = token.colorBgBase.startsWith("#0") ? "dark" : "light";

  const handleTabSelect = (key: string) => {
    const index = props.files.findIndex((file) => file.name === key);
    if (index >= 0) {
      setActiveFileIndex(index);
    }

    (editorRef.current as any).focus();
  };

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string) => {
    const updatedFiles = props.files.map((f) => (f.name === file.name ? { ...f, code: value } : f));
    props.onEditorChange(updatedFiles);
  };

  function getFileIndex(files: CodeFile[], filename: string) {
    return files.findIndex((file) => file.name === filename);
  }

  const handleChange = (action: string, filename: string, options?: any) => {
    let updatedFiles: CodeFile[] | undefined;
    let index = -1;
    switch (action) {
      case "rename":
        updatedFiles = props.files.map((file) => (file.name === options.previous ? { ...file, name: filename } : file));
        index = getFileIndex(updatedFiles, filename);
        break;

      case "add":
        updatedFiles = props.files.concat({ name: filename, code: "" });
        index = getFileIndex(updatedFiles, filename);
        break;

      case "delete":
        index = getFileIndex(props.files, filename);
        updatedFiles = props.files.filter((file) => file.name !== filename);
        if (!updatedFiles[index]) index--;
        break;

      default:
        break;
    }

    if (updatedFiles && index >= 0) {
      setActiveFileIndex(index);
    }

    if (updatedFiles) {
      props.onEditorChange(updatedFiles);
    }
  };

  return (
    <Flex vertical style={{ height: "100%" }}>
      <EditorTabs keys={keys} activeIndex={activeFileIndex} onSelect={handleTabSelect} onChange={handleChange} />

      <Wasm4Editor file={file} theme={theme} onMount={handleEditorMount} onChange={handleEditorChange} />
    </Flex>
  );
};

export default EditorView;
