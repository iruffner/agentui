package qoid.widget;

import qoid.model.ModelObj;
import m3.jq.JQ;
import qoid.widget.AliasManagerDialog;
import qoid.widget.LoginDialog;
import qoid.widget.CreateAgentDialog;
import qoid.widget.RequestIntroductionDialog;
import qoid.widget.AllowAccessDialog;
import qoid.widget.RevokeAccessDialog;
import qoid.widget.VerificationRequestDialog;
import qoid.widget.IntroductionNotificationDialog;
import qoid.widget.AcceptVerificationResponseDialog;
import qoid.widget.RespondToVerificationRequestDialog;

@:expose
class DialogManager {

    private static function showDialog(dialogFcnName: String, ?options:Dynamic):Void {
        if (options == null) {
            options = {};
        }
        var selector:String = "." + dialogFcnName;
        var dialog: JQ = new JQ(selector);
        if (!dialog.exists()) {
            dialog = new JQ("<div></div>");
            dialog.appendTo(js.Browser.document.body);
            var dlg = Reflect.field(JQ.ui, dialogFcnName)(options);
            dlg.open();
        } else {
            var field = Reflect.field(dialog, dialogFcnName);

            for (key in Reflect.fields(options)) {
                var value:String = Reflect.field(options, key);
                Reflect.callMethod(dialog, field, ["option", key, value]);
            }
            Reflect.callMethod(dialog, field, ["open"]);
        }
    }

    public static function showLogin(): Void {
        showDialog("loginDialog");
    }

    public static function showCreateAgent(): Void {
        showDialog("createAgentDialog");
    }

    public static function requestIntroduction(from:Connection, to:Connection): Void {
        var options:Dynamic = {};
        options.from = from;
        options.to   = to;
        showDialog("requestIntroductionDialog", options);
    }   

    public static function showAliasManager(): Void {
        showDialog("aliasManagerDialog");
    }   

    public static function allowAccess(label:Label, connection:Connection): Void {
        var options:Dynamic = {};
        options.label = label;
        options.connection = connection;
        showDialog("allowAccessDialog", options);
    }

    public static function revokeAccess(connection:Connection):Void {
        var options:Dynamic = {};
        options.connection = connection;
        showDialog("revokeAccessDialog", options);
    }

    public static function requestVerification(content:Content<Dynamic>):Void {
        var options:Dynamic = {};
        options.content = content;
        showDialog("verificationRequestDialog", options);
    }

    public static function respondToIntroduction(notification: IntroductionRequestNotification):Void {
        var options:Dynamic = {};
        options.notification = notification;
        showDialog("introductionNotificationDialog", options);
    }

    public static function respondToVerificationRequest(notification: VerificationRequestNotification):Void {
        var options:Dynamic = {};
        options.notification = notification;
        showDialog("respondToVerificationRequestDialog", options);
    }

    public static function acceptVerificationResponse(notification: VerificationResponseNotification):Void {
        var options:Dynamic = {};
        options.notification = notification;
        showDialog("acceptVerificationResponseDialog", options);
    }
}
