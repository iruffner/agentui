package ui.helper;

import ui.model.ModelObj;

class ModelHelper {
	public static function asConnection(alias: Alias): Connection {
		var conn: Connection = new Connection();
		conn.uid = alias.uid;
		conn.imgSrc = alias.imgSrc;
		conn.fname = alias.label;
		return conn;
	}
}