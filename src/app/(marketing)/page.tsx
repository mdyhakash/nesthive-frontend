"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { StatusBadge } from "@/components/shared/status-badge";
import { Users, Home as HomeIcon, ShieldCheck } from "lucide-react";

export default function MarketingHome() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mx-auto w-full max-w-5xl space-y-12">
        <div className="text-center space-y-4">
          <Badge tone="amber">NestHive Marketing Shell</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Find your room. Find your people.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Verified rooms, compatible roommates, and rent that is easy to pay across Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            label="Active Listings"
            value={1240}
            suffix="+"
            icon={HomeIcon}
            hint="Across 24 Dhaka neighborhoods"
          />
          <StatCard
            label="Verified Owners"
            value={486}
            icon={ShieldCheck}
            hint="NID and ownership verified"
          />
          <StatCard
            label="Happy Tenants"
            value={3820}
            suffix="+"
            icon={Users}
            hint="Found rooms & roommates"
          />
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Platform Status</CardTitle>
              <StatusBadge status="ACTIVE" />
            </div>
            <CardDescription>
              Shared marketing layouts, navigation header, footer and UI widgets initialized.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="default">Get Started</Button>
            <Button variant="secondary">Browse Listings</Button>
            <Button variant="outline">Learn More</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
