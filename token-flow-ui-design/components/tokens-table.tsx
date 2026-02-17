'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, MoreVertical, Copy, Edit2, Trash2, Plus } from 'lucide-react'

interface Token {
  id: string
  name: string
  category: string
  value: string
  status: 'active' | 'inactive' | 'pending'
  usage: number
  lastModified: string
}

const mockTokens: Token[] = [
  {
    id: '1',
    name: 'Primary Blue',
    category: 'Color',
    value: '#5b4bff',
    status: 'active',
    usage: 247,
    lastModified: '2024-02-10',
  },
  {
    id: '2',
    name: 'Spacing Unit',
    category: 'Dimension',
    value: '8px',
    status: 'active',
    usage: 89,
    lastModified: '2024-02-09',
  },
  {
    id: '3',
    name: 'Body Large',
    category: 'Typography',
    value: '16px / 1.5',
    status: 'active',
    usage: 156,
    lastModified: '2024-02-08',
  },
  {
    id: '4',
    name: 'Accent Cyan',
    category: 'Color',
    value: '#00d4ff',
    status: 'pending',
    usage: 34,
    lastModified: '2024-02-07',
  },
  {
    id: '5',
    name: 'Shadow Elevation',
    category: 'Effect',
    value: '0 4px 6px rgba(0,0,0,0.1)',
    status: 'inactive',
    usage: 0,
    lastModified: '2024-02-06',
  },
]

const statusConfig = {
  active: { label: 'Active', color: 'bg-chart-3/10 text-chart-3 border-chart-3/20' },
  inactive: { label: 'Inactive', color: 'bg-muted text-muted-foreground border-border' },
  pending: { label: 'Pending', color: 'bg-chart-5/10 text-chart-5 border-chart-5/20' },
}

export function TokensTable() {
  const [tokens, setTokens] = useState<Token[]>(mockTokens)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setTokens(tokens.filter((t) => t.id !== id))
  }

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-muted text-foreground placeholder:text-muted-foreground"
              aria-label="Search tokens"
            />
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Create Token
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                  Value
                </th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                  Usage
                </th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <tr
                    key={token.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{token.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{token.category}</td>
                    <td className="px-6 py-4">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground">
                        {token.value.length > 20
                          ? token.value.substring(0, 20) + '...'
                          : token.value}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={statusConfig[token.status].color}
                      >
                        {statusConfig[token.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{token.usage}</td>
                    <td className="px-6 py-4 text-muted-foreground">{token.lastModified}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Token actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleCopy(token.value)}
                            className="cursor-pointer"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Value
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(token.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <p className="text-muted-foreground">No tokens found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing <span className="font-medium text-foreground">{filteredTokens.length}</span> of{' '}
          <span className="font-medium text-foreground">{tokens.length}</span> tokens
        </p>
      </div>
    </div>
  )
}
