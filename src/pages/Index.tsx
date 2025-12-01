import { Link } from "react-router-dom";
import { ArrowRight, Bike, Wrench, Sparkles, Building2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import heroImage from "@/assets/hero-motorcycle.jpg";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchManufacturers, fetchModels } from "@/store/slices/productsSlice";
import { cartApi, productsApi, parseImages, getImageUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const dispatch = useAppDispatch();
  const { manufacturers, models, isLoading } = useAppSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [bikeModelsApi, setBikeModelsApi] = useState<CarouselApi | undefined>(undefined);
  const [manufacturersApi, setManufacturersApi] = useState<CarouselApi | undefined>(undefined);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (id: string, quantity: number, name: string) => {
    const { toast } = useToast();
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
          description: `${quantity} x ${name} added to cart`,
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
  useEffect(() => {
    dispatch(fetchManufacturers({}));
    dispatch(fetchModels({}));
  }, [dispatch]);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await productsApi.searchParts({ limit: 12 });
        if (response.data) {
          const data = response.data as any;
          const products = Array.isArray(data) ? data : (data.parts || []);
          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Auto-scroll carousels
  useEffect(() => {
    if (!bikeModelsApi) return;

    const interval = setInterval(() => {
      if (bikeModelsApi.canScrollNext()) {
        bikeModelsApi.scrollNext();
      } else {
        bikeModelsApi.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bikeModelsApi]);

  useEffect(() => {
    if (!manufacturersApi) return;

    const interval = setInterval(() => {
      if (manufacturersApi.canScrollNext()) {
        manufacturersApi.scrollNext();
      } else {
        manufacturersApi.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [manufacturersApi]);


  const bikeModels = Array.isArray(models) ? models : ((models as any)?.models || []);
  const manufacturersList = Array.isArray(manufacturers) ? manufacturers : ((manufacturers as any)?.manufacturers || []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[450px] flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl text-background">
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
                Shop SBR Performance <br />
                {/* <span className="text-primary-glow drop-shadow-lg">GO-FAST Parts!</span> */}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-background/90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                Upgrade your ride with the finest performance parts from top brands worldwide
              </p>
              <Button
                variant="hero"
                size="xl"
                asChild
                className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
              >
                <Link to="/categories">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

                {/* Featured Products */}
                <section className="py-8 sm:py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold">Featured Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {isLoadingProducts ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">Loading featured products...</div>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product: any) => {
                  const productImages = parseImages(product.images);
                  const productImage = productImages.length > 0 ? productImages[0] : (product.image_url || product.image);
                  const productPrice = parseFloat(product.selling_price || product.unit_price || product.price || '0');

                  console.log("productImage", productImage);
                  console.log("product", product);
                  
                  return (
                    <div>

                    <Link key={product.id} to={`/products/parts/${product.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={getImageUrl(productImage)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-2 lg:p-3">
                          <p className="text-[10px] lg:text-xs text-muted-foreground mb-1 line-clamp-1">{product.manufacturer_name || product.manufacturer || 'Manufacturer'}</p>
                          <h3 className="font-bold text-xs lg:text-sm  line-clamp-2">{product.name}</h3>
                          <p className="text-sm lg:text-base mt-1 font-bold text-primary">QAR {productPrice.toLocaleString()}</p>
                          <Button className="w-full mt-2 mb-2" size="sm" variant="outline" onClick={() => handleAddToCart(product.id, 1, product.name)}>
                            <ShoppingCart className="h-4 w-4" />
                            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No featured products available
                </div>
              )}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/categories">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Shop by Bike Model - Carousel */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold">Shop by Bike</h2>
            </div>
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                setApi={setBikeModelsApi}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {isLoading ? (
                    <CarouselItem className="pl-2 md:pl-4 basis-full">
                      <div className="text-center py-8 text-muted-foreground">Loading models...</div>
                    </CarouselItem>
                  ) : bikeModels.length > 0 ? (
                    bikeModels.slice(0, 8).map((model: any) => (
                      <CarouselItem key={model.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                        <Link to={`/bike-models/${model.id}`}>
                          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                            <div className="aspect-[4/3] overflow-hidden bg-muted">
                              <img
                                src={getImageUrl(model.image || model.image_url)}
                                alt={model.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-lg mb-1">{model.name}</h3>
                              <p className="text-sm text-muted-foreground">{model.manufacturer_name || model.year}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="pl-2 md:pl-4 basis-full">
                      <div className="text-center py-8 text-muted-foreground">No models available</div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4" />
                <CarouselNext className="right-2 md:right-4" />
              </Carousel>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/bike-models">
                  View All Models <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Shop by Manufacturer - Carousel */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold">Shop by Manufacturer</h2>
            </div>
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                setApi={setManufacturersApi}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {isLoading ? (
                    <CarouselItem className="pl-2 md:pl-4 basis-full">
                      <div className="text-center py-8 text-muted-foreground">Loading manufacturers...</div>
                    </CarouselItem>
                  ) : manufacturersList.length > 0 ? (
                    manufacturersList.slice(0, 12).map((manufacturer: any) => (
                      <CarouselItem key={manufacturer.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/6">
                        <Link to={`/search?manufacturer=${manufacturer.id}`}>
                          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary group h-full">
                            <div className="aspect-square flex items-center justify-center">
                              {manufacturer.logo_url ? (
                                <img
                                  src={getImageUrl(manufacturer.logo_url)}
                                  alt={manufacturer.name}
                                  className="w-full h-full object-contain p-2"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                  <span className="font-bold text-foreground/70 group-hover:text-primary transition-colors text-center text-sm">
                                    {manufacturer.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Card>
                        </Link>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="pl-2 md:pl-4 basis-full">
                      <div className="text-center py-8 text-muted-foreground">No manufacturers available</div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4" />
                <CarouselNext className="right-2 md:right-4" />
              </Carousel>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/manufacturers">
                  View All Manufacturers <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>




        {/* Trusted Partners */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <h2 className="text-[40px] font-bold">Trusted Partners</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We partner with the world's leading manufacturers to bring you authentic, high-quality parts
              </p>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <Link key={partner.id} to={`/partners/${partner.id}`}>
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="h-8 w-8 text-primary/50" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground">{partner.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div> */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/partners">
                  View All Partners <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <TrustBadges />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
