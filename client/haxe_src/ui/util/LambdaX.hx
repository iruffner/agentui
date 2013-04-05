package ui.util;




class LambdaX {

	/**
		Iterate with an index
	**/
	public static function iteri<A>( it : Iterable<A>, f : A -> Int -> Void ) {
		var i = 0;
		for( x in it ) {			
			f(x, i);
			i += 1;
		}
	}

	// /**
	// 	Iterate with an index
	// **/
	// public static function iteria<A>( ar : Array<A>, f : A -> Int -> Void ) {
	// 	for( i in 0...ar.length ) {			
	// 		f(ar[i], i);
	// 	}
	// }

}

