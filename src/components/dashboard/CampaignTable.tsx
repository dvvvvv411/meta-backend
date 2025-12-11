import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  status: "aktiv" | "pausiert" | "beendet";
  budget: string;
  spent: string;
  impressions: string;
  clicks: string;
  ctr: string;
  trend: "up" | "down";
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Sommerkampagne 2024",
    status: "aktiv",
    budget: "5.000 €",
    spent: "3.240 €",
    impressions: "124.5K",
    clicks: "4.8K",
    ctr: "3.85%",
    trend: "up",
  },
  {
    id: "2",
    name: "Produktlaunch Q1",
    status: "aktiv",
    budget: "12.000 €",
    spent: "8.720 €",
    impressions: "342.1K",
    clicks: "12.3K",
    ctr: "3.60%",
    trend: "up",
  },
  {
    id: "3",
    name: "Retargeting DE",
    status: "pausiert",
    budget: "3.500 €",
    spent: "2.100 €",
    impressions: "89.2K",
    clicks: "2.1K",
    ctr: "2.35%",
    trend: "down",
  },
  {
    id: "4",
    name: "Brand Awareness",
    status: "beendet",
    budget: "8.000 €",
    spent: "8.000 €",
    impressions: "512.8K",
    clicks: "18.9K",
    ctr: "3.69%",
    trend: "up",
  },
];

const statusColors = {
  aktiv: "bg-success/10 text-success border-success/20",
  pausiert: "bg-warning/10 text-warning border-warning/20",
  beendet: "bg-muted text-muted-foreground border-border",
};

export function CampaignTable() {
  return (
    <div className="fintech-card overflow-hidden p-0">
      <div className="border-b border-border p-6">
        <h3 className="font-display font-semibold text-lg">Aktive Kampagnen</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Übersicht aller laufenden Werbekampagnen
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Kampagne
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Impressionen
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Klicks
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                CTR
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{campaign.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={statusColors[campaign.status]}
                  >
                    {campaign.status.charAt(0).toUpperCase() +
                      campaign.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span className="font-medium">{campaign.spent}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {campaign.budget}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {campaign.impressions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {campaign.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{campaign.ctr}</span>
                    {campaign.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                      <DropdownMenuItem>Pausieren</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
