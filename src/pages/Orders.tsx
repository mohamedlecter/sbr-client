import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, ChevronRight, Calendar, ArrowLeft, MapPin, CreditCard, X } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchOrders, fetchOrderDetails, cancelOrder } from "@/store/slices/ordersSlice";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.orders);
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
    } else {
      // Only fetch if we don't have orders already and not currently loading
      if (orders.length === 0 && !isLoading) {
        dispatch(fetchOrders({}));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, navigate, dispatch]);

  const handleCancelOrder = async (orderId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const result = await dispatch(cancelOrder(orderId));
    if (cancelOrder.fulfilled.match(result)) {
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      });
      dispatch(fetchOrders({}));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
      }
    } else {
      toast({
        title: "Error",
        description: result.payload as string || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
      case "placed":
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
  };

  const getTotalAmount = (order: any) => {
    if (order.total_amount) {
      return typeof order.total_amount === 'string' 
        ? parseFloat(order.total_amount) 
        : order.total_amount;
    }
    return order.total || 0;
  };

  if (!isAuthenticated) {
    return null;
  }

  // If viewing a specific order
  if (id) {
    const order = selectedOrder || orders.find((o) => o.id === id);

    if (isLoading && !order) {
      return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-16">
            <div className="text-center text-muted-foreground">Loading order details...</div>
          </main>
          <Footer />
        </div>
      );
    }

    if (!order) {
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Details</h1>
              <p className="text-muted-foreground">Order #{order.order_number || order.id}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item: any, index: number) => (
                          <div key={item.id || index} className="flex justify-between items-center py-3 border-b last:border-0">
                            <div>
                              <p className="font-medium">{item.product_name || `Item ${index + 1}`}</p>
                              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          {order.item_count ? `${order.item_count} item(s)` : "No items found"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {(order.shipping_address_label || order.city || order.country) && (
                  <Card>
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

                {order.payment_status && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Status</span>
                          <Badge className={order.payment_status === "paid" ? "bg-green-500" : "bg-yellow-500"}>
                            {order.payment_status || "Pending"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount</span>
                          <span className="font-medium">${getTotalAmount(order).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className={getStatusColor(order.status || "unknown")}>
                        {getStatusLabel(order.status || "unknown")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                      <p className="font-medium">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    {order.tracking_number && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                        <p className="font-medium">{order.tracking_number}</p>
                      </div>
                    )}
                    <div className="pt-4 border-t space-y-2">
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
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/account/orders/${order.id}/track`}>Track Order</Link>
                    </Button>
                    {(order.status === "placed" || order.status === "processing" || order.status === "pending") && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={(e) => handleCancelOrder(order.id, e)}
                        disabled={isLoading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel Order
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">View and track all your orders</p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">Loading orders...</div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Button asChild>
                  <Link to="/categories">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const itemCount = order.item_count || order.items?.length || 0;
                return (
                  <Card 
                    key={order.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/account/orders/${order.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{order.order_number || order.id}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status || "unknown")}>
                          {getStatusLabel(order.status || "unknown")}
                        </Badge>
                      </div>

                      {itemCount > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">{itemCount} item(s)</p>
                          {order.items && order.items.length > 0 && (
                            <ul className="text-sm space-y-1">
                              {order.items.slice(0, 3).map((item: any, index: number) => (
                                <li key={item.id || index} className="text-muted-foreground">
                                  • {item.product_name || `Item ${index + 1}`}
                                </li>
                              ))}
                              {order.items.length > 3 && (
                                <li className="text-muted-foreground">• and {order.items.length - 3} more...</li>
                              )}
                            </ul>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">${getTotalAmount(order).toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/account/orders/${order.id}/track`}>
                              Track Order
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/account/orders/${order.id}`}>
                              View Details
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
