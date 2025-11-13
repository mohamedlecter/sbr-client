import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from "@/store/slices/userSlice";

const Addresses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addresses, isLoading } = useAppSelector((state) => state.user);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    label: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // Fetch addresses if not already loaded
    if (addresses.length === 0) {
      dispatch(fetchAddresses());
    }
  }, [isAuthenticated, navigate, dispatch, addresses.length]);

  console.log("addresses", addresses);

  const handleOpenDialog = (address?: any) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        label: address.label || "",
        street: address.street || "",
        city: address.city || "",
        country: address.country || "",
        postalCode: address.postal_code || "",
        isDefault: address.is_default || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        label: "",
        street: "",
        city: "",
        country: "",
        postalCode: "",
        isDefault: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!formData.label || !formData.street || !formData.city || !formData.country) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const addressData = {
        label: formData.label,
        street: formData.street,
        city: formData.city,
        country: formData.country,
        postal_code: formData.postalCode || undefined,
        is_default: formData.isDefault,
      };

      if (editingAddress) {
        // Update existing
        const result = await dispatch(updateAddress({
          id: editingAddress.id,
          ...addressData,
        }));

        if (updateAddress.fulfilled.match(result)) {
          toast({
            title: "Address updated",
            description: "Your address has been updated successfully",
          });
          dispatch(fetchAddresses()); // Refresh addresses
          setIsDialogOpen(false);
        } else {
          toast({
            title: "Update failed",
            description: result.payload as string || "Failed to update address",
            variant: "destructive",
          });
        }
      } else {
        // Add new
        const result = await dispatch(addAddress(addressData));

        if (addAddress.fulfilled.match(result)) {
          toast({
            title: "Address added",
            description: "Your new address has been added successfully",
          });
          dispatch(fetchAddresses()); // Refresh addresses
          setIsDialogOpen(false);
        } else {
          toast({
            title: "Add failed",
            description: result.payload as string || "Failed to add address",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the address",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const result = await dispatch(deleteAddress(id));

      if (deleteAddress.fulfilled.match(result)) {
        toast({
          title: "Address deleted",
          description: "Address has been removed",
        });
        dispatch(fetchAddresses()); // Refresh addresses
      } else {
        toast({
          title: "Delete failed",
          description: result.payload as string || "Failed to delete address",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the address",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, unset all other default addresses
      const addressesToUpdate = addresses.filter((addr) => addr.is_default && addr.id !== id);
      
      // Unset other defaults in parallel
      await Promise.all(
        addressesToUpdate.map((addr) =>
          dispatch(updateAddress({
            id: addr.id,
            is_default: false,
          }))
        )
      );

      // Then set the selected address as default
      const result = await dispatch(updateAddress({
        id,
        is_default: true,
      }));

      if (updateAddress.fulfilled.match(result)) {
        toast({
          title: "Default address updated",
          description: "Your default address has been changed",
        });
        dispatch(fetchAddresses()); // Refresh addresses
      } else {
        toast({
          title: "Update failed",
          description: result.payload as string || "Failed to update default address",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the default address",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Link>
            </Button>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Shipping Addresses</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                  <DialogDescription>
                    {editingAddress
                      ? "Update your shipping address information"
                      : "Add a new shipping address to your account"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      placeholder="Home, Work, etc."
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      placeholder="123 Main Street"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Dubai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="UAE"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                    <Input
                      id="postalCode"
                      placeholder="12345"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isDefault" className="cursor-pointer">
                      Set as default address
                    </Label>
                  </div>
                  <Button onClick={handleSaveAddress} className="w-full" disabled={isSaving}>
                    {isSaving ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center text-muted-foreground">Loading addresses...</div>
              </CardContent>
            </Card>
          ) : addresses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No addresses yet</h3>
                <p className="text-muted-foreground mb-6">Add your first shipping address to get started</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card key={address.id} className={address.is_default ? "border-primary border-2" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {address.label}
                          {address.is_default && (
                            <Badge className="bg-primary">Default</Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{address.street}</p>
                      <p className="text-muted-foreground">
                        {address.city}, {address.country}
                      </p>
                      {address.postal_code && (
                        <p className="text-muted-foreground">Postal Code: {address.postal_code}</p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      {!address.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="flex-1"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(address)}
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Addresses;

