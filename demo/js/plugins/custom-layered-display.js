
(()=>{

  const pluginName = "custom-layered-display";
  Vs.c(pluginName,"VsLayeredDisplay.1.0");


  let Scene_Battle_prototype_create = Scene_Battle.prototype.create;
  Scene_Battle.prototype.create =function(){
    Scene_Battle_prototype_create.call(this);
    
    /**
     * @type {Vs.plugins.VsLayeredDisplay.VsMultiImageContainer}
     */
    let newContainer = new Vs.plugins.VsLayeredDisplay.VsMultiImageContainer();

    this.addChild(newContainer);

    let config = new Vs.plugins.VsLayeredDisplay.VsLayeredDisplayConfig();
    config.autoScale = "x"
    config.imageFrame.width=0.15;
    config.imageFrame.height=0.9;
    config.imageFrame.x=-0.05;
    config.imageFrame.y=0.2;
    config.subImageCoordinates.push(new VsDisplayImageConfig(208,0,159,177,1,1))
    config.verticalAlign="top";
    config.horizontalAlign="left";
    newContainer.AddDisplay(0, config);
    newContainer.SetImage(0,0,"body1");
    newContainer.SetImage(0,1,"face_normal");

    let flip=false;
    this.intervalId = window.setInterval(() => {
      flip = !flip;
      if (flip)
        newContainer.SetImage(0,2,"body1-glow");
      else
        newContainer.SetImage(0,2,null);
    },750);
  }

  let Scene_Battle_prototype_destroy = Scene_Battle.prototype.destroy;
  Scene_Battle.prototype.destroy = function(){

    window.clearInterval(this.intervalId);
    Scene_Battle_prototype_destroy.call(this);
  }

})();