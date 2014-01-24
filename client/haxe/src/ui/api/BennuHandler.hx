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

		var iid = Synchronizer.add(3, ResponseProcessor.aliasCreated);
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, iid + "-alias", CrudMessage.create(alias)),
			new ChannelRequestMessage(UPSERT, iid + "-label", CrudMessage.create(label)),
			new ChannelRequestMessage(UPSERT, iid + "-labelChild", CrudMessage.create(lc))]);
		req.start();
	}
	
	public function updateAlias(alias: Alias): Void {
		var iid = Synchronizer.add(1, ResponseProcessor.aliasUpdated);
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, iid + "-alias", CrudMessage.create(alias))]);
		req.start();
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
		var iid = Synchronizer.add(2, ResponseProcessor.labelCreated);
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, iid + "-label", CrudMessage.create(label)),
			new ChannelRequestMessage(UPSERT, iid + "-labelChild", CrudMessage.create(lc))]);
		req.start();
	}

	public function updateLabel(label:Label):Void {
		// TODO: Upsert Request 
	}

	public function moveLabel(label:Label, parent:Label):Void {
		// TODO:  Delete labelChild, add labelChild
	}
 
	public function deleteLabels(labels:Array<Label>):Void {
		var iid = Synchronizer.genIid();

		var requests = new Array<ChannelRequestMessage>();

		for (label in labels) {
			requests.push(new ChannelRequestMessage(DELETE, iid + "-label", CrudMessage.create(label)));
		}

		// Find all of the labelChilds that need to be deleted
		var labelChildren = new Array<LabelChild>();
		for (labelChild in labelChildren) {
			requests.push(new ChannelRequestMessage(DELETE, iid + "-labelChild", CrudMessage.create(labelChild)));
		}

		Synchronizer.add(requests.length, ResponseProcessor.labelDeleted, iid);
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

		var iid = Synchronizer.add(3, ResponseProcessor.initialDataLoad);
		var req = new SubmitRequest([
			new ChannelRequestMessage(QUERY, iid + "-aliases"     , new QueryMessage("alias")),
			new ChannelRequestMessage(QUERY, iid + "-labels"     , new QueryMessage("label")),
			new ChannelRequestMessage(QUERY, iid + "-labelChildren", new QueryMessage("labelChild"))]);
		req.start();
	}

	private function _startPolling(): Void {
		// TODO:  add the ability to set the timeout value
		var timeout = 10000;
		var ajaxOptions:AjaxOptions = {
	        contentType: "",
	        type: "GET"
		};

		listeningChannel = new LongPollingRequest("", ResponseProcessor.processResponse, ajaxOptions);
		listeningChannel.timeout = timeout;
		listeningChannel.start();
	}
}