import { httpRequest } from '@/shared/api/httpClient';
import type { IUserRepository, User } from '../types/user.types';

const DEFAULT_BASE_URL = 'https://jsonplaceholder.typicode.com';

// JSONPlaceholder only provides 10 records; these 5 local records allow testing 5/10/15 pagination.
const SUPPLEMENTAL_USERS: readonly User[] = [
  {
    id: 11,
    name: 'Arif Pratama Wijaya',
    username: 'arif.wijaya',
    email: 'arif.wijaya@nusantara-tech.co.id',
    address: {
      street: 'Jl. Jenderal Sudirman Kav. 52',
      suite: 'Tower B Lt. 18',
      city: 'Jakarta Selatan',
      zipcode: '12190',
      geo: { lat: '-6.2246', lng: '106.8096' },
    },
    phone: '+62 21-5150-8891',
    website: 'nusantara-tech.co.id',
    company: {
      name: 'Nusantara Cloud Systems',
      catchPhrase: 'Distributed cloud-native enterprise infrastructure',
      bs: 'architect resilient microservices',
    },
    isSupplemental: true,
  },
  {
    id: 12,
    name: 'Nadia Kusuma Wardhani',
    username: 'nadia.wardhani',
    email: 'nadia.kusuma@veritas-fin.id',
    address: {
      street: 'Jl. Asia Afrika No. 142',
      suite: 'Suite 402',
      city: 'Bandung',
      zipcode: '40261',
      geo: { lat: '-6.9218', lng: '107.6071' },
    },
    phone: '+62 22-4231-9022',
    website: 'veritas-fin.id',
    company: {
      name: 'Veritas Quantitative Ledger',
      catchPhrase: 'Algorithmic risk telemetry and zero-trust settlement',
      bs: 'streamline institutional settlements',
    },
    isSupplemental: true,
  },
  {
    id: 13,
    name: 'Rendra Mahendra Putra',
    username: 'rendra.putra',
    email: 'rendra@arkadia-labs.io',
    address: {
      street: 'Jl. Basuki Rahmat No. 88',
      suite: 'Plaza Level 9',
      city: 'Surabaya',
      zipcode: '60271',
      geo: { lat: '-7.2654', lng: '112.7418' },
    },
    phone: '+62 31-5319-4401',
    website: 'arkadia-labs.io',
    company: {
      name: 'Arkadia Autonomous Robotics',
      catchPhrase: 'Industrial automation and precision sensor fusion',
      bs: 'optimize smart-factory logistics',
    },
    isSupplemental: true,
  },
  {
    id: 14,
    name: 'Clara Sinta Maharani',
    username: 'clara.maharani',
    email: 'clara.sinta@katalis-ai.com',
    address: {
      street: 'Jl. Malioboro No. 27',
      suite: 'Heritage Wing 3A',
      city: 'Yogyakarta',
      zipcode: '55213',
      geo: { lat: '-7.7926', lng: '110.3658' },
    },
    phone: '+62 274-589-3310',
    website: 'katalis-ai.com',
    company: {
      name: 'Katalis Neural Intelligence',
      catchPhrase: 'Human-centered generative design and semantic search',
      bs: 'empower predictive analytics',
    },
    isSupplemental: true,
  },
  {
    id: 15,
    name: 'Dimas Aditya Gunawan',
    username: 'dimas.gunawan',
    email: 'dimas.gunawan@maritim-logistik.id',
    address: {
      street: 'Jl. Sunset Road No. 108',
      suite: 'Pavilion C-12',
      city: 'Denpasar',
      zipcode: '80361',
      geo: { lat: '-8.6705', lng: '115.2126' },
    },
    phone: '+62 361-849-7712',
    website: 'maritim-logistik.id',
    company: {
      name: 'Samudra Global Supply',
      catchPhrase: 'Cross-archipelago cold-chain and port telemetry',
      bs: 'synchronize maritime supply-chains',
    },
    isSupplemental: true,
  },
];

export class JsonPlaceholderUserRepository implements IUserRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public async getAllUsers(signal?: AbortSignal): Promise<User[]> {
    const endpoint = `${this.baseUrl}/users`;
    const apiUsers = await httpRequest<User[]>(endpoint, { signal });

    if (!Array.isArray(apiUsers)) {
      throw new Error('Format respons API tidak valid: diharapkan array data pengguna.');
    }

    const existingIds = new Set(apiUsers.map((u) => u.id));
    const additional = SUPPLEMENTAL_USERS.filter((u) => !existingIds.has(u.id));

    return [...apiUsers, ...additional];
  }

  public async getUserById(id: number, signal?: AbortSignal): Promise<User> {
    const supplemental = SUPPLEMENTAL_USERS.find((u) => u.id === id);
    if (supplemental) {
      return supplemental;
    }

    const endpoint = `${this.baseUrl}/users/${id}`;
    return httpRequest<User>(endpoint, { signal });
  }
}

export const defaultUserRepository: IUserRepository = new JsonPlaceholderUserRepository();
