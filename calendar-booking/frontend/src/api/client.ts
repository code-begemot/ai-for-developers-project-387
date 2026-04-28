import axios from 'axios';
import type { EventType, EventTypeCreate, Booking, GuestBookingRequest, Slot } from '../types';

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const api = {
  // Public endpoints
  getEventTypes: () => client.get<EventType[]>('/event-types').then(r => r.data),
  
  getSlots: (eventTypeId: string, date: string) => 
    client.get<Slot[]>('/slots', { params: { eventTypeId, date } }).then(r => r.data),
  
  createBooking: (data: GuestBookingRequest) => 
    client.post<Booking>('/bookings', data).then(r => r.data),

  // Admin endpoints
  getAdminEventTypes: () => client.get<EventType[]>('/admin/event-types').then(r => r.data),
  
  createEventType: (data: EventTypeCreate) => 
    client.post<EventType>('/admin/event-types', data).then(r => r.data),
  
  deleteEventType: (id: string) => 
    client.delete(`/admin/event-types/${id}`),
  
  getAdminBookings: (fromDate?: string, toDate?: string) => 
    client.get<Booking[]>('/admin/bookings', { params: { fromDate, toDate } }).then(r => r.data),
};
