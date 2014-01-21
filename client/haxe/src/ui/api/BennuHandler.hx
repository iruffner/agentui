package ui.api;

import haxe.Json;
import m3.jq.JQ;

import ui.api.Requester;
import ui.api.EventDelegate;
import ui.model.ModelObj;
import ui.model.Filter;
import ui.model.EM;

using Lambda;

class BennuHandler implements ProtocolHandler {
	private var eventDelegate:EventDelegate;
	private var listeningChannel: LongPollingRequest;


	public function new() {
		this.eventDelegate = new EventDelegate(this);
	}

	public function getUser(login: Login): Void {
		// Create a dummy agent
		var agent = new Agent();
		agent.userData = new UserData("Qoid", "media/test/koi.jpg");
		EM.change(EMEvent.USER, agent);
		EM.change(EMEvent.FitWindow);

		// Establish a connection with the server and get the channel_id
		var request = new BennuRequest("/api/channel/create", "", onCreateChannel);
		request.start();

		// Get all aliases
		var qr = new QueryRequest("alias", "", function (data: Array<Dynamic>, textStatus: String, jqXHR: JQXHR):Void {
        	
        	for (alias_ in data) {
        		agent.aliasSet.add(new Alias(alias_));
        	}

        	if (agent.aliasSet.isEmpty()) {
        		AppContext.LOGGER.error("Agent has no Aliases!!");
        		agent.currentAlias = new Alias();
        		agent.currentAlias.name = "default";
        		agent.aliasSet.add(agent.currentAlias);
        	} else {
        		agent.currentAlias = agent.aliasSet.iterator().next();
        	}
			EM.change(EMEvent.USER, agent);
			EM.change(EMEvent.FitWindow);
		});
		qr.start();
	}

	public function filter(filter: Filter): Void { }
	public function stopCurrentFilter(onSuccessOrError: Void->Void, async: Bool=true): Void { }
	public function nextPage(nextPageURI: String): Void { }
	public function getAliasInfo(alias: Alias): Void {
	//	getAliasConnections(alias);
		getAliasLabels(alias);
	}
	public function createUser(newUser: NewUser): Void { }
	public function validateUser(token: String): Void { }
	public function updateUser(agent: Agent): Void { }
	public function post(content: Content): Void { }
	public function updateLabels():Void { }

	public function createAlias(alias: Alias): Void { 
       	AppContext.LOGGER.debug("BennuHandler: createAlias called");
		var upsertRequest = new UpsertRequest(alias, function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
       		AppContext.LOGGER.debug("BennuHandler: createAlias succeeded");
       		EM.change(EMEvent.NewAlias);
		});
		upsertRequest.start();
	}
	
	public function updateAlias(alias: Alias): Void { 
		var upsertRequest = new UpsertRequest(alias, function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
       		AppContext.LOGGER.debug("upateAlias succeeded");
       		EM.change(EMEvent.NewAlias);
		});
		upsertRequest.start();
	}

	public function removeAlias(alias: Alias): Void {
		var deleteRequest = new DeleteRequest(alias, function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
			js.Lib.alert(data);
		});
		deleteRequest.start();
	}

	public function setDefaultAlias(alias: Alias): Void { }
	public function getAliasConnections(alias: Alias): Void { }

	public function getAliasLabels(alias:Alias) {
	var qr = new QueryRequest("labelChild", "parentIid='" + alias.rootLabelIid + "'", function (data: Array<Dynamic>, textStatus: String, jqXHR: JQXHR):Void {
		js.Lib.alert(data);
	});
	qr.start();
}

	public function beginIntroduction(intro: Introduction): Void { } 
	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void { }
	public function backup(/*backupName: String*/): Void { }
	public function restore(/*backupName: String*/): Void { }
	public function restores(): Void { }

	private function onCreateChannel(data: Dynamic, textStatus: String, jqXHR: JQXHR):Void {
		BennuRequest.channelId = data.id;
		_startPolling();
	}

	private function _startPolling(): Void {
		// TODO:  add the ability to set the timeout value
		var timeout = 10000;
		var path:String = "/api/channel/poll?channel=" + BennuRequest.channelId + "&timeoutMillis=" + Std.string(timeout);
		var ajaxOptions:AjaxOptions = {
	        contentType: "",
	        type: "GET"
		};

		listeningChannel = new LongPollingRequest("", _onPoll, path, ajaxOptions);
		listeningChannel.timeout = timeout + 2000;
		listeningChannel.start();
	}

	private function _onPoll(dataArr: Array<Dynamic>, textStatus: String, jqXHR: JQXHR) {
		if (dataArr == null || dataArr.length == 0) { return; }

		dataArr.iter(function(data:Dynamic): Void {

		});
	}
}
