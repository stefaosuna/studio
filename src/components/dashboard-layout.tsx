'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Users, Search } from "lucide-react";
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchProvider, useSearch } from "@/context/search-context";

function DashboardSearchInput() {
    const { searchQuery, setSearchQuery } = useSearch();
    return (
        <Input
            type="search"
            placeholder="Search vCards and tickets..."
            className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[336px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: Home, tooltip: 'Dashboard' },
        { href: '/users', label: 'Users', icon: Users, tooltip: 'Users' },
    ];
    
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    }

    return (
        <SearchProvider>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader className="border-b">
                        <div className="flex h-16 items-center justify-center">
                            <Link href="/">
                                <Image src="/logo.png" alt="Proxity Logo" width={28} height={28} className="dark:invert object-contain group-data-[state=expanded]:hidden" />
                                <Image src="/logo.png" alt="Proxity Logo" width={120} height={25} className="dark:invert group-data-[state=collapsed]:hidden" />
                            </Link>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} passHref legacyBehavior>
                                        <SidebarMenuButton isActive={isActive(item.href)} tooltip={{ children: item.tooltip }}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                             <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <DashboardSearchInput />
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://placehold.co/32x32.png" alt="@user" data-ai-hint="user avatar" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <div className="flex-1 bg-muted/20">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </SearchProvider>
    );
}