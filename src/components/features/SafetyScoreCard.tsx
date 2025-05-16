'use client';

import { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sun, Users, Camera, Star } from "lucide-react";

interface SafetyMetrics {
  lighting: number;
  crimeRate: number;
  crowdDensity: number;
  surveillance: number;
  communityRating: number;
}

export function SafetyScoreCard() {
  // In a real app, these would come from an API
  const [safetyMetrics, setSafetyMetrics] = useState<SafetyMetrics>({
    lighting: 85,
    crimeRate: 92,
    crowdDensity: 78,
    surveillance: 70,
    communityRating: 88,
  });

  const calculateOverallScore = (metrics: SafetyMetrics): number => {
    const weights = {
      lighting: 0.2,
      crimeRate: 0.3,
      crowdDensity: 0.15,
      surveillance: 0.15,
      communityRating: 0.2,
    };

    return Math.round(
      metrics.lighting * weights.lighting +
      metrics.crimeRate * weights.crimeRate +
      metrics.crowdDensity * weights.crowdDensity +
      metrics.surveillance * weights.surveillance +
      metrics.communityRating * weights.communityRating
    );
  };

  const overallScore = calculateOverallScore(safetyMetrics);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const renderMetric = (
    icon: React.ReactNode,
    label: string,
    score: number,
    description: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{label}</span>
        <Badge variant="outline" className="ml-auto">
          {score}%
        </Badge>
      </div>
      <Progress value={score} className={getScoreColor(score)} />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Safety Score</CardTitle>
            <CardDescription>Current location safety metrics</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold">{overallScore}</div>
            <div className="text-sm text-muted-foreground">/ 100</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderMetric(
          <Sun className="h-5 w-5 text-yellow-500" />,
          "Lighting Conditions",
          safetyMetrics.lighting,
          "Street lighting and visibility assessment"
        )}
        {renderMetric(
          <AlertCircle className="h-5 w-5 text-red-500" />,
          "Crime Safety",
          safetyMetrics.crimeRate,
          "Based on recent crime reports and incidents"
        )}
        {renderMetric(
          <Users className="h-5 w-5 text-blue-500" />,
          "Crowd Density",
          safetyMetrics.crowdDensity,
          "Real-time crowd presence and activity"
        )}
        {renderMetric(
          <Camera className="h-5 w-5 text-gray-500" />,
          "Surveillance Coverage",
          safetyMetrics.surveillance,
          "CCTV and security monitoring presence"
        )}
        {renderMetric(
          <Star className="h-5 w-5 text-amber-500" />,
          "Community Rating",
          safetyMetrics.communityRating,
          "User-reported safety experiences"
        )}
      </CardContent>
    </Card>
  );
} 