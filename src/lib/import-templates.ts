export const generateCSVTemplate = () => {
  const headers = ['Platform', 'Date', 'Earnings', 'Hours', 'Miles', 'Notes']
  const sampleData = [
    ['Uber', '2024-01-15', '85.50', '2.5', '45.2', 'Morning shift'],
    ['DoorDash', '2024-01-15', '62.30', '1.8', '28.5', 'Lunch rush'],
    ['Lyft', '2024-01-14', '45.20', '1.2', '22.1', 'Evening rides'],
    ['Instacart', '2024-01-13', '78.90', '2.1', '35.8', 'Grocery delivery']
  ]
  
  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.join(','))
  ].join('\n')
  
  return csvContent
}

export const downloadTemplate = () => {
  const csvContent = generateCSVTemplate()
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'session-import-template.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export const getSupportedFormats = () => [
  {
    name: 'Generic CSV',
    description: 'Platform, Date, Earnings, Hours, Miles, Notes',
    example: 'Uber, 2024-01-15, 85.50, 2.5, 45.2, Morning shift'
  },
  {
    name: 'Uber',
    description: 'Date, Earnings, Hours, Miles (optional)',
    example: '2024-01-15, 85.50, 2.5, 45.2'
  },
  {
    name: 'DoorDash',
    description: 'Date, Earnings, Hours, Miles (optional)',
    example: '2024-01-15, 62.30, 1.8, 28.5'
  },
  {
    name: 'Lyft',
    description: 'Date, Earnings, Hours, Miles (optional)',
    example: '2024-01-15, 45.20, 1.2, 22.1'
  },
  {
    name: 'Instacart',
    description: 'Date, Earnings, Hours, Miles (optional)',
    example: '2024-01-15, 78.90, 2.1, 35.8'
  }
] 