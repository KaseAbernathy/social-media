function parseDate(string) {
  if (string == null) {
    return "";
  }
  return new Date(Date.parse(string)).toLocaleDateString("en-US");
}
