import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddEventForm2 from "./AddEventForm2";
import {
  Flex,
  Text,
  Input,
  Button,
  Tag,
  Box,
  Card,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsResponse = await fetch("http://localhost:3000/events");
        const usersResponse = await fetch("http://localhost:3000/users");
        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        if (!eventsResponse.ok || !usersResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to load events");
        }

        const eventsData = await eventsResponse.json();
        const usersData = await usersResponse.json();
        const categoriesData = await categoriesResponse.json();

        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
        console.log("Failed to find event.");
      }
    };

    fetchEvents();

    const intervalId = setInterval(fetchEvents, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filterCategory]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, events]);

  const handleSearch = () => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || !Array.isArray(categoryIds)) {
      return [];
    }

    const categoryIdMap = Object.fromEntries(
      categories.map((cat) => [cat.id, cat.name])
    );
    return categoryIds.map(
      (categoryId) => categoryIdMap[categoryId] || "Unknown"
    );
  };

  const handleFilter = () => {
    if (filterCategory) {
      const filtered = events.filter((event) =>
        getCategoryNames(event.categoryIds).includes(filterCategory)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  };

  const handleAddEvent = (eventData) => {
    console.log("Event added:", eventData);
  };

  const handleSelectEvent = (selectedEvent) => {
    console.log("Selected Event:", selectedEvent);
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === String(userId));
    return user ? user.name : "Unknown";
  };

  return (
    <Flex flexDir="column" align="center" justify="center" p={8} bgColor="cyan">
      <Text fontSize={40} fontWeight="bold">
        Events Page
      </Text>
      <Flex mb={4}>
        <Box mr={2}>
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="sports">Sports</option>
            <option value="games">Games</option>
            <option value="relaxation">Relaxation</option>
          </select>
        </Box>
        <Flex flexDir="column" align="center" justify="center" p={9}>
          <Button bgColor="green">
            <AddEventForm2 handleAddEvent={handleAddEvent} />
          </Button>
        </Flex>
      </Flex>

      <Flex wrap="wrap">
        <SimpleGrid columns={{ base: 1 }}>
          {filteredEvents &&
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={handleSelectEvent}
                categories={categories}
                getCategoryNames={getCategoryNames}
                createdByUserName={getUserName(event.createdBy)}
              />
            ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export const EventCard = ({
  event,
  onSelect,
  categories,
  getCategoryNames,
  createdByUserName,
}) => {
  if (!event || !categories || !categories.length) {
    return null;
  }

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

  const categoryNames = getCategoryNames(event.categoryIds);

  return (
    <Card
      maxW="2xl"
      borderRadius="md"
      cursor="pointer"
      onClick={() => onSelect(event)}
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.05)" }}
      bg="purple.100"
      mb={4}
    >
      <Flex>
        <Image
          src={event.image}
          alt={event.title}
          height="full"
          objectFit="cover"
          width="50%"
        />
        <Box p={4}>
          <Text fontSize="lg" fontWeight="bold">
            {event.title}
          </Text>
          <Text>Starting Date: {formatStartTime(event.startTime)}</Text>
          <Text>End Date: {formatStartTime(event.endTime)}</Text>
          <Text>Created By: {createdByUserName}</Text>
          <Flex gap={1} alignItems="center">
            {categoryNames.map((categoryName, index) => (
              <Box key={index}>
                <Tag size="md" bgColor="blue" color="white">
                  {categoryName}
                </Tag>
              </Box>
            ))}
          </Flex>
          <Text>Venue: {event.location}</Text>
          <Link to={`/event/${event.id}`}>
            <Text color="blue.500" textDecoration="underline">
              View Details
            </Text>
          </Link>
        </Box>
      </Flex>
    </Card>
  );
};

export default EventsPage;
