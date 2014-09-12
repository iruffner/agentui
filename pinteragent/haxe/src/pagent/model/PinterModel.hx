package pagent.model;

import pagent.PinterContext;
import qoid.model.ModelObj;

class PinterModel {}

class PinterContentTypes {
	public static var CONFIG: ContentType =  PinterContext.APP_ROOT_LABEL_NAME + ".config";
}

class ConfigContentData extends ContentData {
	public var defaultImg: String;
	public var boardIid: String;

	public function new () {
		super();
	}
}

class ConfigContent extends Content<ConfigContentData> {
	public function new () {
		super(PinterContentTypes.CONFIG, ConfigContentData);
	}
}

