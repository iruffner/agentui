package pagent.model;

import qoid.model.ModelObj;

class PinterModel {}

class PinterContentTypes {
	public static var CONFIG: ContentType = "";
}

class ConfigContentData extends ContentData {
	public var defaultImg: String;

	public function new () {
		super();
	}
}

class ConfigContent extends Content<ConfigContentData> {
	public function new () {
		super(PinterContentTypes.CONFIG, ConfigContentData);
	}
}

