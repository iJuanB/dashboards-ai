declare module 'vega-lite' {
  interface VegaLiteSpec {
    $schema: string;
    description?: string;
    data: {
      values: any[];
    };
    mark: string;
    encoding: {
      x?: {
        field: string;
        type: string;
        axis?: {
          labelAngle?: number;
        };
      };
      y?: {
        field: string;
        type: string;
      };
      [key: string]: any;
    };
  }

  export type TopLevelSpec = VegaLiteSpec;
} 