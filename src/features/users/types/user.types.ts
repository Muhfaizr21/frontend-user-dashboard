export interface GeoCoordinates {
  readonly lat: string;
  readonly lng: string;
}

export interface UserAddress {
  readonly street: string;
  readonly suite: string;
  readonly city: string;
  readonly zipcode: string;
  readonly geo: GeoCoordinates;
}

export interface UserCompany {
  readonly name: string;
  readonly catchPhrase: string;
  readonly bs: string;
}

export interface User {
  readonly id: number;
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly address: UserAddress;
  readonly phone: string;
  readonly website: string;
  readonly company: UserCompany;
  readonly isSupplemental?: boolean;
}

export type ViewMode = 'grid' | 'table';

export type SortField = 'id' | 'name' | 'email' | 'company' | 'city';
export type SortOrder = 'asc' | 'desc';

// High-level hooks depend on this contract rather than concrete fetch implementations.
export interface IUserRepository {
  getAllUsers(signal?: AbortSignal): Promise<User[]>;
  getUserById(id: number, signal?: AbortSignal): Promise<User>;
}
