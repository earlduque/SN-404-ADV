<div>
  <div ng-if="data.isLoggedIn == false && data.currentPage == '404_start'" class="center">
    Please log in to continue.
Or if you are new, <a href="?id=404_new_player">please go here</a> to start a new character.
</div>
</div>

//css
.center {
	text-align: center;
	padding: 70px 0;
}

//servier
(function() {
	/* populate the 'data' object */
	/* e.g., data.table = $sp.getValue('table'); */
	data.currentPage = $sp.getParameter('id');
	data.isLoggedIn = gs.isLoggedIn();
	var userID = gs.getUserID();
	if (!data.isLoggedIn){
		return;
	}
	var gr = new GlideRecord('u_404_adventure');
	gr.addQuery('u_user', userID);
	gr.query();
	
	if (gr.getRowCount() == 0){
		createNew(userID);
	} else {
		gr.next();
		data.sys_id = gr.sys_id;
		//data.redirect_url = gs.getProperty('glide.servlet.uri') + "ess/request_item.do?sysparm_id=" + data.sys_id;	
		data.redirect_url = "?id=404_adventure&table=u_404_adventure&sys_id=" + data.sys_id
	}
	
	function createNew(usersysid){
		var gr2 = new GlideRecord('u_404_adventure');
		gr2.initialize();
		gr2.u_user = usersysid;
		gr2.insert();
		data.sys_id = gr2.sys_id;
		data.redirect_url = "?id=404_adventure&table=u_404_adventure&sys_id=" + data.sys_id
	}
})();

//client
function ($scope, $window) {
	var c = this;
	
	if(c.data.isLoggedIn) {
		$window.location = $scope.data.redirect_url;
	}
}