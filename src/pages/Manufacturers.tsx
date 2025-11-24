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
import { Search, Filter, Trash2, ChevronUp, Grid3x3, List, ArrowLeft, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchManufacturers } from "@/store/slices/productsSlice";

const Manufacturers = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const dispatch = useAppDispatch();
  const { manufacturers, manufacturersPagination, isLoading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchManufacturers({ 
      page: currentPage, 
      limit: 20,
      search: activeSearch || undefined,
      sort: sortBy,
      order: sortOrder
    }));
  }, [dispatch, currentPage, activeSearch, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setCurrentPage(1);
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search manufacturers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
              <div className="w-64 shrink-0">
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold text-lg">Filters</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveSearch("");
                          setSortBy("name");
                          setSortOrder("asc");
                          setCurrentPage(1);
                        }}
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="parts_count">Parts Count</SelectItem>
                          <SelectItem value="models_count">Models Count</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

            {/* Manufacturers Grid */}
            <div className="flex-1">
              {/* Results Count & Filter Toggle */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground">
                  {isLoading ? (
                    "Loading manufacturers..."
                  ) : manufacturersPagination ? (
                    `${manufacturersPagination.total} manufacturer${manufacturersPagination.total !== 1 ? "s" : ""} found`
                  ) : (
                    `${manufacturers.length} manufacturer${manufacturers.length !== 1 ? "s" : ""} found`
                  )}
                </p>
              </div>

              {isLoading && manufacturers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Loading manufacturers...</p>
                </div>
              ) : (
                <>
                  {/* Manufacturers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {manufacturers.map((manufacturer) => (
                      <Link key={manufacturer.id} to={`/manufacturers/${manufacturer.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                          <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <span className="font-bold text-lg text-foreground/70 group-hover:text-primary transition-colors">
                              {manufacturer.name}
                            </span>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-bold text-sm mb-1">{manufacturer.name}</h3>
                            {manufacturer.description && (
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{manufacturer.description}</p>
                            )}
                            <div className="flex gap-3 text-xs">
                              {manufacturer.parts_count !== undefined && (
                                <div>
                                  <span className="font-medium text-primary">{manufacturer.parts_count}</span>
                                  <span className="text-muted-foreground ml-1">Parts</span>
                                </div>
                              )}
                              {manufacturer.models_count !== undefined && (
                                <div>
                                  <span className="font-medium text-primary">{manufacturer.models_count}</span>
                                  <span className="text-muted-foreground ml-1">Models</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {manufacturers.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No manufacturers found matching your search
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {manufacturersPagination && manufacturersPagination.pages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: manufacturersPagination.pages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === manufacturersPagination.pages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => handlePageChange(page)}
                              disabled={isLoading}
                              className="min-w-[40px]"
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
                        disabled={currentPage === manufacturersPagination.pages || isLoading}
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

export default Manufacturers;
