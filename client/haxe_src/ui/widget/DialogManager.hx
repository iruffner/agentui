package ui.widget;

import ui.model.ModelObj;

@:expose
class DialogManager {

    public static function showLogin(): Void {
        var loginComp: LoginComp = new LoginComp(".loginComp");
        if (!loginComp.exists()) {
            loginComp = new LoginComp("<div></div>");
            loginComp.appendTo(js.Browser.document.body);
            loginComp.loginComp();
        }
        loginComp.loginComp("open");
    }

    public static function showNewUser(): Void {
        var newUserComp: NewUserComp = new NewUserComp(".newUserComp");
        if (!newUserComp.exists()) {
            newUserComp = new NewUserComp("<div></div>");
            newUserComp.appendTo(js.Browser.document.body);
            newUserComp.newUserComp();
        }
        newUserComp.newUserComp("open");
    }

    public static function showSignupConfirmation(): Void {
        var signupConfirmationDialog: SignupConfirmationDialog = new SignupConfirmationDialog(".signupConfirmationDialog");
        if (!signupConfirmationDialog.exists()) {
            signupConfirmationDialog = new SignupConfirmationDialog("<div></div>");
            signupConfirmationDialog.appendTo(js.Browser.document.body);
            signupConfirmationDialog.signupConfirmationDialog();
            signupConfirmationDialog.signupConfirmationDialog("open");
        }
        signupConfirmationDialog.signupConfirmationDialog("open");
    }

    public static function showNewAlias(): Void {
        var newAliasComp: NewAliasComp = new NewAliasComp(".newAliasComp");
        if (!newAliasComp.exists()) {
            newAliasComp = new NewAliasComp("<div></div>");
            newAliasComp.appendTo(js.Browser.document.body);
            newAliasComp.newAliasComp();
        }
        newAliasComp.newAliasComp("open");
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
