import React from 'react'
import { Page, PageHeader, PageTitle, PageBody, Button, Card, CardContent, Badge, toast, Container, Separator } from '@blinkdotnew/ui'
import { ShoppingCart, ArrowLeft, CheckCircle2, Leaf, Shield, Truck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { blink } from '../blink/client'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCart } from '../hooks/useCart'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  unit: string
}

export function ProductPage() {
  const { id } = useParams({ from: '/product/$id' })
  const navigate = useNavigate()
  const addItem = useCart(state => state.addItem)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      return await blink.db.products.get(id) as Product
    }
  })

  if (isLoading) {
    return (
      <Page>
        <PageBody>
          <div className="animate-pulse flex flex-col md:flex-row gap-12 py-10">
            <div className="flex-1 aspect-square bg-secondary rounded-3xl" />
            <div className="flex-1 space-y-6">
              <div className="h-10 bg-secondary w-2/3" />
              <div className="h-6 bg-secondary w-1/4" />
              <div className="h-32 bg-secondary" />
            </div>
          </div>
        </PageBody>
      </Page>
    )
  }

  if (!product) {
    return (
      <Page>
        <PageBody className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate({ to: '/shop' })}>Back to Shop</Button>
          </div>
        </PageBody>
      </Page>
    )
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        unit: product.unit
      })
      toast.success(`${product.name} added to cart!`)
    }
  }

  return (
    <Page>
      <PageBody>
        <Container className="py-10">
          <Button 
            variant="ghost" 
            className="mb-8 pl-0 hover:pl-2 transition-all" 
            onClick={() => navigate({ to: '/shop' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Button>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            {/* Image Section */}
            <div className="flex-1">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 py-4">
              <div className="mb-8">
                <Badge variant="secondary" className="mb-4">{product.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-serif mb-4 text-primary">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-accent">${product.price.toFixed(2)}</span>
                  <Badge variant="outline" className="text-muted-foreground">Per {product.unit}</Badge>
                </div>
              </div>

              <div className="mb-10 text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="flex-1 h-14 text-lg rounded-2xl" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl">
                  Buy Now
                </Button>
              </div>

              <Separator className="mb-8" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span className="text-sm">Organic Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Farm Direct Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Safe & Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </PageBody>
    </Page>
  )
}
