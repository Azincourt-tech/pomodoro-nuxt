// Icon mappings for the application
// Using Iconify icon names
export const ICONS = {
  // Timer
  timer: 'lucide:timer',
  play: 'lucide:play',
  pause: 'lucide:pause',
  reset: 'lucide:rotate-ccw',
  
  // Navigation
  home: 'lucide:home',
  history: 'lucide:history',
  settings: 'lucide:settings',
  close: 'lucide:x',
  
  // User
  user: 'lucide:user',
  edit: 'lucide:edit',
  save: 'lucide:save',
  cancel: 'lucide:x-circle',
  github: 'mdi:github',
  
  // Challenges
  trophy: 'lucide:trophy',
  star: 'lucide:star',
  target: 'lucide:target',
  check: 'lucide:check',
  x: 'lucide:x',
  
  // Categories
  body: 'lucide:activity',
  eye: 'lucide:eye',
  drink: 'lucide:droplets',
  breathe: 'lucide:wind',
  posture: 'lucide:user-check',
  meditate: 'lucide:sparkles',
  walk: 'lucide:trending-up',
  
  // UI
  theme: 'lucide:palette',
  language: 'lucide:languages',
  moon: 'lucide:moon',
  sun: 'lucide:sun',
  bell: 'lucide:bell',
  smartphone: 'lucide:smartphone',
  share: 'lucide:share-2',
  info: 'lucide:info',
  alert: 'lucide:alert-circle',
  chevronRight: 'lucide:chevron-right',
  chevronDown: 'lucide:chevron-down',
  
  // Spotify
  spotify: 'mdi:spotify',
  music: 'lucide:music',
  
  // Focus
  maximize: 'lucide:maximize',
  minimize: 'lucide:minimize',
  zap: 'lucide:zap',
  
  // Level up
  celebration: 'lucide:party-popper',
  starFilled: 'lucide:star',
  
  // Fire for streak
  fire: 'lucide:flame',
  
  // Calendar
  calendar: 'lucide:calendar',
  
  // Help
  help: 'lucide:help-circle',
} as const

export type IconName = keyof typeof ICONS
