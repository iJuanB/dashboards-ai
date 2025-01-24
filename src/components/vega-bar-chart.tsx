"use client"

import { useEffect, useRef } from 'react';
import vegaEmbed from 'vega-embed';

interface VegaBarChartProps {
  data: Array<{ a: string; b: number }>;
}

export function VegaBarChart({ data }: VegaBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "A simple bar chart with embedded data.",
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
        type: "bar",
        cornerRadius: 4,
        tooltip: true,
        width: { band: 0.8 }
      },
      encoding: {
        x: { 
          field: "a", 
          type: "nominal",
          scale: { padding: 0.1 },
          axis: { 
            labelAngle: 0,
            grid: false,
            domainColor: "var(--border-color)",
            tickColor: "var(--border-color)",
            labelColor: "var(--text-color)",
            labelLimit: 150,
            labelPadding: 8,
            ticks: false,
            title: null,
            offset: 5
          }
        },
        y: { 
          field: "b", 
          type: "quantitative",
          scale: { padding: 0 },
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