import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedColor, setSelectedColor] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(true);

  const categories = ["Exhaust Systems", "Suspension", "Braking", "Engine Parts"];
  const brands = ["Akrapovič", "Brembo", "Öhlins", "K&N", "Yoshimura"];
  const colors = ["Black", "Silver", "Titanium", "Red", "Blue"];

  const products = [
    {
      id: 1,
      name: "Akrapovič Racing Exhaust",
      brand: "Akrapovič",
      price: 1299,
      originalPrice: 1599,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      inStock: true,
      color: "Titanium",
    },
    {
      id: 2,
      name: "Brembo Brake Caliper Set",
      brand: "Brembo",
      price: 899,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400",
      inStock: true,
      color: "Red",
    },
    {
      id: 3,
      name: "Öhlins TTX Shock",
      brand: "Öhlins",
      price: 1599,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
      inStock: false,
      color: "Black",
    },
    {
      id: 4,
      name: "K&N Air Filter Kit",
      brand: "K&N",
      price: 149,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400",
      inStock: true,
      color: "Red",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for motorcycle parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-64 shrink-0">
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-lg">Filters</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedBrand("all");
                          setPriceRange([0, 5000]);
                          setSelectedColor("all");
                          setInStockOnly(false);
                        }}
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Brand</Label>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue />
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
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                      <Slider
                        min={0}
                        max={5000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Colors</SelectItem>
                          {colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="in-stock">In Stock Only</Label>
                      <Switch id="in-stock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort & Filter Toggle */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">{products.length} products found</p>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="date">Date Added</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} to={`/products/parts/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center">
                            <span className="text-background font-bold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                        <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-baseline gap-2">
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary">${product.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
