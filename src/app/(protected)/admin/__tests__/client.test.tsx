// /app/(protected)/admin/__tests__/client.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import AdminClientPage from "../client";
import { useAdminPage } from "../_hooks/useAdminPage";


// Mock all UI subcomponents
jest.mock("../_components/StatsCards", () => ({
  StatsCards: () => <div>StatsCards Mock</div>,
}));
jest.mock("../_components/AdminTabs", () => ({
  AdminTabs: () => <div>AdminTabs Mock</div>,
}));
jest.mock("../_components/UserFormDialog", () => ({
  UserFormDialog: () => <div>UserFormDialog Mock</div>,
}));
jest.mock("../_components/TeamFormDialog", () => ({
  TeamFormDialog: () => <div>TeamFormDialog Mock</div>,
}));
jest.mock("../_components/DepartmentFormDialog", () => ({
  DepartmentFormDialog: () => <div>DepartmentFormDialog Mock</div>,
}));
jest.mock("../_components/ActionConfirmationDialog", () => ({
  ActionConfirmationDialog: () => <div>ActionConfirmationDialog Mock</div>,
}));
jest.mock("../_components/ManageMembersDialog", () => ({
  ManageMembersDialog: () => <div>ManageMembersDialog Mock</div>,
}));
jest.mock("../_components/CreateEventDialog", () => ({
  CreateEventDialog: () => <div>CreateEventDialog Mock</div>,
}));
jest.mock("../_components/EventDetailsDialog", () => ({
  EventDetailsDialog: () => <div>EventDetailsDialog Mock</div>,
}));


// Mock the hook
jest.mock("../_hooks/useAdminPage");


describe("AdminClientPage", () => {
  beforeEach(() => {
    (useAdminPage as jest.Mock).mockReturnValue({
      pageActions: {
        handleRefreshData: jest.fn(),
        handleExportData: jest.fn(),
        loadingAction: null,
      },
      modalData: {
        modal: null,
        closeModal: jest.fn(),
        setModal: jest.fn(),
      },
      userData: { users: [] },
      teamData: { teams: [] },
      departmentData: { departments: [] },
      memberData: {},
      eventRequestData: {},
      calendarData: {
        showNewEventDialog: false,
        actions: {
          setShowNewEventDialog: jest.fn(),
          setSelectedEvent: jest.fn(),
          createEvent: jest.fn(),
          handleEditEvent: jest.fn(),
          handleDeleteEvent: jest.fn(),
        },
        selectedEvent: null,
        isLoading: false,
      },
      allUsers: [],
      allDepartments: [],
    });
  });


  it("renders the Admin Dashboard header and basic UI components", () => {
    render(
      <AdminClientPage
        initialUsers={[]}
        initialTeams={[]}
        initialDepartments={[]}
        initialEvents={[]}
        initialUpcomingEvents={[]}
        initialPendingEvents={[]}
      />
    );


    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Manage all aspects of the ITC Hub.")).toBeInTheDocument();
    expect(screen.getByText("StatsCards Mock")).toBeInTheDocument();
    expect(screen.getByText("AdminTabs Mock")).toBeInTheDocument();
  });


  it("triggers refresh and export handlers when buttons are clicked", () => {
    const mockRefresh = jest.fn();
    const mockExport = jest.fn();


    (useAdminPage as jest.Mock).mockReturnValue({
      pageActions: {
        handleRefreshData: mockRefresh,
        handleExportData: mockExport,
        loadingAction: null,
      },
      modalData: { modal: null, closeModal: jest.fn(), setModal: jest.fn() },
      userData: { users: [] },
      teamData: { teams: [] },
      departmentData: { departments: [] },
      memberData: {},
      eventRequestData: {},
      calendarData: {
        showNewEventDialog: false,
        actions: {
          setShowNewEventDialog: jest.fn(),
          setSelectedEvent: jest.fn(),
          createEvent: jest.fn(),
          handleEditEvent: jest.fn(),
          handleDeleteEvent: jest.fn(),
        },
        selectedEvent: null,
        isLoading: false,
      },
      allUsers: [],
      allDepartments: [],
    });


    render(
      <AdminClientPage
        initialUsers={[]}
        initialTeams={[]}
        initialDepartments={[]}
        initialEvents={[]}
        initialUpcomingEvents={[]}
        initialPendingEvents={[]}
      />
    );


    fireEvent.click(screen.getAllByRole("button")[0]); // Refresh
    fireEvent.click(screen.getAllByRole("button")[1]); // Export


    expect(mockRefresh).toHaveBeenCalled();
    expect(mockExport).toHaveBeenCalled();
  });
});
