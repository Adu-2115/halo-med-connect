
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  Download,
  Filter,
  Search,
  Calendar,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  LineChart,
  BarChart,
  PieChart
} from "lucide-react";
import Package from "@/components/Package";
import Truck from "@/components/Truck";
import Clock from "@/components/Clock";
import BrainCircuit from "@/components/BrainCircuit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import NestedQueryButton from "@/components/ui/nested-query-button";
import { where, select, join, groupBy, orderBy } from "@/utils/nestedQueries";
import { toast } from "sonner";

const Reports: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isLoadingQueryResults, setIsLoadingQueryResults] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);

  // Fetch reports data from Supabase
  useEffect(() => {
    async function fetchReports() {
      setIsLoadingReports(true);
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*');
        
        if (error) {
          console.error("Error fetching reports:", error);
          toast.error("Failed to load reports");
          setReportsData([]);
        } else {
          // Transform the data to match our expected format
          const formattedData = data.map(report => ({
            id: `RPT-${report.report_id.toString().padStart(3, '0')}`,
            title: report.report_type || "Untitled Report",
            description: report.content || "No description available",
            category: report.report_type || "General",
            dateGenerated: report.report_date || new Date().toISOString().split('T')[0],
            status: "completed",
            generatedBy: report.generated_by || "System"
          }));
          
          setReportsData(formattedData);
        }
      } catch (error) {
        console.error("Error in reports fetch:", error);
        toast.error("An error occurred while loading reports");
        setReportsData([]);
      } finally {
        setIsLoadingReports(false);
      }
    }

    fetchReports();
  }, []);

  // Sample nested query executions
  const executeInventoryAnalysis = async () => {
    setIsLoadingQueryResults(true);
    try {
      // Fetch medicines and inventorylogs
      const { data: medicines, error: medicinesError } = await supabase
        .from('medicines')
        .select('*');
      
      const { data: logs, error: logsError } = await supabase
        .from('inventorylogs')
        .select('*');
        
      if (medicinesError || logsError) {
        throw new Error("Error fetching data");
      }
      
      // Run nested query on client-side
      const results = join(
        medicines || [],
        logs || [],
        'medicine_id',
        'medicine_id',
        (medicine, log) => ({
          medicineName: medicine.name,
          category: medicine.category,
          stockQuantity: medicine.stock_quantity,
          lastChange: log ? {
            date: log.log_date,
            quantity: log.quantity_changed,
            changeType: log.change_type
          } : null
        })
      );
      
      // Filter results to only show items with recent changes
      const filteredResults = where(results, item => item.lastChange !== null);
      
      setQueryResults(filteredResults);
      toast.success("Inventory analysis complete");
    } catch (error) {
      console.error("Nested query error:", error);
      toast.error("Failed to run inventory analysis");
    } finally {
      setIsLoadingQueryResults(false);
    }
  };

  const executeCategoryAnalysis = async () => {
    setIsLoadingQueryResults(true);
    try {
      // Fetch medicines
      const { data: medicines, error: medicinesError } = await supabase
        .from('medicines')
        .select('*');
      
      if (medicinesError) {
        throw new Error("Error fetching medicine data");
      }
      
      // Group by category and count items
      const results = groupBy(medicines || [], 'category', (items) => ({
        count: items.length,
        totalStock: items.reduce((sum, item) => sum + (item.stock_quantity || 0), 0),
        averagePrice: items.reduce((sum, item) => sum + (item.price || 0), 0) / items.length
      }));
      
      setQueryResults(results);
      toast.success("Category analysis complete");
    } catch (error) {
      console.error("Nested query error:", error);
      toast.error("Failed to run category analysis");
    } finally {
      setIsLoadingQueryResults(false);
    }
  };

  const executeLowStockAnalysis = async () => {
    setIsLoadingQueryResults(true);
    try {
      // Fetch medicines
      const { data: medicines, error: medicinesError } = await supabase
        .from('medicines')
        .select('*');
      
      if (medicinesError) {
        throw new Error("Error fetching medicine data");
      }
      
      // Filter low stock items and sort by quantity
      const lowStockItems = where(medicines || [], item => (item.stock_quantity || 0) < 30);
      const results = orderBy(lowStockItems, 'stock_quantity', 'asc');
      
      // Select only needed fields
      const filteredResults = select(results, ['medicine_id', 'name', 'category', 'stock_quantity', 'price']);
      
      setQueryResults(filteredResults);
      toast.success("Low stock analysis complete");
    } catch (error) {
      console.error("Nested query error:", error);
      toast.error("Failed to run low stock analysis");
    } finally {
      setIsLoadingQueryResults(false);
    }
  };

  // Filter reports based on search query and category
  const filteredReports = reportsData.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || report.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter dropdown
  const reportCategories = ["All", ...Array.from(new Set(reportsData.map(report => report.category)))];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
            <p className="text-muted-foreground">
              Generate insights and track key performance indicators
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-halomed-500 hover:bg-halomed-600">
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Analysis
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Run advanced analysis on inventory data
                </p>
                <NestedQueryButton 
                  onExecute={executeInventoryAnalysis} 
                  isLoading={isLoadingQueryResults}
                  label="Run Analysis"
                  icon={<LineChart className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Category Analysis
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Group and analyze products by category
                </p>
                <NestedQueryButton 
                  onExecute={executeCategoryAnalysis} 
                  isLoading={isLoadingQueryResults}
                  label="Run Analysis"
                  icon={<PieChart className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Analysis
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Identify products with low stock levels
                </p>
                <NestedQueryButton 
                  onExecute={executeLowStockAnalysis} 
                  isLoading={isLoadingQueryResults}
                  label="Run Analysis"
                  icon={<BarChart className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {queryResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Query Results</CardTitle>
              <CardDescription>
                Results from your last analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(queryResults[0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queryResults.slice(0, 10).map((result, index) => (
                      <TableRow key={index}>
                        {Object.values(result).map((value: any, i) => (
                          <TableCell key={i}>
                            {typeof value === 'object' && value !== null 
                              ? JSON.stringify(value)
                              : String(value === null ? '-' : value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {queryResults.length > 10 && (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Showing 10 of {queryResults.length} results
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Report Overview</CardTitle>
            <CardDescription>
              Track and manage generated reports
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[180px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2020-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {reportCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingReports ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Loading reports...
                      </TableCell>
                    </TableRow>
                  ) : filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No reports found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.category}</TableCell>
                        <TableCell>{report.dateGenerated}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {report.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
      </div>
    </Layout>
  );
};

export default Reports;
