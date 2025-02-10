import React, { useEffect, useRef,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import Loader from '../Layout/Loader';
import { fetchSendernamesDrop, clearSendernameDropState } from "@/slices/sendernameSlice";
import { Input } from 'reactstrap';

const SendernameDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { sendernameDrop, loading, error } = useSelector((state) => state.sendernames);
    const [SearchStr, setSearchStr] = useState("")

  useEffect(() => {
    dispatch(fetchSendernamesDrop({ clientId: localStorage.getItem("clientId") }));

  }, [dispatch]);
  
  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select",
        allowClear: true,
      });

      $(selectRef.current).on("change", (e) => {
        let selectedValue = e.target.value;
        if (!selectedValue) {
          selectedValue = "0";
        }
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off("change");
      }
    };
  }, [sendernameDrop, onChange]);

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <div>

      <Input
        type="select"
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="0">Select</option>
        {sendernameDrop && sendernameDrop.length > 0 ? (
          sendernameDrop.map((sendername) => (
            <option key={sendername.id} value={sendername.id}>
              {sendername.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>  
    </div>
  );
};

export default SendernameDropdown;
