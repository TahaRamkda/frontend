import React, { useMemo, useState, useEffect } from "react";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import Loading from "@/components/Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgentsPerfomance, clearAgentPerfomanceState } from "@/slices/AgentSlice";
import showSweetAlert from "@/components/Sweetalert";
import AgentDropdown from "@/components/Dropdowns/AgentDropdown";
import App from '@/components/Layout/App';
const AgentsList = () => {

 
  const dispatch = useDispatch();
  const { agentsPerfomance , loading, error, pageSize, totalRecords, currentPage } = useSelector((state) => state.agents);
  const [AgentId, setAgentId] = useState(null);

  const dataTableData = [

    { name: "Agent Name", selector: (row) => row.userName, sortable: true },
    { name: "Assigned", selector: (row) => row.agentFName, sortable: true },
    { name: "Active", selector: (row) => row.agentLName, sortable: true },
    { name: "Abandoned", selector: (row) => row.statusName, sortable: true },
    { name: "Closed", selector: (row) => row.statusName, sortable: true },
    { name: "Force Closed", selector: (row) => row.statusName, sortable: true },
  ];

  useEffect(() => {
    dispatch(fetchAgentsPerfomance({ clientId: localStorage.getItem("clientId"), agentId:AgentId }));
    return () => {
      dispatch(clearAgentPerfomanceState());
    };
  }, [dispatch]);

  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col mb-1 text-start">
            <label className="font-medium text-gray-700 text-sm">Agents</label>
            <AgentDropdown name="agentId" onChange={handleChange} />
          </div>
        </div>
      </div>
    ),
    [filterText]
  );
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  return (
    <App>

      <div className="flex items-center">
        {loading && <Loading />}
        <div className=''>
          <h4 className="font-bold ">Agents Perfomance</h4>
        </div>
      </div>

      <div className="overflow-auto">
        <DataTable
          data={agentsPerfomance}
          columns={dataTableData}
          highlightOnHover
          striped
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          className="w-full border"
          customStyles={{
            table: {
              style: {
                width: '100%',
                borderCollapse: 'collapse', // Ensures borders collapse for proper grid appearance
              },
            },
            headRow: {
              style: {
                borderBottom: '1px solid #ddd', padding: '0px',
              },
            },
            headCells: {
              style: {
                borderRight: '1px solid #ddd', // Grid line between columns
                fontWeight: 'bold',
              },
            },
            rows: { 
              style: {
                borderBottom: '1px solid #ddd', // Horizontal grid line between rows
              },
            },
            cells: {
              style: {

                borderRight: '1px solid #ddd', // Vertical grid line between cells
              },
            },
          }} />

      </div>
    </App>
  );
};

export default AgentsList;
