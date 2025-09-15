import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../../types';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import * as api from '../../api';

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const AdminSettingsPanel: React.FC = () => {
    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        api.getSettings().then(setSettings);
    }, []);

    const handleWorkingDaysChange = (dayIndex: number) => {
        if (!settings) return;
        const newWorkingDays = settings.workingDays.includes(dayIndex)
            ? settings.workingDays.filter(d => d !== dayIndex)
            : [...settings.workingDays, dayIndex];
        setSettings({ ...settings, workingDays: newWorkingDays.sort() });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        setIsSubmitting(true);
        try {
            await api.saveSettings(settings);
            addToast('Configurações salvas com sucesso!', 'success');
        } catch (error) {
            addToast('Falha ao salvar configurações.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!settings) {
        return (
            <div>
                 <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">Configurações do Salão</h2>
                </header>
                <div className="p-4 md:p-6">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-pulse">
                         <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                         <div className="h-10 bg-gray-200 rounded"></div>
                         <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                         <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <h2 className="text-[1.75rem] font-bold text-gray-800">Configurações do Salão</h2>
            </header>
            
            <div className="p-4 md:p-6">
                <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-5">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Horário de Funcionamento</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="openingTime" className="block text-base font-medium text-gray-700">Abertura</label>
                                <input 
                                    type="time" 
                                    id="openingTime" 
                                    value={settings.openingTime}
                                    onChange={e => setSettings({...settings, openingTime: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-base p-1.5"
                                />
                            </div>
                            <div>
                                <label htmlFor="closingTime" className="block text-base font-medium text-gray-700">Fechamento</label>
                                <input 
                                    type="time" 
                                    id="closingTime" 
                                    value={settings.closingTime}
                                    onChange={e => setSettings({...settings, closingTime: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-base p-1.5"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Dias de Trabalho</h3>
                        <div className="flex flex-wrap gap-3">
                            {daysOfWeek.map((day, index) => (
                                <div key={day} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`day-${index}`}
                                        checked={settings.workingDays.includes(index)}
                                        onChange={() => handleWorkingDaysChange(index)}
                                        className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                    />
                                    <label htmlFor={`day-${index}`} className="ml-2 block text-base text-gray-900">{day}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Button type="submit" isLoading={isSubmitting}>Salvar Alterações</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};