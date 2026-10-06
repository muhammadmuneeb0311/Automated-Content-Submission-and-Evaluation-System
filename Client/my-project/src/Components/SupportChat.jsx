import React, { useEffect, useState, useRef,useMemo } from "react";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Container, Card, Form, Button, Badge, ListGroup, InputGroup, Spinner, Alert, Row, Col,
} from "react-bootstrap";
import { Send, ChatSquare, People, Person, Shield, Clock } from "react-bootstrap-icons";

const SupportChat = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;
  const teamId = decoded?.teamId;
  const jwtRole = decoded?.role;
  const userName = jwtRole === "admin" ? decoded?.name || "Admin" : "";

  // ===== States =====
  const [socket, setSocket] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentTeamId, setCurrentTeamId] = useState(teamId || null); // For admin
  const [teamName, setTeamName] = useState(userName || "Team");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  const messagesEndRef = useRef(null);
const axiosConfig = useMemo(
  () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  [token]
);
  // ===== Initialize Socket =====
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      extraHeaders: { Authorization: `Bearer ${token}` },
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [token]);

  // ===== Scroll to bottom on new message =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getDisplayRole = (role) => ({
    team: "Team Leader",
    teammember: "Team Member",
    team_lead: "Team Lead",
    admin: "Administrator",
    evaluator: "Evaluator",
  }[role] || role);

  const displayRole = getDisplayRole(jwtRole);

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin": return "danger";
      case "team": return "primary";
      case "team_lead": return "warning";
      case "teammember": return "info";
      case "evaluator": return "info";
      default: return "secondary";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp || Date.now());
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // ===== Fetch personal conversations for admin or team =====
  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        let idToUse = ["team_lead", "teammember"].includes(jwtRole) ? teamId : userId;
        let res;

        if (jwtRole === "admin") {
          // Admin: fetch all personal conversations
          res = await axios.get(`http://localhost:5000/api/support/conversation/${idToUse}/${jwtRole}`, axiosConfig);
        } else {
          // Team members/leaders: fetch or create personal conversation with admin
          res = await axios.get(`http://localhost:5000/api/support/conversation/${idToUse}/${jwtRole}`, axiosConfig);
          if (res.data.length === 0) {
            const createRes = await axios.post(
              "http://localhost:5000/api/support/conversation",
              { team_id: teamId, subject: "Support Chat (Private)" },
              axiosConfig
            );
            res = { data: [createRes.data] };
          }
        }

        setConversations(res.data);
        if (res.data.length > 0) {
          setCurrentConversationId(res.data[0]._id);
          setCurrentTeamId(res.data[0].team_id?._id || teamId);
          setTeamName(res.data[0].team_id?.teamName || "Team");
        }
      } catch (err) {
        console.error("❌ Error fetching conversations:", err);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId, jwtRole, teamId,axiosConfig]);

  // ===== Load messages =====
  // useEffect(() => {
  //   if (!currentConversationId) return;
  //   const fetchMessages = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(
  //         `http://localhost:5000/api/support/messages/${currentConversationId}`,
  //         axiosConfig
  //       );
  //       setMessages(res.data);
  //       socket?.emit("join_room", currentConversationId);
  //     } catch {
  //       setError("Failed to load messages");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchMessages();
  // }, [currentConversationId, socket]);


  useEffect(() => {
  if (!currentConversationId) return;

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/support/messages/${currentConversationId}`,
        axiosConfig
      );

      setMessages(res.data);
      socket?.emit("join_room", currentConversationId);
    } catch {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();
}, [currentConversationId, socket, axiosConfig]);

  // ===== Socket listener =====
  useEffect(() => {
    if (!socket) return;
    const handleReceive = (data) => {
      if (data.conversation_id === currentConversationId) {
        setMessages((prev) => [...prev, data]);
      }
    };
    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [currentConversationId, socket]);

  // ===== Send message =====
  const sendMessage = async () => {
    if (!messageText.trim() || !currentConversationId || !socket) return;

    const newMsg = {
      conversation_id: currentConversationId,
      sender_id: userId,
      sender_type: jwtRole,
      sender_name: teamName,
      sender_role: displayRole,
      message_text: messageText,
      ...(jwtRole === "admin" && { team_id: currentTeamId }), // admin must send team_id
    };

    try {
      setSending(true);
      const res = await axios.post(
        "http://localhost:5000/api/support/messages",
        newMsg,
        axiosConfig
      );
      socket.emit("send_message", { ...res.data, room: currentConversationId });
      setMessageText("");
    } catch {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ===== Admin conversation selector =====
  const ConversationSelector = () => {
    if (jwtRole !== "admin") return null;
    return (
      <Card className="mb-3">
        <Card.Header className="bg-light d-flex align-items-center">
          <People className="me-2" />
          <strong>Select Team</strong>
        </Card.Header>
        <Card.Body>
          <Form.Select
            value={currentConversationId || ""}
            onChange={(e) => {
              const conv = conversations.find(c => c._id === e.target.value);
              setCurrentConversationId(conv?._id);
              setCurrentTeamId(conv?.team_id?._id);
              setTeamName(conv?.team_id?.teamName || "Team");
            }}
            disabled={loading}
          >
            <option value="">Choose a team...</option>
            {conversations.map((conv, idx) => (
              <option key={`${conv._id}-${idx}`} value={conv._id}>
                {conv.team_id?.teamName || `Team: ${conv.team_id}`} - {conv.subject}
              </option>
            ))}
          </Form.Select>
        </Card.Body>
      </Card>
    );
  };

  // ===== Render =====
  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <ChatSquare className="me-2" size={20} />
                <h5 className="mb-0">Support Chat</h5>
              </div>
              <Badge bg="light" text="dark" className="fs-6">
                <Person className="me-1" size={12} />
                {teamName} • <Shield className="ms-1" size={12} /> <span className="ms-1">{displayRole}</span>
              </Badge>
            </Card.Header>

            <Card.Body className="p-0">
              <ConversationSelector />
              {error && <Alert variant="danger" className="m-3 mb-0">{error}</Alert>}
              <div style={{ height: "400px", overflowY: "auto" }} className="p-3">
                {loading && !messages.length ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-5">
                    <ChatSquare size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No messages yet</h5>
                    <p className="text-muted">
                      {jwtRole === "admin"
                        ? "Select a team to chat"
                        : "Start a conversation with admin"}
                    </p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {messages.map((msg, idx) => {
                      const isTeam = ["team", "team_lead", "teammember"].includes(msg.sender_type);
                      const isAdmin = msg.sender_type === "admin";
                      const isCurrentUser = msg.sender_id === userId;

                      // Fix: always show role, fallback to derived role if sender_role is missing
                      const senderRole = msg.sender_role || getDisplayRole(msg.sender_type);
                      <Badge>{senderRole}</Badge>


                      return (
                        <ListGroup.Item key={`${msg._id}-${idx}`} className="border-0 px-0 py-3">
                          <div className={`d-flex ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center ${isAdmin ? "bg-danger" : isTeam ? "bg-primary" : "bg-secondary"
                                }`}
                              style={{ width: "40px", height: "40px", minWidth: "40px" }}
                            >
                              <Person className="text-white" size={16} />
                            </div>
                            <div className={`mx-3 ${isCurrentUser ? "text-end" : ""}`} style={{ flex: 1 }}>
                              <div className="d-flex align-items-center mb-1">
                                <strong className="me-2">{msg.sender_name}</strong>
                                <Badge bg={getRoleBadgeVariant(msg.sender_type)} className="me-2">
                                  {senderRole} {/* This now always shows the role */}
                                </Badge>
                                <small className="text-muted d-flex align-items-center">
                                  <Clock className="me-1" size={12} />
                                  {formatTime(msg.sent_at)}
                                </small>
                              </div>
                              <div className={`rounded p-2 ${isCurrentUser ? "bg-primary text-white" : "bg-light text-dark"}`}>
                                {msg.message_text}
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </ListGroup>

                )}
              </div>

              <Card.Footer className="bg-light border-top">
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={jwtRole === "admin" ? "Type your response..." : "Type your message..."}
                    disabled={!currentConversationId || sending}
                    style={{ resize: "none" }}
                  />
                  <Button
                    variant="primary"
                    onClick={sendMessage}
                    disabled={!messageText.trim() || !currentConversationId || sending}
                    className="px-4"
                  >
                    {sending ? <Spinner animation="border" size="sm" /> : <><Send className="me-2" size={16} />Send</>}
                  </Button>
                </InputGroup>
                <div className="text-muted small mt-2">Press Enter to send • Shift+Enter for new line</div>
              </Card.Footer>
            </Card.Body>
          </Card>

          <div className="text-center">
            <Badge bg={currentConversationId ? "success" : "secondary"} className="me-2">
              {currentConversationId ? "Connected" : "Disconnected"}
            </Badge>
            <Badge bg="info" className="me-2">{messages.length} Messages</Badge>
            <Badge bg="dark">{jwtRole?.toUpperCase()}</Badge>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SupportChat;
