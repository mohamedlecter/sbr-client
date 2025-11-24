import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { ShoppingCart, User, Search, Menu, X, LogOut, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import { fetchCart } from "@/store/slices/cartSlice";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-border/50">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-1">
              <a
                href="#"
                className="bg-background/10 hover:bg-primary p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="bg-background/10 hover:bg-primary p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="bg-background/10 hover:bg-primary p-2 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="bg-background/10 hover:bg-primary p-2 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <span className="text-sm text-muted-foreground">Hotline:</span>
            <a href="tel:+1234567890" className="text-sm font-semibold text-primary hover:text-primary-light transition-colors">
              +974 5000 0000
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
                <span className="hidden sm:inline">Cart</span>
              </Button>
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary text-primary-foreground font-bold text-2xl px-3 py-1 rounded shadow-lg">
              SBR
            </div>
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Performance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 flex-1">
            <Link to="/bike-models" className="font-medium hover:text-primary transition-colors ml-4">
              Shop by Bike Model
            </Link>
            <Link to="/manufacturers" className="font-medium hover:text-primary transition-colors">
              Shop by Manufacturers
            </Link>
            <Link to="/categories" className="font-medium hover:text-primary transition-colors">
              Shop by Category
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 relative">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              {showSearchInput ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                      setShowSearchInput(false);
                    }
                  }}
                  className="absolute right-0"
                >
                  <div className="relative flex items-center">
                    <Input
                      type="search"
                      placeholder="Search for parts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        // Close search if empty after a short delay
                        setTimeout(() => {
                          if (!searchQuery.trim()) {
                            setShowSearchInput(false);
                          }
                        }, 200);
                      }}
                      autoFocus
                      className="pr-10 w-[300px] transition-all"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearchInput(true)}
                  className="flex-shrink-0"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          {showSearchInput ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  setShowSearchInput(false);
                }
              }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchQuery.trim()) {
                      setShowSearchInput(false);
                    }
                  }, 200);
                }}
                autoFocus
                className="pl-10"
              />
            </form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearchInput(true)}
              className="w-full justify-start"
            >
              <Search className="h-4 w-4 mr-2" />
              Search for parts...
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border space-y-2">
            <Link
              to="/bike-models"
              className="block py-2 px-4 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop by Bike Model
            </Link>
            <Link
              to="/manufacturers"
              className="block py-2 px-4 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop by Manufacturers
            </Link>
            <Link
              to="/categories"
              className="block py-2 px-4 hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop by Category
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
