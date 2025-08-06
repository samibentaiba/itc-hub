// Importing the necessary types and data for the detail page
import { type Ticket, type Message } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching a single ticket by its ID from an API.
 * @param ticketId The ID of the ticket to fetch.
 * @returns A promise that resolves to a single Ticket object, or null if not found.
 */
export const fetchTicketById = async (ticketId: string): Promise<Ticket | null> => {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // The mock data for details stores tickets as a Record (object), where keys are ticket IDs.
    const ticketsRecord = data.tickets as Record<string, Ticket>;
    const ticket = ticketsRecord[ticketId] || null;
    
    return ticket;
}

/**
 * Simulates fetching chat messages for a specific ticket ID from an API.
 * @param ticketId The ID of the ticket for which to fetch messages.
 * @returns A promise that resolves to an array of Message objects.
 */
export const fetchMessagesByTicketId = async (ticketId: string): Promise<Message[]> => {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // The mock data for details stores messages as a Record (object), where keys are ticket IDs.
    const messagesRecord = data.messages as Record<string, Message[]>;
    const messages = messagesRecord[ticketId] || [];

    return messages;
}
