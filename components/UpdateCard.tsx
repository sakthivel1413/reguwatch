
import React from 'react';
import { RegUpdate } from '../types';
import { REGULATOR_INFO } from '../constants';

interface Props {
  update: RegUpdate;
}

const UpdateCard: React.FC<Props> = ({ update }) => {
  const info = REGULATOR_INFO[update.regulator];
  
  const impactColors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`${info.color} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider`}>
            {update.regulator}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${impactColors[update.impactLevel]}`}>
            {update.impactLevel} Impact
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
          {update.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {update.summary}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-slate-400 text-xs font-medium">{update.date}</span>
          <a 
            href={update.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1"
          >
            Official Source
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;
