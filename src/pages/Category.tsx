import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, Filter, Trash2, ChevronUp, Grid3x3, List, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { productsApi, getImageUrl } from "@/lib/api";
import { Wrench, Bike, Sparkles, Zap, Shield, Wind, Package } from "lucide-react";

const Category = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);

  // Map category names to icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes('exhaust')) return Wind;
    if (name.includes('suspension')) return Bike;
    if (name.includes('brake')) return Shield;
    if (name.includes('engine')) return Zap;
    if (name.includes('body') || name.includes('fairing')) return Sparkles;
    if (name.includes('wheel') || name.includes('tire')) return Wrench;
    if (name.includes('accessor')) return Package;
    if (name.includes('chassis')) return Bike;
    if (name.includes('driveline')) return Zap;
    if (name.includes('electron')) return Zap;
    if (name.includes('carbon')) return Sparkles;
    return Wrench;
  };

  // Fetch category details
  useEffect(() => {
    if (!id) return;
    
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await productsApi.getCategoryDetails(id);
        if (response.data) {
          const data = response.data as any;
          setCategory(Array.isArray(data) ? data[0] : data);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Fetch products
  useEffect(() => {
    if (!id) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: 20,
          category_id: id,
          sort: sortBy,
          order: sortOrder,
        };

        if (activeSearch) {
          params.search = activeSearch;
        }

        if (inStock && !outOfStock) {
          params.in_stock = true;
        } else if (!inStock && outOfStock) {
          params.in_stock = false;
        }

        if (priceRange[0] > 0) {
          params.min_price = priceRange[0];
        }
        if (priceRange[1] < 10000) {
          params.max_price = priceRange[1];
        }

        const response = await productsApi.searchParts(params);
        if (response.data) {
          const data = response.data as any;
          if (Array.isArray(data)) {
            setProducts(data);
            setPagination(null);
          } else {
            setProducts(data.parts || []);
            setPagination(data.pagination || null);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [id, currentPage, activeSearch, sortBy, sortOrder, inStock, outOfStock, priceRange]);

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAll = () => {
    setInStock(true);
    setOutOfStock(false);
    setPriceRange([0, 10000]);
    setSearchQuery("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  if (isLoading && !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <Button asChild>
              <Link to="/categories">Back to Categories</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = getCategoryIcon(category.name);
  const inStockCount = products.filter((p) => p.in_stock !== false).length;
  const outOfStockCount = products.filter((p) => p.in_stock === false).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-4 sm:mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
          </div>

          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary p-4 rounded-full">
                <Icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                {category.description && (
                  <p className="text-muted-foreground mt-2">{category.description}</p>
                )}
              </div>
            </div>
            {pagination && (
              <p className="text-muted-foreground">
                {pagination.total} products found
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Sidebar - Filters */}
            <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      className="pl-10 h-9"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    className="w-full mt-2"
                  >
                    Search
                  </Button>
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
                      max={10000}
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
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
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

                        {/* Search Filter - Hidden on mobile */}
                        <div className="hidden">
                          <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSearch();
                                }
                              }}
                              className="pl-10 h-9"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={handleSearch}
                            className="w-full mt-2"
                          >
                            Search
                          </Button>
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
                              max={10000}
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
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
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
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="created_at">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Asc</SelectItem>
                      <SelectItem value="desc">Desc</SelectItem>
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
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found matching your filters</p>
                </div>
              ) : (
                <>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"}>
                    {products.map((product) => (
                      <Link key={product.id} to={`/products/parts/${product.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full border">
                          <div className="aspect-square overflow-hidden bg-muted relative">
                            <img
                              src={getImageUrl(product.image_url || product.image)}
                              alt={product.name || ""}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {product.in_stock === false && (
                              <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center">
                                <span className="text-background font-bold text-sm">Out of Stock</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">{product.manufacturer_name || product.manufacturer || ""}</p>
                            <h3 className="font-bold mb-2 line-clamp-2 text-sm">{product.name || ""}</h3>
                            <p className="text-xl font-bold text-primary">
                              QAR {product.price ? product.price.toLocaleString() : '0'},00
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === pagination.pages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2">...</span>;
                        }
                        return null;
                      })}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Category;

