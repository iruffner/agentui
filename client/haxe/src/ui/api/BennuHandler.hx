package ui.api;

import ui.api.Requester;
import ui.api.EventDelegate;
import ui.model.ModelObj;
import ui.model.Filter;
import ui.model.EM;

class BennuHandler implements ProtocolHandler {
	private var eventDelegate:EventDelegate;
	private var listeningChannel: Requester;

	public function new() {
		this.eventDelegate = new EventDelegate(this);
	}

	public function getUser(login: Login): Void {
		// Create a dummy user
		var user = new User();
		user.userData = new UserData("Sylvester ElGato");
		EM.change(EMEvent.USER, new User());

		// Establish a connection and get the channel_id
	}

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

	private function _createChannel():Void {
		//var request = new StandardRequest
	}

	private function _startPolling(channelId: String): Void {
	}
}
