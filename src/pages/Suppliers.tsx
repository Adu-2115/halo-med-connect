
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  Truck, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  Package,
  Clock,
  Calendar,
  ArrowUpDown,
  CheckCircle,
  XCircle
} from "lucide-react";
import User from "@/components/User"; // Import the User component
import Pill from "@/components/Pill"; // Import the Pill component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Sample suppliers data
const initialSuppliers = [
  {
    id: "SUP-001",
    name: "Pharma India Ltd",
    contactPerson: "Rajiv Mehta",
    email: "rajiv.mehta@pharmaindia.com",
    phone: "+91 98765 43210",
    address: "12/A, Industrial Area, Mumbai, Maharashtra",
    categories: ["Antibiotics", "Cardiac", "Pain Relief"],
    rating: 4.5,
    status: "active",
  },
  {
    id: "SUP-002",
    name: "MediVision Healthcare",
    contactPerson: "Anita Sharma",
    email: "anita@medivision.com",
    phone: "+91 87654 32109",
    address: "45, Sector 18, Gurugram, Haryana",
    categories: ["Vitamins", "Supplements", "Skin Care"],
    rating: 4.0,
    status: "active",
  },
  {
    id: "SUP-003",
    name: "Cipla Healthcare",
    contactPerson: "Sanjay Patel",
    email: "sanjay.patel@ciplahealth.com",
    phone: "+91 76543 21098",
    address: "78, Industrial Zone, Ahmedabad, Gujarat",
    categories: ["Antibiotics", "Respiratory", "Anti-allergic"],
    rating: 4.8,
    status: "active",
  },
  {
    id: "SUP-004",
    name: "Zydus Medical Supplies",
    contactPerson: "Priya Singh",
    email: "priya@zydusmedical.com",
    phone: "+91 65432 10987",
    address: "34, Pharmaceutical Hub, Hyderabad, Telangana",
    categories: ["Diabetic Care", "Cardiac", "Antibiotics"],
    rating: 4.2,
    status: "inactive",
  },
  {
    id: "SUP-005",
    name: "Sun Pharma Distributors",
    contactPerson: "Vikram Kumar",
    email: "vikram@sunpharma.com",
    phone: "+91 54321 09876",
    address: "56, Industrial Complex, Chennai, Tamil Nadu",
    categories: ["Pain Relief", "Antibiotics", "Gastrointestinal"],
    rating: 4.7,
    status: "active",
  },
];

// Sample orders data
const initialOrders = [
  {
    id: "ORD-1001",
    supplierId: "SUP-001",
    date: "2025-04-10",
    items: [
      { name: "Amoxicillin 250mg", quantity: 500, price: 60000 },
      { name: "Aspirin 150mg", quantity: 300, price: 9000 },
    ],
    status: "delivered",
    deliveryDate: "2025-04-13",
    total: 69000,
  },
  {
    id: "ORD-1002",
    supplierId: "SUP-003",
    date: "2025-04-12",
    items: [
      { name: "Cetirizine 10mg", quantity: 200, price: 8000 },
      { name: "Paracetamol 500mg", quantity: 1000, price: 35000 },
    ],
    status: "processing",
    deliveryDate: null,
    total: 43000,
  },
  {
    id: "ORD-1003",
    supplierId: "SUP-005",
    date: "2025-04-14",
    items: [
      { name: "Pantoprazole 40mg", quantity: 300, price: 22500 },
      { name: "Omeprazole 20mg", quantity: 400, price: 22000 },
    ],
    status: "processing",
    deliveryDate: null,
    total: 44500,
  },
  {
    id: "ORD-1004",
    supplierId: "SUP-002",
    date: "2025-04-08",
    items: [
      { name: "Vitamin D3 60K", quantity: 500, price: 65000 },
      { name: "Calcium Supplements", quantity: 200, price: 18000 },
    ],
    status: "delivered",
    deliveryDate: "2025-04-12",
    total: 83000,
  },
  {
    id: "ORD-1005",
    supplierId: "SUP-001",
    date: "2025-04-05",
    items: [
      { name: "Amlodipine 5mg", quantity: 300, price: 15000 },
      { name: "Atorvastatin 10mg", quantity: 400, price: 34000 },
    ],
    status: "delivered",
    deliveryDate: "2025-04-09",
    total: 49000,
  },
];

// Form for adding/editing supplier
interface SupplierForm {
  id?: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  status: string;
  rating?: number; // Add the rating property to fix the build error
}

