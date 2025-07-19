import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, Medal, Star, Crown, Target, Book, DollarSign, PiggyBank, Search, Filter, ArrowUpRight } from "lucide-react";
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates";
import { useToast } from "@/hooks/use-toast";

const AchievementsPage = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState(1);
  
  const achievementCategories = [
    { id: 1, name: "All", count: 24, icon: <Star size={16} /> },
    { id: 2, name: "Budgeting", count: 8, icon: <DollarSign size={16} /> },
    { id: 3, name: "Savings", count: 6, icon: <PiggyBank size={16} /> },
    { id: 4, name: "Learning", count: 10, icon: <Book size={16} /> }
  ];

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      name: "Budget Master",
      description: "Stay under budget for 3 consecutive months",
      category: "Budgeting",
      progress: 67,
      icon: <Target className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: false,
      xp: 250,
      image: "https://images.unsplash.com/photo-1565514020179-026b92b4a5d0?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Savings Starter",
      description: "Save your first $500",
      category: "Savings",
      progress: 100,
      icon: <PiggyBank className="text-finny-green" />,
      color: "bg-finny-green",
      unlocked: true,
      xp: 100,
      image: "https://images.unsplash.com/photo-1633158829799-56bdf8e53fc1?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "Finance Scholar",
      description: "Complete 5 financial learning quests",
      category: "Learning",
      progress: 40,
      icon: <Book className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 200,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 4,
      name: "Perfect Planner",
      description: "Create and maintain a budget for 6 months",
      category: "Budgeting",
      progress: 100,
      icon: <Crown className="text-finny-orange" />,
      color: "bg-finny-orange",
      unlocked: true,
      xp: 300,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 5,
      name: "Goal Getter",
      description: "Complete your first savings goal",
      category: "Savings",
      progress: 80,
      icon: <Target className="text-finny-blue" />,
      color: "bg-finny-blue",
      unlocked: false,
      xp: 150,
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    },
    {
      id: 6,
      name: "Streak Keeper",
      description: "Log in for 14 consecutive days",
      category: "Engagement",
      progress: 100,
      icon: <Medal className="text-finny-purple" />,
      color: "bg-finny-purple",
      unlocked: true,
      xp: 50,
      image: "https://images.unsplash.com/photo-1519834704043-6acbb5208e54?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3"
    }
  ]);

  useRealTimeUpdates({
    tableName: "user_achievements",
    onDataChange: (payload) => {
      console.log("Achievement update:", payload);
      // In a real implementation, we would refresh achievements here
    }
  });

  const handleCategoryChange = (categoryId: number) => {
    setActiveCategory(categoryId);
    
    const category = achievementCategories.find(c => c.id === categoryId);
    if (category) {
      toast({
        title: `${category.name} Achievements`,
        description: `Showing ${category.count} ${category.name.toLowerCase()} achievements.`
      });
    }
  };

  const handleSearch = () => {
    toast({
      title: "Search Achievements",
      description: "Enter keywords to find specific achievements."
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filter Achievements",
      description: "Filter achievements by status, date, or other criteria."
    });
  };

  const handleViewDetails = (achievementId: number) => {
    toast({
      title: "Achievement Details",
      description: `Viewing details for achievement #${achievementId}.`
    });
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Award className="text-finny-purple" />
          Achievements
        </h1>
        <p className="text-muted-foreground">Track your progress and earn rewards</p>
      </div>

      {/* Achievement stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-finny-purple/10 rounded-full flex items-center justify-center">
              <Award size={28} className="text-finny-purple" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements Earned</p>
              <p className="text-2xl font-bold">8 of 24</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-finny-blue/10 rounded-full flex items-center justify-center">
              <Star size={28} className="text-finny-blue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total XP Earned</p>
              <p className="text-2xl font-bold">1,200 XP</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-finny-green/10 rounded-full flex items-center justify-center">
              <Crown size={28} className="text-finny-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Level</p>
              <p className="text-2xl font-bold">Level 6</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LLM Integration Placeholder */}
      <Card className="mb-8 border-2 border-dashed border-finny-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-finny-purple" />
            Achievement Insights
          </CardTitle>
          <CardDescription>
            This section will contain AI-powered insights and suggestions for unlocking achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-32 bg-gray-50">
          <p className="text-muted-foreground text-center">
            LLM integration placeholder - achievement recommendations will appear here
          </p>
        </CardContent>
      </Card>

      {/* Achievement filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {achievementCategories.map(category => (
          <Badge 
            key={category.id} 
            className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer ${
              category.id === activeCategory ? 'bg-finny-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.icon}
            {category.name}
            <span className="text-xs ml-1">({category.count})</span>
          </Badge>
        ))}
        <div className="ml-auto flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleSearch}
          >
            <Search size={14} />
            Search
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleFilter}
          >
            <Filter size={14} />
            Filter
          </Button>
        </div>
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`overflow-hidden hover:shadow-md transition-all ${
            achievement.unlocked ? '' : 'opacity-75'
          }`}>
            <div className="h-36 overflow-hidden relative">
              <img 
                src={achievement.image} 
                alt={achievement.name} 
                className="w-full h-full object-cover"
              />
              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-finny-green text-white">Unlocked</Badge>
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.color.replace('bg-', 'bg-')}/10`}>
                  {achievement.icon}
                </div>
                {achievement.name}
              </CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {achievement.progress}% Complete
                </span>
                <span className="text-sm font-medium">
                  {achievement.xp} XP
                </span>
              </div>
              <Progress 
                value={achievement.progress} 
                className={`h-2 ${achievement.color}`}
              />
              
              {achievement.unlocked ? (
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-finny-green">
                    <Award size={16} className="mr-1" />
                    <span className="text-sm font-medium">Earned</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 flex items-center gap-1"
                    onClick={() => handleViewDetails(achievement.id)}
                  >
                    Details <ArrowUpRight size={12} />
                  </Button>
                </div>
              ) : (
                <div className="mt-4 text-sm text-muted-foreground">
                  {100 - achievement.progress}% more to unlock
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default AchievementsPage;
