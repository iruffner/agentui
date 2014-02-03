package ui.api;

import haxe.Json;
import m3.exception.Exception;
import m3.jq.JQ;
import m3.observable.OSet;

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
	private static var REGISTER = "/api/squery/register" ;
	private static var DEREGISTER = "/api/squery/deregister" ;

	private var eventDelegate:EventDelegate;
	private var listeningChannel: LongPollingRequest;


	public function new() {
		this.eventDelegate = new EventDelegate(this);
	}

	public function getUser(login: Login): Void {
		// Establish a connection with the server to get the channel_id
		new BennuRequest("/api/channel/create/" + AppContext.AGENT.iid, "", onCreateChannel).start();
	}

	public function beginIntroduction(intro: Introduction): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	} 
	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function backup(/*backupName: String*/): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function restore(/*backupName: String*/): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function restores(): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function filter(filter: Filter): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function stopCurrentFilter(onSuccessOrError: Void->Void, async: Bool=true): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function nextPage(nextPageURI: String): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function createUser(newUser: NewUser): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function validateUser(token: String): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}
	public function updateUser(agent: Agent): Void {
		throw new Exception("E_NOTIMPLEMENTED"); 
	}

	public function createAlias(alias: Alias): Void {
		// Create a label child, which will connect the parent and the child
		var label = new Label(alias.name);
		var lc = new LabelChild("", label.iid);
		alias.rootLabelIid = label.iid;

		var context = Synchronizer.createContext(3, "aliasCreated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context + "alias", CrudMessage.create(alias)),
			new ChannelRequestMessage(UPSERT, context + "label", CrudMessage.create(label)),
			new ChannelRequestMessage(UPSERT, context + "labelChild", CrudMessage.create(lc))]);
		req.start();
	}
	
	public function updateAlias(alias: Alias): Void {
		var context = Synchronizer.createContext(1, "aliasUpdated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context + "alias", CrudMessage.create(alias))]);
		req.start();
	}

	public function deleteAlias(alias: Alias): Void {
		// TODO:  Delete the label and label childs associated with this alias
		// NB:  Only delete labels that are orphans...
		alias.deleted = true;
		var context = Synchronizer.createContext(1, "aliasDeleted");
		var requests = new Array<ChannelRequestMessage>();
		requests.push(new ChannelRequestMessage(DELETE, context + "alias", DeleteMessage.create(alias)));
		new SubmitRequest(requests).start();

		// TODO: Do we delete all content with this label?

		// TODO: the parentLabelIid might not be blank...
		var data = new EditLabelData(AppContext.LABELS.delegate().get(alias.rootLabelIid),"");
		deleteLabel(data);
	}

	public function createContent(data:EditContentData):Void {
		var context = Synchronizer.createContext(1 + data.labels.length, "contentCreated");
		var requests = new Array<ChannelRequestMessage>();
		requests.push(new ChannelRequestMessage(UPSERT, context + "content", CrudMessage.create(data.content)));
		for (label in data.labels) {
			var labeledContent = new LabeledContent(data.content.iid, label.iid);
			requests.push(new ChannelRequestMessage(UPSERT, context + "labeledContent", CrudMessage.create(labeledContent)));
		}
		new SubmitRequest(requests).start();
	}

	public function updateContent(data:EditContentData):Void {
		var currentLabels = AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid);
		// Find the labels to delete
		var labelsToDelete = new Array<LabeledContent>();
		for (labeledContent in currentLabels) {
			var found = false;
			for (label in data.labels) {
				if (label.iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if (!found) {
				labelsToDelete.push(labeledContent);
			}
		}

		// Find the labels to add
		var labelsToAdd = new Array<LabeledContent>();
		for (label in data.labels) {
			var found = false;
			for (labeledContent in currentLabels) {
				if (label.iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if (!found) {
				labelsToAdd.push(new LabeledContent(data.content.iid, label.iid));
			}
		}
		var context = Synchronizer.createContext(1 + labelsToAdd.length + labelsToDelete.length, "contentUpdated");		
	
		var requests = new Array<ChannelRequestMessage>();
		requests.push(new ChannelRequestMessage(UPSERT, context + "content", CrudMessage.create(data.content)));

		for (lc in labelsToDelete) {
			lc.deleted = true;
			requests.push(new ChannelRequestMessage(DELETE, context + "labeledContent", DeleteMessage.create(lc)));
		}

		for (lc in labelsToAdd) {
			requests.push(new ChannelRequestMessage(UPSERT, context + "labeledContent", CrudMessage.create(lc)));
		}

		new SubmitRequest(requests).start();
	}

	public function deleteContent(data:EditContentData):Void {
		var context = Synchronizer.createContext(1 + data.labels.length, "contentDeleted");		
		var requests = new Array<ChannelRequestMessage>();
		data.content.deleted = true;
		requests.push(new ChannelRequestMessage(DELETE, context + "content", CrudMessage.create(data.content)));

		for (lc in AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid)) {
			lc.deleted = true;
			requests.push(new ChannelRequestMessage(DELETE, context + "labeledContent", DeleteMessage.create(lc)));
		}

		new SubmitRequest(requests).start();
	}

	public function createLabel(data:EditLabelData): Void {
		// Create a label child, which will connect the parent and the child
		var lc = new LabelChild(data.parentIid, data.label.iid);
		var context = Synchronizer.createContext(2, "labelCreated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context + "label", CrudMessage.create(data.label)),
			new ChannelRequestMessage(UPSERT, context + "labelChild", CrudMessage.create(lc))]);
		req.start();
	}

	public function updateLabel(data:EditLabelData):Void {
		var context = Synchronizer.createContext(1, "labelUpdated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context + "label", CrudMessage.create(data.label))]);
		req.start();
	}

	public function moveLabel(data:EditLabelData):Void {
		var lcs = new FilteredSet<LabelChild>(AppContext.LABELCHILDREN, function(lc:LabelChild):Bool {
			return (lc.parentIid == data.parentIid && lc.childIid == data.label.iid);
		});
		var lcToRemove = lcs.iterator().next();

		var lcToAdd = new LabelChild(data.newParentId, data.label.iid);

		var context = Synchronizer.createContext(2, "labelMoved");
		var req = new SubmitRequest([
			new ChannelRequestMessage(DELETE, context + "labelChild", DeleteMessage.create(lcToRemove)),
			new ChannelRequestMessage(UPSERT, context + "labelChild", CrudMessage.create(lcToAdd))]);
		req.start();
	}
 
	public function copyLabel(data:EditLabelData):Void {
		var lcToAdd = new LabelChild(data.newParentId, data.label.iid);
		var context = Synchronizer.createContext(2, "labelCopied");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context + "labelChild", CrudMessage.create(lcToAdd))]);
		req.start();
	}

	public function deleteLabel(data:EditLabelData):Void {

		var labelChildren = AppContext.getDescendentLabelChildren(data.label.iid);
		var lcs = new FilteredSet<LabelChild>(AppContext.LABELCHILDREN, function(lc:LabelChild):Bool {
			return (lc.parentIid == data.parentIid && lc.childIid == data.label.iid);
		});
		labelChildren = labelChildren.concat(lcs.asArray());

		var context = Synchronizer.createContext(labelChildren.length, "labelDeleted");

		var requests = new Array<ChannelRequestMessage>();

		for (lc in labelChildren) {
			lc.deleted = true;
			requests.push(new ChannelRequestMessage(DELETE, context + "labelChild", DeleteMessage.create(lc)));
		}

		new SubmitRequest(requests).start();
	}

	private function onCreateChannel(data: Dynamic, textStatus: String, jqXHR: JQXHR):Void {
		AppContext.CHANNEL = data.id;
		_startPolling();

		var context = Synchronizer.createContext(5, "initialDataLoad");
		var requests = [
			new ChannelRequestMessage(QUERY, context + "aliases"        , new QueryMessage("alias")),
			new ChannelRequestMessage(QUERY, context + "labels"         , new QueryMessage("label")),
			new ChannelRequestMessage(QUERY, context + "contents"       , new QueryMessage("content")),
			new ChannelRequestMessage(QUERY, context + "labeledContents", new QueryMessage("labeledContent")),
			new ChannelRequestMessage(QUERY, context + "labelChildren"  , new QueryMessage("labelChild"))
		];
		new SubmitRequest(requests).start();
		var types = ["alias", "label", "labelchild", "content", "labeledcontent"];
		requests = [new ChannelRequestMessage(REGISTER, "aliases-changes", new RegisterMessage(types, "listeningToAll"))];
		new SubmitRequest(requests).start();
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