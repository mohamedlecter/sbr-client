import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, Heart, Share2, Check, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productsApi, cartApi, getImageUrl, parseImages } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await productsApi.getPartDetails(id);
        if (response.data) {
          const data = response.data as any;
          
          // Extract part from response
          if (data.part) {
            setProduct(data.part);
            
            // Use related_parts from response if available
            if (Array.isArray(data.related_parts)) {
              // Filter out the current product
              const filtered = data.related_parts.filter((p: any) => p.id !== id);
              setRelatedProducts(filtered.slice(0, 3));
            } else {
              // Fallback: fetch related products from the same category
              if (data.part.category_id) {
                const relatedResponse = await productsApi.searchParts({
                  category_id: data.part.category_id,
                  limit: 4,
                  page: 1,
                });
  
                if (relatedResponse.data) {
                  const related = Array.isArray((relatedResponse.data as any).parts)
                    ? (relatedResponse.data as any).parts
                    : [];
  
                  const filtered = related.filter((p: any) => p.id !== id);
                  setRelatedProducts(filtered.slice(0, 3));
                }
              } else {
                // No category, no related parts
                setRelatedProducts([]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProduct();
  }, [id, toast]);
  
  const handleAddToCart = async () => {
    if (!product || !id) return;

    setIsAddingToCart(true);
    try {
      const response = await cartApi.addToCart('part', id, quantity);
      if (response.error) {
        toast({
          title: "Error",
          description: response.error || "Failed to add to cart",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Added to cart",
          description: `${quantity} x ${product.name}`,
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
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Product not found</p>
              <Link to="/categories" className="text-primary hover:underline mt-4 inline-block">
                Browse all products
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  const productImages = parseImages(product.images);
  const stockQuantity = parseInt(product.quantity || '0');
  const sellingPrice = parseFloat(product.selling_price || '0');
  const isInStock = stockQuantity > 0;
  const compatibilityList = product.compatibility
  ? product.compatibility.split(',').map(m => m.trim())
  : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-4 lg:mb-6 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
            <div className="flex items-center whitespace-nowrap">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-1 sm:mx-2">/</span>
              <Link to="/categories" className="hover:text-primary">
                Categories
              </Link>
              {product.category_id && (
                <>
                  <span className="mx-1 sm:mx-2">/</span>
                  <Link to={`/categories/${product.category_id}`} className="hover:text-primary">
                    {product.category_name || 'Category'}
                  </Link>
                </>
              )}
              <span className="mx-1 sm:mx-2">/</span>
              <span className="text-foreground truncate max-w-[150px] sm:max-w-none">{product.name}</span>
            </div>
          </nav>

          {/* Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 mb-8 sm:mb-12 lg:mb-16">
            {/* Image Gallery */}
            <div className="space-y-3 lg:space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted max-w-full mx-auto lg:mx-0">
                {productImages.length > 0 ? (
                  <img
                    src={getImageUrl(productImages[selectedImage])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 lg:gap-3">
                  {productImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
                      }`}
                    >
                      <img src={getImageUrl(image)} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-2 lg:space-y-2">
              <div>
                <div className="flex items-center gap-3">
                  {product?.manufacturer_logo && (
                    <img src={getImageUrl(product?.manufacturer_logo || '')} alt={product.manufacturer_name} className="h-8 w-auto" />
                  )}
                  <span className="text-sm text-muted-foreground">{product.manufacturer_name || ''}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 ">
                  {isInStock ? (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      In Stock ({stockQuantity} available)
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-primary">
                  QAR {sellingPrice.toLocaleString()}
                </span>
              </div>
              <div className="mb-6">
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              )}
              </div>


              {/* Specifications */}
              <div>
                <h3 className="font-bold text-lg">Specifications</h3>
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {product.weight && (
                    <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Weight</p>
                      <p className="font-medium">{product.weight} kg</p>
                    </div>
                  )}
                  {product.color_options && (
                    <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Color</p>
                      <p className="font-medium">{product.color_options}</p>
                    </div>
                  )}
                  {product.sku && (
                    <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">SKU</p>
                      <p className="font-medium">{product.sku}</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="bg-muted/50 p-3 lg:p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                      <p className="font-medium">{product.dimensions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Compatibility */}
              {compatibilityList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {compatibilityList.map((model, index) => (
                    <span key={index} className="bg-gray-100 ...">
                      {model}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Not specified</p>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 lg:space-y-5 pt-4 lg:pt-6 border-t">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                      disabled={quantity >= stockQuantity || !isInStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-8 lg:mt-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {relatedProducts.map((item: any) => {
                  const itemImages = parseImages(item.images);
                  const itemImage = itemImages.length > 0 ? itemImages[0] : null;
                  const itemPrice = parseFloat(item.selling_price || '0');
                  const itemIsInStock = (parseInt(item.quantity || '0')) > 0;
                  
                  return (
                    <Link key={item.id} to={`/products/parts/${item.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        <div className="aspect-square overflow-hidden bg-muted relative">
                          {itemImage ? (
                            <img
                              src={getImageUrl(itemImage)}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No image
                            </div>
                          )}
                          {!itemIsInStock && (
                            <div className="absolute inset-0 bg-foreground/80 flex items-center justify-center">
                              <span className="text-background font-bold text-sm">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">{item.manufacturer_name || ''}</p>
                          <h3 className="font-bold mb-2 line-clamp-2">{item.name}</h3>
                          <p className="text-xl font-bold text-primary">QAR {itemPrice.toLocaleString()}</p>
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

export default ProductDetail;
