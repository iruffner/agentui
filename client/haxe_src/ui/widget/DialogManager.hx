package ui.widget;

import ui.model.ModelObj;
import m3.jq.JQ;
import ui.widget.LoginDialog;
import ui.widget.NewAliasComp;
import ui.widget.NewUserComp;
import ui.widget.RequestIntroductionDialog;
import ui.widget.SignupConfirmationDialog;

using m3.helper.TypeHelper;

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

    public static function showNewUser(): Void {
        showDialog("newUserComp");
    }

    public static function showSignupConfirmation(): Void {
        showDialog("signupConfirmationDialog");
    }

    public static function showNewAlias(): Void {
        showDialog("newAliasComp");
    }	

    public static function requestIntroduction(from:Connection, to:Connection): Void {
        var options:Dynamic = {}
        options.from = from;
        options.to   = to;
        showDialog("requestIntroductionDialog", options);
    }   

}
