import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, CheckCircle2, Clock, Truck, ArrowLeft, MapPin } from "lucide-react";

const OrderTracking = () => {
  const { id } = useParams();

  // Mock order data
  const order = {
    id: id || "12345",
    orderNumber: "ORD-2024-001234",
    status: "shipped",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-22",
    shippingAddress: {
      label: "Home",
      street: "123 Performance Street",
      city: "Dubai",
      country: "UAE",
      postalCode: "12345",
    },
    items: [
      { name: "Akrapovič Racing Titanium Exhaust", quantity: 1, price: 1299 },
      { name: "Brembo Brake Caliper Set", quantity: 2, price: 899 },
    ],
    subtotal: 3097,
    shipping: 50,
    discount: 154.85,
    total: 2992.15,
  };

  const statusSteps = [
    {
      id: "placed",
      label: "Order Placed",
      icon: Package,
      completed: true,
      date: "2024-01-15",
      time: "10:30 AM",
    },
    {
      id: "confirmed",
      label: "Order Confirmed",
      icon: CheckCircle2,
      completed: true,
      date: "2024-01-15",
      time: "11:00 AM",
    },
    {
      id: "processing",
      label: "Processing",
      icon: Clock,
      completed: true,
      date: "2024-01-16",
      time: "09:00 AM",
    },
    {
      id: "shipped",
      label: "Shipped",
      icon: Truck,
      completed: order.status === "shipped" || order.status === "delivered",
      date: order.status === "shipped" || order.status === "delivered" ? "2024-01-18" : null,
      time: order.status === "shipped" || order.status === "delivered" ? "02:30 PM" : null,
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: CheckCircle2,
      completed: order.status === "delivered",
      date: order.status === "delivered" ? "2024-01-20" : null,
      time: order.status === "delivered" ? "11:45 AM" : null,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> =
      {
        placed: { label: "Order Placed", variant: "outline" },
        confirmed: { label: "Confirmed", variant: "secondary" },
        processing: { label: "Processing", variant: "secondary" },
        shipped: { label: "Shipped", variant: "default" },
        delivered: { label: "Delivered", variant: "default" },
        cancelled: { label: "Cancelled", variant: "destructive" },
      };
    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/account/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Tracking</h1>
            <p className="text-muted-foreground">Order #{order.orderNumber}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Order Status Timeline */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === statusSteps.length - 1;
                    return (
                      <div key={step.id} className="relative">
                        <div className="flex gap-4">
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                              <h3
                                className={`font-bold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {step.label}
                              </h3>
                              {step.completed && step.date && (
                                <span className="text-sm text-muted-foreground">
                                  {step.date} {step.time}
                                </span>
                              )}
                            </div>
                            {step.completed && step.date && (
                              <p className="text-sm text-muted-foreground">
                                Your order has been {step.label.toLowerCase()}
                              </p>
                            )}
                          </div>
                        </div>
                        {!isLast && (
                          <div
                            className={`absolute left-6 top-12 w-0.5 h-12 ${
                              step.completed ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                  <p className="font-medium">{order.orderDate}</p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="font-medium">{order.estimatedDelivery}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Address */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.label}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
                {order.shippingAddress.postalCode && (
                  <p className="text-muted-foreground">Postal Code: {order.shippingAddress.postalCode}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 space-y-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-primary">-${order.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total</span>
                    <span className="text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;

