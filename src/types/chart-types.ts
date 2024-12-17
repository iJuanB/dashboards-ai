export interface ChartDataPoint {
  [key: string]: string | number | Date | undefined
  timestamp?: string | Date
}

export interface ChartProps {
  data: ChartDataPoint[]
  variables: {
    x: string
    y: string[]
    labels?: {
      [key: string]: string
    }
  }
  title?: string
  description?: string
} 