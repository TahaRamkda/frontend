import React, { useState, useEffect } from "react";
import { HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Input, Form } from "reactstrap";
import { Formik } from "formik";
import dayjs from "dayjs";
import { fetchAgentsTimingList, createAgentTiming, clearAgentsTimingListState, agentShiftBulkUpload, clearBulkUploadState } from "@/slices/AgentSlice";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";

const weekDayMapping = {
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,

};

const weekDays = [
  { name: "Sunday" },
  { name: "Monday" },
  { name: "Tuesday" },
  { name: "Wednesday" },
  { name: "Thursday" },
  { name: "Friday" },
  { name: "Saturday" },

];

const AgentTimingList = ({ agentId, isVisible, onClose }) => {
  const [rows, setRows] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch();
  const { agentsTiming, loading } = useSelector((state) => state.agents);

  useEffect(() => {
    if (agentId) {
      // Clear the previous state when agentId changes
      dispatch(clearAgentsTimingListState());
  
      // Fetch the timings for the new agentId
      const clientId = localStorage.getItem("clientId");
      dispatch(fetchAgentsTimingList({ clientId: clientId, agentId: agentId }));
    }
  
    // Cleanup logic to prevent unwanted behavior if needed
    return () => {
      dispatch(clearAgentsTimingListState());
    };
  }, [dispatch, agentId]);
  
  const HandleShiftBulkUpload = async ({ setSubmitting }) => {
    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("File", FieldValue);
    formData.append("ActionBy", localStorage.getItem("userId"));
    try {
      const response = await dispatch(agentShiftBulkUpload(formData)).unwrap();
      onClose()
      onsuccess();
      if (response.success) {
        dispatch(clearBulkUploadState());
        setSubmitting(false);

        showSweetAlert({
          title: "Uploaded Successfully",
          text: "",
          icon: "success",
        });

        // window.location.reload();
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.result.message || "",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Failed to Upload", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (agentsTiming) {
      setRows(agentsTiming);
    }
  }, [agentsTiming]);

  const addRow = () => {
    setRows([...rows, { weekDay: "", weekDayName: "", startTime: "", endTime: "" }]);
  };
  const HandelCloseModal = ()=>{
    setShowModal(false)
  }
  const HandelClickModal = ()=>{
    setShowModal(true)
  }
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    const updatedRow = { ...updatedRows[index] };

    if (field === "weekDayName") {
      updatedRow["weekDay"] = weekDayMapping[value] || "";
      updatedRow[field] = value;
    } else {
      updatedRow[field] = value;
    }

    updatedRows[index] = updatedRow;
    setRows(updatedRows);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      clientId: localStorage.getItem("clientId"),
      agentId: agentId,
      actionBy: localStorage.getItem("userId"),
      timings: rows,
    };

    try {
      const response = await dispatch(createAgentTiming(requestBody)).unwrap();
      if (response.success) {
        onClose()
        showSweetAlert({
          title: "Added Successfully",
          text: "",
          icon: "success",
        });
        dispatch(fetchAgentsTimingList({ clientId: localStorage.getItem("clientId"), agentId: agentId }));
      } else {
        throw new Error(response.message || "Failed");
      }
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
    <Modal isOpen={isVisible} toggle={onClose} fade={false} >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-2/5  relative">

          <ModalHeader toggle={onClose}>Agent Shifts</ModalHeader>
          <ModalBody className="overflow-y-auto max-h-[75vh]">
            {loading && <Loading />}
            <div className=" mb-5">
              <div className="float-start">
              <Button color="primary" onClick={addRow} className="uniform_btn">
                Add Row
              </Button>
              </div>
              <div className="float-end">
                <Button className="uniform_btn" onClick={HandelClickModal}>
                  Bulk Shift Upload
                </Button>
              </div>
            </div>
            <div>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Weekday</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Input
                          type="select"
                          value={row.weekDayName}
                          onChange={(e) => handleInputChange(index, "weekDayName", e.target.value)}
                        >
                          <option value="">Select</option>
                          {weekDays.map((day) => (
                            <option key={day.name} value={day.name}>
                              {day.name}
                            </option>
                          ))}
                        </Input>
                      </td>
                      <td>
                        <Input
                          type="time"
                          value={row.startTime}
                          onChange={(e) => handleInputChange(index, "startTime", e.target.value)}
                        />
                      </td>
                      <td>
                        <Input
                          type="time"
                          value={row.endTime}
                          onChange={(e) => handleInputChange(index, "endTime", e.target.value)}
                        />
                      </td>
                      <td className="text-center">
                        <Button color="danger" onClick={() => removeRow(index)}>
                          <HiTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSubmit} className="uniform_btn">
              Save
            </Button>
          </ModalFooter>
        </div>
        {showModal && (
          <Modal isOpen={true} toggle={HandelCloseModal} fade={false} >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ">
                  <div className="bg-white p-6 rounded shadow-lg w-1/4  relative">
          
                    <ModalHeader toggle={HandelCloseModal}>Bulk Shift Upload</ModalHeader>
                    <ModalBody>
          
          
          
                      <div >
                        <div className="col-span-4">
                          <Formik
                            initialValues={{ UploadFile: null }}
                            onSubmit={HandleShiftBulkUpload}
                          >
                            {({ isSubmitting }) => (
                              <Form>
                                <div className="">
                                  <div className="">
                                    <Input
                                      type="file"
                                      className="p-2"
                                      accept=".xls,.xlsx"
                                      required
                                      onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        setFieldValue(file);
                                      }}
                                    />
                                  </div>
                                  <div className="flex justify-between items-center w-full mt-4">
                                    {/* Link aligned to the start */}
                                    <div>
                                      <a href="/assets/TimesheetUpload.xlsx" download className="text-blue-500 hover:underline">
                                        Download Sample File
                                      </a>
                                    </div>
                                    {/* Button aligned to the end */}
                                    <div>
                                      <Button className="uniform_btn" type="submit" disabled={isSubmitting}>
                                        Upload
                                      </Button>
                                    </div>
                                  </div>
          
                                </div>
                              </Form>
                            )}
                          </Formik>
                          {/* Download File Button */}
          
          
          
                        </div>
          
                      </div>
                    </ModalBody>
                  </div>
                </div>
              </Modal>
        )}
      </div>
    </Modal>
  );
};

export default AgentTimingList;
