"use server";

import { revalidatePath } from "next/cache";

import prisma from "../db/prisma";
import { GroceryItem } from "@prisma/client";
import { auth } from "@clerk/nextjs";

type CreateUserInput = {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
};
// CREATE
export async function createUser(user: CreateUserInput) {
  try {
    // Check if a user already exists with the given email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      // User already exists, handle accordingly
      // For example, you can return a message or throw an error
      throw new Error("A user with this email already exists.");
    }

    // If no user exists, create a new user
    const newUser = await prisma.user.create({ data: user });

    // Optionally, return the new user after stripping Prisma metadata
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {}
}

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: user,
    });
    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {}
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: {
        clerkId: clerkId,
      },
    });
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {}
}

interface GroceryItemInput {
  name: string;
  price: number;
}

export async function addItem(values: GroceryItemInput) {
  const { userId } = auth();
  if (!userId) {
    return "no user!!";
  }
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!userToDelete) {
      throw new Error("User not found");
    }
    const currentMonth = new Date().getMonth() + 1;
    // Delete user
    const addItem = await prisma.groceryItem.create({
      data: {
        name: values.name,
        price: values.price,
        family: "wasfy",
        month: currentMonth,
      },
    });
    revalidatePath("/");

    return "done";
  } catch (error) {
    console.log(error);
    return "error";
  }
}

export async function fetchItemsByMonth(currentMonth: number) {
  const { userId } = auth();
  if (!userId) {
    return "no user!!";
  }
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const data = await prisma.groceryItem.findMany({
      where: {
        family: "wasfy",
        month: currentMonth,
      },
    });
    revalidatePath("/");

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.log(error);
    return "error";
  }
}

export const fetchTotalPricesByMonth = async () => {
  const items = await prisma.groceryItem.findMany();

  const totalsByMonth = items.reduce((acc, item) => {
    acc[item.month] = (acc[item.month] || 0) + item.price;
    return acc;
  }, {} as { [key: number]: number });

  return Object.entries(totalsByMonth).map(([month, totalCost]) => ({
    month: Number(month),
    totalCost,
  }));
};

export async function deleteItem(itemId: string) {
  try {
    const del = await prisma.groceryItem.delete({
      where: {
        id: itemId,
      },
    });
    revalidatePath("/items");
  } catch (error) {}
}
