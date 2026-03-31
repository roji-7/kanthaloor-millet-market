import React from 'react'
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'
import { Toaster, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem } from '@blinkdotnew/ui'
import { Shell } from './Shell'
import { LayoutDashboard, ShoppingBag, User, Home, Package, Leaf, ShoppingCart } from 'lucide-react'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { ProfilePage } from './pages/ProfilePage'
import { CheckoutPage } from './pages/CheckoutPage'
import { CartDrawer } from './components/cart/CartDrawer'
import { Footer } from './components/layout/Footer'
import { useBlinkAuth } from '@blinkdotnew/react'
import { blink } from './blink/client'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <StoreShell>
      <HomePage />
    </StoreShell>
  ),
})

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: () => (
    <StoreShell>
      <ShopPage />
    </StoreShell>
  ),
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: () => (
    <StoreShell>
      <ProductPage />
    </StoreShell>
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <StoreShell>
      <ProfilePage />
    </StoreShell>
  ),
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: () => (
    <StoreShell>
      <CheckoutPage />
    </StoreShell>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute, shopRoute, productRoute, profileRoute, checkoutRoute])
const router = createRouter({ routeTree })
const navigate = (to: any) => router.navigate(to)

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function StoreShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useBlinkAuth()

  return (
    <Shell
      appName="Millet Market"
      sidebar={
        <Sidebar className="bg-primary text-primary-foreground border-none">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight">Millet Market</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarGroup>
              <SidebarItem 
                icon={<Home className="h-5 w-5" />} 
                label="Home" 
                href="/" 
                className="rounded-xl h-12 mb-1 hover:bg-white/10"
              />
              <SidebarItem 
                icon={<ShoppingBag className="h-5 w-5" />} 
                label="Shop" 
                href="/shop" 
                className="rounded-xl h-12 mb-1 hover:bg-white/10"
              />
              <SidebarItem 
                icon={<Package className="h-5 w-5" />} 
                label="Track Orders" 
                href="/profile" 
                className="rounded-xl h-12 mb-1 hover:bg-white/10"
              />
              <SidebarItem 
                icon={<User className="h-5 w-5" />} 
                label="Profile" 
                href="/profile" 
                className="rounded-xl h-12 mb-1 hover:bg-white/10"
              />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      }
    >
      <div className="flex flex-col h-full bg-background">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-20 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-8">
          <div className="flex h-full items-center justify-between">
            <div className="md:hidden w-10" /> {/* Spacer for mobile trigger */}
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary md:hidden" />
              <span className="text-xl font-serif font-bold text-primary md:hidden">Millet Market</span>
            </div>
            <div className="flex items-center gap-4">
              <CartDrawer />
              {isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-12 w-12 rounded-xl"
                  onClick={() => navigate({ to: '/profile' })}
                >
                  <User className="h-6 w-6 text-primary" />
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="rounded-xl h-11 px-6 border-primary/20 hover:bg-primary/10 text-primary font-bold"
                  onClick={() => blink.auth.login()}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
          <Footer />
        </main>
      </div>
    </Shell>
  )
}

export default function App() {
  return <RouterProvider router={router} />
}
