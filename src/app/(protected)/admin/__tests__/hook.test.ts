
import { renderHook, act } from "@testing-library/react-hooks";
import { useAdminPage, apiRequest } from "../hook";
import { useToast } from "@/hooks/use-toast";

// Mock the useToast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("useAdminPage hook", () => {
  const initialUsers = [];
  const initialTeams = [];
  const initialDepartments = [];
  const initialEvents = [];
  const initialUpcomingEvents = [];
  const initialPendingEvents = [];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("apiRequest", () => {
    it("should make a successful API request and return JSON", async () => {
      const mockData = { message: "Success" };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const response = await apiRequest("/api/test");

      expect(fetch).toHaveBeenCalledWith("/api/test", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(response).toEqual(mockData);
    });

    it("should throw an error when the API request fails", async () => {
      const mockError = { error: "Failed to fetch" };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve(mockError),
      });

      await expect(apiRequest("/api/test")).rejects.toThrow("Failed to fetch");
    });

    it("should return null for 204 No Content responses", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 204,
          json: () => Promise.resolve({}),
        });
  
        const response = await apiRequest("/api/test");
  
        expect(response).toBeNull();
      });
  });

  describe("handleSaveUser", () => {
    it("should add a new user to the state when creation is successful", async () => {
      const newUser = { id: "1", name: "Sami", email: "sami@email.com", createdAt: new Date().toISOString() };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(newUser),
      });

      const { result } = renderHook(() => useAdminPage([], [], [], [], [], []));

      await act(async () => {
        await result.current.userData.handleSaveUser({ name: "Sami", email: "sami@email.com" });
      });

      expect(result.current.userData.users).toHaveLength(1);
      expect(result.current.userData.users[0].name).toBe("Sami");
    });

    it("should update an existing user in the state when editing is successful", async () => {
        const existingUser = { id: "1", name: "Sami", email: "sami@email.com", createdAt: new Date().toISOString() };
        const updatedUser = { id: "1", name: "Sami Updated", email: "sami@email.com", createdAt: new Date().toISOString() };
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(updatedUser),
        });
  
        const { result } = renderHook(() => useAdminPage([existingUser], [], [], [], [], []));
  
        await act(async () => {
          await result.current.userData.handleSaveUser({ id: "1", name: "Sami Updated", email: "sami@email.com" });
        });
  
        expect(result.current.userData.users).toHaveLength(1);
        expect(result.current.userData.users[0].name).toBe("Sami Updated");
      });
  });

  describe("handleDeleteUser", () => {
    it("should remove a user from the state when deletion is successful", async () => {
      const existingUser = { id: "1", name: "Sami", email: "sami@email.com", createdAt: new Date().toISOString() };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const { result } = renderHook(() => useAdminPage([existingUser], [], [], [], [], []));

      await act(async () => {
        await result.current.userData.handleDeleteUser("1");
      });

      expect(result.current.userData.users).toHaveLength(0);
    });
  });

  describe("handleVerifyUser", () => {
    it("should update the user's verified status in the state when verification is successful", async () => {
        const existingUser = { id: "1", name: "Sami", email: "sami@email.com", createdAt: new Date().toISOString(), emailVerified: null };
        const verifiedUser = { ...existingUser, emailVerified: new Date().toISOString() };
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(verifiedUser),
        });
  
        const { result } = renderHook(() => useAdminPage([existingUser], [], [], [], [], []));
  
        await act(async () => {
          await result.current.userData.handleVerifyUser("1");
        });
  
        expect(result.current.userData.users[0].emailVerified).not.toBeNull();
      });
  });

  describe("handleSaveTeam", () => {
    it("should add a new team to the state when creation is successful", async () => {
      const newTeam = { id: "1", name: "New Team", createdAt: new Date().toISOString() };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(newTeam),
      });

      const { result } = renderHook(() => useAdminPage([], [], [], [], [], []));

      await act(async () => {
        await result.current.teamData.handleSaveTeam({ name: "New Team" });
      });

      expect(result.current.teamData.teams).toHaveLength(1);
      expect(result.current.teamData.teams[0].name).toBe("New Team");
    });

    it("should update an existing team in the state when editing is successful", async () => {
        const existingTeam = { id: "1", name: "Old Team", createdAt: new Date().toISOString() };
        const updatedTeam = { id: "1", name: "Updated Team", createdAt: new Date().toISOString() };
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(updatedTeam),
        });
  
        const { result } = renderHook(() => useAdminPage([], [existingTeam], [], [], [], []));
  
        await act(async () => {
          await result.current.teamData.handleSaveTeam({ id: "1", name: "Updated Team" });
        });
  
        expect(result.current.teamData.teams).toHaveLength(1);
        expect(result.current.teamData.teams[0].name).toBe("Updated Team");
      });
  });

  describe("handleDeleteTeam", () => {
    it("should remove a team from the state when deletion is successful", async () => {
      const existingTeam = { id: "1", name: "Team to delete", createdAt: new Date().toISOString() };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const { result } = renderHook(() => useAdminPage([], [existingTeam], [], [], [], []));

      await act(async () => {
        await result.current.teamData.handleDeleteTeam("1");
      });

      expect(result.current.teamData.teams).toHaveLength(0);
    });
  });

  describe("handleSaveDepartment", () => {
    it("should add a new department to the state when creation is successful", async () => {
      const newDepartment = { id: "1", name: "New Department", createdAt: new Date().toISOString() };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(newDepartment),
      });

      const { result } = renderHook(() => useAdminPage([], [], [], [], [], []));

      await act(async () => {
        await result.current.departmentData.handleSaveDepartment({ name: "New Department" });
      });

      expect(result.current.departmentData.departments).toHaveLength(1);
      expect(result.current.departmentData.departments[0].name).toBe("New Department");
    });

    it("should update an existing department in the state when editing is successful", async () => {
        const existingDepartment = { id: "1", name: "Old Department", createdAt: new Date().toISOString() };
        const updatedDepartment = { id: "1", name: "Updated Department", createdAt: new Date().toISOString() };
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve(updatedDepartment),
        });
  
        const { result } = renderHook(() => useAdminPage([], [], [existingDepartment], [], [], []));
  
        await act(async () => {
          await result.current.departmentData.handleSaveDepartment({ id: "1", name: "Updated Department" });
        });
  
        expect(result.current.departmentData.departments).toHaveLength(1);
        expect(result.current.departmentData.departments[0].name).toBe("Updated Department");
      });
  });

  describe("handleDeleteDepartment", () => {
    it("should remove a department from the state when deletion is successful", async () => {
      const existingDepartment = { id: "1", name: "Department to delete", createdAt: new Date().toISOString() };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const { result } = renderHook(() => useAdminPage([], [], [existingDepartment], [], [], []));

      await act(async () => {
        await result.current.departmentData.handleDeleteDepartment("1");
      });

      expect(result.current.departmentData.departments).toHaveLength(0);
    });
  });

  describe("Member Management", () => {
    it("should call the refresh function after adding a member", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) });
      const { result } = renderHook(() => useAdminPage([], [], [], [], [], []));
      const refreshDataSpy = jest.spyOn(result.current.pageActions, "handleRefreshData");

      await act(async () => {
        await result.current.memberData.handleAddMember("1", "team", "1", "member");
      });

      expect(refreshDataSpy).toHaveBeenCalled();
    });

    it("should call the refresh function after removing a member", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 204 });
        const { result } = renderHook(() => useAdminPage([], [], [], [], [], []));
        const refreshDataSpy = jest.spyOn(result.current.pageActions, "handleRefreshData");
  
        await act(async () => {
          await result.current.memberData.handleRemoveMember("1", "team", "1");
        });
  
        expect(refreshDataSpy).toHaveBeenCalled();
      });

      it("should call the refresh function after changing a member role", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) });
        const { result } = renderHook(() => useAdminPage([], [], [], [], [], []));
        const refreshDataSpy = jest.spyOn(result.current.pageActions, "handleRefreshData");
  
        await act(async () => {
          await result.current.memberData.handleChangeMemberRole("1", "team", "1", "leader");
        });
  
        expect(refreshDataSpy).toHaveBeenCalled();
      });
  });

  describe("Event Request Handlers", () => {
    it("should add the event to the calendar and remove it from pending when an event is accepted", async () => {
      const pendingEvent = { id: "1", title: "Pending Event", date: "2025-10-27", time: "10:00" };
      const acceptedEvent = { ...pendingEvent, type: "meeting", attendees: [] };
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(acceptedEvent) });

      const { result } = renderHook(() => useAdminPage([], [], [], [], [], [pendingEvent]));

      await act(async () => {
        await result.current.eventRequestData.handleAcceptEvent(pendingEvent);
      });

      expect(result.current.calendarData.events).toHaveLength(1);
      expect(result.current.calendarData.events[0].title).toBe("Pending Event");
      expect(result.current.eventRequestData.pendingEvents).toHaveLength(0);
    });

    it("should remove the event from pending when an event is rejected", async () => {
        const pendingEvent = { id: "1", title: "Pending Event", date: "2025-10-27", time: "10:00" };
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 204 });
  
        const { result } = renderHook(() => useAdminPage([], [], [], [], [], [pendingEvent]));
  
        await act(async () => {
          await result.current.eventRequestData.handleRejectEvent(pendingEvent);
        });
  
        expect(result.current.eventRequestData.pendingEvents).toHaveLength(0);
      });
  });

  describe("Calendar Handlers", () => {
    it("should add a new event to the calendar when creation is successful", async () => {
      const newEvent = { id: "1", title: "New Event", date: "2025-10-27", time: "10:00", type: "meeting", attendees: [] };
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(newEvent) });

      const { result } = renderHook(() => useAdminPage([], [], [], [], [], []));

      await act(async () => {
        await result.current.calendarData.actions.createEvent({ title: "New Event", date: "2025-10-27", time: "10:00", type: "meeting" });
      });

      expect(result.current.calendarData.events).toHaveLength(1);
      expect(result.current.calendarData.events[0].title).toBe("New Event");
    });

    it("should update an existing event in the calendar when editing is successful", async () => {
        const existingEvent = { id: "1", title: "Old Event", date: "2025-10-27", time: "10:00", type: "meeting", attendees: [] };
        const updatedEvent = { ...existingEvent, title: "Updated Event" };
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(updatedEvent) });
  
        const { result } = renderHook(() => useAdminPage([], [], [], [existingEvent], [], []));
  
        await act(async () => {
          await result.current.calendarData.actions.createEvent({ id: "1", title: "Updated Event", date: "2025-10-27", time: "10:00", type: "meeting" });
        });
  
        expect(result.current.calendarData.events).toHaveLength(1);
        expect(result.current.calendarData.events[0].title).toBe("Updated Event");
      });

      it("should remove an event from the calendar when deletion is successful", async () => {
        const existingEvent = { id: "1", title: "Event to delete", date: "2025-10-27", time: "10:00", type: "meeting", attendees: [] };
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, status: 204 });
  
        const { result } = renderHook(() => useAdminPage([], [], [], [existingEvent], [], []));
  
        await act(async () => {
          await result.current.calendarData.actions.handleDeleteEvent(existingEvent);
        });
  
        expect(result.current.calendarData.events).toHaveLength(0);
      });
  });
});
