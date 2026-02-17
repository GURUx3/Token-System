import { AppLayout } from '@/components/app-layout'
import { TokensTable } from '@/components/tokens-table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Package, GitBranch } from 'lucide-react'

export const metadata = {
  title: 'Tokens | TokenFlow',
  description: 'Manage and organize your design tokens',
}

export default function TokensPage() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Design Tokens</h1>
          <p className="text-muted-foreground">
            Manage and organize all your design system tokens in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Tokens</p>
                <p className="text-2xl font-bold text-foreground">247</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-chart-1">
                <Zap className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Categories</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-chart-2">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-chart-3">
                <GitBranch className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            All Categories
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted border-border text-foreground hover:bg-muted cursor-pointer"
          >
            Color
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted border-border text-foreground hover:bg-muted cursor-pointer"
          >
            Typography
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted border-border text-foreground hover:bg-muted cursor-pointer"
          >
            Spacing
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted border-border text-foreground hover:bg-muted cursor-pointer"
          >
            Effects
          </Badge>
        </div>

        {/* Tokens Table */}
        <TokensTable />
      </div>
    </AppLayout>
  )
}
