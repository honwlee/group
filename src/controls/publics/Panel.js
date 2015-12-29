define([
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "bundle!dependencies/services/panel_ctrl",
    "qscript/lang/Class"
], function(on, domStyle, domClass, domConstruct, PanelCtrl, Class) {
    return Class.declare({
        "-parent-": PanelCtrl.getControlClass(),
        "-interfaces-": [],
        "-protected-": {
            "-fields-": {
                header: null,
                footer: null,
                itemData: null
            },
            "-methods-": {
                init: function() {
                    this.fillCenter();
                },

                fillCenter: function() {
                    this.ul = domConstruct.create("ul", {
                        "class": "list-group"
                    }, this.centerNode);
                    if (this.itemData) this.itemData.forEach(Function.hitch(this, "initItem"));
                },

                initItem: function(item) {
                    domConstruct.create("li", {
                        "class": "list-group-item",
                        innerHTML: item.title,
                        onclick: Function.hitch(this, function() {
                            this.onItemClick(item);
                        })
                    }, this.ul);
                }
            }
        },
        "-public-": {
            "-attributes-": {
                header: {
                    setter: function(args) {
                        if (args.remove) domConstruct.destroy(this.headerNode);
                        if (args.hide) domClass.add(this.headerNode, "hidden");
                        if (args.content) {
                            domConstruct.empty(this.headerNode);
                            this.headerNode.appendChild(args.content);
                        }
                        if (args.text) this.headerNode.innerHTML = args.text;
                    }
                },

                footer: {
                    setter: function(args) {
                        if (args.remove) domConstruct.destroy(this.footerNode);
                        if (args.hide) domClass.add(this.footerNode, "hidden");
                        if (args.content) {
                            domConstruct.empty(this.footerNode);
                            this.footerNode.appendChild(args.content);
                        }
                        if (args.text) this.footerNode.innerHTML = args.text;
                    }
                }
            },
            "-methods-": {
                onItemClick: function() {}
            }
        },
        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
            }
        }
    });
});
