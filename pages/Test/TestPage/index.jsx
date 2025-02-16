import { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { 
  AddChat, 
  AddMessage, 
  fetchExpiredNotifications, 
  ResetAlertSound 
} from "@/slices/ChatTest";



export default function App() {
  const dispatch = useDispatch();
  const items = [];
  const playAlertSound = useSelector((state) => state.chatTest.playAlertSound);
  const MessageType = useSelector((state) => state.chatTest.MessageType);
  const LoadedMessages = useSelector((state) => state.chatTest.LoadedMessages);

  //Objects for conversation and Messages
  const [ID,setID] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [MessageTypeId, setMessageTypeId] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [MessageContent, setMessageContent] = useState({});
  const [fullName, setFullName] = useState("");
  const [phoneToLoad, setPhoneToLoad] = useState("");


//Constants for alert sounds
  const audioRef = useRef(null);

  
  //calling slice method every 10 secods to check expiry notification
  useEffect( () => {
    const interval = setInterval(async() => {
      debugger;
      const expiredNotifications = await dispatch(fetchExpiredNotifications());

      expiredNotifications.expiredNotificationRef?.forEach((expiredItem) => {

      let soundToPlay = null;
      if (expiredItem.expirytype === 1) {
        soundToPlay = new Audio("/assets/Notification/newchatreceived.mp3");
      } else if (expiredItem.expirytype === 1) {
        soundToPlay = new Audio("/assets/Notification/chatassigned.mp3");
      } 
      else if (expiredItem.expireTryCount > 2) {
        soundToPlay = new Audio("/assets/Notification/Emergency.mp3");
      }
      // Play the selected sound and show the alert
      if (soundToPlay) {
        soundToPlay.play().catch((error) => {
          console.error("Audio playback failed: ", error);
        });
      }
      if (expiredItem.expirytype === 1)
      toast.error(
        `Reply pending for : ${expiredItem.phoneNumber} for more than ${expiredItem.expireTryCount * 5} mins`
      );
      if (expiredItem.expirytype === 2)
        toast.error(
          `First Reponse pending for : ${expiredItem.phoneNumber} for more than ${expiredItem.expireTryCount * 5} mins`
        );
  
    });

      //dispatch(CheckExpiredNotification(audioRef));
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval); 
  }, [dispatch]); 



  



  // Function to add a customer with phoneNumber as unique ID
  const handleAddCustomer = () => {
    dispatch(
      AddChat({ 
        phoneNumber, 
        fullName, 
        brandName,
        id: ID, 
        forceUpdate: true,
        agentId:localStorage.getItem("userId")
      })
    );
    setPhoneNumber("");
    setFullName("");
    setBrandName("");
    setID(null);
  };


  // Load messages for the entered phone number
  const handleLoadMessages = () => {
    if (phoneToLoad && phoneToLoad.trim() !== "") {
      dispatch(
        AddMessage({
          phoneNumber: phoneToLoad.trim(),
          forceUpdate: true
        })
      );
    } else {
      alert("Please enter a valid phone number.");
    }
  };
  
  
  // Function to add a message to a customer
  const handleAddMessage = (phone) => {
    if (MessageContent[phone]?.trim()) {
      dispatch(
        AddMessage({
          phoneNumber: phone,
          messageContent: MessageContent[phone],
          messageTypeId: MessageTypeId,
          id: ID,
          forceUpdate: true
        })
      );
      setMessageContent({ ...MessageContent, [phone]: "" });
    }
  };
  

  const deleteItem = () => {
    const phoneToDelete = prompt("Enter the Phone Number of the customer you want to delete:");
    if (phoneToDelete) {
      dispatch(deleteCustomer(phoneToDelete.trim()));
    }
  };

  return (
    <Container fluid className="p-5">
      <Row>
        <Col md={3}>
          <div className="mt-4 p-2 bg-gray-100 border rounded">
            <strong>Current Array:</strong>
            <pre className="text-sm bg-white p-2 rounded">
              {JSON.stringify(items, null, 2)}
            </pre>
          </div>
        </Col>

        <Col md={3}>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Enter Full Name..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Enter Phone Number..."
            value={phoneNumber || ""}
            onChange={(e) => setPhoneNumber(e.target.value || "")}
          />
          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Enter ID..."
            value={ID || ""}
            onChange={(e) => setID(e.target.value || "")}
          />
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Enter Brand Name..."
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded mt-2"
            onClick={handleAddCustomer}
          >
            Add Customer
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded mt-4"
            onClick={deleteItem}
          >
            Delete Customer
          </button>
        </Col>

        <Col md={3}>
          <ul className="mt-4">
            {items.map((customer) => (
              <li key={customer.phoneNumber} className="p-4 border-b">
                <div>
                  📞 <strong>{customer.phoneNumber}</strong> | 🏢{" "}
                  {customer.brandName}
                </div>
                <div className="mt-2 flex gap-2">
                  <input type="text"
                  className="border p-2 w-full rounded text-sm"
                  placeholder="Enter ID..."
                  value={ID}
                  onChange={(e) => setID(e.target.value)}
                   />
                  <input
                    type="text"
                    className="border p-2 w-full rounded text-sm"
                    placeholder="Enter Message..."
                    value={MessageContent[customer.phoneNumber] || ""}
                    onChange={(e) =>
                      setMessageContent({
                        ...MessageContent,
                        [customer.phoneNumber]: e.target.value,
                      })
                    }
                  />
                  <select
                    className="border p-1 rounded text-sm"
                    value={MessageTypeId}  // <-- Use local state here
                    onChange={(e) => setMessageTypeId(parseInt(e.target.value))} // Ensure it's a number
                  >
                    <option value={0}>Select</option>
                    <option value={1}>Agent</option>
                    <option value={2}>Customer</option>
                  </select>

                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleAddMessage(customer.phoneNumber)}
                  >
                    Send
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Col>

        <Col md={3}>
          <h4 className="mt-4">Load Messages:</h4>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Enter Phone Number..."
            value={phoneToLoad}
            onChange={(e) => setPhoneToLoad(e.target.value)}
          />
         
          <button
            className="bg-purple-500 text-white p-2 rounded mt-2"
            onClick={handleLoadMessages}
          >
            Load Messages
          </button>
          <h4 className="mt-4">Loaded Messages:</h4>
          {LoadedMessages.length > 0 ? (
            <ul className="list-disc ml-4">
              {LoadedMessages.map((msg, index) => (
                <li key={index} className="text-sm">
                  {msg.messageContent} <span className="text-gray-500">({msg.createdDate})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No messages available.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

