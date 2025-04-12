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
  // Validate logger instance
  if (!logger) {
    console.error("Logger instance is required for logChatDetails");
    return;
  }
debugger
  // Construct metadata object with only provided arguments
  const metadata = {};
  if (Obj !== null) metadata.Request = Obj;
  if (agentId !== null) metadata.agentId = agentId;
  if (conversationId !== null) metadata.conversationId = conversationId;
  if (type !== null) metadata.type = type;
  if (userId !== null) metadata.userId = userId;
  Object.assign(metadata, additionalData); // Merge any additional arguments
debugger
  // Check if Axiom logging is enabled
  const isAxiomEnabled = localStorage.getItem("isaxiomenabled") === "true";

  if (isAxiomEnabled) {
    try {
      // Log based on logtype
      switch (logtype.toLowerCase()) {
        case "info":
          await logger.info(logMessage, metadata);
          break;
        case "error":
          await logger.error(logMessage, metadata);
          break;
        case "warn":
          await logger.warn(logMessage, metadata); // Optional: Add warn if supported by logger
          break;
        case "debug":
          await logger.debug(logMessage, metadata); // Optional: Add debug if supported by logger
          break;
        default:
          console.warn(`Unsupported logtype: ${logtype}, defaulting to info`);
          await logger.info(logMessage, metadata);
          break;
      }

      // Flush logs to ensure they are sent
      await logger.flush();
    } catch (error) {
      console.error("Failed to log chat details with Axiom:", error);
      // Optionally re-throw if the caller needs to handle it
      // throw error;
    }
  } else {
    // Fallback to console logging if Axiom is disabled
    const consoleMethod = logtype.toLowerCase() === "error" ? console.error : console.log;
    consoleMethod(logMessage, metadata);
  }
};

export default logChatDetails;