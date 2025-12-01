import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productsApi, cartApi, getImageUrl } from "@/lib/api";

const BikeModelDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [model, setModel] = useState<any>(null);
  const [compatibleParts, setCompatibleParts] = useState<any[]>([]);
  const [relatedModels, setRelatedModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fetch model details
  useEffect(() => {
    const fetchModel = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await productsApi.getModelDetails(id);
        if (response.data) {
          const data = response.data as any;
          
          // Extract model from response
          if (data.model) {
            setModel(data.model);
            
            // Set compatible parts if available
            if (data.parts && Array.isArray(data.parts)) {
              setCompatibleParts(data.parts);
              setPagination(data.pagination || null);
            }
            
            // Set related models if available
            if (data.related_models && Array.isArray(data.related_models)) {
              const filtered = data.related_models.filter((m: any) => m.id !== id);
              setRelatedModels(filtered.slice(0, 3));
            } else {
              // Fallback: fetch related models from the same manufacturer
              if (data.model.manufacturer_id) {
                const relatedResponse = await productsApi.getModels({
                  limit: 4,
                  page: 1
                });
                if (relatedResponse.data) {
                  const related = (relatedResponse.data as any).models || (Array.isArray(relatedResponse.data) ? relatedResponse.data : []);
                  const filtered = related.filter((m: any) => m.id !== id && m.manufacturer_id === data.model.manufacturer_id);
                  setRelatedModels(filtered.slice(0, 3));
                }
              }
            }
          } else {
            // If response is directly the model
            setModel(data);
          }
        }
      } catch (error) {
        console.error('Error fetching model:', error);
        toast({
          title: "Error",
          description: "Failed to load bike model details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModel();
  }, [id, toast]);

  // Fetch compatible parts when page changes (for pagination)
  useEffect(() => {
    const fetchParts = async () => {
      if (!id || !model) return;

      // Only fetch if we need pagination (page > 1 or parts not loaded yet)
      if (currentPage === 1 && compatibleParts.length > 0) return;

      try {
        const response = await productsApi.getModelDetails(id, {
          page: currentPage,
          limit: 12,
          sort: 'name',
          order: 'asc'
        });
        if (response.data) {
          const data = response.data as any;
          if (data.parts && Array.isArray(data.parts)) {
            setCompatibleParts(data.parts);
            setPagination(data.pagination || null);
          }
        }
      } catch (error) {
        console.error('Error fetching compatible parts:', error);
      }
    };

    fetchParts();
  }, [id, currentPage]);

  const handleAddToCart = async (partId: string, partName: string) => {
    setIsAddingToCart(prev => ({ ...prev, [partId]: true }));
    try {
      const response = await cartApi.addToCart('part', partId, 1);
      if (response.error) {
        toast({
          title: "Error",
          description: response.error || "Failed to add to cart",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Added to cart",
          description: `${partName} added to cart`,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [partId]: false }));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading bike model...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Bike model not found</p>
              <Link to="/bike-models" className="text-primary hover:underline mt-4 inline-block">
                Browse all bike models
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const modelImage = model.images && model.images.length > 0 ? model.images[0] : (model.image || model.image_url);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-4 lg:mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/bike-models" className="hover:text-primary">
              Bike Models
            </Link>
            {model.manufacturer_id && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/manufacturers/${model.manufacturer_id}`} className="hover:text-primary">
                  {model.manufacturer_name || 'Manufacturer'}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-foreground">{model.name}</span>
          </nav>

          {/* Model Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 mb-12 lg:mb-16">
            {/* Model Image */}
            <div className="space-y-3 lg:space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted max-w-full mx-auto lg:mx-0">
                {modelImage ? (
                  <img
                    src={getImageUrl(modelImage)}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* Model Details */}
            <div className="space-y-5 lg:space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {model?.manufacturer_logo && (
                    <img src={getImageUrl(model?.manufacturer_logo || '')} alt={model.manufacturer_name} className="h-8 w-auto" />
                  )}
                  <span className="text-sm text-muted-foreground">{model.manufacturer_name || ''}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{model.name}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  {model.year && (
                    <Badge variant="outline" className="text-sm">
                      {model.year}
                    </Badge>
                  )}
                  {model.category_name && (
                    <Badge variant="outline" className="text-sm">
                      {model.category_name}
                    </Badge>
                  )}
                  {model.partsCount !== undefined && (
                    <Badge className="text-sm">
                      {model.partsCount} Compatible Parts
                    </Badge>
                  )}
                </div>
              </div>

              {model.description && (
                <div className="mb-6">
                  <p className="text-muted-foreground leading-relaxed">{model.description}</p>
                </div>
              )}

              {/* Specifications */}
              {(model.engine_size || model.displacement || model.power || model.torque) && (
                <div>
                  <h3 className="font-bold text-lg mb-3 lg:mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    {model.engine_size && (
                      <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Engine Size</p>
                        <p className="font-medium">{model.engine_size}</p>
                      </div>
                    )}
                    {model.displacement && (
                      <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Displacement</p>
                        <p className="font-medium">{model.displacement}</p>
                      </div>
                    )}
                    {model.power && (
                      <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Power</p>
                        <p className="font-medium">{model.power}</p>
                      </div>
                    )}
                    {model.torque && (
                      <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Torque</p>
                        <p className="font-medium">{model.torque}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compatible Parts */}
          <section className="mb-12 lg:mb-16">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold">Compatible Parts</h2>
              {pagination && (
                <p className="text-muted-foreground">
                  {pagination.total} parts available
                </p>
              )}
            </div>

            {compatibleParts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
                  {compatibleParts.map((part: any) => {
                    const partImage = part.images && part.images.length > 0 ? part.images[0] : (part.image_url || part.image);
                    const partPrice = parseFloat(part.selling_price || part.unit_price || part.price || '0');
                    const isInStock = (parseInt(part.quantity || '0')) > 0;
                    const isAdding = isAddingToCart[part.id] || false;
                    
                    return (
                      <div key={part.id} className="group">
                        <Link to={`/products/parts/${part.id}`}>
                          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                            <div className="aspect-square overflow-hidden bg-muted relative">
                              {partImage ? (
                                <img
                                  src={getImageUrl(partImage)}
                                  alt={part.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                  No image
                                </div>
                              )}
                              {!isInStock && (
                                <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center">
                                  <span className="text-background font-bold text-xs">Out of Stock</span>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-2 lg:p-3">
                              <p className="text-[10px] lg:text-xs text-muted-foreground mb-1 line-clamp-1">{part.manufacturer_name || part.manufacturer || ''}</p>
                              <h3 className="font-bold text-xs lg:text-sm line-clamp-2 mb-1">{part.name}</h3>
                              <p className="text-sm lg:text-base font-bold text-primary">QAR {partPrice.toLocaleString()}</p>
                            </CardContent>
                          </Card>
                        </Link>
                        <Button 
                          className="w-full mt-2" 
                          size="sm" 
                          variant="outline"
                          disabled={!isInStock || isAdding}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(part.id, part.name);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {isAdding ? 'Adding...' : 'Add to Cart'}
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
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
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No compatible parts available for this model</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/categories">Browse All Parts</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Related Models */}
          {relatedModels.length > 0 && (
            <section className="mt-1 lg:mt-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">Related Models</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {relatedModels.map((relatedModel: any) => {
                  const relatedImage = relatedModel.images && relatedModel.images.length > 0 ? relatedModel.images[0] : (relatedModel.image || relatedModel.image_url);
                  
                  return (
                    <Link key={relatedModel.id} to={`/bike-models/${relatedModel.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                        <div className="aspect-square overflow-hidden bg-muted relative">
                          {relatedImage ? (
                            <img
                              src={getImageUrl(relatedImage)}
                              alt={relatedModel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">{relatedModel.manufacturer_name || ''}</p>
                          <h3 className="font-bold mb-2 line-clamp-2">{relatedModel.name}</h3>
                          {relatedModel.year && (
                            <p className="text-sm text-muted-foreground">{relatedModel.year}</p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BikeModelDetails;
