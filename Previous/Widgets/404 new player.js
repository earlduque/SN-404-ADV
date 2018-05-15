<div class="panel panel-primary">
    <div class="panel-heading">Create a new player</div>
    <div class="panel-body">
        <form>
            <input class="form-control" type="text" placeholder="Username" ng-model="c.data.username" />
            <input class="form-control" type="text" placeholder="First Name" ng-model="c.data.first_name" />
            <input class="form-control" type="text" placeholder="Last Name" ng-model="c.data.last_name" />
            <input class="form-control" type="password" placeholder="Password" ng-model="c.data.password" />
            <div ng-if="data.completed != 'true'">
                <button type="button" class="btn btn-default" ng-click="serverUpdate()">Create account</button>
            </div>
        </form>
        {{ data.status }}
        <div ng-if="data.completed == 'true'">
            <a href="{{data.redirect_url}}">Click here</a>
        </div>
    </div>
</div>

//css
.result - container {
    margin - top: 10px;
}

//server
(function () {
    data.completed = 'false';
    if (input.username != null && input.username != '' && input.first_name != null && input.first_name != '' && input.last_name != null && input.last_name != '' && input.password != null && input.password != '') {
        checkDuplicates(input);
    } else {
        data.status = 'Please fill out all fields';
    }

    function checkDuplicates(new_account) {
        var gr = new GlideRecord('sys_user');
        gr.addQuery('user_name', new_account.username);
        gr.query();
        var numberOfRecords = gr.getRowCount();
        if (numberOfRecords > 0) {
            data.status = 'Username already exists';
            return;
        }
        createNewPlayer(new_account)
    }

    function createNewPlayer(new_account) {
        data.status = 'Creating new player for ' + new_account.username;
        var gr2 = new GlideRecord('sys_user');
        gr2.initialize();
        gr2.user_name = new_account.username;
        gr2.first_name = new_account.first_name;
        gr2.last_name = new_account.last_name;
        gr2.user_password.setDisplayValue(new_account.password);
        gr2.title = '404 Adventure User';
        gr2.insert();

        var gr3 = new GlideRecord('sys_user_has_role');
        gr3.initialize();
        gr3.user = gr2.sys_id;
        gr3.role = 'c39a85a2db0113008531711ebf9619f5';
        gr3.insert();

        data.redirect_url = '?id=404_start';
        data.completed = 'true';
        data.status = 'Please go to this link to start: ';
    }
})();// JavaScript source code

//client
function($scope) {
    /* widget controller */
    var c = this;

    $scope.serverUpdate = function () {
        c.server.update();
        //alert(c.data.username);
    }

    if (c.data.completed == 'true') {
        $window.location = $scope.data.redirect_url;
    }

}