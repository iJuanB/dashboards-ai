"use client"

import { useEffect, useRef } from 'react';
import vegaEmbed from 'vega-embed';

interface VegaScatterPlotProps {
  data: Array<{ x: number; y: number }>;
}

export function VegaScatterPlot({ data }: VegaScatterPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "A scatter plot visualization.",
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
        type: "point",
        filled: true,
        size: 100,
        opacity: 0.7,
        tooltip: true,
        color: "hsl(var(--primary))"
      },
      encoding: {
        x: { 
          field: "x", 
          type: "quantitative",
          scale: { padding: 0.1 },
          axis: { 
            grid: false,
            domainColor: "var(--border-color)",
            tickColor: "var(--border-color)",
            labelColor: "var(--text-color)",
            labelPadding: 8,
            ticks: false,
            title: null,
            offset: 5
          }
        },
        y: { 
          field: "y", 
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