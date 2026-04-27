import { useEffect, useState } from 'react';
import { Container, Title as MantineTitle, Text, Table, Loader, Center, TextInput, Group, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Booking } from '../types';
import dayjs from 'dayjs';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    api.getAdminBookings(fromDate || undefined, toDate || undefined)
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [fromDate, toDate]);

  if (loading) {
    return (
      <Center h="50vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="lg">
      <Group mb="md" justify="space-between">
        <MantineTitle order={2}>Bookings (Admin)</MantineTitle>
        <Button variant="subtle" onClick={() => navigate('/admin/event-types')}>
          ← Event Types
        </Button>
      </Group>
      
      <Group mb="md">
        <TextInput
          type="date"
          label="From"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ width: 150 }}
        />
        <TextInput
          type="date"
          label="To"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ width: 150 }}
        />
      </Group>
      
      {error && <Text c="red" mb="md">{error}</Text>}
      
      {bookings.length === 0 ? (
        <Text>No bookings</Text>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Event Type</Table.Th>
              <Table.Th>Guest</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Date/Time</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bookings.map((b) => (
              <Table.Tr key={b.id}>
                <Table.Td>{b.id.slice(0, 8)}...</Table.Td>
                <Table.Td>{b.eventTypeName}</Table.Td>
                <Table.Td>{b.guestName}</Table.Td>
                <Table.Td>{b.guestEmail}</Table.Td>
                <Table.Td>
                  {dayjs(b.slotStart).format('YYYY-MM-DD HH:mm')}
                </Table.Td>
                <Table.Td>
                  {dayjs(b.createdAt).format('YYYY-MM-DD HH:mm')}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
