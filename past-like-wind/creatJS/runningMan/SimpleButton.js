    
    function ui() {
        var ui = new createjs.Container();
        var label = new createjs.Text("OK", "20px Times", "#000");
        label.textAlign = 'center';
        label.textBaseline = 'middle';
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 50);
        shape.shadow = new createjs.Shadow("#000", 5, 5, 8);
        ui.addChild(shape, label);
        ui.regX = shape.width / 2;
        ui.regY = shape.height / 2;
        ui.x = 100;
        ui.y = 100;
        ui.cursor = "pointer";
        label.x = ui.regX;
        label.y = 50;
        stage.addChild(ui);
    }

    function SimpleButton(context)
    {
        var label = new createjs.Text("context", "20px", "#000");
        var rect = new createjs.Graphics().beginStroke("#000").beginFill("black").drawRect(0, 0, 100, 100);
        var shape = new  createjs.shape(rect);
        stage.addChild(shape);
    }
    


