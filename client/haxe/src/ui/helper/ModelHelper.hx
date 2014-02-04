package ui.helper;

import ui.model.ModelObj;
import m3.util.M;

class ModelHelper {
	public static function asConnection(alias: Alias): Connection {
		var conn: Connection = new Connection();
		// conn.uid = alias.uid;
		conn.data = new UserData(alias.name, M.getX(alias.data.imgSrc, ""));
		// conn.imgSrc = alias.imgSrc;
		// conn.fname = alias.label;
		return conn;
	}
}