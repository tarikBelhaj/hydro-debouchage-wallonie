import React from 'react';
import { Phone, CalendarCheck } from 'lucide-react';
import { COMPANY_PHONE } from '../constants';

const StickyCallBtn: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex h-16">
        <a 
          href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center font-bold text-lg active:bg-green-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 animate-pulse" />
            <span>Appeler</span>
          </div>
          <span className="text-xs font-normal opacity-90">Urgence 24/7</span>
        </a>
        <a 
          href="#contact"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center font-bold text-lg active:bg-blue-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            <span>Devis</span>
          </div>
          <span className="text-xs font-normal opacity-90">Gratuit</span>
        </a>
      </div>
    </div>
  );
};

export default StickyCallBtn;