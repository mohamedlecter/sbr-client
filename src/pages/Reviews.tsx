import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, MessageSquare, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Reviews = () => {
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      message:
        "Excellent service and fast shipping! The Akrapovič exhaust I ordered arrived in perfect condition. Highly recommend!",
      date: "2024-01-10",
      feedbackType: "product",
      isPublic: true,
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 5,
      message:
        "Great customer support team. They helped me find the right parts for my bike model. Very knowledgeable staff.",
      date: "2024-01-08",
      feedbackType: "service",
      isPublic: true,
    },
    {
      id: 3,
      user: "Mike T.",
      rating: 4,
      message:
        "Good quality products. Shipping was a bit slower than expected but the products are top-notch. Will order again.",
      date: "2024-01-05",
      feedbackType: "order",
      isPublic: true,
    },
    {
      id: 4,
      user: "Alex K.",
      rating: 5,
      message:
        "Amazing selection of performance parts. The Brembo brake calipers I bought have significantly improved my bike's braking performance.",
      date: "2024-01-03",
      feedbackType: "product",
      isPublic: true,
    },
    {
      id: 5,
      user: "Emma L.",
      rating: 5,
      message:
        "Best motorcycle parts store in the region! Fast shipping, great prices, and authentic products. Very satisfied!",
      date: "2023-12-28",
      feedbackType: "general",
      isPublic: true,
    },
    {
      id: 6,
      user: "David R.",
      rating: 4,
      message:
        "Good experience overall. The website is easy to navigate and the checkout process is smooth. Products arrived as described.",
      date: "2023-12-25",
      feedbackType: "general",
      isPublic: true,
    },
  ];

  const filteredReviews =
    ratingFilter === "all"
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(ratingFilter));

  const getFeedbackTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      general: "General",
      order: "Order",
      product: "Product",
      service: "Service",
      bug_report: "Bug Report",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Customer Reviews</h1>
                <p className="text-muted-foreground">See what our customers are saying</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button asChild>
                <Link to="/feedback">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Submit Your Review
                </Link>
              </Button>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No reviews found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filter</p>
                <Button asChild>
                  <Link to="/feedback">Submit Your Review</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-primary/10 text-primary font-bold w-10 h-10 rounded-full flex items-center justify-center">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{review.user}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getFeedbackTypeLabel(review.feedbackType)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{review.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Average Rating Summary */}
          {reviews.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Rating Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                    </div>
                    <div className="flex gap-1 justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter((r) => r.rating === rating).length;
                      const percentage = (count / reviews.length) * 100;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-12">{rating} star</span>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reviews;

