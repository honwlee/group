define([
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "i18n!../../nls/app",
    "bundle!dependencies/services/group_srv",
    "qscript/lang/Class"
], function(on, domStyle, domClass, domConstruct, ITemplated, ItemsControl, nlsApp, groupSrv, Class) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                allItemKey: "_0",
                templateString: "<div></div>"
            },
            "-methods-": {
                init: function() {
                    var self = this;
                    groupSrv.initInterestCats().then(function(cats) {
                        cats.forEach(function(cat) {
                            domConstruct.create("span", {
                                "class": "label label-primary",
                                innerHTML: cat.name,
                                onclick: function() {
                                    self.currentCat = {
                                        dom: this,
                                        catInfo: cat
                                    };
                                }
                            }, self.domNode);
                        });
                    });
                }
            }
        },
        "-public-": {
            "-attributes-": {
                currentCat: {
                    setter: function(cat) {
                        var oldCat = this.currentCat;
                        if (oldCat) {
                            domClass.remove(oldCat.dom, "active");
                        }
                        domClass.add(cat.dom, "active");
                        this._.currentCat = cat;
                        this.onCatSelect(cat.catInfo);
                    }
                }
            },
            "-methods-": {
                initAllBtnOpts: function() {
                    var obj = {
                        key: this.allItemKey,
                        name: nlsApp["all"],
                        isAll: true
                    };
                    return obj;
                },

                onCatSelect: function(info) {}
            }
        },
        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
                this.init();
            }
        }
    });
});
