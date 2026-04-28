import { useEffect, useState } from 'react';
import { Container, Title as MantineTitle, Text, Button, SimpleGrid, Paper, Loader, Center, TextInput, Stack } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { EventType, Slot, GuestBookingRequest } from '../types';
import dayjs from 'dayjs';

export default function BookingPage() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>();
  const navigate = useNavigate();
  
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(true);
  
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventTypeId) return;
    api.getEventTypes()
      .then((types) => {
        const found = types.find(t => t.id === eventTypeId);
        setEventType(found || null);
      })
      .catch(() => {});
  }, [eventTypeId]);

  useEffect(() => {
    if (!eventTypeId) return;
    setLoading(true);
    api.getSlots(eventTypeId, date)
      .then(setSlots)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventTypeId, date]);

  const handleBook = async () => {
    if (!selectedSlot || !guestName || !guestEmail || !eventTypeId) return;
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      const request: GuestBookingRequest = {
        eventTypeId,
        slotStart: selectedSlot,
        guestName,
        guestEmail,
      };
      await api.createBooking(request);
      alert('Booking created successfully!');
      navigate('/');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setBookingError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!eventTypeId) {
    return <Text>Invalid event type</Text>;
  }

  return (
    <Container size="lg">
      <Button variant="subtle" mb="md" onClick={() => navigate('/')}>
        ← Back
      </Button>
      
      {eventType && (
        <>
          <MantineTitle order={2}>{eventType.name}</MantineTitle>
          <Text c="dimmed" mb="lg">{eventType.description}</Text>
        </>
      )}

      <Text fw={500} mb="sm">Select Date</Text>
      <TextInput
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        mb="xl"
        style={{ maxWidth: 200 }}
      />

      <Text fw={500} mb="sm">Available Slots</Text>
      {loading ? (
        <Center><Loader /></Center>
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} mb="xl">
          {slots.map((slot) => (
            <Paper
              key={slot.start}
              p="sm"
              withBorder
              style={{
                cursor: slot.available ? 'pointer' : 'not-allowed',
                backgroundColor: selectedSlot === slot.start ? '#e3f2fd' : undefined,
                opacity: slot.available ? 1 : 0.5,
              }}
              onClick={() => slot.available && setSelectedSlot(slot.start)}
            >
              <Text size="sm" fw={500}>
                {dayjs(slot.start).format('HH:mm')} - {dayjs(slot.end).format('HH:mm')}
              </Text>
              <Text size="xs" c={slot.available ? 'green' : 'red'}>
                {slot.available ? 'Available' : 'Booked'}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      )}

      {selectedSlot && (
        <Paper p="md" withBorder mb="xl">
          <Text fw={500} mb="md">Your Details</Text>
          <Stack>
            <TextInput
              label="Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
            <TextInput
              label="Email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
            />
            {bookingError && <Text c="red">{bookingError}</Text>}
            <Button onClick={handleBook} loading={bookingLoading} disabled={!guestName || !guestEmail}>
              Confirm Booking
            </Button>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
