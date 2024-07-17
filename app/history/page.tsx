"use client";
import Component from "@/components/Chart";
import { Button } from "@/components/ui/button";
import { fetchItemsByMonth } from "@/lib/actions/userActions";
import { useState } from "react";
interface GroceryItem {
  id: number;
  name: string;
  price: number;
  family: string;
  month: number;
}
export default function History() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (selectedMonth) {
      setIsLoading(true);
      const data = await fetchItemsByMonth(Number(selectedMonth));

      setItems(data);
      setIsLoading(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="flex flex-col gap-y-4 container mx-auto">
      <div className="">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mb-4"
        >
          <option value="" disabled>
            Select a month
          </option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <br />
        <span>
          {" "}
          <Button onClick={handleSearch}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </span>
      </div>
      <div>
        {items.length === 0 ? (
          <h2>No items found for the selected month.</h2>
        ) : (
          <div className="">
            <h2 className="text-lg font-bold">Total: {totalPrice}</h2>
            <ul>
              {items &&
                items.map((item) => (
                  <li key={item?.id}>
                    {item?.name} - {item?.price}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
