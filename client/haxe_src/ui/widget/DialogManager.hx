package ui.widget;

import ui.model.ModelObj;
import m3.jq.JQ;
import ui.widget.LoginComp;
import ui.widget.NewAliasComp;
import ui.widget.NewUserComp;
import ui.widget.SignupConfirmationDialog;

@:expose
class DialogManager {

    private static function showDialog(selector:String, dialogFcnName: String):Void {
        //var selector:String = "." + dialogFcnName;
        var dialog: JQ = new JQ(selector);
        if (!dialog.exists()) {
            dialog = new JQ("<div></div>");
            dialog.appendTo(js.Browser.document.body);
            var dlg = Reflect.field(JQ.ui, dialogFcnName)();
            dlg.open();
        } else {
            var field = Reflect.field(dialog, dialogFcnName);
            Reflect.callMethod(dialog, field, ["open"]);
        }
    }

    public static function showLogin(): Void {
        showDialog(".loginComp", "loginComp");
    }

    public static function showNewUser(): Void {
        showDialog(".newUserComp", "newUserComp");
    }

    public static function showSignupConfirmation(): Void {
        showDialog(".signupConfirmationDialog", "signupConfirmationDialog");
    }

    public static function showNewAlias(): Void {
        showDialog(".newAliasComp", "newAliasComp");
    }	

    public static function requestIntroduction(from:Connection, to:Connection): Void {
        var requestIntroductionDialog: RequestIntroductionDialog = new RequestIntroductionDialog(".requestIntroductionDialog");

        if (requestIntroductionDialog.exists()) {
            requestIntroductionDialog.requestIntroductionDialog("option", "from", from);
            requestIntroductionDialog.requestIntroductionDialog("option", "to", to);
        } else {
            requestIntroductionDialog = new RequestIntroductionDialog("<div></div>");
            requestIntroductionDialog.appendTo(js.Browser.document.body);
            requestIntroductionDialog.requestIntroductionDialog({
                from: from,
                to: to
            });
        }
        requestIntroductionDialog.requestIntroductionDialog("open");
    }   

}
