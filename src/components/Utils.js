const convertToEventData = (formData, userId, lastUsedId) => {
  const categoryMap = {
    select: 0,
    sports: 1,
    games: 2,
    relaxation: 3,
  };

 
  const newEventId = lastUsedId + 1;


  return {
    id: newEventId,
    createdBy: userId,
    title: formData.eventName,
    description: formData.description,
    image: formData.imageUrl,
    categoryIds: [categoryMap[formData.category]],
    location: formData.location,
    startTime: new Date(formData.startTime).toISOString(),
    endTime: new Date(formData.endTime).toISOString(),
  };
};

export { convertToEventData };
