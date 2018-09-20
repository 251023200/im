function Token(){
	
}
Token.cacheToken=function(token){
	localStorage.setItem('access_token', token.access_token);
	localStorage.setItem('refresh_token', token.refresh_token);
}
Token.getAccessToken=function(){
	return localStorage.getItem('access_token');
}
Token.getRefreshToken=function(){
	return localStorage.getItem('refresh_token');
}
Token.clearToken=function(){
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
}
