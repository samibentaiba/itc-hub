
import { render, screen } from '@testing-library/react';
import DepartmentDetailPage from '../page';

// Mock the DepartmentView client component
jest.mock('../client', () => ({
  DepartmentView: jest.fn(() => <div>DepartmentView Mock</div>),
}));

// Mock the next/headers module
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn(() => 'cookie'),
  })),
}));

describe('DepartmentDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the department details when the department is found', async () => {
    const mockDepartment = {
      id: '1',
      name: 'Test Department',
      description: 'Test Description',
      managers: [],
      teams: [],
      members: [],
      tickets: [],
      events: [],
    };

    // Mock the fetch response
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockDepartment),
    } as Response);

    const props = {
      params: Promise.resolve({ departmentId: '1' }),
    };

    render(await DepartmentDetailPage(props));

    expect(screen.getByText('Back to Departments')).toBeInTheDocument();
    expect(screen.getByText('DepartmentView Mock')).toBeInTheDocument();
  });

  it('should render the not found message when the department is not found', async () => {
    // Mock the fetch response for a 404 error
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const props = {
      params: Promise.resolve({ departmentId: '1' }),
    };

    render(await DepartmentDetailPage(props));

    expect(screen.getByText('Department not found')).toBeInTheDocument();
  });
});
