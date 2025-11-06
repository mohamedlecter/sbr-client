import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, ArrowLeft, Check, Package } from "lucide-react";
import { useState } from "react";

const BikeModels = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Mock bike models data
  const bikeModels = [
    {
      id: 1,
      name: "YZF-R1",
      brand: "Yamaha",
      year: "2020-2024",
      category: "Supersport",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600",
      partsCount: 234,
    },
    {
      id: 2,
      name: "CBR1000RR",
      brand: "Honda",
      year: "2019-2024",
      category: "Supersport",
      image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600",
      partsCount: 198,
    },
    {
      id: 3,
      name: "Ninja ZX-10R",
      brand: "Kawasaki",
      year: "2021-2024",
      category: "Supersport",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
      partsCount: 212,
    },
    {
      id: 4,
      name: "GSX-R1000",
      brand: "Suzuki",
      year: "2017-2024",
      category: "Supersport",
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600",
      partsCount: 176,
    },
    {
      id: 5,
      name: "Panigale V4",
      brand: "Ducati",
      year: "2020-2024",
      category: "Supersport",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      partsCount: 289,
    },
    {
      id: 6,
      name: "S1000RR",
      brand: "BMW",
      year: "2019-2024",
      category: "Supersport",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
      partsCount: 256,
    },
    {
      id: 7,
      name: "MT-09",
      brand: "Yamaha",
      year: "2021-2024",
      category: "Naked",
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600",
      partsCount: 145,
    },
    {
      id: 8,
      name: "Z900",
      brand: "Kawasaki",
      year: "2020-2024",
      category: "Naked",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600",
      partsCount: 134,
    },
  ];

  const brands = ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Ducati", "BMW"];
  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"];

  const filteredModels = bikeModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === "all" || model.brand === selectedBrand;
    const matchesYear = selectedYear === "all" || model.year.includes(selectedYear);
    return matchesSearch && matchesBrand && matchesYear;
  });

  // If viewing a specific bike model detail
  if (id) {
    const model = bikeModels.find((m) => m.id === parseInt(id)) || bikeModels[0];
    const compatibleParts = [
      { id: 1, name: "Akrapovič Racing Exhaust", brand: "Akrapovič", price: 1299, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
      { id: 2, name: "Brembo Brake Caliper Set", brand: "Brembo", price: 899, image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400" },
      { id: 3, name: "Öhlins TTX Shock", brand: "Öhlins", price: 1599, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400" },
      { id: 4, name: "K&N Air Filter Kit", brand: "K&N", price: 149, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400" },
    ];

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-6">
              <Button variant="ghost" asChild>
                <Link to="/bike-models">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Bike Models
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-6">
                  <img
                    src={model.image}
                    alt={`${model.brand} ${model.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl">{model.brand} {model.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{model.category}</Badge>
                      <Badge variant="outline">{model.year}</Badge>
                      <Badge className="bg-primary">{model.partsCount} Compatible Parts</Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Brand</p>
                          <p className="font-medium">{model.brand}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Model</p>
                          <p className="font-medium">{model.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Year Range</p>
                          <p className="font-medium">{model.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-medium">{model.category}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Brand</p>
                      <p className="font-medium">{model.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Model</p>
                      <p className="font-medium">{model.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Year Range</p>
                      <p className="font-medium">{model.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Compatible Parts</p>
                      <p className="font-bold text-primary text-xl">{model.partsCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Compatible Parts */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Compatible Parts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {compatibleParts.map((part) => (
                  <Link key={part.id} to={`/products/parts/${part.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={part.image}
                          alt={part.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{part.brand}</p>
                        <h3 className="font-bold mb-2 line-clamp-2">{part.name}</h3>
                        <p className="text-xl font-bold text-primary">${part.price}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-foreground to-foreground/90 text-background py-16">
          <div className="container mx-auto px-4">
            <h1 className="mb-4">Shop by Bike Model</h1>
            <p className="text-xl text-background/90 max-w-2xl">
              Find parts specifically designed for your motorcycle model
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search bike models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Models Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <p className="text-muted-foreground">
                Showing {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModels.map((model) => (
                <Link key={model.id} to={`/bike-models/${model.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={model.image}
                        alt={`${model.brand} ${model.name}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{model.brand}</p>
                      <h3 className="font-bold text-lg mb-1">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{model.year}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">{model.category}</span>
                        <span className="text-sm font-medium text-primary">
                          {model.partsCount} Parts
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {filteredModels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No models found matching your filters
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BikeModels;
