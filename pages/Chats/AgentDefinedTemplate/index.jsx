import React, { useState, useEffect } from "react";
import { fetchTemplates, clearTemplateState } from "@/slices/TemplateSlice";
import { useDispatch, useSelector } from "react-redux";

const DefinedTemplates = ({ isVisible, onClose }) => {
    const [selectedOption, setSelectedOption] = useState(null); // Single selection
    const [searchQuery, setSearchQuery] = useState(""); // Search query
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Debounced search query
    const dispatch = useDispatch();
    const { templates, loading, error } = useSelector((state) => state.templates);

    // Debounce the search query to wait for 1 second after the user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery); // Update the debounced query after 1 second
        }, 500); 

        // Cleanup the timer on each keystroke to reset debounce
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch templates when the debounced search query changes and it's not empty
    useEffect(() => {
        if (debouncedSearchQuery.trim() !== "") {
            dispatch(
                fetchTemplates({
                    clientId: localStorage.getItem("clientId"),
                    TransactonType: 2,
                    searchStr: debouncedSearchQuery,
                    pageNo: 1,
                    pageSize: 100
                })
            );
        } else {
            dispatch(clearTemplateState());
        }

        return () => {
            dispatch(clearTemplateState());
        };
    }, [dispatch, debouncedSearchQuery]);

    // Handle selection of options
    const handleSelection = (option) => {
        setSelectedOption(option); // Select the option
    };

    // Handle Send button click
    const handleSend = () => {
        console.log("Selected Option:", selectedOption);
        onClose(); // Close the popup
    };

    return (
        <>
            {isVisible && (
                <div
                    className="absolute bottom-[1.5rem] bg-gray-800 text-white shadow-2xl rounded-lg z-50"
                    style={{ minWidth: "350px", right:"-94px"}} // Set min width for the popup
                >
                    <div className="absolute top-2 border-b right-2 text-end w-full text-white cursor-pointer " onClick={onClose}>
                        <i className="fa fa-times"></i> {/* You can change this to an "X" or another icon */}
                    </div>
                
                    {/* Search Bar */}
                    <div className="relative p-2 mt-10">
  <input
    type="text"
    placeholder="Search Templates"
    className="w-full bg-gray-700 text-gray-300 pl-7 mb-1 py-1 rounded-md focus:outline-none"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
  />
  <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400">
    <i className="fa fa-search pl-2"></i> {/* Use FontAwesome */}
  </div>
</div>


                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {templates.length > 0 ? (
                            templates.map((option) => (
                                <div
                                    key={option.templateId} // Use unique property as the key
                                    className={`px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm ${selectedOption === option
                                            ? "bg-gray-600 text-blue-400"
                                            : ""
                                        }`}
                                    onClick={() => handleSelection(option)}
                                >
                                    {option.templateName} {/* Render the desired property, e.g., templateName */}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-400">
                                Search A Template
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t text-end">
                        <button
                            className="text-white px-2 py-1 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                            onClick={handleSend}
                            disabled={!selectedOption} // Disable if no option selected
                        >
                            <i className="fa fa-paper-plane-o"></i>
                        </button>
                    </div>
                    
                    {/* Loading state */}
                    {loading && (
                        <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 rounded-lg z-50">
                            <i className="fa fa-spinner fa-spin fa-2x text-white"></i>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DefinedTemplates;
 