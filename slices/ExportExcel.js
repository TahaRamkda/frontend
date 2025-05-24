// src/redux/slices/chatMonitorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { EXCELEXPORTCHATREPORT, EXCELEXPORTCHATMONITOR, EXCELEXPORTAGENTMONITOR,EXCELEXPORTAGENTREPORT, EXCELEXPORTSURVEYREPORT } from '@/utils/apiConstants';

// Excel Export Chat Report 
export const excelExportChatReport = createAsyncThunk(
  'chatReport/excelExportChatReport',
  async (
    { senderId, chatId, agentId, searchStr, fChatInitiated, fromDate, toDate, status },
    { rejectWithValue }
  ) => {
    try {
      const chatReportExportUrl = `${EXCELEXPORTCHATREPORT}?senderId=${senderId}&id=${chatId}&agentId=${agentId}&searchStr=${searchStr}&status=${status}&fChatInitiated=${fChatInitiated}&fromDate=${fromDate}&toDate=${toDate}`;

      // ⚠️ IMPORTANT: Set responseType to 'blob' here
      const response = await API.post(
        '/api',
        {
          endpoint: chatReportExportUrl,
          method: 'GET'
        },
        {
          responseType: 'blob' // ✅ Axios parses the blob correctly now
        }
      );

      // ✅ Create blob from response
      const fileBlob = new Blob([response.data], {
        type: response.headers['content-type']
      });

      // ✅ Extract filename from Content-Disposition
      let fileName = 'ChatReport.xlsx';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes('attachment')) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }

      // ✅ Download via anchor element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (err) {
      handleError(err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);


// Export Excel Chat Monitor 
export const excelExportChatMonitor = createAsyncThunk(
  'chatMonitor/excelExportChatMonitor',
  async ({ senderId, chatId, agentId, searchStr,fChatInitiated,status }, { rejectWithValue }) => {
    
    try {
      const chatMonitorExportUrl = `${EXCELEXPORTCHATMONITOR}?senderId=${senderId}&id=${chatId}&agentId=${agentId}&searchStr=${searchStr}&fChatInitiated=${fChatInitiated}&status=${status}`;
      // Make API request and get blob data for Excel file
      const response = await API.get(chatMonitorExportUrl, { responseType: 'blob' });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      // Create download link for Excel file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      let fileName = 'ChatMonitor.xlsx'; // Default filename
      // Extract filename from headers if available
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true }; // Return success status
    } catch (err) {
      handleError(err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

// Export Excel Agent Report 
export const excelExportAgentReport = createAsyncThunk(
  'agentReport/excelExportAgentReport',
  async ({ senderId, fromDate, toDate, searchStr }, { rejectWithValue }) => {
    
    try {
      const agentMonitorExportUrl = `${EXCELEXPORTAGENTREPORT}?senderId=${senderId}&searchStr=${searchStr}&fromDate=${fromDate}&toDate=${toDate}`;
      // Make API request and get blob data for Excel file
      
      const response = await API.post(
  '/api',
  {
    endpoint: agentMonitorExportUrl,
    method: 'GET'
  },
  {
    responseType: 'blob', // Important!
  }
);

const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });

const link = document.createElement('a');
link.href = window.URL.createObjectURL(fileBlob);

let fileName = 'AgentReport.xlsx';
const contentDisposition = response.headers['content-disposition'];
if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  if (fileNameMatch && fileNameMatch.length > 1) {
    fileName = fileNameMatch[1];
  }
}

link.download = fileName;
document.body.appendChild(link);
link.click();
link.remove();

      
      return { success: true }; // Return success status
    } catch (err) {
      handleError(err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

// Excel Export Agent Monitor
export const excelExportAgentMonitor = createAsyncThunk(
  'agentMonitor/excelExportAgentMonitor',
  async ({ senderId, fromDate, toDate, searchStr }, { rejectWithValue }) => {
    try {
      const agentReportUrl = `${EXCELEXPORTAGENTMONITOR}?senderId=${senderId}&searchStr=${searchStr}&fromDate=${fromDate}&toDate=${toDate}`;
      debugger
      // ✅ Make API request and expect blob
      const response = await API.post(
        '/api',
        {
          endpoint: agentReportUrl,
          method: 'GET'
        },
        {
          responseType: 'blob' // ✅ Axios parses the blob correctly now
        }
      );
      debugger
      // ✅ Create a Blob object from response
      const fileBlob = new Blob([response.data], {
        type: response.headers['content-type']
      });

      // ✅ Determine filename from headers or use default
      let fileName = 'AgentMonitor.xlsx';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes('attachment')) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }

      // ✅ Trigger browser download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (err) {
      handleError(err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);



// Export Excel Survey Report  
export const excelExportSurveyReport = createAsyncThunk(
  'surveyReport/excelExportSurveyReport',
  async ({ senderId, fromDate, toDate,flowId }, { rejectWithValue }) => {
    
    try {
      const surveyReportUrl = `${EXCELEXPORTSURVEYREPORT}?senderId=${senderId}&fromDate=${fromDate}&toDate=${toDate}&flowId=${flowId}`;
      // Make API request and get blob data for Excel file
      const response = await API.get(surveyReportUrl, { responseType: 'blob' });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link for Excel file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      let fileName = 'SurveyReport.xlsx'; // Default filename
      // Extract filename from headers if available
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true }; // Return success status
    } catch (err) {
      handleError(err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

