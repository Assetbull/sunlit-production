'use client';

/**
 * SunlitIcon — Enterprise-Grade Universal Icon Component
 * 
 * Maps both Material Symbol identifiers and standard icon names to
 * crisp, accessible Lucide SVG icons. Prevents any possibility of raw
 * text icon names leaking into the user interface.
 */

import React from 'react';
import {
  Sun,
  Zap,
  BatteryCharging,
  Compass,
  HardHat,
  ClipboardList,
  Activity,
  UserPlus,
  Users,
  Search,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Star,
  ShieldCheck,
  ShieldAlert,
  Lock,
  FileCheck,
  Globe,
  Calculator,
  TrendingUp,
  Menu,
  X,
  Link as LinkIcon,
  Mail,
  Phone,
  Calendar,
  Award,
  Layers,
  Wrench,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  Check,
  Sparkles,
  Building2,
  Flame,
  type LucideIcon,
} from 'lucide-react';

export type SunlitIconName = string;

const ICON_MAP: Record<string, LucideIcon> = {
  // Solar & Energy
  solar_power: Sun,
  sun: Sun,
  bolt: Zap,
  zap: Zap,
  battery_charging_full: BatteryCharging,
  battery: BatteryCharging,
  sparkles: Sparkles,
  flame: Flame,

  // Engineering & Digital Tools
  architecture: Compass,
  compass: Compass,
  construction: HardHat,
  hardhat: HardHat,
  assignment: ClipboardList,
  clipboard: ClipboardList,
  monitor: Activity,
  activity: Activity,
  calculate: Calculator,
  calculator: Calculator,
  trending_up: TrendingUp,
  layers: Layers,
  wrench: Wrench,
  sliders: SlidersHorizontal,

  // People & Network
  group_add: UserPlus,
  users: Users,
  building: Building2,

  // Search & Navigation
  search: Search,
  location_on: MapPin,
  map_pin: MapPin,
  arrow_forward: ArrowRight,
  arrow_right: ArrowRight,
  menu: Menu,
  close: X,
  link: LinkIcon,
  external_link: ExternalLink,
  chevron_down: ChevronDown,
  chevron_right: ChevronRight,

  // Trust & Verification
  verified: ShieldCheck,
  verified_user: ShieldCheck,
  shield_check: ShieldCheck,
  shield: ShieldCheck,
  shield_alert: ShieldAlert,
  lock: Lock,
  fact_check: FileCheck,
  check_circle: CheckCircle2,
  check: Check,
  star: Star,
  award: Award,
  workspace_premium: Award,
  info: Info,
  help: Info,

  // General & Contact
  public: Globe,
  globe: Globe,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  calendar_month: Calendar,
};

export interface SunlitIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'fill'> {
  name: string;
  size?: number | string;
  className?: string;
  fill?: boolean;
}

export function SunlitIcon({
  name,
  size = 20,
  className = '',
  fill = false,
  ...props
}: SunlitIconProps) {
  const normalizedKey = name.toLowerCase().trim().replace(/[\s-]+/g, '_');
  const IconComponent = ICON_MAP[normalizedKey] || Sun;

  return (
    <IconComponent
      size={size}
      className={`inline-block shrink-0 ${className} ${fill ? 'fill-current' : ''}`}
      aria-hidden="true"
      {...props}
    />
  );
}

export default SunlitIcon;
