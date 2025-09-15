import React, { useState, useEffect } from 'react';
import { Professional, Service } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import * as api from '../../api';
import { TableSkeleton, CardSkeleton } from '../ui/Skeleton';

const emptyProfessional: Professional = {id: '', name: '', avatarUrl: '', specialties: []};

export const AdminProfessionals: React.FC = () => {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profsData, servicesData] = await Promise.all([
                    api.getProfessionals(),
                    api.getServices()
                ]);
                setProfessionals(profsData);
                setServices(servicesData);
            } catch (error) {
                addToast('Falha ao carregar dados.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [addToast]);

    const openModalToAdd = () => {
        setEditingProfessional(emptyProfessional);
        setIsModalOpen(true);
    };

    const openModalToEdit = (prof: Professional) => {
        setEditingProfessional(prof);
        setIsModalOpen(true);
    };
    
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingProfessional) return;
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const selectedSpecialties = formData.getAll('specialties') as string[];

        const professionalData: Professional = {
            ...editingProfessional,
            name: formData.get('name') as string,
            specialties: selectedSpecialties,
        };
        
        try {
            const savedProf = await api.saveProfessional(professionalData);
            if (editingProfessional.id) {
                setProfessionals(professionals.map(p => p.id === savedProf.id ? savedProf : p));
            } else {
                setProfessionals([...professionals, savedProf]);
            }
            addToast(`Profissional "${savedProf.name}" salvo com sucesso!`, 'success');
            setIsModalOpen(false);
            setEditingProfessional(null);
        } catch (error) {
            addToast('Falha ao salvar profissional.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este profissional?')) {
            setDeletingId(id);
            try {
                await api.deleteProfessional(id);
                setProfessionals(professionals.filter(p => p.id !== id));
                addToast('Profissional excluído com sucesso.', 'success');
            } catch (error) {
                addToast('Falha ao excluir profissional.', 'error');
            } finally {
                setDeletingId(null);
            }
        }
    }

    const getSpecialtyNames = (specialtyIds: string[]) => {
        return specialtyIds.map(specId => services.find(s => s.id === specId)?.name).filter(Boolean).join(', ');
    }

    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">Gerenciar Profissionais</h2>
                    <Button className="w-full md:w-auto" onClick={openModalToAdd}>
                        <i className="fas fa-plus mr-2"></i>
                        Adicionar Novo Profissional
                    </Button>
                </div>
            </header>

            <div className="p-4 md:p-6">
                <div className="bg-white p-5 rounded-xl shadow-md">
                     {isLoading ? (
                        <>
                           <div className="hidden md:block"><TableSkeleton columns={3} /></div>
                           <div className="md:hidden"><CardSkeleton /></div>
                        </>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Especialidades</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {professionals.map(prof => (
                                            <tr key={prof.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 text-base text-gray-800 font-medium flex items-center gap-3">
                                                    <img src={prof.avatarUrl} alt={prof.name} className="w-10 h-10 rounded-full object-cover"/>
                                                    {prof.name}
                                                </td>
                                                <td className="p-2 text-base text-gray-600">
                                                    {getSpecialtyNames(prof.specialties)}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(prof)}>Editar</Button>
                                                        <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => handleDelete(prof.id)} isLoading={deletingId === prof.id}>{deletingId === prof.id ? '' : 'Excluir'}</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="space-y-3 md:hidden">
                                {professionals.map(prof => (
                                    <div key={prof.id} className="p-3 border rounded-lg bg-gray-50">
                                        <div className="flex items-start gap-4">
                                            <img src={prof.avatarUrl} alt={prof.name} className="w-16 h-16 rounded-full object-cover"/>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg text-gray-800">{prof.name}</p>
                                                <p className="text-base text-gray-600 mt-1">
                                                    <span className="font-semibold text-gray-500">Especialidades: </span> 
                                                    {getSpecialtyNames(prof.specialties) || 'Nenhuma'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                                            <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(prof)}>Editar</Button>
                                            <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => handleDelete(prof.id)} isLoading={deletingId === prof.id}>{deletingId === prof.id ? '' : 'Excluir'}</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {editingProfessional && (
                 <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={editingProfessional.id ? 'Editar Profissional' : 'Novo Profissional'}
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <Input id="name" name="name" type="text" label="Nome Completo" defaultValue={editingProfessional.name} required />
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Especialidades</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                                {services.map((service: Service) => (
                                    <div key={service.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`service-${service.id}`}
                                            name="specialties"
                                            value={service.id}
                                            defaultChecked={editingProfessional.specialties.includes(service.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                        />
                                        <label htmlFor={`service-${service.id}`} className="ml-2 block text-base text-gray-900">{service.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4 border-t">
                            <Button type="submit" isLoading={isSubmitting}>Salvar</Button>
                            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};