import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Wrench, Bike, Sparkles, Zap, Shield, Wind } from "lucide-react";

const Categories = () => {
  // Mock categories data
  const categories = [
    {
      id: 1,
      name: "Exhaust Systems",
      description: "Performance exhaust systems for maximum power",
      icon: Wind,
      productsCount: 245,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    },
    {
      id: 2,
      name: "Suspension",
      description: "Premium suspension components and upgrades",
      icon: Bike,
      productsCount: 189,
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
    },
    {
      id: 3,
      name: "Braking Systems",
      description: "High-performance brake components",
      icon: Shield,
      productsCount: 156,
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600",
    },
    {
      id: 4,
      name: "Engine Parts",
      description: "Internal and external engine components",
      icon: Zap,
      productsCount: 312,
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600",
    },
    {
      id: 5,
      name: "Body & Fairings",
      description: "Aerodynamic body parts and fairings",
      icon: Sparkles,
      productsCount: 198,
      image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600",
    },
    {
      id: 6,
      name: "Electrical",
      description: "Lighting, batteries, and electrical components",
      icon: Zap,
      productsCount: 134,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    },
    {
      id: 7,
      name: "Wheels & Tires",
      description: "High-performance wheels and tire solutions",
      icon: Wrench,
      productsCount: 167,
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
    },
    {
      id: 8,
      name: "Controls & Levers",
      description: "Precision control components",
      icon: Wrench,
      productsCount: 98,
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-foreground to-foreground/90 text-background py-16">
          <div className="container mx-auto px-4">
            <h1 className="mb-4">Shop by Category</h1>
            <p className="text-xl text-background/90 max-w-2xl">
              Browse our extensive range of premium motorcycle parts and accessories organized by category
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.id} to={`/categories/${category.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <div className="bg-primary p-3 rounded-full">
                            <Icon className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                        <p className="text-sm font-medium text-primary">
                          {category.productsCount} Products
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
