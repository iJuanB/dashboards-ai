declare module 'vega-embed' {
  interface EmbedOptions {
    actions?: boolean;
    renderer?: string;
    theme?: string;
    [key: string]: any;
  }

  interface VegaSpec {
    $schema: string;
    description?: string;
    width?: string | number;
    height?: string | number;
    autosize?: {
      type: string;
      contains?: string;
    };
    config?: {
      view?: {
        stroke?: string;
      };
    };
    data: {
      values: any[];
    };
    mark: string | {
      type: string;
      cornerRadius?: number;
    };
    encoding: {
      [key: string]: any;
    };
  }

  function vegaEmbed(
    el: string | HTMLElement,
    spec: VegaSpec,
    options?: EmbedOptions
  ): Promise<any>;

  export default vegaEmbed;
} 