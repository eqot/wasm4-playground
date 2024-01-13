import React, { useState, useEffect, DragEventHandler } from "react";
import { Layout, Col, Row, Switch } from "antd";

import ThemeSwitch from "../components/ThemeSwitch";
import CustomHeader from "../components/CustomHeader";
import Menus from "../components/Menus";
import LanguageSelect from "../components/LanguageSelect";
import SaveModal from "../components/SaveModal";
import EditorView from "./EditorView";
import RuntimeView from "./RuntimeView";
import { getTextsFromImage, injectTextIntoImage } from "image-utils";
import { Language, getInitialFiles, CodeFile } from "../languages";
import { getProgramFromUrl, compile, readFile, download, lazyExecution, convertImageFromBase64 } from "../utils";
import { requestFullscreen, saveGameState, loadGameState } from "react-wasm4";

const { Content } = Layout;

export type Program = {
  language: Language;
  files: CodeFile[];
};

const WAIT_BEFORE_COMPILE = 1000;

const RootView: React.FC = () => {
  const urlParams = new URLSearchParams(location.search);
  const wasmUrl = urlParams.get("url");

  const p = getProgramFromUrl();
  const language = p?.language || localStorage.getItem("language") || Language.AssemblyScript;
  const files = wasmUrl ? [] : p?.files || getInitialFiles(language);

  const [program, setProgram] = useState<Program>({ language, files });
  const [wasm, setWasm] = useState<Uint8Array | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);

  useEffect(() => {
    if (program.files.length === 0) return;

    lazyExecution(() => {
      compile(program).then((newWasm) => {
        if (newWasm) {
          setWasm(newWasm);
        }
      });
    }, WAIT_BEFORE_COMPILE);
  }, [program]);

  const handleMenuSelect = async (key: string) => {
    switch (key) {
      case "newFile":
        setProgram({ ...program, files: getInitialFiles(program.language) });
        break;

      case "openFile":
        loadProgram();
        break;

      case "saveProgram":
        saveProgram();
        break;

      case "saveWasm":
        if (wasm) {
          download(wasm, "app.wasm", "application/wasm");
        }
        break;

      case "fullscreen":
        requestFullscreen();
        break;

      case "saveGameState":
        saveGameState();
        break;

      case "loadGameState":
        loadGameState();
        break;

      default:
        break;
    }
  };

  function loadProgram() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png";
    input.style.setProperty("display", "none");
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      loadProgramFromFile(file);
    };
    document.body.appendChild(input);
    input.click();
  }

  async function loadProgramFromFile(file: any) {
    const buffer = await readFile(file);
    if (!buffer) return;

    const texts = getTextsFromImage(buffer);
    if (!texts) return;

    const programs = texts.map((t) => JSON.parse(t));
    const program = programs[0];
    if (!program) return;

    setProgram(program);
  }

  const handleFileDrop: DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();

    if (!e.dataTransfer?.files) return;

    const file = Array.from(e.dataTransfer.files).find((f: File) => f.type === "image/png");
    if (!file) return;

    loadProgramFromFile(file);
  };

  const handleFileDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  function saveProgram() {
    setSaveModalOpen(true);
  }

  const handleSaveProgram = (imageBase64?: string, filename?: string): void => {
    setSaveModalOpen(false);

    if (!imageBase64 || !filename) return;

    const image = convertImageFromBase64(imageBase64);
    const injectedImage = injectTextIntoImage(image, JSON.stringify({ ...program, type: "code" }));
    if (!injectedImage) return;

    download(injectedImage, filename, "image/png");
  };

  const handleLanguageChange = (language: Language) => {
    localStorage.setItem("language", language);

    setProgram({ language, files: getInitialFiles(language) });
  };

  const handleThemeChange = (isDarkMode: boolean) => {
    const newTheme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);

    setTheme(newTheme);
  };

  const handleEditorChange = (files: CodeFile[]) => {
    setProgram({ ...program, files });
  };

  return (
    <ThemeSwitch theme={theme}>
      <Layout style={{ height: "100%" }} onDrop={handleFileDrop} onDragOver={handleFileDragOver}>
        <CustomHeader>
          <Menus onSelect={handleMenuSelect} />

          <LanguageSelect value={program.language} onChange={handleLanguageChange} />

          <Switch
            checkedChildren="Dark"
            unCheckedChildren="Light"
            value={theme === "dark"}
            style={{ width: "80px", marginLeft: "24px" }}
            onChange={handleThemeChange}
          />
        </CustomHeader>

        <Content style={{ padding: "10px" }}>
          <Row gutter={10} style={{ height: "100%" }}>
            <Col span={12}>
              <EditorView files={program.files} onEditorChange={handleEditorChange} />
            </Col>

            <Col span={12}>
              <RuntimeView wasm={wasm} url={wasmUrl} />
            </Col>
          </Row>
        </Content>

        {/* <Footer style={{ padding: "10px", textAlign: "center" }}>Status bar</Footer> */}

        <SaveModal isOpen={isSaveModalOpen} onSave={handleSaveProgram} />
      </Layout>
    </ThemeSwitch>
  );
};

export default RootView;
