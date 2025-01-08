import { authOption } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDb();
    const products = await Product.find({}).lean();

    if (!products || products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("Product Error", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await connectToDb();

    const body = await req.json();
    if (
      !body.name ||
      !body.description ||
      !body.imageUrl ||
      body.variants.lenght === 0
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(body);
    return NextResponse.json({ newProduct }, { status: 201 });
  } catch (error) {
    console.log("Product Error", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
