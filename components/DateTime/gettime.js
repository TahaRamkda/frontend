function extractTime(datetimeString) {
    const date = new Date(datetimeString);
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid datetime string");
    }
  
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${hours}:${minutes}`;
  }