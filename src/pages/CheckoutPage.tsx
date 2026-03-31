import React, { useState } from 'react'
import { Page, PageHeader, PageTitle, PageBody, Button, Card, CardContent, Input, Field, FieldLabel, toast, Container, Separator } from '@blinkdotnew/ui'
import { CreditCard, Truck, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useBlinkAuth } from '@blinkdotnew/react'
import { blink } from '../blink/client'
import { useNavigate } from '@tanstack/react-router'

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user, isAuthenticated } = useBlinkAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.displayName || '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  })

  if (items.length === 0) {
    return (
      <Page>
        <PageBody className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Button onClick={() => navigate({ to: '/shop' })}>Go Shopping</Button>
          </div>
        </PageBody>
      </Page>
    )
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      blink.auth.login()
      return
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zip) {
      toast.error('Please fill in all shipping details')
      return
    }

    setIsProcessing(true)
    
    try {
      // 1. Create Order
      const orderId = `order_${Math.random().toString(36).substr(2, 9)}`
      await blink.db.orders.create({
        id: orderId,
        userId: user.id,
        status: 'paid', // Mocking successful payment
        totalAmount: total(),
        shippingAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zip}`
      })

      // 2. Create Order Items
      await Promise.all(items.map(item => 
        blink.db.orderItems.create({
          id: `item_${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })
      ))

      toast.success('Order placed successfully!', {
        icon: <CheckCircle2 className="text-primary" />
      })
      clearCart()
      navigate({ to: '/profile' })
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/shop' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageTitle>Checkout</PageTitle>
        </div>
      </PageHeader>
      <PageBody>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div className="space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Shipping Details</h3>
                </div>
                
                <Card className="border-none shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <Field>
                      <FieldLabel>Full Name</FieldLabel>
                      <Input 
                        placeholder="Your Name" 
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Address</FieldLabel>
                      <Input 
                        placeholder="Street Address" 
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>City</FieldLabel>
                        <Input 
                          placeholder="City" 
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>ZIP Code</FieldLabel>
                        <Input 
                          placeholder="Zip" 
                          value={shippingAddress.zip}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                        />
                      </Field>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Payment Method</h3>
                </div>
                
                <Card className="border-none shadow-sm bg-secondary/20 border-2 border-primary/20">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">Mock Payment Mode</p>
                        <p className="text-sm text-muted-foreground">Order will be marked as paid</p>
                      </div>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Order Summary Section */}
            <div>
              <Card className="border-none shadow-sm sticky top-24">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex gap-3">
                          <span className="text-muted-foreground font-medium">{item.quantity}x</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${total().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-primary font-bold">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-xl pt-2">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">${total().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg rounded-2xl" 
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                  >
                    {isProcessing ? 'Processing...' : `Pay $${total().toFixed(2)}`}
                  </Button>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Secure encrypted checkout</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </PageBody>
    </Page>
  )
}
