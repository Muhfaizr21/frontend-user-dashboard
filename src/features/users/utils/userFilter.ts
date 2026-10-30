import type { SortField, SortOrder, User } from '../types/user.types';

export function filterUsersByQuery(users: readonly User[], rawQuery: string): User[] {
  const normalizedQuery = rawQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...users];
  }

  return users.filter((user) => {
    const matchesName = user.name.toLowerCase().includes(normalizedQuery);
    const matchesEmail = user.email.toLowerCase().includes(normalizedQuery);
    return matchesName || matchesEmail;
  });
}

export function sortUsers(
  users: readonly User[],
  field: SortField,
  order: SortOrder
): User[] {
  const sorted = [...users].sort((a, b) => {
    if (field === 'id') {
      return a.id - b.id;
    }

    let valueA = '';
    let valueB = '';

    switch (field) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'email':
        valueA = a.email.toLowerCase();
        valueB = b.email.toLowerCase();
        break;
      case 'company':
        valueA = a.company.name.toLowerCase();
        valueB = b.company.name.toLowerCase();
        break;
      case 'city':
        valueA = a.address.city.toLowerCase();
        valueB = b.address.city.toLowerCase();
        break;
    }

    return valueA.localeCompare(valueB, 'id');
  });

  return order === 'asc' ? sorted : sorted.reverse();
}

// Strips honorifics (Mr., Mrs., Dr.) before extracting two-letter initials.
export function getUserInitials(fullName: string): string {
  const cleaned = fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatFullAddress(user: User): string {
  const { street, suite, city, zipcode } = user.address;
  return `${street}, ${suite}, ${city} ${zipcode}`;
}
