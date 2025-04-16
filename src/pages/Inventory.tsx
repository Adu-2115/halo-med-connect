import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const initialMedicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    manufacturer: "Sun Pharma",
    stock: 1250,
    price: 35,
    expiry: "2025-12-15",
    batchNo: "BT567890",
    description: "Fever and pain relief medication",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    manufacturer: "Cipla Ltd",
    stock: 850,
    price: 120,
    expiry: "2025-09-20",
    batchNo: "BT123456",
    description: "Broad-spectrum antibiotic",
  },
  {
    id: "3",
    name: "Atorvastatin 10mg",
    category: "Cardiac",
    manufacturer: "Zydus Healthcare",
    stock: 650,
    price: 85,
    expiry: "2025-08-10",
    batchNo: "BT456789",
    description: "Cholesterol lowering medication",
  },
  {
    id: "4",
    name: "Metformin 500mg",
    category: "Diabetic Care",
    manufacturer: "Dr. Reddy's Labs",
    stock: 920,
    price: 45,
    expiry: "2026-01-25",
    batchNo: "BT789012",
    description: "Diabetes management medication",
  },
  {
    id: "5",
    name: "Loratadine 10mg",
    category: "Allergy",
    manufacturer: "Mankind Pharma",
    stock: 450,
    price: 65,
    expiry: "2025-07-05",
    batchNo: "BT345678",
    description: "Anti-allergy medication",
  },
  {
    id: "6",
    name: "Omeprazole 20mg",
    category: "Gastrointestinal",
    manufacturer: "Alkem Labs",
    stock: 750,
    price: 55,
    expiry: "2025-11-30",
    batchNo: "BT901234",
    description: "Acid reflux and ulcer medication",
  },
  {
    id: "7",
    name: "Vitamin D3 60K",
    category: "Vitamins",
    manufacturer: "USV Private Ltd",
    stock: 15,
    price: 130,
    expiry: "2025-06-10",
    batchNo: "BT234567",
    description: "Vitamin D supplement",
  },
  {
    id: "8",
    name: "Cetirizine 10mg",
    category: "Allergy",
    manufacturer: "Micro Labs",
    stock: 680,
    price: 40,
    expiry: "2026-03-15",
    batchNo: "BT890123",
    description: "Anti-allergy medication",
  },
  {
    id: "9",
    name: "Pantoprazole 40mg",
    category: "Gastrointestinal",
    manufacturer: "Intas Pharma",
    stock: 560,
    price: 75,
    expiry: "2025-08-28",
    batchNo: "BT456123",
    description: "Acid reflux and ulcer medication",
  },
  {
    id: "10",
    name: "Aspirin 150mg",
    category: "Cardiac",
    manufacturer: "Sun Pharma",
    stock: 5,
    price: 25,
    expiry: "2025-05-01",
    batchNo: "BT678912",
    description: "Blood thinner medication",
  },
];

const medicineCategories = [
  "All Categories",
  "Pain Relief",
  "Antibiotics",
  "Cardiac",
  "Diabetic Care",
  "Allergy",
  "Gastrointestinal",
  "Vitamins",
];

interface MedicineForm {
  id?: string;
  name: string;
  category: string;
  manufacturer: string;
  stock: number;
  price: number;
  expiry: string;
  batchNo: string;
  description: string;
}

interface DbMedicine {
  medicine_id: number;
  name: string;
  category: string;
  stock_quantity: number;
  price: number;
  expiry_date: string;
  manufacturer?: string;
  batchNo?: string;
  description?: string;
}

interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  stock: number;
  price: number;
  expiry: string;
  batchNo: string;
  description: string;
}

