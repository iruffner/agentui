package ui.observable;


import ui.helper.StringHelper;
import ui.exception.Exception;
import ui.util.M;
import ui.util.SizedHash;

using Lambda;
/*

Features
	groupBy
	sorting


Needs
	hash
		size/isEmpty


Upon listening do you get a bunch of adds?

*/

interface OSet<T> {
	function identifier(): T->String;
	function listen(l: T->EventType->Void): Void;
	function iterator(): Iterator<T>;
	function delegate(): Hash<T>;
}

class EventManager<T> {

	var _listeners: Array<T->EventType->Void>;
	var _set: OSet<T>;

	public function new(set: OSet<T>) {
		_set = set;
		_listeners = [];
	}
	public function add(l: T->EventType->Void) {
		_set.iter(
			M.fn1(
				l(it, EventType.Add)
			)
		);	
		_listeners.push(l);		
	}
	public function fire(t: T, type: EventType) {
		_listeners.iter(
			M.fn1(
				it(t,type)
			)
		);
	}

}

class EventType {

	public static var Add = new EventType("Add", true, false);
	public static var Update = new EventType("Update", false, true);
	public static var Delete = new EventType("Delete", false, false);

	var _name: String;
	var _add: Bool;
	var _update: Bool;

	function new(name: String, add: Bool, update: Bool) {		
		_name = name;
		_add = add;
		_update = update;
	}

	public function name() {
		return _name;
	}

	public function isAdd() {
		return _add;
	}

	public function isUpdate() {
		return _add;
	}

	public function isAddOrUpdate() {
		return _add || _update;
	}

	public function isDelete() {
		return !(_add || _update);
	}

}


class ObservableSet<T> extends AbstractSet<T> {

	var _delegate: SizedHash<T>;
	var _identifier: T->String;

	public function new(identifier: T->String) {
		super();
		_identifier = identifier;
		_delegate = new SizedHash();
	}

	public function add(t: T) {
		addOrUpdate(t);
	}

	public override function iterator(): Iterator<T> {
		return _delegate.iterator();
	}

	public function isEmpty(): Bool {
		return _delegate.empty();
	}

	public function addOrUpdate(t: T) {
		var key = identifier()(t);
		var type;
		if ( _delegate.exists(key) ) {
			type = EventType.Update;
		} else {
			type = EventType.Add;
		}
		_delegate.set(key, t);
		fire(t, type);
	}

	public override function delegate(): Hash<T>{
		return _delegate;
	}

	public function update(t: T) {
		addOrUpdate(t);
	}

	public function delete(t: T) {
		var key = identifier()(t);
		if ( _delegate.exists(key) ) {
			_delegate.remove(key);
			fire(t, EventType.Delete);
		}
	}

	public override function identifier() {
		return _identifier;
	}

	public function clear(): Void {
		var iter: Iterator<T> = iterator();
		while(iter.hasNext()) {
			delete(iter.next());
		}
	}

	public function size(): Int {
		return _delegate.size;
	}

}

class AbstractSet<T> implements OSet<T> {

	var _eventManager: EventManager<T>;

	public function new() {
		_eventManager = new EventManager(this);		
	}

	public function listen(l: T->EventType->Void): Void {
		_eventManager.add(l);
	}

	public function filter(f: T->Bool): OSet<T> {
		return new FilteredSet(this, f);
	}

	public function map<U>(f: T->U): OSet<U> {
		return new MappedSet<T,U>(this, f);
	}

	function fire(t: T, type: EventType) {
		_eventManager.fire(t, type);
	}

	public function identifier(): T->String {
		return throw new Exception("implement me");
	}

	public function iterator(): Iterator<T> {
		return throw new Exception("implement me");
	}

	public function delegate(): Hash<T> {
		return throw new Exception("implement me");
	}
}


class MappedSet<T,U> extends AbstractSet<U> {

