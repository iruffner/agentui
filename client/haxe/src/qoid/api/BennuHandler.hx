package qoid.api;

import haxe.Json;
import m3.comm.LongPollingRequest;
import m3.exception.Exception;
import m3.jq.JQ;
import m3.observable.OSet;

import qoid.api.CrudMessage;
import qoid.api.Requester;
import qoid.api.EventDelegate;
import qoid.model.ModelObj;
import qoid.model.Filter;
import qoid.model.EM;

using Lambda;
using m3.helper.OSetHelper;

class BennuHandler implements ProtocolHandler {

	private var registeredHandles:Array<String>;

	// Message Paths
	private static var QUERY = "/api/query";
	private static var UPSERT = "/api/upsert";
	private static var DELETE = "/api/delete";
	private static var INTRODUCE = "/api/introduction/initiate";
	private static var DEREGISTER = "/api/query/deregister" ;
	private static var INTRO_RESPONSE = "/api/introduction/respond";
	private static var VERIFY = "/api/verification/verify";
	private static var VERIFICATION_ACCEPT = "/api/verification/accept";
	private static var VERIFICATION_REQUEST = "/api/verification/request";
	private static var VERIFICATION_RESPONSE = "/api/verification/respond";

	private var eventDelegate:EventDelegate;
	private var listeningChannel: LongPollingRequest;

	public function new() {
		this.eventDelegate = new EventDelegate(this);
		this.registeredHandles = new Array<String>();
	}

	private function createChannel(aliasName:String, successFunc:Dynamic->String->JQXHR->Void) {
		new SimpleRequest("/api/channel/create/" + aliasName, "", successFunc).start();		
	}

	public function addHandle(handle:String):Void {
		this.registeredHandles.push(handle);
	}

	public function deregisterAllSqueries():Void {
		if (this.registeredHandles.length > 0) {
			deregisterSqueries(this.registeredHandles.copy());
		}
	}

	public function deregisterSqueries(handles:Array<String>) {
		var context = Synchronizer.createContext(handles.length, "deregisterSqueriesResponse");
		var requests = new Array<ChannelRequestMessage>();
		for (handle in handles) {
			requests.push(new ChannelRequestMessage(DEREGISTER, context, new DeregisterMessage(handle)));
			this.registeredHandles.remove(handle);
		}
		new SubmitRequest(requests).start({async: false});
	}

	public function getProfiles(connectionIids:Array<String>) {
		var context = Synchronizer.createContext(1, "connectionProfile");
		var qm = QueryMessage.create("profile");
		qm.connectionIids = connectionIids;
		qm.local = false;
		new SubmitRequest([new ChannelRequestMessage(QUERY, context, qm)]).start();
	}

	public function login(login: Login): Void {
		createChannel(login.agentId, onCreateSubmitChannel);
	}

	public function createAgent(newUser: NewUser): Void {
		var req = new SimpleRequest("/api/agent/create/" + newUser.name, "", 
			function (data: Dynamic, textStatus: String, jqXHR: JQXHR) {
				EM.change(EMEvent.AgentCreated);
			}
		);
		req.start();
	}

	public function beginIntroduction(intro: IntroductionRequest): Void {
		var context = Synchronizer.createContext(1, "beginIntroduction");
		var req = new SubmitRequest([
			new ChannelRequestMessage(INTRODUCE, context, new IntroMessage(intro))]);
		req.start();
	}

	public function confirmIntroduction(confirmation: IntroResponseMessage): Void {
		var context = Synchronizer.createContext(1, "confirmIntroduction");
		var req = new SubmitRequest([
			new ChannelRequestMessage(INTRO_RESPONSE, context, confirmation)]);
		req.start();
	}

	public function deleteConnection(c:Connection): Void {
		c.deleted = true;
		var context = Synchronizer.createContext(1, "connectionDeleted");
		new SubmitRequest(
			[new ChannelRequestMessage(DELETE, context, DeleteMessage.create(c))]
		).start();
	}

