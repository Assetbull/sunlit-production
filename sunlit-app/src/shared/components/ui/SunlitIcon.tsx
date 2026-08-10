'use client';

import React from 'react';
import {
  Sun,
  Timer,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  Circle,
  Home,
  Building2,
  Factory,
  Sprout,
  BatteryCharging,
  Cpu,
  Zap,
  Gauge,
  BarChart3,
  TrendingUp,
  Laptop,
  Utensils,
  Snowflake,
  Droplet,
  Refrigerator,
  Shirt,
  Lightbulb,
  X,
  Settings,
  HelpCircle,
  User,
  Wrench,
  CreditCard,
  ShoppingCart,
  Bookmark,
  MapPin,
  Grid,
  Hourglass,
  Sliders,
  ChevronDown,
  ChevronRight,
  RotateCw,
  RotateCcw,
  Lock,
  Info,
  Moon,
  Plus,
  Minus,
  Trash2,
  Pencil,
  Calendar,
  Leaf,
  Compass,
  Cloud,
  Mail,
  Send,
  FileText,
  LucideProps,
} from 'lucide-react';

export type SunlitIconName =
  | 'solar_power'
  | 'timer'
  | 'arrow_forward'
  | 'arrow_back'
  | 'check_circle'
  | 'check'
  | 'radio_button_unchecked'
  | 'home'
  | 'apartment'
  | 'storefront'
  | 'factory'
  | 'agriculture'
  | 'battery_charging_full'
  | 'battery_charging'
  | 'memory'
  | 'bolt'
  | 'offline_bolt'
  | 'speed'
  | 'analytics'
  | 'insights'
  | 'computer'
  | 'microwave'
  | 'ac_unit'
  | 'water_drop'
  | 'kitchen'
  | 'local_laundry_service'
  | 'lightbulb'
  | 'close'
  | 'settings'
  | 'help'
  | 'help_outline'
  | 'person'
  | 'handyman'
  | 'payments'
  | 'shopping_cart'
  | 'bookmark_add'
  | 'bookmark'
  | 'location_on'
  | 'grid_on'
  | 'hourglass_empty'
  | 'hourglass_top'
  | 'settings_applications'
  | 'expand_more'
  | 'arrow_drop_down'
  | 'chevron_right'
  | 'sync'
  | 'lock'
  | 'info'
  | 'wb_sunny'
  | 'bedtime'
  | 'add'
  | 'remove'
  | 'delete'
  | 'edit'
  | 'schedule'
  | 'calendar_month'
  | 'restart_alt'
  | 'task_alt'
  | 'eco'
  | 'leaf'
  | 'bar_chart'
  | 'explore'
  | 'cloud'
  | 'engineering'
  | 'mail'
  | 'send'
  | 'cable'
  | 'description';

interface SunlitIconProps extends Omit<LucideProps, 'ref'> {
  name: SunlitIconName | string;
  size?: number | string;
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  solar_power: Sun,
  wb_sunny: Sun,
  timer: Timer,
  arrow_forward: ArrowRight,
  arrow_back: ArrowLeft,
  check_circle: CheckCircle2,
  check: Check,
  radio_button_unchecked: Circle,
  home: Home,
  apartment: Building2,
  storefront: Building2,
  factory: Factory,
  agriculture: Sprout,
  battery_charging_full: BatteryCharging,
  battery_charging: BatteryCharging,
  memory: Cpu,
  bolt: Zap,
  offline_bolt: Zap,
  speed: Gauge,
  analytics: BarChart3,
  insights: TrendingUp,
  computer: Laptop,
  microwave: Utensils,
  ac_unit: Snowflake,
  water_drop: Droplet,
  kitchen: Refrigerator,
  local_laundry_service: Shirt,
  lightbulb: Lightbulb,
  close: X,
  settings: Settings,
  help: HelpCircle,
  help_outline: HelpCircle,
  person: User,
  handyman: Wrench,
  payments: CreditCard,
  shopping_cart: ShoppingCart,
  bookmark_add: Bookmark,
  bookmark: Bookmark,
  location_on: MapPin,
  grid_on: Grid,
  hourglass_empty: Hourglass,
  hourglass_top: Hourglass,
  settings_applications: Sliders,
  expand_more: ChevronDown,
  arrow_drop_down: ChevronDown,
  chevron_right: ChevronRight,
  sync: RotateCw,
  lock: Lock,
  info: Info,
  bedtime: Moon,
  add: Plus,
  remove: Minus,
  delete: Trash2,
  edit: Pencil,
  schedule: Calendar,
  calendar_month: Calendar,
  restart_alt: RotateCcw,
  task_alt: CheckCircle2,
  eco: Leaf,
  leaf: Leaf,
  bar_chart: BarChart3,
  explore: Compass,
  cloud: Cloud,
  engineering: Wrench,
  mail: Mail,
  send: Send,
  cable: Zap,
  description: FileText,
};

export function SunlitIcon({ name, size = 20, className = '', ...props }: SunlitIconProps) {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent size={size} className={`shrink-0 ${className}`} {...props} />;
}
