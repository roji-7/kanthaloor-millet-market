import React from 'react'
import { Page, PageHeader, PageTitle, PageBody, Button, Card, CardContent, EmptyState, toast, Separator, Avatar, Persona, Badge } from '@blinkdotnew/ui'
import { ShoppingBag, LogOut, Package, MapPin, User, ChevronRight, Clock } from 'lucide-react'
import { useBlinkAuth } from '@blinkdotnew/react'
import { blink } from '../blink/client'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

interface Order {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  shippingAddress: string
}

export function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useBlinkAuth()
  const navigate = useNavigate()

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

  if (!isAuthenticated) {
    return (
      <Page>
        <PageBody className="flex items-center justify-center min-h-[60vh]">
          <EmptyState
            icon={<User />}
            title="Please sign in"
            description="You need to be signed in to view your profile and orders."
            action={{ label: 'Sign In', onClick: () => blink.auth.login() }}
          />
        </PageBody>
      </Page>
    )
  }

  const handleLogout = () => {
    blink.auth.logout()
    toast.success('Logged out successfully')
    navigate({ to: '/' })
  }

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      return await blink.db.orders.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      }) as Order[]
    },
    enabled: !!user?.id
  })

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <PageTitle>My Account</PageTitle>
          <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </PageHeader>
      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-secondary/20">
              <CardContent className="p-8 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white shadow-md">
                  <img src={user?.avatar || `https://avatar.vercel.sh/${user?.email}`} alt={user?.displayName} />
                </Avatar>
                <h2 className="text-2xl font-bold mb-1">{user?.displayName || 'Millet Lover'}</h2>
                <p className="text-muted-foreground mb-6">{user?.email}</p>
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-between h-14 px-4 bg-primary/5 text-primary">
                <div className="flex items-center"><Package className="mr-3 h-5 w-5" /> Orders</div>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-between h-14 px-4 hover:bg-secondary/50">
                <div className="flex items-center"><MapPin className="mr-3 h-5 w-5" /> Addresses</div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
              {isLoadingOrders ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-secondary/30 animate-pulse rounded-xl" />)}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-none shadow-sm hover:bg-secondary/10 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">Order #{order.id.slice(-6).toUpperCase()}</span>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground gap-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                </span>
                                <span className="h-1 w-1 bg-muted-foreground rounded-full" />
                                <span>Total: ${order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button variant="outline" size="sm" className="rounded-lg">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-8 text-center py-20">
                      <div className="bg-secondary/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">No orders yet</h4>
                      <p className="text-muted-foreground mb-6">Looks like you haven't made any purchases yet.</p>
                      <Button onClick={() => navigate({ to: '/shop' })}>Start Shopping</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </div>
      </PageBody>
    </Page>
  )
}
