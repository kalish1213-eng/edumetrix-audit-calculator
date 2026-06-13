import { getStartPageFromHash } from "../utils/pageNavigation.js?v=20260613-structure3";

export function createWorkbookState({ hash = location.hash, pageCount = 137 } = {}) {
  return {
    currentPage: getStartPageFromHash(hash),
    pageCount,
    zoom: "fit",
    spread: false
  };
}
