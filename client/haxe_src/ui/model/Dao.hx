package ui.model;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EventModel;

using ui.helper.ArrayHelper;
using Lambda;

class Dao {

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
			var content: Array<Content> = ui.model.TestDao.getContent(filter.rootNode);
			ui.AgentUi.CONTENT.addAll(content);
		}

		EventModel.change("filterComplete", filter);
	}

	public function getUser(uid: String): User {
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