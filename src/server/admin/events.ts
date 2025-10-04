// src/server/admin/events.ts
import { prisma } from "@/lib/prisma";
import { eventFormSchema } from "@/app/(protected)/admin/types";
import { z } from "zod";
import { EventStatus, EventType } from "@prisma/client";

/**
 * Parses form data and combines date and time into a single DateTime object.
 * @param data The event form data.
 * @returns A full DateTime object for the event's start.
 */
function combineDateTime(date: string, time: string | undefined): Date {
  const timeString = time || "00:00:00";
  return new Date(`${date}T${timeString}`);
}

/**
 * Retrieves a list of events, optionally filtering by status.
 */
export async function listEvents(status?: EventStatus) {
  const whereClause = status ? { status } : {};
  const events = await prisma.event.findMany({
    where: whereClause,
    include: {
      organizer: {
        select: { id: true, name: true, avatar: true },
      },
      attendees: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  return events;
}

/**
 * Creates a new event.
 * Admin-created events are automatically confirmed.
 */
export async function createEvent(data: z.infer<typeof eventFormSchema>) {
  const validatedData = eventFormSchema.parse(data);

  const eventDate = combineDateTime(validatedData.date, validatedData.time);

  return await prisma.event.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      date: eventDate,
      time: validatedData.time, // Keep the time string for display
      duration: parseInt(validatedData.duration, 10),
      type: validatedData.type.toUpperCase() as EventType, // Map from form to schema enum
      location: validatedData.location,
      status: "CONFIRMED", // Admin-created events are auto-confirmed
    },
  });
}

/**
 * Updates an existing event.
 */
export async function updateEvent(
  eventId: string,
  data: z.infer<typeof eventFormSchema>
) {
  const validatedData = eventFormSchema.parse(data);
  const eventDate = combineDateTime(validatedData.date, validatedData.time);

  return await prisma.event.update({
    where: { id: eventId },
    data: {
      title: validatedData.title,
      description: validatedData.description,
      date: eventDate,
      time: validatedData.time,
      duration: parseInt(validatedData.duration, 10),
      type: validatedData.type.toUpperCase() as EventType,
      location: validatedData.location,
    },
  });
}

/**
 * Deletes an event.
 */
export async function deleteEvent(eventId: string) {
  return await prisma.event.delete({ where: { id: eventId } });
}

/**
 * Approves a pending event request by changing its status to CONFIRMED.
 */
export async function approveEvent(eventId: string) {
  return await prisma.event.update({
    where: { id: eventId },
    data: { status: "CONFIRMED" },
  });
}

/**
 * Rejects a pending event request by deleting it.
 */
export async function rejectEvent(eventId: string) {
  return await prisma.event.delete({
    where: { id: eventId, status: "PENDING" },
  });
}
