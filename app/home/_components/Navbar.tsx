'use client'
import { useState } from "react"
import Link from "next/link"
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/main/dropdown-menu"
import { Button } from "@/components/main/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/main/sheet"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

const navItems = [
  { href: "/home/consensus", label: "Consensus" },
  { href: "/home/policies", label: "Policies" },
  { href: "/home/network-state", label: "Network-State" },
  { href: "/home/leaderboard", label: "Leaderboard" },
]

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-widest">M A Y A</span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        {/* Admin & User Menu */}
        <div className="flex items-center space-x-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              return (
                <div
                  {...(!mounted && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!mounted || !account || !chain) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          variant="outline"
                          className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
                        >
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button
                          onClick={openChainModal}
                          variant="destructive"
                          className="rounded-full px-6"
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div className="flex gap-2">
                        <Button
                          onClick={openChainModal}
                          variant="outline"
                          className="bg-black text-white hover:bg-gray-800 rounded-full px-4"
                        >
                          {chain.hasIcon && (
                            <div style={{ width: 16, height: 16, marginRight: 4 }}>
                              <Image
                                src={chain.iconUrl ?? "/placeholder.svg"}
                                alt={chain.name ?? 'Chain icon'}
                                width={16}
                                height={16}
                              />
                            </div>
                          )}
                          {chain.name}
                        </Button>

                        <Button
                          onClick={openAccountModal}
                          variant="outline"
                          className="bg-black text-white hover:bg-gray-800 rounded-full px-4"
                        >
                          {account.displayName}
                          {account.displayBalance ? ` (${account.displayBalance})` : ''}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">Open user menu</span>
                <div className="h-7 w-7 rounded-full bg-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
