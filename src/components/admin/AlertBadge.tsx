import React from 'react'

interface AlertBadgeProps {
  status: 'In_Stock' | 'Low_Stock' | 'Out_Of_Stock' | string
}

export function AlertBadge({ status }: AlertBadgeProps) {
  let colorClass = ''
  let text = ''

  switch (status) {
    case 'In_Stock':
      colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200'
      text = 'In Stock'
      break
    case 'Low_Stock':
      colorClass = 'bg-amber-50 text-amber-700 border-amber-200'
      text = 'Low Stock'
      break
    case 'Out_Of_Stock':
    default:
      colorClass = 'bg-rose-50 text-rose-700 border-rose-200'
      text = 'Out of Stock'
      break
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-xs ${colorClass}`}>
      {text}
    </span>
  )
}
export default AlertBadge
