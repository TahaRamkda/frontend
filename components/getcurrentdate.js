
export const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Ensures two digits
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = today.getFullYear();
  
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
  };
  