	public function grantAccess(connectionIid:String, labelIid:String): Void {
		var acl = new LabelAcl(connectionIid, labelIid);
		var context = Synchronizer.createContext(1, "grantAccess");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(acl))
		]);
		req.start();
	}

	public function revokeAccess(lacls:Array<LabelAcl>): Void {
		var context = Synchronizer.createContext(1, "accessRevoked");
		var requests = new Array<ChannelRequestMessage>();
		for (lacl in lacls) {
			lacl.deleted = true;
			requests.push(new ChannelRequestMessage(DELETE, context, DeleteMessage.create(lacl)));
		}
		new SubmitRequest(requests).start();
	}

	public function filter(filterData: FilterData): Void {
		var context = Synchronizer.createContext(1, "filterContent");
		var requests = [
			new ChannelRequestMessage(QUERY, context, new QueryMessage(filterData)),
		];
		new SubmitRequest(requests).start();
	}

	public function createAlias(alias: Alias): Void {
		alias.name = alias.profile.name;

		var options:Dynamic = {
			profileName:   alias.profile.name, 
			profileImgSrc: alias.profile.imgSrc,
			parentIid: AppContext.ROOT_LABEL_ID
		};

		var context = Synchronizer.createContext(1, "aliasCreated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(alias, options))
		]);
		req.start();
	}
	
	public function updateAlias(alias: Alias): Void {
		alias.name = alias.profile.name;

		var context = Synchronizer.createContext(1, "aliasUpdated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(alias)),
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(alias.profile))
		]);
		req.start();
	}

	public function deleteAlias(alias: Alias): Void {
		alias.deleted = true;
		var context = Synchronizer.createContext(1, "aliasDeleted");
		new SubmitRequest(
			[new ChannelRequestMessage(DELETE, context, DeleteMessage.create(alias))]
		).start();
	}

	public function createContent(data:EditContentData):Void {
		var context = Synchronizer.createContext(1 + data.labelIids.length, "contentCreated");
		var requests = new Array<ChannelRequestMessage>();
		requests.push(new ChannelRequestMessage(UPSERT, context, CrudMessage.create(data.content)));
		for (iid in data.labelIids) {
			var labeledContent = new LabeledContent(data.content.iid, iid);
			requests.push(new ChannelRequestMessage(UPSERT, context, CrudMessage.create(labeledContent)));
		}
		new SubmitRequest(requests).start();
	}

	public function updateContent(data:EditContentData):Void {
		var currentLabels = AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid);
		// Find the labels to delete
		var labelsToDelete = new Array<LabeledContent>();
		for (labeledContent in currentLabels) {
			var found = false;
			for (iid in data.labelIids) {
				if (iid == labeledContent.labelIid) {
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
		for (iid in data.labelIids) {
			var found = false;
			for (labeledContent in currentLabels) {
				if (iid == labeledContent.labelIid) {
					found = true;
					break;
				}
			}
			if (!found) {
				labelsToAdd.push(new LabeledContent(data.content.iid, iid));
			}
		}
		var context = Synchronizer.createContext(1 + labelsToAdd.length + labelsToDelete.length, "contentUpdated");		
	
		var requests = new Array<ChannelRequestMessage>();
		requests.push(new ChannelRequestMessage(UPSERT, context, CrudMessage.create(data.content)));

		for (lc in labelsToDelete) {
			lc.deleted = true;
			requests.push(new ChannelRequestMessage(DELETE, context, DeleteMessage.create(lc)));
		}

		for (lc in labelsToAdd) {
			requests.push(new ChannelRequestMessage(UPSERT, context, CrudMessage.create(lc)));
		}

		new SubmitRequest(requests).start();
	}

	public function deleteContent(data:EditContentData):Void {
		var context = Synchronizer.createContext(1 + data.labelIids.length, "contentDeleted");		
		var requests = new Array<ChannelRequestMessage>();
		data.content.deleted = true;
		requests.push(new ChannelRequestMessage(DELETE, context, DeleteMessage.create(data.content)));

		for (lc in AppContext.GROUPED_LABELEDCONTENT.delegate().get(data.content.iid)) {
			lc.deleted = true;
			requests.push(new ChannelRequestMessage(DELETE, context, DeleteMessage.create(lc)));
		}

		new SubmitRequest(requests).start();
	}

	public function createLabel(data:EditLabelData): Void {
		var context = Synchronizer.createContext(1, "labelCreated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(data.label,
				{parentIid:data.parentIid}))]);
		req.start();
	}

	public function updateLabel(data:EditLabelData):Void {
		var context = Synchronizer.createContext(1, "labelUpdated");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(data.label))]);
		req.start();
	}

	private function getExistingLabelChild(parentIid:String, childIid:String):LabelChild {
		var lcs = new FilteredSet<LabelChild>(AppContext.MASTER_LABELCHILDREN, function(lc:LabelChild):Bool {
			return (lc.parentIid == parentIid && lc.childIid == childIid);
		});

		return lcs.iterator().next();
	}

	public function moveLabel(data:EditLabelData):Void {
		var lcs = new FilteredSet<LabelChild>(AppContext.MASTER_LABELCHILDREN, function(lc:LabelChild):Bool {
			return (lc.parentIid == data.parentIid && lc.childIid == data.label.iid);
		});
		var lcToRemove:LabelChild = getExistingLabelChild(data.parentIid, data.label.iid);

		var lcToAdd:LabelChild = getExistingLabelChild(data.newParentId, data.label.iid);
		if (lcToAdd == null) {
			lcToAdd = new LabelChild(data.newParentId, data.label.iid);
		} else {
			lcToAdd.deleted = false;
		}

		var context = Synchronizer.createContext(2, "labelMoved");
		var req = new SubmitRequest([
			new ChannelRequestMessage(DELETE, context, DeleteMessage.create(lcToRemove)),
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(lcToAdd))]);
		req.start();
	}
 
	public function copyLabel(data:EditLabelData):Void {
		var lcToAdd:LabelChild = getExistingLabelChild(data.newParentId, data.label.iid);
		if (lcToAdd == null) {
			lcToAdd = new LabelChild(data.newParentId, data.label.iid);
		} else {
			lcToAdd.deleted = false;
		}
		var context = Synchronizer.createContext(1, "labelCopied");
		var req = new SubmitRequest([
			new ChannelRequestMessage(UPSERT, context, CrudMessage.create(lcToAdd))]);
		req.start();
	}

	public function deleteLabel(data:EditLabelData):Void {
		// Delete the label child that is associated with this label
		var labelChildren:Array<LabelChild> = new FilteredSet<LabelChild>(AppContext.MASTER_LABELCHILDREN, function(lc:LabelChild):Bool {
			return (lc.parentIid == data.parentIid && lc.childIid == data.label.iid);
		}).asArray();

		var context = Synchronizer.createContext(labelChildren.length, "labelDeleted");

		var requests = new Array<ChannelRequestMessage>();

		for (lc in labelChildren) {
			lc.deleted = true;
			requests.push(new ChannelRequestMessage(DELETE, context, DeleteMessage.create(lc)));
		}
		new SubmitRequest(requests).start();
	}

	public function verificationRequest(vr:VerificationRequest) {
		var context = Synchronizer.createContext(1, "verificationRequest");
		var req = new SubmitRequest([
			new ChannelRequestMessage(VERIFICATION_REQUEST, context, new VerificationRequestMessage(vr))]);
		req.start();

	}

	private function onCreateSubmitChannel(data: Dynamic, textStatus: String, jqXHR: JQXHR):Void {
		AppContext.SUBMIT_CHANNEL = data.channelId;
		AppContext.UBER_ALIAS_ID = data.aliasIid;

		_startPolling(data.channelId);

		var context = Synchronizer.createContext(9, "initialDataLoad");
		var requests = [
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("alias")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("introduction")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("connection")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("notification")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("label")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("labelAcl")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("labeledContent")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("labelChild")),
			new ChannelRequestMessage(QUERY, context, QueryMessage.create("profile"))
		];
		new SubmitRequest(requests).start();
	}

	private function _startPolling(channelId:String): Void {
		// TODO:  add the ability to set the timeout value
		var timeout = 10000;
		var ajaxOptions:AjaxOptions = {
	        contentType: "",
	        type: "GET"
		};

		listeningChannel = new LongPollingRequest(channelId, "", AppContext.LOGGER, ResponseProcessor.processResponse, ajaxOptions);
		listeningChannel.timeout = timeout;
		listeningChannel.start();
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
}