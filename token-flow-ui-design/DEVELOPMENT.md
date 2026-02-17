# TokenFlow Development Guide

Complete guide to understanding and extending the TokenFlow application architecture.

## Architecture Overview

TokenFlow follows a layered architecture emphasizing separation of concerns and scalability:

```
┌─────────────────────────────────────────┐
│         Next.js 16 App Router           │
│     (pages, routing, server actions)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         React Components                │
│  (app-layout, sidebar, header, pages)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      UI Component Library                │
│  (shadcn/ui buttons, cards, dropdowns)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Styling & Theme System            │
│  (Tailwind CSS + Design Tokens)         │
└─────────────────────────────────────────┘
```

## Directory Structure Deep Dive

### `/app` - Application Routes & Pages

The Next.js App Router structure handles all routing and page layouts:

```
app/
├── layout.tsx           # Root layout (HTML, fonts, metadata)
├── globals.css          # Global styles and CSS variables
├── page.tsx             # Dashboard (/ route)
├── tokens/
│   └── page.tsx         # Token management (/tokens)
├── analytics/
│   └── page.tsx         # Analytics (/analytics)
└── settings/
    └── page.tsx         # Settings (/settings)
```

**Key Concepts:**
- Each directory represents a route segment
- `page.tsx` is the actual page component
- `layout.tsx` wraps pages at that level
- Metadata exported from pages for SEO

### `/components` - Reusable Components

Organized by purpose and reusability:

```
components/
├── header.tsx           # Top navigation bar (client)
├── sidebar.tsx          # Side navigation (client)
├── app-layout.tsx       # Main layout wrapper (client)
├── tokens-table.tsx     # Token list component (client)
├── skeleton.tsx         # Loading placeholder
└── ui/                  # shadcn/ui library components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── dropdown-menu.tsx
    └── ... more UI components
```

**Component Types:**
1. **Layout Components** - Structure pages (header, sidebar, app-layout)
2. **Feature Components** - Feature-specific (tokens-table, settings-form)
3. **UI Components** - Reusable primitives (button, card, input)
4. **Utility Components** - Helper components (skeleton, badge)

### `/lib` - Utilities & Helpers

```
lib/
└── utils.ts             # cn() for className merging, other utilities
```

## Component Deep Dive

### AppLayout Component

The main layout wrapper that provides consistent structure across all pages:

```typescript
'use client'  // Client component for interactivity

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**Responsibilities:**
- Manages sidebar visibility state
- Coordinates header and sidebar
- Provides main content area
- Handles responsive layout

### Header Component

Sticky navigation bar with search and user menu:

**Features:**
- Logo and branding
- Search functionality
- Notification badge
- User profile dropdown
- Mobile menu toggle
- Accessibility attributes

**Client-side State:**
- Search query for real-time filtering
- Dropdown menu open/close

### Sidebar Component

Responsive navigation drawer:

**Features:**
- Active route indication
- Collapsible on mobile
- Help and support section
- Sign out button
- Semantic navigation structure

**Props:**
- `open: boolean` - Sidebar visibility state
- `onClose: () => void` - Callback to close sidebar

### TokensTable Component

Feature-rich token management table:

**Features:**
- Search and filter tokens
- Status badges with color coding
- Inline actions (copy, edit, delete)
- Responsive horizontal scroll
- Empty state handling

**State Management:**
- Local state for tokens array
- Search query state
- Form submission handling

## Styling Architecture

### CSS Variable System

Design tokens defined in `globals.css` using CSS custom properties:

```css
:root {
  /* Colors */
  --background: #0f0f14;
  --foreground: #f5f5f7;
  --primary: #5b4bff;
  
  /* Spacing */
  --radius: 0.75rem;
}
```

**Benefits:**
- Single source of truth for theme
- Easy dark mode support
- Consistent design across app
- Runtime customization possible

### Tailwind CSS Configuration

`tailwind.config.ts` maps design tokens to utility classes:

```typescript
colors: {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  primary: 'var(--primary)',
  // ...
}
```

### Responsive Design Patterns

Tailwind responsive prefixes for mobile-first development:

```typescript
// Example: Responsive padding
className="p-4 md:p-6 lg:p-8"

// Example: Responsive grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Example: Responsive display
className="hidden md:block"
```

## Type Safety with TypeScript

### Interface Patterns

All components use TypeScript interfaces for props:

```typescript
interface HeaderProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

interface TokensTableProps {
  // Props here
}

