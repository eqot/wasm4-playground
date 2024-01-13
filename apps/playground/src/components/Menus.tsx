import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";

type Props = {
  onSelect: (key: string) => void;
};

const menuItems: MenuProps["items"] = [
  {
    label: "File",
    key: "file",
    children: [
      {
        label: "New",
        key: "newFile",
      },
      { type: "divider" },
      {
        label: "Open...",
        key: "openFile",
      },
      { type: "divider" },
      {
        label: "Save program as PNG image...",
        key: "saveProgram",
      },
      {
        label: "Save wasm",
        key: "saveWasm",
      },
    ],
  },
  {
    label: "View",
    key: "view",
    children: [
      {
        label: "Fullscreen",
        key: "fullscreen",
      },
    ],
  },
  {
    label: "Tool",
    key: "tool",
    children: [
      {
        label: "Save game state",
        key: "saveGameState",
      },
      {
        label: "Load game state",
        key: "loadGameState",
      },
    ],
  },
];

const Menus: React.FC<Props> = (props) => {
  const handleClick: MenuProps["onClick"] = (e) => {
    props.onSelect(e.key);
  };

  return (
    <Menu
      mode="horizontal"
      style={{ width: "100%", borderBottom: "0px" }}
      selectable={false}
      triggerSubMenuAction="click"
      items={menuItems}
      onClick={handleClick}
    />
  );
};

export default Menus;
