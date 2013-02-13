package ui.model;

import ui.model.ModelObj;
import ui.model.Node;
import ui.model.EventModel;

using ui.helper.ArrayHelper;

class Dao {

	public function new() {
		EventModel.addListener("filter", new EventListener(function(node: Node): Void {
                this.filter(node);
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

	public function getConnections(user: User): Array<Connection> {
		return TestDao.getConnections(user);
	}

	public function getLabels(user: User): Array<Label> {
		return TestDao.getLabels(user);
	}

}