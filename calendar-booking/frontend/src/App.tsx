import { Routes, Route, Link } from 'react-router-dom';
import { AppShell, Group, Button, Title } from '@mantine/core';
import EventTypesPage from './pages/EventTypesPage';
import BookingPage from './pages/BookingPage';
import AdminEventTypesPage from './pages/AdminEventTypesPage';
import AdminBookingsPage from './pages/AdminBookingsPage';

function App() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>Calendar Booking</Title>
          <Group>
            <Button component={Link} to="/" variant="subtle">Guest</Button>
            <Button component={Link} to="/admin/event-types" variant="subtle">Admin</Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<EventTypesPage />} />
          <Route path="/book/:eventTypeId" element={<BookingPage />} />
          <Route path="/admin/event-types" element={<AdminEventTypesPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
