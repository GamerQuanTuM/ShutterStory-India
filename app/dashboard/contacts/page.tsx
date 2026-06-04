"use client";

import { useEffect, useState } from "react";

interface Submission {
  rowNumber: number;
  submittedAt: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  status: string;
}

function ConfirmModal({
  onConfirm,
  onCancel,
  name,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  name: string;
}) {
  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h4>Delete Enquiry</h4>
        <p>
          Are you sure you want to permanently delete <strong>{name}</strong>&apos;s enquiry from Google Sheets? This action cannot be undone.
        </p>
        <div className="confirm-modal-actions">
          <button className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteConfirm, setDeleteConfirm] = useState<{ rowNumber: number; name: string } | null>(null);

  const handleStatusChange = async (rowNumber: number, newStatus: string) => {
    // Clear any previous error
    setError("");

    // Optimistic UI update
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.rowNumber === rowNumber ? { ...sub, status: newStatus } : sub
      )
    );

    try {
      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowNumber, status: newStatus }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Failed to update status in sheets:", err);
      setError("Failed to update status on Google Sheet. Reverting change.");
      // Revert if it fails
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.rowNumber === rowNumber ? { ...sub, status: newStatus === "Solved" ? "Pending" : "Solved" } : sub
        )
      );
    }
  };

  const handleDelete = async (rowNumber: number) => {
    setError("");

    // Optimistically remove from list
    setSubmissions((prev) => prev.filter((sub) => sub.rowNumber !== rowNumber));

    try {
      const res = await fetch("/api/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowNumber }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // Re-fetch submissions to align rowNumbers correctly
      fetch("/api/submissions")
        .then((r) => r.json())
        .then((d) => {
          if (!d.error) setSubmissions(d.submissions || []);
        });
    } catch (err) {
      console.error("Failed to delete row:", err);
      setError("Failed to delete from Google Sheet. Refreshing list.");
      // Re-fetch to restore state and get accurate alignment
      fetch("/api/submissions")
        .then((r) => r.json())
        .then((d) => {
          if (!d.error) setSubmissions(d.submissions || []);
        });
    }
  };

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSubmissions(data.submissions);
      })
      .catch(() => setError("Failed to load submissions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Contact Submissions</h1>
          <p className="dash-subtitle">Enquiries received from the contact form</p>
        </div>
        <button
          className="btn-ghost"
          onClick={() => {
            setLoading(true);
            setError("");
            fetch("/api/submissions")
              .then((r) => r.json())
              .then((data) => {
                if (data.error) setError(data.error);
                else setSubmissions(data.submissions);
              })
              .catch(() => setError("Failed to load submissions."))
              .finally(() => setLoading(false));
          }}
        >
          Refresh
        </button>
      </div>

      {/* Controls: Search & Sort */}
      {!loading && !error && submissions.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "var(--bg-2)",
                border: "1px solid var(--border-2)",
                borderRadius: 8,
                color: "var(--white)",
                fontSize: "0.85rem",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-2)")}
            />
          </div>

          {/* Sort Controls */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "status")}
              style={{
                padding: "11px 14px",
                background: "var(--bg-2)",
                border: "1px solid var(--border-2)",
                borderRadius: 8,
                color: "var(--white)",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              style={{
                padding: "11px 16px",
                background: "var(--bg-2)",
                border: "1px solid var(--border-2)",
                borderRadius: 8,
                color: "var(--white)",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--gold)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-2)"}
            >
              <strong style={{ color: "var(--gold)", fontWeight: 500 }}>
                {sortBy === "date"
                  ? (sortOrder === "desc" ? "Newest First ➔" : "Oldest First ➔")
                  : (sortOrder === "desc" ? "Pending First ➔" : "Solved First ➔")
                }
              </strong>
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 40, textAlign: "center" }}>
          Loading submissions…
        </div>
      )}

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(224,112,112,0.1)", border: "1px solid rgba(224,112,112,0.3)", borderRadius: 8, color: "#E07070", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {!loading && !error && submissions.length === 0 && (
        <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 40, textAlign: "center" }}>
          No submissions yet. They will appear here once someone fills out the contact form.
        </div>
      )}

      {!loading && submissions.length > 0 && (() => {
        const getTimestamp = (dateStr: string) => {
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };

        const filtered = submissions
          .filter((s) => {
            const q = searchQuery.toLowerCase().trim();
            if (!q) return true;
            return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
          })
          .sort((a, b) => {
            if (sortBy === "status") {
              const statusOrder = sortOrder === "desc" ? ["Pending", "Solved"] : ["Solved", "Pending"];
              const rankA = statusOrder.indexOf(a.status);
              const rankB = statusOrder.indexOf(b.status);
              if (rankA !== rankB) return rankA - rankB;
            }

            const tA = getTimestamp(a.submittedAt);
            const tB = getTimestamp(b.submittedAt);
            return sortOrder === "desc" ? tB - tA : tA - tB;
          });

        if (filtered.length === 0) {
          return (
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 40, textAlign: "center" }}>
              No submissions match your search query.
            </div>
          );
        }

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((s) => {
              const id = `${s.email}-${s.submittedAt}`;
              const isExpanded = expandedId === id;
              const isSolved = s.status === "Solved";

              return (
                <div
                  key={id}
                  style={{
                    background: "var(--bg-2)",
                    border: "1px solid var(--border-2)",
                    borderRadius: 12,
                    padding: "20px 24px",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Solved Checkbox */}
                      <label
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          checked={isSolved}
                          onChange={(e) => {
                            const nextStatus = e.target.checked ? "Solved" : "Pending";
                            handleStatusChange(s.rowNumber, nextStatus);
                          }}
                          style={{
                            width: 17,
                            height: 17,
                            cursor: "pointer",
                            accentColor: "var(--gold)",
                          }}
                        />
                      </label>

                      <div>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1rem",
                            color: "var(--white)",
                            textDecoration: isSolved ? "line-through" : "none",
                            opacity: isSolved ? 0.55 : 1,
                            transition: "all 0.2s",
                          }}
                        >
                          {s.name}
                        </span>
                        <span style={{ marginLeft: 12, fontSize: "0.75rem", color: "var(--gold)", fontVariant: "all-small-caps", letterSpacing: "0.08em" }}>
                          {s.projectType}
                        </span>

                        {/* Status Badge */}
                        <span
                          style={{
                            marginLeft: 12,
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: "0.65rem",
                            fontWeight: 500,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            background: isSolved ? "rgba(144,208,144,0.12)" : "rgba(201,169,110,0.12)",
                            color: isSolved ? "#90D090" : "var(--gold)",
                            border: isSolved ? "1px solid rgba(144,208,144,0.2)" : "1px solid rgba(201,169,110,0.2)",
                            transition: "all 0.2s",
                          }}
                        >
                          {s.status}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{s.submittedAt}</span>

                      {/* Delete Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ rowNumber: s.rowNumber, name: s.name });
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--muted)",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#E07070")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                        title="Delete Enquiry"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>

                      <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 4, fontSize: "0.8rem", color: "var(--muted)", paddingLeft: 29 }}>{s.email}</div>

                  {isExpanded && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-2)", paddingLeft: 29 }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                        {s.message}
                      </p>
                      <a
                        href={`mailto:${s.email}?subject=Re: ${s.projectType}&body=Hi ${s.name},%0D%0A%0D%0A`}
                        className="btn-primary"
                        style={{ display: "inline-flex", marginTop: 16 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Confirm modal */}
      {deleteConfirm && (
        <ConfirmModal
          name={deleteConfirm.name}
          onConfirm={() => {
            handleDelete(deleteConfirm.rowNumber);
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
