import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar,
  Download
} from "lucide-react";
import FileDown from "@/components/FileDown"; // Import our custom FileDown component

// Sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000, profit: 2400, amt: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398, amt: 2210 },
  { name: 'Mar', sales: 2000, profit: 9800, amt: 2290 },
  { name: 'Apr', sales: 2780, profit: 3908, amt: 2000 },
  { name: 'May', sales: 1890, profit: 4800, amt: 2181 },
  { name: 'Jun', sales: 2390, profit: 3800, amt: 2500 },
  { name: 'Jul', sales: 3490, profit: 4300, amt: 2100 },
  { name: 'Aug', sales: 4000, profit: 2400, amt: 2400 },
  { name: 'Sep', sales: 3000, profit: 1398, amt: 2210 },
  { name: 'Oct', sales: 2000, profit: 9800, amt: 2290 },
  { name: 'Nov', sales: 2780, profit: 3908, amt: 2000 },
  { name: 'Dec', sales: 1890, profit: 4800, amt: 2181 },
];

const inventoryData = [
  { name: 'Antibiotics', value: 400 },
  { name: 'Pain Relief', value: 300 },
  { name: 'Cardiac', value: 300 },
  { name: 'Vitamins', value: 200 },
  { name: 'Supplements', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const topSellingProducts = [
  { name: 'Paracetamol 500mg', sales: 1200, growth: 15 },
  { name: 'Amoxicillin 250mg', sales: 980, growth: -5 },
  { name: 'Vitamin D3 60K', sales: 850, growth: 20 },
  { name: 'Omeprazole 20mg', sales: 720, growth: 8 },
  { name: 'Aspirin 150mg', sales: 650, growth: -2 },
];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('yearly');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              View detailed insights and performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last 12 Months
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard 
            title="Total Revenue" 
            value="₹24,35,290" 
            change={12.5} 
            trend="up" 
          />
          <SummaryCard 
            title="Total Sales" 
            value="8,245" 
            change={8.2} 
            trend="up" 
          />
          <SummaryCard 
            title="Average Order Value" 
            value="₹2,954" 
            change={-3.1} 
            trend="down" 
          />
          <SummaryCard 
            title="Profit Margin" 
            value="24.5%" 
            change={1.8} 
            trend="up" 
          />
        </div>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales & Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly sales and profit data for the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, undefined]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Sales"
                      />
                      <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>
                    Distribution of sales across product categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={inventoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {inventoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} units`, undefined]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>
                    Revenue breakdown by month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, undefined]} />
                        <Legend />
                        <Bar dataKey="profit" fill="#8884d8" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Distribution</CardTitle>
                <CardDescription>
                  Current inventory levels by product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name="Units in Stock" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>
                  Best performing products by sales volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellingProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sales} units sold
                        </div>
                      </div>
                      <div className={`flex items-center ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1" />
                        )}
                        <span>{Math.abs(product.growth)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, trend }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span>{change}%</span>
          </div>
          <span className="text-muted-foreground text-xs ml-1">vs. last period</span>
        </div>
      </CardContent>
    </Card>
  );
};

// ChevronDown component
const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default Analytics;
