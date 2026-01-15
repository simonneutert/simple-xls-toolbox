export function excelColNumberToName(col: number): string {
  let name = "";
  while (col > 0) {
    const rem = (col - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    col = Math.floor((col - 1) / 26);
  }
  return name;
}
