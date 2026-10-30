import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserDashboardPage } from '../components/UserDashboardPage';
import type { IUserRepository, User } from '../types/user.types';
import { filterUsersByQuery, getUserInitials } from '../utils/userFilter';

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: { lat: '-37.3159', lng: '81.1496' },
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: { lat: '-43.9509', lng: '-34.4618' },
    },
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains',
    },
  },
];

describe('Pure Domain Utilities (userFilter)', () => {
  it('filters users by name or email case-insensitively', () => {
    expect(filterUsersByQuery(MOCK_USERS, 'leanne')).toHaveLength(1);
    expect(filterUsersByQuery(MOCK_USERS, 'MELISSA.TV')).toHaveLength(1);
    expect(filterUsersByQuery(MOCK_USERS, 'nonexistent')).toHaveLength(0);
  });

  it('extracts clean 2-letter initials ignoring honorifics', () => {
    expect(getUserInitials('Mrs. Dennis Schulist')).toBe('DS');
    expect(getUserInitials('Leanne Graham')).toBe('LG');
  });
});

describe('UserDashboardPage Integration (SOLID Repository Injection)', () => {
  it('renders loading state initially and then displays user cards', async () => {
    const mockRepo: IUserRepository = {
      getAllUsers: vi.fn().mockResolvedValue(MOCK_USERS),
      getUserById: vi.fn(),
    };

    render(<UserDashboardPage repository={mockRepo} />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
    });
  });

  it('filters users in realtime when typing in the search bar', async () => {
    const user = userEvent.setup();
    const mockRepo: IUserRepository = {
      getAllUsers: vi.fn().mockResolvedValue(MOCK_USERS),
      getUserById: vi.fn(),
    };

    render(<UserDashboardPage repository={mockRepo} />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Ketik nama personel/i);
    await user.type(searchInput, 'Shanna@melissa.tv');

    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
  });

  it('opens the detail modal with full address and company info when a user is clicked', async () => {
    const user = userEvent.setup();
    const mockRepo: IUserRepository = {
      getAllUsers: vi.fn().mockResolvedValue(MOCK_USERS),
      getUserById: vi.fn(),
    };

    render(<UserDashboardPage repository={mockRepo} />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Leanne Graham'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Multi-layered client-server neural-net/i)
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/Kulas Light, Apt. 556/i)).toBeInTheDocument();
  });

  it('displays friendly error message when API fails and allows retry', async () => {
    const mockRepo: IUserRepository = {
      getAllUsers: vi
        .fn()
        .mockRejectedValueOnce(new Error('Koneksi ke server terputus'))
        .mockResolvedValueOnce(MOCK_USERS),
      getUserById: vi.fn(),
    };

    render(<UserDashboardPage repository={mockRepo} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Koneksi ke server terputus/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', {
      name: /Muat Ulang Data/i,
    });
    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });
  });

  it('allows sorting ASC/DESC directly by clicking table column headers', async () => {
    const user = userEvent.setup();
    const mockRepo: IUserRepository = {
      getAllUsers: vi.fn().mockResolvedValue(MOCK_USERS),
      getUserById: vi.fn(),
    };

    render(<UserDashboardPage repository={mockRepo} />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Tabel/i }));

    const idHeaderBtn = screen.getByRole('button', { name: /^ID/i });
    expect(idHeaderBtn).toHaveTextContent(/ASC/i);

    await user.click(idHeaderBtn);
    expect(idHeaderBtn).toHaveTextContent(/DESC/i);

    const personelHeaderBtn = screen.getByRole('button', { name: /Personel/i });
    await user.click(personelHeaderBtn);
    expect(personelHeaderBtn).toHaveTextContent(/ASC/i);
  });
});
