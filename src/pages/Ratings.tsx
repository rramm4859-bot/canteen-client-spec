import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getFromStorage, saveToStorage, KEYS } from '@/lib/storage';
import { Rating, HistoryEntry, Student } from '@/types/canteen';
import { Star } from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Ratings = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [completedOrders, setCompletedOrders] = useState<HistoryEntry[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<HistoryEntry | null>(null);
  const [serviceRating, setServiceRating] = useState(0);
  const [tasteRating, setTasteRating] = useState(0);
  const [comments, setComments] = useState('');

  useEffect(() => {
    loadRatings();
    loadCompletedOrders();
  }, []);

  const loadRatings = () => {
    const loadedRatings = getFromStorage<Rating[]>(KEYS.RATINGS, []);
    setRatings(loadedRatings);
  };

  const loadCompletedOrders = () => {
    const history = getFromStorage<HistoryEntry[]>(KEYS.HISTORY, []);
    const completed = history.filter((entry) => entry.status === 'completed');
    setCompletedOrders(completed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrder) {
      toast.error('Please select an order to rate');
      return;
    }

    if (serviceRating === 0 || tasteRating === 0) {
      toast.error('Please provide both service and taste ratings');
      return;
    }

    const currentStudent = getFromStorage<Student | null>(KEYS.CURRENT_STUDENT, null);

    const newRating: Rating = {
      ratingId: `RAT${Date.now()}`,
      entryId: selectedOrder.entryId,
      studentId: currentStudent?.studentId || selectedOrder.studentId,
      serviceRating,
      tasteRating,
      comments,
      timestamp: new Date().toISOString(),
    };

    const updatedRatings = [...ratings, newRating];
    setRatings(updatedRatings);
    saveToStorage(KEYS.RATINGS, updatedRatings);

    toast.success('Thank you for your feedback!');
    
    // Reset form
    setSelectedOrder(null);
    setServiceRating(0);
    setTasteRating(0);
    setComments('');
  };

  const StarRating = ({ rating, onRate }: { rating: number; onRate: (r: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 ${
                star <= rating ? 'fill-accent text-accent' : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const hasRating = (orderId: string) => {
    return ratings.some((r) => r.entryId === orderId);
  };

  const averageRatings = () => {
    if (ratings.length === 0) return { service: 0, taste: 0 };
    
    const serviceAvg = ratings.reduce((sum, r) => sum + r.serviceRating, 0) / ratings.length;
    const tasteAvg = ratings.reduce((sum, r) => sum + r.tasteRating, 0) / ratings.length;
    
    return { service: serviceAvg.toFixed(1), taste: tasteAvg.toFixed(1) };
  };

  const avgRatings = averageRatings();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Ratings & Feedback</h2>
            <p className="text-muted-foreground">Share your experience with us</p>
          </div>
        </div>

        {/* Average Ratings */}
        {ratings.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Service Rating</p>
                    <p className="text-3xl font-bold text-primary">{avgRatings.service}/5</p>
                  </div>
                  <Star className="h-12 w-12 text-accent fill-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Taste Rating</p>
                    <p className="text-3xl font-bold text-primary">{avgRatings.taste}/5</p>
                  </div>
                  <Star className="h-12 w-12 text-accent fill-accent" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rating Form */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Order</CardTitle>
            <CardDescription>Select a completed order to provide feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Selection */}
              <div className="space-y-2">
                <Label>Select Order</Label>
                <div className="grid gap-2 max-h-48 overflow-y-auto">
                  {completedOrders.map((order) => (
                    <button
                      key={order.entryId}
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      disabled={hasRating(order.entryId)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedOrder?.entryId === order.entryId
                          ? 'border-primary bg-primary/5'
                          : hasRating(order.entryId)
                          ? 'border-muted bg-muted/50 cursor-not-allowed opacity-50'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #{order.entryId}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.timestamp), 'PPp')}
                          </p>
                        </div>
                        {hasRating(order.entryId) && (
                          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                            Rated
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Rating */}
              <div className="space-y-2">
                <Label>Service Rating</Label>
                <StarRating rating={serviceRating} onRate={setServiceRating} />
              </div>

              {/* Taste Rating */}
              <div className="space-y-2">
                <Label>Taste Rating</Label>
                <StarRating rating={tasteRating} onRate={setTasteRating} />
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Rating
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Ratings */}
        {ratings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratings.slice(0, 5).map((rating) => (
                  <div key={rating.ratingId} className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm font-medium">Service</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.serviceRating ? 'fill-accent text-accent' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Taste</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.tasteRating ? 'fill-accent text-accent' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {rating.comments && (
                      <p className="text-sm text-muted-foreground italic">{rating.comments}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(rating.timestamp), 'PPp')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Ratings;
