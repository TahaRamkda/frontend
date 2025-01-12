import React, { useState, useEffect } from "react";
import {
  fetchAgentTemplate,
  cleaAgentTemplateState,
  fetchAgentTemplatesDetail,
  clearAgentTemplateDetailState,
} from "@/slices/AgentTemplateSlice";
import {
  SendInteractivetemp,
  clearAgentTemplateSentState,
} from "@/slices/ConversationSlice";
import { useDispatch, useSelector } from "react-redux";
import showSweetAlert from "@/components/Sweetalert";
const DefinedTemplates = ({ isVisible, onClose, SenderId, ChatId }) => {
  const [selectedOption, setSelectedOption] = useState(null); // Single selection
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Debounced search query
  const [parameterValues, setParameterValues] = useState([]); // Array to store parameters as key-value objects

  const dispatch = useDispatch();
  const { agenttemplates, loading, error } = useSelector(
    (state) => state.agenttemplates
  );
  const [Perameter, setPerameter] = useState([]);
  const {
    agenttemplatedetail,
    loading: detailloading,
    error: detailerror,
  } = useSelector((state) => state.agenttemplates);

  // Debounce the search query to wait for 1 second after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery); // Update the debounced query after 1 second
    }, 500);

    // Cleanup the timer on each keystroke to reset debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch agenttemplates when the debounced search query changes and it's not empty
  useEffect(() => {
    if (debouncedSearchQuery.trim() !== "") {
      setPerameter([]); // Clear parameters when search is triggered
      dispatch(
        fetchAgentTemplate({
          clientId: localStorage.getItem("clientId"),
          searchStr: debouncedSearchQuery,
          senderId: SenderId,
        })
      );
    } else {
      dispatch(cleaAgentTemplateState());
    }

    return () => {
      dispatch(cleaAgentTemplateState());
    };
  }, [dispatch, debouncedSearchQuery]);

  // Handle selection of options
  const handleSelection = (templateId) => {
    setSelectedOption(templateId); // Select the option
    if (templateId) {
      dispatch(
        fetchAgentTemplatesDetail({
          clientId: localStorage.getItem("clientId"),
          TemplateId: templateId,
          senderId: SenderId,
        })
      );
    } else {
      dispatch(clearAgentTemplateDetailState());
    }
  };

  useEffect(() => {
    if (agenttemplatedetail) {
      setPerameter(agenttemplatedetail.parameters);
    }
    return () => {
      dispatch(clearAgentTemplateDetailState());
    };
  }, [agenttemplatedetail]);

  // Handle Send button click
  const handleSend = async () => {
   
    // Convert the parameterValues array into an array of objects with 'key' and 'value' properties
    const Values = parameterValues.map((values) => ({
      key: values.key, // Set the key
      value: values.value, // Set the value
    }));

    // Create a new FormData object to append the data
    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderId", SenderId);
    formData.append("ConversationId", ChatId);
    formData.append("InteractiveTemplateId", selectedOption);
    formData.append("ActionBy", localStorage.getItem("userId"));
    //formData.append("Values", JSON.stringify(Values));
    Values.forEach((item, index) => {
      formData.append(`Values[${index}].Key`, item.key);
      formData.append(`Values[${index}].Value`, item.value);
    });
   
    try {
      // Send the form data using the dispatch function
      const response = await dispatch(SendInteractivetemp(formData)).unwrap();

      // Check for success response
      if (response.success) {
        // Clear the state and show success alert
        dispatch(clearAgentTemplateSentState());
        showSweetAlert({
          title: "Uploaded Successfully",
          text: "",
          icon: "success",
        });
        onClose();
        // Optional: window.location.reload(); // Uncomment if necessary
      } else {
        // Show failure alert
        showSweetAlert({
          title: "Failed",
          text: response.result.message || "",
          icon: "error",
        });
      }
    } catch (err) {
      // Handle errors
      console.error("Failed to Upload", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    }

    onClose(); // Close the popup
  };

  // Handle input change for parameters
  const handleParameterChange = (paramName, value) => {
    setParameterValues((prevValues) => {
      const updatedValues = prevValues.filter((item) => item.key !== paramName); // Remove the previous value for this paramName
      return [
        ...updatedValues,
        { key: paramName, value }, // Add the updated key-value pair
      ];
    });
    console.log("Peram Name", parameterValues);
  };

  return (
    <>
      {isVisible && (
        <div
          className="absolute bottom-[1.5rem] bg-white text-gray-800 shadow-2xl rounded-lg z-50"
          style={{ minWidth: "350px", right: "-94px" }} // Set min width for the popup
        >
          <div
            className="absolute top-2 right-2 text-end w-full text-red-500 cursor-pointer"
            onClick={onClose}
          >
            <i className="fa fa-times"></i>{" "}
            {/* You can change this to an "X" or another icon */}
          </div>

          {/* Search Bar */}
          <div className="relative p-2 mt-10">
            <input
              type="text"
              placeholder="Search agenttemplates"
              className="w-full bg-gray-100 text-gray-800 pl-7 mb-1 py-1 rounded-md focus:outline-none border border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500">
              <i className="fa fa-search pl-2"></i> {/* Use FontAwesome */}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {agenttemplates.length > 0 &&
              agenttemplates.map((option) => (
                <div
                  key={option.id}
                  className={`px-4 py-2 cursor-pointer text-sm ${
                    selectedOption === option.id
                      ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleSelection(option.id)}
                >
                  {option.name}
                </div>
              ))}
          </div>

          {/* Footer */}
          {selectedOption && (
            <div className="p-2 border-t text-end bg-gray-50">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                onClick={handleSend}
              >
                <i className="fa fa-paper-plane-o"></i> Send
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 rounded-lg z-50">
              <i className="fa fa-spinner fa-spin fa-2x text-gray-800"></i>
            </div>
          )}
        </div>
      )}

      {/* Parameter Window: Positioned just next to the main window */}
      {Perameter.length > 0 && (
        <div
          className="absolute top-[1.5rem] bg-white text-gray-800 shadow-2xl rounded-lg z-50"
          style={{
            minWidth: "250px",
            right: "calc(100% + 250px)", // Positioned right next to the main window
            top: -200, // Same vertical position as the main window
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for separation
            padding: "10px", // Padding inside the parameter window
            maxHeight: "300px", // Limit the height if needed
            overflowY: "auto", // Allow scrolling if there are too many parameters
          }}
        >
          {/* Parameter List */}
          <h3 className="text-lg font-semibold mb-3">Parameters</h3>
          <div className="max-h-60 overflow-y-auto">
            {Perameter.map((option) => (
              <div
                key={option.paramId} // Use unique property as the key
                className="mb-2"
              >
                <label
                  htmlFor={option.paramId}
                  className="block text-sm text-gray-700"
                >
                  {option.paramName}
                </label>
                <input
                  id={option.paramId}
                  type="text"
                  value={
                    parameterValues.find(
                      (item) => item.key === option.paramName
                    )
                      ? parameterValues.find(
                          (item) => item.key === option.paramName
                        ).value
                      : ""
                  } // Set value dynamically from parameterValues
                  onChange={(e) =>
                    handleParameterChange(option.paramName, e.target.value)
                  }
                  className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={`Enter value for ${option.paramName}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DefinedTemplates;
