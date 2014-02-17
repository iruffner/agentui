package ui.helper;

import ui.model.ModelObj;
import m3.util.M;

class ModelHelper {
	public static function asConnection(alias: Alias): Connection {
		var conn: Connection = new Connection();
		conn.data = new Profile(alias.profile.name, M.getX(alias.profile.imgSrc, ""));
		return conn;
	}
}