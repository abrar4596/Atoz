import { formatCurrency } from '../utils/formatCurrency'

export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export { formatCurrency }

export function parseDate(dateStr: string | Date) {
  return new Date(dateStr)
}
