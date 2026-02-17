'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Zap,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview and analytics',
  },
  {
    label: 'Tokens',
    href: '/tokens',
    icon: Zap,
    description: 'Manage your tokens',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
    description: 'Performance metrics',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configure preferences',
  },
]

const helpItems = [
  {
    label: 'Documentation',
    href: '#',
    icon: HelpCircle,
  },
  {
    label: 'Support',
    href: '#',
    icon: HelpCircle,
  },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40 overflow-y-auto',
          'md:relative md:top-0 md:z-0 md:translate-x-0 md:flex md:flex-col',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <nav className="flex-1 p-4 space-y-2">
          {/* Primary Navigation */}
          <div>
            <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Main
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent',
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.label}</p>
                      <p className="text-xs text-sidebar-foreground/60 truncate">
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-8 border-t border-sidebar-border">
            <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Help
            </p>
            {helpItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-200"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Get Help
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}