	var _source: OSet<T>;
	var _mapper: T->U;
	var _mappedSet: Hash<U>;

	public function new(source: OSet<T>, mapper: T->U) {
		super();
		_mappedSet = new Hash();
		_source = source;
		_source.listen(function(t, type) {
			var key = _source.identifier()(t);
			var mappedValue;
			if ( type.isAddOrUpdate() ) {
				mappedValue = mapper(t);
				_mappedSet.set(key, mappedValue);
			} else {
				mappedValue = _mappedSet.get(key);
				_mappedSet.remove(key);
			}
			fire(mappedValue, type);
		});
	}

	public override function identifier(): U->String {
		return identify;
	}

	public override function delegate() {
		return _mappedSet;
	}

	function identify(u: U): String {
		var keys = _mappedSet.keys();
		while ( keys.hasNext() ) {
			var key = keys.next();
			if ( _mappedSet.get(key) == u ) {
				return key;
			}
		}
		throw new Exception("unable to find identity for " + u);
	}

	public override function iterator(): Iterator<U> {
		return _mappedSet.iterator();
	}

}


class FilteredSet<T> extends AbstractSet<T> {

	var _filteredSet: Hash<T>;
	var _source: OSet<T>;
	var _filter: T -> Bool;
	var _identifier: T->String;

	public function new(source: OSet<T>, filter: T -> Bool) {
		super();		
		_filteredSet = new Hash();
		_source = source;
		_filter = filter;
		_identifier = source.identifier();

		_source.listen(function(t, type) {
			if ( type.isAddOrUpdate() ) {
				apply(t);
			} else if ( type.isDelete() ) {
				var key = identifier()(t);
				if ( _filteredSet.exists(key) ) {
					_filteredSet.remove(key);
					fire(t, type);
				}
			}
		});

	}

	public override function delegate() {
		return _filteredSet;
	}
	
	function apply(t: T) {
		var key = _source.identifier()(t);
		var f = _filter(t);
		var exists = _filteredSet.exists(key);
		if ( f != exists ) {
			if ( f ) {
				_filteredSet.set(key, t);
				fire(t, EventType.Add);
			} else {
				_filteredSet.remove(key);
				fire(t, EventType.Delete);
			}
		} else if ( exists ) {
			fire(t, EventType.Update);			
		}
	}

	public function refilter() {
		_source.iter(M.fn1(apply(it)));
	}

	public override function identifier() {
		return _identifier;
	}

	public override function iterator(): Iterator<T> {
		return _filteredSet.iterator();
	}
}


class GroupedSet<T> extends AbstractSet<OSet<T>> {

	var _source: OSet<T>;
	var _groupingFn: T->String;
	var _groupedSets: Hash<ObservableSet<T>>;
	var _identityToGrouping: Hash<String>;

	public function new(source: OSet<T>, groupingFn: T->String) {
		super();
		_source = source;
		_groupingFn = groupingFn;
		_groupedSets = new Hash();
		_identityToGrouping = new Hash();
		source.listen(function(t, type) {
			var groupingKey = groupingFn(t);
			var previousGroupingKey = _identityToGrouping.get(groupingKey);
			if ( type.isAddOrUpdate() ) {
				if ( previousGroupingKey != groupingKey ) {
					delete(t);
					add(t);
				}
			} else {
				delete(t);
			}
		});
	}


