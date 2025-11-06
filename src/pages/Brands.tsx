import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
import { Search, Filter, Trash2, ChevronUp, Grid3x3, List, ArrowLeft } from "lucide-react";
import { useState } from "react";

const Brands = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 9800]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [productSearchQuery, setProductSearchQuery] = useState("");

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

  // If viewing a specific brand detail
  if (id) {
    const brand = brands.find((b) => b.id === parseInt(id)) || brands[0];
    const brandProducts = [
      { id: 1, name: "Akrapovič 2017+ Suzuki GSXR1000R/RR Evolution Line Titanium Full System", brand: "Akrapovič", price: 9800, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", inStock: true },
      { id: 2, name: "Akrapovič 2021+ Suzuki Hayabusa Racing Line Exhaust", brand: "Akrapovič", price: 7100, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400", inStock: false },
      { id: 3, name: "Akrapovič Racing Titanium Exhaust System", brand: "Akrapovič", price: 1299, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", inStock: true },
      { id: 4, name: "Akrapovič Carbon Fiber Heat Shield", brand: "Akrapovič", price: 249, image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400", inStock: true },
      { id: 5, name: "Akrapovič Optional Header", brand: "Akrapovič", price: 899, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400", inStock: false },
      { id: 6, name: "Akrapovič Sound Kit", brand: "Akrapovič", price: 179, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400", inStock: true },
    ];

    const filteredProducts = brandProducts.filter((product) => {
      const matchesSearch = productSearchQuery === "" || 
        product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(productSearchQuery.toLowerCase());
      const matchesStock = (inStock && product.inStock) || (outOfStock && !product.inStock);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesStock && matchesPrice;
    });

    const inStockCount = brandProducts.filter((p) => p.inStock).length;
    const outOfStockCount = brandProducts.filter((p) => !p.inStock).length;

    const handleClearAll = () => {
      setInStock(true);
      setOutOfStock(false);
      setPriceRange([0, 9800]);
      setProductSearchQuery("");
    };

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button variant="ghost" asChild>
                <Link to="/brands">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Brands
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
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
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
                            id="in-stock-brand"
                            checked={inStock}
                            onCheckedChange={(checked) => setInStock(checked as boolean)}
                          />
                          <Label htmlFor="in-stock-brand" className="text-sm font-normal cursor-pointer">
                            In stock
                          </Label>
                        </div>
                        <span className="text-sm text-muted-foreground">({inStockCount})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="out-of-stock-brand"
                            checked={outOfStock}
                            onCheckedChange={(checked) => setOutOfStock(checked as boolean)}
                          />
                          <Label htmlFor="out-of-stock-brand" className="text-sm font-normal cursor-pointer">
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
                {/* Brand Header */}
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{brand.name}</h1>
                  <p className="text-muted-foreground">{brand.description}</p>
                </div>

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
                                value={productSearchQuery}
                                onChange={(e) => setProductSearchQuery(e.target.value)}
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
                                    id="in-stock-brand-mobile"
                                    checked={inStock}
                                    onCheckedChange={(checked) => setInStock(checked as boolean)}
                                  />
                                  <Label htmlFor="in-stock-brand-mobile" className="text-sm font-normal cursor-pointer">
                                    In stock
                                  </Label>
                                </div>
                                <span className="text-sm text-muted-foreground">({inStockCount})</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="out-of-stock-brand-mobile"
                                    checked={outOfStock}
                                    onCheckedChange={(checked) => setOutOfStock(checked as boolean)}
                                  />
                                  <Label htmlFor="out-of-stock-brand-mobile" className="text-sm font-normal cursor-pointer">
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
