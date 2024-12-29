export interface DashboardConfig {
  template_id: number;
  revenue_value: {
    kpi: string;
    variables: string[];
  };
  sales: {
    kpi: string;
    variables: string[];
  };
  "area-chart-interactive": {
    date: string;
    kpi: string;
    variables: string[];
    label: string;
  };
  "line-chart-label": {
    date: string;
    kpi: string;
    variables: string[];
  };
  "pie-chart-text": {
    category: string;
    kpi: string;
    variables: string[];
  };
} 