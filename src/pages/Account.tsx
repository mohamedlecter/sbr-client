import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Package, MapPin, Settings, Award, ShoppingBag } from "lucide-react";

const Account = () => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    membershipType: "Gold",
    points: 1250,
  };

  const stats = [
    { label: "Total Orders", value: "24", icon: Package },
    { label: "Active Orders", value: "3", icon: ShoppingBag },
    { label: "Saved Addresses", value: "2", icon: MapPin },
    { label: "Loyalty Points", value: user.points, icon: Award },
  ];

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
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                        {user.membershipType} Member
                      </Badge>
                      <Badge variant="outline">{user.points} Points</Badge>
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
