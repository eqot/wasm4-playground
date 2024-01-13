import React from "react";
import { Tabs } from "antd";

import EditorTab from "./EditorTab";

type Props = {
  keys: string[];
  activeIndex: number;
  onSelect: (key: string) => void;
  onChange: (action: string, filename: string, options?: any) => void;
};

const EditorTabs: React.FC<Props> = (props) => {
  if (!props.keys || props.keys.length === 0) return null;

  const activeKey = props.keys[props.activeIndex];

  const handleChange = (newActiveKey: string) => {
    props.onSelect(newActiveKey);
  };

  const handleEdit = () => {
    let filename;
    let index = 0;
    do {
      filename = `file${index}.txt`;
      index++;
    } while (props.keys.includes(filename));

    props.onChange("add", filename);
  };

  const handleMenuClick = (params: any) => {
    props.onChange(params.action, params.label, params.options);
  };

  const tabItems = props.keys.map((key: string) => ({
    label: <EditorTab label={key} onChange={handleMenuClick} />,
    key: key,
    closable: false,
  }));

  return (
    <Tabs
      type="editable-card"
      items={tabItems}
      activeKey={activeKey}
      tabBarStyle={{ margin: 0 }}
      onChange={handleChange}
      onEdit={handleEdit}
    ></Tabs>
  );
};

export default EditorTabs;
