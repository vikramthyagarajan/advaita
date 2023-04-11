import { createEditor } from "slate";
import { withReact } from "slate-react";
import { FC, memo } from "react";
import { GraspEditable, GraspSlate, HoveringToolbar } from ".";
import SlateCommand from "./components/Command/SlateCommand";
import MenuHandler from "./components/MenuHandler/MenuHandler";
import { CustomEditor } from "./slateTypes";
import withBlocks from "./plugins/withBlocks";
import withMarks from "./plugins/withMarks";
import withBase from "./plugins/withBase";
import withHtml from "./plugins/withHtml";

interface MainEditorProps {
  editorKey;
  editor;
  value;
  setValue;
  onEditorChange;
  readOnly?: boolean;
}

export function createGraspEditor(editorId = "default") {
  const editor = withBlocks(
    withMarks(withBase(withHtml(withReact(createEditor() as CustomEditor))))
  );
  editor.editorId = editorId;
  return editor;
}

const MainEditor: FC<MainEditorProps> = ({
  editor,
  editorKey,
  onEditorChange,
  value,
  readOnly = false,
}) => {
  return (
    <>
      {
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
      }
    </>
  );
};

export default memo(MainEditor);
