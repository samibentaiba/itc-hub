import { render, screen, within } from "@testing-library/react";
import AdminClientPage from "../client";
import { useAdminPage } from "../_hooks/useAdminPage";
import { TestWrapper } from "./TestWrapper"; 

// Mock the useAdminPage hook
jest.mock("../_hooks/useAdminPage");

describe("AdminClientPage", () => {
  const mockUseAdminPage = {
    pageActions: {
      handleRefreshData: jest.fn(),
      handleExportData: jest.fn(),
      loadingAction: null,
    },
    modalData: {
      modal: null,
      closeModal: jest.fn(),
      handleActionConfirm: jest.fn(),
      setModal: jest.fn(),
    },
    userData: { 
      users: [
        { id: "1", name: "Sami", email: "sami@example.com", role: "ADMIN" },
      ],
      handleSaveUser: jest.fn(),
      handleDeleteUser: jest.fn(),
      handleVerifyUser: jest.fn(),
    },
    teamData: { 
      teams: [
        { id: "1", name: "Team Alpha", members: [] },
      ],
      handleSaveTeam: jest.fn(),
      handleDeleteTeam: jest.fn(),
    },
    departmentData: { 
      departments: [
        { id: "1", name: "Engineering", members: [] },
      ],
      handleSaveDepartment: jest.fn(),
      handleDeleteDepartment: jest.fn(),
    },
    eventRequestData: { 
      pendingEvents: [],
      handleAcceptEvent: jest.fn(),
      handleRejectEvent: jest.fn(),
    },
    calendarData: { 
      events: [], 
      actions: {
        createEvent: jest.fn(),
        handleDeleteEvent: jest.fn(),
      } 
    },
    memberData: {
      handleAddMember: jest.fn(),
      handleRemoveMember: jest.fn(),
      handleChangeMemberRole: jest.fn(),
    },
    allUsers: [],
    allDepartments: [],
  };

  beforeEach(() => {
    (useAdminPage as jest.Mock).mockReturnValue(mockUseAdminPage);
  });

  const renderWithWrapper = (component: React.ReactElement) => {
    return render(<TestWrapper>{component}</TestWrapper>);
  };

  it("should render the main components of the admin dashboard", () => {
    renderWithWrapper(
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
    expect(screen.getByText("Export Data")).toBeInTheDocument();
  });

  it("should display users in the user data table", () => {
    renderWithWrapper(
      <AdminClientPage
        initialUsers={mockUseAdminPage.userData.users}
        initialTeams={[]}
        initialDepartments={[]}
        initialEvents={[]}
        initialUpcomingEvents={[]}
        initialPendingEvents={[]}
      />
    );
    
    const userTable = screen.getByTestId("users-data-table");
    const row = within(userTable).getByText("Sami");
    expect(row).toBeInTheDocument();
  });

  it("should display teams in the team data table", () => {
    renderWithWrapper(
      <AdminClientPage
        initialUsers={[]}
        initialTeams={mockUseAdminPage.teamData.teams}
        initialDepartments={[]}
        initialEvents={[]}
        initialUpcomingEvents={[]}
        initialPendingEvents={[]}
      />
    );

    const teamTable = screen.getByTestId("teams-data-table");
    const row = within(teamTable).getByText("Team Alpha");
    expect(row).toBeInTheDocument();
  });

  it("should display departments in the department data table", () => {
    renderWithWrapper(
      <AdminClientPage
        initialUsers={[]}
        initialTeams={[]}
        initialDepartments={mockUseAdminPage.departmentData.departments}
        initialEvents={[]}
        initialUpcomingEvents={[]}
        initialPendingEvents={[]}
      />
    );

    const departmentTable = screen.getByTestId("departments-data-table");
    const row = within(departmentTable).getByText("Engineering");
    expect(row).toBeInTheDocument();
  });
});