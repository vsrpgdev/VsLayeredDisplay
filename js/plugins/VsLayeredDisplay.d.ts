
namespace Vs
{
  namespace plugins{

    /**
     * main namespace for layered display plugin
     */
    declare namespace VsLayeredDisplay
    {
      /**
       * image configuration for main and subimages
       */
      declare class VsDisplayImageConfig {
        constructor(
          x?: number, 
          y?: number, 
          width?: number, 
          height?: number, 
          columns?: number, 
          rows?: number
        );
    
        /**
         * x position of image (0-1 for main image, pixel coordinates for subimages)
         */
        x: number;

        /**
         * y position of image (0-1 for main image, pixel coordinates for subimages)
         */
        y: number;

        /**
         * width of image (0-1 for main image, pixel coordinates for subimages)
         * if set to 0 bitmap width is used
         */
        width: number;

        /**
         * height of image (0-1 for main image, pixel coordinates for subimages)
         * if set to 0 bitmap height is used
         */
        height: number;

        /**
         * number of subimages columns in the picture file
         */
        columns: number;

        /**
         * number of subimages rows in the picture file
         */
        rows: number;
      }
      
      declare class VsLayeredDisplayConfig 
      {
        /**
         * Name of the configuration
         */
        name: string;
    
        /**
         * Image position and size (0-1)
         */
        imageFrame: VsDisplayImageConfig;
    
        /**
         * Image position and size (0-1)
         */
        pivot: Point;
    
        /**
         * Position and size of subimage (in px)
         */
        subImageCoordinates: VsDisplayImageConfig[];
    
        /**
         * Scales the image to the containing box
         * - "fill": Image stretches to fill the box width and height
         * - "contain": Image keeps aspect ratio and scales to min(width, height)
         * - "cover": Image keeps aspect ratio and scales to max(width, height)
         * - "x": Image scales to 100% width of the box
         * - "y": Image scales to 100% height of the box
         * - "none": Image doesn't get scaled
         */
        autoScale: "fill" | "contain" | "cover" | "x" | "y" | "none";
    
        /**
         * How the image should be aligned inside the box vertically
         */
        verticalAlign: "top" | "bottom" | "middle";
    
        /**
         * How the image should be aligned inside the box horizontally
         */
        horizontalAlign: "left" | "right" | "center";
    
        /**
         * Should image be clipped if outside of box
         */
        clippingEnabled: boolean;
    
        constructor();
      }
      
      declare class VsLayeredDisplayInterface 
      {
        /**
         * changes the message placement (positions are relative to the graphic size 0:0px - 1:window size)
         * @param x 0 - 1
         * @param y 0 - 1
         * @param width 0 - 1
         * @param height 0 - 1
         */
        static ChangeMessagePlacement(x:number,y:number,width:number,height:number): void;
        static SelectContainerSource(source: 0|1|2): void;
        static RemoveDisplay(displayId: number): void;
        static ClearDisplays() : void;
        static AddDisplay(displayId: number, config: VsLayeredDisplayConfig | string): void;
        static FlipDisplay(displayId: number, flipped: boolean): void;
        static SetSmoothScaling(displayId: number, smooth: boolean): void;
        
        static SetDisplayOpacity(displayId: number, opacity: number): void;
        static EnsureDisplay(displayId: number, configName: string): void;
    
        static SetImage(
          displayId: number, 
          imageId: number, 
          bitmap: Bitmap | string, 
          tileIndex?: number
        ): void;
    
        static SetImages(
          displayId: number, 
          images: { id: number; bitmap: Bitmap | string; tileIndex: number }[]
        ): void;
    
        /**
         * redraws bitmaps for display
         * @param displayId
         */
        static DrawBitmaps(displayId: number): void;

        static ShowDisplay(displayId: number): void;
        static MoveToDisplay(displayId: number, x: number, y: number): void;
        

