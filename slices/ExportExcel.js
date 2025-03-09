// src/redux/slices/chatMonitorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { EXCELEXPORTCHATREPORT, EXCELEXPORTCHATMONITOR, EXCELEXPORTAGENTMONITOR,EXCELEXPORTAGENTREPORT, EXCELEXPORTSURVEYREPORT } from '@/utils/apiConstants';

// Excel Export Chat Report 
export const excelExportChatReport = createAsyncThunk(
  'chatReport/excelExportChatReport',
  async ({ senderId, chatId, agentId, searchStr,fChatInitiated, fromDate, toDate,status }, { rejectWithValue }) => {
    
    try {
      const chatReportExportUrl = `${EXCELEXPORTCHATREPORT}?senderId=${senderId}&id=${chatId}&agentId=${agentId}&searchStr=${searchStr}&status=${status}&fChatInitiated=${fChatInitiated}&fromDate=${fromDate}&toDate=${toDate}`;
      // Make API request and get blob data for Excel file
      const response = await API.get(chatReportExportUrl, { responseType: 'blob' });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link for Excel file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      let fileName = 'ChatReport.xlsx'; // Default filename
      
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
      const response = await API.get(agentMonitorExportUrl, { responseType: 'blob' });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link for Excel file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      let fileName = 'AgentReport.xlsx'; // Default filename
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

// Excel Export Agent Monitor
export const excelExportAgentMonitor = createAsyncThunk(
  'agentMonitor/excelExportAgentMonitor',
  async ({ senderId, fromDate, toDate, searchStr }, { rejectWithValue }) => {
    
    try {
      const agentReportUrl = `${EXCELEXPORTAGENTMONITOR}?senderId=${senderId}&searchStr=${searchStr}&fromDate=${fromDate}&toDate=${toDate}`;
      // Make API request and get blob data for Excel file
      const response = await API.get(agentReportUrl, { responseType: 'blob' });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link for Excel file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      let fileName = 'AgentMonitor.xlsx'; // Default filename
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


// Export Excel Survey Report  
export const excelExportSurveyReport = createAsyncThunk(
  'surveyReport/excelExportSurveyReport',
  async ({ senderId, fromDate, toDate, searchStr }, { rejectWithValue }) => {
    
    try {
      const agentReportUrl = `${EXCELEXPORTSURVEYREPORT}?senderId=${senderId}&searchStr=${searchStr}&fromDate=${fromDate}&toDate=${toDate}`;
      // Make API request and get blob data for Excel file
      const response = await API.get(agentReportUrl, { responseType: 'blob' });
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link for Excel file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      let fileName = 'AgentMonitor.xlsx'; // Default filename
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

