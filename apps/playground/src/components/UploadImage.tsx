import React from "react";
import { Button, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import type { FileListItem } from "./SaveModal";

type Props = {
  fileList: FileListItem[];
  setFileList: (files: FileListItem[]) => void;
};

const UploadImage: React.FC<Props> = (props) => {
  const handleBeforeUpload = (file: any) => {
    const isPNG = file.type === "image/png";
    if (!isPNG) {
      console.error(`${file.name} is not a PNG image`);
    }
    return isPNG || Upload.LIST_IGNORE;
  };

  const handleRequest = () => Promise.resolve();

  const handleChange = (info: any) => {
    props.setFileList(info.fileList.length > 0 ? [{ ...info.file, status: "done" }] : []);
  };

  return (
    <Upload
      listType="picture"
      fileList={props.fileList as UploadFile<FileListItem>[]}
      maxCount={1}
      accept="image/png"
      beforeUpload={handleBeforeUpload}
      customRequest={handleRequest}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />}>Upload PNG image</Button>
    </Upload>
  );
};

export default UploadImage;
