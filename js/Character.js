enyo.kind({
    name: "Character",
    style: "position: relative; height: 55px; padding: 5px; background-image: none;",
    classes: "onyx  onyx-toolbar",
    components: [
        {
            classes: "enyo-fit",
            components: [
                {
                    name: "hpPercentBar",
                    classes: "enyo-fit percentBar",
                    style: "right: 0%"
                }
            ]
        },
        {
            classes: "enyo-fit characterItem",
            style: "background: none",
            kind: "FittableColumns",
            noStretch: true,
            components: [
                {
                    name: "characterDescription",
                    content: "",
                    fit: true,
                    allowHtml: true
                },
                {
                    kind: "onyx.Button",
                    content: "Edit",
                    ontap: "editCharacter"
                },
                {
                    kind: "onyx.Button",
                    content: "Dmg",
                    ontap: "getDamage",
                },
                {
                    kind: "onyx.Button",
                    content: "Heal",
                    ontap: "getHeal"
                },
                {
                    kind: "onyx.Button",
                    content: "Init",
                    ontap: "getInit"
                },
                {
                    kind: "onyx.Button",
                    content: "Del",
                    ontap: "deleteCharacter"
                }
            ]
        }
    ],
    published: {
        characterDescription: "",
        totalHitPoints: 0,
        currentHitPoints: 0,
        initiative: 0,
        data: {}
    },
    events: {
        onGetNumValue: "",
        onInitChanged: "",
        onDelete: "",
        onEdit: "",
        onChanged: ""
    },
    create: function() {
        this.inherited(arguments);
        this.dataChanged();
        // var d = this.getData();
        // this.setCharacterDescription(d.characterDescription);
        // this.setTotalHitPoints(d.totalHitPoints);
        // this.setCurrentHitPoints(d.currentHitPoints);        
    },
    dataChanged: function() {
        var d = this.getData();
        this.setCharacterDescription(d.characterDescription);
        this.setTotalHitPoints(d.totalHitPoints || 0);
        this.setCurrentHitPoints(d.currentHitPoints || 0);
        this.setInitiative(d.initiative || 0)        
        
    },
    characterDescriptionChanged: function() {
        this.setDescription();
    },
    totalHitPointsChanged: function() {
        this.setDescription();
        this.setHPPercentage();
    },
    currentHitPointsChanged: function() {
        this.setDescription();
        this.setHPPercentage();
    },
    initiativeChanged: function() {
        this.setDescription();
    },
    setHPPercentage: function() {
        var t = this.getTotalHitPoints(),
            c = this.getCurrentHitPoints(),
            p = 0;
            
        if (t !== 0) {
            p = (c / t) * 100;
        }
        
        this.$.hpPercentBar.setStyle("right: " + parseInt(100 - p) + "%;");
        this.$.hpPercentBar.addRemoveClass("bloodied", p <= 50);
    },
    setDescription: function() {
        var desc = this.getCharacterDescription() + 
                   ", <br />HP: " + this.getCurrentHitPoints() + 
                   " of " + this.getTotalHitPoints() +
                   ", Init: " + this.getInitiative();
        
        this.$.characterDescription.setContent(desc);
    },
    getDamage: function(inSender, inData) {
        this.doGetNumValue({ cb: this.doDamage });
    },
    doDamage: function(inValue) {
        var c = this.getCurrentHitPoints();
        
        this.setCurrentHitPoints(c - inValue);
        this.doChanged(this);
    },
    getHeal: function(inSender, inData) {
        this.doGetNumValue({ cb: this.doHeal });
    },
    doHeal: function(inValue) {
        var c = this.getCurrentHitPoints() * 1;
        
        this.setCurrentHitPoints(c + parseInt(inValue));
        this.doChanged(this);
    },
    getInit: function(inSender, inData) {
        this.doGetNumValue({ cb: this.doInit });
    },
    doInit: function(inValue) {
        this.setInitiative(parseInt(inValue));
        this.doInitChanged();
        // this.doChanged(this);
    },
    deleteCharacter: function(inSender, inData) {
        this.doDelete(this);
        // this.doChanged(this);
    },
    editCharacter: function(inSender, inData) {
        this.doEdit(this);
        // this.doChanged(this);
    }
})
