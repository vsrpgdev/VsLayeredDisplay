// #region RPG Maker MZ --------------------------------------------------------------------------
/*:
 * @target MZ
 * @plugindesc Version 1.0.1 plugin to display avatar pictures with changable elements (face, etc)
 * @author VsRpgDev
 * @url https://github.com/vsrpgdev/VsLayeredDisplay
 * @orderAfter VsContainer
 * @orderAfter VsConvertEscapeCharacters
 * @orderAfter VsUtils
 *
 * @help this plugin allows you to create configurations for layered multi image displays of sprites
 * for example for standing character arts (body,clothing, face, etc) or animated scenes
 * 
 * Its possible to use this plugin via scripts see the static class VsLayeredDisplayInterface, plugin commands
 * or through messages with a customizable escape character. all variants allow the usages of common placeholders like \N[x] or \P[x]
 * 
 * escape commands are (B is used as example character, <variables> are used for variables):
 * 
 * \B[!<displayId>]: removes the configuration for sprite <displayId>
 * \B[.<displayId>]: hides the sprite
 * \B[<displayId>,<visible>]: shows or hides the sprite <visible> is true or false
 * \B[<displayId>,<images>]: loads the images from <images> into display <displayId>
 *  <images> is a : sperated list of subImage ids and filenames to display (<id>:<filename>[!<subImage>]) [] is optinal
 *  example: \B[1,0:base-body:1:face:2:normal-clothes]
 * if your image file contains multiple subimages (tiles) you can specify the cols and rows in the displayConfig
 * and when you show the images use ! to select the sub image
 * example:
 *    \B[1,0:base-body!0:1:face!2:2:normal-clothes]
 * \B[<displayId>,<configName>,<images>]: creates displayId with preconfigured config configName and loads images
 * \B[<displayId>,<configName>,<images>,<flipImage>]: <flipImage> is true/false
 * \B[<displayId>,<configName>,<images>,<flipImage>,<opacity>]: opacity from 0 - 255
 * \B[<displayId>,<configName>,<images>,<flipImage>,<opacity>,<colorTone>]: colorTone = -255 - 255:-255 - 255:-255 - 255:0-255, red,green,blue,gray
 * 
 * B[
 * <displayId>: number - which display you want to select
 * <configName>: string - name of the configuration to use, you can leave this parameter empty to keep the previous configuration
 * <images>: list of images in the format <id>:<filename>[!<subImageId] example 0:body:1:face:2:clothing:3:effects!1
 * <flipImage>: boolean - should the display be flipped
 * <opacity>: number - opacity 0 - 255
 * <colorTone>: list of color values <red>:<green>:<blue>:<gray> - <-255-255>:<-255-255>:<-255-255>:<0-255>
 * ]
 * 
 * \B[M<displayId>,<x>,<y>] moves the sprite to x y
 * \B[S<displayId>,<x>,<y>] scales the sprite to x y
 * examples create sprite3 with config "example1" and opacity of 100 and a gray colortone
 * \B[3,example1,0:body:1:face,false,100,0:0:0:255]
 * change colorTone for display 
 * \B[2,,,false,255,150:0:0:0]
 * 
 * @param SmoothScaling
 * @text Smooth scaling
 * @type boolean
 * @desc switches between (false - nearest neighbor and / true - linear) -scaling
 * @default false
 * 
 * @param EnableMessageUse
 * @text Enable usage in Messages
 * @type boolean
 * @desc sets if a escaped character can be used to display pictures in message
 * @default true
 
 * @param AutoCreateInSceneBase
 * @text Autocreate in scene
 * @type boolean
 * @desc automatically creates a container in every scene to be used by the static methods and plugin commands
 * @default true
 * 
 * @param AutoCreateInWindowMessage
 * @text Autocreate in window
 * @type boolean
 * @desc automatically creates a container in the window_message
 * @default true
 * 
 * @param EscapeCharacter
 * @text Escape character
 * @type string
 * @desc Used escape character in message dialogs
 * @default B
 * 
 * @param DisplayConfig
 * @text display configuration
 * @type struct<VsLayeredDisplayConfig>[]
 * @desc array of display definitions to use in other commands
 * @default []
 * 
 * @param ChangeMessagePlacement
 * @text message placement
 * @type struct<Rect>
 * @desc position and size of the message window (-1 to dont change a value)
 * 
 * 
 * @command SelectContainerSource
 * @text select container source
 * @desc selects which container should be used for drawing(0 : scene, 1: message background, 2: message foreground)
 * @arg containerSource
 * @default 0
 * @type number
 * @min 0
 * @max 2
 * 
 * @command ClearDisplays
 * @text clear displays
 * @desc removes all displays
 * 
 * @command AddDisplay
 * @text add display (new configuration)
 * @desc creates a new display (overwrites existing one)
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg config
 * @type struct<VsLayeredDisplayConfig>
 * @desc display config
 * 
 * @command AddDisplayByName
 * @text add display by name (existing configuration)
 * @desc creates a new display with a named config (overwrites existing one)
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg configName
 * @type string
 * @desc display config name
 * 
 * 
 * 
 * @command ChangeMessagePlacement
 * @text change message placement
 * @help changes the position and size of the message window (0 - 1), set to -1 to dont change a value
 * example ChangeMessagePlacement(0.2,-1,0,8,-1) to only change x and width
 * @arg messagePlacement
 * @text message placement
 * @type struct<Rect>
 * 
 * @command RemoveDisplay
 * @text remove display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 *  
 * @command EnsureDisplay
 * @text ensures display is created with config
 * @desc if display does not exist, creates it with named config
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg configName
 * @type string
 * @desc creates display if not already existing
 * 
 * @command SetImage
 * @text set image
 * @arg displayId
 * @type number
 * @default 0
 * @desc sprite id from 0 - infinity
 * @arg imageId
 * @type number
 * @default 0
 * @desc id of the subimage (0 is the main image used for scaling)
 * @arg bitmap
 * @type string
 * @desc bitmap
 * @arg tileIndex
 * @type number
 * @default 0
 * @desc index from the grid
 * 
 * @command SetImages
 * @text set images
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg images
 * @type struct<ShowDisplay>[]
 * @desc images to set
 * 
 * @command SetImagesEx
 * @text set images extended
 * @arg displayId
 * @type number
 * @default 0
 * @desc sprite id from 0 - infinity
 * @arg configName
 * @type string
 * @desc image config name
 * @arg images
 * @type struct<ShowDisplay>[]
 * @desc images to set
 * @default []
 * @arg flipped
 * @text flipped
 * @type boolean
 * @default false
 * @desc flip image
 * @arg opacity
 * @type number
 * @desc opacity 0 - 255
 * @default 255
 * @min 0
 * @max 255
 * @arg colorTone
 * @type struct<ColorTone>
 * @desc color tone
 * @default {"r":0,"g":0,"b:0","gray":0}
 * 
 * @command ShowDisplay
 * @text show display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * 
 * @command HideDisplay
 * @text hide display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * 
 * @command FlipDisplay
 * @text flip display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg flipped
 * @type boolean
 * @default false
 * 
 * @command SetSmoothScaling
 * @text set smooth scaling
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg SmoothScaling
 * @type boolean
 * @default false
 * 
 * @command SetDisplayOpacity
 * @text set display opacity
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg opacity
 * @type number
 * @default 255
 * 
 * @command SetDisplayColorTone
 * @text set color tone for display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id from 0 - infinity
 * @arg colorTone
 * @type struct<ColorTone>
 * @desc color tone
 * 
 * @command MoveToDisplay
 * @text Move to display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id
 * @arg x
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * @arg y
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * 
 * @command MoveDisplay
 * @text Move display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id
 * @arg x
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * @arg y
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * 
 * 
 * @command RotateDisplay
 * @text Rotate Display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id
 * @arg degrees
 * @type number
 * 
 * @command ResizeDisplay
 * @text resize display
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id
 * @arg w
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * @arg h
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * 
 * @command SetPivot
 * @text Set pivot point
 * @arg displayId
 * @default 0
 * @type number
 * @desc sprite id
 * @arg x
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * @max 1
 * @arg y
 * @type number
 * @default 0
 * @decimals 6
 * @min 0
 * @max 1
 * 
 */

