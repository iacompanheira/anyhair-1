import React, { useState } from 'react';

const StatCard = ({ title, value, colorClass }: { title: string; value: string; colorClass: string }) => (
    <div className="bg-white p-5 rounded-lg shadow-md text-center border border-gray-100">
        <p className="text-base text-gray-500">{title}</p>
        <p className={`text-[2rem] font-bold mt-2 ${colorClass}`}>{value}</p>
    </div>
);

const ChartPlaceholder = ({ title, labels }: { title: string; labels: string[] }) => (
    <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-44 bg-gray-50 border rounded-md flex items-end justify-around p-2">
            {/* This is a visual placeholder for a bar chart */}
        </div>
        <div className="flex justify-around mt-2 text-sm text-gray-500">
            {labels.map(label => <span key={label}>{label}</span>)}
        </div>
    </div>
);

const LineChartPlaceholder = ({ title, labels, dataPoints }: { title: string; labels: string[]; dataPoints: number[] }) => {
    const maxDataValue = Math.max(...dataPoints, 1); // Avoid division by zero
    const points = dataPoints.map((point, index) => {
        const x = (index / (dataPoints.length - 1)) * 100;
        const y = 100 - (point / maxDataValue) * 85 - 5; // 85% of height, with 5% top/bottom margin
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="h-44 bg-gray-50 border rounded-md p-4">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                        points={points}
                    />
                    {dataPoints.map((point, index) => {
                         const x = (index / (dataPoints.length - 1)) * 100;
                         const y = 100 - (point / maxDataValue) * 85 - 5;
                         return <circle key={index} cx={x} cy={y} r="2.5" fill="white" stroke="#ec4899" strokeWidth="1.5" />
                    })}
                </svg>
            </div>
            <div className="flex justify-around mt-2 text-sm text-gray-500">
                {labels.map(label => <span key={label}>{label}</span>)}
            </div>
        </div>
    );
};

const ReportListSection = ({ title, data, valueKey, valueSuffix, valueColorClass }: { title: string, data: any[], valueKey: string, valueSuffix: string, valueColorClass: string }) => (
    <div className="bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <ul className="space-y-1">
            {data.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="text-base text-gray-700">{item.name}</span>
                    <span className={`text-base font-semibold ${valueColorClass}`}>
                        {item[valueKey]} {valueSuffix}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

// Mock Data based on the screenshot
const servicesData = [
    { name: 'Corte Feminino', appointments: 2 },
    { name: 'Escova Progressiva', appointments: 2 },
    { name: 'Coloração Completa', appointments: 2 },
    { name: 'Manicure & Pedicure', appointments: 2 },
    { name: 'Hidratação Profunda', appointments: 1 },
];

const employeesData = [
    { name: 'Juliana Alves', appointments: 3 },
    { name: 'Beatriz Costa', appointments: 3 },
    { name: 'Mariana Souza', appointments: 2 },
    { name: 'Fernanda Lima', appointments: 2 },
];

const clientsData = [
    { name: 'Ana Silva', visits: 1 },
    { name: 'Carla Dias', visits: 1 },
    { name: 'Mariana Lima', visits: 1 },
    { name: 'Sofia Pereira', visits: 1 },
    { name: 'Joana Martins', visits: 1 },
    { name: 'Beatriz Almeida', visits: 1 },
    { name: 'Luísa Rocha', visits: 1 },
    { name: 'Inês Correia', visits: 1 },
    { name: 'Lara Gomes', visits: 1 },
];

export const AdminReports: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('Tudo');
    const filters = ['Tudo', '30 Dias', '90 Dias', 'Último Ano'];

    return (
        <div>
            {/* Header */}
            <header className="md:sticky top-0 z-10 bg-gray-100 px-4 md:px-8 py-5 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="text-[2rem] font-bold text-gray-800">Relatórios</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-3 py-1.5 text-base font-semibold rounded-md transition-colors ${
                                        activeFilter === filter ? 'bg-pink-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                         <div className="flex gap-2">
                             <select className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500">
                                <option>Todos Profissionais</option>
                                <option>Juliana Alves</option>
                                <option>Fernanda Lima</option>
                            </select>
                             <select className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500">
                                <option>Todos Serviços</option>
                                <option>Corte Feminino</option>
                                <option>Manicure & Pedicure</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200">
                                <i className="fas fa-print"></i>
                                Imprimir
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition text-base font-medium shadow-sm border border-gray-200">
                                <i className="fas fa-file-pdf"></i>
                                Baixar em PDF
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Faturamento no Período" value="R$ 1730.00" colorClass="text-pink-600" />
                    <StatCard title="Agendamentos no Período" value="10" colorClass="text-blue-600" />
                    <StatCard title="Ticket Médio" value="R$ 173.00" colorClass="text-green-600" />
                </div>

                {/* Charts */}
                <ChartPlaceholder title="Dias da Semana Mais Procurados" labels={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']} />
                <LineChartPlaceholder title="Mês com Maior Movimento" labels={['Jul/25', 'Ago/25', 'Set/25']} dataPoints={[1200, 1730, 1500]} />
                <ChartPlaceholder title="Horários Mais Procurados" labels={['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h']} />
                
                {/* Lists */}
                <ReportListSection title="Serviços Mais Solicitados" data={servicesData} valueKey="appointments" valueSuffix="agendamentos" valueColorClass="text-pink-600" />
                <ReportListSection title="Funcionários Mais Requisitados" data={employeesData} valueKey="appointments" valueSuffix="atendimentos" valueColorClass="text-blue-600" />
                <ReportListSection title="Clientes Mais Assíduos" data={clientsData} valueKey="visits" valueSuffix="visitas" valueColorClass="text-green-600" />
            </div>

        </div>
    );
};