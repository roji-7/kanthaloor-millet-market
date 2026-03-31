import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Button, Badge, Separator, EmptyState } from '@blinkdotnew/ui'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from '@tanstack/react-router'

export function CartDrawer() {
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart()
  const navigate = useNavigate()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-xl hover:bg-primary/10">
          <ShoppingCart className="h-6 w-6 text-primary" />
          {itemCount() > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full border-2 border-background">
              {itemCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full border-none shadow-2xl">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-serif text-primary">Your Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState 
                icon={<ShoppingCart />}
                title="Your cart is empty"
                description="Browse our organic millets and add some to your cart!"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden bg-secondary/30 shrink-0">
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-lg leading-tight">{item.name}</h4>
                      <p className="text-muted-foreground text-sm">Per {item.unit}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-2 py-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-8 space-y-4">
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium text-muted-foreground">Subtotal</span>
              <span className="font-bold text-2xl text-primary">${total().toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Shipping and taxes calculated at checkout
            </p>
            <Button size="lg" className="w-full h-14 text-lg rounded-2xl" onClick={() => navigate({ to: '/checkout' })}>
              Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
