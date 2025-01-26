import { useState, useEffect, useRef } from "react";
import { FaBold, FaItalic, FaSubscript, FaTimes } from "react-icons/fa";
import { Button, FormGroup, Label, Input, Row, Col, Alert } from "reactstrap";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";

const CustomMagicEditor = ({
  variables,
  errorMessage,
  onFunction,
  existingContent,
  existingBodyContent,
  headerVariable,
  handleheaderVariableChange,
  removeHeaderVariable,
  setHeaderVariable,
  headContent,
  setFinalContent,
  handleVariableChange,
  addVariable,
  //handleBodyChange,
  setBodyFinalContent,
  setBodyPayloadDatawithVar,
  setheaderPayloaddatawithVar,
  removeVariable,
  body,
  showaddvarbutton = true,
}) => {
  const [content, setContent] = useState("");
  const [headerror, setheaderror] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const headerTextareaRef = useRef(null);
  const bodyTextareaRef = useRef(null);
  //console.log("variablesraeHappen", variables)

  useEffect(() => {
    if (existingContent !== content && existingContent !== undefined) {
      //alert(existingContent)
      setContent(existingContent); // Set header content for editing
    }
    if (
      existingBodyContent !== bodyContent &&
      existingBodyContent !== undefined
    ) {
      //alert(existingBodyContent)
      setBodyContent(existingBodyContent); // Set body content for editing
    }
  }, [existingContent, existingBodyContent]);

  // Toggle formatting on selected text (bold, italic, subscript)
  const toggleFormat = (tag) => {
    const textarea =
      body === false
        ? document.getElementById("editor-textarea")
        : document.getElementById("body-editor-textarea");

    // Get the current selection
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = selectedText;

    // Apply the corresponding format (bold, italic, subscript)
    if (selectedText) {
      if (tag === "bold") {
        formattedText = `**${selectedText}**`; // Markdown-like bold
      } else if (tag === "italic") {
        formattedText = `*${selectedText}*`; // Markdown-like italic
      } else if (tag === "subscript") {
        formattedText = `<sub>${selectedText}</sub>`; // Subscript (HTML)
      }

      // Update the content by replacing the selected text with the formatted text
      const newContent = `${textarea.value.substring(
        0,
        start
      )}${formattedText}${textarea.value.substring(end)}`;
      if (body === false) {
        setContent(newContent);
      } else if (body === true) {
        setBodyContent(newContent);
      }
    }
  };

  // Add emoji at the cursor position
  const addEmoji = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const textareaRefCurrent =
      body === false ? headerTextareaRef : bodyTextareaRef;
    const textarea = textareaRefCurrent.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert emoji at the cursor position
    const newContent =
      textarea.value.substring(0, start) +
      emoji +
      textarea.value.substring(end);
    if (body === false) {
      setContent(newContent);
    } else if (body === true) {
      setBodyContent(newContent);
    }

    // Update cursor position to after the emoji
    setTimeout(() => {
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      textarea.focus();
    }, 0);

    // Close the emoji picker after insertion
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".emoji-picker") === null) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add variable at cursor position
  // const addVariableAtCursor = (variable) => {
  //   const textareaRefCurrent =
  //     body === false ? headerTextareaRef : bodyTextareaRef;
  //   const textarea = textareaRefCurrent.current;
  //   if (!textarea) return;

  //   const start = textarea.selectionStart;
  //   const end = textarea.selectionEnd;

  //   // Insert variable at the cursor position
  //   const newContent =
  //     textarea.value.substring(0, start) +
  //     variable +
  //     textarea.value.substring(end);
  //   if (body === false) {
  //     setContent(newContent);
  //   } else if (body === true) {
  //     setBodyContent(newContent);
  //   }

  //   // Update cursor position to after the inserted variable
  //   const cursorPosition = start + variable.length;
  //   setTimeout(() => {
  //     textarea.setSelectionRange(cursorPosition, cursorPosition);
  //     textarea.focus();
  //   }, 0);
  // };

  // Automatically process and send the final content to the parent
  useEffect(() => {
    let finalContent = content;
    if (body === false) {
      setheaderPayloaddatawithVar(content);
      setFinalContent(finalContent);
    }
  }, [content]);

  useEffect(() => {
    //console.log("!@#Inside", bodyContent)
    let bodyfinalContent = bodyContent;
    if (body === true) {
      setBodyPayloadDatawithVar(bodyContent);
      setBodyFinalContent(bodyfinalContent);
    }
  }, [bodyContent, variables]);

  const handleBodyChange = (e) => {
    const newValue = e.target.value;

    if (showaddvarbutton === true) {
      // Extract all variable placeholders like {{1}}, {{2}}, etc.
      const existingPlaceholders = bodyContent.match(/\{\{\d+\}\}/g) || [];
      const newPlaceholders = newValue.match(/\{\{\d+\}\}/g) || [];

      // Check for removed placeholders
      const removedPlaceholders = existingPlaceholders.filter(
        (placeholder) => !newPlaceholders.includes(placeholder)
      );

      if (removedPlaceholders.length > 0) {
        toast.error("You cannot remove existing variable placeholders.");
        return; // Prevent state update
      }

      // Check for duplicates in the new content
      const duplicates = newPlaceholders.filter(
        (placeholder, index) => newPlaceholders.indexOf(placeholder) !== index
      );

      // Check if the user has moved an existing placeholder to a position where it already exists
      const hasInvalidChange = newPlaceholders.some((placeholder) => {
        return (
          existingPlaceholders.includes(placeholder) &&
          newPlaceholders.indexOf(placeholder) !==
            existingPlaceholders.indexOf(placeholder)
        );
      });

      if (duplicates.length > 0 || hasInvalidChange) {
        toast.error("You cannot change the variable placeholders in the body.");
        return; // Do not update the state
      }
    }
    // Update the body content if validation passes
    setBodyContent(newValue);
  };

  const loadVariables = () => {
    const variablePattern = /{{(.*?)}}/g;
    const matches = bodyContent.match(variablePattern);

    if (matches) {
      matches.forEach((variable) => {
        //const variableName = variable.replace(/{{|}}/g, '');
        addVariable(variable);
      });
    }
  };

  const loadheaderVariables = () => {
    setheaderror("");
    const variablePattern = /{{(.*?)}}/g;
    const matches = content.match(variablePattern);

    if (matches && matches.length === 1) {
      matches.forEach((variable) => {
        //const variableName = variable.replace(/{{|}}/g, '');
        onFunction(variable);
      });
    } else {
      setheaderror("Please enter only one variable in header");
    }
  };

  const handleHeadChange = (e) => {
    const newValue = e.target.value;
    if (showaddvarbutton === true) {
      // Extract all variable placeholders like {{1}}, {{2}}, etc.
      const existingPlaceholders = content.match(/\{\{\d+\}\}/g) || [];
      const newPlaceholders = newValue.match(/\{\{\d+\}\}/g) || [];

      // Check for removed placeholders
      const removedPlaceholders = existingPlaceholders.filter(
        (placeholder) => !newPlaceholders.includes(placeholder)
      );

      if (removedPlaceholders.length > 0) {
        toast.error("You cannot remove existing variable placeholders.");
        return; // Prevent state update
      }

      // Check for duplicates in the new content
      const duplicates = newPlaceholders.filter(
        (placeholder, index) => newPlaceholders.indexOf(placeholder) !== index
      );

      // Check if the user has moved an existing placeholder to a position where it already exists
      const hasInvalidChange = newPlaceholders.some((placeholder) => {
        return (
          existingPlaceholders.includes(placeholder) &&
          newPlaceholders.indexOf(placeholder) !==
            existingPlaceholders.indexOf(placeholder)
        );
      });

      if (duplicates.length > 0 || hasInvalidChange) {
        toast.error("You cannot change the variable placeholders in the body.");
        return; // Do not update the state
      }

      // Update the body content if validation passes
      setContent(newValue);
    } else {
      setContent(newValue);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: "10px", display: "flex" }}>
        {body === true && (
          <>
            <button
              className="border-1 h-10 w-10 flex justify-center items-center"
              type="button"
              onClick={() => toggleFormat("bold")}
            >
              <FaBold />
            </button>

            <button
              className="border-1 h-10 w-10 flex justify-center items-center"
              type="button"
              onClick={() => toggleFormat("italic")}
            >
              <FaItalic />
            </button>

            <button
              className="border-1 h-10 w-10 flex justify-center items-center"
              type="button"
              onClick={() => toggleFormat("subscript")}
            >
              <FaSubscript />
            </button>
            <div style={{ marginBottom: "10px" }}>
              <button
                className="border-1 h-10 w-10 flex justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  setShowEmojiPicker((prev) => !prev);
                }}
              >
                😊
              </button>
            </div>
          </>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            className="emoji-picker"
            style={{ position: "absolute", zIndex: 1000 }}
          >
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}
      </div>

      {body === false ? (
        <>
          {/* Textarea for editing content */}
          <textarea
            ref={headerTextareaRef}
            id="editor-textarea"
            value={content}
            onChange={handleHeadChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent adding a new line
              }
            }}
            style={{
              width: "100%",
              minHeight: "30px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              resize: "none",
              overflow: "hidden",
            }}
            placeholder="Start typing here..."
            maxLength={50}
            rows={1}
            required
          />

          <div className="flex justify-end">
            {showaddvarbutton && (
              <Button
                className="mt-3 text-underline  cursor-pointer  border-0"
                disabled={headerVariable?.length === 1}
                onClick={() => {
                  loadheaderVariables();
                }}
              >
                Load Variable
              </Button>
            )}
          </div>

          {/* Render header variable inputs */}
          {headerVariable?.map((variable, index) => (
            <FormGroup key={index}>
              <Label>
                <b>{`Sample Value for ${variable.name}`}</b>
              </Label>
              <Row>
                <Col>
                  <Input
                    className="w-100"
                    type="text"
                    value={variable.value}
                    onFocus={(e) => {
                      if (e.target.value.includes("{{")) {
                        e.target.value = ""; // Clear the content if it contains {{ }}
                      }
                    }}
                    onChange={(e) =>
                      handleheaderVariableChange(variable.name, e.target.value)
                    }
                    placeholder={`Enter Sample value for ${variable.name}`}
                    required
                  />
                </Col>
                <Col className="p-0">
                  <div
                    className="border-1 flex items-center justify-center rounded"
                    style={{
                      height: "46px",
                      width: "38px",
                      background: "#e1e1e1",
                    }}
                  >
                    <FaTimes
                      onClick={() => removeHeaderVariable(index)} // Handle variable removal
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "20px",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </FormGroup>
          ))}
          {/* Display error message */}
          {errorMessage && (
            <Alert color="danger" className="mt-2">
              {errorMessage}
            </Alert>
          )}
          {headerror && (
            <Alert color="danger" className="mt-2">
              {headerror}
            </Alert>
          )}
        </>
      ) : (
        <>
          <textarea
            ref={bodyTextareaRef}
            id="body-editor-textarea"
            value={bodyContent}
            onChange={handleBodyChange}
            style={{
              width: "100%",
              minHeight: "150px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            placeholder="Start typing here..."
            maxLength={500}
          />
          <div className="flex justify-end">
            {showaddvarbutton && (
              <Button
                onClick={() => {
                  const variableIndex = variables?.length + 1;
                  loadVariables();
                  //addVariable(variableIndex);
                  //addVariableAtCursor(`{{${variableIndex}}}`);
                }}
                className="mt-3  cursor-pointer  border-0"
                style={{ color: "white" }}
              >
                Load Variable
              </Button>
            )}
          </div>
          {variables?.map((variable, index) => (
            <FormGroup key={index}>
              <Label>
                <b>{`Sample Value for ${variable.name}`}</b>
              </Label>
              <Row>
                <Col>
                  <Input
                    className="w-100"
                    type="text"
                    onFocus={(e) => {
                      if (e.target.value.includes("{{")) {
                        e.target.value = ""; // Clear the content if it contains {{ }}
                      }
                    }}
                    value={variable.value} // Using the value of the variable as the default text
                    onChange={(e) =>
                      handleVariableChange(variable.name, e.target.value)
                    } // Handle input change
                    placeholder={`Enter sample value for ${variable.name}`} // Placeholder text
                    required
                  />
                </Col>
                <Col className="p-0">
                  <div
                    className="border-1 flex items-center justify-center rounded"
                    style={{
                      height: "46px",
                      width: "38px",
                      background: "#e1e1e1",
                    }}
                  >
                    <FaTimes
                      onClick={() => removeVariable(index)} // Handle variable removal
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "20px",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </FormGroup>
          ))}
        </>
      )}
    </div>
  );
};

export default CustomMagicEditor;
