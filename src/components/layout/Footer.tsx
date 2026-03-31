import React from 'react'
import { Leaf, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-20 px-4 md:px-8 border-t border-white/10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight">Millet Market</span>
          </div>
          <p className="text-primary-foreground/70 leading-relaxed">
            Bringing the authentic taste and nutrition of Kanthaloor millets to your doorstep. 
            Grown with love, packed with health.
          </p>
          <div className="flex gap-4">
            <ButtonIcon icon={<Instagram />} />
            <ButtonIcon icon={<Twitter />} />
            <ButtonIcon icon={<Facebook />} />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-primary-foreground/70">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Shop All</Link></li>
            <li><Link to="/profile" className="hover:text-accent transition-colors">Order Tracking</Link></li>
            <li><Link to="/profile" className="hover:text-accent transition-colors">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Varieties</h4>
          <ul className="space-y-4 text-primary-foreground/70">
            <li><Link to="/shop" className="hover:text-accent transition-colors">Ragi (Finger Millet)</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Foxtail Millet</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Barnyard Millet</Link></li>
            <li><Link to="/shop" className="hover:text-accent transition-colors">Kodo Millet</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-primary-foreground/70">
            <li className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent" />
              <span>Kanthaloor Hills, Idukki, Kerala</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-accent" />
              <span>hello@milletmarket.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-20 pt-8 border-t border-white/10 text-center text-primary-foreground/40 text-sm">
        <p>© {new Date().getFullYear()} Kanthaloor Millet Market. All rights reserved.</p>
      </div>
    </footer>
  )
}

function ButtonIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-all duration-300">
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </button>
  )
}
