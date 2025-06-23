'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Users } from "lucide-react";
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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', label: 'Dashboard', icon: Home },
        { href: '/users', label: 'Users', icon: Users },
    ];
    
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="border-b">
                    <div className="flex h-16 items-center justify-center">
                        <Link href="/">
                            <Image src="/logo.png" alt="Proxity Logo" width={120} height={25} className="dark:invert" />
                        </Link>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <Link href={item.href} passHref legacyBehavior>
                                    <SidebarMenuButton isActive={isActive(item.href)}>
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
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
                     <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Image src="/logo.png" alt="Proxity Logo" width={120} height={25} className="dark:invert" />
                    </Link>
                    <SidebarTrigger />
                </header>
                <div className="flex-1 bg-muted/20">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
