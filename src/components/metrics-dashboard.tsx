'use client';

import { useMemo } from 'react';
import { useVCardStore } from '@/hooks/use-vcard-store';
import { useTicketStore } from '@/hooks/use-ticket-store';
import { useEventStore } from '@/hooks/use-event-store';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { CreditCard, Ticket, Calendar, Star, DollarSign } from 'lucide-react';
import type { VCardSubscription, PassType } from '@/lib/types';

export function MetricsDashboard() {
  const { vcards } = useVCardStore();
  const { tickets } = useTicketStore();
  const { events } = useEventStore();

  const totalVips = tickets.filter(t => t.passType === 'VIP').length;

  const grossSales = useMemo(() => {
    return tickets.reduce((acc, ticket) => acc + (ticket.publicPrice || 0), 0);
  }, [tickets]);

  const totalCosts = useMemo(() => {
    return tickets.reduce((acc, ticket) => acc + (ticket.costPrice || 0), 0);
  }, [tickets]);

  const subscriptionData = useMemo(() => {
    const counts: Record<VCardSubscription, number> = { Basic: 0, Top: 0, Enterprise: 0 };
    vcards.forEach(vcard => {
      counts[vcard.subscription]++;
    });
    return [
      { name: 'Basic', count: counts.Basic, fill: 'var(--color-basic)' },
      { name: 'Top', count: counts.Top, fill: 'var(--color-top)' },
      { name: 'Enterprise', count: counts.Enterprise, fill: 'var(--color-enterprise)' },
    ];
  }, [vcards]);

  const subscriptionChartConfig = {
    count: { label: 'vCards' },
    basic: { label: 'Basic', color: 'hsl(var(--chart-1))' },
    top: { label: 'Top', color: 'hsl(var(--chart-2))' },
    enterprise: { label: 'Enterprise', color: 'hsl(var(--chart-3))' },
  } satisfies ChartConfig;

  const passTypeData = useMemo(() => {
    const counts: Record<PassType, number> = { Basic: 0, VIP: 0, Staff: 0 };
    tickets.forEach(ticket => {
      counts[ticket.passType]++;
    });
    return [
      { name: 'Basic', count: counts.Basic, fill: 'var(--color-basic)' },
      { name: 'VIP', count: counts.VIP, fill: 'var(--color-vip)' },
      { name: 'Staff', count: counts.Staff, fill: 'var(--color-staff)' },
    ];
  }, [tickets]);

  const passTypeChartConfig = {
    count: { label: 'Tickets' },
    basic: { label: 'Basic', color: 'hsl(var(--chart-1))' },
    vip: { label: 'VIP', color: 'hsl(var(--chart-2))' },
    staff: { label: 'Staff', color: 'hsl(var(--chart-3))' },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Metrics Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total vCards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vcards.length}</div>
            <p className="text-xs text-muted-foreground">All-time vCards created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-muted-foreground">All-time tickets generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Events managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${grossSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total from all public ticket prices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCosts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total from all internal ticket costs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Tickets</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVips}</div>
            <p className="text-xs text-muted-foreground">High-priority pass holders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>vCard Subscription Tiers</CardTitle>
            <CardDescription>Distribution of vCards across subscription plans.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={subscriptionChartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={subscriptionData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Pass Types</CardTitle>
            <CardDescription>Breakdown of all generated ticket types.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={passTypeChartConfig} className="min-h-[200px] w-full max-w-xs">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideIndicator />} />
                <Pie data={passTypeData} dataKey="count" nameKey="name" innerRadius={60} strokeWidth={5}>
                    {passTypeData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
