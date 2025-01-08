import { connectToDb } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    await connectToDb();
    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    await User.create({ email, password, role: "user" });
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Signup error: " + error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 501 }
    );
  }
}
