package m3.api;

class FBResponse {
	public var id: String;
}

class FBLoginResponse {
	public var status: String;
	public var authResponse: AuthResponse;
}

typedef AuthResponse = {
	accessToken: String, 
	expiresIn: Int,
	signedRequest: String,
	userID: String
}

class FBPermissionsResponse {
	public var data: Array<FBPermissions>;
	public var paging: FBPaging;
}

class FBRequestResponse extends FBResponse {
	public var request: String;
	public var to: Array<String>;
}

class FBPostResponse extends FBResponse {
	public var post_id: String;
}

class FBFriendsResponse extends FBResponse {
	public var data: Array<FBProfile>;
	public var paging: FBPaging;
}

class FBProfile extends FBResponse {
	public var name: String;
	public var first_name: String;
	public var last_name: String;
	public var gender: String;
	public var age_range: Dynamic;
	public var picture: FBPicture;
	public var birthday: String;
	public var location: {id: String, name: String};
	@:optional public var installed: Bool;

	// public function new(){ }
}

class FBPicture {
	public var data: FBPictureData;
}

class FBPictureData {
	public var url: String;
	public var is_silhouette: Bool;
	@:optional public var height: Int;
	@:optional public var width: Int;
}

class FBPaging {
	public var previous: String;
	public var next: String;
	public var cursors: FBCursors;
}

class FBCursors {
	public var after: String;
	public var before: String;
}

class AppFriendProfile {
	public var uid: String;
	public var name: String;
	public var first_name: String;
	public var last_name: String;
	public var sex: String;
	@:optional public var pic_big: String;
	@:optional public var pic_square: String;
	public var birthday: String;
	public var current_location: Dynamic;

	public static function toFBProfile(p: AppFriendProfile): FBProfile {
		var fbProfile: FBProfile = cast {};
		fbProfile.name = p.name;
		fbProfile.first_name = p.first_name;
		fbProfile.last_name = p.last_name;
		fbProfile.gender = p.sex;
		fbProfile.birthday = p.birthday;
		fbProfile.picture = cast {};
		fbProfile.picture.data = cast {};
		fbProfile.picture.data.url = p.pic_big != null ? p.pic_big : p.pic_square;
		return fbProfile;
	}
}

class FBAppFriendsResponse extends FBResponse {
	public var data: Array<AppFriendProfile>;
	@:optional public var paging: FBPaging;
}

class FBPermissions {
	public var installed: Int = 0;
	public var basic_info: Int = 0;
	public var public_profile: Int = 0;
	public var email: Int = 0;
	public var user_birthday: Int = 0;
	public var user_relationships: Int = 0;
	public var user_hometown: Int = 0;
	public var user_location: Int = 0;
	public var user_friends: Int = 0;
	public var publish_actions: Int = 0;
	public var publish_stream: Int = 0;
}