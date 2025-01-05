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
                    className="absolute bottom-[4.5rem] right-4 bg-gray-800 text-white shadow-lg rounded-lg z-50"
                    style={{ minWidth: "320px" }} // Set min width for the popup
                >
                      <div className="absolute top-2 right-2 mb-2 text-white cursor-pointer" onClick={onClose}>
                        <i className="fa fa-times"></i> {/* You can change this to an "X" or another icon */}
                    </div>

                    {/* Search Bar */}
                    <div className="p-2 border-b border-gray-700">
                        <input
                            type="text"
                            placeholder="Search Templates"
                            className="w-full bg-gray-700 text-sm text-gray-300 px-3 py-2 rounded-md focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                        />
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
                                Search a template
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
 