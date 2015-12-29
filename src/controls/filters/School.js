define([
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "bundle!dependencies/services/group_srv",
    "bundle!dependencies/services/org_srv",
    "qscriptx/store/odb/ArrayStore",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "qfacex/dijit/dialog/Dialog",
    "qscript/lang/Class",
    "../Item",
    "i18n!../../nls/app",
    "text!../../templates/filters/school.html"
], function(on, domStyle, domClass, domConstruct, groupSrv, orgSrv, Memory, ITemplated,
    ItemsControl, Dialog, Class, Item, nlsApp, template) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: template,
                allItemKey: "_0",
                catItems: null
            },
            "-methods-": {
                init: function() {
                    this.catItems = {
                        province: {
                            key: "province",
                            subKey: "univ"
                        },
                        univ: {
                            key: "univ",
                            subKey: "school",
                            parentKey: "province"
                        },
                        school: {
                            key: "school",
                            parentKey: "univ"
                        },
                        year: {
                            key: "year",
                            parentKey: "school"
                        }
                    };
                    this.fillCatsNode();
                },

                fillCatsNode: function() {
                    var self = this,
                        ul = domConstruct.create("ul", {
                            "class": "listview"
                        }, this.catsNode),
                        createLi = Function.hitch(this, function(key) {
                            var item = this.catItems[key],
                                li = domConstruct.create("li", {
                                    "class": "lv-item hidden"
                                }, ul),
                                div = domConstruct.create("div", {
                                    "class": "btn-group",
                                    style: "width:100%;height:38px;overflow:hidden"
                                }, li),
                                actionLi = domConstruct.create("li", {
                                    "class": "nav-item pull-right",
                                    innerHTML: "展开",
                                    onclick: function() {
                                        var parentItem;
                                        if (item.parentKey) parentItem = self["current_" + item.parentKey];
                                        self.dialog.set("content", "");
                                        var div = domConstruct.create("div", {
                                            "class": "btn-group",
                                            style: "width:800px;height:500px;overflow-y:auto;"
                                        }, self.dialog.containerNode);
                                        self.dialog.set("title", key);
                                        self.getSubOrgs(div, key, parentItem);
                                        self.dialog.containerNode.appendChild(div);
                                        self.dialog.show();
                                        domStyle.set(self.dialog.containerNode, {
                                            "padding": 0,
                                            width: "800px",
                                            height: "500px"
                                        });
                                    }
                                });
                            item.liNode = li;
                            item.actionLi = actionLi;
                            item.container = div;
                        });
                    for (var key in this.catItems) {
                        createLi(key);
                    }
                },
                dealWithCurrent: function(type, item) {
                    var name = "current_" + type;
                    var olderItem = this[name];
                    if (olderItem) {
                        domClass.remove(olderItem.node, "active");
                    }
                    this._[name] = item;
                    domClass.add(item.node, "active");
                    domClass.add(this.currentItem.liNode, "hidden");
                },
                initOnCatParams: function(item) {
                    var obj = {};
                    if (item.org) {
                        Function.mixin(obj, {
                            key: item.org.id,
                            name: item.org.name,
                            isRoot: item.org.isRoot,
                            isOrg: true,
                            activeItem: item
                        });
                    } else {
                        Function.mixin(obj, {
                            key: item.year,
                            name: item.year,
                            isYear: true,
                            isRoot: false,
                            activeItem: item
                        });
                    }
                    if (item.parent) {
                        obj.parentKey = item.parent.org.id;
                    }
                    this.fillCIToCatParams(obj);
                    this.onCatSelect(obj);
                },
                initYearList: function(container, parentItem) {
                    var self = this,
                        startYear = 1900,
                        endYear = new Date().getUTCFullYear(),
                        createItem = function(year) {
                            domConstruct.create("span", {
                                "class": "btn btn-default",
                                innerHTML: year,
                                onclick: function() {
                                    var obj = {
                                        node: this,
                                        year: year
                                    };
                                    if (parentItem) obj.parent = parentItem;
                                    self.current_year = obj;
                                    self.initOnCatParams(obj);
                                }
                            }, container);
                        };
                    for (var i = endYear; i >= startYear; i--) {
                        createItem(i);
                    }
                },
                getSubOrgs: function(container, type, parentItem) {
                    var parentId,
                        self = this,
                        createOrgItems = function(orgs) {
                            orgs.forEach(function(org) {
                                domConstruct.create("span", {
                                    "class": "btn btn-default",
                                    innerHTML: org.name,
                                    onclick: function() {
                                        var obj = {
                                            node: this,
                                            org: org
                                        };
                                        if (parentItem) obj.parent = parentItem;
                                        self["current_" + type] = obj;
                                        self.initOnCatParams(obj);
                                    }
                                }, container);
                            });
                        };
                    if (parentItem) parentId = parentItem.org.id;
                    if (type === "year") {
                        this.initYearList(container, parentItem);
                    } else {
                        if (parentId) {
                            orgSrv.initSubs(parentId).then(createOrgItems);
                        } else {
                            orgSrv.init().then(function(memory) {
                                createOrgItems(memory.query());
                            });
                        }
                    }
                }
            }
        },
        "-public-": {
            "-attributes-": {
                currentItem: {
                    setter: function(item) {
                        this._.currentItem = item;
                        this.showItem(item.key);
                        if (item.subKey) this.hideSubs(item.subKey);
                    }
                },
                current_province: {
                    setter: function(province) {
                        this.dealWithCurrent("province", province);
                        this.initSubItem("univ", province);
                    }
                },
                current_univ: {
                    setter: function(univ) {
                        this.dealWithCurrent("univ", univ);
                        this.initSubItem("school", univ);
                    }
                },
                current_school: {
                    setter: function(school) {
                        this.dealWithCurrent("school", school);
                        this.initSubItem("year", school);
                    }
                },
                current_year: {
                    setter: function(year) {
                        this._.year = year;
                    }
                }
            },
            "-methods-": {
                fillCIToCatParams: function(params) {
                    // fillCurrentItemToCatParams
                    Function.mixin(params, {
                        catItem: this.currentItem,
                        actionLi: this.currentItem.actionLi,
                        catKey: this.currentItem.key
                    });
                },

                layoutStart: function() {},

                initAllBtnOpts: function() {
                    this.showFirstItem();
                    var obj = {
                        key: this.allItemKey,
                        name: nlsApp["all"],
                        isAll: true
                    };
                    this.fillCIToCatParams(obj);
                    return obj;
                },

                initSubItem: function(type, parentItem) {
                    if (type === this.allItemKey) type = "province";
                    var item = this.catItems[type],
                        self = this;
                    domConstruct.empty(item.container);
                    this.getSubOrgs(item.container, type, parentItem);
                    this.currentItem = item;
                    if (item.activeItem) this["current_" + type] = item.activeItem;
                },
                showFirstItem: function() {
                    this.initSubItem("province");
                },
                showItem: function(key) {
                    var item = this.catItems[key];
                    if (item) domClass.remove(item.liNode, "hidden");
                },
                hideItem: function(key) {
                    var item = this.catItems[key];
                    if (item) domClass.add(item.liNode, "hidden");
                },
                hideSubs: function(key) {
                    var item = this.catItems[key];
                    this.hideItem(key);
                    if (item && item.subKey) this.hideSubs(item.subKey);
                },
                onCatSelect: function(opts) {}
            }
        },
        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
                this.init();
                var self = this;
                this.dialog = new Dialog();
                on(this, "catSelect", function() {
                    self.dialog.hide();
                });
            }
        }
    });
});
