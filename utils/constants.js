  export const FORMATEDATE = (dateString) => {
    if (!dateString) return ''; // Handle empty or undefined dates
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Handle invalid dates
  
    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    // Return in yyyy-MM-dd format
    return `${day}-${month}-${year}`;
  };
  

  export const extractTime = (datetimeString) => {
    const date = new Date(datetimeString);
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid datetime string");
    }
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
  
    hours = hours % 12 || 12; // Convert to 12-hour format; '0' becomes '12'
  
    return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
  };


  //to refresh the api call every 5 minutes
export const REFRESH_INTERVAL=1200000 ; // 5 minutes in milliseconds

export const NOTIFICATION_WARNING_INTERVAL=28800000  ; // 5 minutes in milliseconds

export const HEARTBEAT_CHECK_INTERVAL=10000 ; // 5 minutes in milliseconds

export const ExpireTime_AssignedChat=30000 ; // 30 Seconds

export const ExpireTime_Message=300000 ; // 5 minutes in milliseconds

export const HeartBeat_Interval=100000 ; // 5 minutes in milliseconds

  