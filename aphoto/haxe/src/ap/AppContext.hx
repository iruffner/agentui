// package ap;

// import ap.APhoto;
// import ap.APhotoContext;
// import ap.model.EM;

// import haxe.ds.StringMap;

// import m3.jq.JQ;
// import m3.log.Logga;
// import m3.log.LogLevel;
// import m3.observable.OSet;
// import m3.serialization.Serialization;

// import qoid.model.ModelObj;

// using m3.helper.ArrayHelper;
// using m3.helper.StringHelper;
// using m3.helper.OSetHelper;

// class AppContext {
//     public static var SUBMIT_CHANNEL:String;
//     public static var UBER_ALIAS_ID:String;
//     public static var ROOT_LABEL_ID:String;

//     public static var LOGGER: Logga;
//     public static var ALIASES:ObservableSet<Alias>;
//     public static var SERIALIZER: Serializer;

//     public static var NOTIFICATIONS:FilteredSet<Notification<Dynamic>>;
//     public static var MASTER_NOTIFICATIONS: ObservableSet<Notification<Dynamic>>;

//     public static var LABELS:ObservableSet<Label>;

//     public static var LABELACLS:ObservableSet<LabelAcl>;
//     public static var LABELACLS_ByConnection: GroupedSet<LabelAcl>;
//     public static var LABELACLS_ByLabel: GroupedSet<LabelAcl>;
    
//     public static var LABELCHILDREN:ObservableSet<LabelChild>;
//     public static var GROUPED_LABELCHILDREN: GroupedSet<LabelChild>;

//     public static var LABELEDCONTENT:ObservableSet<LabeledContent>;
//     public static var GROUPED_LABELEDCONTENT: GroupedSet<LabeledContent>;

//     public static var PROFILES:ObservableSet<Profile>;

//     public static var currentAlias: Alias;


//     public static function init() {
//     	LOGGER = new Logga(LogLevel.DEBUG);

//         // INTRODUCTIONS = new ObservableSet<Introduction>(ModelObjWithIid.identifier);

//         MASTER_NOTIFICATIONS = new ObservableSet<Notification<Dynamic>>(ModelObjWithIid.identifier);
//         NOTIFICATIONS = new FilteredSet<Notification<Dynamic>>(MASTER_NOTIFICATIONS, function(a:Notification<Dynamic>):Bool {
//             return !a.consumed;
//         });

//         ALIASES = new ObservableSet<Alias>(ModelObjWithIid.identifier);
//         ALIASES.listen(function(a:Alias, evt:EventType):Void {
//             if (evt.isAddOrUpdate()) {
//                 var p = PROFILES.getElementComplex(a.iid, "aliasIid");
//                 if (p != null) {
//                     a.profile = p;
//                 }
//                 if (evt.isAdd()) {
//                     EM.change(EMEvent.AliasCreated, a);
//                 } else {
//                     EM.change(EMEvent.AliasUpdated, a);
//                 }
//             }
//         });

//         LABELS = new ObservableSet<Label>(Label.identifier);

//         LABELACLS = new ObservableSet<LabelAcl>(LabelAcl.identifier);
//         LABELACLS_ByConnection = new GroupedSet<LabelAcl>(LABELACLS, function(l:LabelAcl):String {
//             return l.connectionIid;
//         });
//         LABELACLS_ByLabel = new GroupedSet<LabelAcl>(LABELACLS, function(l:LabelAcl):String {
//             return l.labelIid;
//         });

//         LABELCHILDREN = new ObservableSet<LabelChild>(LabelChild.identifier);
//         GROUPED_LABELCHILDREN = new GroupedSet<LabelChild>(LABELCHILDREN, function(lc:LabelChild):String {
//             return lc.parentIid;
//         });

//         LABELEDCONTENT = new ObservableSet<LabeledContent>(LabeledContent.identifier);
//         GROUPED_LABELEDCONTENT = new GroupedSet<LabeledContent>(LABELEDCONTENT, function(lc:LabeledContent):String {
//             return lc.contentIid;
//         });
        
//         PROFILES = new ObservableSet<Profile>(Profile.identifier);
//         PROFILES.listen( function(p:Profile, evt:EventType): Void{
//             if (evt.isAddOrUpdate()) {
//                 var alias = ALIASES.getElement(p.aliasIid);
//                 if (alias != null) {
//                     alias.profile = p;
//                     ALIASES.addOrUpdate(alias);
//                 }
//             }
//         });

// 		SERIALIZER = new Serializer();
//         SERIALIZER.addHandler(Content, new AphotoContentHandler());
//         SERIALIZER.addHandler(Notification, new NotificationHandler());

//     	registerGlobalListeners();
//     }

//     public static function isAliasRootLabel(iid:String):Bool {
//         for (alias in ALIASES) {
//             if (alias.rootLabelIid == iid) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     public static function getUberLabelIid() {
//         return ALIASES.getElement(AppContext.UBER_ALIAS_ID).rootLabelIid;
//     }

