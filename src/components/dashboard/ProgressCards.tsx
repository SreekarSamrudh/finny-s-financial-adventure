
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, TrendingUp, PiggyBank, Award, Flame } from "lucide-react";

const ProgressCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Budget Health Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CircleCheck className="text-finny-green" size={18} />
            Budget Health
          </CardTitle>
          <CardDescription>This month's progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-green">82%</div>
          <p className="text-sm text-muted-foreground">
            You're under budget! Keep it up!
          </p>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-finny-green" style={{ width: "82%" }}></div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Progress Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PiggyBank className="text-finny-blue" size={18} />
            Savings Goal
          </CardTitle>
          <CardDescription>Emergency Fund</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-blue">
            $1,240<span className="text-sm font-normal text-muted-foreground">/$5,000</span>
          </div>
          <p className="text-sm text-muted-foreground">You're 24% to your goal</p>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-finny-blue" style={{ width: "24%" }}></div>
          </div>
        </CardContent>
      </Card>

      {/* XP & Level Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="text-finny-purple" size={18} />
            Level Progress
          </CardTitle>
          <CardDescription>Track your growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-purple">
            Level 5 <span className="text-sm font-normal text-muted-foreground">1200 XP</span>
          </div>
          <p className="text-sm text-muted-foreground">800 XP to Level 6</p>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-finny-purple"
              style={{ width: "60%" }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="text-finny-orange" size={18} />
            Activity Streak
          </CardTitle>
          <CardDescription>Days in a row</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-finny-orange">7 days</div>
          <p className="text-sm text-muted-foreground">
            Your best streak: 14 days
          </p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full bg-finny-orange"
              ></div>
            ))}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i + 7}
                className="h-1 flex-1 rounded-full bg-gray-200"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCards;
