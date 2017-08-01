function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    var ui;
    try {
        var app = adsk.core.Application.get();
        ui = app.userInterface;

        var workspaces_ = ui.workspaces;
        var modelingWorkspace_ = workspaces_.itemById('FusionSolidEnvironment');
        var commandDef = ui.commandDefinitions;
        var toolbarPanels_ = modelingWorkspace_.toolbarPanels;

        var app = adsk.core.Application.get();
        var product = app.activeProduct;
        var design = adsk.fusion.Design(product);
        var exportMgr = design.exportManager;


        var curBodies = 0;

        checkDesign();
        function checkDesign(){
            setTimeout(function(){
                var app = adsk.core.Application.get();
                var product = app.activeProduct;
                var design = adsk.fusion.Design(product);
                var rootComp = design.rootComponent;
                var bodiesCount = rootComp.bRepBodies.count
                if (bodiesCount != curBodies){
                    NativeButtonClickEvent();
                    curBodies = bodiesCount;
                }
                checkDesign();
            }, 500);
        }

        var onCommandCreated = function(args) {
            // var command = args.command;
            //if command changed - fire input changed
            // command.inputChanged.add(onInputChanged);

            // ui.messageBox('Comand Created');
        };

        var onInputChanged = function(args) {
            // ui.messageBox('Comand Changed');
        };


        function httpGet(theUrl)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
            xmlHttp.send( null );
            return xmlHttp.responseText;
        }

        httpGet("http://localhost:3000/fusion-connected");


        var NativeButtonClickEvent = function(){

            var app = adsk.core.Application.get();
            var product = app.activeProduct;
            var design = adsk.fusion.Design(product);
            var exportMgr = design.exportManager;
            var tmpDir = '/Users/alexturin/projects/Native-V/app/assets/';
            var stlOptions = exportMgr.createSTLExportOptions(design.rootComponent, tmpDir + 'model.stl');
            stlOptions.isBinaryFormat = true;
            stlOptions.meshRefinement = adsk.fusion.MeshRefinementSettings.MeshRefinementHigh;
            var res;
            res = exportMgr.execute(stlOptions);

            httpGet("http://localhost:3000/updatemodel");
        }


        var NativeButton = commandDef.addButtonDefinition('Native_button_ID', 'Native', 'Native Descripion', './resources');

        NativeButton.commandCreated.add(NativeButtonClickEvent);

        //creating new panels
        var nativePanel = toolbarPanels_.add('NativePanelID', 'AR/VR');
        var nativeButtonControl = nativePanel.controls.addCommand(NativeButton);
        nativeButtonControl.isPromoted = true;
        nativeButtonControl.isPromotedByDefault  = true;


    }
    catch (e) {
        if (ui) {
            ui.messageBox(locStrings.addInStartFailed + errorDescription(e));
        }
    }
}


function stop(context) {

    httpGet("http://localhost:3000/fusion-disconnected");

    var app = adsk.core.Application.get();
    var ui = app.userInterface;

    var commandDef = ui.commandDefinitions
    var appPanel = ui.allToolbarPanels.itemById('NativePanelID')

    commandDef.itemById('Native_button_ID').deleteMe()
    appPanel.deleteMe()

    adsk.terminate();

}
