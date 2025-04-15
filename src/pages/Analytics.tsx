
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { 
  BrainCircuit, 
  Calendar, 
  TrendingUp, 
  Search,
  ChevronDown,
  AlertCircle,
  Check,
  MoveUp,
  PackageCheck,
  Pill,
  ShieldAlert,
  Info,
  Droplets,
  Thermometer
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

// Colors for charts
const COLORS = ["#0891B2", "#22D3EE", "#38BDF8", "#7DD3FC", "#BAE6FD", "#E0F2FE"];

// Sample data for demand prediction
const demandPredictionData = [
  { month: "May", antibiotics: 350, painRelief: 280, cardiac: 210, vitamins: 180, diabetic: 150 },
  { month: "Jun", antibiotics: 380, painRelief: 290, cardiac: 220, vitamins: 190, diabetic: 160 },
  { month: "Jul", antibiotics: 410, painRelief: 300, cardiac: 230, vitamins: 200, diabetic: 165 },
  { month: "Aug", antibiotics: 450, painRelief: 310, cardiac: 235, vitamins: 205, diabetic: 170 },
  { month: "Sep", antibiotics: 420, painRelief: 320, cardiac: 240, vitamins: 210, diabetic: 175 },
  { month: "Oct", antibiotics: 390, painRelief: 330, cardiac: 245, vitamins: 215, diabetic: 180 },
];

// Sample data for disease outbreak prediction
const outbreakPredictionData = [
  { month: "May", respiratory: 35, seasonal: 50, gastrointestinal: 25, skin: 15 },
  { month: "Jun", respiratory: 40, seasonal: 60, gastrointestinal: 30, skin: 20 },
  { month: "Jul", respiratory: 55, seasonal: 80, gastrointestinal: 35, skin: 25 },
  { month: "Aug", respiratory: 70, seasonal: 90, gastrointestinal: 40, skin: 30 },
  { month: "Sep", respiratory: 60, seasonal: 70, gastrointestinal: 45, skin: 35 },
  { month: "Oct", respiratory: 45, seasonal: 45, gastrointestinal: 30, skin: 25 },
];

// Sample data for predicted medicine shortages
const shortageData = [
  { name: "Amoxicillin 250mg", category: "Antibiotics", currentStock: 120, predictedDemand: 180, riskScore: 92, supplier: "Cipla Healthcare" },
  { name: "Paracetamol 500mg", category: "Pain Relief", currentStock: 230, predictedDemand: 320, riskScore: 85, supplier: "Sun Pharma Distributors" },
  { name: "Vitamin D3 60K", category: "Vitamins", currentStock: 15, predictedDemand: 45, riskScore: 98, supplier: "MediVision Healthcare" },
  { name: "Insulin Pen", category: "Diabetic Care", currentStock: 8, predictedDemand: 25, riskScore: 96, supplier: "Zydus Medical Supplies" },
  { name: "Salbutamol Inhaler", category: "Respiratory", currentStock: 12, predictedDemand: 35, riskScore: 90, supplier: "Cipla Healthcare" },
  { name: "Ibuprofen 400mg", category: "Pain Relief", currentStock: 18, predictedDemand: 40, riskScore: 88, supplier: "Pharma India Ltd" },
  { name: "Azithromycin 500mg", category: "Antibiotics", currentStock: 25, predictedDemand: 40, riskScore: 80, supplier: "Cipla Healthcare" },
  { name: "Atorvastatin 10mg", category: "Cardiac", currentStock: 50, predictedDemand: 75, riskScore: 78, supplier: "Zydus Medical Supplies" },
];

// Sample data for demographic insights
const demographicData = [
  { age: "0-18", antibiotics: 15, painRelief: 10, cardiac: 0, vitamins: 25, diabetic: 5 },
  { age: "19-35", antibiotics: 20, painRelief: 30, cardiac: 5, vitamins: 35, diabetic: 10 },
  { age: "36-50", antibiotics: 25, painRelief: 35, cardiac: 30, vitamins: 25, diabetic: 35 },
  { age: "51-65", antibiotics: 20, painRelief: 20, cardiac: 45, vitamins: 10, diabetic: 30 },
  { age: "65+", antibiotics: 20, painRelief: 5, cardiac: 20, vitamins: 5, diabetic: 20 },
];

// Sample data for geographic distribution
const geoDistributionData = [
  { region: "North", value: 35 },
  { region: "South", value: 25 },
  { region: "East", value: 20 },
  { region: "West", value: 15 },
  { region: "Central", value: 5 },
];

// Sample outbreak alerts
const outbreakAlerts = [
  { 
    disease: "Seasonal Flu", 
    riskLevel: "High", 
    region: "North Mumbai", 
    predictedMedicines: ["Paracetamol", "Cold & Flu Relief", "Cough Syrup"],
    symptoms: "Fever, cough, sore throat, body aches",
    timeframe: "Next 2-3 weeks"
  },
  { 
    disease: "Respiratory Infections", 
    riskLevel: "Medium", 
    region: "Central & West Area", 
    predictedMedicines: ["Azithromycin", "Cough expectorants", "Bronchodilators"],
    symptoms: "Cough, chest congestion, shortness of breath",
    timeframe: "Next 1-2 months"
  },
  { 
    disease: "Gastroenteritis", 
    riskLevel: "Medium", 
    region: "South Region", 
    predictedMedicines: ["ORS", "Probiotics", "Anti-diarrheal medications"],
    symptoms: "Diarrhea, vomiting, abdominal pain",
    timeframe: "Next 3-4 weeks"
  },
  { 
    disease: "Dengue", 
    riskLevel: "Low", 
    region: "East Area", 
    predictedMedicines: ["Paracetamol", "ORS", "Multivitamins"],
    symptoms: "High fever, severe headache, pain behind the eyes, joint/muscle pain",
    timeframe: "Next 2-3 months"
  },
];

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState("next3Months");
  const [regionFilter, setRegionFilter] = useState("all");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">ML Analytics</h2>
            <p className="text-muted-foreground">
              Machine learning-powered insights for inventory and demand prediction
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
                  <SelectValue placeholder="Prediction Range" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next1Month">Next 1 Month</SelectItem>
                <SelectItem value="next3Months">Next 3 Months</SelectItem>
                <SelectItem value="next6Months">Next 6 Months</SelectItem>
                <SelectItem value="next12Months">Next 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={regionFilter}
              onValueChange={setRegionFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Region Filter" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north">North Mumbai</SelectItem>
                <SelectItem value="south">South Mumbai</SelectItem>
                <SelectItem value="east">East Mumbai</SelectItem>
                <SelectItem value="west">West Mumbai</SelectItem>
                <SelectItem value="central">Central Mumbai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Prediction Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-halomed-50 to-halomed-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-halomed-500" />
                  Predicted Demand
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">+18.5%</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Overall increase expected</p>
                <div className="flex items-center text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Rising</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-amber-500" />
                  Outbreak Risk
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">Medium</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Seasonal flu predicted</p>
                <div className="flex items-center text-xs text-amber-500">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Monitor</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Stock Shortages
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">8 Items</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Need reordering soon</p>
                <div className="flex items-center text-xs text-red-500">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Critical</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  <PackageCheck className="h-5 w-5 mr-2 text-green-500" />
                  Inventory Health
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">76%</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Overall adequacy score</p>
                <div className="flex items-center text-xs text-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  <span>Good</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="demand" className="space-y-4">
          <TabsList>
            <TabsTrigger value="demand">Demand Prediction</TabsTrigger>
            <TabsTrigger value="outbreaks">Outbreak Prediction</TabsTrigger>
            <TabsTrigger value="shortages">Shortage Alerts</TabsTrigger>
            <TabsTrigger value="insights">Demographic Insights</TabsTrigger>
          </TabsList>

          {/* Demand Prediction Tab */}
          <TabsContent value="demand" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medicine Demand Forecast</CardTitle>
                <CardDescription>
                  ML prediction of demand by category for the next 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={demandPredictionData}
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
                    <Line 
                      type="monotone" 
                      dataKey="antibiotics" 
                      name="Antibiotics" 
                      stroke="#0891B2" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="painRelief" 
                      name="Pain Relief" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cardiac" 
                      name="Cardiac" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="vitamins" 
                      name="Vitamins" 
                      stroke="#10B981"
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diabetic" 
                      name="Diabetic Care" 
                      stroke="#8B5CF6"
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  AI prediction based on historical sales data, seasonal patterns, and market trends
                </p>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Growth Categories</CardTitle>
                  <CardDescription>Categories with highest predicted demand growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-halomed-500 mr-2"></div>
                          <span className="text-sm font-medium">Antibiotics</span>
                        </div>
                        <span className="text-sm font-medium">28.5%</span>
                      </div>
                      <Progress value={28.5} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
                          <span className="text-sm font-medium">Pain Relief</span>
                        </div>
                        <span className="text-sm font-medium">17.8%</span>
                      </div>
                      <Progress value={17.8} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-sm font-medium">Vitamins</span>
                        </div>
                        <span className="text-sm font-medium">16.6%</span>
                      </div>
                      <Progress value={16.6} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm font-medium">Cardiac</span>
                        </div>
                        <span className="text-sm font-medium">14.2%</span>
                      </div>
                      <Progress value={14.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm font-medium">Diabetic Care</span>
                        </div>
                        <span className="text-sm font-medium">12.0%</span>
                      </div>
                      <Progress value={12.0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Predicted Products</CardTitle>
                  <CardDescription>Individual medicines with highest predicted demand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Growth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Azithromycin 500mg", category: "Antibiotics", growth: 32.5 },
                          { name: "Paracetamol 500mg", category: "Pain Relief", growth: 28.6 },
                          { name: "Vitamin D3 60K", category: "Vitamins", growth: 25.2 },
                          { name: "Metformin 500mg", category: "Diabetic Care", growth: 22.8 },
                          { name: "Atorvastatin 10mg", category: "Cardiac", growth: 18.9 },
                        ].map((medicine, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{medicine.name}</TableCell>
                            <TableCell>{medicine.category}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end text-green-500">
                                <MoveUp className="mr-1 h-4 w-4" />
                                <span>{medicine.growth}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm">
                      <FileDown className="mr-2 h-4 w-4" />
                      Download Full Report
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Last updated: 15 Apr 2025
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outbreak Prediction Tab */}
          <TabsContent value="outbreaks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Disease Outbreak Prediction</CardTitle>
                <CardDescription>
                  ML-powered prediction of potential disease outbreaks in the coming months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart
                    data={outbreakPredictionData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="respiratory" 
                      name="Respiratory Infections" 
                      stackId="1"
                      stroke="#0891B2" 
                      fill="#BAE6FD" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="seasonal" 
                      name="Seasonal Flu" 
                      stackId="1"
                      stroke="#F59E0B" 
                      fill="#FEF3C7" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gastrointestinal" 
                      name="Gastrointestinal" 
                      stackId="1"
                      stroke="#10B981" 
                      fill="#D1FAE5" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="skin" 
                      name="Skin Conditions" 
                      stackId="1"
                      stroke="#8B5CF6" 
                      fill="#EDE9FE" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Outbreak Alerts</CardTitle>
                  <CardDescription>Current alerts based on prediction models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outbreakAlerts.map((alert, index) => (
                      <Card key={index} className="border shadow-sm">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-semibold">
                              {alert.disease}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`
                                ${alert.riskLevel === "High" ? "bg-red-50 text-red-600 border-red-200" : ""}
                                ${alert.riskLevel === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                                ${alert.riskLevel === "Low" ? "bg-green-50 text-green-600 border-green-200" : ""}
                              `}
                            >
                              {alert.riskLevel} Risk
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">
                            Region: {alert.region} • Expected: {alert.timeframe}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="mt-2 text-sm">
                            <div className="flex items-start gap-1 mt-1">
                              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-muted-foreground">
                                <span className="font-medium text-foreground">Symptoms:</span> {alert.symptoms}
                              </span>
                            </div>
                            <div className="flex items-start gap-1 mt-1">
                              <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-muted-foreground">
                                <span className="font-medium text-foreground">Predicted Demand:</span> {alert.predictedMedicines.join(", ")}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Trend Correlation</CardTitle>
                  <CardDescription>Correlation between environmental factors and disease prevalence</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis 
                        type="number" 
                        dataKey="humidity" 
                        name="Humidity" 
                        unit="%" 
                        domain={[30, 90]}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="temperature" 
                        name="Temperature" 
                        unit="°C" 
                        domain={[15, 40]}
                      />
                      <ZAxis 
                        type="number" 
                        dataKey="cases" 
                        range={[50, 400]} 
                        name="Cases"
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name) => [value, name]}
                      />
                      <Legend />
                      <Scatter 
                        name="Respiratory" 
                        data={[
                          { humidity: 85, temperature: 20, cases: 120, month: "Jun" },
                          { humidity: 80, temperature: 22, cases: 150, month: "Jul" },
                          { humidity: 75, temperature: 28, cases: 180, month: "Aug" },
                          { humidity: 70, temperature: 30, cases: 140, month: "Sep" },
                        ]} 
                        fill="#0891B2"
                      />
                      <Scatter 
                        name="Gastrointestinal" 
                        data={[
                          { humidity: 65, temperature: 32, cases: 90, month: "Jun" },
                          { humidity: 60, temperature: 35, cases: 120, month: "Jul" },
                          { humidity: 55, temperature: 38, cases: 140, month: "Aug" },
                          { humidity: 50, temperature: 36, cases: 100, month: "Sep" },
                        ]} 
                        fill="#F59E0B"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      <span>Temperature correlation: 0.78</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      <span>Humidity correlation: 0.65</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shortage Alerts Tab */}
          <TabsContent value="shortages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Predicted Stock Shortages</CardTitle>
                <CardDescription>
                  Items predicted to experience shortages based on demand forecasting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Predicted Demand</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shortageData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.currentStock}</TableCell>
                          <TableCell>{item.predictedDemand}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${item.riskScore >= 90 ? "bg-red-50 text-red-600 border-red-200" : ""}
                                ${item.riskScore >= 80 && item.riskScore < 90 ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                                ${item.riskScore < 80 ? "bg-green-50 text-green-600 border-green-200" : ""}
                              `}
                            >
                              {item.riskScore}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Order
                            </Button>
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
                  <CardTitle>Stock vs Demand Gap</CardTitle>
                  <CardDescription>Current stock vs predicted demand for critical items</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={shortageData.slice(0, 5)}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="currentStock" name="Current Stock" fill="#BAE6FD" />
                      <Bar dataKey="predictedDemand" name="Predicted Demand" fill="#FEF3C7" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <span>Place urgent orders for Vitamin D3 and Insulin Pen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Schedule orders for Amoxicillin and Paracetamol within 7 days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-halomed-500 mt-0.5" />
                        <span>Consider alternative suppliers for high-risk items</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shortage Risk by Category</CardTitle>
                  <CardDescription>Risk assessment of stock shortages by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Antibiotics</span>
                        <span className="text-sm font-medium">High Risk (85%)</span>
                      </div>
                      <Progress value={85} className="h-2 bg-red-100">
                        <div className="bg-red-500 h-full" />
                      </Progress>
                      <div className="mt-1 flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-500">
                          Amoxicillin
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-500">
                          Azithromycin
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Vitamins</span>
                        <span className="text-sm font-medium">High Risk (82%)</span>
                      </div>
                      <Progress value={82} className="h-2 bg-red-100">
                        <div className="bg-red-500 h-full" />
                      </Progress>
                      <div className="mt-1 flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-500">
                          Vitamin D3
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Diabetic Care</span>
                        <span className="text-sm font-medium">Medium Risk (65%)</span>
                      </div>
                      <Progress value={65} className="h-2 bg-amber-100">
                        <div className="bg-amber-500 h-full" />
                      </Progress>
                      <div className="mt-1 flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-500">
                          Insulin Pen
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-500">
                          Metformin
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Pain Relief</span>
                        <span className="text-sm font-medium">Medium Risk (60%)</span>
                      </div>
                      <Progress value={60} className="h-2 bg-amber-100">
                        <div className="bg-amber-500 h-full" />
                      </Progress>
                      <div className="mt-1 flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-500">
                          Paracetamol
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-500">
                          Ibuprofen
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Cardiac</span>
                        <span className="text-sm font-medium">Low Risk (35%)</span>
                      </div>
                      <Progress value={35} className="h-2 bg-green-100">
                        <div className="bg-green-500 h-full" />
                      </Progress>
                      <div className="mt-1 flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-500">
                          Atorvastatin
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Demographic Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demographic Medicine Usage</CardTitle>
                <CardDescription>
                  Analysis of medicine usage across different age groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={demographicData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="antibiotics" name="Antibiotics" fill="#0891B2" />
                    <Bar dataKey="painRelief" name="Pain Relief" fill="#F59E0B" />
                    <Bar dataKey="cardiac" name="Cardiac" fill="#EF4444" />
                    <Bar dataKey="vitamins" name="Vitamins" fill="#10B981" />
                    <Bar dataKey="diabetic" name="Diabetic Care" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Regional distribution of medicine demand</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={geoDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="region"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {geoDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Demographic Insights</CardTitle>
                  <CardDescription>ML-derived insights from demographic patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-3 bg-blue-50">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-blue-100 p-1.5 rounded-full">
                          <BrainCircuit className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Age-Based Demand</h4>
                          <p className="text-sm text-muted-foreground">
                            Elderly population (65+) shows increasing demand for cardiac and diabetic medications, with projected 18% growth in the next quarter.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border p-3 bg-green-50">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-green-100 p-1.5 rounded-full">
                          <BrainCircuit className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Regional Patterns</h4>
                          <p className="text-sm text-muted-foreground">
                            North region shows 35% higher demand for antibiotics and respiratory medications compared to other regions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border p-3 bg-amber-50">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-amber-100 p-1.5 rounded-full">
                          <BrainCircuit className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Seasonal Variations</h4>
                          <p className="text-sm text-muted-foreground">
                            Seasonal flu medications see 120% increase in demand during monsoon months (July-September).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border p-3 bg-purple-50">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-purple-100 p-1.5 rounded-full">
                          <BrainCircuit className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Emerging Trend</h4>
                          <p className="text-sm text-muted-foreground">
                            Young adults (19-35) show 27% increase in demand for immunity boosters and vitamins, representing a new market opportunity.
                          </p>
                        </div>
                      </div>
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

export default Analytics;
