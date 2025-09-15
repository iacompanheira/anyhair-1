import React, { useState, useEffect } from 'react';
import { User, Appointment } from '../../types';
import * as api from '../../api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

const InfoCard: React.FC<{ client: User }> = ({ client }) => (
    <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Informações do Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-base">
            <div className="flex items-center gap-3">
                <i className="fas fa-user text-gray-400 w-5 text-center"></i>
                <span className="text-gray-700">{client.name}</span>
            </div>
            <div className="flex items-center gap-3">
                <i className="fas fa-envelope text-gray-400 w-5 text-center"></i>
                <a href={`mailto:${client.email}`} className="text-pink-600 hover:underline">{client.email}</a>
            </div>
            <div className="flex items-center gap-3">
                <i className="fas fa-birthday-cake text-gray-400 w-5 text-center"></i>
                <span className="text-gray-700">{client.birthday}</span>
            </div>
             <div className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-gray-400 w-5 text-center"></i>
                <a href={`https://wa.me/${client.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">{client.whatsapp}</a>
            </div>
        </div>
    </div>
);

const AppointmentHistory: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => (
    <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Agendamentos</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {appointments.length > 0 ? appointments.map(appt => (
                <div key={appt.id} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg text-gray-800">{appt.service.name}</p>
                        <p className="text-base text-gray-600">com {appt.professional.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{appt.date.toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-lg text-gray-700">R$ {appt.service.price.toFixed(2)}</p>
                    </div>
                </div>
            )) : (
                <p className="text-center text-gray-500 py-4">Nenhum histórico encontrado.</p>
            )}
        </div>
    </div>
)


export const ClientDetail: React.FC<ClientDetailProps> = ({ clientId, onBack }) => {
  const [client, setClient] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientData, appointmentsData] = await Promise.all([
          api.getClientById(clientId),
          api.getAppointmentsByClientId(clientId),
        ]);
        if (clientData) {
          setClient(clientData);
          setAppointments(appointmentsData);
        } else {
            addToast('Cliente não encontrado.', 'error');
            onBack();
        }
      } catch (error) {
        addToast('Falha ao carregar dados do cliente.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [clientId, addToast, onBack]);
  
  if (isLoading || !client) {
      return (
          <div className="p-4 md:p-6 space-y-6">
              <header className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-10 w-24" />
              </header>
              <div className="bg-white p-5 rounded-lg shadow-md">
                 <Skeleton className="h-6 w-1/3 mb-4" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                 </div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md">
                 <Skeleton className="h-6 w-1/3 mb-4" />
                 <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                 </div>
              </div>
          </div>
      )
  }

  return (
    <div>
      <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
        <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={onBack}>
                <i className="fas fa-arrow-left mr-2"></i> Voltar
            </Button>
            <h2 className="text-[1.75rem] font-bold text-gray-800">{client.name}</h2>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-4">
        <InfoCard client={client} />
        <AppointmentHistory appointments={appointments} />
      </div>
    </div>
  );
};