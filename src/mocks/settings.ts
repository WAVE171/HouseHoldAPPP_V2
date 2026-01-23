// Stub file - API integration pending

export interface UserSettings {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    tasks: boolean;
    calendar: boolean;
    finance: boolean;
  };
}

export const mockSettings: UserSettings = {
  language: 'pt-PT',
  timezone: 'Africa/Luanda',
  theme: 'light',
  currency: 'AOA',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    email: true,
    push: true,
    tasks: true,
    calendar: true,
    finance: true,
  },
};

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'pt-PT', name: 'Português' },
];

export const availableTimezones = [
  { value: 'Africa/Luanda', label: 'Africa/Luanda (WAT)' },
  { value: 'UTC', label: 'UTC' },
];

export const availableCurrencies = [
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

export async function getSettings(): Promise<UserSettings> {
  return mockSettings;
}

export async function updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
  return { ...mockSettings, ...data };
}
