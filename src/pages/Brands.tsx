import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import { useState } from "react";

const Brands = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock brands data
  const brands = [
    { id: 1, name: "Akrapovič", partsCount: 156, modelsCount: 45, description: "Premium exhaust systems" },
    { id: 2, name: "Yoshimura", partsCount: 134, modelsCount: 38, description: "Performance exhausts and parts" },
    { id: 3, name: "Brembo", partsCount: 198, modelsCount: 52, description: "High-performance braking systems" },
    { id: 4, name: "Öhlins", partsCount: 89, modelsCount: 41, description: "Premium suspension solutions" },
    { id: 5, name: "Pirelli", partsCount: 67, modelsCount: 56, description: "Racing and sport tires" },
    { id: 6, name: "K&N", partsCount: 112, modelsCount: 48, description: "High-flow air filtration" },
    { id: 7, name: "Rizoma", partsCount: 203, modelsCount: 35, description: "Italian design accessories" },
    { id: 8, name: "Vortex", partsCount: 145, modelsCount: 42, description: "Racing sprockets and chains" },
    { id: 9, name: "Puig", partsCount: 178, modelsCount: 47, description: "Windscreens and accessories" },
    { id: 10, name: "Arrow", partsCount: 124, modelsCount: 39, description: "Racing exhaust systems" },
    { id: 11, name: "SC Project", partsCount: 98, modelsCount: 33, description: "Premium exhaust manufacturer" },
    { id: 12, name: "Termignoni", partsCount: 87, modelsCount: 36, description: "Italian exhaust excellence" },
  ];

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-foreground to-foreground/90 text-background py-16">
          <div className="container mx-auto px-4">
            <h1 className="mb-4">Shop by Brand</h1>
            <p className="text-xl text-background/90 max-w-2xl">
              Premium parts from the world's leading motorcycle performance manufacturers
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Brands Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <p className="text-muted-foreground">
                Showing {filteredBrands.length} brand{filteredBrands.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBrands.map((brand) => (
                <Link key={brand.id} to={`/brands/${brand.id}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
                    <CardContent className="p-6">
                      <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <span className="font-bold text-2xl text-foreground/70 group-hover:text-primary transition-colors">
                          {brand.name}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl mb-2">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{brand.description}</p>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="font-medium text-primary">{brand.partsCount}</span>
                          <span className="text-muted-foreground ml-1">Parts</span>
                        </div>
                        <div>
                          <span className="font-medium text-primary">{brand.modelsCount}</span>
                          <span className="text-muted-foreground ml-1">Models</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {filteredBrands.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No brands found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Brands;
