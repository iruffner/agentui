package ui.api;

import haxe.Json;
import m3.jq.JQ;

import ui.api.CrudMessage;
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
		EM.change(EMEvent.AGENT, agent);
		EM.change(EMEvent.FitWindow);

		// Establish a connection with the server to get the channel_id
		new BennuRequest("/api/channel/create", "", onCreateChannel).start();
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

	public function deleteAlias(alias: Alias): Void {
		var deleteRequest = new DeleteRequest(alias, function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
			js.Lib.alert(data);
		});
		deleteRequest.start();
	}

	public function setDefaultAlias(alias: Alias): Void { }
	public function getAliasConnections(alias: Alias): Void { }

	public function getAliasLabels(alias:Alias) {
		var qr = new QueryRequest("label", "", 
			function (data: Array<Dynamic>, textStatus: String, jqXHR: JQXHR):Void {

        		AppContext.AGENT.currentAlias.labelSet.clear();
	        	for (label_ in data) {
	        		var label = AppContext.SERIALIZER.fromJsonX(label_, Label);
	        		AppContext.AGENT.currentAlias.labelSet.add(label);
	        	}
				EM.change(EMEvent.FitWindow);
			}
		);
		qr.start();
	}

	public function updateLabels():Void {
		js.Lib.alert("NOOP:  updateLabels");
	}

	public function createLabel(label:Label): Void {
		// Create a label child, which will connect the parent and the child
		var lc = new LabelChild(label.parentIid, label.iid);

		var req = new SubmitRequest([
			new ChannelRequestMessage("/api/upsert", "req1.context", CrudMessage.create(label)),
			new ChannelRequestMessage("/api/upsert", "req2.context", CrudMessage.create(lc))]);
		req.start();
	}

	public function updateLabel(label:Label):Void {
		// TODO: Upsert Request 
	}

	public function moveLabel(label:Label, parent:Label):Void {
		// TODO:  Delete labelChild, add labelChild
	}
 
	public function deleteLabels(labels:Array<Label>):Void {
		var requests = new Array<ChannelRequestMessage>();
		var path = "/api/delete";

		for (label in labels) {
			requests.push(new ChannelRequestMessage(path, "delete-" + label.iid, CrudMessage.create(label)));
		}

		// Find all of the labelChilds that need to be deleted
		var labelChildren = new Array<LabelChild>();
		for (labelChild in labelChildren) {
			requests.push(new ChannelRequestMessage(path, "delete-" + labelChild.iid, CrudMessage.create(labelChild)));
		}

		var req = new SubmitRequest(requests);
		req.start();
	}

	public function beginIntroduction(intro: Introduction): Void { } 
	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void { }
	public function backup(/*backupName: String*/): Void { }
	public function restore(/*backupName: String*/): Void { }
	public function restores(): Void { }

	private function onCreateChannel(data: Dynamic, textStatus: String, jqXHR: JQXHR):Void {
		AppContext.CHANNEL = data.id;
		_startPolling();

		// Get all aliases for the agent
		var qr = new QueryRequest("alias", "", function (data: Array<Dynamic>, textStatus: String, jqXHR: JQXHR):Void {
        	
        	var agent = ui.AppContext.AGENT;

        	for (alias_ in data) {
        		var alias = AppContext.SERIALIZER.fromJsonX(alias_, Alias);
        		agent.aliasSet.add(alias);
        	}

        	if (agent.aliasSet.isEmpty()) {
        		AppContext.LOGGER.error("Agent has no Aliases!!");
        		agent.currentAlias = new Alias();
        		agent.currentAlias.name = "default";
        		agent.aliasSet.add(agent.currentAlias);
        	} else {
        		agent.currentAlias = agent.aliasSet.iterator().next();
        	}
			EM.change(EMEvent.AGENT, agent);
			EM.change(EMEvent.FitWindow);
		});
		qr.start();

		initialDataload();
	}

	private function initialDataload():Void {
		var req = new SubmitRequest([
			new ChannelRequestMessage("/api/query", "label-initialDataload"     , new QueryMessage("label")),
			new ChannelRequestMessage("/api/query", "labelChild-initialDataload", new QueryMessage("labelChild"))]);
		req.start();

	}

	private function _startPolling(): Void {
		// TODO:  add the ability to set the timeout value
		var timeout = 10000;
		var ajaxOptions:AjaxOptions = {
	        contentType: "",
	        type: "GET"
		};

		listeningChannel = new LongPollingRequest("", _onPoll, ajaxOptions);
		listeningChannel.timeout = timeout;
		listeningChannel.start();
	}

	private function _onPoll(dataArr: Array<Dynamic>, textStatus: String, jqXHR: JQXHR) {
		if (dataArr == null || dataArr.length == 0) { return; }

		dataArr.iter(function(data:Dynamic): Void {

			// TODO:  Process the different requests...
		});
	}
}