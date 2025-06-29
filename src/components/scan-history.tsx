
'use client';

import { useState } from 'react';
import type { ScanLogEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

export function ScanHistory({ scanLog, onAddLog }: { scanLog: ScanLogEntry[] | undefined, onAddLog: (message: string) => void }) {
    const [logMessage, setLogMessage] = useState('');

    const handleAddLog = () => {
        if (!logMessage) return;
        onAddLog(logMessage);
        setLogMessage('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-base"><Clock className="mr-2 h-4 w-4" /> Scan History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={logMessage}
                            onChange={(e) => setLogMessage(e.target.value)}
                            placeholder="e.g. Checked In, Merchandise Claimed"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
                        />
                        <Button onClick={handleAddLog} disabled={!logMessage}>Add Log</Button>
                    </div>
                    <ScrollArea className="h-40 rounded-md border p-2">
                        {(scanLog && scanLog.length > 0) ? (
                            <div className="space-y-3">
                                {scanLog.map(log => (
                                    <div key={log.id} className="text-sm">
                                        <p className="font-medium">{log.message}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(log.timestamp), "PPp")}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">No scan history for this ticket.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
