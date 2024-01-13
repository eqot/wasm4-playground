import React from "react";
import { Select } from "antd";

import { Language } from "../languages";

const languageOptions = Object.keys(Language).map((language) => ({ value: language, label: language }));

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const LanguageSelect: React.FC<Props> = (props) => {
  return <Select value={props.value} style={{ width: 200 }} onChange={props.onChange} options={languageOptions} />;
};

export default LanguageSelect;
