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
  

  