package ui.api;

import ui.api.CrudMessage;
import ui.model.ModelObj;
import ui.model.Filter;

interface ProtocolHandler {
	public function getProfiles(connectionIids:Array<String>):Void;
	public function login(login: Login): Void;
	public function filter(filter: FilterData): Void;
	public function createAgent(newUser: NewUser): Void;
	public function createContent(data:EditContentData):Void;
	public function updateContent(data:EditContentData):Void;
	public function deleteContent(data:EditContentData):Void;
	public function createLabel(data:EditLabelData): Void;
	public function updateLabel(data:EditLabelData): Void;
	public function moveLabel(data:EditLabelData): Void;
	public function copyLabel(data:EditLabelData): Void;
	public function deleteLabel(data:EditLabelData):Void;
	public function createAlias(alias: Alias): Void;
	public function deleteAlias(alias: Alias): Void;
	public function updateAlias(alias: Alias): Void;
	public function beginIntroduction(intro: IntroductionRequest): Void; 
	public function confirmIntroduction(confirmation: IntroResponseMessage): Void;
	public function backup(/*backupName: String*/): Void;
	public function restore(/*backupName: String*/): Void;
	public function restores(): Void;
	public function grantAccess(connectionIid:String, labelIid:String): Void;
	public function revokeAccess(lacls:Array<LabelAcl>): Void;
	public function deleteConnection(c:Connection): Void;
	public function addHandle(handle:String): Void;
	public function deregisterListeners():Void;
}
