
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  BarChart3, 
  FileDown, 
  Calendar, 
  Filter, 
  RefreshCw,
  ArrowDown,
  ArrowUp,
  TrendingUp,
  TrendingDown,
  Pill,
  CircleDollarSign,
  AlertCircle,
  ShoppingCart,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Sample data for sales report
const salesData = [
  { month: "Jan", revenue: 156000, orders: 423, profit: 65700 },
  { month: "Feb", revenue: 142000, orders: 398, profit: 59400 },
  { month: "Mar", revenue: 182000, orders: 486, profit: 76800 },
  { month: "Apr", revenue: 195000, orders: 512, profit: 83200 },
  { month: "May", revenue: 176000, orders: 453, profit: 75600 },
  { month: "Jun", revenue: 210000, orders: 539, profit: 92300 },
  { month: "Jul", revenue: 188000, orders: 486, profit: 81400 },
  { month: "Aug", revenue: 178000, orders: 467, profit: 77200 },
  { month: "Sep", revenue: 192000, orders: 502, profit: 84600 },
  { month: "Oct", revenue: 228000, orders: 576, profit: 102600 },
  { month: "Nov", revenue: 204000, orders: 534, profit: 91800 },
  { month: "Dec", revenue: 252000, orders: 623, profit: 114300 },
];

// Sample data for inventory report
const inventoryData = [
  { category: "Antibiotics", stock: 2850, value: 342000, items: 15 },
  { category: "Pain Relief", stock: 3250, value: 227500, items: 12 },
  { category: "Cardiac", stock: 1780, value: 267000, items: 18 },
  { category: "Vitamins", stock: 4320, value: 345600, items: 22 },
  { category: "Diabetic Care", stock: 1450, value: 188500, items: 10 },
  { category: "Allergy", stock: 2240, value: 179200, items: 8 },
];

// Sample data for low stock items
const lowStockData = [
  { id: "MED-1001", name: "Aspirin 150mg", category: "Cardiac", stock: 5, minRequired: 50, supplier: "Sun Pharma Distributors" },
  { id: "MED-1002", name: "Vitamin D3 60K", category: "Vitamins", stock: 15, minRequired: 30, supplier: "MediVision Healthcare" },
  { id: "MED-1003", name: "Insulin Pen", category: "Diabetic Care", stock: 8, minRequired: 20, supplier: "Zydus Medical Supplies" },
  { id: "MED-1004", name: "Salbutamol Inhaler", category: "Respiratory", stock: 12, minRequired: 25, supplier: "Cipla Healthcare" },
  { id: "MED-1005", name: "Ibuprofen 400mg", category: "Pain Relief", stock: 18, minRequired: 40, supplier: "Pharma India Ltd" },
];

// Sample data for expiring items
const expiringData = [
  { id: "MED-2001", name: "Amoxicillin 250mg", category: "Antibiotics", stock: 120, expiry: "2025-05-15", daysLeft: 28 },
  { id: "MED-2002", name: "Loratadine 10mg", category: "Allergy", stock: 85, expiry: "2025-05-20", daysLeft: 33 },
  { id: "MED-2003", name: "Paracetamol 500mg", category: "Pain Relief", stock: 230, expiry: "2025-06-10", daysLeft: 54 },
  { id: "MED-2004", name: "Metformin 500mg", category: "Diabetic Care", stock: 95, expiry: "2025-06-25", daysLeft: 69 },
  { id: "MED-2005", name: "Amlodipine 5mg", category: "Cardiac", stock: 42, expiry: "2025-07-05", daysLeft: 79 },
];

// Sample data for supplier performance
const supplierData = [
  { supplier: "Pharma India Ltd", ordersCompleted: 24, onTimeDelivery: 92, qualityScore: 4.7, totalSpend: 286000 },
  { supplier: "MediVision Healthcare", ordersCompleted: 18, onTimeDelivery: 89, qualityScore: 4.2, totalSpend: 195000 },
  { supplier: "Cipla Healthcare", ordersCompleted: 22, onTimeDelivery: 95, qualityScore: 4.8, totalSpend: 312000 },
  { supplier: "Zydus Medical Supplies", ordersCompleted: 16, onTimeDelivery: 88, qualityScore: 4.1, totalSpend: 178000 },
  { supplier: "Sun Pharma Distributors", ordersCompleted: 20, onTimeDelivery: 93, qualityScore: 4.6, totalSpend: 245000 },
];

// Category sales distribution data
const categorySalesData = [
  { name: "Antibiotics", value: 28 },
  { name: "Pain Relief", value: 22 },
  { name: "Cardiac", value: 18 },
  { name: "Vitamins", value: 12 },
  { name: "Diabetic Care", value: 10 },
  { name: "Others", value: 10 },
];

