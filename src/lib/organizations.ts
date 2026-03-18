export const ORGANIZATIONS = [
  { value: "bower_hill", label: "Bower Hill Community Church" },
  { value: "mlac", label: "Mt Lebanon Aqua Club (MLAC)" },
  { value: "montessori", label: "Mt Lebanon Montessori" },
] as const;

export function getOrgLabel(value: string | null): string {
  return ORGANIZATIONS.find((o) => o.value === value)?.label || value || "Not specified";
}
