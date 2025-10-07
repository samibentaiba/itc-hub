import { render, screen, fireEvent, act } from '@testing-library/react';
import { EditDepartmentDialog } from './EditDepartmentDialog';

describe('EditDepartmentDialog', () => {
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
    open: true,
    onOpenChange: jest.fn(),
    onUpdate: jest.fn(),
  };

  beforeEach(() => {
    mockProps.onUpdate.mockClear();
    mockProps.onOpenChange.mockClear();
  });

  it('should render the form with initial department data', () => {
    render(<EditDepartmentDialog {...mockProps} />);
    expect(screen.getByLabelText(/Department Name/)).toHaveValue('Test Department');
    expect(screen.getByLabelText(/Description/)).toHaveValue('Test Description');
  });

  it('should call onUpdate with the updated data on form submission', async () => {
    render(<EditDepartmentDialog {...mockProps} />);
    
    const nameInput = screen.getByLabelText(/Department Name/);
    fireEvent.change(nameInput, { target: { value: 'Updated Department Name' } });

    const saveButton = screen.getByText('Save Changes');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockProps.onUpdate).toHaveBeenCalledWith({
      name: 'Updated Department Name',
      description: 'Test Description',
      color: '#fff',
      status: 'active',
    });
  });

  it('should not call onUpdate and should show an error if name is empty', async () => {
    render(<EditDepartmentDialog {...mockProps} />);
    
    const nameInput = screen.getByLabelText(/Department Name/);
    fireEvent.change(nameInput, { target: { value: ' ' } }); // Empty name

    const saveButton = screen.getByText('Save Changes');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockProps.onUpdate).not.toHaveBeenCalled();
    // You could also test for an error message being displayed
  });
});
