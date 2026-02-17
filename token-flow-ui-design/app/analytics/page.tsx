import { AppLayout } from '@/components/app-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp, BarChart3, PieChart, LineChart } from 'lucide-react'

export const metadata = {
  title: 'Analytics | TokenFlow',
  description: 'View detailed analytics and insights about your tokens',
}

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              Track token usage, performance metrics, and insights.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-2 mb-6">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 cursor-pointer"
          >
            Last 7 Days
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted border-border text-foreground hover:bg-muted cursor-pointer"
          >
            Last 30 Days
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted border-border text-foreground hover:bg-muted cursor-pointer"
          >
            Last 90 Days
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted border-border text-foreground hover:bg-muted cursor-pointer"
          >
            Custom
          </Badge>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Token Updates</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
                <p className="text-xs text-chart-3 mt-2">+12.5% from last week</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-chart-1">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Usage</p>
                <p className="text-2xl font-bold text-foreground">89.2%</p>
                <p className="text-xs text-chart-3 mt-2">+3.2% from last week</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-chart-2">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-chart-3 mt-2">+8.3% from last week</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-chart-3">
                <PieChart className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Growth Rate</p>
                <p className="text-2xl font-bold text-foreground">23.5%</p>
                <p className="text-xs text-chart-3 mt-2">+5.1% from last week</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-chart-4">
                <LineChart className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Token Usage Chart */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold text-foreground mb-6">Token Usage Trends</h2>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Chart visualization would render here with Recharts
                </p>
              </div>
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold text-foreground mb-6">Category Distribution</h2>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-border">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Pie chart would render here with Recharts
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Table */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Performing Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Token Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Usage Count
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Primary Blue', category: 'Color', usage: 847, growth: '+12.5%' },
                  { name: 'Spacing Unit', category: 'Dimension', usage: 654, growth: '+8.2%' },
                  { name: 'Body Large', category: 'Typography', usage: 521, growth: '+5.1%' },
                  { name: 'Shadow Elevation', category: 'Effect', usage: 412, growth: '+3.3%' },
                ].map((token, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{token.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{token.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{token.usage}</td>
                    <td className="px-4 py-3">
                      <span className="text-chart-3 font-medium">{token.growth}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
