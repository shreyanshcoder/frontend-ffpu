// utils/formatFilters.js
function safeParse(raw) {
    if (!raw) return null;
    if (typeof raw === "object") return raw;
    try { return JSON.parse(raw); } catch (_) {}
    try { return JSON.parse(raw.replace(/'/g, '"')); } catch (_) {}
    return null;
  }
  
  export function renderFiltersFromRow(row) {
    // Prefer normalized backend fields first
    let filters =
      row?.filters ||
      (row?.strategy && typeof row.strategy === "object" ? row.strategy.filters : null);
  
    // Fallback: try to parse the legacy string
    if (!filters) {
      const parsed = safeParse(row?.strategy);
      filters = parsed?.filters;
    }
  
    if (!Array.isArray(filters) || filters.length === 0) return "—";
  
    return filters
      .map((f) => {
        const d = f?.Data || {};
        const p = d?.param?.name ?? "Param";
        const sign = d?.sign ?? "";
        const thr = d?.threshold ?? "";
        const per = d?.period != null ? ` (period ${d.period})` : "";
        return `${p} ${sign} ${thr}${per}`.trim();
      })
      .join(" • ");
  }
  