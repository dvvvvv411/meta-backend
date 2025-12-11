import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MousePointerClick,
  Euro,
  TrendingUp,
  Plus,
  Download,
} from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout isAdmin={true}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            Willkommen zurück!
          </h1>
          <p className="text-muted-foreground mt-1">
            Hier ist eine Übersicht Ihrer Werbekampagnen.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportieren</span>
          </Button>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Neue Kampagne</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Impressionen"
          value="1.24M"
          change="+12.5% vs. Vorwoche"
          changeType="positive"
          icon={Eye}
          className="animate-fade-in"
          style={{ animationDelay: "0ms" } as React.CSSProperties}
        />
        <StatCard
          title="Klicks"
          value="48.2K"
          change="+8.3% vs. Vorwoche"
          changeType="positive"
          icon={MousePointerClick}
          className="animate-fade-in"
          style={{ animationDelay: "100ms" } as React.CSSProperties}
        />
        <StatCard
          title="Ausgaben"
          value="24.580 €"
          change="72% des Budgets"
          changeType="neutral"
          icon={Euro}
          className="animate-fade-in"
          style={{ animationDelay: "200ms" } as React.CSSProperties}
        />
        <StatCard
          title="Conversions"
          value="1.847"
          change="+15.2% vs. Vorwoche"
          changeType="positive"
          icon={TrendingUp}
          className="animate-fade-in"
          style={{ animationDelay: "300ms" } as React.CSSProperties}
        />
      </div>

      {/* Chart and Table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <PerformanceChart />
        <div className="fintech-card">
          <h3 className="font-display font-semibold text-lg mb-4">
            Schnellaktionen
          </h3>
          <div className="space-y-3">
            {[
              { label: "Neue Kampagne erstellen", icon: Plus },
              { label: "Budget anpassen", icon: Euro },
              { label: "Zielgruppe erweitern", icon: TrendingUp },
              { label: "Bericht herunterladen", icon: Download },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 text-left"
              >
                <div className="h-10 w-10 rounded-lg gradient-bg-soft flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <CampaignTable />
    </DashboardLayout>
  );
}
