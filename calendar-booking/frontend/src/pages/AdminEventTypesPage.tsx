import { useEffect, useState } from 'react';
import { Container, Title as MantineTitle, Text, Button, Table, Loader, Center, Modal, TextInput, NumberInput, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { api } from '../api/client';
import type { EventType, EventTypeCreate } from '../types';

export default function AdminEventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  
  const [form, setForm] = useState<EventTypeCreate>({ name: '', description: '', durationMinutes: 30 });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    api.getAdminEventTypes()
      .then(setEventTypes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await api.createEventType(form);
      close();
      setForm({ name: '', description: '', durationMinutes: 30 });
      loadData();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event type?')) return;
    try {
      await api.deleteEventType(id);
      loadData();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="lg">
      <MantineTitle order={2} mb="lg">Event Types (Admin)</MantineTitle>
      
      <Button mb="md" onClick={open}>Add Event Type</Button>
      
      {error && <Text c="red" mb="md">{error}</Text>}
      
      {eventTypes.length === 0 ? (
        <Text>No event types</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Duration (min)</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {eventTypes.map((et) => (
              <Table.Tr key={et.id}>
                <Table.Td>{et.name}</Table.Td>
                <Table.Td>{et.description}</Table.Td>
                <Table.Td>{et.durationMinutes}</Table.Td>
                <Table.Td>
                  <Button size="xs" color="red" variant="light" onClick={() => handleDelete(et.id)}>
                    Delete
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={close} title="Add Event Type">
        <Stack>
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextInput
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <NumberInput
            label="Duration (minutes)"
            value={form.durationMinutes}
            onChange={(v) => setForm({ ...form, durationMinutes: Number(v) })}
            min={5}
            required
          />
          <Button onClick={handleCreate} loading={submitting}>Create</Button>
        </Stack>
      </Modal>
    </Container>
  );
}
