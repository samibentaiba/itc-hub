import { render } from "@testing-library/react";
import { redirect } from "next/navigation";
import AdminPage from "../page";
import AdminClientPage from "../client";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth-helpers";

// Mock dependencies
jest.mock("next/navigation");
jest.mock("../client", () => jest.fn(() => <div>AdminClientPage</div>));
jest.mock("@/lib/auth-helpers");

describe("AdminPage", () => {
  const mockUser = { user: { id: "admin-id" } };

  beforeEach(() => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
    global.fetch = jest.fn();
  });

  it("should redirect to the home page if the user is not an admin", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(false);
    await AdminPage();
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("should render the AdminClientPage with fetched data if the user is an admin", async () => {
    (isAdmin as jest.Mock).mockResolvedValue(true);
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ users: [{ id: 1, name: "Sami" }] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ teams: [{ id: 1, name: "Team A" }] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ departments: [{ id: 1, name: "Tech" }] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ events: [{ id: 1, title: "Meeting" }] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ events: [{ id: 1, title: "Pending" }] }) });

    render(await AdminPage());

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/users"));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/teams"));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/departments"));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/events"));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/events/pending"));

    expect(AdminClientPage).toHaveBeenCalledWith(
      expect.objectContaining({
        initialUsers: expect.any(Array),
        initialTeams: expect.any(Array),
        initialDepartments: expect.any(Array),
        initialEvents: expect.any(Array),
        initialPendingEvents: expect.any(Array),
      }),
      {}
    );
  });
});