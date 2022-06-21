import React, { Fragment, useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "../../pages/write/constants";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { editorState } from "../../state/user";

const Editor = ({ onPublishPost }) => {
  const instanceRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const setEditorState = useSetRecoilState(editorState);

  useEffect(() => {
    if (!editor) {
      setEditor(
        new EditorJS({
          holder: "editorjs",
          tools: EDITOR_JS_TOOLS,
          data: {
            blocks: [
              {
                type: "header",
                data: {
                  text: "Tell your story...",
                  level: 5,
                },
              },
            ],
          },
          version: "2.22.2",
        })
      );
    }
  }, [editor]);

  return (
    <Fragment>
      <div id="editorjs"></div>
    </Fragment>
  );
};

export default Editor;
