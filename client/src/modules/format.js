function format(amount, separator) {
	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || ".");
}

module.exports = format;