
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" role="status" aria-label="Carregando">
        <span className="sr-only">Carregando...</span>
    </div>
  );
};
