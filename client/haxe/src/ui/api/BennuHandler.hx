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

	// Message Paths
	private static var UPSERT = "/api/upsert";
	private static var DELETE = "/api/delete";
	private static var QUERY  = "/api/query";

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
		// Create a label child, which will connect the parent and the child
		var label = new Label(alias.name);
		var lc = new LabelChild("", label.iid);
		alias.rootLabelIid = label.iid;

		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, "create-alias", CrudMessage.create(alias)),
			new ChannelRequestMessage(UPSERT, "create-label", CrudMessage.create(label)),
			new ChannelRequestMessage(UPSERT, "create-labelChild", CrudMessage.create(lc))]);
		req.start();
	}
	
	public function updateAlias(alias: Alias): Void {
		// TODO:  Update the name of the rootLabel
		var upsertRequest = new UpsertRequest(alias, function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
       		AppContext.LOGGER.debug("upateAlias succeeded");
       		EM.change(EMEvent.NewAlias);
		});
		upsertRequest.start();
	}

	public function deleteAlias(alias: Alias): Void {
		// TODO:  Delete the label and label childs associated with this alias
		// NB:  Only delete labels that are orphans...
		var deleteRequest = new DeleteRequest(alias, function(data: Dynamic, textStatus: Dynamic, jqXHR: JQXHR){
			js.Lib.alert(data);
		});
		deleteRequest.start();
	}

	public function setDefaultAlias(alias: Alias): Void { }
	public function getAliasConnections(alias: Alias): Void { }

	public function getAliasLabels(alias:Alias) {
   		AppContext.AGENT.currentAlias.labelSet.clear();
   		AppContext.AGENT.currentAlias.labelSet.addAll(AppContext.getLabelChildren(alias.rootLabelIid).asArray());
	}

	public function createLabel(label:Label, parentIid:String): Void {
		// Create a label child, which will connect the parent and the child
		var lc = new LabelChild(parentIid, label.iid);

		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, "create-label", CrudMessage.create(label)),
			new ChannelRequestMessage(UPSERT, "create-labelChild", CrudMessage.create(lc))]);
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
		var path = DELETE;

		for (label in labels) {
			requests.push(new ChannelRequestMessage(path, "delete-label", CrudMessage.create(label)));
		}

		// Find all of the labelChilds that need to be deleted
		var labelChildren = new Array<LabelChild>();
		for (labelChild in labelChildren) {
			requests.push(new ChannelRequestMessage(path, "delete-labelChild", CrudMessage.create(labelChild)));
		}

		new SubmitRequest(requests).start();
	}

	public function beginIntroduction(intro: Introduction): Void { } 
	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void { }
	public function backup(/*backupName: String*/): Void { }
	public function restore(/*backupName: String*/): Void { }
	public function restores(): Void { }

	private function onCreateChannel(data: Dynamic, textStatus: String, jqXHR: JQXHR):Void {
		AppContext.CHANNEL = data.id;
		_startPolling();

		var req = new SubmitRequest([
			new ChannelRequestMessage(QUERY, "initialDataload-alias"     , new QueryMessage("alias")),
			new ChannelRequestMessage(QUERY, "initialDataload-label"     , new QueryMessage("label")),
			new ChannelRequestMessage(QUERY, "initialDataload-labelChild", new QueryMessage("labelChild"))]);
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

			var context:Array<String> = data.context.split("-");
			var objectType = context[1].toLowerCase();

			switch (objectType) {
				case "alias":
					ResponseProcessor.processAliasResponse(context[0], data);
				case "label":
					ResponseProcessor.processLabelResponse(context[0], data);
				case "labelchild":
					ResponseProcessor.processLabelChildResponse(context[0], data);
			}
		});
	}
}