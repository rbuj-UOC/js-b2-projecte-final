function formatDate(dateIsoString) {
  try {
    return new Intl.DateTimeFormat("ca-ES", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(dateIsoString));
  } catch {
    return dateIsoString;
  }
}

export default formatDate;
