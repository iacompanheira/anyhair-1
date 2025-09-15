import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import * as api from '../../api';
import { TableSkeleton, CardSkeleton } from '../ui/Skeleton';

const emptyClient: User = { id: '', name: '', birthday: '', whatsapp: '', email: '' };

interface AdminClientsProps {
    onViewClient: (clientId: string) => void;
}

export const AdminClients: React.FC<AdminClientsProps> = ({ onViewClient }) => {
    const [clients, setClients] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<User | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await api.getClients();
                setClients(data);
            } catch (error) {
                addToast('Falha ao carregar clientes.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchClients();
    }, [addToast]);

    const openModalToAdd = () => {
        setEditingClient(emptyClient);
        setIsModalOpen(true);
    };

    const openModalToEdit = (client: User) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingClient) return;
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const clientData = {
            ...editingClient,
            name: formData.get('name') as string,
            birthday: formData.get('birthday') as string,
            whatsapp: formData.get('whatsapp') as string,
            email: formData.get('email') as string,
        };

        try {
            const savedClient = await api.saveClient(clientData);
            if (editingClient.id) {
                setClients(clients.map(c => c.id === savedClient.id ? savedClient : c));
            } else {
                setClients([...clients, savedClient]);
            }
            addToast(`Cliente "${savedClient.name}" salvo com sucesso!`, 'success');
            setIsModalOpen(false);
            setEditingClient(null);
        } catch (error) {
            addToast('Falha ao salvar cliente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este cliente?')) {
            setDeletingId(id);
            try {
                await api.deleteClient(id);
                setClients(clients.filter(c => c.id !== id));
                addToast('Cliente excluído com sucesso.', 'success');
            } catch (error) {
                addToast('Falha ao excluir cliente.', 'error');
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div>
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.75rem] font-bold text-gray-800">Gerenciar Clientes</h2>
                    <Button onClick={openModalToAdd}>
                        <i className="fas fa-plus mr-2"></i>
                        Adicionar Novo Cliente
                    </Button>
                </div>
            </header>
            
            <div className="p-4 md:p-6">
                <div className="bg-white p-5 rounded-xl shadow-md">
                    {isLoading ? (
                        <>
                            <div className="hidden md:block"><TableSkeleton columns={5} /></div>
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
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Aniversário (DD/MM)</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">WhatsApp</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                            <th className="p-2 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map(client => (
                                            <tr key={client.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onViewClient(client.id)}>
                                                <td className="p-2 text-base text-gray-800 font-medium">{client.name}</td>
                                                <td className="p-2 text-base text-gray-600">{client.birthday.substring(0, 5)}</td>
                                                <td className="p-2 text-base text-gray-600">{client.whatsapp}</td>
                                                <td className="p-2 text-base text-gray-600">{client.email}</td>
                                                <td className="p-2">
                                                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                        <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(client)}>Editar</Button>
                                                        <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => handleDelete(client.id)} isLoading={deletingId === client.id}>{deletingId === client.id ? '' : 'Excluir'}</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="space-y-3 md:hidden">
                                {clients.map(client => (
                                    <div key={client.id} className="p-3 border rounded-lg bg-gray-50" onClick={() => onViewClient(client.id)}>
                                        <div className="space-y-1">
                                            <p className="font-bold text-lg text-gray-800">{client.name}</p>
                                            <p className="text-base text-gray-600">
                                                <span className="font-semibold text-gray-500">Aniversário:</span> {client.birthday.substring(0, 5)}
                                            </p>
                                            <p className="text-base text-gray-600">
                                                <span className="font-semibold text-gray-500">WhatsApp:</span> {client.whatsapp}
                                            </p>
                                            <p className="text-base text-gray-600 break-all">
                                                <span className="font-semibold text-gray-500">Email:</span> {client.email}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                            <Button variant="ghost" className="text-pink-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => openModalToEdit(client)}>Editar</Button>
                                            <Button variant="ghost" className="text-red-600 text-base border border-gray-200 shadow-none rounded-md px-2 py-0.5" onClick={() => handleDelete(client.id)} isLoading={deletingId === client.id}>{deletingId === client.id ? '' : 'Excluir'}</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {editingClient && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={editingClient.id ? 'Editar Cliente' : 'Novo Cliente'}
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input id="name" name="name" type="text" label="Nome Completo" defaultValue={editingClient.name} required />
                            <Input id="birthday" name="birthday" type="text" label="Aniversário" placeholder="DD/MM/AAAA" defaultValue={editingClient.birthday} required />
                            <Input id="whatsapp" name="whatsapp" type="tel" label="WhatsApp" placeholder="(00) 00000-0000" defaultValue={editingClient.whatsapp} required />
                            <Input id="email" name="email" type="email" label="Email" defaultValue={editingClient.email} required />
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