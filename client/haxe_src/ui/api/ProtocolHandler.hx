package ui.api;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.Filter;
import ui.model.EventModel;

import ui.api.Requester;
import ui.api.ProtocolMessage;

using ui.helper.ArrayHelper;
using Lambda;

class ProtocolHandler {

	private var currentFilter: Filter;

	public function new() {
		EventModel.addListener("runFilter", new EventListener(function(filter: Filter): Void {
                this.filter(filter);
            })
        );

        EventModel.addListener("loadAlias", new EventListener(function(uid: String): Void {
                var alias: Alias = this.getAlias(uid);
                EventModel.change("aliasLoaded", alias);
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
		}
	}

	public function getUser(uid: String): User {
		new InitializeSessionRequest();
		return TestDao.getUser(uid);
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