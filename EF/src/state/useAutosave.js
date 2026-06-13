export function formatSaveTime(date = new Date(), locale = "ru-RU") {
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

export function createAutosaveState() {
  let status = "saved";
  let updatedAt = new Date();

  return {
    get status() {
      return status;
    },
    get updatedAt() {
      return updatedAt;
    },
    markSaving() {
      status = "saving";
      updatedAt = new Date();
    },
    markSaved() {
      status = "saved";
      updatedAt = new Date();
    },
    markError() {
      status = "error";
      updatedAt = new Date();
    }
  };
}
