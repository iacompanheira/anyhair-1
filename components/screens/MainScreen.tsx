// FIX: Import useRef and useEffect from react to manage scroll behavior.
import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import { ScheduleFlow } from './ScheduleFlow';
import { AdminServices } from './AdminServices';
import { AdminSettingsPanel } from './AdminSettings';
import { AppointmentsList } from './AppointmentsList';
import { AdminClients } from './AdminClients';
import { AdminReports } from './AdminReports';
import { AdminProfessionals } from './AdminProfessionals';
import { AdminBirthdays } from './AdminBirthdays';
import { AdminCalendar } from './AdminCalendar';
import { ClientDetail } from './ClientDetail';


type AppView = 'schedule' | 'appointments' | 'calendar' | 'reports' | 'clients' | 'professionals' | 'services_admin' | 'birthdays' | 'settings_admin';

interface SidebarLinkProps {
    icon: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
            isActive
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-pink-100 hover:text-pink-800'
        }`}
    >
        <i className={`fa-solid ${icon} w-6 text-center`}></i>
        <span className="font-semibold text-base">{label}</span>
    </button>
);


interface MainScreenProps {
  userRole: UserRole;
  onLogout: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ userRole, onLogout }) => {
    const [currentView, setCurrentView] = useState<AppView>(userRole === 'admin' ? 'appointments' : 'schedule');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const mainContentRef = useRef<HTMLElement>(null);

    // Effect to scroll the main content area to the top whenever the view changes.
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [currentView, selectedClientId]);


    const handleViewClient = (clientId: string) => {
        setSelectedClientId(clientId);
    }
    
    const handleBackToList = () => {
        setSelectedClientId(null);
    }

    const renderContent = () => {
        if (selectedClientId) {
            return <ClientDetail clientId={selectedClientId} onBack={handleBackToList} />
        }

        switch (currentView) {
            case 'schedule':
                return <ScheduleFlow />;
            case 'appointments':
                return <AppointmentsList role={userRole} />;
            case 'calendar':
                return <AdminCalendar />;
            case 'reports':
                return <AdminReports />;
            case 'clients':
                return <AdminClients onViewClient={handleViewClient} />;
            case 'professionals':
                return <AdminProfessionals />;
            case 'services_admin':
                 return <AdminServices />;
            case 'birthdays':
                return <AdminBirthdays />;
            case 'settings_admin':
                return <AdminSettingsPanel />;
            default:
                return <AppointmentsList role={userRole} />;
        }
    };
    
    const adminMenu = [
        { view: 'appointments', icon: 'fa-calendar-check', label: 'Agendamentos' },
        { view: 'schedule', icon: 'fa-calendar-plus', label: 'Agendar Serviço' },
        { view: 'calendar', icon: 'fa-calendar-alt', label: 'Calendário' },
        { view: 'reports', icon: 'fa-chart-line', label: 'Relatórios' },
        { view: 'clients', icon: 'fa-users', label: 'Clientes' },
        { view: 'professionals', icon: 'fa-user-tie', label: 'Profissionais' },
        { view: 'services_admin', icon: 'fa-cut', label: 'Serviços' },
        { view: 'birthdays', icon: 'fa-birthday-cake', label: 'Aniversários' },
        { view: 'settings_admin', icon: 'fa-cog', label: 'Configurações' },
        { view: 'logout', icon: 'fa-sign-out-alt', label: 'Sair' },
    ];
    
    const customerMenu = [
        { view: 'schedule', icon: 'fa-calendar-plus', label: 'Agende o Serviço' },
        { view: 'appointments', icon: 'fa-calendar-check', label: 'Meus Agendamentos' },
        { view: 'logout', icon: 'fa-sign-out-alt', label: 'Sair' },
    ];

    const menuItems = userRole === 'admin' ? adminMenu : customerMenu;
    
    const handleLinkClick = (view: AppView) => {
        setSelectedClientId(null); // Reset client detail view when changing main view
        setCurrentView(view);
        setIsSidebarOpen(false); // Close sidebar on mobile after navigation
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsSidebarOpen(false);
    }

    return (
        <div className="h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside 
                className={`
                    bg-white p-6 flex flex-col shadow-lg fixed md:relative inset-y-0 left-0 z-30
                    w-64 transform transition-transform duration-300 ease-in-out flex-shrink-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                `}
            >
                <div className="text-center mb-10">
                    <h1 className="text-[2rem] font-bold tracking-tight text-gray-900">
                        Any <span className="text-pink-600">Hair</span>
                    </h1>
                    <p className="text-base text-gray-500 mt-1">Painel de Controle</p>
                </div>
                <nav className="flex-grow space-y-2">
                    {menuItems.map(item => (
                        <SidebarLink 
                            key={item.view}
                            icon={item.icon} 
                            label={item.label}
                            isActive={currentView === item.view} 
                            onClick={item.view === 'logout' ? handleLogoutClick : () => handleLinkClick(item.view as AppView)}
                        />
                    ))}
                </nav>
            </aside>
            
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header and Nav Buttons */}
                <div className="md:hidden bg-white shadow-sm z-20 sticky top-0">
                    <header className="p-4 flex items-center">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 focus:outline-none mr-4" aria-label="Abrir menu">
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Any <span className="text-pink-600">Hair</span>
                        </h1>
                    </header>
                    <nav className="p-1.5 border-t border-gray-200">
                        <div className="flex flex-wrap gap-1.5">
                            {menuItems.map(item => (
                                <button
                                    key={item.view}
                                    onClick={item.view === 'logout' ? handleLogoutClick : () => handleLinkClick(item.view as AppView)}
                                    className={`
                                        flex-shrink-0 px-3.5 py-1.5 text-base font-medium rounded-full transition-colors
                                        ${currentView === item.view
                                            ? 'bg-pink-600 text-white shadow'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
                
                <main ref={mainContentRef} className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};