enyo.kind({
    name: "App",
    kind: "FittableRows",
    classes: "onyx",
    handlers: {
        onGetNumValue: "getNumValue",
        onInitChanged: "handleInitChanged",
        onDelete: "characterDelete",
        onEdit: "characterEdit",
        onChanged: "characterChanged"
    },
    components: [
        {
            kind: "onyx.Toolbar",
            layoutKind: "FittableColumnsLayout",
            style: "height: 55px;",
            components: [ 
                {
                    kind: "onyx.Button",
                    name: "addNew",
                    content: "+",
                    style: "float: right;",
                    ontap: "addNewCharacter"
                }
            ]
        },
        {
            id: "mainArea",
            name: "Main",
            classes: "onyx",
            kind: "Scroller",
            fit: true,
            // style: "background-color: #4C4C4C;",
        },
        {
            kind: "onyx.Toolbar",
            layoutKind: "FittableColumnsLayout",
            style: "height: 55px; text-align: right",
            components: [ 
                {
                    kind: "onyx.Button",
                    name: "clearDmg",
                    content: "Clear Damage",
                    // style: "float: right;",
                    ontap: "clearDamages"
                },
                {
                    kind: "onyx.Button",
                    name: "clearInit",
                    content: "Clear Initiative",
                    // style: "float: right;",
                    ontap: "clearInitiatives"
                }
            ]
        },
        {
            kind: "onyx.Popup",
            name: "newCharacterDialog", 
            centered: false, 
            modal: true, 
            floating: true,
            autoDismiss: false,
            onHide: "newCharacterCleanup",
            onShow: "handlePopupShow", 
            components: [
                {kind: "onyx.InputDecorator", style: "display: block;", components: [{
                    kind: "onyx.Input",
                    name: "characterDescription",
                    placeholder: "Character Description...",
                    defaultFocus: true
                }]},
                {kind: "onyx.InputDecorator", style: "display: block;", components: [{
                    kind: "onyx.Input",
                    name: "characterTotalHP",
                    placeholder: "Total Hitpoints..."
                }]},
                {kind: "onyx.InputDecorator", style: "display: block;", components: [{
                    kind: "onyx.Input",
                    name: "characterCurrentHP",
                    placeholder: "Current Hitpoints..."
                }]},
                {
                    kind: "onyx.Button",
                    content: "OK",
                    ontap: "addNewCharacterOK"
                },
                {
                    kind: "onyx.Button",
                    content: "Cancel",
                    ontap: "cancelDialog"
                },
            ]
        },
        {
            kind: "onyx.Popup",
            name: "getNumValue", 
            centered: false, 
            modal: true, 
            floating: true,
            autoDismiss: false,
            onShow: "handlePopupShow", 
            components: [
                {kind: "onyx.InputDecorator", style: "display: block;", components: [{
                    kind: "onyx.Input",
                    name: "numValue",
                    placeholder: "Enter Amount...",
                    defaultFocus: true
                }]},
                {
                    kind: "onyx.Button",
                    content: "OK",
                    ontap: "setNumValue"
                },
                {
                    kind: "onyx.Button",
                    content: "Cancel",
                    ontap: "cancelDialog"
                }
            ]
        },
        {
            kind: "onyx.Popup",
            name: "deleteCharacter", 
            centered: false, 
            modal: true, 
            floating: true,
            autoDismiss: false, 
            onShow: "handlePopupShow",
            components: [   
                {
                    content: "Are you sure <br>you want to delete <br>this character?",
                    style: "display: block;",
                    allowHtml: true
                },
                {
                    kind: "onyx.Button",
                    content: "Yes",
                    ontap: "doDeleteCharacter"
                },
                {
                    kind: "onyx.Button",
                    content: "No",
                    ontap: "cancelDialog"
                }
            ]
        }
    ],
    addNewCharacter: function(inSender, inData) {
        this.$.newCharacterDialog.show();
        this.$.characterDescription.focus();
        // var character = new Character();
        // this.$.Main.createComponent(character);
        // this.$.Main.render();
    },
    cancelDialog: function(inSender, inData) { 
        inSender.parent.hide();
    },
    addNewCharacterOK: function(inSender, inData) {
        var d = {
            characterDescription: this.$.characterDescription.getValue(),
            totalHitPoints: this.$.characterTotalHP.getValue(),
            currentHitPoints: this.$.characterCurrentHP.getValue()
        };

        if (this.$.newCharacterDialog.mode === "Edit") {
            d.initiative = this.$.newCharacterDialog.savedInitiative;
            this.$.newCharacterDialog.characterComponent.setData(d);
        }
        else {
            this.createCharacter(d); 
        }
        this.$.newCharacterDialog.hide();
        this.characterChanged();
    },
    newCharacterCleanup: function(inSender, inData) {
        this.$.characterDescription.clear();
        this.$.characterTotalHP.clear();
        this.$.characterCurrentHP.clear();

        this.$.newCharacterDialog.mode = undefined;
        this.$.newCharacterDialog.characterComponent = undefined;
    },
    createCharacter: function(data) {
        
        this.$.Main.createComponent({
            kind: "Character", 
            data: data,
            onGetNumValue: "getNumValue"
        });
        this.$.Main.render();
        
    },
    getNumValue: function(inSender, inData) {
        console.dir(inSender.owner);
        this.$.getNumValue.originator = inData.originator;
        this.$.getNumValue.cb = inData.cb;
        
        this.$.getNumValue.show();
        this.$.numValue.focus();
    },
    setNumValue: function(inSender, inData) {
        this.$.getNumValue.cb.call(this.$.getNumValue.originator, this.$.numValue.getValue());
        this.$.numValue.clear();
        this.$.getNumValue.hide();
    },
    handleInitChanged: function(inSender, inData) {
        var data = this.getDataFromComponents(),
            l = data.length,
            i = 0;
            
        data = data.sort(this.componentSort);
        
        this.$.Main.destroyClientControls();
        
        for ( i = 0; i < l; i += 1 ) {
            this.createCharacter(data[i]);
        }
        this.characterChanged();
        
    },
    componentSort: function(a, b) {
        if (a.initiative > b.initiative) {
            return -1;
        }
        if (a.initiative < b.initiative) {
            return 1;
        }
        if (a.characterDescription < b.characterDescription) {
            return -1;
        }
        if (a.characterDescription > b.characterDescription) {
            return 1;
        }
        return 0;
    },
    getDataFromComponents: function() {
        var data = [],
            components = this.$.Main.getComponents(),
            l = components.length,
            i = 0,
            component = {};
            
        for (i = 0; i < l; i += 1) {
            component = components[i];
            if (component.kind === "Character") {
                data.push({
                    characterDescription: component.getCharacterDescription(),
                    totalHitPoints: component.getTotalHitPoints(),
                    currentHitPoints: component.getCurrentHitPoints(),
                    initiative: component.getInitiative()
                });
            }
        }
        
        return data;
    },
    characterDelete: function(inSender, inData) {
        this.$.deleteCharacter.character = inData;
        this.$.deleteCharacter.show();
    },
    doDeleteCharacter: function() {
        this.$.deleteCharacter.character.destroy();
        this.$.deleteCharacter.hide();
        this.characterChanged();
    },
    characterEdit: function(inSender, inData) {
        this.$.newCharacterDialog.mode = "Edit";
        this.$.newCharacterDialog.characterComponent = inData;
        this.$.newCharacterDialog.savedInitiative = inData.getInitiative();
        
        this.$.characterDescription.setValue(inData.getCharacterDescription());
        this.$.characterTotalHP.setValue(inData.getTotalHitPoints());
        this.$.characterCurrentHP.setValue(inData.getCurrentHitPoints());
        
        this.addNewCharacter();
    },
    handlePopupShow: function(inSender, inData) {
        var d = inSender.calcViewportSize();
        var b = inSender.getBounds();
        inSender.addStyles("top: " + ((d.height-b.height)/3) + "px; left: " + ((d.width-b.width)/2) + "px;"); 
    },
    clearDamages: function() {
        var data = this.$.Main.getComponents();
        var l = data.length;
        var i = 0;
        var d;
        
        for (i = 0; d = data[i]; i += 1) {
            if (d.kind === "Character") {
                d.setCurrentHitPoints(d.getTotalHitPoints());
            }
        }
        this.characterChanged();
    },
    clearInitiatives: function() {
        var data = this.$.Main.getComponents();
        var l = data.length;
        var i = 0;
        var d;
        
        for (i = 0; d = data[i]; i += 1) {
            if (d.kind === "Character") {
                d.setInitiative(0);
            }
        }
        this.characterChanged();
    },
    characterChanged: function(inSender, inData) {
        console.log("character changed called");
        this.storage.set("characterData", this.getDataFromComponents());
    },
    create: function() {
        this.inherited(arguments);
        this.storage = Storage;
        var data = this.storage.get("characterData") || [];
        var l = data.length;
        var i = 0;
        var d;
        
        for (i = 0; i < l; i += 1) {
            d = data[i];
            this.createCharacter({
                            characterDescription: d.characterDescription,
                            totalHitPoints: d.totalHitPoints,
                            currentHitPoints: d.currentHitPoints,
                            initiative: d.initiative
            });
        }
        // this.createCharacter({
                        // characterDescription: "Malic",
                        // totalHitPoints: 24,
                        // currentHitPoints: 24
            // });
        // this.createCharacter({
                        // characterDescription: "Asteroth",
                        // totalHitPoints: 23,
                        // currentHitPoints: 23
            // });
    }
});
