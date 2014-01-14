package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;

class BennuHandler implements ProtocolHandler {
	public function getUser(login: Login): Vois
	public function filter(filter: Filter): Void { }
	public function stopCurrentFilter(onSuccessOrError: Void->Void, async: Bool=true): Void { }
	public function nextPage(nextPageURI: String): Void { }
	public function getAliasInfo(alias: Alias): Void { }
	public function createUser(newUser: NewUser): Void { }
	public function validateUser(token: String): Void { }
	public function updateUser(user: User): Void { }
	public function post(content: Content): Void { }
	public function updateLabels():Void { }
	public function addAlias(alias: Alias): Void { }
	public function removeAlias(alias: Alias): Void { }
	public function setDefaultAlias(alias: Alias): Void { }
	public function getAliasConnections(alias: Alias): Void { }
	public function getAliasLabels(alias: Alias): Void { }
	public function beginIntroduction(intro: Introduction): Void { } 
	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void { }
	public function backup(/*backupName: String*/): Void { }
	public function restore(/*backupName: String*/): Void { }
	public function restores(): Void { }
}
