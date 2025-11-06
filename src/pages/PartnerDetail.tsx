import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, ExternalLink, Building2, Globe, Mail, Phone } from "lucide-react";

const PartnerDetail = () => {
  const { id } = useParams();

  // Mock partner data
  const partner = {
    id: id || "1",
    name: "Akrapovič",
    description:
      "Akrapovič is a world-renowned manufacturer of premium exhaust systems and performance parts for motorcycles. Founded in 1990 in Slovenia, the company has grown to become one of the most respected names in the motorcycle performance industry.",
    about:
      "With over 30 years of experience, Akrapovič specializes in the development and production of high-performance exhaust systems made from titanium, carbon fiber, and stainless steel. Their products are used by top MotoGP teams and are trusted by motorcycle enthusiasts worldwide. The company's commitment to innovation, quality, and performance has made them a leader in the industry.",
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200",
    website: "https://www.akrapovic.com",
    email: "info@akrapovic.com",
    phone: "+386 4 530 5300",
    category: "Exhaust Systems",
    location: "Slovenia",
    founded: "1990",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/partners">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Partners
              </Link>
            </Button>
          </div>

          {/* Partner Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="h-24 w-24 text-primary/50" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{partner.name}</h1>
                      <Badge className="mb-4">{partner.category}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{partner.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                      <a href={partner.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Website
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About {partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{partner.about}</p>
                </CardContent>
              </Card>

              {/* Products from this partner */}
              <Card>
                <CardHeader>
                  <CardTitle>Products from {partner.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Browse our selection of premium parts from {partner.name}
                  </p>
                  <Button asChild>
                    <Link to={`/brands/${partner.id}`}>View Products</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {partner.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Website</p>
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {partner.website}
                        </a>
                      </div>
                    </div>
                  )}
                  {partner.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Email</p>
                        <a href={`mailto:${partner.email}`} className="text-sm text-primary hover:underline">
                          {partner.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {partner.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Phone</p>
                        <a href={`tel:${partner.phone}`} className="text-sm text-primary hover:underline">
                          {partner.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Company Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {partner.location && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">{partner.location}</p>
                    </div>
                  )}
                  {partner.founded && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Founded</p>
                      <p className="font-medium">{partner.founded}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-medium">{partner.category}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerDetail;

