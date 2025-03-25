const logChatDetails = async (
  logger,
  logMessage = "Chat details logged",
  logtype = "info",
  {
    Obj = null,
    agentId = null,
    conversationId = null,
    type = null,
    userId = null,
    ...additionalData
  } = {}
) => {
  if (!logger) {
    console.error("Logger instance is required for logChatDetails");
    return;
  }
  const metadata = {};
  if (Obj !== null) metadata.Obj = Obj;
  if (agentId !== null) metadata.agentId = agentId;
  if (conversationId !== null) metadata.conversationId = conversationId;
  if (type !== null) metadata.type = type;
  if (userId !== null) metadata.userId = userId;
  Object.assign(metadata, additionalData); // Add any extra arguments

if(localStorage.getItem("isaxiomenabled") === "true"){
  try {
    // Construct metadata object with only provided arguments
   
    // Log with Axiom and await the logging operation
    if(logtype == "info"){
      await logger.info(logMessage, metadata);
    }
    else if(logtype == "error"){
      await logger.error(logMessage, metadata);
    }
    await logger.flush(); // Wait for logs to be sent
  } catch (error) {
    console.error("Failed to log chat details with Axiom:", error);
   // throw error; // Re-throw the error to allow caller to handle it
  }
}
else{
  console.log(logMessage, metadata);
}
  
};

export default logChatDetails;