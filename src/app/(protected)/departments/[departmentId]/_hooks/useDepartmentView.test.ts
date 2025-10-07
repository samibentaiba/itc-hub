import { renderHook, act } from '@testing-library/react';
import { useDepartmentView } from './useDepartmentView';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('useDepartmentView', () => {
  const mockToast = jest.fn();
  const mockRouterRefresh = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRouterRefresh, push: mockRouterPush });
    (fetch as jest.Mock).mockClear();
    mockToast.mockClear();
    mockRouterRefresh.mockClear();
    mockRouterPush.mockClear();
  });

  const initialProps = {
    tickets: [],
    initialEvents: [],
    departmentId: '1',
  };

  it('should handle department update successfully', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useDepartmentView(initialProps));

    await act(async () => {
      await result.current.handleUpdateDepartment({ name: 'New Name' });
    });

    expect(fetch).toHaveBeenCalledWith('/api/departments/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Name' }),
    });
    expect(mockToast).toHaveBeenCalledWith({ title: 'Success', description: 'Department updated successfully.' });
    expect(mockRouterRefresh).toHaveBeenCalled();
  });

  it('should handle department delete successfully', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useDepartmentView(initialProps));

    await act(async () => {
      await result.current.handleDeleteDepartment();
    });

    expect(fetch).toHaveBeenCalledWith('/api/departments/1', { method: 'DELETE' });
    expect(mockToast).toHaveBeenCalledWith({ title: 'Success', description: 'Department deleted successfully.' });
    expect(mockRouterPush).toHaveBeenCalledWith('/departments');
  });
});
