import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

const menuItems: MenuProps["items"] = [
  {
    label: "Rename",
    key: "rename",
  },
  {
    label: "Delete",
    key: "delete",
  },
];

type Props = {
  label: string;
  onChange: (params: any) => void;
};

export const EditorTab = (props: Props) => {
  const [label, setLabel] = useState(props.label);
  const [isEditing, setIsEditing] = useState(false);

  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditing) {
      labelRef.current?.focus();
    }
  }, [isEditing]);

  const handleMenuClick: MenuProps["onClick"] = (params) => {
    switch (params.key) {
      case "rename":
        setIsEditing(true);
        break;

      case "delete":
        props.onChange({ action: params.key, label: props.label });
        break;

      default:
        break;
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    switch (e.key) {
      case "Enter":
        {
          e.preventDefault();

          const previous = label;
          const newLabel = (e.target as HTMLSpanElement).innerText;
          setLabel(newLabel);
          setIsEditing(false);

          props.onChange({ action: "rename", label: newLabel, options: { previous } });
        }
        break;

      case "Escape":
        e.preventDefault();

        (e.target as HTMLSpanElement).innerText = label;
        setIsEditing(false);
        break;

      default:
        break;
    }
  };

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["contextMenu"]}>
      <span
        contentEditable={isEditing}
        style={{ padding: "4px" }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        ref={labelRef}
        onDoubleClick={handleDoubleClick}
        suppressContentEditableWarning={true}
      >
        {label}
      </span>
    </Dropdown>
  );
};

export default EditorTab;
