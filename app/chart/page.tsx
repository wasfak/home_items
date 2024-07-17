"use client";
import React, { useState, useEffect } from "react";
import Component from "@/components/Chart";
import { fetchTotalPricesByMonth } from "@/lib/actions/userActions";

export default function History() {
  const [chartData, setChartData] = useState<
    { month: number; totalCost: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchTotalPricesByMonth();
      setChartData(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="mx-2">
      <Component chartData={chartData} />
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