const Inventory: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingMedicine, setEditingMedicine] = useState<MedicineForm | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedicines() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('*');
        
        if (error) {
          console.error('Error fetching medicines:', error);
          toast.error('Failed to load medicines');
          setMedicines(initialMedicines);
        } else if (data) {
          const mappedMedicines: Medicine[] = data.map((dbMed: DbMedicine) => ({
            id: dbMed.medicine_id.toString(),
            name: dbMed.name,
            category: dbMed.category || '',
            manufacturer: dbMed.manufacturer || 'Unknown',
            stock: dbMed.stock_quantity || 0,
            price: dbMed.price,
            expiry: dbMed.expiry_date || new Date().toISOString().substring(0, 10),
            batchNo: dbMed.batchNo || `BT${Math.floor(Math.random() * 1000000)}`,
            description: dbMed.description || '',
          }));
          setMedicines(mappedMedicines);
          console.log('Medicines loaded from Supabase:', mappedMedicines);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred');
        setMedicines(initialMedicines);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedicines();
  }, []);

  const form = useForm<MedicineForm>({
    defaultValues: {
      name: "",
      category: "",
      manufacturer: "",
      stock: 0,
      price: 0,
      expiry: new Date().toISOString().substring(0, 10),
      batchNo: "",
      description: "",
    },
  });

  const filteredMedicines = medicines
    .filter((medicine) => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       medicine.batchNo.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "All Categories" || medicine.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAdd = () => {
    form.reset({
      name: "",
      category: "",
      manufacturer: "",
      stock: 0,
      price: 0,
      expiry: new Date().toISOString().substring(0, 10),
      batchNo: "",
      description: "",
    });
    setEditingMedicine(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (medicine: Medicine) => {
    form.reset({
      ...medicine,
      expiry: new Date(medicine.expiry).toISOString().substring(0, 10),
    });
    setEditingMedicine(medicine);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setMedicineToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (medicineToDelete) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('medicines')
          .delete()
          .eq('medicine_id', parseInt(medicineToDelete));
        
        if (error) {
          console.error('Error deleting medicine:', error);
          toast.error('Failed to delete medicine');
        } else {
          setMedicines(medicines.filter(m => m.id !== medicineToDelete));
          toast.success("Medicine deleted successfully");
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    setIsConfirmDeleteOpen(false);
    setMedicineToDelete(null);
  };

  const onSubmit = async (data: MedicineForm) => {
    setIsLoading(true);
    try {
      if (editingMedicine) {
        const { error } = await supabase
          .from('medicines')
          .update({
            name: data.name,
            category: data.category,
            stock_quantity: data.stock,
            price: data.price,
            expiry_date: data.expiry
          })
          .eq('medicine_id', parseInt(editingMedicine.id));
        
        if (error) {
          console.error('Error updating medicine:', error);
          toast.error('Failed to update medicine');
        } else {
          setMedicines(
            medicines.map((m) => (m.id === editingMedicine.id ? { 
              ...m,
              name: data.name,
              category: data.category,
              manufacturer: data.manufacturer,
              stock: data.stock,
              price: data.price,
              expiry: data.expiry,
              batchNo: data.batchNo,
              description: data.description
            } : m))
          );
          toast.success("Medicine updated successfully");
        }
      } else {
        const { data: newData, error } = await supabase
          .from('medicines')
          .insert({
            name: data.name,
            category: data.category,
            stock_quantity: data.stock,
            price: data.price,
            expiry_date: data.expiry
          })
          .select();
        
        if (error) {
          console.error('Error adding medicine:', error);
          toast.error('Failed to add medicine');
        } else if (newData && newData.length > 0) {
          const newMedicine: Medicine = {
            id: newData[0].medicine_id.toString(),
            name: data.name,
            category: data.category,
            manufacturer: data.manufacturer,
            stock: data.stock,
            price: data.price,
            expiry: data.expiry,
            batchNo: data.batchNo,
            description: data.description
          };
          setMedicines([...medicines, newMedicine]);
          toast.success("Medicine added successfully");
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setIsAddDialogOpen(false);
    }
  };

  const lowStockCount = medicines.filter(m => m.stock <= 20).length;
  const expiringSoonCount = medicines.filter(m => {
    const expiryDate = new Date(m.expiry);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate < threeMonthsFromNow;
  }).length;

  const totalInventoryValue = medicines.reduce((total, medicine) => {
    return total + (medicine.price * medicine.stock);
  }, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
            <p className="text-muted-foreground">
              Manage medicine inventory, track stock levels, and monitor expiry dates.
            </p>
          </div>
          <Button onClick={handleAdd} className="bg-halomed-500 hover:bg-halomed-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Medicine
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Medicines
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicines.length}</div>
              <p className="text-xs text-muted-foreground">
                Active medicines in inventory
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">
                Items with stock ≤ 20 units
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expiring Soon
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiringSoonCount}</div>
              <p className="text-xs text-muted-foreground">
                Items expiring within 3 months
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inventory Value
              </CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalInventoryValue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                Based on current stock and prices
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Inventory</TabsTrigger>
            <TabsTrigger value="lowStock">Low Stock</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:w-2/3">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {medicineCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {filteredMedicines.length} of {medicines.length} items
              </div>
            </div>

            <div className="rounded-md border">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halomed-500"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button 
                          variant="ghost" 
                          className="px-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("name")}
                        >
                          Medicine Name
                          {sortColumn === "name" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="px-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("category")}
                        >
                          Category
                          {sortColumn === "category" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="px-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("stock")}
                        >
                          Stock
                          {sortColumn === "stock" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="px-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("price")}
                        >
                          Price
                          {sortColumn === "price" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="px-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("expiry")}
                        >
                          Expiry
                          {sortColumn === "expiry" && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No medicines found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMedicines.map((medicine) => (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">
                            <div>
                              {medicine.name}
                              <div className="text-xs text-muted-foreground mt-1">
                                {medicine.manufacturer}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{medicine.category}</TableCell>
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
                          <TableCell>₹{medicine.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {new Date(medicine.expiry).toLocaleDateString('en-IN')}
                              {new Date(medicine.expiry) < new Date(new Date().setMonth(new Date().getMonth() + 3)) && (
                                <Badge variant="outline" className="ml-2 text-red-500 border-red-200 bg-red-50">
                                  Soon
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(medicine)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(medicine.id)}
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
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="lowStock">
            <div className="rounded-md border">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halomed-500"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Medicine Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicines.filter(m => m.stock <= 20).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No low stock medicines found
                        </TableCell>
                      </TableRow>
                    ) : (
                      medicines
                        .filter(m => m.stock <= 20)
                        .map((medicine) => (
                          <TableRow key={medicine.id}>
                            <TableCell className="font-medium">
                              <div>
                                {medicine.name}
                                <div className="text-xs text-muted-foreground mt-1">
                                  {medicine.batchNo}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{medicine.category}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                                {medicine.stock} units
                              </Badge>
                            </TableCell>
                            <TableCell>₹{medicine.price.toFixed(2)}</TableCell>
                            <TableCell>{medicine.manufacturer}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(medicine)}
                                className="text-halomed-500 border-halomed-200"
                              >
                                Update Stock
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="expiring">
            <div className="rounded-md border">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halomed-500"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Medicine Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Batch No</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicines.filter(m => {
                      const expiryDate = new Date(m.expiry);
                      const threeMonthsFromNow = new Date();
                      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                      return expiryDate < threeMonthsFromNow;
                    }).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No medicines expiring soon
                        </TableCell>
                      </TableRow>
                    ) : (
                      medicines
                        .filter(m => {
                          const expiryDate = new Date(m.expiry);
                          const threeMonthsFromNow = new Date();
                          threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                          return expiryDate < threeMonthsFromNow;
                        })
                        .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime())
                        .map((medicine) => (
                          <TableRow key={medicine.id}>
                            <TableCell className="font-medium">
                              <div>
                                {medicine.name}
                                <div className="text-xs text-muted-foreground mt-1">
                                  {medicine.manufacturer}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{medicine.category}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                                {new Date(medicine.expiry).toLocaleDateString('en-IN')}
                              </Badge>
                            </TableCell>
                            <TableCell>{medicine.stock} units</TableCell>
                            <TableCell>{medicine.batchNo}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(medicine)}
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteClick(medicine.id)}
                                  className="text-red-500 border-red-200"
                                >
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
            </DialogTitle>
            <DialogDescription>
              {editingMedicine 
                ? "Update medicine information in the inventory" 
                : "Add a new medicine to the inventory database"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter medicine name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicineCategories
                            .filter(cat => cat !== "All Categories")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter manufacturer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="batchNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter batch number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormDescription>Brief description of the medicine</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-halomed-500 hover:bg-halomed-600">
                  {editingMedicine ? "Update Medicine" : "Add Medicine"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medicine? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
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
    </Layout>
  );
};

export default Inventory;
