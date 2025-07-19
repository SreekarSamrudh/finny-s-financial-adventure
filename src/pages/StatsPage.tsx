import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, LineChart, Calendar, Download, RefreshCw, Filter, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts";
import { useExpenses } from "@/hooks/useExpenses";
import { exportData, setCustomDateRange, sortData, viewAllRecommendations } from "@/utils/buttonActions";
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates";

const groupExpensesByMonth = (expenses) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const grouped = {};
  
  months.forEach(month => {
    grouped[month] = 0;
  });
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const month = months[date.getMonth()];
    grouped[month] += Number(expense.amount);
  });
  
  return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
};

const groupExpensesByCategory = (expenses) => {
  const grouped = {};
  
  expenses.forEach(expense => {
    const category = expense.description || "Other";
    if (!grouped[category]) {
      grouped[category] = 0;
    }
    grouped[category] += Number(expense.amount);
  });
  
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

const StatsPage = () => {
  const { user } = useAuth();
  const { expenses, isLoading, refetch } = useExpenses();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("6months");
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [averageMonthly, setAverageMonthly] = useState(0);

  useRealTimeUpdates({
    tableName: "expenses",
    onDataChange: () => {
      refetch();
    }
  });

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      let filteredExpenses = [...expenses];
      
      if (timeRange === "6months") {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        filteredExpenses = expenses.filter(exp => new Date(exp.date) >= sixMonthsAgo);
      } else if (timeRange === "1year") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        filteredExpenses = expenses.filter(exp => new Date(exp.date) >= oneYearAgo);
      }
      
      const monthlyGrouped = groupExpensesByMonth(filteredExpenses);
      const categoryGrouped = groupExpensesByCategory(filteredExpenses);
      
      setMonthlyData(monthlyGrouped);
      setCategoryData(categoryGrouped);
      
      const total = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      setTotalSpent(total);
      
      const uniqueMonths = new Set(filteredExpenses.map(exp => {
        const date = new Date(exp.date);
        return `${date.getFullYear()}-${date.getMonth()}`;
      }));
      
      const monthCount = uniqueMonths.size || 1;
      setAverageMonthly(total / monthCount);
    }
  }, [expenses, timeRange]);

  useEffect(() => {
    refetch();
    
    const interval = setInterval(() => {
      refetch();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data refreshed",
      description: "Your statistics have been updated with the latest data."
    });
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    toast({
      title: "Time range changed",
      description: `Showing data for ${range === "6months" ? "the last 6 months" : range === "1year" ? "the last year" : "all time"}.`
    });
  };

  const handleExport = (format = 'csv') => {
    exportData(format);
  };

  const handleCustomRange = () => {
    const result = setCustomDateRange();
    console.log("Custom date range set:", result);
  };

  const handleSort = (field = 'amount') => {
    const result = sortData(field, 'desc');
    console.log("Data sorted:", result);
  };

  const handleViewAllRecommendations = () => {
    viewAllRecommendations();
  };

  const COLORS = ['#9b87f5', '#1EAEDB', '#F97316', '#D946EF', '#10B981', '#8B5CF6'];

  const savingsData = [
    { name: 'Jan', savings: 200, goal: 250 },
    { name: 'Feb', savings: 250, goal: 250 },
    { name: 'Mar', savings: 300, goal: 250 },
    { name: 'Apr', savings: 200, goal: 250 },
    { name: 'May', savings: 350, goal: 250 },
    { name: 'Jun', savings: 400, goal: 250 },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <BarChart3 className="text-finny-purple" />
          Financial Statistics
        </h1>
        <p className="text-muted-foreground">Analyze your financial data and track your progress</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          <Badge 
            className={`px-4 py-1 cursor-pointer ${timeRange === "6months" ? "bg-finny-purple text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => handleTimeRangeChange("6months")}
          >
            Last 6 Months
          </Badge>
          <Badge 
            className={`px-4 py-1 cursor-pointer ${timeRange === "1year" ? "bg-finny-purple text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => handleTimeRangeChange("1year")}
          >
            Last Year
          </Badge>
          <Badge 
            className={`px-4 py-1 cursor-pointer ${timeRange === "all" ? "bg-finny-purple text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => handleTimeRangeChange("all")}
          >
            All Time
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleCustomRange}
          >
            <Calendar size={14} />
            Custom Range
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleExport('csv')}
          >
            <Download size={14} />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="text-finny-purple h-5 w-5" />
              Monthly Spending
            </CardTitle>
            <CardDescription>Track your expenses over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              ) : monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No expense data available</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Average Monthly</p>
                  <p className="text-xl font-bold">${averageMonthly.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="text-finny-blue h-5 w-5" />
              Spending by Category
            </CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64 flex justify-center">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              ) : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No category data available</p>
                </div>
              )}
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
                <Filter size={14} />
                Filter Categories
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="text-finny-green h-5 w-5" />
              Savings Trend
            </CardTitle>
            <CardDescription>Monthly savings vs. goal</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={savingsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="goal" stroke="#9b87f5" strokeDasharray="5 5" strokeWidth={2} />
                  <Legend />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Average Saved</p>
                  <p className="text-xl font-bold text-finny-green">$283</p>
                </div>
                <div>
                  <Badge variant="outline" className="bg-finny-green/10 text-finny-green border-finny-green/20">
                    ↑ 13.2% from last period
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 border-2 border-dashed border-finny-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-finny-purple" />
            Finny's Financial Insights
          </CardTitle>
          <CardDescription>
            This section will contain AI-powered analysis of your spending patterns and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-32 bg-gray-50">
          <p className="text-muted-foreground text-center">
            LLM integration placeholder - personalized financial insights will appear here
          </p>
        </CardContent>
      </Card>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Transactions Analysis</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleSort('amount')}
          >
            <ArrowUpDown size={14} />
            Sort
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">This Month</th>
                    <th className="text-left p-4">Last Month</th>
                    <th className="text-left p-4">Change</th>
                    <th className="text-left p-4">Budget</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Housing</td>
                    <td className="p-4">$1,200</td>
                    <td className="p-4">$1,200</td>
                    <td className="p-4">0%</td>
                    <td className="p-4">$1,200</td>
                    <td className="p-4">
                      <Badge className="bg-finny-green/10 text-finny-green">On Track</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Food</td>
                    <td className="p-4">$580</td>
                    <td className="p-4">$450</td>
                    <td className="p-4 text-red-500">+28.9%</td>
                    <td className="p-4">$500</td>
                    <td className="p-4">
                      <Badge className="bg-red-100 text-red-600">Over Budget</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Transportation</td>
                    <td className="p-4">$250</td>
                    <td className="p-4">$300</td>
                    <td className="p-4 text-green-500">-16.7%</td>
                    <td className="p-4">$300</td>
                    <td className="p-4">
                      <Badge className="bg-finny-green/10 text-finny-green">Under Budget</Badge>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Entertainment</td>
                    <td className="p-4">$150</td>
                    <td className="p-4">$200</td>
                    <td className="p-4 text-green-500">-25%</td>
                    <td className="p-4">$200</td>
                    <td className="p-4">
                      <Badge className="bg-finny-green/10 text-finny-green">Under Budget</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Utilities</td>
                    <td className="p-4">$220</td>
                    <td className="p-4">$210</td>
                    <td className="p-4 text-red-500">+4.8%</td>
                    <td className="p-4">$250</td>
                    <td className="p-4">
                      <Badge className="bg-finny-green/10 text-finny-green">Under Budget</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Health Score</CardTitle>
            <CardDescription>Based on your spending, savings, and budgeting habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-finny-purple flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-finny-purple">78</span>
              </div>
              <p className="font-medium text-lg">Good</p>
              <p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">
                You've made great progress! Keep building your emergency fund to improve your score.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Budgeting</p>
                <p className="font-medium text-finny-purple">85</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Saving</p>
                <p className="font-medium text-finny-blue">70</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Planning</p>
                <p className="font-medium text-finny-green">75</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommendations</CardTitle>
            <CardDescription>Custom financial advice based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-finny-purple/5 border border-finny-purple/20 rounded-lg">
                <h4 className="font-medium text-finny-purple mb-1 flex items-center gap-1">
                  <Badge className="bg-finny-purple text-white h-5">1</Badge>
                  Reduce Food Spending
                </h4>
                <p className="text-sm">
                  Your food spending is 16% higher than last month. Try meal planning to reduce costs.
                </p>
              </div>
              
              <div className="p-3 bg-finny-blue/5 border border-finny-blue/20 rounded-lg">
                <h4 className="font-medium text-finny-blue mb-1 flex items-center gap-1">
                  <Badge className="bg-finny-blue text-white h-5">2</Badge>
                  Increase Emergency Fund
                </h4>
                <p className="text-sm">
                  Your emergency fund covers 2.5 months of expenses. Aim for 3-6 months.
                </p>
              </div>
              
              <div className="p-3 bg-finny-green/5 border border-finny-green/20 rounded-lg">
                <h4 className="font-medium text-finny-green mb-1 flex items-center gap-1">
                  <Badge className="bg-finny-green text-white h-5">3</Badge>
                  Great Job on Transportation
                </h4>
                <p className="text-sm">
                  You reduced transportation costs by 16.7%. Keep up the good work!
                </p>
              </div>
              
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewAllRecommendations}
                >
                  View All Recommendations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StatsPage;
