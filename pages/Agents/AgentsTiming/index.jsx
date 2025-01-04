import React, { useState, useEffect } from "react";
import { HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Input } from "reactstrap";
import dayjs from "dayjs";
import { fetchAgentsTimingList, createAgentTiming } from "@/slices/AgentSlice";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Loader";

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
  const dispatch = useDispatch();
  const { agentsTiming, loading } = useSelector((state) => state.agents);

  useEffect(() => {
    if (!agentId) return;
    const clientId = localStorage.getItem("clientId");
    dispatch(fetchAgentsTimingList({ clientId: clientId, agentId: agentId }));
  }, [dispatch, agentId]);

  useEffect(() => {
    if (agentsTiming) {
      setRows(agentsTiming);
    }
  }, [agentsTiming]);

  const addRow = () => {
    setRows([...rows, { weekDay: "", weekDayName: "", startTime: "", endTime: "" }]);
  };

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
            <div className=" mb-3">
              <Button color="primary" onClick={addRow} className="uniform_btn">
                Add Row
              </Button>
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
      </div>
    </Modal>
  );
};

export default AgentTimingList;
