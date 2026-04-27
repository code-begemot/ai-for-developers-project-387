import os
import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Calendar Booking API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORKING_HOURS_START = 9
WORKING_HOURS_END = 18
SLOT_DURATION_MINUTES = 30
BOOKING_WINDOW_DAYS = 14

class EventTypeCreate(BaseModel):
    name: str
    description: str
    durationMinutes: int

class EventType(BaseModel):
    id: str
    name: str
    description: str
    durationMinutes: int

class GuestBookingRequest(BaseModel):
    eventTypeId: str
    slotStart: int
    guestName: str
    guestEmail: EmailStr

class Booking(BaseModel):
    id: str
    eventTypeId: str
    eventTypeName: str
    slotStart: int
    slotEnd: int
    guestName: str
    guestEmail: str
    createdAt: int

class Slot(BaseModel):
    start: int
    end: int
    available: bool

class ErrorResponse(BaseModel):
    code: str
    message: str

event_types_db: dict[str, EventType] = {}
bookings_db: dict[str, Booking] = {}

def generate_slots(event_type_id: str, date: str) -> list[Slot]:
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        return []

    slots = []
    now = datetime.utcnow()

    for hour in range(WORKING_HOURS_START, WORKING_HOURS_END):
        for minute in [0, 30]:
            start_dt = datetime.combine(date_obj, datetime.min.time().replace(hour=hour, minute=minute))
            start_ts = int(start_dt.timestamp() * 1000)
            end_ts = start_ts + SLOT_DURATION_MINUTES * 60 * 1000

            if start_ts < int(now.timestamp() * 1000):
                continue

            is_booked = any(
                b.slotStart == start_ts
                for b in bookings_db.values()
            )

            slots.append(Slot(
                start=start_ts,
                end=end_ts,
                available=not is_booked
            ))

    return slots

@app.get("/event-types", response_model=list[EventType])
def get_event_types():
    return list(event_types_db.values())

@app.get("/slots", response_model=list[Slot])
def get_slots(
    eventTypeId: str = Query(...),
    date: str = Query(...)
):
    if eventTypeId not in event_types_db:
        raise HTTPException(status_code=400, detail="Invalid event type")
    return generate_slots(eventTypeId, date)

@app.post("/bookings", response_model=Booking, status_code=201)
def create_booking(request: GuestBookingRequest):
    if request.eventTypeId not in event_types_db:
        raise HTTPException(status_code=400, detail="Invalid event type")

    event_type = event_types_db[request.eventTypeId]

    slot_duration_ms = event_type.durationMinutes * 60 * 1000
    slot_end = request.slotStart + slot_duration_ms

    for booking in bookings_db.values():
        if booking.slotStart == request.slotStart:
            raise HTTPException(status_code=409, detail="Slot already booked")

    now_ts = int(datetime.utcnow().timestamp() * 1000)
    booking = Booking(
        id=str(uuid.uuid4()),
        eventTypeId=request.eventTypeId,
        eventTypeName=event_type.name,
        slotStart=request.slotStart,
        slotEnd=slot_end,
        guestName=request.guestName,
        guestEmail=request.guestEmail,
        createdAt=now_ts
    )

    bookings_db[booking.id] = booking
    return booking

@app.get("/admin/event-types", response_model=list[EventType])
def get_admin_event_types():
    return list(event_types_db.values())

@app.post("/admin/event-types", response_model=EventType, status_code=201)
def create_event_type(request: EventTypeCreate):
    event_type = EventType(
        id=str(uuid.uuid4()),
        name=request.name,
        description=request.description,
        durationMinutes=request.durationMinutes
    )
    event_types_db[event_type.id] = event_type
    return event_type

@app.delete("/admin/event-types/{id}", status_code=204)
def delete_event_type(id: str):
    if id not in event_types_db:
        raise HTTPException(status_code=404, detail="Event type not found")
    del event_types_db[id]

@app.get("/admin/bookings", response_model=list[Booking])
def get_admin_bookings(
    fromDate: Optional[str] = Query(None),
    toDate: Optional[str] = Query(None)
):
    bookings = list(bookings_db.values())

    if fromDate:
        from_ts = int(datetime.strptime(fromDate, "%Y-%m-%d").timestamp() * 1000)
        bookings = [b for b in bookings if b.slotStart >= from_ts]

    if toDate:
        to_ts = int(datetime.strptime(toDate, "%Y-%m-%d").timestamp() * 1000) + 86400000
        bookings = [b for b in bookings if b.slotStart < to_ts]

    return bookings

dist_path = os.path.join(os.path.dirname(__file__), "dist")
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
