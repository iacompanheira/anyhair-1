import React, { useState } from 'react';
import { Service, Professional } from '../../types';
import { SERVICES, PROFESSIONALS } from '../../constants';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import * as api from '../../api';

const getAvailableTimes = (date: Date, serviceDuration: number) => {
    // Mock available times for demonstration
    const times = [];
    let currentTime = new Date(date);
    currentTime.setHours(9, 0, 0, 0); // Opening time
    const closingTime = new Date(date);
    closingTime.setHours(19, 0, 0, 0);

    while (currentTime.getTime() + serviceDuration * 60000 <= closingTime.getTime()) {
        times.push(new Date(currentTime));
        currentTime.setTime(currentTime.getTime() + 30 * 60000); // 30 min intervals
    }
    return times;
};


export const ScheduleFlow: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();
    
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentYear, currentMonth, 1);
        if (newDate <= today) return; // Prevent going to past months
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    
    const handleToggleService = (service: Service) => {
        const isSelected = selectedServices.some(s => s.id === service.id);

        if (isSelected) {
            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
        } else {
            if (selectedServices.length < 2) {
                setSelectedServices([...selectedServices, service]);
            }
        }
    };

    const handleProceed = () => {
        if (selectedServices.length > 0) {
            setStep(2);
        }
    }

    const resetFlow = () => {
        setStep(1);
        setSelectedServices([]);
        setSelectedProfessional(null);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleConfirm = async () => {
        if (!selectedServices.length || !selectedProfessional || !selectedTime) return;
        setIsSubmitting(true);
        try {
            await api.saveAppointment(selectedServices, selectedProfessional, selectedTime);
            addToast('Agendamento confirmado com sucesso!', 'success');
            resetFlow();
        } catch (error) {
            addToast('Falha ao confirmar agendamento.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const availableProfessionals = PROFESSIONALS.filter(prof => 
        selectedServices.every(service => prof.specialties.includes(service.id))
    );
    
    const totalDuration = selectedServices.reduce((total, s) => total + s.duration, 0);
    const totalPrice = selectedServices.reduce((total, s) => total + s.price, 0);


    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <h2 className="text-[1.75rem] font-bold text-gray-800">Agende seu Horário</h2>
            </header>

            <div className="p-4 md:p-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    {/* Step 1: Select Service */}
                    {step === 1 && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-1">1. Escolha os Serviços</h3>
                            <p className="text-base text-gray-500 mb-6">Você pode selecionar até 2 serviços.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {SERVICES.map(service => {
                                    const isSelected = selectedServices.some(s => s.id === service.id);
                                    return (
                                        <div 
                                            key={service.id} 
                                            onClick={() => handleToggleService(service)}
                                            className={`p-5 border rounded-lg transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[170px] ${
                                                isSelected 
                                                    ? 'border-2 border-pink-600' 
                                                    : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
                                            }`}
                                        >
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800">{service.name}</h4>
                                                <p className="text-base text-gray-500">{service.duration} min - R$ {service.price.toFixed(2)}</p>
                                                <p className="text-base text-gray-600 mt-2">{service.description}</p>
                                            </div>
                                            {isSelected && (
                                                <div className="mt-4">
                                                    <Button 
                                                        onClick={(e) => { e.stopPropagation(); handleProceed(); }} 
                                                        fullWidth
                                                    >
                                                        Continuar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Professional */}
                    {step === 2 && selectedServices.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-700">2. Escolha o Profissional</h3>
                                <Button variant="ghost" onClick={() => setStep(1)}>
                                    <i className="fas fa-arrow-left mr-2"></i>Voltar
                                </Button>
                            </div>
                            {availableProfessionals.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {availableProfessionals.map(prof => (
                                        <div key={prof.id} onClick={() => { setSelectedProfessional(prof); setStep(3); }} className="flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-pink-50 hover:border-pink-500 transition">
                                            <img src={prof.avatarUrl} alt={prof.name} className="w-20 h-20 rounded-full object-cover" />
                                            <p className="mt-2 font-semibold text-lg">{prof.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">Nenhum profissional disponível para realizar este serviço.</p>
                            )}
                            <Button variant="secondary" onClick={() => setStep(1)} className="mt-6">Voltar</Button>
                        </div>
                    )}

                    {/* Step 3: Select Date & Time */}
                    {step === 3 && selectedProfessional && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-700">3. Escolha a Data e Hora</h3>
                                <Button variant="ghost" onClick={() => setStep(2)}>
                                    <i className="fas fa-arrow-left mr-2"></i>Voltar
                                </Button>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <Button onClick={handlePrevMonth} disabled={new Date(currentYear, currentMonth, 1) <= today} variant="ghost">&lt;</Button>
                                <span className="font-bold text-xl text-gray-800">{new Date(currentYear, currentMonth).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                                <Button onClick={handleNextMonth} variant="ghost">&gt;</Button>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-base">
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day} className="font-semibold text-gray-500">{day}</div>)}
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                                {Array.from({ length: daysInMonth }).map((_, day) => {
                                    const date = new Date(currentYear, currentMonth, day + 1);
                                    const isPast = date < new Date(today.toDateString());
                                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                                    return (
                                        <button key={day} onClick={() => !isPast && setSelectedDate(date)} disabled={isPast} className={`p-2 rounded-full ${isPast ? 'text-gray-300' : 'text-gray-700 hover:bg-pink-100'} ${isSelected ? 'bg-pink-600 text-white' : ''}`}>{day + 1}</button>
                                    );
                                })}
                            </div>
                            
                            {selectedDate && (
                                <div className="mt-6">
                                    <h4 className="font-semibold mb-2 text-lg text-gray-700">Horários disponíveis:</h4>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                        {getAvailableTimes(selectedDate, totalDuration).map(time => {
                                            const isSelected = selectedTime?.getTime() === time.getTime();
                                            return (
                                                <button key={time.toISOString()} onClick={() => {setSelectedTime(time); setStep(4);}} className={`p-2 border rounded-lg transition text-base ${isSelected ? 'bg-pink-600 text-white' : 'hover:bg-pink-100'}`}>
                                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            <Button variant="secondary" onClick={() => setStep(2)} className="mt-6">Voltar</Button>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && selectedServices.length > 0 && selectedProfessional && selectedDate && selectedTime && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-700">4. Confirme seu Agendamento</h3>
                                <Button variant="ghost" onClick={() => setStep(3)}>
                                    <i className="fas fa-arrow-left mr-2"></i>Voltar
                                </Button>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-lg space-y-2 text-lg">
                                <div>
                                    <strong>Serviços:</strong>
                                    <ul className="list-disc list-inside ml-2">
                                        {selectedServices.map(s => <li key={s.id}>{s.name}</li>)}
                                    </ul>
                                </div>
                                <p><strong>Profissional:</strong> {selectedProfessional.name}</p>
                                <p><strong>Data:</strong> {selectedDate.toLocaleDateString()}</p>
                                <p><strong>Hora:</strong> {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="text-2xl font-bold text-pink-600"><strong>Total:</strong> R$ {totalPrice.toFixed(2)}</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button variant="secondary" onClick={() => setStep(3)}>Voltar</Button>
                                <Button variant="primary" onClick={handleConfirm} isLoading={isSubmitting}>Confirmar Agendamento</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};