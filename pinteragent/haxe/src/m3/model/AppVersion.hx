package m3.model;


class AppVersion {
	public var major: Int;
	public var minor: Int;
	public var release: Int;

	public function new(major: Int, minor: Int, release: Int) {
		this.major = major;
		this.minor = minor;
		this.release = release;
	}

	public function toString(): String {
		return major + "." + minor + "." + release;
	}

	public function isAtLeast(v: AppVersion): Bool {
		return 
			major > v.major ||
			major == v.major && minor > v.minor ||
			major == v.major && minor == v.minor && release >= v.release;
	}

	public static function fromString(versionString: String): AppVersion {
		var v: Array<String> = versionString.split(".");
		return new AppVersion(Std.parseInt(v[0]), Std.parseInt(v[1]), Std.parseInt(v[2]));
	}
}