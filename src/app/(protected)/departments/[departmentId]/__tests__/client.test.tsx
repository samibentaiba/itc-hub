
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { DepartmentView } from '../client';
import { Department } from '../types';

const mockDepartment: Department = {
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

const mockSession = {
  expires: '1',
  user: { email: 'a', name: 'Delta', image: 'c', id: '1', role: 'ADMIN' },
};

describe('DepartmentView', () => {
  it('should render the department header and tabs', () => {
    render(
      <SessionProvider session={mockSession}>
        <DepartmentView departmentData={mockDepartment} />
      </SessionProvider>
    );

    // Check for the department name in the header
    expect(screen.getByText('Test Department')).toBeInTheDocument();

    // Check for the tabs
    expect(screen.getByText('Long-term Tickets')).toBeInTheDocument();
    expect(screen.getByText('Department Calendar')).toBeInTheDocument();
    expect(screen.getByText('Supervised Teams')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
  });
});
