"use client"

import { useEffect, useRef } from 'react';
import vegaEmbed from 'vega-embed';

interface VegaHistogramProps {
  data: number[];
}

export function VegaHistogram({ data }: VegaHistogramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "A histogram visualization.",
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
        values: data.map(value => ({ value }))
      },
      mark: {
        type: "bar",
        tooltip: true,
        color: "hsl(var(--primary))",
        cornerRadius: 2
      },
      encoding: {
        x: { 
          field: "value",
          type: "quantitative",
          bin: {
            maxbins: 10
          },
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
          aggregate: "count",
          type: "quantitative",
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