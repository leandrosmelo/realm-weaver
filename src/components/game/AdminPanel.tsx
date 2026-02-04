import { useState } from "react";
import { Shield, Users, Ban, Settings, Activity, Database, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AdminPanel() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pvpEnabled, setPvpEnabled] = useState(true);

  const serverStats = {
    playersOnline: 1247,
    totalAccounts: 45892,
    activeQuests: 892,
    serverLoad: 67,
  };

  const recentReports = [
    { id: 1, type: "Exploit", user: "DarkMage99", status: "Pending" },
    { id: 2, type: "Harassment", user: "TrollKing", status: "Resolved" },
    { id: 3, type: "Bug", user: "QuestHunter", status: "In Review" },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl text-primary">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Server management & moderation</p>
          </div>
        </div>

        {/* Server Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Players Online", value: serverStats.playersOnline, icon: Users, color: "text-green-400" },
            { label: "Total Accounts", value: serverStats.totalAccounts, icon: Database, color: "text-blue-400" },
            { label: "Active Quests", value: serverStats.activeQuests, icon: Activity, color: "text-amber-400" },
            { label: "Server Load", value: `${serverStats.serverLoad}%`, icon: Settings, color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Server Controls */}
        <div className="glass-panel p-4">
          <h3 className="font-cinzel text-lg mb-4">Server Controls</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Disable player logins</p>
                </div>
              </div>
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-red-400" />
                <div>
                  <p className="text-sm font-medium">PvP Combat</p>
                  <p className="text-xs text-muted-foreground">Enable player vs player</p>
                </div>
              </div>
              <Switch 
                checked={pvpEnabled} 
                onCheckedChange={setPvpEnabled}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-4">
          <h3 className="font-cinzel text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start gap-2">
              <Users className="w-4 h-4" />
              Broadcast Message
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Ban className="w-4 h-4" />
              Ban Player
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Settings className="w-4 h-4" />
              Server Config
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Database className="w-4 h-4" />
              Database Tools
            </Button>
          </div>
        </div>

        {/* Search Player */}
        <div className="glass-panel p-4">
          <h3 className="font-cinzel text-lg mb-4">Search Player</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter player name or ID..."
              className="flex-1 bg-secondary/50"
            />
            <Button className="bg-primary hover:bg-primary/80">Search</Button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="glass-panel p-4">
          <h3 className="font-cinzel text-lg mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-4 h-4 ${
                    report.status === "Pending" ? "text-amber-400" :
                    report.status === "Resolved" ? "text-green-400" : "text-blue-400"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{report.type}</p>
                    <p className="text-xs text-muted-foreground">Reported: {report.user}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.status === "Pending" ? "bg-amber-400/20 text-amber-400" :
                  report.status === "Resolved" ? "bg-green-400/20 text-green-400" : "bg-blue-400/20 text-blue-400"
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
