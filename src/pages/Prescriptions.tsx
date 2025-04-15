import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  FileText, 
  UploadCloud, 
  Check, 
  X, 
  Edit, 
  Eye,
  ChevronDown,
  Search,
  Filter,
  Calendar,
  FilePlus,
  User,
  PlusIcon
} from "lucide-react";
import { Pill } from "@/components/Pill";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PrescriptionItem {
  name: string;
  dosage: string;
  duration: string;
}

interface Prescription {
  id: string;
  prescription_id: string;
  patient: string;
  doctor: string;
  date: string;
  status: "pending" | "completed" | "rejected";
  items: PrescriptionItem[];
  notes: string;
  imageUrl: string | null;
}

interface PrescriptionForm {
  patient: string;
  doctor: string;
  notes: string;
  items: PrescriptionItem[];
  imageFile?: FileList;
}

const Prescriptions: React.FC = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<PrescriptionForm>({
    defaultValues: {
      patient: "",
      doctor: "",
      notes: "",
      items: [{ name: "", dosage: "", duration: "" }],
    },
  });

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (prescriptionsError) {
        throw prescriptionsError;
      }

      const prescriptionsWithItems = await Promise.all(
        prescriptionsData.map(async (prescription) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('prescription_items')
            .select('*')
            .eq('prescription_id', prescription.prescription_id);

          if (itemsError) {
            throw itemsError;
          }

          return {
            id: prescription.id,
            prescription_id: prescription.prescription_id,
            patient: prescription.patient,
            doctor: prescription.doctor,
            date: prescription.date,
            status: prescription.status as "pending" | "completed" | "rejected",
            notes: prescription.notes || "",
            imageUrl: prescription.image_url,
            items: itemsData || []
          };
        })
      );

      setPrescriptions(prescriptionsWithItems);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch = 
      prescription.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.prescription_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `prescriptions/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const savePrescription = async (prescription: any, items: PrescriptionItem[]) => {
    try {
      const { data: prescriptionData, error: prescriptionError } = await supabase
        .from('prescriptions_data')
        .insert([prescription])
        .select();

      if (prescriptionError) {
        throw prescriptionError;
      }

      const itemsWithPrescriptionId = items.map(item => ({
        ...item,
        prescription_id: prescription.prescription_id
      }));

      const { error: itemsError } = await supabase
        .from('prescription_items')
        .insert(itemsWithPrescriptionId);

      if (itemsError) {
        throw itemsError;
      }

      return prescriptionData[0];
    } catch (error) {
      console.error('Error saving prescription:', error);
      throw error;
    }
  };

  const updatePrescriptionStatus = async (prescriptionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('prescriptions_data')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('prescription_id', prescriptionId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }
  };

  const onSubmit = async (data: PrescriptionForm) => {
    try {
      let imageUrl = null;
      
      if (data.imageFile && data.imageFile[0]) {
        imageUrl = await uploadImage(data.imageFile[0]);
      }
      
      const newPrescriptionId = `PRES-${Date.now().toString().slice(-6)}`;
      
      const newPrescription = {
        prescription_id: newPrescriptionId,
        patient: data.patient,
        doctor: data.doctor,
        date: new Date().toISOString().split('T')[0],
        status: "pending" as const,
        notes: data.notes,
        image_url: imageUrl,
      };
      
      const validItems = data.items.filter(item => item.name.trim() !== "");
      
      await savePrescription(newPrescription, validItems);
      
      toast.success("Prescription added successfully");
      
      setShowAddDialog(false);
      setImagePreview(null);
      form.reset({
        patient: "",
        doctor: "",
        notes: "",
        items: [{ name: "", dosage: "", duration: "" }],
      });
      
      fetchPrescriptions();
    } catch (error) {
      console.error('Error submitting prescription:', error);
      toast.error('Failed to add prescription');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItemRow = () => {
    const currentItems = form.getValues().items;
    form.setValue("items", [...currentItems, { name: "", dosage: "", duration: "" }]);
  };

  const removeItemRow = (index: number) => {
    const currentItems = form.getValues().items;
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  const viewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowViewDialog(true);
  };

  const updateStatus = async (id: string, newStatus: "pending" | "completed" | "rejected") => {
    try {
      await updatePrescriptionStatus(id, newStatus);
      
      setPrescriptions(
        prescriptions.map((p) =>
          p.prescription_id === id ? { ...p, status: newStatus } : p
        )
      );
      
      if (selectedPrescription?.prescription_id === id) {
        setSelectedPrescription({
          ...selectedPrescription,
          status: newStatus
        });
      }
      
      toast.success(`Prescription ${newStatus === "completed" ? "approved" : "rejected"}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update prescription status');
    }
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const isCustomer = user?.role === "customer";

  const customerPrescriptions = isCustomer 
    ? filteredPrescriptions.filter(p => p.patient === "Amit Kumar") 
    : filteredPrescriptions;

  useEffect(() => {
    const createStorageBucket = async () => {
      try {
        const { data, error } = await supabase.storage.getBucket('prescriptions');
        
        if (error && error.message.includes('does not exist')) {
          await supabase.storage.createBucket('prescriptions', {
            public: true
          });
        }
      } catch (error) {
        console.error('Error checking/creating storage bucket:', error);
      }
    };
    
    createStorageBucket();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Prescription Management</h2>
            <p className="text-muted-foreground">
              {isAdmin || isStaff 
                ? "Process, validate, and fulfill patient prescriptions" 
                : "View and manage your prescriptions"}
            </p>
          </div>
          {isCustomer && (
            <Button 
              onClick={() => {
                form.reset({
                  patient: "Amit Kumar",
                  doctor: "",
                  notes: "",
                  items: [{ name: "", dosage: "", duration: "" }],
                });
                setShowAddDialog(true);
              }}
              className="bg-halomed-500 hover:bg-halomed-600"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Upload Prescription
            </Button>
          )}
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Prescriptions</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            {isAdmin || isStaff ? <TabsTrigger value="rejected">Rejected</TabsTrigger> : null}
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pending Prescriptions</CardTitle>
                <CardDescription>
                  {isAdmin || isStaff 
                    ? "Prescriptions that need to be processed" 
                    : "Your prescriptions awaiting processing"}
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient, doctor, or ID..."
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
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            Loading prescriptions...
                          </TableCell>
                        </TableRow>
                      ) : customerPrescriptions
                          .filter(p => p.status === "pending")
                          .length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            No active prescriptions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        customerPrescriptions
                          .filter(p => p.status === "pending")
                          .map((prescription) => (
                            <TableRow key={prescription.id}>
                              <TableCell className="font-medium">{prescription.prescription_id}</TableCell>
                              <TableCell>{prescription.patient}</TableCell>
                              <TableCell>{prescription.doctor}</TableCell>
                              <TableCell>
                                {new Date(prescription.date).toLocaleDateString("en-IN")}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                  Pending
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => viewPrescription(prescription)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  {(isAdmin || isStaff) && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateStatus(prescription.prescription_id, "completed")}
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateStatus(prescription.prescription_id, "rejected")}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                    </>
                                  )}
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

          <TabsContent value="completed">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Completed Prescriptions</CardTitle>
                <CardDescription>
                  Successfully processed and fulfilled prescriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            Loading prescriptions...
                          </TableCell>
                        </TableRow>
                      ) : customerPrescriptions
                          .filter(p => p.status === "completed")
                          .length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">
                            No completed prescriptions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        customerPrescriptions
                          .filter(p => p.status === "completed")
                          .map((prescription) => (
                            <TableRow key={prescription.id}>
                              <TableCell className="font-medium">{prescription.prescription_id}</TableCell>
                              <TableCell>{prescription.patient}</TableCell>
                              <TableCell>{prescription.doctor}</TableCell>
                              <TableCell>
                                {new Date(prescription.date).toLocaleDateString("en-IN")}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  Completed
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => viewPrescription(prescription)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
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
          </TabsContent>

          {(isAdmin || isStaff) && (
            <TabsContent value="rejected">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Rejected Prescriptions</CardTitle>
                  <CardDescription>
                    Prescriptions that were rejected or could not be fulfilled
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                              Loading prescriptions...
                            </TableCell>
                          </TableRow>
                        ) : customerPrescriptions
                            .filter(p => p.status === "rejected")
                            .length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                              No rejected prescriptions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          customerPrescriptions
                            .filter(p => p.status === "rejected")
                            .map((prescription) => (
                              <TableRow key={prescription.id}>
                                <TableCell className="font-medium">{prescription.prescription_id}</TableCell>
                                <TableCell>{prescription.patient}</TableCell>
                                <TableCell>{prescription.doctor}</TableCell>
                                <TableCell>
                                  {new Date(prescription.date).toLocaleDateString("en-IN")}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                    Rejected
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => viewPrescription(prescription)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateStatus(prescription.prescription_id, "pending")}
                                    >
                                      <Edit className="h-4 w-4 mr-1" />
                                      Reconsider
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
          )}
        </Tabs>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Prescription</DialogTitle>
            <DialogDescription>
              Upload a prescription image or enter details manually
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter patient name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter doctor name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <Label>Upload Prescription Image (Optional)</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center">
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                    
                    {imagePreview ? (
                      <div className="space-y-2 w-full">
                        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Prescription Preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setImagePreview(null)}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">
                          Click or drag and drop to upload
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="max-w-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Prescription Items</Label>
                <div className="mt-2 space-y-3">
                  {form.watch("items").map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Medicine name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`items.${index}.dosage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Dosage" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`items.${index}.duration`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Duration" />
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
                        onClick={() => removeItemRow(index)}
                        disabled={form.watch("items").length <= 1}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItemRow}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Medicine
                  </Button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Any additional notes or instructions"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-halomed-500 hover:bg-halomed-600">
                  Upload Prescription
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedPrescription && (
            <>
              <DialogHeader>
                <DialogTitle>Prescription Details</DialogTitle>
                <DialogDescription>
                  {selectedPrescription.prescription_id} - {new Date(selectedPrescription.date).toLocaleDateString("en-IN")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Patient Information</h3>
                    </div>
                    <p className="text-sm">{selectedPrescription.patient}</p>
                  </div>
                  
                  <Badge
                    variant="outline"
                    className={`
                      ${selectedPrescription.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                      ${selectedPrescription.status === "completed" ? "bg-green-50 text-green-600 border-green-200" : ""}
                      ${selectedPrescription.status === "rejected" ? "bg-red-50 text-red-600 border-red-200" : ""}
                    `}
                  >
                    {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">Prescription Details</h3>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span>{selectedPrescription.doctor}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(selectedPrescription.date).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                
                {selectedPrescription.imageUrl && (
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Prescription Image</h3>
                    </div>
                    
                    <div className="mt-2 rounded-md border overflow-hidden">
                      <img 
                        src={selectedPrescription.imageUrl} 
                        alt="Prescription"
                        className="w-full h-auto max-h-[300px] object-contain bg-muted"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center mb-2">
                    <Pill className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">Prescribed Medications</h3>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPrescription.items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                              No medications listed
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectedPrescription.items.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.dosage}</TableCell>
                              <TableCell>{item.duration}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {selectedPrescription.notes && (
                  <div>
                    <div className="flex items-center mb-1">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">Additional Notes</h3>
                    </div>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                      {selectedPrescription.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Prescriptions;