// Colors for pie charts
const COLORS = ["#0891B2", "#22D3EE", "#38BDF8", "#7DD3FC", "#BAE6FD", "#E0F2FE"];

const Reports: React.FC = () => {
  const [period, setPeriod] = useState("year");
  const [currentTab, setCurrentTab] = useState("sales");
  const [dateRange, setDateRange] = useState("thisYear");

  // Calculate total revenue, orders, and profit
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
  
  // Calculate total inventory value and items
  const totalInventoryValue = inventoryData.reduce((sum, item) => sum + item.value, 0);
  const totalInventoryItems = inventoryData.reduce((sum, item) => sum + item.items, 0);
  const totalStock = inventoryData.reduce((sum, item) => sum + item.stock, 0);

  // Download report
  const handleDownload = () => {
    toast.success("Report downloaded successfully");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
            <p className="text-muted-foreground">
              View comprehensive reports and analytics for your pharmacy
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={dateRange}
              onValueChange={setDateRange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Date Range" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleDownload}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="sales" 
          className="space-y-4"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="bg-muted">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
          </TabsList>

          {/* Sales Report Tab */}
          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Total Revenue"
                value={`₹${(totalRevenue / 1000).toFixed(0)}K`}
                icon={<CircleDollarSign className="h-5 w-5" />}
                trend={8.2}
                trendLabel="vs previous period"
              />
              <SummaryCard
                title="Total Orders"
                value={totalOrders.toString()}
                icon={<ShoppingCart className="h-5 w-5" />}
                trend={5.3}
                trendLabel="vs previous period"
              />
              <SummaryCard
                title="Average Order Value"
                value={`₹${Math.round(totalRevenue / totalOrders)}`}
                icon={<TrendingUp className="h-5 w-5" />}
                trend={3.1}
                trendLabel="vs previous period"
              />
              <SummaryCard
                title="Profit Margin"
                value={`${Math.round((totalProfit / totalRevenue) * 100)}%`}
                icon={<ArrowUp className="h-5 w-5" />}
                trend={1.8}
                trendLabel="vs previous period"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-7">
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0891B2"
                        fill="#BAE6FD"
                        activeDot={{ r: 8 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#10B981"
                        fill="#D1FAE5"
                        activeDot={{ r: 8 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categorySalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categorySalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Performance</CardTitle>
                <CardDescription>
                  Detailed breakdown of sales data by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                        <TableHead className="text-right">Avg. Order Value</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                        <TableHead className="text-right">Profit Margin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((month) => (
                        <TableRow key={month.month}>
                          <TableCell className="font-medium">{month.month}</TableCell>
                          <TableCell className="text-right">₹{month.revenue.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">{month.orders}</TableCell>
                          <TableCell className="text-right">₹{Math.round(month.revenue / month.orders).toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">₹{month.profit.toLocaleString("en-IN")}</TableCell>
                          <TableCell className="text-right">{Math.round((month.profit / month.revenue) * 100)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Report Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Total Inventory Value"
                value={`₹${(totalInventoryValue / 1000).toFixed(0)}K`}
                icon={<CircleDollarSign className="h-5 w-5" />}
                trend={3.5}
                trendLabel="vs previous month"
              />
              <SummaryCard
                title="Total Stock Items"
                value={totalStock.toString()}
                icon={<Package className="h-5 w-5" />}
                trend={5.2}
                trendLabel="vs previous month"
              />
              <SummaryCard
                title="Low Stock Items"
                value={lowStockData.length.toString()}
                icon={<AlertCircle className="h-5 w-5" />}
                trend={2.1}
                trendLabel="vs previous month"
                trendNegative={false}
              />
              <SummaryCard
                title="Expiring Soon"
                value={expiringData.length.toString()}
                icon={<Calendar className="h-5 w-5" />}
                trend={-8.3}
                trendLabel="vs previous month"
                trendNegative={true}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value by Category</CardTitle>
                  <CardDescription>Distribution of inventory value across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={inventoryData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Value"]} />
                      <Legend />
                      <Bar dataKey="value" fill="#0891B2" name="Value (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Quantity by Category</CardTitle>
                  <CardDescription>Distribution of stock units across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={inventoryData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString("en-IN")} units`, "Stock"]} />
                      <Legend />
                      <Bar dataKey="stock" fill="#22C55E" name="Stock Units" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="lowStock" className="space-y-4">
              <TabsList>
                <TabsTrigger value="lowStock">Low Stock Items</TabsTrigger>
                <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
                <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lowStock">
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Items</CardTitle>
                    <CardDescription>Items that need to be reordered soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Min. Required</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lowStockData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.stock}</TableCell>
                              <TableCell>{item.minRequired}</TableCell>
                              <TableCell>{item.supplier}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    item.stock < item.minRequired * 0.25
                                      ? "bg-red-50 text-red-600 border-red-200"
                                      : "bg-amber-50 text-amber-600 border-amber-200"
                                  }
                                >
                                  {item.stock < item.minRequired * 0.25 ? "Critical" : "Low"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="expiring">
                <Card>
                  <CardHeader>
                    <CardTitle>Expiring Soon</CardTitle>
                    <CardDescription>Items that will expire within the next 3 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Days Left</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expiringData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.stock}</TableCell>
                              <TableCell>{format(new Date(item.expiry), "dd/MM/yyyy")}</TableCell>
                              <TableCell>{item.daysLeft}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    item.daysLeft < 30
                                      ? "bg-red-50 text-red-600 border-red-200"
                                      : item.daysLeft < 60
                                      ? "bg-amber-50 text-amber-600 border-amber-200"
                                      : "bg-green-50 text-green-600 border-green-200"
                                  }
                                >
                                  {item.daysLeft < 30 ? "Urgent" : item.daysLeft < 60 ? "Soon" : "Upcoming"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="categories">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Detailed breakdown of inventory by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Total Items</TableHead>
                            <TableHead>Total Stock</TableHead>
                            <TableHead>Total Value</TableHead>
                            <TableHead>% of Inventory</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventoryData.map((category) => (
                            <TableRow key={category.category}>
                              <TableCell className="font-medium">{category.category}</TableCell>
                              <TableCell>{category.items}</TableCell>
                              <TableCell>{category.stock}</TableCell>
                              <TableCell>₹{category.value.toLocaleString("en-IN")}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={Math.round((category.value / totalInventoryValue) * 100)} className="h-2" />
                                  <span>{Math.round((category.value / totalInventoryValue) * 100)}%</span>
                                </div>
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
          </TabsContent>

          {/* Suppliers Report Tab */}
          <TabsContent value="suppliers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                title="Total Suppliers"
                value={supplierData.length.toString()}
                icon={<Truck className="h-5 w-5" />}
                trend={0}
                trendLabel="vs previous period"
              />
              <SummaryCard
                title="Orders Placed"
                value={supplierData.reduce((sum, supplier) => sum + supplier.ordersCompleted, 0).toString()}
                icon={<Package className="h-5 w-5" />}
                trend={12.5}
                trendLabel="vs previous period"
              />
              <SummaryCard
                title="Avg. On-Time Delivery"
                value={`${Math.round(
                  supplierData.reduce((sum, supplier) => sum + supplier.onTimeDelivery, 0) / supplierData.length
                )}%`}
                icon={<Clock className="h-5 w-5" />}
                trend={2.3}
                trendLabel="vs previous period"
              />
              <SummaryCard
                title="Total Spend"
                value={`₹${(
                  supplierData.reduce((sum, supplier) => sum + supplier.totalSpend, 0) / 1000
                ).toFixed(0)}K`}
                icon={<CircleDollarSign className="h-5 w-5" />}
                trend={8.7}
                trendLabel="vs previous period"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>
                  Performance metrics for all suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Orders Completed</TableHead>
                        <TableHead>On-Time Delivery</TableHead>
                        <TableHead>Quality Score</TableHead>
                        <TableHead>Total Spend</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierData.map((supplier) => (
                        <TableRow key={supplier.supplier}>
                          <TableCell className="font-medium">{supplier.supplier}</TableCell>
                          <TableCell>{supplier.ordersCompleted}</TableCell>
                          <TableCell>{supplier.onTimeDelivery}%</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2">{supplier.qualityScore}</div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    filled={i < Math.floor(supplier.qualityScore)}
                                    half={i === Math.floor(supplier.qualityScore) && supplier.qualityScore % 1 >= 0.5}
                                  />
                                ))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>₹{supplier.totalSpend.toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                supplier.onTimeDelivery >= 93
                                  ? "bg-green-50 text-green-600 border-green-200"
                                  : supplier.onTimeDelivery >= 85
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                              }
                            >
                              {supplier.onTimeDelivery >= 93
                                ? "Excellent"
                                : supplier.onTimeDelivery >= 85
                                ? "Good"
                                : "Needs Improvement"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>On-Time Delivery Performance</CardTitle>
                  <CardDescription>Comparison of on-time delivery rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={supplierData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="supplier" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="onTimeDelivery"
                        fill="#0891B2"
                        name="On-Time Delivery %"
                        label={{ position: "top" }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supplier Spend Distribution</CardTitle>
                  <CardDescription>Breakdown of spending by supplier</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={supplierData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalSpend"
                        nameKey="supplier"
                        label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                      >
                        {supplierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Total Spend"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ML Predictions Tab */}
          <TabsContent value="predictions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-halomed-50 to-halomed-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center">
                      <BrainCircuit className="h-5 w-5 mr-2 text-halomed-500" />
                      Predicted Monthly Sales
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">₹285,500</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Next month forecast</p>
                    <div className="flex items-center text-xs text-green-500">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>12.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      High Demand Prediction
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">Antibiotics</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Expected category surge</p>
                    <div className="flex items-center text-xs text-green-500">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>18.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                      Stock Shortage Risk
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">5 Products</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Predicted to run out</p>
                    <div className="flex items-center text-xs text-amber-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>High Risk</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center">
                      <UserCog className="h-5 w-5 mr-2 text-blue-500" />
                      Customer Retention
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">92.5%</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Predicted retention rate</p>
                    <div className="flex items-center text-xs text-green-500">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Demand Forecast</CardTitle>
                <CardDescription>ML-based prediction of upcoming demand trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={[
                      { month: "May", antibiotics: 350, painRelief: 280, cardiac: 210, vitamins: 180, diabetic: 150 },
                      { month: "Jun", antibiotics: 380, painRelief: 290, cardiac: 220, vitamins: 190, diabetic: 160 },
                      { month: "Jul", antibiotics: 410, painRelief: 300, cardiac: 230, vitamins: 200, diabetic: 165 },
                      { month: "Aug", antibiotics: 450, painRelief: 310, cardiac: 235, vitamins: 205, diabetic: 170 },
                      { month: "Sep", antibiotics: 420, painRelief: 320, cardiac: 240, vitamins: 210, diabetic: 175 },
                      { month: "Oct", antibiotics: 390, painRelief: 330, cardiac: 245, vitamins: 215, diabetic: 180 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="antibiotics" stroke="#0891B2" name="Antibiotics" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="painRelief" stroke="#F59E0B" name="Pain Relief" />
                    <Line type="monotone" dataKey="cardiac" stroke="#EF4444" name="Cardiac" />
                    <Line type="monotone" dataKey="vitamins" stroke="#10B981" name="Vitamins" />
                    <Line type="monotone" dataKey="diabetic" stroke="#8B5CF6" name="Diabetic Care" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Demand Heatmap</CardTitle>
                  <CardDescription>Geographic prediction of demand intensities</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[350px]">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="border rounded-md p-8 bg-muted/20">
                      <HeatmapPlaceholder />
                    </div>
                    <p>Regional heatmap visualization would appear here</p>
                    <p className="text-sm">Showing predicted demand across different regions</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Products at Risk</CardTitle>
                  <CardDescription>Items predicted to have stock issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Current Stock</TableHead>
                          <TableHead>Predicted Demand</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Action Needed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Amoxicillin 250mg", stock: 120, demand: 150, risk: "High", action: "Order Now" },
                          { name: "Paracetamol 500mg", stock: 230, demand: 280, risk: "High", action: "Order Now" },
                          { name: "Vitamin D3 60K", stock: 15, demand: 45, risk: "Critical", action: "Urgent Order" },
                          { name: "Aspirin 150mg", stock: 5, demand: 35, risk: "Critical", action: "Urgent Order" },
                          { name: "Insulin Pen", stock: 8, demand: 20, risk: "High", action: "Order Now" },
                        ].map((product, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.demand}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  product.risk === "Critical"
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : product.risk === "High"
                                    ? "bg-amber-50 text-amber-600 border-amber-200"
                                    : "bg-green-50 text-green-600 border-green-200"
                                }
                              >
                                {product.risk}
                              </Badge>
                            </TableCell>
                            <TableCell>{product.action}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    ML prediction based on historical data and current trends
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Summary card component
const SummaryCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  trendNegative?: boolean;
}> = ({ title, value, icon, trend, trendLabel, trendNegative = false }) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-7 w-7 bg-halomed-100 rounded-md flex items-center justify-center text-halomed-500">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{trendLabel}</p>
            <div className={`flex items-center text-xs ${
              !trendNegative ? (trend >= 0 ? "text-green-500" : "text-red-500") : 
              (trend >= 0 ? "text-red-500" : "text-green-500")
            }`}>
              {!trendNegative ? (
                trend >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />
              ) : (
                trend >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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

// Placeholder for heatmap
const HeatmapPlaceholder: React.FC = () => {
  return (
    <div className="w-64 h-64 relative">
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
        {Array.from({ length: 25 }).map((_, i) => {
          const intensity = Math.random();
          let bgColor = "bg-green-100";
          
          if (intensity > 0.8) bgColor = "bg-red-300";
          else if (intensity > 0.6) bgColor = "bg-red-200";
          else if (intensity > 0.4) bgColor = "bg-amber-200";
          else if (intensity > 0.2) bgColor = "bg-green-200";
          
          return <div key={i} className={`rounded ${bgColor}`}></div>;
        })}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <BrainCircuit className="h-16 w-16 text-halomed-300/20" />
      </div>
    </div>
  );
};

export default Reports;
