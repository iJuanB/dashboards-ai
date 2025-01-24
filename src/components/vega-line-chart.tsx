"use client"

import { useEffect, useRef } from 'react';
import vegaEmbed from 'vega-embed';

interface VegaLineChartProps {
  data: Array<{ date: string; value: number }>;
}

export function VegaLineChart({ data }: VegaLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "A line chart visualization.",
      width: "container",
      height: "container",
      autosize: {
        type: "fit",
        contains: "padding",
        resize: true
      },
      config: {
        view: {
          stroke: "transparent",
          continuousWidth: 800,
          continuousHeight: 300
        },
        style: {
          "guide-label": {
            fontSize: 12
          },
          "guide-title": {
            fontSize: 14
          }
        }
      },
      background: null,
      padding: 0,
      data: {
        values: data
      },
      mark: {
        type: "line",
        point: true,
        tooltip: true,
        color: "hsl(var(--primary))",
        strokeWidth: 2
      },
      encoding: {
        x: { 
          field: "date", 
          type: "temporal",
          scale: { padding: 0.1 },
          axis: { 
            grid: false,
            domainColor: "var(--border-color)",
            tickColor: "var(--border-color)",
            labelColor: "var(--text-color)",
            labelPadding: 8,
            format: "%b %d",
            ticks: false,
            title: null,
            offset: 5
          }
        },
        y: { 
          field: "value", 
          type: "quantitative",
          scale: { padding: 0.1 },
          axis: {
            grid: true,
            gridColor: "var(--grid-color)",
            domainColor: "var(--border-color)",
            tickColor: "var(--border-color)",
            labelColor: "var(--text-color)",
            labelPadding: 8,
            ticks: false,
            title: null,
            tickCount: 5,
            offset: 5
          }
        }
      }
    };

    if (containerRef.current) {
      vegaEmbed(containerRef.current, spec, {
        actions: false,
        renderer: "svg",
        theme: "dark"
      }).catch(console.error);
    }
  }, [data]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full vega-container"
      style={{
        "--border-color": "hsl(var(--muted-foreground))",
        "--text-color": "hsl(var(--foreground))",
        "--grid-color": "hsl(var(--muted) / 0.3)"
      } as React.CSSProperties}
    />
  );
} 