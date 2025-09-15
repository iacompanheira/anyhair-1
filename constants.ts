import { Service, Professional, Appointment, AdminSettings, User } from './types';

export const SERVICES: Service[] = [
  { id: '1', name: 'Corte Feminino', duration: 60, price: 120.00, description: 'Estilo, lavagem e secagem para um look renovado.', color: 'bg-pink-400 border-pink-600' },
  { id: '2', name: 'Escova Progressiva', duration: 180, price: 350.00, description: 'Alisamento duradouro para cabelos lisos e sem frizz.', color: 'bg-purple-400 border-purple-600' },
  { id: '3', name: 'Coloração Completa', duration: 120, price: 250.00, description: 'Cobertura total dos fios com a cor de sua escolha.', color: 'bg-blue-400 border-blue-600' },
  { id: '4', name: 'Manicure & Pedicure', duration: 90, price: 75.00, description: 'Cuidado completo para unhas das mãos e dos pés.', color: 'bg-teal-400 border-teal-600' },
  { id: '5', name: 'Hidratação Profunda', duration: 45, price: 90.00, description: 'Tratamento intensivo para restaurar a saúde dos fios.', color: 'bg-green-400 border-green-600' },
  { id: '6', name: 'Design de Sobrancelha', duration: 30, price: 50.00, description: 'Modelagem e definição do formato das sobrancelhas.', color: 'bg-yellow-400 border-yellow-600' },
];

export const PROFESSIONALS: Professional[] = [
  { id: 'p1', name: 'Juliana Alves', avatarUrl: 'https://picsum.photos/id/1027/200/200', specialties: ['1', '2', '5'] },
  { id: 'p2', name: 'Fernanda Lima', avatarUrl: 'https://picsum.photos/id/1011/200/200', specialties: ['1', '3'] },
  { id: 'p3', name: 'Beatriz Costa', avatarUrl: 'https://picsum.photos/id/1012/200/200', specialties: ['4', '6'] },
  { id: 'p4', name: 'Mariana Souza', avatarUrl: 'https://picsum.photos/id/1013/200/200', specialties: ['1', '2', '3', '5', '6'] },
];

export const CLIENTS: User[] = [
    { id: 'c1', name: 'Ana Silva', birthday: '15/03/1990', whatsapp: '(11) 98765-4321', email: 'ana.silva@example.com' },
    { id: 'c2', name: 'Carla Dias', birthday: '22/08/1985', whatsapp: '(21) 91234-5678', email: 'carla.dias@example.com' },
    { id: 'c3', name: 'Mariana Lima', birthday: '10/11/2000', whatsapp: '(31) 95555-1234', email: 'mariana.lima@example.com' },
    { id: 'c4', name: 'Sofia Pereira', birthday: '05/01/1995', whatsapp: '(41) 94444-1111', email: 'sofia.p@example.com' },
    { id: 'c5', name: 'Joana Martins', birthday: '19/07/1992', whatsapp: '(51) 93333-2222', email: 'joana.m@example.com' },
    { id: 'c6', name: 'Beatriz Almeida', birthday: '30/04/1988', whatsapp: '(61) 92222-3333', email: 'beatriz.a@example.com' },
    { id: 'c7', name: 'Luísa Rocha', birthday: '12/09/1998', whatsapp: '(71) 91111-4444', email: 'luisa.r@example.com' },
];

// Helper to get a specific date for calendar examples
const getCalendarDate = (day: number, hour: number, minute: number = 0) => {
    const today = new Date();
    // Set to the beginning of the current week (Sunday)
    today.setDate(today.getDate() - today.getDay());
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    date.setHours(hour, minute, 0, 0);
    return date;
};


