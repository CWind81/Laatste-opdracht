import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";

const EditEventForm = ({ event, onSave }) => {
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [selectedUser, setSelectedUser] = useState(event.createdBy);
  const [category, setCategory] = useState(event.category);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [imageUrl, setImageUrl] = useState(event.imageUrl);
  const [users, setUsers] = useState([]);

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

  const handleSave = async () => {
    try {
      const editedEvent = {
        ...event,
        startTime,
        endTime,
        createdBy: parseInt(selectedUser),
        category,
        description,
        location,
        imageUrl,
      };

      onSave(editedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => null}>
      <ModalOverlay />
      <ModalContent>
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
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" style={{ width: "100%" }} pb={5}>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Start Time:
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                End Time:
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
              <label style={{ width: "100%", marginBottom: "10px" }}>
                Creator:
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
                  <option value="">Select category</option>
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
              <Button colorScheme="blue" onClick={handleSave}>
                Save
              </Button>
            </Flex>
          </ModalBody>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default EditEventForm;