// Form for adding new order
interface OrderForm {
  supplierId: string;
  items: { name: string; quantity: number; price: number }[];
}

const categoryOptions = [
  "Antibiotics",
  "Cardiac",
  "Pain Relief",
  "Vitamins",
  "Supplements",
  "Skin Care",
  "Respiratory",
  "Anti-allergic",
  "Diabetic Care",
  "Gastrointestinal",
];

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierForm | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Setup supplier form
  const supplierForm = useForm<SupplierForm>({
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      categories: [],
      status: "active",
    },
  });

  // Setup order form
  const orderForm = useForm<OrderForm>({
    defaultValues: {
      supplierId: "",
      items: [{ name: "", quantity: 0, price: 0 }],
    },
  });

  // Filter suppliers
  const filteredSuppliers = suppliers
    .filter((supplier) => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      const aValue = (a as any)[sortColumn];
      const bValue = (b as any)[sortColumn];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === "asc" 
        ? aValue - bValue 
        : bValue - aValue;
    });

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== value));
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  // Open add supplier dialog
  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setSelectedCategories([]);
    supplierForm.reset({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      categories: [],
      status: "active",
    });
    setIsAddSupplierOpen(true);
  };

  // Open edit supplier dialog
  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier);
    setSelectedCategories(supplier.categories);
    supplierForm.reset({
      ...supplier,
    });
    setIsAddSupplierOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setSupplierToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Submit supplier form
  const onSubmitSupplier = (data: SupplierForm) => {
    // Add categories from selectedCategories state
    const supplierData = {
      ...data,
      categories: selectedCategories,
      rating: editingSupplier?.rating || 0,
    };

    if (editingSupplier) {
      // Update existing supplier
      setSuppliers(
        suppliers.map((s) => (s.id === editingSupplier.id ? { ...supplierData, id: s.id } : s))
      );
      toast.success("Supplier updated successfully");
    } else {
      // Add new supplier
      const newSupplier = {
        ...supplierData,
        id: `SUP-${suppliers.length + 1}`.padStart(6, '0'),
        rating: 0,
      };
      setSuppliers([...suppliers, newSupplier]);
      toast.success("Supplier added successfully");
    }
    
    setIsAddSupplierOpen(false);
  };

  // Confirm delete supplier
  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(suppliers.filter((s) => s.id !== supplierToDelete));
      toast.success("Supplier deleted successfully");
    }
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  // Add new order item row
  const addOrderItem = () => {
    const currentItems = orderForm.getValues().items;
    orderForm.setValue("items", [...currentItems, { name: "", quantity: 0, price: 0 }]);
  };

  // Remove order item row
  const removeOrderItem = (index: number) => {
    const currentItems = orderForm.getValues().items;
    if (currentItems.length > 1) {
      orderForm.setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  // Submit order form
  const onSubmitOrder = (data: OrderForm) => {
    // Calculate total
    const total = data.items.reduce((sum, item) => sum + item.price, 0);
    
    // Create new order
    const newOrder = {
      id: `ORD-${orders.length + 1001}`,
      supplierId: data.supplierId,
      date: new Date().toISOString().split('T')[0],
      items: data.items,
      status: "processing",
      deliveryDate: null,
      total,
    };
    
    // Add to orders
    setOrders([newOrder, ...orders]);
    
    // Close dialog and reset form
    setIsAddOrderOpen(false);
    orderForm.reset({
      supplierId: "",
      items: [{ name: "", quantity: 0, price: 0 }],
    });
    
    toast.success("Order placed successfully");
  };

  // Mark order as delivered
  const markAsDelivered = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "delivered",
              deliveryDate: new Date().toISOString().split('T')[0],
            }
          : order
      )
    );
    
    toast.success("Order marked as delivered");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Supplier Management</h2>
            <p className="text-muted-foreground">
              Manage suppliers and track orders with vendors
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleAddSupplier}
              className="bg-halomed-500 hover:bg-halomed-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
            <Button 
              onClick={() => setIsAddOrderOpen(true)}
              variant="outline"
            >
              <Package className="mr-2 h-4 w-4" />
              Place Order
            </Button>
          </div>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Supplier Directory</CardTitle>
                <CardDescription>
                  View and manage your list of authorized suppliers
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, contact person, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            className="px-0 hover:bg-transparent font-medium"
                            onClick={() => handleSort("name")}
                          >
                            Supplier
                            {sortColumn === "name" && (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            className="px-0 hover:bg-transparent font-medium"
                            onClick={() => handleSort("rating")}
                          >
                            Rating
                            {sortColumn === "rating" && (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            No suppliers found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSuppliers.map((supplier) => (
                          <TableRow key={supplier.id}>
                            <TableCell>
                              <div className="font-medium">{supplier.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {supplier.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm">
                                  <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{supplier.contactPerson}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{supplier.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{supplier.phone}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {supplier.categories.map((category) => (
                                  <Badge 
                                    key={category} 
                                    variant="outline"
                                    className="text-xs py-0 h-5"
                                  >
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="mr-2 font-medium">{supplier.rating}</div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      filled={i < Math.floor(supplier.rating)}
                                      half={i === Math.floor(supplier.rating) && supplier.rating % 1 >= 0.5}
                                    />
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`
                                  ${supplier.status === "active" ? "bg-green-50 text-green-600 border-green-200" : ""}
                                  ${supplier.status === "inactive" ? "bg-red-50 text-red-500 border-red-200" : ""}
                                `}
                              >
                                {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSupplier(supplier)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(supplier.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Purchase Orders</CardTitle>
                <CardDescription>
                  Track orders placed with suppliers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-24">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => {
                          const supplier = suppliers.find(s => s.id === order.supplierId);
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{supplier?.name || "Unknown Supplier"}</TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString("en-IN")}</TableCell>
                              <TableCell>{order.items.length} items</TableCell>
                              <TableCell>₹{order.total.toLocaleString("en-IN")}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${order.status === "processing" ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                                    ${order.status === "delivered" ? "bg-green-50 text-green-600 border-green-200" : ""}
                                  `}
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {order.status === "processing" ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsDelivered(order.id)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Received
                                  </Button>
                                ) : (
                                  <div className="text-sm text-muted-foreground">
                                    Delivered: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("en-IN") : "N/A"}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
            <DialogDescription>
              {editingSupplier 
                ? "Update supplier information and settings" 
                : "Add a new supplier to your vendor network"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...supplierForm}>
            <form onSubmit={supplierForm.handleSubmit(onSubmitSupplier)} className="space-y-4">
              <FormField
                control={supplierForm.control}
                name="name"
                rules={{ required: "Supplier name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter supplier company name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={supplierForm.control}
                  name="contactPerson"
                  rules={{ required: "Contact person is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter contact person name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={supplierForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter email address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={supplierForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={supplierForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={supplierForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter complete address"
                        className="resize-none min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Product Categories</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {categoryOptions.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="rounded border-gray-300 text-halomed-600 shadow-sm focus:border-halomed-300 focus:ring focus:ring-halomed-200 focus:ring-opacity-50"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddSupplierOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-halomed-500 hover:bg-halomed-600">
                  {editingSupplier ? "Update Supplier" : "Add Supplier"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this supplier? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Place New Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order with a supplier
            </DialogDescription>
          </DialogHeader>
          
          <Form {...orderForm}>
            <form onSubmit={orderForm.handleSubmit(onSubmitOrder)} className="space-y-4">
              <FormField
                control={orderForm.control}
                name="supplierId"
                rules={{ required: "Supplier is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Supplier</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers
                          .filter(s => s.status === "active")
                          .map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel>Order Items</FormLabel>
                </div>
                
                {orderForm.watch("items").map((_, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <div className="grid grid-cols-7 gap-2 flex-1">
                      <FormField
                        control={orderForm.control}
                        name={`items.${index}.name`}
                        rules={{ required: "Item name is required" }}
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl>
                              <Input {...field} placeholder="Item name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={orderForm.control}
                        name={`items.${index}.quantity`}
                        rules={{ required: "Quantity is required" }}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder="Quantity"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={orderForm.control}
                        name={`items.${index}.price`}
                        rules={{ required: "Price is required" }}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder="Price (₹)"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOrderItem(index)}
                      disabled={orderForm.watch("items").length <= 1}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOrderItem}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOrderOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-halomed-500 hover:bg-halomed-600">
                  Place Order
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// Star component for ratings
const Star: React.FC<{ filled: boolean; half: boolean }> = ({ filled, half }) => {
  const fillColor = filled ? "text-amber-400" : "text-gray-300";
  const halfFillColor = half ? "text-amber-400" : "text-gray-300";
  
  return (
    <div className="relative w-4 h-4">
      {/* Full star */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ${fillColor}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
      
      {/* Half-filled overlay */}
      {half && (
        <div className="absolute top-0 left-0 w-2 h-4 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${halfFillColor}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
