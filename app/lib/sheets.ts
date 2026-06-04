import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: SCOPES,
  });
  return google.sheets({ version: "v4", auth });
}

export function getSheetId() {
  return process.env.GOOGLE_SHEET_ID?.trim() || "";
}

export function getSheetTab() {
  return process.env.SHEET_NAME?.trim() || "sheet";
}
