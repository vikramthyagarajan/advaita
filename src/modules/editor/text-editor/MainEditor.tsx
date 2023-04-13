import { createEditor } from "slate";
import { withReact } from "slate-react";
import { FC, PropsWithChildren, memo } from "react";
import { GraspEditable, GraspSlate, HoveringToolbar } from ".";
import SlateCommand from "./components/Command/SlateCommand";
import MenuHandler from "./components/MenuHandler/MenuHandler";
import { CustomEditor } from "./slateTypes";
import withBlocks from "./plugins/withBlocks";
import withMarks from "./plugins/withMarks";
import withBase from "./plugins/withBase";
import ForkButton from "./components/ForkButton/ForkButton";

interface MainEditorProps {
  nodeId: string;
  editor;
  value;
  setValue;
  onEditorChange;
  onBlur;
  readOnly?: boolean;
}

export function createGraspEditor(editorId = "default") {
  const editor = withBlocks(
    withMarks(withBase(withReact(createEditor() as CustomEditor)))
  );
  editor.editorId = editorId;
  return editor;
}

const MainEditor: FC<PropsWithChildren<MainEditorProps>> = ({
  editor,
  nodeId,
  onEditorChange,
  onBlur,
  value,
  readOnly = false,
  children,
}) => {
  return (
    <>
      {
        <GraspSlate
          key={nodeId}
          editor={editor}
          value={value}
          onChange={onEditorChange}
          onBlur={onBlur}
        >
          {!readOnly ? <ForkButton nodeId={nodeId} /> : null}
          <HoveringToolbar />
          <MenuHandler />
          <SlateCommand />
          <GraspEditable readOnly={readOnly} />
          {children}
        </GraspSlate>
      }
    </>
  );
};

export default memo(MainEditor);
