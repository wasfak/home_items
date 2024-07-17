import { Button } from "@/components/ui/button";
import prisma from "@/lib/db/prisma";

export default async function ItemsPage() {
  const currentMonth = new Date().getMonth() + 1;
  const data = await prisma.groceryItem.findMany({
    where: {
      family: "wasfy",
      month: currentMonth,
    },
  });
  if (!data) {
    return <h1>No data</h1>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-lg font-bold">Month: {currentMonth}</h1>
      {data.map((item) => {
        return (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 mt-4"
          >
            <p>{item.name}</p>
            <p>{item.price}</p>

            <Button variant="destructive">Delete</Button>
          </div>
        );
      })}
    </div>
  );
}
