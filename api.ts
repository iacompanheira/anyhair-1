import { Service, Professional, Appointment, AdminSettings, User } from './types';
import { SERVICES, PROFESSIONALS, APPOINTMENTS, INITIAL_ADMIN_SETTINGS, CLIENTS } from './constants';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const SIMULATED_DELAY = 500;

// In-memory data stores (to simulate a database)
let services: Service[] = [...SERVICES];
let professionals: Professional[] = [...PROFESSIONALS];
let clients: User[] = [...CLIENTS];
let appointments: Appointment[] = [...APPOINTMENTS];
let settings: AdminSettings = { ...INITIAL_ADMIN_SETTINGS };

// API Functions

export const getServices = async (): Promise<Service[]> => {
    await delay(SIMULATED_DELAY);
    return [...services];
};

export const saveService = async (service: Service): Promise<Service> => {
    await delay(SIMULATED_DELAY);
    if (service.id) {
        services = services.map(s => s.id === service.id ? service : s);
    } else {
        const newService = { ...service, id: String(Date.now()) };
        services.push(newService);
        return newService;
    }
    return service;
};

export const deleteService = async (id: string): Promise<void> => {
    await delay(SIMULATED_DELAY);
    services = services.filter(s => s.id !== id);
};

export const getClients = async (): Promise<User[]> => {
    await delay(SIMULATED_DELAY);
    return [...clients];
};

export const getClientById = async (id: string): Promise<User | undefined> => {
    await delay(SIMULATED_DELAY);
    return clients.find(c => c.id === id);
};

export const saveClient = async (client: User): Promise<User> => {
    await delay(SIMULATED_DELAY);
    if (client.id) {
        clients = clients.map(c => c.id === client.id ? client : c);
    } else {
        const newClient = { ...client, id: String(Date.now()) };
        clients.push(newClient);
        return newClient;
    }
    return client;
};

export const deleteClient = async (id: string): Promise<void> => {
    await delay(SIMULATED_DELAY);
    clients = clients.filter(c => c.id !== id);
};


export const getProfessionals = async (): Promise<Professional[]> => {
    await delay(SIMULATED_DELAY);
    return [...professionals];
};

export const saveProfessional = async (prof: Professional): Promise<Professional> => {
    await delay(SIMULATED_DELAY);
    if (prof.id) {
        professionals = professionals.map(p => p.id === prof.id ? prof : p);
    } else {
        const newProf = { ...prof, id: String(Date.now()), avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200` };
        professionals.push(newProf);
        return newProf;
    }
    return prof;
};

export const deleteProfessional = async (id: string): Promise<void> => {
    await delay(SIMULATED_DELAY);
    professionals = professionals.filter(p => p.id !== id);
};

export const getAppointments = async (): Promise<Appointment[]> => {
    await delay(SIMULATED_DELAY);
    // Sort by date, future first
    return [...appointments].sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getAppointmentsByClientId = async (clientId: string): Promise<Appointment[]> => {
    await delay(SIMULATED_DELAY);
    return appointments
        .filter(a => a.client.id === clientId)
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // Most recent first
};

export const saveAppointment = async (services: Service[], professional: Professional, date: Date): Promise<Appointment> => {
    await delay(SIMULATED_DELAY);
    // For demonstration, we'll just create a single appointment for the first service
    // and assign it to the first client. A real app would handle this differently.
    const newAppointment: Appointment = {
        id: `a${Date.now()}`,
        service: services[0], // simplified for now
        professional: professional,
        client: CLIENTS[0], // mock client
        date: date,
    };
    appointments.push(newAppointment);
    return newAppointment;
};


export const cancelAppointment = async (id: string): Promise<void> => {
    await delay(SIMULATED_DELAY);
    appointments = appointments.filter(a => a.id !== id);
}

export const getSettings = async (): Promise<AdminSettings> => {
    await delay(SIMULATED_DELAY);
    return settings;
};

export const saveSettings = async (newSettings: AdminSettings): Promise<AdminSettings> => {
    await delay(SIMULATED_DELAY);
    settings = { ...newSettings };
    return settings;
};