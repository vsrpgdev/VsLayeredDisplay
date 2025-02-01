/*:
 * @target MZ
 * @plugindesc Version 1.1.0 Empty Container
 * @author VsRpgDev
 * @url https://github.com/vsrpgdev/VsContainer
 * @help presents a class with the same methods as sprite but instead of pixi.Sprite extends pixi.Container
 */

//@ts-ignore ---------------- Header line for all VsRpgDev Plugins, create the global VsRpgDev object -------------
"undefined"==typeof Vs&&(Vs={get author(){return"VsRpgDev"}, get isVsRpgDev(){return"VsRpgDev"==Vs.author}, plugins:{}, c(m,...p){ p.filter(x => { const v=x.split("."); const found = Object.entries(Vs.plugins).some(p => p[1].PluginName == v[0] && (v.length < 2 || v[1]==p[1].Version[0])&& (v.length < 3 || v[2]<=p[1].Version[1]));    return !found;   }).forEach(e => {throw new Error(`${m} Error: plugin '${e}' not found or wrong version`)}); } });



(() => {
  const pluginName = "VsContainer";
  const parameters = PluginManager.parameters(pluginName);

  // @ts-ignore
  window.VsContainer = (()=>{
    // @ts-ignore
    class VsContainer extends PIXI.Container
    {
      /**@param {Rectangle} [rectangle] */
      constructor(rectangle)
      {
        super();
        this._id = ++VsContainer.#_counter;
        this.initialize();

        if (rectangle)
        {
          this.x = rectangle.x;
          this.y = rectangle.y;
          this.width = rectangle.width;
          this.height = rectangle.height;
        }
      }

      /** @type number */
      static #_counter=0;

      /** @type number */
      _id=0;

      /** @type number */
      _hue;

      /** @type {[number, number, number, number]} */
      _blendColor;

      /** @type {[number, number, number, number]} */
      _colorTone;

      /** @type ColorFilter */
      _colorFilter;

      /** @type PIXI.BLEND_MODES */
      _blendMode;

      /** @type boolean */
      _hidden;

      initialize()
      {
        this._hue = 0;
        this._blendColor = [0, 0, 0, 0];
        this._colorTone = [0, 0, 0, 0];
        this._colorFilter = null;
        this._blendMode = PIXI.BLEND_MODES.NORMAL;
        this._hidden = false;
      }
      
      get opacity() {return this.alpha * 255;}
      set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
      }

      /** @type PIXI.BLEND_MODES */
      get blendMode() {
        if (this._colorFilter) {
            return this._colorFilter.blendMode;
        } else {
            return this._blendMode;
        }
      }

      /** @type PIXI.BLEND_MODES */
      set blendMode(value) {
        this._blendMode = value;
        if (this._colorFilter) {
            this._colorFilter.blendMode = value;
        }
      }

      /** @type PIXI.Container */
      // @ts-ignore
      get parent(){
        // @ts-ignore
        return super.parent;
      }
      set parent(value)
      {
        // @ts-ignore
        if (super.parent == value) return;
          // @ts-ignore
          super.parent = value;

        this.onParentChanged();
      }

      onParentChanged()
      {
      }
      
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
      destroy(options){

        if (!this.filters) {
          this.filters = [];
        }
        if (this._colorFilter) {
          this._colorFilter = null; 
        }

        if (options == undefined)
          options = { children: true, texture: true };

        super.destroy(options);
      }

      update(){
        for (const child of this.children) {
            // @ts-ignore
            if (child.update) {
                // @ts-ignore
                child.update();
            }
        }
      }

      hide()
      {
        this._hidden = true;
        this.updateVisibility();
      }

      show(){
        this._hidden = false;
        this.updateVisibility();
      }

      updateVisibility(){
        this.visible = !this._hidden;
      }

      move(x,y){
        this.x = x;
        this.y = y;
      }

      setHue(hue){
        if (this._hue !== Number(hue)) {
            this._hue = Number(hue);
            this._updateColorFilter();
        }
      }

      getBlendColor(){
        return this._blendColor.clone();
      }

      setBlendColor(color){
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._blendColor.equals(color)) {
            // @ts-ignore
            this._blendColor = color.clone();
            this._updateColorFilter();
        }
      }

      getColorTone(){
        return this._colorTone.clone();
      }

      /** @param {[number,number,number,number]} tone */
      setColorTone(tone){
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._colorTone.equals(tone)) {
            // @ts-ignore
            this._colorTone = tone.clone();
            this._updateColorFilter();
        }
      }

      _refresh(){
      }

      _createColorFilter()
      {
        this._colorFilter = new ColorFilter();
        if (!this.filters) {
            this.filters = [];
        }
        this.filters.push(this._colorFilter);
      }

      _updateColorFilter(){
        if (!this._colorFilter) {
            this._createColorFilter();
        }
        this._colorFilter.setHue(this._hue);
        this._colorFilter.setBlendColor(this._blendColor);
        this._colorFilter.setColorTone(this._colorTone);
      }

    }

    return VsContainer;
  // @ts-ignore
  })();

  
  Vs.plugins.VsContainerPlugin = class {
    static VsContainer = window.VsContainer

    static get PluginName () {return pluginName}
    
    /**  @type {[number,number,number]} */
    static get Version () {return [1,1, 0]}
  }

})();