//     static function onInitialDataLoadComplete(nada:{}) {
//         ROOT_LABEL_ID = ALIASES.getElement(UBER_ALIAS_ID).rootLabelIid;

//         // Set the current alias
//         currentAlias = ALIASES.getElement(UBER_ALIAS_ID);
//         for (alias in ALIASES) {
//             if (alias.data.isDefault == true) {
//                 currentAlias = alias;
//                 break;
//             }
//         }

//         var rootLabelOfThisApp: Label = AppContext.LABELS.getElementComplex(APhotoContext.APP_ROOT_LABEL_NAME, function(l: Label) {
//                 return l.name;
//             });

//         var rootLabelOfAllApps: Label = AppContext.LABELS.getElementComplex(APhotoContext.ROOT_LABEL_NAME_OF_ALL_APPS, function(l: Label) {
//             return l.name;
//         });

//         if(rootLabelOfThisApp == null) {

//             var createRootLabelOfThisApp = function(theRootLabelOfAllApps: Label) {
//                 //listen for changes to the labels since the next add event should be our new label
//                 var listener: Label->EventType->Void = null;
//                 listener = function(l: Label, evtType: EventType) {
//                         if(evtType.isAdd()) {
//                             if(l.name == APhotoContext.APP_ROOT_LABEL_NAME) {
//                                 LABELS.removeListener(listener);
//                                 APhotoContext.ROOT_ALBUM = l;
//                                 EM.change(EMEvent.AliasLoaded, currentAlias);
//                                 EM.change(EMEvent.APP_INITIALIZED);
//                             }
//                         }
//                     };
//                 LABELS.listen(listener, false);
                
//                 var label: Label = new Label();
//                 label.name = APhotoContext.APP_ROOT_LABEL_NAME;
//                 var eventData = new EditLabelData(label, APhotoContext.ROOT_LABEL_OF_ALL_APPS.iid);
//                 EM.change(EMEvent.CreateLabel, eventData);
//             }

//             if(rootLabelOfAllApps == null) {
//                 //listen for changes to the labels since the next add event should be our new label
//                 var listener: Label->EventType->Void = null;
//                 listener = function(l: Label, evtType: EventType) {
//                         if(evtType.isAdd()) {
//                             if(l.name == APhotoContext.ROOT_LABEL_NAME_OF_ALL_APPS) {
//                                 LABELS.removeListener(listener);
//                                 APhotoContext.ROOT_LABEL_OF_ALL_APPS = l;
//                                 createRootLabelOfThisApp(l);
//                             }
//                         }
//                     };
//                 LABELS.listen(listener, false);
                
//                 var label: Label = new Label();
//                 label.name = APhotoContext.ROOT_LABEL_NAME_OF_ALL_APPS;
//                 var eventData = new EditLabelData(label, AppContext.currentAlias.rootLabelIid);
//                 EM.change(EMEvent.CreateLabel, eventData);
//             } else {
//                 APhotoContext.ROOT_LABEL_OF_ALL_APPS = rootLabelOfAllApps;
//                 createRootLabelOfThisApp(rootLabelOfAllApps);
//             }
//         } else {
//             APhotoContext.ROOT_LABEL_OF_ALL_APPS = rootLabelOfAllApps;
//             APhotoContext.ROOT_ALBUM = rootLabelOfThisApp;
//             EM.change(EMEvent.AliasLoaded, currentAlias);
//             EM.change(EMEvent.APP_INITIALIZED);
//         }
//     }

// 	static function registerGlobalListeners() {
//         new JQ(js.Browser.window).on("unload", function(evt: JQEvent){
//             EM.change(EMEvent.UserLogout);
//         });

//         EM.addListener(EMEvent.InitialDataLoadComplete, 
//                        onInitialDataLoadComplete,
//                        "AppContext-InitialDataLoadComplete");

//         EM.addListener(EMEvent.AliasLoaded, function(a:Alias){
//             js.Browser.document.title = a.profile.name + " | aPhoto"; 
//         });
// 	}

//     public static function getLabelDescendents(parentIid:String):ObservableSet<Label> {
//         var labelDescendents = new ObservableSet<Label>(Label.identifier);

//         var getDescendentIids:String->Array<String>->Void;
//         getDescendentIids = function(iid:String, iidList:Array<String>):Void {
//             iidList.insert(0, iid);
//             var children: Array<LabelChild> = new FilteredSet(AppContext.LABELCHILDREN, function(lc:LabelChild):Bool {
//                 return lc.parentIid == iid;
//             }).asArray();

//             for (i in 0...children.length) {
//                 getDescendentIids(children[i].childIid, iidList);
//             }
//         };

//         var iid_list = new Array<String>();
//         getDescendentIids(parentIid, iid_list);
        
//         //edit by isaiah
//         iid_list.remove(parentIid);

//         for (iid_ in iid_list) {
//             var label = LABELS.getElement(iid_);
//             if (label == null) {
//                 AppContext.LOGGER.error("LabelChild references missing label: " + iid_);
//             } else {
//                 labelDescendents.add(label);
//             }
//         }
//         return labelDescendents;
//     }
// }