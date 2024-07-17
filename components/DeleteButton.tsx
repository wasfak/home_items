"use client";

import { deleteItem } from "@/lib/actions/userActions";
import { Button } from "./ui/button";
import { GroceryItem } from "@prisma/client";
import { useState } from "react";

interface DeleteButtonProps {
  item: GroceryItem;
}
export default function DeleteButton({ item }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handelDeleteItem = async (itemId: string) => {
    setIsLoading(true);
    const del = await deleteItem(itemId);
    setIsLoading(false);
  };

  return (
    <Button onClick={() => handelDeleteItem(item.id)} variant="destructive">
      {isLoading ? "Deleting.." : "Delete"}
    </Button>
  );
}
