// Shared types between the web app and the mobile app.
// Mirrors the shapes returned by the backend API (see backend/prisma/schema.prisma).

export type EventType = "TRAIN" | "CONCERT" | "SPORT" | "THEATRE" | "OTHER";
export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";
export type TicketStatus = "VALID" | "USED" | "CANCELLED";
export type Role = "BUYER" | "ORGANIZER" | "ADMIN";

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  quota: number;
  sold: number;
  seated: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description?: string | null;
  type: EventType;
  imageUrl?: string | null;
  venue?: string | null;
  departureStation?: string | null;
  arrivalStation?: string | null;
  startDateTime: string;
  endDateTime?: string | null;
  status: EventStatus;
  ticketTypes: TicketType[];
  organization?: { name: string; logoUrl?: string | null };
}

export interface Ticket {
  id: string;
  orderId: string;
  eventId: string;
  ticketTypeId: string;
  ownerId: string;
  qrToken: string;
  qrDataUrl?: string;
  seatInfo?: string | null;
  status: TicketStatus;
  checkedInAt?: string | null;
  event?: EventItem;
  ticketType?: TicketType;
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  totalAmount: number;
  currency: string;
  tickets?: Ticket[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
