<div><!--
	<div ng-if="data.isLoggedIn == false" class="center">
        Please log in to continue.
  </div>-->
</div>

//css
.center {
    text - align: center;
    padding: 70px 0;
}

//server
(function () {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    data.isLoggedIn = gs.isLoggedIn();
    data.isUsersRecord = true;
    data.isAdmin = gs.hasRole('admin');
    var userID = gs.getUserID();
    var recordID = $sp.getParameter("sys_id");
    if (!data.isLoggedIn) {
        return;
    }
    var gr = new GlideRecord('u_404_adventure');
    gr.addQuery('u_user', userID);
    gr.query();
    gr.next();

    if (gr.sys_id != recordID) {
        data.isUsersRecord = false;
        data.redirect_url = "?id=404_adventure&table=u_404_adventure&sys_id=" + gr.sys_id;
    }
})();

//client
function ($scope, $window) {
    var c = this;

    if (c.data.isLoggedIn && !c.data.isUsersRecord && !c.data.isAdmin) {
        $window.location = $scope.data.redirect_url;
    }
}