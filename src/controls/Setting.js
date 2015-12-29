define([
    "dojo/on",
    "dojo/mouse",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-construct",
    "i18n!../nls/app",
    "text!../templates/setting.html",
    "qfacex/dijit/ITemplated",
    "utilhub/ItemsControl",
    "qscript/lang/Class"
], function(on, mouse, topic, domClass, domConstruct, nlsApp, template, ITemplated,
    ItemsControl, Class) {
    var Setting = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                classfication: null,
                templateString: template,
                baseClass: "groupSetting",
                fontAwesome: FontAwesome,
                mainLayout: null
            },
            "-methods-": {
                init: function() {
                    // this.eventBind();
                },

                eventBind: function() {
                    on(this.saveBtnNode, "click", Function.hitch(this, "saveGroup"));
                },

                saveGroup: function() {
                    var data = this.verifyData();
                    if (!data.isValid) {
                        return;
                    }

                    var config = data.config;
                    var self = this;
                    groupSrv.addGroup(config).then(function(cbData) {
                        console.log(cbData);
                        self.hiddenDialog();
                    });
                },

                verifyData: function() {
                    var name = this.nameNode.value;
                    var retData = {
                        "isValid": true
                    };
                    if (name === "") {
                        qfaceDialog.alert({
                            message: "Name can't be empty!"
                        });
                        retData.isValid = false;
                        return retData;
                    }

                    var config = {
                        "name": name
                    };

                    retData.config = config;

                    return retData;
                },

                initSettingData: function(info) {
                    this.haveShielded = [];
                    this.name = info.name;
                    this.headImg = info.headImg;
                    this.following = info.following;
                    this.follower = info.follower;
                    this.order = info.order;
                    this.note = info.note;
                    this.phoneNum = info.phoneNum;
                    this.email = info.email;
                    this.cardInfo = info.cardInfo;
                    this.autoRefresh = info.autoRefresh;
                    this.autoGetLatestOrder = info.autoGetLatestOrder;
                    this.autoGetLatestRemaind = info.autoGetLatestRemaind;
                    this.canAtme = info.canAtme;
                    this.canCommentMe = info.canCommentMe;
                    this.haveShielded = info.haveShielded;
                },

                hiddenDialog: function() {
                    this.mainLayout.toggleRightSide();
                }
            }
        },

        "-public-": {
            "-attributes-": {

            },

            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params) {
                this.initSettingData(params.itemData);
                this.overrided(params);
                this.init();
            }
        }
    });
    return Setting;
});
