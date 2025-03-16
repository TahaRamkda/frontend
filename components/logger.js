const logChatDetails = async (
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

    // Log with Axiom and await the logging operation
    await logger.info(logMessage, metadata);
    await logger.flush(); // Wait for logs to be sent
  } catch (error) {
    console.error("Failed to log chat details with Axiom:", error);
   // throw error; // Re-throw the error to allow caller to handle it
  }
};

export default logChatDetails;