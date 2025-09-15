import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import * as api from '../../api';
import { TableSkeleton, CardSkeleton } from '../ui/Skeleton';

const emptyService: Service = {id: '', name: '', duration: 30, price: 0, description: ''};

export const AdminServices: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.getServices();
                setServices(data);
            } catch (error) {
                addToast('Falha ao carregar serviços.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, [addToast]);
    
    const openModalToAdd = () => {
        setEditingService(emptyService);
        setIsModalOpen(true);
    }

    const openModalToEdit = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingService) return;
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const serviceData = {
            ...editingService,
            name: formData.get('name') as string,
            duration: Number(formData.get('duration')),
            price: Number(formData.get('price')),
            description: formData.get('description') as string,
        };

        try {
            const savedService = await api.saveService(serviceData);
            if (editingService.id) {
                setServices(services.map(s => s.id === savedService.id ? savedService : s));
            } else {
                setServices([...services, savedService]);
            }
            addToast(`Serviço "${savedService.name}" salvo com sucesso!`, 'success');
            setIsModalOpen(false);
            setEditingService(null);
        } catch(error) {
            addToast('Falha ao salvar serviço.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este serviço?')) {
            setDeletingId(id);
            try {
                await api.deleteService(id);
                setServices(services.filter(s => s.id !== id));
                addToast('Serviço excluído com sucesso.', 'success');
            } catch(error) {
                addToast('Falha ao excluir serviço.', 'error');
            } finally {
                setDeletingId(null);
            }
        }
    }

    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">Gerenciar Serviços</h2>
                    <Button onClick={openModalToAdd}>
                        <i className="fas fa-plus mr-2"></i>
                        Adicionar Novo Serviço
                    </Button>
                </div>
            </header>
            
            <div className="p-4 md:p-6">
                <div className="bg-white p-5 rounded-lg shadow-md">
                    {isLoading ? (
                        <>
                           <div className="hidden md:block"><TableSkeleton columns={4} /></div>
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
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Duração</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Preço</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map(service => (
                                            <tr key={service.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 text-base text-gray-800 font-medium">{service.name}</td>
                                                <td className="p-2 text-base text-gray-600">{service.duration} min</td>
                                                <td className="p-2 text-base text-gray-600">R$ {service.price.toFixed(2)}</td>
                                                <td className="p-2">
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(service)}>Editar</Button>
                                                        <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => handleDelete(service.id)} isLoading={deletingId === service.id}>{deletingId === service.id ? '' : 'Excluir'}</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="space-y-3 md:hidden">
                                {services.map(service => (
                                    <div key={service.id} className="p-3 border rounded-lg bg-gray-50">
                                        <div className="space-y-1">
                                            <p className="font-bold text-lg text-gray-800">{service.name}</p>
                                            <p className="text-base text-gray-600">
                                                <span className="font-semibold text-gray-500">Duração:</span> {service.duration} min
                                            </p>
                                            <p className="text-base text-gray-600">
                                                <span className="font-semibold text-gray-500">Preço:</span> R$ {service.price.toFixed(2)}
                                            </p>
                                            <p className="text-base text-gray-600 break-words">
                                                <span className="font-semibold text-gray-500">Descrição:</span> {service.description}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                                            <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(service)}>Editar</Button>
                                            <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => handleDelete(service.id)} isLoading={deletingId === service.id}>{deletingId === service.id ? '' : 'Excluir'}</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {editingService && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input id="name" name="name" type="text" label="Nome do Serviço" defaultValue={editingService.name} required/>
                            <Input id="description" name="description" type="text" label="Descrição" defaultValue={editingService.description} required/>
                            <Input id="duration" name="duration" type="number" label="Duração (min)" defaultValue={editingService.duration} required/>
                            <Input id="price" name="price" type="number" step="0.01" label="Preço (R$)" defaultValue={editingService.price} required/>
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