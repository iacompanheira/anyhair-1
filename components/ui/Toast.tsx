
import React from 'react';
import { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  removeToast: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, removeToast }) => {
  const baseClasses = 'relative w-80 max-w-sm p-4 rounded-lg shadow-2xl text-white flex items-center justify-between';
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
  }

  return (
    <div className={`${baseClasses} ${typeClasses[toast.type]}`}>
        <div className="flex items-center gap-3">
            <i className={`fas ${icons[toast.type]} text-xl`}></i>
            <p className="text-sm font-medium">{toast.message}</p>
        </div>
      <button onClick={() => removeToast(toast.id)} className="ml-4 text-xl leading-none">&times;</button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};
