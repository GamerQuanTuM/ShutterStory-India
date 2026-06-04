import { NextResponse } from "next/server";
import { getSheetsClient, getSheetId, getSheetTab } from "../../lib/sheets";

export async function GET() {
  const sheetId = getSheetId();
  if (!sheetId) {
    return NextResponse.json(
      { error: "Google Sheet ID is not configured." },
      { status: 500 }
    );
  }

  try {
    const sheets = getSheetsClient();
    const sheetTab = getSheetTab();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetTab}!A:F`,
    });

    const rows = res.data.values ?? [];
    
    // Auto-initialize "Status" column header if it doesn't exist
    if (rows.length > 0 && !rows[0][5]) {
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `${sheetTab}!F1`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [["Status"]],
          },
        });
      } catch (e) {
        console.error("Failed to auto-initialize Status header:", e);
      }
    }

    // Skip the header row (first row)
    const dataRows = rows.slice(1);

    const submissions = dataRows.map((row, index) => {
      // Row numbers: index 0 of dataRows corresponds to row 2 in sheets (since row 1 is header)
      const rowNumber = index + 2;
      return {
        rowNumber,
        submittedAt: (row[0] ?? "").trim(),
        name: (row[1] ?? "").trim(),
        email: (row[2] ?? "").trim(),
        projectType: (row[3] ?? "").trim(),
        message: (row[4] ?? "").trim(),
        status: (row[5] ?? "Pending").trim(), // Default to Pending if empty
      };
    });

    return NextResponse.json({ submissions: submissions.reverse() });
  } catch (err) {
    console.error("Sheets read error:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions." },
      { status: 502 }
    );
  }
}

export async function PATCH(req: Request) {
  const sheetId = getSheetId();
  if (!sheetId) {
    return NextResponse.json(
      { error: "Google Sheet ID is not configured." },
      { status: 500 }
    );
  }

  try {
    const { rowNumber, status } = await req.json();

    if (!rowNumber || !status) {
      return NextResponse.json(
        { error: "Row number and status are required." },
        { status: 400 }
      );
    }

    const sheets = getSheetsClient();
    const sheetTab = getSheetTab();

    // Update column F of the specific row
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetTab}!F${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sheets update error:", err);
    return NextResponse.json(
      { error: "Failed to update status." },
      { status: 502 }
    );
  }
}

export async function DELETE(req: Request) {
  const sheetId = getSheetId();
  if (!sheetId) {
    return NextResponse.json(
      { error: "Google Sheet ID is not configured." },
      { status: 500 }
    );
  }

  try {
    const { rowNumber } = await req.json();

    if (!rowNumber) {
      return NextResponse.json(
        { error: "Row number is required." },
        { status: 400 }
      );
    }

    const sheets = getSheetsClient();
    const sheetTab = getSheetTab();

    // Get the sheet metadata to find the numeric sheetId of the current tab
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    
    const currentSheet = meta.data.sheets?.find(
      (s) => s.properties?.title === sheetTab
    );
    const sheetGid = currentSheet?.properties?.sheetId ?? 0;

    // Delete the specific row using batchUpdate deleteDimension
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetGid,
                dimension: "ROWS",
                startIndex: rowNumber - 1, // 0-based, inclusive
                endIndex: rowNumber,       // 0-based, exclusive
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sheets delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete submission." },
      { status: 502 }
    );
  }
}
