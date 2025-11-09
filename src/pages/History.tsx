import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getFromStorage, saveToStorage, KEYS } from '@/lib/storage';
import { HistoryEntry } from '@/types/canteen';
import { History as HistoryIcon, CheckCircle, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { format } from 'date-fns';

const History = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const entries = getFromStorage<HistoryEntry[]>(KEYS.HISTORY, []);
    setHistory(entries);
  };

  const updateOrderStatus = (entryId: string, status: 'completed' | 'cancelled') => {
    const updatedHistory = history.map((entry) =>
      entry.entryId === entryId ? { ...entry, status } : entry
    );
    setHistory(updatedHistory);
    saveToStorage(KEYS.HISTORY, updatedHistory);
    toast.success(`Order ${status === 'completed' ? 'completed' : 'cancelled'} successfully`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <HistoryIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Order History</h2>
            <p className="text-muted-foreground">{history.length} total orders</p>
          </div>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HistoryIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Your order history will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <Card key={entry.entryId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order #{entry.entryId}
                        {getStatusBadge(entry.status)}
                      </CardTitle>
                      <CardDescription>
                        {entry.studentName} • {format(new Date(entry.timestamp), 'PPp')}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{entry.total}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {entry.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {entry.status === 'pending' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(entry.entryId, 'completed')}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(entry.entryId, 'cancelled')}
                        className="flex-1"
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