	function delete(t: T) {
		var id = _source.identifier()(t);
		var key = _identityToGrouping.get(id);
		if ( key != null ) {
			_identityToGrouping.remove(id);
			var groupedSet = _groupedSets.get(key);
			if ( groupedSet != null ) {
				groupedSet.delete(t);
				// if the grouped set is empty delete it
				if ( groupedSet.isEmpty() ){
					_groupedSets.remove(key);
					fire(groupedSet, EventType.Delete);
				} else {
					fire(groupedSet, EventType.Update);
				}
			} else {
				// this should never happen because a key in _identityToGrouping means a key in _groupedSets
			}
		} else {
			// doesn't exist in this GroupedSet
		}
	}
	function add(t: T) {
		var id = _source.identifier()(t);
		var key = _identityToGrouping.get(id);
		if ( key != null ) {
			throw new Exception("cannot add it is already in the list" + id + " -- " + key);
		}
		key = _groupingFn(t);
		_identityToGrouping.set(id, key);
		var groupedSet = _groupedSets.get(key);
		if ( groupedSet == null ) {
			groupedSet = new ObservableSet<T>(_source.identifier());
			_groupedSets.set(key, groupedSet);
			groupedSet.addOrUpdate(t);
			fire(groupedSet, EventType.Add);
		} else {
			groupedSet.addOrUpdate(t);
			fire(groupedSet, EventType.Update);
		}
	}

	public override function identifier(): OSet<T>->String {
		return identify;
	}

	function identify(set: OSet<T>): String {
		var keys = _groupedSets.keys();
		while ( keys.hasNext() ) {
			var key = keys.next();
			if ( _groupedSets.get(key) == set ) {
				return key;
			}
		}
		throw new Exception("unable to find identity for " + set);
	}

	public override function iterator(): Iterator<OSet<T>> {
		return _groupedSets.iterator();
	}
	
	public override function delegate(): Hash<OSet<T>> {
		return cast _groupedSets;
	}

}


class SortedSet<T> extends AbstractSet<T> {

	var _source: OSet<T>;
	var _sortByFn: T->String;
	var _sorted: Array<T>;
	var _dirty: Bool;
	var _comparisonFn: T->T->Int;

	public function new(source: OSet<T>, ?sortByFn: T->String) {
		super();
		_source = source;

		if ( sortByFn == null ) {
			_sortByFn = source.identifier();
		} else {
			_sortByFn = sortByFn;
		}

		_sorted = new Array<T>();
		_dirty = true;

		_comparisonFn = function(l,r) {
			var l0 = _sortByFn(l);
			var r0 = _sortByFn(r);
			var cmp = StringHelper.compare(l0, r0);
		 	
			if ( cmp != 0  ) return cmp;

			var li = identifier()(l);
			var ri = identifier()(r);
			return StringHelper.compare(li, ri);

		};

		source.listen(function(t, type) {
			if ( type.isDelete() ) {
				delete(t);
			} else if ( type.isUpdate() ) {
				delete(t);
				add(t);
			} else {
				add(t);
			}
		});

	}

	function sorted(): Array<T> {
		if ( _dirty ) {
			_sorted.sort(_comparisonFn);
			_dirty = false;
		}
		return _sorted;
	}

	function indexOf(t: T): Int {
		sorted();
		return binarySearch(t, _sortByFn(t), 0, _sorted.length-1);
	}

	function binarySearch(value: T, sortBy: String, startIndex: Int, endIndex: Int): Int {
		var middleIndex : Int = (startIndex + endIndex) >> 1;
		if (startIndex < endIndex) {
			var middleValue = _sorted[middleIndex];
			var middleSortBy = _sortByFn(middleValue);
			if( middleSortBy == sortBy ){
				return middleIndex;
			}else{
				if(middleSortBy > sortBy){
					return binarySearch(value, sortBy, startIndex, middleIndex);
				}else{
					return binarySearch(value, sortBy, middleIndex + 1, endIndex);
				}
			}
		}
		return -1;
	}

	function delete(t: T) {
		_sorted.remove(t);
		fire(t, EventType.Delete);
	}
	function add(t: T) {
		_sorted.push(t);
		_dirty = true;
		fire(t, EventType.Add);
	}

	public override function identifier(): T->String {
		return _source.identifier();
	}

	public override function iterator(): Iterator<T> {
		return sorted().iterator();
	}
	
	public override function delegate(): Hash<T> {
		throw new Exception("not implemented");
		return null;
	}

}


