import { useState, useRef, type FC, useEffect, type MouseEvent } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  type EditorCommand,
  ContentBlock,
  type RawDraftContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";

interface IProps {
  onChange: (state: RawDraftContentState) => void;
  initialValue: string;
}

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: "2px 4px",
    borderRadius: "3px",
  },
  HIGHLIGHT: {
    backgroundColor: "#faed27",
  },
};

const blockStyleFn = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  if (type === "blockquote") {
    return "rich-editor-blockquote";
  }
  return "";
};

const RichEditor: FC<IProps> = ({ onChange, initialValue }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (initialValue) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(JSON.parse(initialValue)))
      );
      onChange(JSON.parse(initialValue));
    }
  }, [initialValue]);

  const setState = (newState: EditorState) => {
    setEditorState(newState);
    const content = editorState.getCurrentContent();
    onChange(convertToRaw(content));
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleKeyCommand = (command: EditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleBlockType = (
    e: MouseEvent<HTMLButtonElement>,
    blockType: string
  ) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (
    e: MouseEvent<HTMLButtonElement>,
    inlineStyle: string
  ) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar">
        <button onClick={(e) => toggleInlineStyle(e, "BOLD")} title="Жирный">
          <b>B</b>
        </button>
        <button onClick={(e) => toggleInlineStyle(e, "ITALIC")} title="Курсив">
          <i>I</i>
        </button>
        <button
          onClick={(e) => toggleInlineStyle(e, "UNDERLINE")}
          title="Подчеркивание"
        >
          <u>U</u>
        </button>
        <button
          onClick={(e) => toggleInlineStyle(e, "CODE")}
          title="Код (inline)"
        >
          {"</>"}
        </button>
        <button
          onClick={(e) => toggleBlockType(e, "header-one")}
          title="Заголовок 1"
        >
          H1
        </button>
        <button
          onClick={(e) => toggleBlockType(e, "header-two")}
          title="Заголовок 2"
        >
          H2
        </button>
        <button
          onClick={(e) => toggleBlockType(e, "blockquote")}
          title="Цитата"
        >
          "
        </button>
      </div>
      <div className="rich-editor-editor-container" onClick={focusEditor}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setState}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={styleMap}
          blockStyleFn={blockStyleFn}
          placeholder="Начните печатать здесь..."
          spellCheck={true}
        />
      </div>
    </div>
  );
};

export default RichEditor;
