import type { Component } from 'vue'
import { ClipboardList, Compass, House, UserRound } from '@lucide/vue'

export interface NavItem {
  to: string
  label: string
  shortLabel: string
  icon: Component
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', shortLabel: 'Home', icon: House },
  { to: '/discover', label: 'Discover', shortLabel: 'Discover', icon: Compass },
  { to: '/applications', label: 'Applications', shortLabel: 'Applied', icon: ClipboardList },
  { to: '/profile', label: 'Profile', shortLabel: 'Profile', icon: UserRound },
]
