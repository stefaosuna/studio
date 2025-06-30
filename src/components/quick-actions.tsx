
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, QrCode, Ticket, Contact, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import dynamic from "next/dynamic";

const QrScannerDialog = dynamic(() => import('@/components/qr-scanner').then(mod => mod.QrScannerDialog), { ssr: false });

export function QuickActions() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsPopoverOpen(false);
  }

  const actions = [
    {
      label: 'Create vCard',
      icon: Contact,
      href: '/create',
    },
    {
      label: 'Create Ticket',
      icon: Ticket,
      href: '/create/ticket',
    },
    {
      label: 'Create Event',
      icon: CalendarPlus,
      href: '/create/event',
    },
    {
      label: 'Scan QR',
      icon: QrCode,
      action: () => setIsScannerOpen(true),
    },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-14 h-14 shadow-lg"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Quick Actions</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end" side="top">
            <div className="flex flex-col gap-1">
              {actions.map((action) =>
                'href' in action ? (
                  <Button
                    key={action.label}
                    variant="ghost"
                    className="justify-start"
                    asChild
                    onClick={() => handleAction()}
                  >
                    <Link href={action.href!}>
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    key={action.label}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleAction(action.action)}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                )
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {isScannerOpen && <QrScannerDialog open={isScannerOpen} onOpenChange={setIsScannerOpen} />}
    </>
  );
}
