//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "../../utils/EditorTools";

const EditorBlock = ({ data, onChange, holder }) => {
  const ref = useRef();
  useEffect(() => {
    const editor = new EditorJS({
      holder: holder,
      placeholder:'click me to write something awesome!',
      tools: EDITOR_JS_TOOLS,
      data,
      async onChange(api, event) {
        const data = await api.saver.save();
        onChange(data);
      },
    });
    ref.current = editor;
    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return <div id={holder} />;
};


export default memo(EditorBlock);


