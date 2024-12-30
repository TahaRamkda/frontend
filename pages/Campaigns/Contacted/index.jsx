import React, { useState, useEffect } from "react";
import { HiTrash } from "react-icons/hi";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from "reactstrap";
import { fetchCampaignContactState, clearCampaignContactState, fetchCampaignFrequentDelete,clearCampaignFreqDeleteState } from "@/slices/campaignSlice";
import { useDispatch, useSelector } from "react-redux";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Loader";

const LastContactedList = ({ isVisible, onClose, onsuccess }) => {
  // Hardcoded data for "Last Contacted"
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [Form, setForm] = useState({})
const [CampaignId, setCampaignId] = useState(0);
  const { campaignContactState,campaignFreqDelete,loading } = useSelector((state) => state.campaigns);
  const ClientId=localStorage.getItem('ClientId')
  const [rows, setRows] = useState([
    { days: "7 Days", timesContacted: 0},
    { days: "14 Days", timesContacted: 0 },
    { days: "30 Days", timesContacted: 0 },
    { days: "70 Days", timesContacted: 0 },
  ]);


 
   
  // Handle row removal
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Handle save (simulating an API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onsuccess()
    onClose()

    // Simulating a save operation (API call)
    try {
      // You can replace this with the actual API call when you fetch/save the data
      showSweetAlert({
        title: "Data Saved Successfully",
        text: "",
        icon: "success",
      });
    } catch (err) {
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isVisible} toggle={onClose} fade={false}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
          <ModalHeader toggle={onClose}>Last Contacted</ModalHeader>
          <ModalBody className="overflow-y-auto max-h-[75vh]">
            {loading && <Loading />}
            <div>
              <Table bordered>
                
                   
                    <div>
                      <tr>
                        <th>Days</th>
                        <th>No. of customer contacted</th>
                        <th>remove</th>
                      </tr>
                    
                    
                   
                    <tr >
                      <td>90 Days</td>
                      <td>{Form.contactedIn7days}</td>
                      <td className="text-center">
                        <Button color="danger" onClick={() => removeRow(index)}>
                          <HiTrash />
                        </Button>
                      </td>
                    </tr>
                    </div>
            
               
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSubmit} className="uniform_btn">
              Save
            </Button>
          </ModalFooter>
        </div>
      </div>
    </Modal>
  );
};

export default LastContactedList;
