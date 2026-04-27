import { useEffect, useState } from 'react';
import { Container, Title as MantineTitle, SimpleGrid, Card, Text, Button, Loader, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { EventType } from '../types';

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getEventTypes()
      .then(setEventTypes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return <Center h="50vh"><Text c="red">Error: {error}</Text></Center>;
  }

  return (
    <Container size="lg">
      <MantineTitle order={2} mb="lg">Available Event Types</MantineTitle>
      {eventTypes.length === 0 ? (
        <Text>No event types available</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {eventTypes.map((et) => (
            <Card key={et.id} withBorder shadow="sm" padding="lg">
              <Text fw={600} size="lg">{et.name}</Text>
              <Text size="sm" c="dimmed" mt={5}>{et.description}</Text>
              <Text size="sm" mt="md">Duration: {et.durationMinutes} minutes</Text>
              <Button mt="md" onClick={() => navigate(`/book/${et.id}`)}>
                Book
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
