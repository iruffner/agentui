package terminal.widget;

import m3.exception.Exception;
import m3.jq.JQ;
import m3.widget.Widgets;
import qoid.Qoid;
import qoid.model.ModelObj;
import terminal.model.TerminalModel;

typedef AuditLogEntryOptions = {
    var auditLogContent: AuditLogContent;
}

typedef AuditLogEntryWidgetDef = {
    @:optional var options: AuditLogEntryOptions;
    var _create: Void->Void;
    var destroy: Void->Void;

    var getProfile: Void->Profile;
    var getProfileImageHtml: Void->String;
    var getProfileNameHtml: Void->String;
    var getKindHtml: Void->String;
    var getSuccessfulHtml: Void->String;
    var getErrorCodeHtml: Void->String;
    var getDegreesOfTrustHtml: Void->String;
    var getTimestampHtml: Void->String;
    var getDataHtml: Void->String;
}

@:native("$")
extern class AuditLogEntry extends JQ {

    function auditLogEntry(opts: AuditLogEntryOptions): AuditLogEntry;

    private static function __init__(): Void {
        var defineWidget: Void->AuditLogEntryWidgetDef = function(): AuditLogEntryWidgetDef {
            return {

                _create: function(): Void {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    var selfElement: JQ = Widgets.getSelfElement();

                    if (!selfElement.is("div")) {
                        throw new Exception("Root of AuditLogEntry must be a div element");
                    }

                    selfElement.addClass("_auditLogEntry");

                    for (connection in Qoid.connections) {
                        m3.log.Logga.DEFAULT.debug("CONNECTION: " + connection.data.name);
                    }

                    for (profile in Qoid.profiles) {
                        m3.log.Logga.DEFAULT.debug("PROFILE: " + profile.name);
                    }

                    for (alias in Qoid.aliases) {
                        m3.log.Logga.DEFAULT.debug("ALIAS: " + alias.profile.name);
                    }

                    m3.log.Logga.DEFAULT.debug("CURRENT ALIAS: " + Qoid.currentAlias.profile.name);

                    var divProfile = new JQ("<div class='profile'></div>").appendTo(selfElement);
                    var divProfileImage = new JQ("<div class='profileImage'></div>").appendTo(divProfile).append(self.getProfileImageHtml());
                    var divProfileName = new JQ("<div class='profileName'></div>").appendTo(divProfile).append(self.getProfileNameHtml());

                    var divDetails = new JQ("<div class='details'></div>").appendTo(selfElement);
                    var divKind = new JQ("<div class='kind'></div>").appendTo(divDetails).append(self.getKindHtml());
                    var divSuccessful = new JQ("<div class='successful'></div>").appendTo(divDetails).append(self.getSuccessfulHtml());
                    var divErrorCode = new JQ("<div class='errorCode'></div>").appendTo(divDetails).append(self.getErrorCodeHtml());
                    var divDegreesOfTrust = new JQ("<div class='degreesOfTrust'></div>").appendTo(divDetails).append(self.getDegreesOfTrustHtml());
                    var divTimestamp = new JQ("<div class='timestamp'></div>").appendTo(divDetails).append(self.getTimestampHtml());

                    var divData = new JQ("<div class='data'></div>").appendTo(selfElement).append(self.getDataHtml());
                },

                destroy: function(): Void {
                    untyped JQ.Widget.prototype.destroy.call(JQ.curNoWrap);
                },

                getProfile: function(): Profile {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    var connectionIid = self.options.auditLogContent.props.route[0];

                    if (Qoid.currentAlias.connectionIid == connectionIid) {
                        return Qoid.aliases.delegate().get(Qoid.currentAlias.iid).profile;
                    } else {
                        var connection = Qoid.connections.delegate().get(connectionIid);
                        return connection == null ? new Profile("-->*<--", "") : connection.data;
                    }
                },

                getProfileImageHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();

                    var profile = self.getProfile();

                    if (profile.imgSrc == null || profile.imgSrc == "") {
                        return "<img src='media/default_avatar.jpg' />";
                    } else {
                        return "<img src='" + self.getProfile().imgSrc + "' />";
                    }
                },

                getProfileNameHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    return self.getProfile().name;
                },

                getKindHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();

                    switch (self.options.auditLogContent.props.kind) {
                        case "QueryRequest": return "Query";
                        case "CancelQueryRequest": return "Cancel Query";
                        case "CreateAliasRequest": return "Create Alias";
                        case "UpdateAliasRequest": return "Update Alias";
                        case "DeleteAliasRequest": return "Delete Alias";
                        case "CreateAliasLoginRequest": return "Create Alias Login";
                        case "UpdateAliasLoginRequest": return "Update Alias Login";
                        case "DeleteAliasLoginRequest": return "Delete Alias Login";
                        case "UpdateAliasProfileRequest": return "Update Alias Profile";
                        case "DeleteConnectionRequest": return "Delete Connection";
                        case "CreateContentRequest": return "Create Content";
                        case "UpdateContentRequest": return "Update Content";
                        case "AddContentLabelRequest": return "Add Content Label";
                        case "RemoveContentLabelRequest": return "Remove Content Label";
                        case "CreateLabelRequest": return "Create Label";
                        case "UpdateLabelRequest": return "Update Label";
                        case "MoveLabelRequest": return "Move Label";
                        case "CopyLabelRequest": return "Copy Label";
                        case "RemoveLabelRequest": return "Remove Label";
                        case "GrantLabelAccessRequest": return "Grant Label Access";
                        case "RevokeLabelAccessRequest": return "Revoke Label Access";
                        case "UpdateLabelAccessRequest": return "Update Label Access";
                        case "CreateNotificationRequest": return "Create Notification";
                        case "ConsumeNotificationRequest": return "Consume Notification";
                        case "DeleteNotificationRequest": return "Delete Notification";
                        case "InitiateIntroductionRequest": return "Initiate Introduction";
                        case "IntroductionRequest": return "Introduction";
                        case "AcceptIntroductionRequest": return "Accept Introduction";
                        default: return self.options.auditLogContent.props.kind;
                    }
                },

                getSuccessfulHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    return "Successful: " + (self.options.auditLogContent.props.success ? "True" : "False");
                },

                getErrorCodeHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    return "Error Code: " + (self.options.auditLogContent.props.errorCode == null ? "None" : self.options.auditLogContent.props.errorCode);
                },

                getDegreesOfTrustHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    return "Degrees of Trust: " + self.options.auditLogContent.props.route.length;
                },

                getTimestampHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    return "Timestamp: " + self.options.auditLogContent.created.toString();
                },

                getDataHtml: function(): String {
                    var self: AuditLogEntryWidgetDef = Widgets.getSelf();
                    return haxe.Json.stringify(self.options.auditLogContent.props.messageData);
                }
            };
        }

        JQ.widget("ui.auditLogEntry", defineWidget());
    }
}