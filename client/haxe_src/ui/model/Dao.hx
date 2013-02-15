package ui.model;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EventModel;

using ui.helper.ArrayHelper;

class Dao {

	public function new() {
		EventModel.addListener("runFilter", new EventListener(function(node: Node): Void {
                this.filter(node);
            })
        );

        EventModel.addListener("loadAlias", new EventListener(function(uid: String): Void {
                var alias: Alias = this.getAlias(uid);
                EventModel.change("aliasLoaded", alias);
            })
        );
	}

	public function filter(node: Node): Void {
		node.log();
		ui.AgentUi.CONTENT.clear();
		if(node.nodes.hasValues()) {
			var content: Array<Content> = ui.model.TestDao.getContent(node);
			for(c_ in 0...content.length) {
				ui.AgentUi.CONTENT.add(content[c_]);
			}
		}
		EventModel.change("filterComplete", node);
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