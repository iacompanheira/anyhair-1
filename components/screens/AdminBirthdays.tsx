import React from 'react';
import { User } from '../../types';
import { CLIENTS } from '../../constants';

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Helper to parse DD/MM/YYYY and get month index (0-11)
const getBirthMonth = (birthDateString: string): number => {
    const parts = birthDateString.split('/');
    if (parts.length < 2) return -1;
    return parseInt(parts[1], 10) - 1;
};

export const AdminBirthdays: React.FC = () => {
    // To match the screenshot, we'll pretend the current month is September
    const currentMonthIndex = 8; // 0 = January, 8 = September
    const currentMonthName = monthNames[currentMonthIndex];

    const currentMonthClients = CLIENTS.filter(client => getBirthMonth(client.birthday) === currentMonthIndex);
    
    // Group other clients by month
    const otherMonthsClients: { [key: number]: User[] } = {};
    CLIENTS.forEach(client => {
        const month = getBirthMonth(client.birthday);
        if (month !== currentMonthIndex && month !== -1) {
            if (!otherMonthsClients[month]) {
                otherMonthsClients[month] = [];
            }
            otherMonthsClients[month].push(client);
        }
    });

    // Sort months chronologically starting from the month after the current one
    const sortedOtherMonths = Object.keys(otherMonthsClients)
        .map(Number)
        .sort((a, b) => {
            const monthA = (a - currentMonthIndex + 12) % 12;
            const monthB = (b - currentMonthIndex + 12) % 12;
            return monthA - monthB;
        });

    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">Aniversariantes</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200">
                            <i className="fas fa-print"></i>
                            Imprimir Lista
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200">
                            <i className="fas fa-file-pdf"></i>
                            Salvar como PDF
                        </button>
                    </div>
                </div>
            </header>
            
            <div className="p-4 md:p-6 space-y-4">
                {/* Current Month Birthdays */}
                {currentMonthClients.length > 0 && (
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <i className="fas fa-star text-2xl text-pink-500"></i>
                            <h3 className="text-2xl font-bold text-pink-600">Aniversariantes de {currentMonthName}</h3>
                        </div>
                        <div className="space-y-4">
                            {currentMonthClients.map(client => (
                                <div key={client.id} className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0">
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{client.name}</p>
                                        <p className="text-base text-gray-500">{client.whatsapp}</p>
                                    </div>
                                    <p className="font-semibold text-lg text-gray-700">{client.birthday.substring(0, 5)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Months Birthdays */}
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Outros Meses</h3>
                    <div className="space-y-5">
                        {sortedOtherMonths.length > 0 ? sortedOtherMonths.map(monthIndex => (
                            <div key={monthIndex}>
                                <h4 className="font-bold text-lg text-gray-600 border-b pb-2 mb-3">{monthNames[monthIndex]}</h4>
                                <div className="space-y-3">
                                    {otherMonthsClients[monthIndex].map(client => (
                                        <div key={client.id} className="flex justify-between items-center text-base">
                                            <p className="text-gray-700">{client.name}</p>
                                            <p className="text-gray-500">{client.birthday.substring(0, 5)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : (
                           <p className="text-center text-gray-500 py-4">Nenhum outro aniversariante encontrado.</p> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};