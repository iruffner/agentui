package ap.model;


import ap.APhotoContext;
import qoid.model.ModelObj;

class AphotoModel {}

class APhotoContentTypes {
	public static var CONFIG: ContentType =  APhotoContext.APP_ROOT_LABEL_NAME + ".config";
}

class ConfigContentData extends ContentData {
	public var defaultImg: String;

	public function new () {
		super();
	}
}

class ConfigContent extends Content<ConfigContentData> {
	public function new () {
		super(APhotoContentTypes.CONFIG, ConfigContentData);
	}
}

