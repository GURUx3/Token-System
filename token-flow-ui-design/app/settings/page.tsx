'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bell, Lock, User, Palette, Database, Key, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings.
          </p>
        </div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-1 bg-card border border-border rounded-lg p-3">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                        Change Avatar
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name
                        </label>
                        <Input
                          defaultValue="Alex"
                          className="bg-muted border-muted text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name
                        </label>
                        <Input
                          defaultValue="Johnson"
                          className="bg-muted border-muted text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        defaultValue="alex@example.com"
                        className="bg-muted border-muted text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bio
                      </label>
                      <textarea
                        defaultValue="Design system enthusiast and token management expert"
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-muted text-foreground placeholder:text-muted-foreground"
                        rows={3}
                      />
                    </div>

                    <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Security</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="bg-muted border-muted text-foreground pr-10"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-muted border-muted text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-muted border-muted text-foreground"
                      />
                    </div>

                    <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border border-destructive/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </Card>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        label: 'Email Notifications',
                        description: 'Receive important updates via email',
                      },
                      {
                        label: 'Token Updates',
                        description: 'Get notified when tokens are modified',
                      },
                      {
                        label: 'Team Activity',
                        description: 'Receive team collaboration notifications',
                      },
                      {
                        label: 'Weekly Digest',
                        description: 'Get a weekly summary of your tokens',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={notificationsEnabled}
                          className="h-5 w-5 rounded border-border accent-primary"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Theme</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Theme Preference
                      </label>
                      <Select>
                        <SelectTrigger className="bg-muted border-muted text-foreground">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="dark" className="text-foreground">
                            Dark Mode
                          </SelectItem>
                          <SelectItem value="light" className="text-foreground">
                            Light Mode
                          </SelectItem>
                          <SelectItem value="system" className="text-foreground">
                            System Default
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Accent Color
                      </label>
                      <div className="flex gap-3">
                        {['#5b4bff', '#00d4ff', '#4bffcb', '#ff6b6b', '#ffa944'].map((color) => (
                          <button
                            key={color}
                            className="h-10 w-10 rounded-lg border-2 border-transparent hover:border-foreground"
                            style={{ backgroundColor: color }}
                            aria-label={`Select ${color} color`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
