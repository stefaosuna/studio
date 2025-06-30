
'use client';

import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
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
import { CreditCard, Ticket, Calendar as CalendarIcon, Star, DollarSign, Download } from 'lucide-react';

import { useVCardStore } from '@/hooks/use-vcard-store';
import { useTicketStore } from '@/hooks/use-ticket-store';
import { useEventStore } from '@/hooks/use-event-store';
import type { VCardSubscription, PassType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export function MetricsDashboard() {
  const { vcards } = useVCardStore();
  const { tickets } = useTicketStore();
  const { events } = useEventStore();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const filteredTickets = useMemo(() => {
    if (!date?.from) return tickets;
    return tickets.filter(ticket => {
        const eventDate = new Date(ticket.eventDate);
        if (date.from && !date.to) return eventDate >= date.from;
        return eventDate >= date.from && eventDate <= (date.to || date.from);
    });
  }, [tickets, date]);

  const filteredEvents = useMemo(() => {
     if (!date?.from) return events;
    return events.filter(event => {
        const eventDate = new Date(event.date);
        if (date.from && !date.to) return eventDate >= date.from;
        return eventDate >= date.from && eventDate <= (date.to || date.from);
    });
  }, [events, date]);

  const totalVips = filteredTickets.filter(t => t.passType === 'VIP').length;

  const grossSales = useMemo(() => {
    return filteredTickets.reduce((acc, ticket) => acc + (ticket.publicPrice || 0), 0);
  }, [filteredTickets]);

  const totalCosts = useMemo(() => {
    return filteredTickets.reduce((acc, ticket) => acc + (ticket.costPrice || 0), 0);
  }, [filteredTickets]);

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
    filteredTickets.forEach(ticket => {
      counts[ticket.passType]++;
    });
    return [
      { name: 'Basic', count: counts.Basic, fill: 'var(--color-basic)' },
      { name: 'VIP', count: counts.VIP, fill: 'var(--color-vip)' },
      { name: 'Staff', count: counts.Staff, fill: 'var(--color-staff)' },
    ].filter(d => d.count > 0);
  }, [filteredTickets]);

  const passTypeChartConfig = {
    count: { label: 'Tickets' },
    basic: { label: 'Basic', color: 'hsl(var(--chart-1))' },
    vip: { label: 'VIP', color: 'hsl(var(--chart-2))' },
    staff: { label: 'Staff', color: 'hsl(var(--chart-3))' },
  } satisfies ChartConfig;
  
  const handleDownload = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Date Range", `${date?.from ? format(date.from, 'LLL dd, y') : 'All Time'} - ${date?.to ? format(date.to, 'LLL dd, y') : ''}`],
      ["Total vCards (All Time)", vcards.length],
      ["Total Tickets (Filtered)", filteredTickets.length],
      ["Total Events (Filtered)", filteredEvents.length],
      ["Gross Sales (Filtered)", `$${grossSales.toFixed(2)}`],
      ["Total Costs (Filtered)", `$${totalCosts.toFixed(2)}`],
      ["VIP Tickets (Filtered)", totalVips],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach(rowArray => {
      let row = rowArray.join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cardify_metrics_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Metrics Dashboard</h1>
        <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
        </div>
      </div>
      
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
            <div className="text-2xl font-bold">{filteredTickets.length}</div>
            <p className="text-xs text-muted-foreground">In selected date range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEvents.length}</div>
            <p className="text-xs text-muted-foreground">In selected date range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${grossSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From tickets in date range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCosts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From tickets in date range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Tickets</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVips}</div>
            <p className="text-xs text-muted-foreground">In selected date range</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>vCard Subscription Tiers</CardTitle>
            <CardDescription>Distribution of all vCards (all-time).</CardDescription>
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
            <CardTitle>Ticket Pass Types (Filtered)</CardTitle>
            <CardDescription>Breakdown of ticket types in the selected date range.</CardDescription>
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
                {passTypeData.length > 0 && <ChartLegend content={<ChartLegendContent nameKey="name" />} />}
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
