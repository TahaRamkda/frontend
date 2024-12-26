// components/Editor.js
import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

const CustomEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (state) => {
        console.log("EditorStateChange", state);
        setEditorState(state);
    };
    console.log("EditorStateChange12", editorState);

    return (
        <div>
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    options: ['inline', 'emoji'],
                    inline: {
                        options: ['bold', 'underline', 'subscript'],
                    },
                    emoji: {},
                }}
            />
            {/* <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        style={{ width: '100%', height: '200px', marginTop: '20px' }}
      /> */}
        </div>
    );
};

export default CustomEditor;