        static SubImageMove(displayId: number, imageId: number, x: number, y: number): void;
        static SubImageMoveTo(displayId: number, imageId: number, x: number, y: number): void;
        static SubImageResize(displayId: number, imageId: number, width: number, height: number): void;

        static SetPivot(displayId: number, x: number, y: number): void;
        static ResizeDisplay(displayId: number, w: number, h: number): void;
        static HideDisplay(displayId: number): void;
    
        static SetDisplayColorTone(
          displayId: number, 
          colorTone: [number, number, number, number]
        ): void;
    
        static SetImagesEx(
          displayId: number, 
          configName: string, 
          images: { id: number; bitmap: Bitmap | string; tileIndex: number }[], 
          flipped?: boolean | string, 
          opacity?: number | string, 
          colorTone?: [number, number, number, number]
        ): void;
    
        static get CurrentContainer(): VsMultiImageContainer | undefined;
        static get CurrentMessageBackgroundContainer(): VsMultiImageContainer | undefined;
        static get CurrentMessageForegroundContainer(): VsMultiImageContainer | undefined;
        
        /**
         * @param displayId
         * @param deg rotation in degrees
         */
        static RotateDisplay(displayId: number, deg:number) : void;
      }

      declare class VsMultiImageContainer extends VsContainer 
      {
        constructor(rectangle?: Rectangle);

        /**
         * Removes all internal references and listeners as well as removes children from the display list.
         * Do not use a Container after calling `destroy`.
         * @param options Options parameter. 
         * @param options.children 
         * @param options.texture 
         * @param options.baseTexture 
         */
        destroy(options?: {
          children?: boolean;
          texture?: boolean;
          baseTexture?: boolean;
        }): void;

        /**
         * Removes the display by its ID.
         * @param displayId
         */
        RemoveDisplay(displayId: number): void;

        /**
         * clears all displyas
         */
        ClearDisplays() : void;

        /**
         * Adds a display by its ID and configuration. existing display gets replaced
         * @param displayId
         * @param config
         */
        AddDisplay(displayId: number, config: VsLayeredDisplayConfig | string): void;

        /**
         * Ensures the display with the given ID matches the provided configuration name.
         * @param displayId
         * @param configName
         */
        EnsureDisplay(displayId: number, configName: string): void;

        /**
         * Sets an image for a specific display ID.
         * @param displayId
         * @param imageId
         * @param bitmap
         * @param index
         */
        SetImage(displayId: number, imageId: number, bitmap: any, index?: number): void;

        /**
         * Sets multiple images for a specific display ID.
         * @param displayId
         * @param images
         */
        SetImages(displayId: number, images:  { id: number; bitmap: Bitmap | string; tileIndex?: number }[]): void;

        /**
         * redraws bitmaps for display
         * @param displayId
         */
        DrawBitmaps(displayId: number): void;
        
        /**
         * Shows the display for a given ID.
         * @param displayId
         */
        ShowDisplay(displayId: number): void;

        /**
         * Hides the display for a given ID.
         * @param displayId
         */
        HideDisplay(displayId: number): void;

        /**
         * Sets the flipped state of a display.
         * @param displayId
         * @param flipped
         */
        SetFlipped(displayId: number, flipped: boolean): void;

        /**
         * Sets the smooth scaling of a display.
         * @param displayId
         * @param smooth
         */
        SetSmoothScaling(displayId: number, smooth: boolean): void;
        /**
         * Sets the opacity of a display.
         * @param displayId
         * @param opacity
         */
        SetDisplayOpacity(displayId: number, opacity: number): void;

        /**
         * Moves the display to a new position.
         * @param displayId
         * @param x
         * @param y
         */
        MoveToDisplay(displayId: number, x: number, y: number): void;

        SubImageMove(displayId: number, imageId: number, x: number, y: number): void;
        SubImageMoveTo(displayId: number, imageId: number, x: number, y: number): void;
        SubImageResize(displayId: number, imageId: number, width: number, height: number): void;

