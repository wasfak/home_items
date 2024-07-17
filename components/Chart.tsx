"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "./ui/chart";

interface ChartProps {
  chartData: { month: number; totalCost: number }[];
}

const chartConfig = {
  totalCost: {
    label: "Total Cost",
    color: "hsl(var(--chart-1))",
  },
};

const Component: React.FC<ChartProps> = ({ chartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>Total Cost by Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="totalCost"
              fill={chartConfig.totalCost.color}
              barSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Component;
