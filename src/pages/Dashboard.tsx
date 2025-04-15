
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import {
  PackageOpen,
  Pill,
  IndianRupee,
  FileText,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";

// Sample data for charts
const salesData = [
  { name: "Jan", amount: 24000 },
  { name: "Feb", amount: 18000 },
  { name: "Mar", amount: 32000 },
  { name: "Apr", amount: 27000 },
  { name: "May", amount: 42000 },
  { name: "Jun", amount: 35000 },
];

const inventoryData = [
  { name: "Antibiotics", value: 30 },
  { name: "Pain Relief", value: 25 },
  { name: "Cardiac", value: 15 },
  { name: "Vitamins", value: 20 },
  { name: "Others", value: 10 },
];

const COLORS = ["#0891B2", "#22D3EE", "#7DD3FC", "#BAE6FD", "#E0F2FE"];

// Admin Dashboard
const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Inventory"
          value="16,542"
          description="Items in stock"
          icon={<PackageOpen className="h-5 w-5" />}
          trend={12}
        />
        <DashboardCard
          title="Monthly Sales"
          value="₹4,28,500"
          description="For current month"
          icon={<IndianRupee className="h-5 w-5" />}
          trend={8}
        />
        <DashboardCard
          title="Active Prescriptions"
          value="254"
          description="Pending fulfillment"
          icon={<FileText className="h-5 w-5" />}
          trend={-3}
        />
        <DashboardCard
          title="Low Stock Alerts"
          value="32"
          description="Items need reorder"
          icon={<AlertCircle className="h-5 w-5" />}
          trend={15}
          trendNegative={true}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, "Revenue"]} 
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="amount" fill="#0891B2" barSize={30} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryData.map((entry, index) => (
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Health</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">In Stock</span>
                  <span className="text-sm font-medium">84%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Low Stock</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <Progress value={12} className="h-2 bg-amber-100">
                  <div className="bg-amber-500 h-full" />
                </Progress>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Out of Stock</span>
                  <span className="text-sm font-medium">4%</span>
                </div>
                <Progress value={4} className="h-2 bg-red-100">
                  <div className="bg-red-500 h-full" />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Expirations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">1 Month</span>
                <span className="text-sm font-medium">24 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">3 Months</span>
                <span className="text-sm font-medium">67 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">6 Months</span>
                <span className="text-sm font-medium">123 items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Stock Update</p>
                <p className="text-muted-foreground">Updated 45 medicine quantities</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">New Order</p>
                <p className="text-muted-foreground">Placed order with Pharma India Ltd</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Performance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Priya Patel</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Vikram Singh</span>
                  <span className="text-sm font-medium">86%</span>
                </div>
                <Progress value={86} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Neha Gupta</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Staff Dashboard
const StaffDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Inventory"
          value="16,542"
          description="Items in stock"
          icon={<PackageOpen className="h-5 w-5" />}
          trend={12}
        />
        <DashboardCard
          title="Today's Sales"
          value="₹85,500"
          description="For today"
          icon={<IndianRupee className="h-5 w-5" />}
          trend={5}
        />
        <DashboardCard
          title="Active Prescriptions"
          value="42"
          description="Waiting for processing"
          icon={<FileText className="h-5 w-5" />}
          trend={-3}
        />
        <DashboardCard
          title="Low Stock Items"
          value="32"
          description="Items need reorder"
          icon={<AlertCircle className="h-5 w-5" />}
          trend={15}
          trendNegative={true}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Task List</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 rounded-md p-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Check expiring medicines</p>
                  <p className="text-sm text-muted-foreground">Review and mark 24 items expiring this month</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-halomed-100 rounded-md p-1.5">
                  <FileText className="h-4 w-4 text-halomed-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Process prescriptions</p>
                  <p className="text-sm text-muted-foreground">42 prescriptions waiting for processing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-md p-1.5">
                  <PackageOpen className="h-4 w-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Inventory reconciliation</p>
                  <p className="text-sm text-muted-foreground">Verify physical stock matches system records</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>Last 5 customers served</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Rahul Verma", time: "10:45 AM", items: 3, total: "₹1,250" },
                { name: "Meena Sharma", time: "11:20 AM", items: 5, total: "₹2,800" },
                { name: "Kiran Patel", time: "12:05 PM", items: 2, total: "₹950" },
                { name: "Sanjay Kumar", time: "01:30 PM", items: 4, total: "₹1,800" },
                { name: "Anita Singh", time: "02:15 PM", items: 1, total: "₹500" },
              ].map((customer, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.time} • {customer.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{customer.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Customer Dashboard
const CustomerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Active Prescriptions"
          value="2"
          description="Waiting for fulfillment"
          icon={<FileText className="h-5 w-5" />}
        />
        <DashboardCard
          title="Recent Orders"
          value="5"
          description="Last 30 days"
          icon={<PackageOpen className="h-5 w-5" />}
        />
        <DashboardCard
          title="Total Spent"
          value="₹3,850"
          description="Last 30 days"
          icon={<IndianRupee className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Prescriptions</CardTitle>
          <CardDescription>Track your prescription status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
              <div className="flex gap-3">
                <div className="bg-green-100 rounded-md p-1.5">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Blood Pressure Medication</p>
                  <p className="text-sm text-muted-foreground">Prescribed by Dr. Rahul Sharma</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Ready for pickup</p>
                <p className="text-xs text-muted-foreground">Valid until 30/06/2025</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-md">
              <div className="flex gap-3">
                <div className="bg-amber-100 rounded-md p-1.5">
                  <FileText className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Antibiotic Course</p>
                  <p className="text-sm text-muted-foreground">Prescribed by Dr. Priya Patel</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-amber-600">Being processed</p>
                <p className="text-xs text-muted-foreground">Valid until 15/05/2025</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Your recent purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "15/04/2025", items: 3, total: "₹1,250", status: "Completed" },
              { date: "28/03/2025", items: 2, total: "₹850", status: "Completed" },
              { date: "15/03/2025", items: 4, total: "₹1,750", status: "Completed" },
            ].map((order, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-card rounded-md border">
                <div>
                  <p className="font-medium">Order #{index + 1001}</p>
                  <p className="text-sm text-muted-foreground">{order.date} • {order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.total}</p>
                  <p className="text-xs text-green-600">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Card component for dashboard statistics
const DashboardCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  trend?: number;
  trendNegative?: boolean;
}> = ({ title, value, description, icon, trend, trendNegative = false }) => {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-7 w-7 bg-halomed-100 rounded-md flex items-center justify-center text-halomed-500">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend !== undefined && (
            <div className={`flex items-center text-xs ${
              !trendNegative ? (trend >= 0 ? "text-green-500" : "text-red-500") : 
              (trend >= 0 ? "text-red-500" : "text-green-500")
            }`}>
              {!trendNegative ? (
                trend >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />
              ) : (
                trend >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {greeting}, {user?.name}
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening at HaloMed today.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {user?.role === "admin" && <AdminDashboard />}
            {user?.role === "staff" && <StaffDashboard />}
            {user?.role === "customer" && <CustomerDashboard />}
          </TabsContent>
          <TabsContent value="analytics">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Sales Trends</CardTitle>
                  <CardDescription>Daily sales for the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[...Array(30)].map((_, i) => ({
                        day: i + 1,
                        amount: Math.floor(Math.random() * 30000) + 5000,
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, "Sales"]} />
                      <Bar dataKey="amount" fill="#0891B2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Top selling categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Antibiotics</span>
                        <span>₹1,25,000</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Pain Relief</span>
                        <span>₹98,000</span>
                      </div>
                      <Progress value={55} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Cardiac</span>
                        <span>₹85,000</span>
                      </div>
                      <Progress value={48} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Vitamins</span>
                        <span>₹68,000</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Dermatology</span>
                        <span>₹52,000</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
