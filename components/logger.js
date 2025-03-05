
const logChatDetails = (
    logger,
    logMessage = "Chat details logged",
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
  
    try {
      // Construct metadata object with only provided arguments
      const metadata = {};
      if (Obj !== null) metadata.Obj = Obj;
      if (agentId !== null) metadata.agentId = agentId;
      if (conversationId !== null) metadata.conversationId = conversationId;
      if (type !== null) metadata.type = type;
      if (userId !== null) metadata.userId = userId;
      Object.assign(metadata, additionalData); // Add any extra arguments
  
      // Log with Axiom
      logger.info(logMessage, metadata);
      logger.flush(); // Ensure logs are sent immediately
    } catch (error) {
      console.error("Failed to log chat details with Axiom:", error);
    }
  };
  
  export default logChatDetails;