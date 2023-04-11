import { FC, useEffect, useState } from "react";
import { GraspEditable, GraspSlate, HoveringToolbar } from ".";
import SlateCommand from "./components/Command/SlateCommand";
import MenuHandler from "./components/MenuHandler/MenuHandler";

interface MainEditorProps {
  editorKey;
  editor;
  value;
  setValue;
  onEditorChange;
  readOnly?: boolean;
}

const MainEditor: FC<MainEditorProps> = ({
  editor,
  editorKey,
  onEditorChange,
  value,
  readOnly = false,
}) => {
  const [winReady, setWinReady] = useState(false);

  useEffect(() => {
    setWinReady(true);
  }, []);

  return (
    <>
      {winReady && (
        <GraspSlate
          key={editorKey}
          editor={editor}
          value={value}
          onChange={onEditorChange}
        >
          <HoveringToolbar />
          <MenuHandler />
          <SlateCommand />
          <GraspEditable readOnly={readOnly} />
        </GraspSlate>
      )}
    </>
  );
};

export default MainEditor;
