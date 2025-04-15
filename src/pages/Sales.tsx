
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  IndianRupee,
  CreditCard,
  Check,
  FilePlus,
  FileText,
  User,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
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
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Sample medicines for sales
const availableMedicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    manufacturer: "Sun Pharma",
    stock: 1250,
    price: 35,
    expiry: "2025-12-15",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    manufacturer: "Cipla Ltd",
    stock: 850,
    price: 120,
    expiry: "2025-09-20",
  },
  {
    id: "3",
    name: "Atorvastatin 10mg",
    category: "Cardiac",
    manufacturer: "Zydus Healthcare",
    stock: 650,
    price: 85,
    expiry: "2025-08-10",
  },
  {
    id: "4",
    name: "Metformin 500mg",
    category: "Diabetic Care",
    manufacturer: "Dr. Reddy's Labs",
    stock: 920,
    price: 45,
    expiry: "2026-01-25",
  },
  {
    id: "5",
    name: "Loratadine 10mg",
    category: "Allergy",
    manufacturer: "Mankind Pharma",
    stock: 450,
    price: 65,
    expiry: "2025-07-05",
  },
  {
    id: "6",
    name: "Omeprazole 20mg",
    category: "Gastrointestinal",
    manufacturer: "Alkem Labs",
    stock: 750,
    price: 55,
    expiry: "2025-11-30",
  },
  {
    id: "7",
    name: "Vitamin D3 60K",
    category: "Vitamins",
    manufacturer: "USV Private Ltd",
    stock: 320,
    price: 130,
    expiry: "2025-06-10",
  },
  {
    id: "8",
    name: "Cetirizine 10mg",
    category: "Allergy",
    manufacturer: "Micro Labs",
    stock: 680,
    price: 40,
    expiry: "2026-03-15",
  },
];

// Order history
const orderHistory = [
  {
    id: "ORD-1001",
    date: "2025-04-15",
    customer: "Rajiv Mehta",
    items: 4,
    total: 750,
    status: "Completed",
  },
  {
    id: "ORD-1002",
    date: "2025-04-14",
    customer: "Sneha Sharma",
    items: 2,
    total: 280,
    status: "Completed",
  },
  {
    id: "ORD-1003",
    date: "2025-04-14",
    customer: "Ankit Patel",
    items: 5,
    total: 1250,
    status: "Completed",
  },
  {
    id: "ORD-1004",
    date: "2025-04-13",
    customer: "Priya Singh",
    items: 3,
    total: 450,
    status: "Completed",
  },
  {
    id: "ORD-1005",
    date: "2025-04-13",
    customer: "Vikram Reddy",
    items: 1,
    total: 130,
    status: "Completed",
  },
];

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

// Customer form
interface CustomerForm {
  name: string;
  phone: string;
  email: string;
}

// Payment form
interface PaymentForm {
  method: string;
  amount: number;
  reference?: string;
}