export const APPOINTMENTS: Appointment[] = [
    // Future appointments for list
    { id: 'a1', service: SERVICES[0], professional: PROFESSIONALS[0], client: CLIENTS[0], date: new Date(new Date().setDate(new Date().getDate() + 2)) },
    { id: 'a2', service: SERVICES[3], professional: PROFESSIONALS[2], client: CLIENTS[1], date: new Date(new Date().setDate(new Date().getDate() + 4)) },
    { id: 'a3', service: SERVICES[1], professional: PROFESSIONALS[3], client: CLIENTS[2], date: new Date(new Date().setDate(new Date().getDate() + 9)) },
    
    // Past appointments for client history
    { id: 'a4', service: SERVICES[2], professional: PROFESSIONALS[1], client: CLIENTS[0], date: new Date(new Date().setDate(new Date().getDate() - 30)) },
    { id: 'a5', service: SERVICES[4], professional: PROFESSIONALS[0], client: CLIENTS[1], date: new Date(new Date().setDate(new Date().getDate() - 45)) },
    { id: 'a6', service: SERVICES[0], professional: PROFESSIONALS[3], client: CLIENTS[0], date: new Date(new Date().setDate(new Date().getDate() - 60)) },

    // Static appointments for this week's calendar view
    // Juliana Alves (p1)
    { id: 'cal1', service: SERVICES[0], professional: PROFESSIONALS[0], client: CLIENTS[2], date: getCalendarDate(1, 10) }, // Mon 10:00
    { id: 'cal2', service: SERVICES[1], professional: PROFESSIONALS[0], client: CLIENTS[3], date: getCalendarDate(2, 14) }, // Tue 14:00
    { id: 'cal3', service: SERVICES[4], professional: PROFESSIONALS[0], client: CLIENTS[4], date: getCalendarDate(4, 11, 30) }, // Thu 11:30
    { id: 'cal20', service: SERVICES[0], professional: PROFESSIONALS[0], client: CLIENTS[5], date: getCalendarDate(5, 9) }, // Fri 9:00
    { id: 'cal21', service: SERVICES[4], professional: PROFESSIONALS[0], client: CLIENTS[6], date: getCalendarDate(5, 11) }, // Fri 11:00

    // Fernanda Lima (p2)
    { id: 'cal4', service: SERVICES[2], professional: PROFESSIONALS[1], client: CLIENTS[5], date: getCalendarDate(1, 15) }, // Mon 15:00
    { id: 'cal9', service: SERVICES[0], professional: PROFESSIONALS[1], client: CLIENTS[0], date: getCalendarDate(1, 9) }, // Mon 9:00
    { id: 'cal10', service: SERVICES[2], professional: PROFESSIONALS[1], client: CLIENTS[1], date: getCalendarDate(3, 10, 30) }, // Wed 10:30
    { id: 'cal11', service: SERVICES[0], professional: PROFESSIONALS[1], client: CLIENTS[2], date: getCalendarDate(4, 16) }, // Thu 16:00

    // Beatriz Costa (p3)
    { id: 'cal5', service: SERVICES[3], professional: PROFESSIONALS[2], client: CLIENTS[6], date: getCalendarDate(3, 9) }, // Wed 9:00
    { id: 'cal6', service: SERVICES[5], professional: PROFESSIONALS[2], client: CLIENTS[0], date: getCalendarDate(5, 16) }, // Fri 16:00
    { id: 'cal12', service: SERVICES[3], professional: PROFESSIONALS[2], client: CLIENTS[3], date: getCalendarDate(2, 11) }, // Tue 11:00
    { id: 'cal13', service: SERVICES[5], professional: PROFESSIONALS[2], client: CLIENTS[4], date: getCalendarDate(2, 12, 30) }, // Tue 12:30
    { id: 'cal14', service: SERVICES[5], professional: PROFESSIONALS[2], client: CLIENTS[5], date: getCalendarDate(6, 14) }, // Sat 14:00

    // Mariana Souza (p4)
    { id: 'cal7', service: SERVICES[0], professional: PROFESSIONALS[3], client: CLIENTS[1], date: getCalendarDate(5, 10) }, // Fri 10:00
    { id: 'cal8', service: SERVICES[1], professional: PROFESSIONALS[3], client: CLIENTS[4], date: getCalendarDate(6, 9, 30) }, // Sat 9:30
    { id: 'cal15', service: SERVICES[2], professional: PROFESSIONALS[3], client: CLIENTS[3], date: getCalendarDate(1, 11) }, // Mon 11:00
    { id: 'cal16', service: SERVICES[4], professional: PROFESSIONALS[3], client: CLIENTS[2], date: getCalendarDate(2, 16) }, // Tue 16:00
    { id: 'cal17', service: SERVICES[0], professional: PROFESSIONALS[3], client: CLIENTS[0], date: getCalendarDate(3, 13) }, // Wed 13:00
    { id: 'cal18', service: SERVICES[5], professional: PROFESSIONALS[3], client: CLIENTS[6], date: getCalendarDate(3, 13, 30) }, // Wed 13:30
    { id: 'cal19', service: SERVICES[1], professional: PROFESSIONALS[3], client: CLIENTS[1], date: getCalendarDate(4, 14) }, // Thu 14:00
];


export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
    openingTime: '09:00',
    closingTime: '19:00',
    workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
};