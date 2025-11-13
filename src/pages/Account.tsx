import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Package, MapPin, Settings, Award, ShoppingBag } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchProfile, fetchAddresses } from "@/store/slices/userSlice";
import { fetchOrders } from "@/store/slices/ordersSlice";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile, addresses, isLoading: userLoading } = useAppSelector((state) => state.user);
  const { orders, isLoading: ordersLoading } = useAppSelector((state) => state.orders);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isLoading = userLoading || ordersLoading;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Fetch user data when component mounts
    dispatch(fetchProfile());
    dispatch(fetchAddresses());
    dispatch(fetchOrders(undefined));
  }, [isAuthenticated, navigate, dispatch]);

  // Get membership badge color based on membership type
  const getMembershipBadgeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "gold":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      case "silver":
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case "platinum":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600";
    }
  };

  // Calculate stats
  const activeOrders = orders.filter((order) => 
    order.status && !["cancelled", "completed", "delivered"].includes(order.status.toLowerCase())
  ).length;

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), icon: Package },
    { label: "Active Orders", value: activeOrders.toString(), icon: ShoppingBag },
    { label: "Saved Addresses", value: addresses.length.toString(), icon: MapPin },
    { label: "Loyalty Points", value: profile?.membership_points?.toString() || "0", icon: Award },
  ];

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center text-muted-foreground">Loading account information...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const user = profile || {
    full_name: "User",
    email: "",
    phone: "",
    membership_type: "",
    membership_points: 0,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">My Account</h1>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user.full_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{user.full_name || "User"}</h2>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-muted-foreground mb-2">{user.phone}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      {user.membership_type && (
                        <Badge className={getMembershipBadgeColor(user.membership_type)}>
                          {user.membership_type.charAt(0).toUpperCase() + user.membership_type.slice(1)} Member
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {user.membership_points || 0} Points
                      </Badge>
                      {(user as any).email_verified === 0 && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Email Not Verified
                        </Badge>
                      )}
                      {(user as any).phone_verified === 0 && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Phone Not Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link to="/account/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/account/orders">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    My Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">View and track your orders</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/account/addresses">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Manage your shipping addresses</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/account/profile">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Update your account information</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
