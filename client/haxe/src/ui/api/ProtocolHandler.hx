package ui.api;

import ui.model.ModelObj;
import ui.model.Filter;

interface ProtocolHandler {
	public function getUser(login: Login): Void;
	public function filter(filter: Filter): Void;
	public function stopCurrentFilter(onSuccessOrError: Void->Void, async: Bool=true): Void;
	public function nextPage(nextPageURI: String): Void;
	public function createUser(newUser: NewUser): Void;
	public function validateUser(token: String): Void;
	public function updateUser(user: Agent): Void;
	public function createContent(data:CreateContentData):Void;
	public function updateContent(content:Content<Dynamic>):Void;
	public function deleteContent(content:Content<Dynamic>):Void;
	public function createLabel(label:Label, parentIid:String): Void;
	public function deleteLabel(data:DeleteLabelData):Void;
	public function createAlias(alias: Alias): Void;
	public function deleteAlias(alias: Alias): Void;
	public function updateAlias(alias: Alias): Void;
	public function setDefaultAlias(alias: Alias): Void;
	public function beginIntroduction(intro: Introduction): Void; 
	public function confirmIntroduction(confirmation: IntroductionConfirmation): Void;
	public function backup(/*backupName: String*/): Void;
	public function restore(/*backupName: String*/): Void;
	public function restores(): Void;
}
