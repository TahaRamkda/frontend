import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiTrash } from "react-icons/hi";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
} from "reactstrap";
import {
  fetchCampaignContactState,
  clearCampaignContactState,
  fetchCampaignFrequentDelete,
  clearCampaignFreqDeleteState,
} from "@/slices/campaignSlice";
import Loader from "@/components/Layout/Loader";


const LastContactedList = ({ isVisible, onClose, onsuccess, campaignId }) => {
  // Hardcoded data for "Last Contacted"
  const ClientId = typeof window !== "undefined" ? localStorage.getItem("clientId") : null;;
  const dispatch = useDispatch();
  const [CampaignId, setCampaignId] = useState(0);
  const { campaignContactState, campaignFreqDelete, loading } = useSelector(
    (state) => state.campaigns
  );
  
  const [rows, setRows] = useState([
    { days: "7 Days", timesContacted: 0 },
    { days: "14 Days", timesContacted: 0 },
    { days: "30 Days", timesContacted: 0 },
    { days: "70 Days", timesContacted: 0 },
  ]);

  useEffect(() => {
    if (campaignId) {
      setCampaignId(campaignId);
    }
  }, [campaignId]);

  useEffect(() => {
    
    if (CampaignId) {
      dispatch(
        fetchCampaignContactState({
          ClientId: ClientId,
          CampaignId: CampaignId,
        })
      );
    }
  }, [dispatch, ClientId,CampaignId]);
  // Handle row removal
  const removeRow = (removedays) => {
    const days = removedays;
    const ClientId = localStorage.getItem("clientId");
    dispatch(
      fetchCampaignFrequentDelete({
        ClientId: ClientId,
        CampaignId: CampaignId,
        Removedays: days,
      })
    ).then(() => {
      dispatch(
        fetchCampaignContactState({
          ClientId: ClientId,
          CampaignId: CampaignId,
        })
      );
    });
  };
  


  return (
    <Modal isOpen={isVisible} toggle={onClose} fade={false}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
          <ModalHeader toggle={onClose}>Last Contacted</ModalHeader>
          <ModalBody className="overflow-y-auto max-h-[75vh]">
            {loading && <Loader />}
            <div className="mt-4 w-full">
              <Table bordered responsive className="w-full text-center">
                <thead>
                  <tr>
                    <th>Days</th>
                    <th>No. of customer contacted</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>7 Days</td>
                    <td>{campaignContactState.contactedIn7days}</td>
                    <td className="text-center">
                      <Button color="danger" onClick={() => removeRow(7)}>
                        <HiTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>14 Days</td>
                    <td>{campaignContactState.contactedIn14days}</td>
                    <td className="text-center">
                      <Button color="danger" onClick={() => removeRow(14)}>
                        <HiTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>30 Days</td>
                    <td>{campaignContactState.contactedIn30days}</td>
                    <td className="text-center">
                      <Button color="danger" onClick={() => removeRow(30)}>
                        <HiTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>60 Days</td>
                    <td>{campaignContactState.contactedIn60days}</td>
                    <td className="text-center">
                      <Button color="danger" onClick={() => removeRow(60)}>
                        <HiTrash />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>90 Days</td>
                    <td>{campaignContactState.contactedIn90days}</td>
                    <td className="text-center">
                      <Button color="danger" onClick={() => removeRow(90)}>
                        <HiTrash />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>

          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </div>
      </div>
    </Modal>
  );
};

export default LastContactedList;
