package m3.api;

typedef Payment {
	var sender: String;
	var receiver: String;
	var amount: String
}

typedef PaymentResult {

}

class PayPal {
	public static function makePayment(payment: Payment): PaymentResult {

	}
}