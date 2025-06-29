
'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Home, Users, Search, Calendar, ScanLine, BarChart } from "lucide-react";
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
    useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchProvider, useSearch } from "@/context/search-context";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const QrScannerDialog = dynamic(() => import('@/components/qr-scanner').then(mod => mod.QrScannerDialog), { ssr: false });

const logoUrl = "https://cdn.prod.website-files.com/68521b10d2ddd4340d19900c/68521c1afc95e0d7fae75898_Recurso%202%404x-p-500.png";

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

function TopBar() {
    const { state } = useSidebar();
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    return (
        <>
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    {state === 'collapsed' && (
                        <Link href="/" className="hidden lg:block">
                            <Image src={logoUrl} alt="Proxity Logo" width={28} height={28} className="object-contain dark:invert-0 invert" />
                        </Link>
                    )}
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <DashboardSearchInput />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsScannerOpen(true)}>
                        <ScanLine className="h-5 w-5" />
                        <span className="sr-only">Scan Ticket</span>
                    </Button>
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
                            <ThemeSwitcher />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            {isScannerOpen && <QrScannerDialog open={isScannerOpen} onOpenChange={setIsScannerOpen} />}
        </>
    );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: Home, tooltip: 'Dashboard' },
        { href: '/metrics', label: 'Metrics', icon: BarChart, tooltip: 'Metrics' },
        { href: '/events', label: 'Events', icon: Calendar, tooltip: 'Events' },
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
                        <div className="flex h-16 items-center justify-start px-4">
                            <Link href="/" className="group-data-[state=collapsed]:hidden">
                                <Image src={logoUrl} alt="Proxity Logo" width={120} height={25} className="object-contain dark:invert-0 invert" />
                            </Link>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.tooltip }}>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <TopBar />
                    <div className="flex-1 bg-muted/20">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </SearchProvider>
    );
}
