/**
 * @file page.test.tsx
 * @description Tests for /admin/page.tsx server component.
 */

import { render } from "@testing-library/react";
import AdminClientPage from "../client";
import AdminPage from "../page";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth-helpers";

// 🧩 Mock dependencies
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
  isAdmin: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn(() => "cookie=value;"),
  }),
}));

jest.mock("../client");

// 🧩 Utility: mock fetch responses for all API calls
function createMockResponse<T>(data: T, ok = true): Response {
  return {
    ok,
    json: () => Promise.resolve(data),
  } as Response;
}

describe("AdminPage (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  });

  it("should redirect non-admin users", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      user: { id: "123", name: "John Doe" },
    });
    (isAdmin as jest.Mock).mockResolvedValue(false);

    global.fetch = jest.fn().mockResolvedValue(createMockResponse<Record<string, never>>({}));

    await AdminPage();

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("should render AdminClientPage for admin users with transformed props", async () => {
    (AdminClientPage as jest.Mock).mockImplementation(() => (
      <div data-testid="admin-client-page" />
    ));
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      user: { id: "1", name: "Admin" },
    });
    (isAdmin as jest.Mock).mockResolvedValue(true);

    // Mock all fetch calls for users, teams, departments, events, pendingEvents
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        createMockResponse({
          users: [
            { id: "1", name: "John", email: "john@example.com", role: "ADMIN" },
          ],
        })
      )
      .mockResolvedValueOnce(
        createMockResponse({
          teams: [
            {
              id: "10",
              name: "Team X",
              leaders: [],
              members: [],
              departmentId: "20",
              status: "active",
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        createMockResponse({
          departments: [
            { id: "20", name: "Dept A", managers: [], members: [], teams: [] },
          ],
        })
      )
      .mockResolvedValueOnce(
        createMockResponse({
          events: [
            {
              id: "30",
              title: "Event A",
              date: "2025-10-08T10:00:00Z",
              attendees: [],
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        createMockResponse({
          events: [
            {
              id: "40",
              title: "Pending Event",
              date: "2025-10-09T12:00:00Z",
              organizer: { name: "Alice" },
            },
          ],
        })
      );

    const Page = await AdminPage();
    render(Page);

    // ✅ Verify that redirect was NOT called
    expect(redirect).not.toHaveBeenCalled();

    // ✅ Verify AdminClientPage was called once
    expect(AdminClientPage).toHaveBeenCalledTimes(1);

    // ✅ Extract the props that were passed to AdminClientPage
    const props = (AdminClientPage as jest.Mock).mock.calls[0][0];

    // Check that transformations happened
    expect(props.initialUsers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "1",
          name: "John",
          email: "john@example.com",
          role: "admin",
        }),
      ])
    );

    expect(props.initialTeams[0]).toHaveProperty("id", "10");
    expect(props.initialDepartments[0]).toHaveProperty("id", "20");
    expect(props.initialEvents[0]).toHaveProperty("id", "30");
    expect(props.initialPendingEvents[0]).toHaveProperty("id", "40");

    // ✅ Ensure component rendered logically
    render(<div>{(AdminClientPage as jest.Mock)(props)}</div>);
  });
});
