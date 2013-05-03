package ui.model;

enum ModelEvents {
	FILTER_RUN; //occurs when filter is in live mode and there is a change to the filter, or the filter is switched to live mode
	FILTER_CHANGE; //occurs when filter is in build mode and there is a change to the filter

	MoreContent;
	NextContent;
	EndOfContent;
	NewContentCreated;

	LoadAlias;
	AliasLoaded;

	Login;
	User;

	FitWindow;

	CreateLabel;
}