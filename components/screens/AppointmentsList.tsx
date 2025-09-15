import React, { useState, useEffect } from 'react';
import { Appointment, UserRole } from '../../types';
import * as api from '../../api';
import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';

interface AppointmentsListProps {
  role: UserRole;
}

const clientVisitCounts: { [key: string]: number } = {
    'Ana Silva': 3,
    'Carla Dias': 8,
    'Mariana Lima': 1,
};

export const AppointmentsList: React.FC<AppointmentsListProps> = ({ role }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState<string | null>(null);
    const { addToast } = useToast();
    
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await api.getAppointments();
                // We only want to show future appointments here
                setAppointments(data.filter(a => a.date >= new Date()));
            } catch (error) {
                addToast('Falha ao carregar agendamentos.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, [addToast]);


    const handleCancel = async (id: string) => {
        if(window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
            setCancelingId(id);
            try {
                await api.cancelAppointment(id);
                setAppointments(appointments.filter(a => a.id !== id));
                addToast('Agendamento cancelado com sucesso.', 'success');
            } catch (error) {
                addToast('Falha ao cancelar agendamento.', 'error');
            } finally {
                setCancelingId(null);
            }
        }
    }

    const getOrdinalSuffix = () => {
        return 'ª';
    };

    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">
                        {role === 'admin' ? 'Agendamentos' : 'Meus Agendamentos'}
                    </h2>
                    {role === 'admin' && (
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200">
                                <i className="fas fa-print"></i>
                                Imprimir
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200">
                                <i className="fas fa-file-pdf"></i>
                                Baixar em PDF
                            </button>
                        </div>
                    )}
                </div>
            </header>
            
            <div className="p-4 md:p-6">
                <div className="bg-white p-5 rounded-xl shadow-lg">
                    <div className="space-y-3">
                        {isLoading ? <CardSkeleton count={3} /> :
                         appointments.length > 0 ? appointments.map(appt => {
                            const visitCount = clientVisitCounts[appt.client.name] || 1;
                            return (
                            <div key={appt.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-xl text-pink-700">{appt.service.name}</p>
                                    {role === 'admin' && 
                                        <div className="flex items-center gap-2 my-1">
                                            <p className="text-base text-gray-600"><strong>Cliente:</strong> {appt.client.name}</p>
                                            <span className="bg-gray-200 text-gray-600 text-sm font-semibold px-2 py-0.5 rounded-full">
                                                {visitCount}{getOrdinalSuffix()} visita
                                            </span>
                                        </div>
                                    }
                                    <p className="text-base text-gray-600"><strong>Profissional:</strong> {appt.professional.name}</p>
                                    <p className="text-base text-gray-500 mt-1">
                                        {appt.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                                        {' às '}
                                        {appt.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Button
                                        variant="ghost"
                                        className="!text-red-600 hover:!bg-red-50 !px-3 !py-1 text-base"
                                        onClick={() => handleCancel(appt.id)}
                                        isLoading={cancelingId === appt.id}
                                    >
                                       {cancelingId === appt.id ? '' : 'Cancelar'}
                                    </Button>
                                </div>
                            </div>
                        )}) : (
                            <p className="text-center text-gray-500 py-8">Nenhum agendamento futuro encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};