type Status = 'active' | 'inactive' | 'pending'
```

### Benefits
- IDE autocompletion
- Build-time error checking
- Self-documenting code
- Refactoring safety

## State Management Patterns

### Client-Side State
Used for UI interactivity with `useState`:

```typescript
const [sidebarOpen, setSidebarOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
const [tokens, setTokens] = useState<Token[]>(mockTokens)
```

### Data Flow
1. Parent component holds state
2. Props passed to children
3. Callbacks passed up for state updates
4. Lift state to nearest common parent

### Ready for Backend Integration
Current patterns support easy migration to:
- SWR for data fetching
- React Query for caching
- Server actions for mutations
- API routes for endpoints

## Accessibility Implementation

### Semantic HTML
Every page uses semantic elements:
- `<header>` for navigation
- `<main>` for content
- `<nav>` for navigation
- `<section>` for content sections
- `<table>` for tabular data

### ARIA Attributes
Interactive elements include ARIA:
- `aria-label` - Descriptive labels
- `aria-expanded` - Menu states
- `aria-hidden` - Decorative elements
- Proper heading hierarchy

### Keyboard Navigation
- Tab order: logical and visible
- Focus visible on all interactive elements
- Dropdowns navigable with keyboard
- Escape key closes menus

### Color Contrast
- Primary text: 10:1 contrast ratio (AAA)
- Secondary text: 7:1 contrast ratio (AA)
- Interactive elements: 4.5:1 ratio (AA)

## Performance Considerations

### Current Optimizations
1. **CSS Optimization**
   - Tailwind purges unused styles
   - CSS variables reduce duplication

2. **Code Organization**
   - Components split logically
   - Tree-shaking enabled

3. **Bundle Size**
   - Minimal dependencies
   - Icons: Lucide React (tree-shakeable)
   - UI: shadcn/ui (copy-paste)

### Future Optimizations
1. **Image Optimization**
   ```typescript
   import Image from 'next/image'
   <Image src={src} alt={alt} priority />
   ```

2. **Dynamic Imports**
   ```typescript
   const Component = dynamic(() => import('./Component'))
   ```

3. **Route Prefetching**
   - Next.js prefetches links automatically
   - Use `prefetch` attribute for control

4. **Data Caching**
   - Implement SWR for API data
   - Use React.memo for expensive components

## Testing Strategy

### Testing Patterns (Ready to Implement)

1. **Unit Tests**
   ```typescript
   describe('TokensTable', () => {
     it('filters tokens by search query', () => {
       // Test logic
     })
   })
   ```

2. **Component Tests**
   ```typescript
   describe('Header', () => {
     it('opens user menu on click', () => {
       // Test interaction
     })
   })
   ```

3. **E2E Tests**
   - Playwright for full user flows
   - Test navigation and interactions

## Extending the Application

### Adding a New Page

1. Create directory: `app/new-feature/`
2. Create page file: `app/new-feature/page.tsx`
3. Wrap with AppLayout:
   ```typescript
   export default function NewFeaturePage() {
     return (
       <AppLayout>
         {/* Content */}
       </AppLayout>
     )
   }
   ```

### Adding a New Component

1. Create in `components/new-component.tsx`
2. Define interface:
   ```typescript
   interface NewComponentProps {
     // Props here
   }
   ```
3. Implement component
4. Export for reuse

### Adding Theme Variations

1. Update CSS variables in `globals.css`
2. Test across light/dark themes
3. Ensure sufficient contrast
4. Update tailwind.config.ts if needed

### Adding New Features

1. **API Integration**
   - Create API route in `app/api/`
   - Use Server Actions for mutations

2. **Form Handling**
   - Use native form elements
   - Implement validation
   - Handle loading/error states

3. **Data Fetching**
   - Ready for SWR integration
   - Consider caching strategy
   - Handle loading/error states

## Common Patterns

### Loading States
```typescript
{isLoading ? (
  <Skeleton className="h-12 w-full" />
) : (
  <Component />
)}
```

### Error Handling
```typescript
{error ? (
  <Card className="bg-destructive/10 border-destructive/20 p-4">
    <p className="text-destructive">{error.message}</p>
  </Card>
) : null}
```

### Conditional Rendering
```typescript
{isActive && <Badge>Active</Badge>}
```

### Responsive Components
```typescript
<div className="hidden md:block">
  Desktop only content
</div>
```

## Performance Monitoring

### Ready to Implement
1. **Web Vitals**
   - Use `next/analytics` for Core Web Vitals
   - Monitor in production

2. **Error Tracking**
   - Integration point for Sentry
   - User session tracking

3. **Performance Profiling**
   - React DevTools Profiler
   - Chrome DevTools Performance tab

## Deployment Checklist

- [ ] All TypeScript types strict
- [ ] No console errors in production
- [ ] Responsive design tested on mobile
- [ ] Accessibility tested with keyboard
- [ ] Meta tags and SEO optimized
- [ ] Environment variables configured
- [ ] Build completes without warnings
- [ ] Performance budget met
- [ ] Security headers configured
- [ ] Analytics configured

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm dev -- -p 3001  # Custom port

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Type Checking
pnpm tsc --noEmit     # Check types

# Cleaning
rm -rf .next          # Clear cache
pnpm install          # Fresh install
```

## Debugging Tips

1. **React DevTools**
   - Inspect component tree
   - Check props and state
   - Profile performance

2. **Browser DevTools**
   - Network tab for API calls
   - Console for errors
   - Elements for DOM inspection

3. **TypeScript**
   - Hover over code for types
   - Check for type errors
   - Use inference when helpful

4. **Console Logging**
   ```typescript
   console.log('[v0] Debug message:', data)
   ```

## Further Reading

- [Next.js 16 Documentation](https://nextjs.org)
- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

Last Updated: February 2026
