import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, Wallet, DollarSign, MapPin, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCheckoutSummary } from "@/store/slices/cartSlice";
import { fetchAddresses } from "@/store/slices/userSlice";
import { createOrder } from "@/store/slices/ordersSlice";
import { clearCart } from "@/store/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems, summary: cartSummary, isLoading: cartLoading } = useAppSelector((state) => state.cart);
  const { addresses, isLoading: addressesLoading } = useAppSelector((state) => state.user);
  const { isLoading: orderLoading } = useAppSelector((state) => state.orders);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("sadad");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchCheckoutSummary());
    dispatch(fetchAddresses());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    // Set default address when addresses are loaded
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr) => addr.is_default) || addresses[0];
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    }
  }, [addresses, selectedAddress]);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = cartSummary?.subtotal || safeCartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const discount = cartSummary?.discount || 0;
  const shipping = cartSummary?.shipping_cost || 50;
  const total = cartSummary?.total || subtotal - discount + shipping;
  const pointsEarned = cartSummary?.points_earned || Math.floor(total / 10);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Please select a shipping address",
        variant: "destructive",
      });
      return;
    }

    if (safeCartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    const result = await dispatch(createOrder({
      shipping_address_id: selectedAddress,
      payment_method: paymentMethod,
      notes: notes.trim() || undefined,
    }));

    if (createOrder.fulfilled.match(result)) {
      toast({
        title: "Order placed successfully!",
        description: "You'll receive a confirmation email shortly.",
      });
      // Clear cart after successful order
      dispatch(clearCart());
      navigate("/account/orders");
    } else {
      toast({
        title: "Error",
        description: result.payload as string || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = cartLoading || addressesLoading || orderLoading;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

          {safeCartItems.length === 0 && !isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add items to your cart before checkout</p>
                <Button asChild>
                  <Link to="/categories">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Shipping Address</h2>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/account/addresses">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New
                        </Link>
                      </Button>
                    </div>
                    {addressesLoading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading addresses...</div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No addresses found</p>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/account/addresses">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Address
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-3">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`relative flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                              selectedAddress === address.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">{address.label}</span>
                                {address.is_default && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {address.street}, {address.city}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.country} {address.postal_code || ""}
                              </p>
                            </Label>
                            {selectedAddress === address.id && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div
                        className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                          paymentMethod === "sadad"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="sadad" id="sadad" />
                        <Label htmlFor="sadad" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="bg-muted p-2 rounded">
                            <Wallet className="h-5 w-5" />
                          </div>
                          <span className="font-medium">SADAD</span>
                        </Label>
                      </div>
                      <div
                        className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                          paymentMethod === "stripe"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="bg-muted p-2 rounded">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <span className="font-medium">Credit/Debit Card</span>
                        </Label>
                      </div>
                      <div
                        className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                          paymentMethod === "cash"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="bg-muted p-2 rounded">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <span className="font-medium">Cash on Delivery</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Order Notes */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
                    <Textarea
                      placeholder="Add any special instructions for your order..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    {/* Items */}
                    <div className="space-y-3 pb-4 border-b">
                      {safeCartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name || "Item"} x{item.quantity}
                          </span>
                          <span className="font-medium">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 pb-4 border-b">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="font-medium text-primary">-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">${shipping.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>

                    {pointsEarned > 0 && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-center">
                          You'll earn <span className="font-bold text-primary">{pointsEarned} points</span> from this
                          order
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handlePlaceOrder}
                      size="lg"
                      className="w-full"
                      disabled={isLoading || !selectedAddress || safeCartItems.length === 0}
                    >
                      {isLoading ? "Placing Order..." : "Place Order"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By placing your order, you agree to our Terms & Conditions and Privacy Policy
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
