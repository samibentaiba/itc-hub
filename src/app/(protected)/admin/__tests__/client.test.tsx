import { render, screen } from "@testing-library/react";
import AdminClientPage from "../client";
import { useAdminPage } from "../_hooks/useAdminPage";

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
    userData: { users: [] },
    teamData: { teams: [] },
    departmentData: { departments: [] },
    eventRequestData: { pendingEvents: [] },
    calendarData: { events: [], actions: {} }, // Added actions to avoid potential errors
    
    // This is the missing piece of the mock
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

  it("should render the main components of the admin dashboard", () => {
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
    expect(screen.getByText("Export Data")).toBeInTheDocument();
  });
});