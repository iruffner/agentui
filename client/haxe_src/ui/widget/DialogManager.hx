package ui.widget;

@:expose
class DialogManager {

    public static function showLogin(): Void {
        var loginComp: LoginComp = new LoginComp(".loginComp");
        if(loginComp.exists()) {
            loginComp.loginComp("open");
        } else {
            loginComp = new LoginComp("<div></div>");
            loginComp.appendTo(js.Browser.document.body);
            loginComp.loginComp();
            loginComp.loginComp("open");
        }
    }

    public static function showNewUser(): Void {
        var newUserComp: NewUserComp = new NewUserComp(".newUserComp");
        if(newUserComp.exists()) {
            newUserComp.newUserComp("open");
        } else {
            newUserComp = new NewUserComp("<div></div>");
            newUserComp.appendTo(js.Browser.document.body);
            newUserComp.newUserComp();
            newUserComp.newUserComp("open");
        }
    }

    public static function showSignupConfirmation(): Void {
        var signupConfirmationDialog: SignupConfirmationDialog = new SignupConfirmationDialog(".signupConfirmationDialog");
        if(signupConfirmationDialog.exists()) {
            signupConfirmationDialog.signupConfirmationDialog("open");
        } else {
            signupConfirmationDialog = new SignupConfirmationDialog("<div></div>");
            signupConfirmationDialog.appendTo(js.Browser.document.body);
            signupConfirmationDialog.signupConfirmationDialog();
            signupConfirmationDialog.signupConfirmationDialog("open");
        }
    }

    public static function showNewAlias(): Void {
        var newUserComp: NewAliasComp = new NewAliasComp(".newAliasComp");
        if(newUserComp.exists()) {
            newUserComp.newAliasComp("open");
        } else {
            newUserComp = new NewAliasComp("<div></div>");
            newUserComp.appendTo(js.Browser.document.body);
            newUserComp.newAliasComp();
            newUserComp.newAliasComp("open");
        }
    }	
}