/*~struct~ColorTone:
 * @param r
 * @text Red
 * @type number
 * @default 0
 * @min -255
 * @param g
 * @text Green
 * @type number
 * @default 0
 * @min -255
 * @param b
 * @text Blue
 * @type number
 * @default 0
 * @min -255
 * @param gray
 * @text Gray
 * @type number
 * @default 0
 * @min 0
*/

/*~struct~ShowDisplay:
 * @param id
 * @text image id
 * @type number
 * @desc image id
 * @default 0
 * @min 0
 * 
 * @param tileIndex
 * @type number
 * @default 0
 * @desc index from the grid
 * @min 0
 * 
 * @param bitmap
 * @text bitmap 
 * @type string
 * @desc bitmap for image
*/


/*~struct~Point:
 * @param x
 * @text X
 * @type number
 * @decimals 6
 * @desc X position
 * @default 0
 * @min 0
 * 
 * @param y
 * @text Y
 * @type number
 * @decimals 6
 * @desc Y position
 * @default 0
 * @min 0
*/

/*~struct~VsDisplayImageConfig:
 * @param x
 * @text X
 * @type number
 * @decimals 6
 * @desc X position
 * @default 0
 * @min 0
 * 
 * @param y
 * @text Y
 * @type number
 * @decimals 6
 * @desc Y position
 * @default 0
 * @min 0
 * 
 * @param width
 * @text Width
 * @type number
 * @decimals 6
 * @desc width
 * @default -1
 * @min 0
 * 
 * @param height
 * @text Height
 * @type number
 * @decimals 6
 * @desc height
 * @default -1
 * @min 0
 * 
 * @param columns
 * @text columns
 * @type number
 * @desc number of columns inside the image
 * @default 1
 * @min 1
 * 
 * @param rows
 * @text rows
 * @type number
 * @desc number of rows inside the image
 * @default 1
 * @min 1
*/

/*~struct~Rect:
 * @param x
 * @text X
 * @type number
 * @decimals 6
 * @desc X position
 * @default -1
 * @min -1
 * 
 * @param y
 * @text Y
 * @type number
 * @decimals 6
 * @desc Y position
 * @default -1
 * @min -1
 * 
 * @param width
 * @text Width
 * @type number
 * @decimals 6
 * @desc width
 * @default -1
 * @min -1
 * 
 * @param height
 * @text Height
 * @type number
 * @decimals 6
 * @desc height
 * @default -1
 * @min -1
*/

/*~struct~VsLayeredDisplayConfig:
 * @param name
 * @text Name
 * @type string
 * @desc name of the image configuration
 * 
 * @param imageFrame
 * @text image frame
 * @type struct<VsDisplayImageConfig>
 * @default {"x":"0.000000","y":"0.000000","width":"1.000000","height":"1.000000"}
 * @desc position and size of the image from 0 - 1
 * 
 * @param pivot
 * @text pivot
 * @type struct<Point>
 * @default {"x":"0.000000","y":"0.000000"}
 * @desc pivot position  of the image from 0 - 1
 * 
 * @param subImageCoordinates
 * @text Sub-Image Koordinaten
 * @type struct<VsDisplayImageConfig>[]
 * @default []
 * @desc positions and size of subimages in px
 * 
 * @param autoScale
 * @text scale settings
 * @type select
 * @option fill
 * @option contain
 * @option cover
 * @option x
 * @option y
 * @option none
 * @default none
 * 
 * @param verticalAlign
 * @text vertical align
 * @type select
 * @option top
 * @option bottom
 * @option middle
 * @default middle
 * 
 * @param horizontalAlign
 * @text horizontal align
 * @type select
 * @option left
 * @option right
 * @option center
 * @default center
 * 
 * @param clippingEnabled
 * @text Clipping aktiviert
 * @type boolean
 * @default false
 * @desc enable or disable clipping
 */
// #endregion RPG Maker MZ --------------------------------------------------------------------------

//@ts-ignore ---------------- Header line for all VsRpgDev Plugins, create the global VsRpgDev object -------------
"undefined"==typeof Vs&&(Vs={get author(){return"VsRpgDev"}, get isVsRpgDev(){return"VsRpgDev"==Vs.author}, plugins:{}, c(m,...p){ p.filter(x => { const v=x.split("."); const found = Object.entries(Vs.plugins).some(p => p[1].PluginName == v[0] && (v.length < 2 || v[1]==p[1].Version[0])&& (v.length < 3 || v[2]<=p[1].Version[1]));    return !found;   }).forEach(e => {throw new Error(`${m} Error: plugin '${e}' not found or wrong version`)}); } });


