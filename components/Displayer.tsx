import prisma from "@/lib/db/prisma";

export default async function Displayer() {
  const data = await prisma.groceryItem.findMany({
    where: {
      family: "wasfy",
    },
  });
  if (!data) {
    return <h1>No data</h1>;
  }
  const totalPrice = data.reduce((sum, item) => sum + item.price, 0);
  const currentMonth = new Date().getMonth() + 1;
  return (
    <div>
      <div className="mt-4 flex items-center gap-4 justify-between">
        <h2 className="text-lg font-bold">Total: {totalPrice}</h2>
        <h2 className="text-lg font-bold">Month: {currentMonth}</h2>
      </div>
    </div>
  );
}
