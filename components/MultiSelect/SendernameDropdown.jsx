import React, { useEffect,useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from "reactstrap";
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchSendernamesDrop, clearSendernameDropState } from "@/slices/sendernameSlice";


const SendernameDropdown = ({ name, value, onChange, error }) => {
  const dispatch = useDispatch();   
  const { sendernameDrop, loading, error: fetchError } = useSelector((state) => state.sendernames);
  const selectRef = useRef(null);
  const [selectedSenderId, setSelectedSenderId] = useState([]);
const refreshDropdown = () =>{
  dispatch(fetchSendernamesDrop({ clientId: localStorage.getItem("clientId") }));
      }
  useEffect(() => {
    dispatch(fetchSendernamesDrop({ clientId: localStorage.getItem("clientId") }));
    return () => {
      // Clean up the select2 instance when the component unmounts
       dispatch(clearSendernameDropState());
       refreshDropdown()
    };
  }, [dispatch]);

  // Notify parent of selected group changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedSenderId);
    }
  }, [selectedSenderId, onChange]);


   // Handle select/deselect seder (via select2)
   useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select",
        allowClear: true,
        multiple: true,
      });

      $(selectRef.current).on("change", (e) => {
        const selectedValues = $(selectRef.current).val() || [];
        setSelectedSenderId(selectedValues);
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off("change");
      }
    };
  }, [sendernameDrop]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading  {error}</p>;

  // Filter out the selected groups from the available options
  const availableSenders = sendernameDrop.filter(
    (sendernameDrop) => !selectedSenderId.includes(sendernameDrop.senderId)
  );

  return (
    <>
      <div className="mb-4">
        <select
          ref={selectRef}
          id="senderSelect"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedSenderId}
          onChange={(e) => setSelectedSenderId(Array.from(e.target.selectedOptions, option => option.value))}
          multiple
          required
        >
          <option value="">Select</option>
          {availableSenders && availableSenders.length > 0 ? (
            availableSenders.map((sender) => (
              <option key={sender.id} value={sender.id}>
                {sender.name}
              </option>
            ))
          ) : (
            <option disabled>No records found</option>
          )}
        </select>
      </div>
    </>
  );
};

export default SendernameDropdown;
