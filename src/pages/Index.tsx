import { Link } from "react-router-dom";
import { ArrowRight, Bike, Wrench, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustBadges from "@/components/TrustBadges";
import heroImage from "@/assets/hero-motorcycle.jpg";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchBrands, fetchModels } from "@/store/slices/productsSlice";
import { productsApi } from "@/lib/api";
import { getImageUrl } from "@/lib/api";

const Index = () => {
  const dispatch = useAppDispatch();
  const { brands, models, isLoading } = useAppSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    // Fetch brands and models on component mount
    dispatch(fetchBrands());
    dispatch(fetchModels());
  }, [dispatch]);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await productsApi.searchParts({ limit: 4 });
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

  // Extract brands and models from Redux state
  const bikeModels = Array.isArray(models) ? models : ((models as any)?.models || []);
  const brandsList = Array.isArray(brands) ? brands : ((brands as any)?.brands || []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
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
                <span className="text-primary-glow drop-shadow-lg">GO-FAST Parts!</span>
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

        {/* Shop by Bike Model - Carousel */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="">Shop by Bike Model</h2>
            </div>
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
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
                              <p className="text-sm text-muted-foreground">{model.brand_name || model.year}</p>
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

        {/* Shop by Brand - Carousel */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="">Shop by Brand</h2>
            </div>
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {isLoading ? (
                    <CarouselItem className="pl-2 md:pl-4 basis-full">
                      <div className="text-center py-8 text-muted-foreground">Loading brands...</div>
                    </CarouselItem>
                  ) : brandsList.length > 0 ? (
                    brandsList.slice(0, 12).map((brand: any) => (
                      <CarouselItem key={brand.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/6">
                        <Link to={`/brands/${brand.id}`}>
                          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary group h-full">
                            <div className="aspect-square flex items-center justify-center">
                              {brand.logo_url ? (
                                <img
                                  src={getImageUrl(brand.logo_url)}
                                  alt={brand.name}
                                  className="w-full h-full object-contain p-2"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                  <span className="font-bold text-foreground/70 group-hover:text-primary transition-colors text-center text-sm">
                                    {brand.name}
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
                      <div className="text-center py-8 text-muted-foreground">No brands available</div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4" />
                <CarouselNext className="right-2 md:right-4" />
              </Carousel>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/brands">
                  View All Brands <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="">Featured Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingProducts ? (
                <div className="col-span-4 text-center py-8 text-muted-foreground">Loading featured products...</div>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product: any) => (
                  <Link key={product.id} to={`/products/parts/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={getImageUrl(product.image_url || product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{product.brand_name || product.brand || 'Brand'}</p>
                        <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-xl font-bold text-primary">${(product.price || product.unit_price || 0).toFixed(2)}</p>
                        <Button className="w-full mt-3" size="sm">
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-4 text-center py-8 text-muted-foreground">
                  No featured products available
                </div>
              )}
            </div>
          </div>
        </section>


        {/* Trusted Partners */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <h2 className="mb-0">Trusted Partners</h2>
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
