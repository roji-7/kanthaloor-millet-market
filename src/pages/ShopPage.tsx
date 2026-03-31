import React, { useState } from 'react'
import { Page, PageHeader, PageTitle, PageBody, PageDescription, Button, Card, CardContent, Badge, SearchInput, EmptyState, toast } from '@blinkdotnew/ui'
import { ShoppingCart, Filter, Tag, Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { blink } from '../blink/client'
import { useNavigate } from '@tanstack/react-router'
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

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const addItem = useCart(state => state.addItem)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return await blink.db.products.list() as Product[]
    }
  })

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      unit: product.unit
    })
    toast.success(`${product.name} added to cart!`, {
      icon: <ShoppingCart className="h-4 w-4" />
    })
  }

  return (
    <Page>
      <PageHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <PageTitle>Millet Catalog</PageTitle>
            <PageDescription>Browse our selection of premium Kanthaloor millets</PageDescription>
          </div>
          <div className="w-full md:w-72">
            <SearchInput 
              placeholder="Search millets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>
      <PageBody>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-secondary animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">{product.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 rounded-xl h-12" 
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-xl h-12 w-12"
                      onClick={() => navigate({ to: '/product/$id', params: { id: product.id } })}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<Tag />}
            title="No products found"
            description="Try adjusting your search to find what you're looking for."
            action={{ label: 'Clear Search', onClick: () => setSearchQuery('') }}
          />
        )}
      </PageBody>
    </Page>
  )
}
