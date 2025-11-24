import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchModels } from "@/store/slices/productsSlice";

const BikeModels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); // The actual search term used in API calls
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dispatch = useAppDispatch();
  const { models, modelsPagination, isLoading } = useAppSelector((state) => state.products);
  const bikeModels = Array.isArray(models) ? models : ((models as any)?.models || []);

  useEffect(() => {
    dispatch(fetchModels({ 
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
    setActiveSearch(searchQuery); // Update the active search term
    setCurrentPage(1); // Reset to first page on new search
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bike models..."
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
                        <SelectItem value="year">Year</SelectItem>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
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

            {/* Models Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-3">
                <p className="text-muted-foreground">
                  {isLoading ? (
                    "Loading models..."
                  ) : modelsPagination ? (
                    `${modelsPagination.total} model${modelsPagination.total !== 1 ? "s" : ""} found`
                  ) : (
                    `${bikeModels.length} model${bikeModels.length !== 1 ? "s" : ""} found`
                  )}
                </p>
              </div>

              {isLoading && bikeModels.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Loading models...</p>
                </div>
              ) : (
                <>
                  {/* Models */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bikeModels.map((model) => (
                      <Link key={model.id} to={`/bike-models/${model.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                          <div className="aspect-square overflow-hidden bg-muted relative">
                            <img
                              src={model.image}
                              alt={`${model.manufacturer} ${model.name}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground mb-1">{model.manufacturer_name}</p>
                            <h3 className="font-bold text-sm mb-1 line-clamp-2">{model.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{model.year}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                              <span className="text-xs text-muted-foreground">{model.category_name}</span>
                              <span className="text-xs font-medium text-primary">
                                {model.partsCount} Parts
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {bikeModels.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No models found matching your filters
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {modelsPagination && modelsPagination.pages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: modelsPagination.pages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === modelsPagination.pages ||
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
                        disabled={currentPage === modelsPagination.pages || isLoading}
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

export default BikeModels;
