export interface EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface EventTypeCreate {
  name: string;
  description: string;
  durationMinutes: number;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  slotStart: number;
  slotEnd: number;
  guestName: string;
  guestEmail: string;
  createdAt: number;
}

export interface GuestBookingRequest {
  eventTypeId: string;
  slotStart: number;
  guestName: string;
  guestEmail: string;
}

export interface Slot {
  start: number;
  end: number;
  available: boolean;
}

export interface Error {
  code: string;
  message: string;
}
