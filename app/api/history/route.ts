// app/api/history/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import History from "@/app/models/History";

// Dummy user ID - will be replaced with actual auth later
const DUMMY_USER_ID = "000000000000000000000000"; // 24 char ObjectId format

// GET - Fetch history for user
export async function GET() {
  try {
    await dbConnect();
    
    // Fetch history entries, sorted by newest first
    const history = await History.find({ userId: DUMMY_USER_ID })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 most recent entries
      .lean(); // Return plain JS objects
    
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// POST - Save a new history entry
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { topic, interest, result } = body;
    
    if (!topic || !interest || !result) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create new history entry
    const historyEntry = new History({
      userId: DUMMY_USER_ID,
      topic,
      interest,
      result,
      createdAt: new Date(),
    });
    
    await historyEntry.save();
    
    return NextResponse.json({ 
      success: true, 
      message: "History saved successfully",
      data: historyEntry 
    });
  } catch (error) {
    console.error("Error saving history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save history" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a history entry by ID
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing history ID" },
        { status: 400 }
      );
    }
    
    const deleted = await History.findOneAndDelete({ 
      _id: id, 
      userId: DUMMY_USER_ID 
    });
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "History entry not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "History entry deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete history" },
      { status: 500 }
    );
  }
}

