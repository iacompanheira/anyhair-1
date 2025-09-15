
import React from 'react';
import { UserRole } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900">
            Any <span className="text-pink-600">Hair</span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Seu agendamento de beleza, simplificado.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin('customer'); }}>
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
            <Input id="name" name="name" type="text" label="Nome" placeholder="Seu nome completo" required />
            <div className="grid grid-cols-2 gap-4">
                <Input id="birth-day" name="birth-day" type="text" label="Dia Aniv." placeholder="DD" required />
                <Input id="birth-month" name="birth-month" type="text" label="Mês Aniv." placeholder="MM" required />
            </div>
            <Input id="whatsapp" name="whatsapp" type="tel" label="WhatsApp" placeholder="(00) 00000-0000" required />
            <Input id="email-address" name="email" type="email" label="Email" autoComplete="email" required placeholder="seu@email.com" />
            <Input id="password" name="password" type="password" label="Senha" autoComplete="current-password" required placeholder="********" />
          </div>

          <div>
            <Button type="submit" fullWidth>
              Cadastrar e Entrar
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Ou continue com</span>
          </div>
        </div>
        <div>
          <Button variant="secondary" fullWidth className="flex items-center justify-center gap-2">
            <i className="fab fa-google"></i>
            Fazer cadastro com Gmail
          </Button>
        </div>
        <div className="text-center">
            <Button variant="ghost" onClick={() => onLogin('customer')}>
                Entrar sem cadastro
            </Button>
            <span className="mx-2 text-gray-400">|</span>
            <Button variant="ghost" onClick={() => onLogin('admin')}>
                Acessar como Dono(a)
            </Button>
        </div>
      </div>
    </div>
  );
};
