import React from 'react';
import { MapPin, Calendar, CreditCard, ChevronRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface ProjectListItemProps {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'disputed' | 'completed';
  progress: number;
  location: string;
  estCompletion: string;
  investment: string;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  id,
  title,
  description,
  status,
  progress,
  location,
  estCompletion,
  investment
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-primary';
      case 'pending': return 'text-tertiary';
      case 'disputed': return 'text-error';
      case 'completed': return 'text-green-600';
      default: return 'text-on-surface-variant';
    }
  };

  const getBadgeColor = () => {
      switch (status) {
          case 'active': return 'bg-emerald-100 text-emerald-800';
          case 'pending': return 'bg-tertiary/10 text-tertiary';
          case 'disputed': return 'bg-error/10 text-error';
          case 'completed': return 'bg-green-100 text-green-800';
          default: return 'bg-surface-variant text-on-surface-variant';
      }
  };

  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Link href={`/dashboard/project-owner/projects/${id}`} className="block">
      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-center gap-8 transition-all hover:bg-white/60 group border border-white/50 hover:border-primary/20 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle className="text-surface-variant" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
            <circle 
              className={`${getStatusColor()} transition-all duration-1000`} 
              cx="64" cy="64" fill="transparent" r="56" 
              stroke="currentColor" 
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold font-headline ${getStatusColor()}`}>{progress}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{title}</h4>
            <span className={`px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${getBadgeColor()}`}>
              {status}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin size={14} />
              {location}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Calendar size={14} />
              Est. Comp: {estCompletion}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <CreditCard size={14} />
              {investment}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
            <BarChart3 size={20} />
          </button>
          <button className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProjectListItem;
