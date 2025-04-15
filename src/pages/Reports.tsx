import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  Download,
  Filter,
  Search,
  Calendar,
  ChevronDown,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import Package from "@/components/Package"; // Import our custom Package component
import Truck from "@/components/Truck"; // Import our custom Truck component
import Clock from "@/components/Clock"; // Import our custom Clock component
import BrainCircuit from "@/components/BrainCircuit"; // Import our custom BrainCircuit component
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

const Reports: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Sample data for demonstration
  const reportsData = [
    {
      id: "RPT-001",
      title: "Monthly Sales Report",
      description: "Detailed sales analysis for the month of March 2024",
      category: "Sales",
      dateGenerated: "2024-03-31",
      status: "completed",
    },
    {
      id: "RPT-002",
      title: "Inventory Status Report",
      description: "Current stock levels and reorder points",
      category: "Inventory",
      dateGenerated: "2024-04-05",
      status: "completed",
    },
    {
      id: "RPT-003",
      title: "Supplier Performance Report",
      description: "Evaluation of supplier delivery times and product quality",
      category: "Suppliers",
      dateGenerated: "2024-04-10",
      status: "pending",
    },
    {
      id: "RPT-004",
      title: "Customer Feedback Analysis",
      description: "Summary of customer reviews and ratings",
      category: "Customer Service",
      dateGenerated: "2024-04-15",
      status: "completed",
    },
    {
      id: "RPT-005",
      title: "Financial Performance Report",
      description: "Overview of revenue, expenses, and profit margins",
      category: "Finance",
      dateGenerated: "2024-04-20",
      status: "pending",
    },
  ];

  // Filter reports based on search query
  const filteredReports = reportsData.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="suppliers">Suppliers</SelectItem>
                  <SelectItem value="customerService">Customer Service</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
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
                  {filteredReports.length === 0 ? (
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
                        <TableCell>{report.status}</TableCell>
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
