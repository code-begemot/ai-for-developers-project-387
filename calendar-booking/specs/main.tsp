import "@typespec/http";
import "@typespec/openapi";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@doc("API for calendar booking system with admin and guest access")
@service(#{
  title: "Calendar Booking API"
})
@OpenAPI.info(#{
  version: "1.0.0"
})
@server("http://localhost:8000", "Local development server")
namespace CalendarBooking;

model EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

model EventTypeCreate {
  name: string;
  description: string;
  durationMinutes: int32;
}

model Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  slotStart: int64;
  slotEnd: int64;
  guestName: string;
  guestEmail: string;
  createdAt: int64;
}

model GuestBookingRequest {
  eventTypeId: string;
  slotStart: int64;
  guestName: string;
  guestEmail: string;
}

model Slot {
  start: int64;
  end: int64;
  available: boolean;
}

model Error {
  code: string;
  message: string;
}

@route("/event-types")
namespace EventTypes {
  @get
  op getEventTypes(): EventType[];
}

@route("/slots")
namespace Slots {
  @get
  op getSlots(
    @query eventTypeId: string,
    @query date: string
  ): Slot[] | Error;
}

@route("/bookings")
namespace Bookings {
  @post
  op createBooking(
    @body request: GuestBookingRequest
  ): Booking | Error;
}

@route("/admin/event-types")
namespace AdminEventTypes {
  @get
  op getEventTypes(): EventType[];

  @post
  op createEventType(
    @body request: EventTypeCreate
  ): EventType | Error;

  @route("/{id}")
  @delete
  op deleteEventType(
    @path id: string
  ): void | Error;
}

@route("/admin/bookings")
namespace AdminBookings {
  @get
  op getBookings(
    @query fromDate?: string,
    @query toDate?: string
  ): Booking[];
}
