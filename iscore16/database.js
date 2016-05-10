var request = new XMLHttpRequest();
var fileContent = '';
function readDatabase(location) {
	var data = [];
	request.onload = function() {
		fileContent = this.responseText;
		var fileContentRows = fileContent.split('\n').map(Function.prototype.call, String.prototype.trim);
		for (i = 0; i < fileContentRows.length; i++) {
			data[i] = fileContentRows[i].split('/').map(Function.prototype.call, String.prototype.trim);
		}
	};
	request.open( 'GET', location, true );
	request.send();
	return data;
}
