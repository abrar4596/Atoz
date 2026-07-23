export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`
}

export function parseDate(dateStr: string | Date) {
  return new Date(dateStr)
}