const Sales: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [medicines, setMedicines] = useState(availableMedicines);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
  const [customerData, setCustomerData] = useState<CustomerForm>({
    name: "",
    phone: "",
    email: "",
  });

  const customerForm = useForm<CustomerForm>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const paymentForm = useForm<PaymentForm>({
    defaultValues: {
      method: "cash",
      amount: 0,
      reference: "",
    },
  });

  // Update payment amount when cart changes
  useEffect(() => {
    paymentForm.setValue("amount", calculateTotal());
  }, [cart, discountPercentage]);

  // Filter medicines by search query
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add item to cart
  const addToCart = (medicine: any) => {
    const existingItem = cart.find((item) => item.id === medicine.id);

    if (existingItem) {
      // Increase quantity if already in cart
      const updatedCart = cart.map((item) =>
        item.id === medicine.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price,
            }
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity: 1,
          total: medicine.price,
        },
      ]);
    }

    // Update medicine stock
    setMedicines(
      medicines.map((m) =>
        m.id === medicine.id ? { ...m, stock: m.stock - 1 } : m
      )
    );

    toast.success(`Added ${medicine.name} to cart`);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const itemToRemove = cart.find((item) => item.id === itemId);
    
    if (itemToRemove) {
      if (itemToRemove.quantity > 1) {
        // Decrease quantity if more than 1
        const updatedCart = cart.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: item.quantity - 1,
                total: (item.quantity - 1) * item.price,
              }
            : item
        );
        setCart(updatedCart);
      } else {
        // Remove item completely if quantity is 1
        setCart(cart.filter((item) => item.id !== itemId));
      }

      // Update medicine stock
      setMedicines(
        medicines.map((m) =>
          m.id === itemId ? { ...m, stock: m.stock + 1 } : m
        )
      );
    }
  };

  // Delete item from cart
  const deleteFromCart = (itemId: string) => {
    const itemToDelete = cart.find((item) => item.id === itemId);
    
    if (itemToDelete) {
      // Update medicine stock
      setMedicines(
        medicines.map((m) =>
          m.id === itemId ? { ...m, stock: m.stock + itemToDelete.quantity } : m
        )
      );
      
      // Remove item from cart
      setCart(cart.filter((item) => item.id !== itemId));
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  // Calculate discount amount
  const calculateDiscount = () => {
    return (calculateSubtotal() * discountPercentage) / 100;
  };

  // Calculate GST (assuming 12%)
  const calculateGST = () => {
    return ((calculateSubtotal() - calculateDiscount()) * 12) / 100;
  };

  // Calculate total amount
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateGST();
  };

  // Handle payment submission
  const handlePayment = (data: PaymentForm) => {
    // Generate invoice
    const invoice = {
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customer: customerData,
      items: cart,
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      gst: calculateGST(),
      total: calculateTotal(),
      payment: {
        method: data.method,
        amount: data.amount,
        reference: data.reference || "N/A",
      },
    };

    setInvoiceDetails(invoice);
    setShowPaymentDialog(false);
    setShowInvoiceDialog(true);
  };

  // Complete sale and reset
  const completeSale = () => {
    toast.success("Sale completed successfully!");
    setShowInvoiceDialog(false);
    setCart([]);
    setDiscountPercentage(0);
    setCustomerData({
      name: "",
      phone: "",
      email: "",
    });
    customerForm.reset();
    
    // In a real app, we would save the invoice to a database
  };

  // Update customer information
  const updateCustomer = (data: CustomerForm) => {
    setCustomerData(data);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales & Billing</h2>
          <p className="text-muted-foreground">
            Process sales, create invoices, and manage transactions
          </p>
        </div>

        <Tabs defaultValue="newsale" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="newsale">New Sale</TabsTrigger>
            <TabsTrigger value="history">Orders History</TabsTrigger>
          </TabsList>

          <TabsContent value="newsale" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Product list */}
              <div className="md:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Available Medicines</CardTitle>
                    <CardDescription>
                      Search and add medicines to the current sale
                    </CardDescription>
                    <div className="mt-2 relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search medicines by name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Medicine</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMedicines.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center h-24">
                                No medicines found matching your search
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredMedicines.map((medicine) => (
                              <TableRow key={medicine.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{medicine.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {medicine.manufacturer}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{medicine.category}</TableCell>
                                <TableCell>₹{medicine.price.toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {medicine.stock}
                                    {medicine.stock <= 20 && (
                                      <Badge variant="outline" className="ml-2 text-amber-500 border-amber-200 bg-amber-50">
                                        Low
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addToCart(medicine)}
                                    disabled={medicine.stock === 0}
                                    className="text-halomed-500 border-halomed-200"
                                  >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Cart and customer info */}
              <div className="space-y-4">
                {/* Customer information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...customerForm}>
                      <form
                        onSubmit={customerForm.handleSubmit(updateCustomer)}
                        className="space-y-3"
                      >
                        <FormField
                          control={customerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter customer name" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={customerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={customerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter email address" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Update Customer Info
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Cart */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Current Cart
                    </CardTitle>
                    <CardDescription>
                      {cart.length === 0
                        ? "Cart is empty"
                        : `${cart.length} ${cart.length === 1 ? "item" : "items"} in cart`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {cart.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Add medicines from the list to begin
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md border-t">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">Qty</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cart.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    ₹{item.price.toFixed(2)} each
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => {
                                        const medicine = medicines.find(m => m.id === item.id);
                                        if (medicine && medicine.stock > 0) {
                                          addToCart(medicine);
                                        }
                                      }}
                                      disabled={medicines.find(m => m.id === item.id)?.stock === 0}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-500 hover:text-red-600"
                                      onClick={() => deleteFromCart(item.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹{item.total.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <div className="flex w-full flex-col space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Discount (%)</span>
                        <div className="flex items-center gap-2">
                          <Input
                            className="w-16 h-8"
                            value={discountPercentage}
                            onChange={(e) =>
                              setDiscountPercentage(
                                Math.min(100, Math.max(0, Number(e.target.value) || 0))
                              )
                            }
                            type="number"
                            min={0}
                            max={100}
                          />
                          <span>- ₹{calculateDiscount().toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>GST (12%)</span>
                        <span>+ ₹{calculateGST().toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-halomed-500 hover:bg-halomed-600"
                      disabled={cart.length === 0}
                      onClick={() => setShowPaymentDialog(true)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  View and manage recent customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderHistory.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            {new Date(order.date).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>₹{order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <FileText className="h-4 w-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Select payment method and enter details
            </DialogDescription>
          </DialogHeader>

          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePayment)}>
              <div className="space-y-4 py-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <FormField
                  control={paymentForm.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="netbanking">Net Banking</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Received</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={calculateTotal()}
                          step={0.01}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      {field.value > calculateTotal() && (
                        <div className="text-sm text-muted-foreground">
                          Change to return: ₹{(field.value - calculateTotal()).toFixed(2)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {paymentForm.watch("method") !== "cash" && (
                  <FormField
                    control={paymentForm.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter transaction reference" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-halomed-500 hover:bg-halomed-600"
                  disabled={paymentForm.watch("amount") < calculateTotal()}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Complete Payment
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-2xl mb-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Payment Successful
              </div>
            </DialogTitle>
          </DialogHeader>

          {invoiceDetails && (
            <div className="py-4">
              <div className="border rounded-lg">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-halomed-700 flex items-center">
                        HaloMed
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        123 Health Avenue, Mumbai, Maharashtra
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Phone: +91 98765 43210
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Invoice #{invoiceDetails.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(invoiceDetails.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Customer Information</h3>
                    <p className="text-sm">
                      {invoiceDetails.customer.name || "Walk-in Customer"}
                    </p>
                    {invoiceDetails.customer.phone && (
                      <p className="text-sm text-muted-foreground">
                        Phone: {invoiceDetails.customer.phone}
                      </p>
                    )}
                    {invoiceDetails.customer.email && (
                      <p className="text-sm text-muted-foreground">
                        Email: {invoiceDetails.customer.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoiceDetails.items.map((item: CartItem) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{invoiceDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-₹{invoiceDetails.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (12%):</span>
                      <span>+₹{invoiceDetails.gst.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{invoiceDetails.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Payment Information</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="capitalize">{invoiceDetails.payment.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount Received:</span>
                        <span>₹{invoiceDetails.payment.amount.toFixed(2)}</span>
                      </div>
                      {invoiceDetails.payment.amount > invoiceDetails.total && (
                        <div className="flex justify-between">
                          <span>Change:</span>
                          <span>
                            ₹{(invoiceDetails.payment.amount - invoiceDetails.total).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {invoiceDetails.payment.method !== "cash" && (
                        <div className="flex justify-between">
                          <span>Reference:</span>
                          <span>{invoiceDetails.payment.reference}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground mt-4">
                    <p>Thank you for your purchase!</p>
                    <p>For any queries, contact our helpline: +91 98765 43210</p>
                    <p className="text-xs mt-2">
                      * This is a computer-generated invoice and does not require a signature.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => setShowInvoiceDialog(false)}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
                <Button 
                  className="bg-halomed-500 hover:bg-halomed-600"
                  onClick={completeSale}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Complete Sale
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Sales;
