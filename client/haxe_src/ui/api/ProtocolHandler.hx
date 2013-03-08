package ui.api;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EventModel;
import ui.model.ModelEvents;

import ui.api.Requester;
import ui.api.ProtocolMessage;

using ui.helper.ArrayHelper;
using Lambda;

class ProtocolHandler {

	private var currentFilter: Filter;

	public function new() {
		EventModel.addListener(ModelEvents.RunFilter, new EventListener(function(filter: Filter): Void {
                this.filter(filter);
            })
        );

        EventModel.addListener(ModelEvents.LoadAlias, new EventListener(function(uid: String): Void {
                var alias: Alias = this.getAlias(uid);
                EventModel.change(ModelEvents.AliasLoaded, alias);
            })
        );

        EventModel.addListener(ModelEvents.Login, new EventListener(function(login: Login): Void {
                getUser(login);
            })
        );
	}

	public function filter(filter: Filter): Void {
		filter.rootNode.log();
		ui.AgentUi.CONTENT.clear();
		
		if(filter.rootNode.hasChildren()) {
			var string: String = filter.kdbxify();
			ui.AgentUi.LOGGER.debug("FILTER --> feed(  " + string + "  )");
			var content: Array<Content> =TestDao.getContent(filter.rootNode);
			ui.AgentUi.CONTENT.addAll(content);
			var evalRequest: EvalRequest = new EvalRequest();
			var evalRequestData: EvalRequestData = new EvalRequestData();
			evalRequestData.expression = "feed( " + string + " )";
			evalRequestData.sessionURI = "agent-session://myLovelySession/1234,";
			evalRequest.contents = evalRequestData;
			new LongPollingRequest(evalRequest).start();
		}
	}

	public function getUser(login: Login): Void {
		var request: InitializeSessionRequest = new InitializeSessionRequest();
		var requestData: InitializeSessionRequestData = new InitializeSessionRequestData();
		request.contents = requestData;
		requestData.agentURI = "agent://" + login.username + ":" + login.password + "@host:1234/agentId";
		//TODO send the request

		EventModel.change(ModelEvents.User, TestDao.getUser(null));
	}

	public function getAlias(uid: String): Alias {
		return TestDao.getAlias(uid);
	}

	public function getConnections(user: User): Array<Connection> {
		return TestDao.getConnections(user);
	}

	public function getLabels(user: User): Array<Label> {
		return TestDao.getLabels(user);
	}

}