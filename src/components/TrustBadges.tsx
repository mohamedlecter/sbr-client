import { Truck, Shield, Headphones, Package } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Truck,
      title: "Flat Rate GCC Shipping",
      description: "Fast delivery across the region",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "We're here to help anytime",
    },
    {
      icon: Package,
      title: "Live Inventory",
      description: "Real-time stock updates",
    },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
