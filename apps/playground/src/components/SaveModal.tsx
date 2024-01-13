import React, { useState, useRef, MouseEventHandler } from "react";
import { Modal, Form, Input, Button, InputRef } from "antd";

import { captureWasm4Screen } from "react-wasm4";
import UploadImage from "./UploadImage";

type Props = {
  isOpen: boolean;
  onSave: (image?: string, filename?: string) => void;
};

export type FileListItem = {
  type: string;
  name: string;
  thumbUrl: string;
  status?: string;
};

const SaveModal: React.FC<Props> = (props) => {
  const [fileList, setFileList] = useState<FileListItem[]>([]);

  const inputElement = useRef<InputRef>(null);

  const handleCaptureButtonClick: MouseEventHandler<HTMLElement> = () => {
    const url = captureWasm4Screen();
    if (!url) return;

    setFileList([{ type: "image/png", name: "Captured image", thumbUrl: url }]);
  };

  const handleOk = () => {
    const filename = inputElement?.current?.input?.value;
    const file = fileList[0];
    props.onSave(file?.thumbUrl, filename);
  };

  const handleCancel = () => {
    props.onSave();
  };

  const handleAfterClose = () => {
    setFileList([]);
  };

  return (
    <Modal
      title="Save program as image"
      open={props.isOpen}
      okButtonProps={{ disabled: fileList.length === 0 }}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleAfterClose}
      destroyOnClose={true}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ filename: "app.png" }}
        autoComplete="off"
      >
        <Form.Item label="Image">
          <Button style={{ marginRight: "8px" }} onClick={handleCaptureButtonClick}>
            Capture screen
          </Button>

          <UploadImage fileList={fileList} setFileList={setFileList} />
        </Form.Item>

        <Form.Item<{ filename: string }> label="Filename" name="filename">
          <Input ref={inputElement} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveModal;
