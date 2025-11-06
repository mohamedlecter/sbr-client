import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, ExternalLink, Building2 } from "lucide-react";

const Partners = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock partners data
  const partners = [
    {
      id: 1,
      name: "Akrapovič",
      description:
        "World-renowned manufacturer of premium exhaust systems and performance parts for motorcycles. Known for their titanium and carbon fiber exhaust systems.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
      website: "https://www.akrapovic.com",
      category: "Exhaust Systems",
    },
    {
      id: 2,
      name: "Brembo",
      description:
        "Leading manufacturer of high-performance braking systems. Their brake calipers and rotors are used by top racing teams worldwide.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
      website: "https://www.brembo.com",
      category: "Braking Systems",
    },
    {
      id: 3,
      name: "Öhlins",
      description:
        "Swedish manufacturer of premium suspension components. Their TTX shock absorbers are considered among the best in the industry.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
      website: "https://www.ohlins.com",
      category: "Suspension",
    },
    {
      id: 4,
      name: "Yoshimura",
      description:
        "Japanese manufacturer specializing in exhaust systems and performance parts. Known for their R&D in motorcycle performance.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
      website: "https://www.yoshimura-rd.com",
      category: "Exhaust Systems",
    },
    {
      id: 5,
      name: "Pirelli",
      description:
        "Italian tire manufacturer producing high-performance motorcycle tires. Their Diablo series is popular among sport bike enthusiasts.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
      website: "https://www.pirelli.com",
      category: "Tires",
    },
    {
      id: 6,
      name: "K&N",
      description:
        "Manufacturer of high-flow air filters and intake systems. Their products are known for improving engine performance and efficiency.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
      website: "https://www.knfilters.com",
      category: "Engine Parts",
    },
  ];

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We work with the world's leading manufacturers to bring you the finest motorcycle parts and
              accessories
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Partners Grid */}
          {filteredPartners.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No partners found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <Link key={partner.id} to={`/partners/${partner.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <CardHeader>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-primary/50" />
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {partner.name}
                      </CardTitle>
                      <CardDescription>{partner.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {partner.description}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Partners;

