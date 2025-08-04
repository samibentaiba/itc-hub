ITC Hub: Authorization System Guide

This document is the definitive guide to the ITC Hub's authorization system. It is divided into two parts:

    Authorization Rules & Definitions: This section defines the roles, permissions, and core concepts that govern user access.

    Code Implementation Guide: This section provides a practical, step-by-step guide on how to enforce these rules within the Next.js backend.

Part 1: Authorization Rules & Definitions

This section outlines the "what" of our permissions system, defining the specific roles and the actions they are permitted to perform.
1.1. Role Definitions

Role
	

General Description

Admin
	

Has complete control over all aspects of the system and exercises all administrative powers via the /admin page.

Department Manager
	

Manages one or more departments, including the teams and members within them.

Department Member
	

A member of a specific department with permissions to create and interact with tickets at the department level.

Team Manager
	

Manages one or more teams within a department, focusing on managing team members and their assigned tickets.

Team Member
	

A member of a specific team whose primary task is to work on assigned tickets. They cannot create tickets.
1.2. Permissions Matrix

This matrix details the specific actions each role can perform.

Feature / Action
	

Admin
	

Department Manager
	

Department Member
	

Team Manager
	

Team Member

User Management (Create/Edit/Delete)
	

✅
	

❌
	

❌
	

❌
	

❌

Department Management (Create/Edit/Delete)
	

✅
	

❌
	

❌
	

❌
	

❌

Team Management (Create/Edit/Delete)
	

✅
	

✅
	

❌
	

❌
	

❌

Manage Department Members
	

✅
	

✅
	

❌
	

❌
	

❌

Manage Team Members
	

✅
	

✅
	

❌
	

✅
	

❌

Create Tickets
	

✅
	

✅
	

✅
	

✅
	

❌

View Tickets
	

✅
	

✅
	

✅
	

✅
	

✅

Create Global Events
	

✅
	

❌
	

❌
	

❌
	

❌
1.3. Key Permission Concepts

    Viewing Scope ("Department/Team Tickets"): This refers to a user's ability to see lists of tickets (e.g., on the main /tickets page). A user can view all tickets associated with their department or team, providing broad visibility.

    Modification Scope ("Own/Managed Tickets"): This refers to a user's ability to perform actions like editing, deleting, or changing a ticket's status.

        Standard Users: Can only modify tickets they created or are directly assigned to.

        Managers (Department/Team): Can modify any ticket within their respective department or team.

        Admins: Can modify any ticket in the system.

Part 2: Code Implementation Guide

This section outlines the "how" of our permissions system. We will use a two-layer approach: broad page-level protection with Middleware and fine-grained, resource-specific control in API Route Handlers.
Step 1: Enhance the User Session

The foundation of our authorization system is having the user's roles and memberships readily available in the session object.

Action: Update src/lib/auth.ts to include this data in the jwt and session callbacks. You will need a database function like getUserByIdWithMemberships to fetch this data.

// src/lib/auth.ts (Example Snippet)

import { getUserByIdWithMemberships } from "@/data/user"; // Assumes this function exists

// ... inside NextAuth configuration
callbacks: {
  async jwt({ token }) {
    if (!token.sub) return token;

    const existingUser = await getUserByIdWithMemberships(token.sub);
    if (!existingUser) return token;

    // Add custom properties to the token
    token.isAdmin = existingUser.is_admin;
    token.departmentMemberships = existingUser.department_memberships;
    token.teamMemberships = existingUser.team_memberships;

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      // Pass the custom properties from the token to the session
      session.user.id = token.sub;
      session.user.isAdmin = token.isAdmin as boolean;
      session.user.departmentMemberships = token.departmentMemberships as any[];
      session.user.teamMemberships = token.teamMemberships as any[];
    }
    return session;
  },
},
// ... rest of the configuration

Step 2: Create Centralized Permission Helpers

To avoid repetitive logic and keep our API routes clean, we will centralize permission-checking logic into reusable helper functions.

Action: Create a new file at src/lib/permissions.ts.

// src/lib/permissions.ts

import { type User } from "next-auth";
import { type Ticket } from "@prisma/client";

// Define a user type that includes our custom session properties for type safety
export type UserWithRoles = User & {
  isAdmin: boolean;
  departmentMemberships: { departmentId: string; role: "MANAGER" | "MEMBER" }[];
  teamMemberships: { teamId: string; role: "MANAGER" | "MEMBER" }[];
};

/**
 * Checks if a user has the ADMIN role.
 */
export const isAdmin = (user: UserWithRoles) => {
  return user.isAdmin;
};

/**
 * Checks if a user is a manager of a specific department.
 */
export const isDepartmentManager = (user: UserWithRoles, departmentId: string) => {
  return user.departmentMemberships.some(
    (mem) => mem.departmentId === departmentId && mem.role === "MANAGER"
  );
};

/**
 * Checks if a user can modify a specific ticket based on ownership or management roles.
 */
export const canModifyTicket = (user: UserWithRoles, ticket: Ticket) => {
  // 1. Admins can do anything
  if (isAdmin(user)) return true;

  // 2. The ticket creator or assignee can modify it
  if (ticket.creator_id === user.id || ticket.assignee_id === user.id) {
    return true;
  }

  // 3. A manager of the ticket's assigned department can modify it
  const isTicketDeptManager = user.departmentMemberships.some(
    (mem) =>
      mem.departmentId === ticket.assignee_entity_id &&
      mem.role === "MANAGER"
  );
  if (ticket.assignee_entity === "DEPARTMENT" && isTicketDeptManager) {
    return true;
  }

  // 4. A manager of the ticket's assigned team can modify it
  const isTicketTeamManager = user.teamMemberships.some(
    (mem) =>
      mem.teamId === ticket.assignee_entity_id && mem.role === "MANAGER"
  );
  if (ticket.assignee_entity === "TEAM" && isTicketTeamManager) {
    return true;
  }

  // 5. If no rules match, deny permission
  return false;
};

Step 3: Secure API Routes Using Helpers

Finally, use these simple helper functions inside your API routes to protect your endpoints from unauthorized access.

Action: Implement checks in your API route handlers.

// src/app/api/tickets/[ticketId]/route.ts (Example)

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { canModifyTicket, type UserWithRoles } from "@/lib/permissions";

export async function PUT(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await auth();

    // 1. Authentication Check: Ensure the user is logged in.
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = session.user as UserWithRoles; // Cast user to our custom type

    // 2. Resource Check: Ensure the ticket exists.
    const ticket = await db.ticket.findUnique({
      where: { id: params.ticketId },
    });

    if (!ticket) {
      return new NextResponse("Ticket not found", { status: 404 });
    }

    // 3. Authorization Check: Use our helper to verify permission.
    if (!canModifyTicket(user, ticket)) {
      return new NextResponse("Forbidden: You do not have permission.", { status: 403 });
    }

    // 4. Proceed with Logic: If all checks pass, update the ticket.
    const body = await req.json();
    const updatedTicket = await db.ticket.update({
      where: { id: params.ticketId },
      data: { ...body },
    });

    return NextResponse.json(updatedTicket);

  } catch (error) {
    console.error("[TICKET_ID_PUT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

