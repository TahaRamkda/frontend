import React, {useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchClientsDrop, clearClientDropState } from "@/slices/ClientSlice";
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const ClientDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null); 
  const { clientsDrop, loading, error } = useSelector((state) => state.clients);
 const [searchString, setsearchString] = useState("");
 const refreshDropdown = () =>{
    dispatch(fetchClientsDrop({ clientId: localStorage.getItem("clientId"), searchStr:searchString }));
 }
  useEffect(() => {
    dispatch(fetchClientsDrop({ clientId: localStorage.getItem("clientId"), searchStr:searchString }));
    return () => {
       dispatch(clearClientDropState());
       refreshDropdown()
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: 'Select',
        allowClear: true,
      });

      $(selectRef.current).on('change', (e) => {
        let selectedValue = e.target.value;
        if (!selectedValue) {
          selectedValue = "0";
        }
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off('change');
      }
    };
  }, [clientsDrop, onChange]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <FormGroup>
      <Input
        type="select"
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="0">Select</option>
        {clientsDrop && clientsDrop.length > 0 ? (
          clientsDrop.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </FormGroup>
  );
};

export default ClientDropdown;
