
declare namespace Vs
{
  declare namespace plugins
  {
    declare namespace VsContainerPlugin
    {
      declare class VsContainer extends PIXI.Container 
      {
      
        constructor(rectangle?: Rectangle);
      
        initialize(): void;
      
        get opacity(): number;
        set opacity(value: number);
      
        get blendMode(): PIXI.BLEND_MODES;
        set blendMode(value: PIXI.BLEND_MODES);
      
        get parent(): PIXI.Container | null;
        set parent(value: PIXI.Container | null);
      
        onParentChanged(): void;
      
        destroy(options?: {
          children?: boolean;
          texture?: boolean;
          baseTexture?: boolean;
        }): void;
      
        update(): void;
      
        hide(): void;
      
        show(): void;
      
        updateVisibility(): void;
      
        move(x: number, y: number): void;
      
        setHue(hue: number): void;
      
        getBlendColor(): [number, number, number, number];
      
        setBlendColor(color: [number, number, number, number]): void;
      
        getColorTone(): [number, number, number, number];
      
        setColorTone(tone: [number, number, number, number]): void;
      
        protected static _counter: number;
        protected _refresh(): void;
        protected _createColorFilter(): void;
        protected _updateColorFilter(): void;
        protected _id: number;
        protected _hue: number;
        protected _blendColor: [number, number, number, number];
        protected _colorTone: [number, number, number, number];
        protected _colorFilter: ColorFilter | null;
        protected _blendMode: PIXI.BLEND_MODES;
        protected _hidden: boolean;
      }
    }
      
  }
}





interface Window 
{
  VsContainer: typeof Vs.plugins.VsContainerPlugin.VsContainer;
}

declare let VsContainer : typeof Vs.plugins.VsContainerPlugin.VsContainer;