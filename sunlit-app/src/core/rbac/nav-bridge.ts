import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  ArrowLeftRight,
  Flag,
  User,
  Search,
  Briefcase,
  HardHat,
  MessageCircle,
  FileText,
  Settings,
  Shield,
  Users,
  Wallet,
  Star,
  Building2,
} from 'lucide-react';
import { UserRole } from '@/shared/types/database';

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  isLocked?: boolean;
  badge?: number;
}

/**
 * Navigation Bridge — Role-Aware Dashboard Navigation
 *
 * GEMINI.md §3 Build Sequence: PO → Installer → CrewLink → EPC → Admin
 * Each role gets a curated navigation set matching their workflow.
 */
export function getNavigation(role: UserRole | undefined): NavItem[] {
  if (role === 'project_owner') {
    return [
      { label: 'Overview', href: '/dashboard/project-owner', icon: LayoutDashboard },
      { label: 'My Projects', href: '/dashboard/project-owner/projects', icon: FolderKanban },
      { label: 'Create RFQ', href: '/dashboard/project-owner/rfq/new', icon: PlusCircle },
      { label: 'Bids', href: '/dashboard/project-owner/bids', icon: ArrowLeftRight },
      { label: 'Contracts', href: '/dashboard/project-owner/contracts', icon: FileText },
      { label: 'Escrow Wallet', href: '/dashboard/project-owner/escrow', icon: Wallet },
      { label: 'Disputes', href: '/dashboard/project-owner/disputes', icon: Flag },
      { label: 'Reviews', href: '/dashboard/project-owner/reviews', icon: Star },
      { label: 'Messages', href: '/dashboard/project-owner/messages', icon: MessageCircle },
      { label: 'Profile', href: '/dashboard/project-owner/profile', icon: User },
      { label: 'Settings', href: '/dashboard/project-owner/settings', icon: Settings },
    ];
  }

  if (role === 'installer') {
    return [
      { label: 'Overview', href: '/dashboard/installer', icon: LayoutDashboard },
      { label: 'Marketplace', href: '/dashboard/installer/marketplace', icon: Search },
      { label: 'My Bids', href: '/dashboard/installer/bids', icon: ArrowLeftRight },
      { label: 'Active Projects', href: '/dashboard/installer/projects', icon: Briefcase },
      { label: 'Financial Center', href: '/dashboard/installer/financial-center', icon: Wallet },
      { label: 'CrewLink', href: '/dashboard/installer/crewlink', icon: HardHat },
      { label: 'Messages', href: '/dashboard/installer/messages', icon: MessageCircle },
      { label: 'Profile', href: '/dashboard/installer/profile', icon: User },
      { label: 'Settings', href: '/dashboard/installer/settings', icon: Settings },
    ];
  }

  if (role === 'crew_member') {
    return [
      { label: 'Job Board', href: '/dashboard/crewlink', icon: Search },
      { label: 'My Applications', href: '/dashboard/crewlink/applications', icon: FileText },
      { label: 'Active Jobs', href: '/dashboard/crewlink/active', icon: Briefcase },
      { label: 'Messages', href: '/dashboard/crewlink/messages', icon: MessageCircle },
      { label: 'Profile', href: '/dashboard/crewlink/profile', icon: User },
    ];
  }

  if (role === 'epc_contractor') {
    return [
      { label: 'Overview', href: '/dashboard/installer', icon: LayoutDashboard },
      { label: 'Marketplace', href: '/dashboard/installer/marketplace', icon: Search },
      { label: 'My Bids', href: '/dashboard/installer/bids', icon: ArrowLeftRight },
      { label: 'Active Projects', href: '/dashboard/installer/projects', icon: Briefcase },
      { label: 'External Projects', href: '/dashboard/installer/external-projects', icon: Building2 },
      { label: 'CrewLink', href: '/dashboard/installer/crewlink', icon: Users },
      { label: 'Financial Center', href: '/dashboard/installer/financial-center', icon: Wallet },
      { label: 'Messages', href: '/dashboard/installer/messages', icon: MessageCircle },
      { label: 'Profile', href: '/dashboard/installer/profile', icon: User },
      { label: 'Settings', href: '/dashboard/installer/settings', icon: Settings },
    ];
  }

  if (role === 'admin') {
    return [
      { label: 'Dashboard', href: '/dashboard/admin', icon: Shield },
      { label: 'Users', href: '/dashboard/admin/users', icon: Users },
      { label: 'Projects', href: '/dashboard/admin/projects', icon: FolderKanban },
      { label: 'Disputes', href: '/dashboard/admin/disputes', icon: Flag },
      { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    ];
  }

  return [];
}
