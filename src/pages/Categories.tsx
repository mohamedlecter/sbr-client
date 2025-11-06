import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Wrench, Bike, Sparkles, Zap, Shield, Wind, ArrowLeft, Filter, Trash2, ChevronUp, Grid3x3, List, Search } from "lucide-react";
import { useState } from "react";

const Categories = () => {
  const { id } = useParams();
  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 9800]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
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

  // If viewing a specific category detail
  if (id) {
    const category = categories.find((c) => c.id === parseInt(id)) || categories[0];
    const Icon = category.icon;
    const categoryProducts = [
      { id: 1, name: "Akrapovič 2017+ Suzuki GSXR1000R/RR Evolution Line Titanium Full System", brand: "Akrapovič", price: 9800, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", inStock: true },
      { id: 2, name: "Brocks Performance CT Megaphone Full System w/ 17\" Muffler GSX-R1000/R (17-25)", brand: "Brocks Performance", price: 8600, image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400", inStock: true },
      { id: 3, name: "Akrapovič 2021+ Suzuki Hayabusa Racing Line Exhaust", brand: "Akrapovič", price: 7100, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400", inStock: false },
      { id: 4, name: "Yoshimura R-77 Exhaust System", brand: "Yoshimura", price: 5500, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400", inStock: true },
      { id: 5, name: "SC Project S1 Exhaust", brand: "SC Project", price: 4200, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", inStock: false },
      { id: 6, name: "Arrow Pro-Race Exhaust", brand: "Arrow", price: 3800, image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400", inStock: true },
      { id: 7, name: "Termignoni Exhaust System", brand: "Termignoni", price: 6200, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400", inStock: false },
      { id: 8, name: "Two Brothers Exhaust", brand: "Two Brothers", price: 2900, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400", inStock: true },
    ];

    const filteredProducts = categoryProducts.filter((product) => {
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = (inStock && product.inStock) || (outOfStock && !product.inStock);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesStock && matchesPrice;
    });

    const inStockCount = categoryProducts.filter((p) => p.inStock).length;
    const outOfStockCount = categoryProducts.filter((p) => !p.inStock).length;

    const handleClearAll = () => {
      setInStock(true);
      setOutOfStock(false);
      setPriceRange([0, 9800]);
      setSearchQuery("");
    };

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button variant="ghost" asChild>
                <Link to="/categories">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Categories
                </Link>
              </Button>
            </div>

            <div className="flex gap-6">
              {/* Left Sidebar - Filters */}
              <aside className="w-64 shrink-0 hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-foreground" />
                        <h2 className="font-bold text-sm uppercase tracking-wide">FILTER BY</h2>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      CLEAR ALL
                    </Button>
                  </div>

                  {/* Search Filter */}
                  <div>
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity">
                      <span className="font-bold text-sm uppercase tracking-wide">AVAILABILITY</span>
                      <ChevronUp className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="in-stock"
                            checked={inStock}
                            onCheckedChange={(checked) => setInStock(checked as boolean)}
                          />
                          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                            In stock
                          </Label>
                        </div>
                        <span className="text-sm text-muted-foreground">({inStockCount})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="out-of-stock"
                            checked={outOfStock}
                            onCheckedChange={(checked) => setOutOfStock(checked as boolean)}
                          />
                          <Label htmlFor="out-of-stock" className="text-sm font-normal cursor-pointer">
                            Out of stock
                          </Label>
                        </div>
                        <span className="text-sm text-muted-foreground">({outOfStockCount})</span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Price Filter */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity">
                      <span className="font-bold text-sm uppercase tracking-wide">PRICE</span>
                      <ChevronUp className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={9800}
                        min={0}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="h-9"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 9800])}
                          className="h-9"
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            FILTER BY
                          </DrawerTitle>
                        </DrawerHeader>
                        <div className="px-4 pb-4 space-y-6 max-h-[70vh] overflow-y-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearAll}
                            className="w-full justify-start text-muted-foreground"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            CLEAR ALL
                          </Button>

                          {/* Search Filter */}
                          <div>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-9"
                              />
                            </div>
                          </div>

                          <Collapsible defaultOpen>
                            <CollapsibleTrigger className="w-full flex items-center justify-between mb-3">
                              <span className="font-bold text-sm uppercase tracking-wide">AVAILABILITY</span>
                              <ChevronUp className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="in-stock-mobile"
                                    checked={inStock}
                                    onCheckedChange={(checked) => setInStock(checked as boolean)}
                                  />
                                  <Label htmlFor="in-stock-mobile" className="text-sm font-normal cursor-pointer">
                                    In stock
                                  </Label>
                                </div>
                                <span className="text-sm text-muted-foreground">({inStockCount})</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="out-of-stock-mobile"
                                    checked={outOfStock}
                                    onCheckedChange={(checked) => setOutOfStock(checked as boolean)}
                                  />
                                  <Label htmlFor="out-of-stock-mobile" className="text-sm font-normal cursor-pointer">
                                    Out of stock
                                  </Label>
                                </div>
                                <span className="text-sm text-muted-foreground">({outOfStockCount})</span>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          <Collapsible defaultOpen>
                            <CollapsibleTrigger className="w-full flex items-center justify-between mb-3">
                              <span className="font-bold text-sm uppercase tracking-wide">PRICE</span>
                              <ChevronUp className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4">
                              <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={9800}
                                min={0}
                                step={100}
                                className="w-full"
                              />
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={priceRange[0]}
                                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                  className="h-9"
                                />
                                <span className="text-muted-foreground">-</span>
                                <Input
                                  type="number"
                                  value={priceRange[1]}
                                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 9800])}
                                  className="h-9"
                                />
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </DrawerContent>
                    </Drawer>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/products/parts/${product.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full border">
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                          <h3 className="font-bold mb-2 line-clamp-2 text-sm">{product.name}</h3>
                          <p className="text-xl font-bold text-primary">QAR {product.price.toLocaleString()},00</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found matching your filters</p>
                  </div>
                )}
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
