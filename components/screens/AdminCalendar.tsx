import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../../api';
import { Professional, Appointment, Service } from '../../types';
import { Skeleton } from '../ui/Skeleton';

const OPENING_HOUR = 9;
const CLOSING_HOUR = 19;
const TIME_SLOTS_PER_HOUR = 2; // 30-minute slots

// Generate time labels for the day (e.g., "09:00", "09:30")
const timeLabels = Array.from({ length: (CLOSING_HOUR - OPENING_HOUR) * TIME_SLOTS_PER_HOUR }, (_, i) => {
    const hour = OPENING_HOUR + Math.floor(i / TIME_SLOTS_PER_HOUR);
    const minute = (i % TIME_SLOTS_PER_HOUR) * (60 / TIME_SLOTS_PER_HOUR);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const CalendarSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] text-center font-bold text-base text-gray-600 border-b">
                <div className="p-2 border-r"><Skeleton className="h-10 w-full" /></div>
                {Array.from({ length: 7 }).map((_, i) => (
                     <div key={i} className="p-2 border-r"><Skeleton className="h-10 w-full" /></div>
                ))}
            </div>
            <div className="grid grid-cols-[60px_repeat(7,1fr)] grid-rows-[repeat(20,minmax(40px,auto))]">
                 {timeLabels.map((_, timeIndex) => (
                   <React.Fragment key={timeIndex}>
                        <div className="text-xs text-right pr-2 row-start-1 col-start-1" style={{gridRow: timeIndex + 1}}>
                            <Skeleton className="h-4 w-8 inline-block" />
                        </div>
                        {Array.from({ length: 7 }).map((_, dayIndex) => (
                            <div key={dayIndex} className="border-r border-b" style={{gridRow: timeIndex+1, gridColumn: dayIndex+2}}></div>
                        ))}
                   </React.Fragment>
                ))}
            </div>
        </div>
    );
}


export const AdminCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profsData, apptsData, servicesData] = await Promise.all([
                    api.getProfessionals(),
                    api.getAppointments(),
                    api.getServices()
                ]);
                setProfessionals(profsData);
                setAppointments(apptsData);
                setServices(servicesData);
                if (profsData.length > 0) {
                    setSelectedProfessionalId(profsData[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch calendar data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const startOfWeek = useMemo(() => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - date.getDay());
        date.setHours(0, 0, 0, 0);
        return date;
    }, [currentDate]);

    const endOfWeek = useMemo(() => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + 6);
        date.setHours(23, 59, 59, 999);
        return date;
    }, [startOfWeek]);
    
    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    }), [startOfWeek]);

    const appointmentsBySlot = useMemo(() => {
        const filteredAppointments = appointments.filter(appt => 
            appt.professional.id === selectedProfessionalId &&
            appt.date >= startOfWeek &&
            appt.date <= endOfWeek
        );

        const map = new Map<string, Appointment[]>();
        filteredAppointments.forEach(appt => {
            const date = appt.date;
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(appt);
        });
        return map;
    }, [appointments, selectedProfessionalId, startOfWeek, endOfWeek]);
    
    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">Calendário</h2>
                     <div className="flex items-center gap-4">
                        {isLoading ? <Skeleton className="h-10 w-48" /> : (
                             <select
                                value={selectedProfessionalId}
                                onChange={(e) => setSelectedProfessionalId(e.target.value)}
                                className="px-3 py-2 bg-white text-gray-700 rounded-lg text-base font-medium shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        )}
                        <button onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)))} className="p-2 rounded-full hover:bg-gray-200">&lt;</button>
                        <span className="font-semibold text-lg text-gray-700 text-center w-40">
                            {startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - {endOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                        <button onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)))} className="p-2 rounded-full hover:bg-gray-200">&gt;</button>
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-6">
                {isLoading ? <CalendarSkeleton /> : (
                    <>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="grid grid-cols-[60px_repeat(7,1fr)] text-center font-bold text-base text-gray-600 border-b">
                                <div className="p-2 border-r"></div>
                                {weekDays.map(day => (
                                     <div key={day.toISOString()} className={`p-2 border-r ${new Date().toDateString() === day.toDateString() ? 'bg-pink-100' : ''}`}>
                                        <span className="hidden md:inline">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                                        <span className="md:hidden">{day.toLocaleDateString('pt-BR', { weekday: 'narrow' })}</span>
                                        <div className="text-xl">{day.getDate()}</div>
                                     </div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-[60px_repeat(7,1fr)] grid-rows-[repeat(20,minmax(40px,auto))] relative overflow-y-auto h-[65vh]">
                                 {timeLabels.map((time, timeIndex) => (
                                   <React.Fragment key={time}>
                                        <div className="text-xs text-gray-500 text-right pr-2 -mt-2.5 row-start-1 col-start-1" style={{gridRow: timeIndex + 1}}>
                                            {timeIndex % 2 === 0 && time}
                                        </div>
                                        {weekDays.map((day, dayIndex) => {
                                            const [hour, minute] = time.split(':').map(Number);
                                            const slotDate = new Date(day);
                                            slotDate.setHours(hour, minute);
                                            const key = `${slotDate.getFullYear()}-${slotDate.getMonth()}-${slotDate.getDate()}-${slotDate.getHours()}-${slotDate.getMinutes()}`;
                                            const appointmentsInSlot = appointmentsBySlot.get(key) || [];
        
                                            return (
                                                <div key={`${time}-${dayIndex}`} className="border-r border-b p-0.5" style={{gridRow: timeIndex+1, gridColumn: dayIndex+2}}>
                                                     <div className="flex flex-wrap gap-1 items-center justify-start h-full">
                                                        {appointmentsInSlot.map(appt => (
                                                            <div key={appt.id} className="relative group flex-shrink-0">
                                                                <div className={`w-3 h-3 rounded-full ${appt.service.color?.split(' ')[0]}`}></div>
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-lg bg-gray-800 text-white shadow-lg invisible group-hover:visible z-20 w-max max-w-xs transition-opacity opacity-0 group-hover:opacity-100 text-left">
                                                                    <p className="font-bold">{appt.service.name}</p>
                                                                    <p className="text-sm">Cliente: {appt.client.name}</p>
                                                                    <p className="text-sm">{appt.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({appt.service.duration} min)</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                   </React.Fragment>
                                ))}
                            </div>
                        </div>

                         {/* Legend */}
                        <div className="bg-white mt-4 p-4 rounded-lg shadow-lg">
                             <h3 className="text-lg font-semibold text-gray-800 mb-3">Legenda</h3>
                             <div className="flex flex-wrap gap-x-4 gap-y-2">
                                 {services.map(service => (
                                     <div key={service.id} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${service.color?.split(' ')[0]}`}></div>
                                        <span className="text-sm text-gray-600">{service.name}</span>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};