        /**
         * Sets the pivot point for a display.
         * @param displayId
         * @param x
         * @param y
         */
        SetPivot(displayId: number, x: number, y: number): void;

        /**
         * Resizes the display.
         * @param displayId
         * @param width
         * @param height
         */
        ResizeDisplay(displayId: number, width: number, height: number): void;

        /**
         * Sets the color tone for a display.
         * @param displayId
         * @param colorTone
         */
        SetDisplayColorTone(displayId: number, colorTone: [number, number, number, number]): void;

        /** List of layered display containers. */
        Images: VsLayeredDisplayContainer[];

        /**
         * @param displayId
         * @param deg rotation in degrees
         */
        RotateDisplay(displayId: number,deg:number);
      }
      
      declare class VsLayeredDisplayContainer extends VsContainer 
      {
        constructor(config?: VsLayeredDisplayConfig);
      
        get ImageSmoothingEnabled(): boolean;
        set ImageSmoothingEnabled(value: boolean);
      
        get MainBitmap(): Bitmap | undefined;
      
        get Config(): VsLayeredDisplayConfig;
      
        get Flipped(): boolean;
        set Flipped(value: boolean);
      
        /**
         * redraws bitmaps
         * @param displayId
         */
        DrawBitmaps(): void;

        MoveToDisplay(x: number, y: number): void;

        SubImageMove(imageId: number, x: number, y: number): void;
        SubImageMoveTo(imageId: number, x: number, y: number): void;
        SubImageResize(imageId: number, width: number, height: number): void;

        SetPivot(x: number, y: number): void;
        ResizeDisplay(width: number, height: number): void;
      
        ShowImage(id: number, bitmap: Bitmap | string, index?: number): void;
        ShowImages(images: { id: number; tileIndex: number; bitmap: Bitmap | string }[]): void;
      
        destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }): void;
      
        updateMask(targetWidth: number, targetHeight: number): void;

        /**
         * 
         * @param deg rotation in degrees
         */
        Rotate(deg:number): void;

        /**returns the rotation in degrees  */
        readonly rotationDeg : number;


      }
    }
  }
}









interface Window {
  VsLayeredDisplayJson?: VsLayeredDisplayConfig[];

  VsLayeredDisplay: typeof Vs.plugins.VsLayeredDisplay;
  VsLayeredDisplayConfig: typeof Vs.plugins.VsLayeredDisplay.VsLayeredDisplayConfig;
  VsLayeredDisplayContainer: typeof Vs.plugins.VsLayeredDisplay.VsLayeredDisplayContainer;
  VsLayeredDisplayInterface: typeof Vs.plugins.VsLayeredDisplay.VsLayeredDisplayInterface;
  VsMultiImageContainer: typeof Vs.plugins.VsLayeredDisplay.VsMultiImageContainer;
  VsDisplayImageConfig: typeof Vs.plugins.VsLayeredDisplay.VsDisplayImageConfig;
}

declare let VsLayeredDisplay: typeof Vs.plugins.VsLayeredDisplay;
declare let VsLayeredDisplayConfig: typeof Vs.plugins.VsLayeredDisplay.VsLayeredDisplayConfig;
declare let VsLayeredDisplayContainer: typeof Vs.plugins.VsLayeredDisplay.VsLayeredDisplayContainer;
declare let VsLayeredDisplayInterface: typeof Vs.plugins.VsLayeredDisplay.VsLayeredDisplayInterface;
declare let VsMultiImageContainer: typeof Vs.plugins.VsLayeredDisplay.VsMultiImageContainer;
declare let VsDisplayImageConfig: typeof Vs.plugins.VsLayeredDisplay.VsDisplayImageConfig;


declare namespace PIXI{
  declare interface DisplayObject
  {
    readonly IsVsMultiImageContainer:  boolean|undefined;
  }
}