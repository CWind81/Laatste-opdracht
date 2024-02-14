import React, { useEffect, useState } from "react";
import {
  Heading,
  Box,
  Button,
  Text,
  useToast,
  Image,
  Flex,
  Modal,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import EditEventForm from "./EditEventForm";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [createdByUser, setCreatedByUser] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const eventData = await response.json();
        setEvent(eventData);

        const userResponse = await fetch(
          `http://localhost:3000/users/${eventData.createdBy}`
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCreatedByUser(userData);
        } else {
          setCreatedByUser(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (updatedEvent) => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      setEvent(updatedEvent);
      setIsEditing(false);
      setOpenModal(false);
      toast({
        title: "Event updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update event",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const eventData = await response.json();
        setEvent(eventData);

        const userResponse = await fetch(
          `http://localhost:3000/users/${eventData.createdBy}`
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCreatedByUser(userData);
        } else {
          setCreatedByUser(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
    fetchCategories();
  }, [eventId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3000/events/${eventId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete event");
        }

        toast({
          title: "Event deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/events");
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to delete event",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (!event || categories.length === 0) {
    return <p>Loading...</p>;
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === String(categoryId));
    return category ? category.name : "Unknown";
  };

  const formatStartTime = (startTime) => {
    const formattedDateTime = new Date(startTime).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formattedDateTime;
  };

  return (
    <Flex justifyContent="center" bgColor="green.200" maxH="110vh">
      <Box
        maxW="5xl"
        borderWidth="1px"
        minH="100vh"
        borderRadius="md"
        bg="purple.100"
        mb={4}
      >
        <Heading ml={10}>{event.title}</Heading>
        <Image src={event.image} alt={event.title} />
        <Text ml={10}>{event.description}</Text>
        <Box ml={10}>
          <p>Start Time: {formatStartTime(event.startTime)}</p>
          <p>End Time: {formatStartTime(event.endTime)}</p>
          <p>
            Categories:{" "}
            {event.categoryIds
              .map((categoryId) => getCategoryName(categoryId))
              .join(", ")}
          </p>
          <p>
            Created By: {createdByUser ? createdByUser.name : "Unknown User"}
          </p>
          {createdByUser && createdByUser.image && (
            <img width="100px" src={createdByUser.image} alt="User Image" />
          )}
        </Box>
        <Box ml={10} mt={5}>
          {isEditing ? (
            <EditEventForm event={event} onSave={handleSaveEdit} />
          ) : (
            <div>
              <Button onClick={handleEdit}>Edit</Button>
              <Button colorScheme="red" ml={2} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </Box>
        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}></Modal>
      </Box>
    </Flex>
  );
};

export default EventPage;