(() => {

  const pluginName = "VsLayeredDisplay";
  Vs.c(pluginName,"VsConvertEscapeCharacters.1.2","VsUtils.1.2","VsContainer.1.1");

  // @ts-ignore
  if (window.VsContainer == undefined)
  {
    // @ts-ignore
    VsContainer = Sprite;
  }
  
  class CustomRect extends Rectangle
  {
    /**
     * 
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [width]
     * @param {number} [height]
     */
    constructor(x,y,width,height)
    {
      if (x == undefined) x = -1;
      if (y == undefined) y = -1;
      if (width == undefined) width = -1;
      if (height == undefined) height = -1;
      super(x,y,width,height);
    }
  }
  
//#region plugin configurations --------------------------------------------------------------------------

  const parameters = PluginManager.parameters(pluginName);
  const escapeCharacter = parameters["EscapeCharacter"] || "B";
  const enableMessageUse = (parameters["EnableMessageUse"] || "true") != "false";
  const smoothScaling = (parameters["SmoothScaling"] || "false") != "false";
  const AutoCreateInSceneBase = (parameters["AutoCreateInSceneBase"] || "true") != "false";
  const AutoCreateInWindowMessage = (parameters["AutoCreateInWindowMessage"] || "true") != "false";

  /**
   * @type {CustomRect}
   */
  let _changeMessagePlacement = Vs.Utils.pluginParameterToObject(CustomRect,JSON.parse(parameters["ChangeMessagePlacement"]));
  
//#endregion plugin configurations --------------------------------------------------------------------------

//#region global Classes --------------------------------------------------------------------------

  class VsDisplayImageConfig
  {
    /**
     * 
     * @param {number} [x] 
     * @param {number} [y] 
     * @param {number} [width]
     * @param {number} [height] 
     * @param {number} [columns] 
     * @param {number} [rows] 
     */
    constructor(x,y,width,height, columns, rows)
    {
      this.x = x ?? 0;
      this.y = y ?? 0;
      this.width = width ?? 0;
      this.height = height ?? 0;

      this.columns = columns ?? 1;
      this.rows = rows ?? 1;
    }

    /**@type {number} */
    x;
    /**@type {number} */
    y;
    /**@type {number} */
    width;
    /**@type {number} */
    height;

    /**@type {number} */
    columns;

    /**@type {number} */
    rows;
  }
  
  /**
   * configuration class for images
   */
  class VsLayeredDisplayConfig
  {
    constructor()
    {
      Vs.Utils.arrayInstanceProxy(VsDisplayImageConfig,this,"subImageCoordinates");
    }
    /**
     * name of the configuration
     * @type {string} 
     */
    name;

    /** image position and size (0-1)
     * @type {VsDisplayImageConfig} 
     * */
    imageFrame = new VsDisplayImageConfig(0,0,-1,-1);
    
    /** image position and size (0-1)
     * @type {Point} 
     * */
    pivot = new Point(0,0);

    /** position and size of subimage (in px)
     * @type {VsDisplayImageConfig[]} 
     * */
    subImageCoordinates = [];

    /** scales the image to the containing box
     * fill - image get stretched to fill the box width and height
     * contain - image keeps aspect ratio and scales to min(width,height)
     * cover - image keeps aspect ratio and scales to max(width,height)
     * x image scales to 100% width of the box
     * y image scales to 100% height of the box
     * none - images doesn't get scaled
     * @type{"fill"|"contain"|"cover"|"x"|"y"|"none"} 
     * 
     * */
    autoScale = "fill";

    /** how the image should be aligned inside the box
     * @type{"top"|"bottom"|"middle"} 
     * */
    verticalAlign = "middle";
    /**  how the image should be aligned inside the box
     * @type{"left"|"right"|"center"} 
     * */
    horizontalAlign = "center";

    /** should image be clipped if outside of box
     * @type{boolean}
     *  */
    clippingEnabled = false;
  }
  
  /** ---------------------------------------------------------------------- VsLayeredDisplay -------------------------------------------
   * @description global static class to interact with the modular avatar images
   */
  class VsLayeredDisplayInterface
  {
    /**
     * returns the current image container inside the active scene
     * @returns {VsMultiImageContainer|undefined}
     */
    static #_getCurrentContainer()
    {
      let container = [_currentContainer,_currentMessageBackgroundContainer, _currentMessageForegroundContainer][_selectedContainerSource];
      if (container == undefined) 
      {
        throw new Error("VsLayeredDisplay: CurrentContainer is undefined");
      }
      return container;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    static ChangeMessagePlacement(x,y,width,height){
      _changeMessagePlacement = new CustomRect(x,y,width,height);
    }
    /**
     * 
     * @param {0|1|2} source 
     */
    static SelectContainerSource(source)
    {
      // @ts-ignore
      _selectedContainerSource = Math.max(Math.min(source,2),0);
    }
    
    /** removes the image with displayId 
     * @param {number} displayId 
     *  */
    static RemoveDisplay(displayId)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.RemoveDisplay(displayId);
    }

    static ClearDisplays()
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.ClearDisplays();
    }

    /**
     * @param {number} displayId 
     * @param {VsLayeredDisplayConfig|string} config 
     *  */
    static AddDisplay(displayId, config)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.AddDisplay(displayId, config);
    }

    /**
     * @param {number} displayId 
     * @param {boolean} flipped - Whether to flip the image horizontally.
     *  */
    static FlipDisplay(displayId, flipped)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.SetFlipped(displayId, flipped);
    }
    /**
     * @param {number} displayId 
     * @param {boolean} smooth - Whether smooth scaling is activated or noth
     *  */
    static SetSmoothScaling(displayId, smooth)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.SetSmoothScaling(displayId, smooth);
    }
    
    /**
     * @param {number} displayId 
     * @param {number} opacity  
     *  */
    static SetDisplayOpacity(displayId, opacity)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.SetDisplayOpacity(displayId, opacity);
    }


    /**
     * @param {number} displayId 
     * @param {string} configName 
     *  */
    static EnsureDisplay(displayId, configName)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.EnsureDisplay(displayId, configName);
    }


    /**
     * 
     * @param {number} displayId 
     * @param {number} imageId 
     * @param {Bitmap|string} bitmap 
     * @param {number} [tileIndex] 
     */
    static SetImage(displayId, imageId, bitmap, tileIndex)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.SetImage(displayId,imageId, bitmap, tileIndex);
    }
    /**
     * 
     * @param {number} displayId 
     * @param {{id:number, bitmap:Bitmap|string, tileIndex:number}[]} images 
     */
    static SetImages(displayId, images)
    {
      VsLayeredDisplayInterface.#_getCurrentContainer()?.SetImages(displayId,images);
    }

    /**
     * 
     * @param {number} displayId 
     */
    static ShowDisplay(displayId) { VsLayeredDisplayInterface.#_getCurrentContainer()?.ShowDisplay(displayId); }

    /**
     * 
     * @param {number} displayId 
     * @param {number} x 
     * @param {number} y 
     */
    static MoveToDisplay(displayId,x,y) 
    { 
      VsLayeredDisplayInterface.#_getCurrentContainer()?.MoveToDisplay(displayId,x,y); 
    }
    /**
     * 
     * @param {number} displayId 
     * @param {number} x 
     * @param {number} y 
     */
    static MoveDisplay(displayId,x,y) 
    { 
      VsLayeredDisplayInterface.#_getCurrentContainer()?.MoveDisplay(displayId,x,y); 
    }

    /**
     * 
     * @param {number} displayId 
     * @param {number} degrees 
     */
    static RotateDisplay(displayId,degrees) 
    { 
      VsLayeredDisplayInterface.#_getCurrentContainer()?.RotateDisplay(displayId,degrees); 
    }

    /**
     * 
     * @param {number} displayId 
     * @param {number} x 
     * @param {number} y 
     */
    static SetPivot(displayId,x,y) { VsLayeredDisplayInterface.#_getCurrentContainer()?.SetPivot(displayId,x,y); }
    
    /**
     * 
     * @param {number} displayId 
     * @param {number} w
     * @param {number} h 
     */
    static ResizeDisplay(displayId,w,h) { VsLayeredDisplayInterface.#_getCurrentContainer()?.ResizeDisplay(displayId,w,h); }

    
    /**
     * 
     * @param {number} displayId 
     */
    static HideDisplay(displayId) { VsLayeredDisplayInterface.#_getCurrentContainer()?.HideDisplay(displayId); }

    /**
     * 
     * @param {number} displayId 
     * @param {[number,number,number,number]} colorTone 
     */
    static SetDisplayColorTone(displayId,colorTone) { VsLayeredDisplayInterface.#_getCurrentContainer()?.SetDisplayColorTone(displayId, colorTone); }

    /**
     * 
     * @param {number} displayId 
     * @param {string} configName 
     * @param {{id:number, bitmap:Bitmap|string, tileIndex:number}[]} images 
     * @param {boolean|string} [flipped]
     * @param {number|string} [opacity]
     * @param {[number,number,number,number]} [colorTone] 
     */
    static SetImagesEx(displayId,configName, images,flipped,opacity, colorTone)
    {
      let container = VsLayeredDisplayInterface.#_getCurrentContainer();
      container?.EnsureDisplay(displayId,configName);
      container?.SetImages(displayId,images);
      if (flipped != undefined && flipped != "")
        container?.SetFlipped(displayId,flipped);
      if (opacity != undefined && opacity != "")
        container?.SetDisplayOpacity(displayId,opacity);
      if (colorTone != undefined && Array.isArray(colorTone))
        container?.SetDisplayColorTone(displayId,colorTone);
    }
    /**
     * @type  { VsMultiImageContainer|undefined}
     * @readonly
     *  */
    static get CurrentContainer() {return _currentContainer;}

    /**
     * @type  { VsMultiImageContainer|undefined}
     * @readonly
     *  */
    static get CurrentMessageBackgroundContainer() {return _currentMessageBackgroundContainer;}

    /**
     * @type  { VsMultiImageContainer|undefined}
     * @readonly
     *  */
    static get CurrentMessageForegroundContainer() {return _currentMessageForegroundContainer;}
  }

  /**
   * @extends {VsContainer}
   */
  class VsMultiImageContainer extends VsContainer
  {
    /**@param {Rectangle} [rectangle]  */
    constructor(rectangle)
    {
      super(rectangle);
      this.width = Graphics.width;
      this.height = Graphics.height;
    }

    get IsVsMultiImageContainer(){return true;}
    
    /**
     * Removes all internal references and listeners as well as removes children from the display list.
     * Do not use a Container after calling `destroy`.
     *
     * @param {object} [options] - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
     *  method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the texture of the child sprite
     * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the base texture of the child sprite
     */
    destroy(options)
    {
      
      if (!options)
        options = { children: true, texture: true };

      super.destroy(options);
      if (_currentContainer == this)
        _currentContainer = undefined;

      if (_currentMessageBackgroundContainer == this)
        _currentMessageBackgroundContainer = undefined;

      if (_currentMessageForegroundContainer == this)
        _currentMessageForegroundContainer = undefined;
      
    }

    /**
     * @param {number} displayId 
     *  */
    RemoveDisplay(displayId)
    {
      if (displayId < 0) displayId = 0;

      if (this.Images[displayId])
      {
        this.removeChild(this.Images[displayId]);
        this.Images[displayId].destroy()
        delete this.Images[displayId];

      }
    }

    ClearDisplays()
    {
      this.Images.forEach((d,index) => {
        if (d != undefined)
          this.RemoveDisplay(index);
      });
    }

    /**
     * @param {number} displayId 
     * @param {VsLayeredDisplayConfig|string} config 
     *  */
    AddDisplay(displayId, config)
    {
      if (displayId < 0) displayId = 0;

      let newImage;
      if (typeof(config) == "string")
      {
        config = VsConvertEscapeCharacters.convertEscapeCharacters(config);
        config =  getNamedMultiImageConfig(config);
      }

      newImage = new VsLayeredDisplayContainer(config);

      if (this.Images[displayId])
      {
        this.removeChild(this.Images[displayId]);
        this.Images[displayId].destroy()

      }
      this.Images[displayId] = newImage;
      this.addChild(newImage);
    }
    /**
     * @param {number} displayId 
     * @param {string} configName 
     *  */
    EnsureDisplay(displayId, configName)
    {
      if (displayId < 0) displayId = 0;
      if (this.Images[displayId] && this.Images[displayId].Config.name == configName) {
        return;
      };
      this.AddDisplay(displayId, configName);
    }

    SetImage(displayId, imageId, bitmap, index)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      found = this.Images[displayId];

      found.ShowImage(imageId,bitmap, index);
    }

    /**
     * 
     * @param {number} displayId 
     * @param {{id:number, bitmap:Bitmap|string, tileIndex:number}[]} images 
     */
    SetImages(displayId, images)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      found = this.Images[displayId];

      found.ShowImages(images);
    }

    ShowDisplay(displayId)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        return;
      }
      found = this.Images[displayId];

      found.show();
    }

    HideDisplay(displayId)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      found = this.Images[displayId];

      found.hide();
    }

    SetFlipped(displayId, flipped)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      found = this.Images[displayId];

      found.Flipped = flipped;
    }

    SetSmoothScaling(displayId, smooth)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      found = this.Images[displayId];

      found.ImageSmoothingEnabled = smooth;
    }

    /**
     * 
     * @param {number} displayId 
     * @param number} opacity 
     */
    SetDisplayOpacity(displayId, opacity)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      found = this.Images[displayId];

      found.opacity = Number(opacity);
    }
    
    /**
     * 
     * @param {number} displayId 
     * @param {number} x 
     * @param {number} y 
     */
    MoveToDisplay(displayId, x,y)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      this.Images[displayId].MoveToDisplay(x,y);
    }

    /**
     * 
     * @param {number} displayId 
     * @param {number} x 
     * @param {number} y 
     */
    MoveDisplay(displayId, x,y)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      this.Images[displayId].MoveDisplay(x,y);
    }

    /**
     * 
     * @param {number} displayId 
     * @param {number} degrees 
     */
    RotateDisplay(displayId, degrees)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      this.Images[displayId].Rotate(degrees);
    }
    
    SetPivot(displayId, x,y)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      this.Images[displayId].SetPivot(x,y);
    }

    ResizeDisplay(displayId, width,height)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      this.Images[displayId].ResizeDisplay(width,height);
    }

    /**
     * 
     * @param {number} displayId 
     * @param {[number,number,number,number]} colorTone 
     */
    SetDisplayColorTone(displayId, colorTone)
    {
      let found = this.Images[displayId];

      if (found == undefined)
      {
        this.AddDisplay(displayId,null)
      }
      found = this.Images[displayId];

      found.setColorTone(colorTone)
    }


    /**@type {VsLayeredDisplayContainer[]} */
    Images = [];
  }
  
  /** ------------------------------------------------------------------ VsLayeredDisplayContainer ---------------------------------------------------------------------------
   * @extends {VsContainer}
   */
  class VsLayeredDisplayContainer extends VsContainer
  {

    static #_counter =0;
    #_id =0;

    /**
     * @type {boolean}
     */
    #_imageSmoothingEnabled = smoothScaling;

    get ImageSmoothingEnabled(){
      return this.#_imageSmoothingEnabled;
    }

    set ImageSmoothingEnabled(value){
      if (value == this.#_imageSmoothingEnabled)
        return;

      this.#_imageSmoothingEnabled = value;
      if (!this.#_bitmap) return;
      this.#_bitmap.smooth = this.#_imageSmoothingEnabled;

      this.#drawBitmaps();
    }

    /**
     * init main container, creates bitmap
     * @param {Bitmap} bitmap 
     */
    #initMainContainer(bitmap)
    {
      if (bitmap == undefined) return;

      if (this.#_bitmap && this.#_bitmap.width != bitmap.width && this.#_bitmap.height != bitmap.height)
      {
          this.#_bitmap.destroy();
          this.#_bitmap = undefined;
      }

      if (!this.#_bitmap)
      {
        this.#_bitmap = new Bitmap(bitmap.width,bitmap.height);
        this.#_bitmap.smooth = this.#_imageSmoothingEnabled;

        this.#_childSprite.bitmap = this.#_bitmap;
        //reset pivot after bitmap change
        //this.#_childSprite.pivot.x = this.#_flipped ? this.#_mainImageSize.width ?? 0 : 0  ;
      }
      this.#_bitmap.clear();
    }


    /**
     * 
     * @param {number} index 
     * @param {number} rows 
     * @param {number} columns 
     * @param {number} width 
     * @param {number} height 
     * @returns {{x: number, y: number, width: number, height: number}} 
     */
    #getImageCoordinates(index,rows,columns,width,height)
    {
      width = width / columns;
      height = height / rows;

      return {
        x: (index==0) ? 0 :(index % columns ) * width ,
        y: (index==0) ? 0 :(Math.floor(index / rows ) * height),
        width: width,
        height: height
      }
    }

    #drawBitmaps()
    {
      if (!this.#_bitmap)
        return;

      this.#_bitmap.clear();

      let oldSmoothing = this.#_bitmap.context.imageSmoothingEnabled;
      this.#_bitmap.context.imageSmoothingEnabled = this.#_imageSmoothingEnabled;
      try
      {
        for(let i =0; i < this.#_subBitmap.length; i++)
        {
          let bitmap = this.#_subBitmap[i];

          if (bitmap == undefined) continue;

          bitmap.smooth = this.#_imageSmoothingEnabled;
          if (i == 0)
          {
            let columns = this.Config?.imageFrame?.columns ?? 1
            let rows = this.Config?.imageFrame?.rows ?? 1
            let index = this.#_subBitmapIndex[i] ?? 0;
            let coordinates  = this.#getImageCoordinates(index,rows,columns,bitmap.width,bitmap.height );


            this.#_bitmap.blt(bitmap,coordinates.x,coordinates.y,coordinates.width,coordinates.height,0,0,this.#_mainImageSize.width,this.#_mainImageSize.height);
            continue;
          }
          let config = (this.#_config.subImageCoordinates ?? [])[i-1] ?? new VsDisplayImageConfig(0,0,bitmap.width,bitmap.height,1,1);
          
          let columns = config.columns ?? 1
          let rows = config.rows ?? 1
          let index = this.#_subBitmapIndex[i] ?? 0;
          let coordinates  = this.#getImageCoordinates(index,rows,columns,bitmap.width,bitmap.height );


          let width = config.width>0 ? config.width : coordinates.width;
          let height = config.height>0 ? config.height : coordinates.height;

          this.#_bitmap.blt(bitmap,coordinates.x,coordinates.y,coordinates.width,coordinates.height,config.x,config.y,width,height);
        }
      }
      finally
      {
        this.#_bitmap.context.imageSmoothingEnabled = this.#_bitmap.context.imageSmoothingEnabled;
      }
    }

    /**@type {Bitmap|undefined} */
    #_bitmap;


    /**
     * @type {Bitmap}
     */
    get MainBitmap(){
      return this.#_bitmap;
    }

    /**@type {(Bitmap|undefined)[]} */
    #_subBitmap = [];

    /**@type {(number|undefined)[]} */
    #_subBitmapIndex = [];


    /**@param {VsLayeredDisplayConfig} config  */
    constructor(config)
    {
      super();
      this.#_id = ++VsLayeredDisplayContainer.#_counter;
      console.debug(`VsLayeredDisplayContainer::constructor[${this.#_id}]`);


      if (config)
        config = JSON.parse(JSON.stringify(config));
      else
        config = new VsLayeredDisplayConfig()

      config.imageFrame = config.imageFrame ?? new VsDisplayImageConfig(0,0,1,1,1,1);

      this.#_config = config;

      this.mask = this.#_mask;

      this.addChild(this.mask);
      this.#_childSprite = new Sprite();

      this.addChild(this.#_childSprite);
      this.resizeChildren();

    }



    /** @returns {VsLayeredDisplayConfig} */
    get Config(){return this.#_config;}


    /**@type {boolean} */
    #_flipped = false;

    get Flipped() {return this.#_flipped;}
    set Flipped(value) {if (value == this.#_flipped) {return}; this.#_flipped = value; this.resizeChildren()}

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    MoveToDisplay(x,y)
    {
      this.#_config.imageFrame.x = x;
      this.#_config.imageFrame.y = y;
      this.resizeChildren();
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    MoveDisplay(x,y)
    {
      this.#_config.imageFrame.x += x;
      this.#_config.imageFrame.y += y;
      this.resizeChildren();
    }
    
    
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    SetPivot(x,y)
    {
      if (this.#_config.pivot == undefined)
        this.#_config.pivot = new Point(0,0);
      this.#_config.pivot.x = x;
      this.#_config.pivot.y = y;
      this.resizeChildren();
    }

    ResizeDisplay(width,height)
    {
      this.#_config.imageFrame.width = Number(width);
      this.#_config.imageFrame.height = Number(height);
      this.resizeChildren();
    }


    #_mainImageSize = new Rectangle(0,0,0,0);

    /**
     * 
     * @param {number} id 
     * @param {Bitmap|string} bitmap 
     * @param {number} [index]
     */
    ShowImage(id, bitmap,index)
    {
      this.#ShowImageInternal(id, bitmap,index);
    }

    /**
     * 
     * @param {{id:number,tileIndex:number, bitmap:Bitmap|string}[]} images 
     */
    ShowImages(images)
    {
      images.forEach(i => this.#ShowImageInternal(i.id, i.bitmap, i.tileIndex));
    }

    /**
     * 
     * @param {number} deg 
     */
    Rotate(deg)
    {
      this.rotation = Vs.Math.degToRad(deg);
    }

    /**
     * 
     * @type {number}  
     */
    get rotationDeg()
    {
      return Vs.Math.radToDeg(this.rotation);
    }

    /**
     * 
     * @param {number} id 
     * @param {Bitmap|string} bitmap 
     * @param {number} [index] index of the grid
     */
    #ShowImageInternal(id, bitmap, index)
    {
      if (!this.visible) this.show();
      if (typeof(bitmap) == "string")
      {
        if (bitmap == "")
        {
          bitmap=undefined;
        }
        else
        {
          bitmap = VsConvertEscapeCharacters.convertEscapeCharacters(bitmap) ?? bitmap;

          // @ts-ignore
          bitmap  = ImageManager.loadPicture(bitmap);
        }
      }

      // @ts-ignore
      console.debug("VsLayeredDisplayContainer::ShowImageInternal["+this.#_id+"](id: "+id+", id: "+(bitmap?.url ?? bitmap)+")");

      if (id < 0) throw new Error("image id is below 0");

      let indexChanged = false;
      if (index)
      {
        this.#_subBitmapIndex[id] = index;
        indexChanged=true;
      }
      else
      {
        this.#_subBitmapIndex[id] = 0;
        indexChanged=true;
      }


      if (this.#_subBitmap[id] == bitmap) 
      {
        if (indexChanged)
          this.#drawBitmaps();
        return;
      }

      if (id > 0)
      {
        let config  = this.#_config.subImageCoordinates[id-1];

        if (bitmap == null)
        {
          this.#_subBitmap[id] = undefined;
          this.#drawBitmaps();
          return;
        }
        // @ts-ignore
        this.#_subBitmap[id] = bitmap;
        // @ts-ignore
        if (bitmap.width > 0)
        {
          this.#drawBitmaps();
        }
        else
        {
          // @ts-ignore
          bitmap.addLoadListener((b)=>{
            if (this.#_destroyed) return;
            this.#drawBitmaps();
          });
        }
        return;
      }
      if (bitmap == null)
      {
        this.#_subBitmap[0] = undefined;
        this.#drawBitmaps();
        return;
      }
      // @ts-ignore
      if (bitmap.width > 0)
      {
        // @ts-ignore
        console.debug("VsLayeredDisplayContainer::ShowImageInternal["+this.#_id+"](id: "+id+", id: "+(bitmap?.url ?? bitmap)+") bitmap already loaded ("+bitmap.width+"x"+bitmap.height+")");
        
        // @ts-ignore
        this.#mainBitmapUpdated(bitmap);
      }
      else
      {
        
        // @ts-ignore
        bitmap.addLoadListener((b) => {
          if (this.#_destroyed) return;
          // @ts-ignore
          console.debug("VsLayeredDisplayContainer::ShowImageInternal:addLoadListener["+this.#_id+"](id: "+id+", id: "+(bitmap.url ?? bitmap)+") addLoadListener ("+bitmap.width+"x"+bitmap.height+")");
          
          this.#mainBitmapUpdated(b);
        });
      }
    }

    /**
     * 
     * @param {Bitmap} bitmap 
     */
    #mainBitmapUpdated(bitmap)
    {
      if (bitmap)
      {
        this.#_mainImageSize.width = bitmap.width / (this.Config?.imageFrame?.columns ?? 1);
        this.#_mainImageSize.height = bitmap.height / (this.Config?.imageFrame?.rows ?? 1);
        
        this.#initMainContainer(bitmap);
        this.#_subBitmap[0] = bitmap;
        this.resizeChildren();
      }
      this.#drawBitmaps();
    }

    /**@type {Sprite} */
    #_childSprite;

    
    #_mask = new PIXI.Graphics();
    /**
     * Removes all internal references and listeners as well as removes children from the display list.
     * Do not use a Container after calling `destroy`.
     *
     * @param {object} [options] - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
     *  method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the texture of the child sprite
     * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
     *  Should it destroy the base texture of the child sprite
     */
    destroy(options)
    {
      if (this.#_destroyed) return;

      this.#_mask.destroy();

      if (this.#_bitmap)
        this.#_bitmap.destroy();

      this.#_destroyed = true;

      if (!options)
        options = { children: true, texture: true };

      super.destroy(options);
    }

    /**
     * @type {boolean}
     */
    #_destroyed = false;

    updateMask(targetWidth,targetHeight)
    {
      if (!this.#_config.clippingEnabled)
      {
        this.mask = null;
        return;
      }
      this.#_mask.clear();
  
      this.#_mask.beginFill(0x000000);  // Die Maske wird vollständig undurchsichtig
      
      let x = this.#_config.imageFrame.x*Graphics.width
      let y = this.#_config.imageFrame.y*Graphics.height

      x -= (this.#_config.pivot?.x ?? 0) * targetWidth;
      y -= (this.#_config.pivot?.y ?? 0) * targetHeight;

      this.#_mask.drawRect(0,0, targetWidth, targetHeight);
      this.#_mask.endFill();
      this.mask = this.#_mask;
      
      console.debug(`VsLayeredDisplayContainer::updateMask[${this.#_id}]() x: ${this.#_config.imageFrame.x}, y: ${this.#_config.imageFrame.x*Graphics.height}`+
        `w: ${targetWidth}, h: ${targetHeight}`
      );
    }

    #adjustPosition(oScaleX, oScaleY, scaleX,scaleY, targetWidth,targetHeight) {
      
      this.x = this.#_config.imageFrame.x * Graphics.width;
      this.y = this.#_config.imageFrame.y * Graphics.height;
      
      this.pivot.x = (this.#_config.pivot?.x ?? 0)*targetWidth/scaleX;
      this.pivot.y = (this.#_config.pivot?.y ?? 0)*targetHeight/scaleY;

      let propSize = {w:this.#_mainImageSize.width*oScaleX,h:this.#_mainImageSize.height*oScaleY};

      let diffSize = {
        w:propSize.w - this.#_mainImageSize.width*scaleX,
        h:propSize.h - this.#_mainImageSize.height*scaleY,
      }

      switch (this.#_config.horizontalAlign)
      {
        case "left":
          this.#_childSprite.x=0;
          break;
        case "center":
          this.#_childSprite.x = (diffSize.w/2)/scaleX;
          break;
        case "right":
          this.#_childSprite.x = diffSize.w/scaleX;
          break;
      }
      switch (this.#_config.verticalAlign)
      {
        case "top":
          this.#_childSprite.y=0;
          break;
        case "middle":
          this.#_childSprite.y = (diffSize.h/2)/scaleY;
          break;
        case "bottom":
          this.#_childSprite.y = diffSize.h/scaleY;
          break;
      }

      if (this.#_flipped)
        this.#_childSprite.x += this.#_mainImageSize.width;
    }

    /**
     * recalculates positions and scale of container
     */
    resizeChildren()
    {
      
      console.debug(`VsLayeredDisplayContainer::resizeChildren[${this.#_id}]()`);

      let targetWidth = 0;
      let targetHeight = 0;
      if (this.#_config.imageFrame.width > 0)
        targetWidth = this.#_config.imageFrame.width*Graphics.width;
      else
        targetWidth = this.#_subBitmap[0]?.width ?? Graphics.width;
      
      if (this.#_config.imageFrame.height > 0)
        targetHeight = this.#_config.imageFrame.height*Graphics.height;
      else
        targetHeight = this.#_subBitmap[0]?.height ?? Graphics.height;

      if (Math.min(this.#_mainImageSize.width,this.#_mainImageSize.height) < 1 ) return;

      let scaleX = targetWidth / this.#_mainImageSize.width;
      let scaleY = targetHeight / this.#_mainImageSize.height;


      if (this.#_config.autoScale == "none")
      {
        scaleX = 1;
        scaleY = 1;
      }

      if (this.#_config.autoScale == "contain")
      {
        scaleX = Math.min(scaleX,scaleY); scaleY = Math.min(scaleY,scaleX);
      }
      else if (this.#_config.autoScale == "cover")
      {
        scaleX = Math.max(scaleX,scaleY); scaleY = Math.max(scaleY,scaleX);
      }
      else if (this.#_config.autoScale == "x")
      {
        scaleY = scaleX;
      }
      else if (this.#_config.autoScale == "y")
      {
        scaleX = scaleY;
      }

      this.scale.x = scaleX; this.scale.y = scaleY;

      this.#adjustPosition(targetWidth / this.#_mainImageSize.width,targetHeight / this.#_mainImageSize.height, scaleX,scaleY, targetWidth,targetHeight);

      if (this.#_flipped)
      {
        this.#_childSprite.scale.x =-1
      }
      else
      {
        this.#_childSprite.scale.x =1
      }

      this.updateMask(targetWidth/scaleX,targetHeight/scaleY);
    }

    /**@type {VsLayeredDisplayConfig}  */
    #_config;
    
  }

  let VsLayeredDisplay = {
    
    VsDisplayImageConfig : VsDisplayImageConfig,
    VsLayeredDisplayConfig: VsLayeredDisplayConfig,
    VsLayeredDisplayInterface: VsLayeredDisplayInterface,
    VsMultiImageContainer: VsMultiImageContainer,
    VsLayeredDisplayContainer: VsLayeredDisplayContainer,


    get PluginName () {return pluginName},
    get Version () {return [1,0, 1]}

  }

  window.VsLayeredDisplay = VsLayeredDisplay;
  window.VsDisplayImageConfig = VsDisplayImageConfig;
  window.VsLayeredDisplayConfig = VsLayeredDisplayConfig;
  window.VsLayeredDisplayInterface = VsLayeredDisplayInterface;
  window.VsMultiImageContainer = VsMultiImageContainer;
  window.VsLayeredDisplayContainer = VsLayeredDisplayContainer;

//#endregion

//#region internal Classes,Methods and variables ---------------------------------------------------
  /** @type {VsMultiImageContainer|undefined} */
  let _currentContainer;

  /** @type {VsMultiImageContainer|undefined} */
  let _currentMessageBackgroundContainer;
  /** @type {VsMultiImageContainer|undefined} */
  let _currentMessageForegroundContainer;

  /** @type {0|1|2} */
  let _selectedContainerSource = 0;

  /** 
   * @type {Object.<string, VsLayeredDisplayConfig>}
   */
  let _namedMultiImageConfig =  {};

  function LoadConfigFromParamters()
  {
    let configFromParamters = Vs.Utils.jsonParseRecursive((parameters["DisplayConfig"] || []));
    
    [...configFromParamters,...window.VsLayeredDisplayJson].forEach(v => {
      _namedMultiImageConfig[v.name] = {
        name: v.name,
        autoScale : v.autoScale,
        clippingEnabled : v.clippingEnabled,
        horizontalAlign : v.horizontalAlign,
        imageFrame : v.imageFrame,
        subImageCoordinates: v.subImageCoordinates,
        verticalAlign: v.verticalAlign,
        pivot: v.pivot
      }
    });
    window.VsLayeredDisplayJson.push(...configFromParamters);
}

  class AddDisplayArgs
  {
    constructor(){
      Vs.Utils.instanceProxy(VsLayeredDisplayConfig,this,"config");

      this.config = new VsLayeredDisplayConfig();
    }
    displayId = 0
    config = null
  }
  Vs.System.registerCommandTyped(pluginName, 'AddDisplay',AddDisplayArgs, args => {
    VsLayeredDisplayInterface.AddDisplay(args.displayId,args.config);
  });

  class SelectContainerSourceArgs
  {
    /**@type {0|1|2} */
    #_containerSource=0;
    get containerSource(){return this.#_containerSource;}
    
    // @ts-ignore
    set containerSource(value){if (isNaN(value)) {return}; this.#_containerSource = Math.max(Math.min(value,2),0);}
  }
  Vs.System.registerCommandTyped(pluginName, 'SelectContainerSource',SelectContainerSourceArgs, args => {
    
    VsLayeredDisplayInterface.SelectContainerSource(args.containerSource);
  });

  PluginManager.registerCommand(pluginName, 'ClearDisplays', args => {
    VsLayeredDisplayInterface.ClearDisplays();
  });
  

  class AddDisplayByNameArgs
  {
    displayId = 0
    configName = ""
  }
  Vs.System.registerCommandTyped(pluginName, 'AddDisplayByName',AddDisplayByNameArgs, args => {
    VsLayeredDisplayInterface.AddDisplay(args.displayId,args.configName);
  });
  


  class ChangeMessagePlacementArgs
  {
    constructor(){
      Vs.Utils.instanceProxy(CustomRect,this,"messagePlacement");
    }
    /**@type{CustomRect} */
    messagePlacement;
  }
  PluginManager.registerCommand(pluginName, 'ChangeMessagePlacement', args => {
    let argsObj = Vs.Utils.pluginParameterToObject(ChangeMessagePlacementArgs,args);
    VsLayeredDisplayInterface.ChangeMessagePlacement(argsObj.messagePlacement.x,argsObj.messagePlacement.y,argsObj.messagePlacement.width,argsObj.messagePlacement.height);
  });
  

  class RemoveDisplayArgs
  {
    displayId = 0
  }
  PluginManager.registerCommand(pluginName, 'RemoveDisplay', args => {
    let argsObj = Vs.Utils.pluginParameterToObject(RemoveDisplayArgs,args);
    VsLayeredDisplayInterface.RemoveDisplay(argsObj.displayId);
  });



  class EnsureDisplayArgs
  {
    displayId = 0
    configName = ""
  }
  PluginManager.registerCommand(pluginName, 'EnsureDisplay', args => {
    let argsObj = Vs.Utils.pluginParameterToObject(EnsureDisplayArgs,args);

    VsLayeredDisplayInterface.EnsureDisplay(argsObj.displayId,argsObj.configName);

  });

  class SetImageArgs
  {
    displayId = 0
    configName = ""
    imageId = 0
    bitmap = ""
    tileIndex=0
  }
  PluginManager.registerCommand(pluginName, 'SetImage', args => {
    
    let argsObj = Vs.Utils.pluginParameterToObject(SetImageArgs,args);
    VsLayeredDisplayInterface.SetImage(argsObj.displayId,argsObj.imageId, argsObj.bitmap, argsObj.tileIndex);

  });
  PluginManager.registerCommand(pluginName, 'SetImages', args => {
    let someParam = {displayId :Vs.Utils.jsonParseRecursive(args.displayId), images: Vs.Utils.jsonParseRecursive(args.images)};
    VsLayeredDisplayInterface.SetImages(someParam.displayId, someParam.images);

  });
  PluginManager.registerCommand(pluginName, 'SetImagesEx', args => {
    let someParam = {configName: Vs.Utils.jsonParseRecursive(args.configName), displayId :Vs.Utils.jsonParseRecursive(args.displayId), images: Vs.Utils.jsonParseRecursive(args.images), 
      flipped: Vs.Utils.jsonParseRecursive(args.flipped), opacity: Vs.Utils.jsonParseRecursive(args.opacity), colorTone: Vs.Utils.jsonParseRecursive(args.colorTone)};
    VsLayeredDisplayInterface.SetImagesEx(someParam.displayId,someParam.configName,  someParam.images,someParam.flipped,someParam.opacity, someParam.colorTone);

  });
  PluginManager.registerCommand(pluginName, 'ShowDisplay', args => {
    let someParam = {displayId :Vs.Utils.jsonParseRecursive(args.displayId)};
    VsLayeredDisplayInterface.ShowDisplay(someParam.displayId);
  });
  PluginManager.registerCommand(pluginName, 'HideDisplay', args => {
    let someParam = {displayId :Vs.Utils.jsonParseRecursive(args.displayId)};
    VsLayeredDisplayInterface.HideDisplay(someParam.displayId);
  });
  PluginManager.registerCommand(pluginName, 'FlipDisplay', args => {
    let someParam = {displayId :Vs.Utils.jsonParseRecursive(args.displayId), flipped :Vs.Utils.jsonParseRecursive(args.flipped)};
    VsLayeredDisplayInterface.FlipDisplay(someParam.displayId,someParam.flipped);
  });
  PluginManager.registerCommand(pluginName, 'SetSmoothScaling', args => {
    let someParam = {displayId :Vs.Utils.jsonParseRecursive(args.displayId), SmoothScaling :Vs.Utils.jsonParseRecursive(args.SmoothScaling)};
    VsLayeredDisplayInterface.SetSmoothScaling(someParam.displayId,someParam.SmoothScaling);
  });
  PluginManager.registerCommand(pluginName, 'SetDisplayOpacity', args => {
    let someParam = {displayId :Vs.Utils.jsonParseRecursive(args.displayId), opacity :Vs.Utils.jsonParseRecursive(args.opacity)};
    VsLayeredDisplayInterface.SetDisplayOpacity(someParam.displayId,someParam.opacity);
  });
  PluginManager.registerCommand(pluginName, 'SetDisplayColorTone', args => {
    let someParam = {displayId: Vs.Utils.jsonParseRecursive(args.displayId), colorTone: Vs.Utils.jsonParseRecursive(args.colorTone)};
    VsLayeredDisplayInterface.SetDisplayColorTone(someParam.displayId,[someParam.colorTone.r,someParam.colorTone.g,someParam.colorTone.b,someParam.colorTone.gray]);
  });

  PluginManager.registerCommand(pluginName, 'MoveToDisplay', args => {
    let someParam = {displayId: Vs.Utils.jsonParseRecursive(args.displayId), x: Vs.Utils.jsonParseRecursive(args.x), y: Vs.Utils.jsonParseRecursive(args.y)};
    VsLayeredDisplayInterface.MoveToDisplay(someParam.displayId,someParam.x,someParam.y);
  });

  PluginManager.registerCommand(pluginName, 'MoveDisplay', args => {
    let someParam = {displayId: Vs.Utils.jsonParseRecursive(args.displayId), x: Vs.Utils.jsonParseRecursive(args.x), y: Vs.Utils.jsonParseRecursive(args.y)};
    VsLayeredDisplayInterface.MoveDisplay(someParam.displayId,someParam.x,someParam.y);
  });

  PluginManager.registerCommand(pluginName, 'RotateDisplay', args => {
    let someParam = {displayId: Vs.Utils.jsonParseRecursive(args.displayId), degrees: Vs.Utils.jsonParseRecursive(args.degrees)};
    VsLayeredDisplayInterface.RotateDisplay(someParam.displayId, someParam.degrees);
  });

  PluginManager.registerCommand(pluginName, 'ResizeDisplay', args => {
    let someParam = {displayId: Vs.Utils.jsonParseRecursive(args.displayId), w: Vs.Utils.jsonParseRecursive(args.w), h: Vs.Utils.jsonParseRecursive(args.h)};
    VsLayeredDisplayInterface.ResizeDisplay(someParam.displayId,someParam.w,someParam.h);
  });

  PluginManager.registerCommand(pluginName, 'SetPivot', args => {
    let someParam = {displayId: Vs.Utils.jsonParseRecursive(args.displayId), x: Vs.Utils.jsonParseRecursive(args.x), y: Vs.Utils.jsonParseRecursive(args.y)};
    VsLayeredDisplayInterface.SetPivot(someParam.displayId,someParam.x,someParam.y);
  });



  /**@param {string} name  */
  function getNamedMultiImageConfig(name)
  {
    let found = _namedMultiImageConfig[name];

    if (found == undefined) return new VsLayeredDisplayConfig();
    return found;
  }

  if (enableMessageUse)
  {
    if (escapeCharacter.length != 1)  throw new Error(`Plugin: ${pluginName}: invalid EscapeCharacter '${escapeCharacter}'`);

    Vs.System.registerProcessEscapeCharacter("B",(windowBase, state, param) => {

      /**@type any[] */
      let result = param.split(",");


      if (result[1] == "true")
      {
        result[1] = true;
      }
      else if (result[1] == "false")
      {
        result[1] = false;
      }

      switch (result.length)
      {
        case 1:
          if (result[0][0] == '!')
          {
            VsLayeredDisplayInterface.RemoveDisplay(Number(result[0].substring(1)));
            return
          }
          else if (result[0][0] == '.')
          {
            VsLayeredDisplayInterface.HideDisplay(Number(result[0].substring(1)));
            return
          }
          else if (result[0][0] == '+')
          {
            VsLayeredDisplayInterface.ShowDisplay(Number(result[0].substring(1)));
            return
          }
          VsLayeredDisplayInterface.SelectContainerSource(result[0]);
          break;
        case 2:
          if (typeof(result[1]) == "boolean")
          {
            if(result[1])
              VsLayeredDisplayInterface.ShowDisplay(Number(result[0]));
            else
              VsLayeredDisplayInterface.HideDisplay(Number(result[0]));
          }
          else
          {
            result[1] = result[1].split(":").reduce((result, _, i,array) => i % 2 === 0 ? [...result, { id: array[i], bitmap: array[i + 1] }] : result, []);

            result[1].forEach(i => {
              if (i.bitmap == undefined) return;

              let pos = i.bitmap.indexOf("!");
              if (pos < 0)return;
              i.tileIndex = Number(i.bitmap.substring(pos+1, i.bitmap.length));
              i.bitmap = i.bitmap.substring(0,pos);
            });
            VsLayeredDisplayInterface.SetImages(result[0],result[1])
          }
          break;
        case 3:
          if (result[0][0] == "M")
          {
            result[0] = result[0].substring(1);
            VsLayeredDisplayInterface.MoveDisplay(result[0], result[1],result[2])
            return;
          }
          else if (result[0][0] == "T")
          {
            result[0] = result[0].substring(1);
            VsLayeredDisplayInterface.MoveToDisplay(result[0], result[1],result[2])
            return;
          }
          else if (result[0][0] == "S")
          {
            result[0] = result[0].substring(1);
            VsLayeredDisplayInterface.ResizeDisplay(result[0], result[1],result[2])
            return;
          }
        case 4:
        case 5:
        case 6:
          if (result[1] != undefined && result[1].length > 0)
            VsLayeredDisplayInterface.EnsureDisplay(result[0],result[1]);

          result[2] = result[2].split(":").reduce((result, _, i,array) => i % 2 === 0 ? [...result, { id: array[i], bitmap: array[i + 1] }] : result, []);              
          
          result[2].forEach(i => {
            if (i.bitmap == undefined) return;

            let pos = i.bitmap.indexOf("!");
            if (pos < 0)return;
            i.tileIndex = Number(i.bitmap.substring(pos+1, i.bitmap.length));
            i.bitmap = i.bitmap.substring(0,pos);
          });

          if (result[3] != undefined  && result[3] !="")
          {
            VsLayeredDisplayInterface.FlipDisplay(result[0],result[3]?.toLocaleLowerCase() == "true");
          }
          if (result[4] != undefined && result[4] !="")
          {
            VsLayeredDisplayInterface.SetDisplayOpacity(result[0],Number(result[4]));
          }
          if (result[5] != undefined && result[5] !="")
          {
            result[5] = result[5].split(":").map(v => Number(v));
            VsLayeredDisplayInterface.SetDisplayColorTone(result[0],result[5]);
          }
          if (result[2].length > 0 && result[2][0].bitmap != undefined)
            VsLayeredDisplayInterface.SetImages(result[0],result[2]);
          break;
        default:
          throw new Error(`Plugin: ${pluginName}: unsuported array length `+result.length);
      }
    });
  }

//#endregion internal Classes,Methods and variables ---------------------------------------------------


//#region core script overrides --------------------------------------------------------------------------


  if (AutoCreateInSceneBase)
  {
    const Spriteset_Base_prototype_createPictures = Spriteset_Base.prototype.createPictures;
    
    Spriteset_Base.prototype.createPictures = function() {
      Spriteset_Base_prototype_createPictures.call(this);

      _currentContainer  = new VsMultiImageContainer();

      _currentContainer.x = 0;
      _currentContainer.y = 0;
      this.addChild(_currentContainer);
      
    }
  }
  if (AutoCreateInWindowMessage)
  {
    // @ts-ignore
    let createContainer = Window_Message?.prototype?._createContainer ?? Window.prototype._createContainer;
    // @ts-ignore
    Window_Message.prototype._createContainer = function() {
      createContainer.call(this);
      
      _currentMessageBackgroundContainer  = new VsMultiImageContainer();

      //Graphics.app.stage.toLocal(new PIXI.Point(200, 150), container);
      _currentMessageBackgroundContainer.x = 0;
      _currentMessageBackgroundContainer.y = 0;
      // @ts-ignore
      this.addChild(_currentMessageBackgroundContainer);
    };

    let createAllParts = Window_Message?.prototype?._createAllParts ?? Window.prototype._createAllParts;
    Window_Message.prototype._createAllParts = function() {
      createAllParts.call(this);
      
      _currentMessageForegroundContainer  = new VsMultiImageContainer();

      _currentMessageForegroundContainer.x = 0;
      _currentMessageForegroundContainer.y = 0;
      // @ts-ignore
      this.addChild(_currentMessageForegroundContainer);
    };
    

     //-------------------------------- update multi image containers in window_message if existing
    let updatePlacement = Window_Message?.prototype?.updatePlacement;

    /**
     * @memberof Window_Message.prototype
     */
    Window_Message.prototype.updatePlacement = function() {
      
      if (_changeMessagePlacement.x >= 0 || _changeMessagePlacement.y >= 0 ||
        _changeMessagePlacement.width >= 0 || _changeMessagePlacement.height >= 0
      )
      {
        this.move(
          _changeMessagePlacement.x >= 0 ? _changeMessagePlacement.x * Graphics.boxWidth :this.x,
          _changeMessagePlacement.y >= 0 ? _changeMessagePlacement.y * Graphics.boxHeight:this.y,
          _changeMessagePlacement.width >= 0 ? _changeMessagePlacement.width * Graphics.boxWidth :this.width,
          _changeMessagePlacement.height >= 0 ? _changeMessagePlacement.height * Graphics.boxHeight :this.height,
        )
      }
      updatePlacement.call(this);
      
      if (_changeMessagePlacement.y >= 0
      )
      {
        this.move(
          this.x,
          _changeMessagePlacement.y >= 0 ? _changeMessagePlacement.y *Graphics.boxHeight :this.y,
          this.width,
          this.height,
        )
      }

      let w = this;
      // @ts-ignore
      this.children.filter(c => c.IsVsMultiImageContainer).forEach(v => {

        // @ts-ignore
        let globalPos = w.parent?.toGlobal(w.position);

        if (globalPos == undefined) return;
        v.x = globalPos.x*-1;
        v.y = globalPos.y*-1;
      });
    }
  }

  // @ts-ignore
  DataManager._databaseFiles.push({name:"VsLayeredDisplayJson", src:"VsLayeredDisplayJson.json"});

  let DataManager_onXhrError = DataManager.onXhrError;
  DataManager.onXhrError = function(name, src, url) {
    
    if (name == "VsLayeredDisplayJson")
    {
      // @ts-ignore
      window[name] = [];
      LoadConfigFromParamters();
      return;
    }
    DataManager_onXhrError.call(this,name,screen,url);
  };

  let DataManager_onXhrLoad = DataManager.onXhrLoad;
  DataManager.onXhrLoad = function(xhr, name, src, url) {
    if (name !="VsLayeredDisplayJson")  { DataManager_onXhrLoad.call(this, xhr, name, src, url); return; }
    if (xhr.status >= 400) { DataManager_onXhrLoad.call(this, xhr, name, src, url); return; }

    DataManager_onXhrLoad.call(this, xhr, name, src, url);
    LoadConfigFromParamters();
    return;
  };
  
 
  
// #endregion core script overrides --------------------------------------------------------------------------


  // @ts-ignore
  window.VsLayeredDisplayContainer = VsLayeredDisplayContainer;
  // @ts-ignore
  window.VsLayeredDisplayInterface = VsLayeredDisplayInterface;
  // @ts-ignore
  window.VsMultiImageContainer = VsMultiImageContainer;
//--------------


//#region Vs namespace  --------------------------------------------------------------------------
if (Vs.isVsRpgDev)
  {
    Vs.plugins.VsLayeredDisplay = VsLayeredDisplay;

  }
  else
  {
    console.error("Vs is already used by another Plugin!!!");
  }
//#endregion Vs namespace  --------------------------------------------------------------------------


})();