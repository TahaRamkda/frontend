import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [logLevel, setLogLevel] = useState("");
  const [selectedLog, setSelectedLog] = useState(null); // Track selected log for modal
  const [modalOpen, setModalOpen] = useState(false); // Control modal visibility

  // Fetch logs from Axiom API
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = "[] | limit 100";
      if (logLevel) {
        query = `['${logLevel}'] | limit 100`;
      }

      const response = await axios.post(
        `https://api.axiom.co/v1/datasets/${process.env.NEXT_PUBLIC_AXIOM_DATASET}/query`,
        {
          query,
          startTime: `${startDate}T00:00:00Z`,
          endTime: `${endDate}T23:59:59Z`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AXIOM_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLogs(response.data.matches || []);
    } catch (err) {
      setError(err.message || "Failed to fetch logs");
      toast.error(`Error fetching logs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [logLevel, startDate, endDate]);

  const handleRefresh = useCallback(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Open modal with selected log details
  const openLogDetails = useCallback((index) => {
    console.log("Opening log details for index:", index);
    setSelectedLog(logs[index]);
    setModalOpen(true);
  }, [logs]);

  // Close modal
  const closeModal = useCallback(() => {
    console.log("Closing modal");
    setModalOpen(false);
    setSelectedLog(null);
  }, []);

  return (
    <>
      <Head>
        <title>Logs Viewer - BCT-Chat Portal</title>
      </Head>
      <Container fluid className="h-100 py-4">
        <Row>
          <Col>
            <Card className="p-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Logs Viewer</h2>
                <Button
                  color="primary"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Refresh Logs"}
                </Button>
              </div>

              {/* Filters */}
              <Row className="mb-3">
                <Col md="4">
                  <FormGroup>
                    <Label for="startDate">Start Date</Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label for="endDate">End Date</Label>
                    <Input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label for="logLevel">Log Level</Label>
                    <Input
                      type="select"
                      id="logLevel"
                      value={logLevel}
                      onChange={(e) => setLogLevel(e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="info">Info</option>
                      <option value="error">Error</option>
                      <option value="debug">Debug</option>
                      <option value="warn">Warn</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading && !error && (
                <div className="text-center">
                  <Spinner color="primary" />
                  <p>Loading logs...</p>
                </div>
              )}

              {!loading && !error && logs.length === 0 && (
                <p className="text-muted">No logs found for the selected filters.</p>
              )}

              {!loading && !error && logs.length > 0 && (
                <div
                  style={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                >
                  {logs.map((logEntry, index) => (
                    <div key={logEntry._rowId || index} className="mb-2">
                      {/* Log Title (Clickable) */}
                      <div
                        onClick={() => openLogDetails(index)}
                        style={{
                          cursor: "pointer",
                          padding: "10px",
                          backgroundColor: "#fff",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          userSelect: "none",
                        }}
                      >
                        <span>
                          <strong>{new Date(logEntry._time).toLocaleString()}</strong> -{" "}
                          {logEntry.data?.message || "N/A"}
                        </span>
                        <span>🔍</span> {/* Eye icon or similar */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Modal for Log Details */}
        <Modal isOpen={modalOpen} toggle={closeModal} size="lg">
          <ModalHeader toggle={closeModal}>Log Details</ModalHeader>
          <ModalBody>
            {selectedLog && (
              <Table bordered responsive>
                <tbody>
                  <tr>
                    <th>Timestamp</th>
                    <td>{new Date(selectedLog._time).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Message</th>
                    <td>{selectedLog.data?.message || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Level</th>
                    <td>{selectedLog.data?.level || "N/A"}</td>
                  </tr>
                  <tr>
                    <th>Source</th>
                    <td>{selectedLog.data?.source || "N/A"}</td>
                  </tr>
                  {selectedLog.data?.fields &&
                    Object.entries(selectedLog.data.fields).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>
                          {typeof value === "object" && value !== null ? (
                            <pre
                              style={{
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            String(value)
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </ModalBody>
        </Modal>
      </Container>
    </>
  );
};

export default LogsPage;