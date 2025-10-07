import { render, screen } from '@testing-library/react';
import { DepartmentHeader } from './DepartmentHeader';
import { useAuthorization } from '@/hooks/use-authorization';

// Mock child components that are not relevant to this test
jest.mock('@/components/new-ticket-form', () => ({
  NewTicketForm: () => <div>NewTicketForm</div>,
}));
jest.mock('./EditDepartmentDialog', () => ({
  EditDepartmentDialog: () => <div>EditDepartmentDialog</div>,
}));

// Mock the useAuthorization hook
jest.mock('@/hooks/use-authorization', () => ({
  useAuthorization: jest.fn(),
  AuthorizedComponent: ({ children, requiresAdmin }: { children: React.ReactNode, requiresAdmin?: boolean }) => {
    const { isAdmin } = useAuthorization();
    if (requiresAdmin && !isAdmin) {
      return null;
    }
    return <>{children}</>;
  },
}));

describe('DepartmentHeader', () => {
  const mockDepartment = {
    id: '1',
    name: 'Test Department',
    description: 'Test Description',
    managers: [],
    teams: [],
    members: [],
    tickets: [],
    events: [],
    status: 'active',
    color: '#fff',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProps = {
    department: mockDepartment,
    showNewTicket: false,
    onOpenChange: jest.fn(),
    showEditDepartment: false,
    onEditOpenChange: jest.fn(),
    showDeleteAlert: false,
    onDeleteOpenChange: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  describe('when user is an Admin', () => {
    beforeEach(() => {
      (useAuthorization as jest.Mock).mockReturnValue({ isAdmin: true, isLoading: false });
    });

    it('should render edit and delete buttons', () => {
      render(<DepartmentHeader {...mockProps} />);
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('when user is not an Admin', () => {
    beforeEach(() => {
      (useAuthorization as jest.Mock).mockReturnValue({ isAdmin: false, isLoading: false });
    });

    it('should not render edit and delete buttons', () => {
      render(<DepartmentHeader {...mockProps} />);
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });
});
