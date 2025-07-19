
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Target, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { 
  viewDetailedReport, 
  createNewSavingsGoal, 
  updateSavingsGoal, 
  viewAllHistory 
} from "@/utils/buttonActions";
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates";

const SavingsPage = () => {
  const [savingsGoals, setSavingsGoals] = useState([
    {
      id: "1",
      title: "Emergency Fund",
      current: 1240,
      target: 5000,
      deadline: "December 2023",
      progress: 24,
      description: "3-6 months of essential expenses",
      color: "bg-finny-blue"
    },
    {
      id: "2", 
      title: "New Laptop",
      current: 540,
      target: 1200,
      deadline: "August 2023",
      progress: 45,
      description: "For work and personal projects",
      color: "bg-finny-purple"
    },
    {
      id: "3",
      title: "Vacation",
      current: 250,
      target: 2000,
      deadline: "June 2024",
      progress: 12,
      description: "Summer getaway",
      color: "bg-finny-green"
    }
  ]);

  // Set up real-time updates for savings_goals
  useRealTimeUpdates({
    tableName: "savings_goals",
    onDataChange: (payload) => {
      // If we had actual database data, we would refresh or update the goals here
      console.log("Savings goal updated:", payload);
    }
  });

  const handleDetailedReport = () => {
    viewDetailedReport();
  };

  const handleNewGoal = () => {
    createNewSavingsGoal();
  };

  const handleUpdateGoal = (goalId: string) => {
    updateSavingsGoal(goalId);
  };

  const handleViewAllHistory = () => {
    viewAllHistory();
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Savings Goals</h1>
        <p className="text-muted-foreground">Track and manage your savings goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="text-finny-purple" />
              Total Savings Progress
            </CardTitle>
            <CardDescription>Combined progress across all your saving goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold">$2,030</span>
                <span className="text-muted-foreground ml-2">/ $8,200 total goal</span>
              </div>
              <Badge className="bg-finny-purple text-white">25% Complete</Badge>
            </div>
            <Progress value={25} className="h-3 bg-gray-200" />
            
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-muted-foreground">Started: January 2023</span>
              <Button 
                variant="link" 
                className="flex items-center text-finny-purple p-0"
                onClick={handleDetailedReport}
              >
                View Detailed Report <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="text-finny-green h-5 w-5" />
              Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="w-16 h-16 rounded-full bg-finny-green/10 flex items-center justify-center mb-3">
                <TrendingUp className="text-finny-green h-8 w-8" />
              </div>
              <h3 className="font-semibold text-center mb-1">Consistent Saver</h3>
              <p className="text-xs text-muted-foreground text-center">
                Contributed to goals for 5 weeks straight!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Savings Goals</h2>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleNewGoal}
          >
            <Plus className="h-4 w-4" /> New Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savingsGoals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">${goal.current}</p>
                    <p className="text-sm text-muted-foreground">of ${goal.target} goal</p>
                  </div>
                  <div className="bg-finny-purple/10 py-1 px-3 rounded-full">
                    <span className="text-sm font-medium text-finny-purple">{goal.progress}%</span>
                  </div>
                </div>
                
                <Progress value={goal.progress} className={`h-2 ${goal.color}`} />
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">Target: {goal.deadline}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => handleUpdateGoal(goal.id)}
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card 
            className="border-dashed border-2 flex flex-col items-center justify-center p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleNewGoal}
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="font-medium">Add New Goal</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Create a new savings target to track
            </p>
          </Card>
        </div>
      </div>

      {/* LLM Integration Placeholder */}
      <Card className="mb-8 border-2 border-dashed border-finny-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="text-finny-purple" />
            Finny's Savings Advice
          </CardTitle>
          <CardDescription>
            This section will contain AI-powered financial advice for your savings goals
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-32 bg-gray-50">
          <p className="text-muted-foreground text-center">
            LLM integration placeholder - personalized savings advice will appear here
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Savings History</CardTitle>
            <CardDescription>Your recent contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Emergency Fund</p>
                  <p className="text-xs text-muted-foreground">April 10, 2023</p>
                </div>
                <span className="font-medium text-finny-green">+$150.00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">New Laptop</p>
                  <p className="text-xs text-muted-foreground">April 5, 2023</p>
                </div>
                <span className="font-medium text-finny-green">+$75.00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Vacation</p>
                  <p className="text-xs text-muted-foreground">April 1, 2023</p>
                </div>
                <span className="font-medium text-finny-green">+$50.00</span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllHistory}
              >
                View All History
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Savings Tips</CardTitle>
            <CardDescription>Strategies to reach your goals faster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-finny-blue/5 border border-finny-blue/20 rounded-lg">
                <h4 className="font-medium text-finny-blue mb-1">Automate Your Savings</h4>
                <p className="text-sm">Set up automatic transfers to your savings accounts on payday.</p>
              </div>
              <div className="p-3 bg-finny-purple/5 border border-finny-purple/20 rounded-lg">
                <h4 className="font-medium text-finny-purple mb-1">Use the 50/30/20 Rule</h4>
                <p className="text-sm">Allocate 50% to needs, 30% to wants, and 20% to savings.</p>
              </div>
              <div className="p-3 bg-finny-green/5 border border-finny-green/20 rounded-lg">
                <h4 className="font-medium text-finny-green mb-1">Save Unexpected Income</h4>
                <p className="text-sm">Put bonuses, tax refunds, and gifts directly into savings.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SavingsPage;
