define([
    "qscript/lang/Array",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "i18n!../nls/app",
    "text!../templates/list.html",
    "bundle!dependencies/services/group_srv",
    "bundle!dependencies/services/iPaginate_lib#module",
    "bundle!dependencies/services/iGoTop_lib#module",
    "qscript/lang/Class",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "./Item"
], function(array, on, topic, domStyle, domClass, domConstruct, nlsApp, template,
    groupsrv, IPaginateLib, IGoTopLib, Class,
    ITemplated, ItemsControl, Item) {
    var List = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated, IGoTopLib].concat(IPaginateLib.scroll),
        "-protected-": {
            "-fields-": {
                fontAwesome: FontAwesome,
                templateString: template,
                baseClass: "list",
                isScrollPage: false,
                app: null,
                memory: null
            },

            "-methods-": {
                init: function() {
                    domStyle.set(this.domNode, "overflow-y", "auto");
                    this.fillCenter();
                },

                fillCenter: function(opts) {
                    this.filterOpts = opts || this.filterOpts;
                },

                newItem: function(item) {
                    var group = this.initPageItemDom(item);
                    domConstruct.place(group.domNode, this.contentNode, "first");
                    group.startup();
                },

                initPageItemDom: function(item, index, notiObj) {
                    var group = new Item({
                        item: item
                    });
                    return group;
                },

                loadNexPageData: function() {
                    /**

                        TODO:
                        - this method isn't realized
                        - should add loadNext method in AppServer

                    **/
                    if (this.lastPageInited) return;
                    this.pageCount += 1;
                    var filter,
                        qOpts = this.filterOpts.queryOpts;
                    if (qOpts) {
                        switch (Object.keys(qOpts)[0]) {
                            case "rootOrgId":
                                filter = "org_id=" + qOpts["rootOrgId"];
                                break;
                            case "orgId":
                                filter = "org_id=" + qOpts["orgId"];
                                break;
                        }
                    }
                    groupsrv.initByPage(this.pageCount, filter).then(
                        Function.hitch(this, function(groups) {
                            if (groups.length > 0) {
                                this.initPageItemsWithData(groups);
                            } else {
                                this.lastPageInited = true;
                            }
                        })
                    );
                }
            }
        },

        "-public-": {
            "-attributes-": {
                filterOpts: {
                    "default": {
                        sortOpts: {
                            name: "createdAt"
                        },
                        queryOpts: {},
                        newPaginate: true,
                        perPage: 12
                    },
                    setter: function(opts) {
                        opts.newPaginate = true;
                        if (this.isScrollPage) opts.scrollOpts = {
                            scrollNode: this.domNode,
                            loadingNode: this.pageLoadingNode
                        };
                        var dom = this.initPaginate(this.memory, opts);
                        if (!this.paginate) this.contentNode.appendChild(dom);
                        this._.filterOpts = opts;
                    }
                },

                paginate: {
                    setter: function(paginate) {
                        // paginate 为null时表明没有要找的结果
                        domConstruct.empty(this.contentNode);
                        // destroy older paginete
                        if (this.paginate) this.paginate.destroyRecursive();
                        if (paginate) this.contentNode.appendChild(paginate.domNode);
                        this._.paginate = paginate;
                    }
                }
            },

            "-methods-": {
                filter: function(opts) {
                    this.fillCenter({
                        queryOpts: opts
                    });
                },

                search: function(name) {
                    var qOpts = {
                        name: {
                            reg: true,
                            value: name
                        }
                    };
                    this.olderQOpts = this.filterOpts.queryOpts;
                    this.filter(qOpts);
                },

                searchDel: function() {
                    this.filter(this.olderQOpts || {});
                    this.olderFilterOpts = null;
                },

                sort: function(opt) {
                    //{name:updated_at,direction:true}
                    this.fillCenter({
                        sortOpts: opt
                    });
                },

                start: function() {
                    this.initGoTop({
                        scrollContainer: this.domNode,
                        notCalculateTop: true
                    });
                }
            }
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this.overrided(params, srcNodeRef);
                this.init();
            }
        }
    });
    return List;
});
