import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, CheckCircle2, Clock, Truck, ArrowLeft, MapPin } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { trackOrder, fetchOrderDetails } from "@/store/slices/ordersSlice";

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, orderTracking, isLoading } = useAppSelector((state) => state.orders);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (id) {
      // Try to find order in current list first
      const existingOrder = orders.find((o) => o.id === id);
      if (existingOrder) {
        setSelectedOrder(existingOrder);
      } else {
        // Fetch order details if not in list
        dispatch(fetchOrderDetails(id)).then((result) => {
          if (fetchOrderDetails.fulfilled.match(result)) {
            const payload = result.payload as any;
            const order = payload.order || payload;
            setSelectedOrder(order);
          }
        });
      }
      dispatch(trackOrder(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, navigate, dispatch]);

  if (!isAuthenticated) {
    return null;
  }

  const order = selectedOrder || orders.find((o) => o.id === id);
  const tracking = orderTracking;

  if (isLoading && !orderTracking && !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center text-muted-foreground">Loading tracking information...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!id || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Order not found</h2>
            <Button asChild variant="outline">
              <Link to="/account/orders">Back to Orders</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Build status steps from tracking data or order status
  const getStatusSteps = () => {
    if (tracking?.timeline && Array.isArray(tracking.timeline)) {
      // Map timeline items to include icons if missing
      const iconMap: Record<string, any> = {
        placed: Package,
        confirmed: CheckCircle2,
        processing: Clock,
        shipped: Truck,
        delivered: CheckCircle2,
      };
      return tracking.timeline.map((step: any) => ({
        ...step,
        icon: step.icon || iconMap[step.id] || iconMap[step.status] || Package,
      }));
    }

    // Default timeline based on order status
    const status = order?.status?.toLowerCase() || "placed";
    const steps = [
      {
        id: "placed",
        label: "Order Placed",
        icon: Package,
        completed: true,
        date: order?.created_at ? new Date(order.created_at).toLocaleDateString() : undefined,
      },
      {
        id: "confirmed",
        label: "Order Confirmed",
        icon: CheckCircle2,
        completed: ["confirmed", "processing", "shipped", "delivered", "pending"].includes(status),
      },
      {
        id: "processing",
        label: "Processing",
        icon: Clock,
        completed: ["processing", "shipped", "delivered"].includes(status),
      },
      {
        id: "shipped",
        label: "Shipped",
        icon: Truck,
        completed: ["shipped", "delivered"].includes(status),
      },
      {
        id: "delivered",
        label: "Delivered",
        icon: CheckCircle2,
        completed: status === "delivered",
      },
    ];
    return steps;
  };

  const statusSteps = getStatusSteps();

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      placed: { label: "Order Placed", variant: "outline" },
      confirmed: { label: "Confirmed", variant: "secondary" },
      processing: { label: "Processing", variant: "secondary" },
      shipped: { label: "Shipped", variant: "default" },
      delivered: { label: "Delivered", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
      pending: { label: "Pending", variant: "outline" },
    };
    const statusInfo = statusMap[status?.toLowerCase()] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getTotalAmount = (order: any) => {
    if (order.total_amount) {
      return typeof order.total_amount === 'string' 
        ? parseFloat(order.total_amount) 
        : order.total_amount;
    }
    return order.total || 0;
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
            <p className="text-muted-foreground">Order #{order?.order_number || order?.id}</p>
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
                    const Icon = step.icon || Package;
                    const isLast = index === statusSteps.length - 1;
                    return (
                      <div key={step.id || index} className="relative">
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
                                  {step.date} {step.time || ""}
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
                  {getStatusBadge(order?.status || "placed")}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                  <p className="font-medium">
                    {order?.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                {order?.estimated_delivery && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="font-medium">{new Date(order.estimated_delivery).toLocaleDateString()}</p>
                  </div>
                )}
                {order?.tracking_number && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <p className="font-medium">{order.tracking_number}</p>
                  </div>
                )}
                {tracking?.tracking_number && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                    <p className="font-medium">{tracking.tracking_number}</p>
                  </div>
                )}
                {tracking?.carrier && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Carrier</p>
                    <p className="font-medium">{tracking.carrier}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">${getTotalAmount(order).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Address */}
          {(order?.shipping_address_label || order?.city || order?.country) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {order.shipping_address_label && (
                    <p className="font-medium">{order.shipping_address_label}</p>
                  )}
                  {order.street && (
                    <p className="text-muted-foreground">{order.street}</p>
                  )}
                  {(order.city || order.country) && (
                    <p className="text-muted-foreground">
                      {order.city || ""}{order.city && order.country ? ", " : ""}{order.country || ""}
                    </p>
                  )}
                  {order.postal_code && (
                    <p className="text-muted-foreground">Postal Code: {order.postal_code}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          {order?.items && order.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.product_name || `Item ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="pt-4 space-y-2 border-t">
                    {order.subtotal !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                      </div>
                    )}
                    {order.shipping_cost !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">${order.shipping_cost.toFixed(2)}</span>
                      </div>
                    )}
                    {order.discount !== undefined && order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-primary">-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2">
                      <span>Total</span>
                      <span className="text-primary">${getTotalAmount(order).toFixed(2)}</span>
                    </div>
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

export default OrderTracking;
