import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient, getSheetId, getSheetTab } from "../../lib/sheets";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, projectType, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const sheetId = getSheetId();
  if (!sheetId) {
    return NextResponse.json(
      { error: "Google Sheet ID is not configured." },
      { status: 500 }
    );
  }

  try {
    const sheets = getSheetsClient();
    const submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const sheetTab = getSheetTab();
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetTab}!A:F`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[submittedAt, name, email, projectType || "Not specified", message, "Pending"]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sheets API error:", err);
    return NextResponse.json(
      { error: "Failed to submit. Please try again later." },
      { status: 502 }
    );
  }
}
