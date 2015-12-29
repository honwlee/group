define([
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "qscriptx/store/odb/ArrayStore",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "qscript/lang/Class",
    "bundle!dependencies/services/group_srv",
    "text!../../templates/views/userList.html",
    "selectize"
], function(on, domClass, domStyle, domConstruct, Memory, ITemplated, ItemsControl,
    Class, groupSrv, template) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: template,
                baseClass: "clearfix",
                groupId: null,
                users: null,
                fontAwesome: FontAwesome
            },
            "-methods-": {
                init: function() {
                    this.overrided();
                    domStyle.set(this.domNode, {
                        width: "100%",
                        height: "100%"
                    });
                    this.memory = new Memory({
                        data: this.users
                    });
                    this.initItems(this.users);
                    this.initSeletItems(this.users);
                    $(".select-beast", this.domNode).selectize({
                        create: true,
                        sortField: {
                            field: 'text',
                            direction: 'asc'
                        },
                    });
                    var self = this;
                    $(".select-beast", this.domNode).change(function() {
                        self.createFilter(self.users);
                    });
                },

                initSeletItems: function(users) {
                    users.forEach(function(user) {
                        this.initSeletItem(user);
                    }, this);
                },

                createFilter: function(users) {
                    var value = this.selectNode.value;
                    if (value) {
                        domConstruct.empty(this.userListNode);
                        users.forEach(function(user) {
                            if (user.id == value) {
                                this.createItem(user);
                            };
                        }, this);

                    }
                },

                initSeletItem: function(user) {
                    var item = domConstruct.create("option", {
                        "value": user.id,
                        innerHTML: user.username
                    }, this.selectNode);
                },

                initItems: function(users) {
                    users.forEach(function(user) {
                        this.createItem(user);
                    }, this);
                },

                createItem: function(user) {
                    var item = domConstruct.create("div", {
                            "class": "list-group-item recommend-item col-sm-6 panel-body"
                        }),
                        div = domConstruct.create("div", {
                            "class": "media"
                        }, item),
                        a = domConstruct.create("a", {
                            "class": " media-left"
                        }, div),
                        nameDiv = domConstruct.create("div", {
                            "class": "media-body"
                        }, div),
                        addDiv = domConstruct.create("div", {
                            "class": "content"
                        }, div);

                    domConstruct.create("img", {
                        style: "width:50px;height:50px;",
                        src: user.avatar
                    }, a);

                    domConstruct.create("p", {
                        "class": "title",
                        innerHTML: user.username
                    }, nameDiv);
                    var span = domConstruct.create("em", {
                        "class": "followIcon " + FontAwesome.addSquare,
                        "title": "Add",
                        onclick: Function.hitch(this, function() {
                            var userId = user.userId ? user.userId : user.id;
                            this.memory.remove(userId);
                            this.userListNode.removeChild(item);
                            this.onAddMember(user);
                        })
                    }, nameDiv);
                    this.userListNode.appendChild(item);
                }

            }
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {
                onAddMember: function(user) {}
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.overrided(params);
                groupSrv.initUsers(this.groupId).then(Function.hitch(this, function(users) {
                    this.users = users;
                    this.init();
                }));
            }
        }
    });
});
