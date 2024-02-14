import { useEffect, useState } from "react";
import { Button, Flex, Heading, useToast } from "@chakra-ui/react";
import { convertToEventData } from "../components/Utils";

const AddEventForm2 = ({ handleAddEvent }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lastUsedId, setLastUsedId] = useState(() => {
    const storedLastUsedId = localStorage.getItem("lastUsedId");
    return storedLastUsedId ? parseInt(storedLastUsedId, 10) : 5;
  });

  useEffect(() => {
    localStorage.setItem("lastUsedId", lastUsedId.toString());
    console.log("Last used ID stored in localStorage:", lastUsedId);
  }, [lastUsedId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const adjustedStartTime = new Date(startTime);
  adjustedStartTime.setHours(adjustedStartTime.getHours() + 1);

  const adjustedEndTime = new Date(endTime);
  adjustedEndTime.setHours(adjustedEndTime.getHours() + 1);

  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const eventData = convertToEventData(
      {
        eventName,
        users,
        startTime: adjustedStartTime.toISOString(),
        endTime: adjustedEndTime.toISOString(),
        category,
        description,
        location,
        imageUrl,
      },
      parseInt(selectedUser),
      setLastUsedId
    );

    eventData.id = lastUsedId.toString();

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        setLastUsedId(lastUsedId + 1);
        localStorage.setItem("lastUsedId", (lastUsedId + 1).toString());
        closePopup();

        toast({
          title: "Event Created",
          description: "Your event has been created successfully!",
          status: "success",
          duration: 5000, // Duration in milliseconds
          isClosable: true,
        });
      } else {
        // Handle error
        console.error("Failed to create event:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }

    handleAddEvent(eventData);
    closePopup();
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <button onClick={openPopup}>Add Event</button>

      {showPopup && (
        <Flex
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="green.200"
          p={14}
          boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
          zIndex="9999"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading fontSize="2xl">Add Event</Heading>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Flex flexDir="column" style={{ width: "100%" }} pb={5}>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Event Name:
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Start time:
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                End time:
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Creater:
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Category:
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="select">Select catergorie</option>
                  <option value="sports">Sports</option>
                  <option value="games">Games</option>
                  <option value="relaxation">Relaxation</option>
                </select>
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    height: "100px",
                    padding: "0",
                    lineHeight: "1",
                    verticalAlign: "top",
                  }}
                />
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Location:
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Image Url:
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </label>
            </Flex>
            <Flex justify="center" mb={4}>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </Flex>
          </form>
          <Button colorScheme="red" onClick={closePopup}>
            Close
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default AddEventForm2;
