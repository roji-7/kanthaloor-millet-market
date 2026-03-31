import React from 'react'
import { Page, PageBody, Button, Card, CardContent, Badge, StatGroup, Stat } from '@blinkdotnew/ui'
import { ShoppingBag, ArrowRight, ShieldCheck, Leaf, Truck } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <Page>
      <PageBody className="p-0">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-primary/5">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000" 
              alt="Kanthaloor Farm" 
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="container relative z-10 text-center px-4 max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">100% Organic & Farm Fresh</Badge>
            <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6 leading-tight">
              Authentic Kanthaloor <br /> Millet Market
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Nutrient-rich, traditional millets grown with care in the misty hills of Kanthaloor. 
              Delivered directly from the farm to your kitchen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 h-14 text-lg" onClick={() => navigate({ to: '/shop' })}>
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 h-14 text-lg" onClick={() => navigate({ to: '/shop' })}>
                Explore Varieties
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background border-y">
          <div className="container px-4 mx-auto">
            <StatGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-secondary/30 rounded-2xl">
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Pesticide Free</h3>
                <p className="text-muted-foreground">Naturally grown using traditional farming techniques without harmful chemicals.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-secondary/30 rounded-2xl">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Nutrient Dense</h3>
                <p className="text-muted-foreground">Rich in essential minerals, fiber, and protein for a healthier lifestyle.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-secondary/30 rounded-2xl">
                <Truck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Direct Delivery</h3>
                <p className="text-muted-foreground">Straight from Kanthaloor farms to ensure maximum freshness and quality.</p>
              </div>
            </StatGroup>
          </div>
        </section>

        {/* Quick Shop CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center max-w-2xl">
            <h2 className="text-4xl font-serif mb-6">Ready to upgrade your diet?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of health-conscious families who have made the switch to traditional millets.
            </p>
            <Button size="lg" variant="secondary" className="px-10 h-14 text-lg" onClick={() => navigate({ to: '/shop' })}>
              View All Products
            </Button>
          </div>
        </section>
      </PageBody>
    </Page>
  )
}
