import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, Heart, Share2, Check, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, fetch based on id
  const product = {
    id: id || "1",
    name: "Akrapovič Racing Titanium Exhaust System",
    manufacturer: "Akrapovič",
    manufacturerLogo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
    originalPrice: 1599,
    sellingPrice: 1299,
    description:
      "The Racing Line represents a full step in the exhaust system tuning process and offers a great balance between price and performance. The systems are significantly lighter compared to the stock exhaust system and feature exceptional production quality, hi-tech materials, and increased engine performance combined with pure racing sound output.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
    ],
    stockQuantity: 15,
    weight: "2.8 kg",
    color: "Titanium",
    compatibility: ["Yamaha YZF-R1 2020-2024", "Yamaha YZF-R1M 2020-2024"],
    specifications: {
      Material: "Titanium",
      "Weight Reduction": "4.2 kg vs stock",
      "Power Increase": "+3.5 HP",
      "Sound Level": "105 dB",
      Finish: "Brushed Titanium",
    },
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Akrapovič Carbon Fiber Heat Shield",
      manufacturer: "Akrapovič",
      price: 249,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    },
    {
      id: 3,
      name: "Akrapovič Optional Header",
      manufacturer: "Akrapovič",
      price: 899,
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=400",
    },
    {
      id: 4,
      name: "Akrapovič Sound Kit",
      manufacturer: "Akrapovič",
      price: 179,
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
    },
  ];

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/categories" className="hover:text-primary">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <Link to="/categories/1" className="hover:text-primary">
              Exhaust Systems
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={product.manufacturerLogo} alt={product.manufacturer} className="h-8 w-auto" />
                  <span className="text-sm text-muted-foreground">{product.manufacturer}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  {product.stockQuantity > 0 ? (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      In Stock ({product.stockQuantity} available)
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                {product.originalPrice > product.sellingPrice && (
                  <span className="text-2xl text-muted-foreground line-through">${product.originalPrice}</span>
                )}
                <span className="text-4xl font-bold text-primary">${product.sellingPrice}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Specifications */}
              <div>
                <h3 className="font-bold text-lg mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{key}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility */}
              <div>
                <h3 className="font-bold text-lg mb-3">Compatible Models</h3>
                <div className="space-y-2">
                  {product.compatibility.map((model, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{model}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 pt-4 border-t">
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
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={quantity >= product.stockQuantity}
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
                    disabled={product.stockQuantity === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
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
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/products/parts/${item.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{item.manufacturer}</p>
                      <h3 className="font-bold mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-xl font-bold text-primary">${item.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
