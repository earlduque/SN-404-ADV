<div class="panel panel-primary">
    <div class="panel-heading">Search games by player</div>
    <div class="panel-body">
        <input class="form-control" type="search" placeholder="Name" ng-model="c.data.keywords" ng-change="c.server.update()" ng-model-options="{debounce: 250}" />
        <div ng-if="data.total > 0">
            Total: {{ data.total }}
        </div>
        <ul class="list-group result-container">
            <li class="list-group-item" ng-repeat="item in c.data.items">
                <a href="?id=404_adventure&table=u_404_adventure&sys_id={{::item.sys_id}}">{{ item.u_user }}</a>
            </li>
        </ul>
    </div>
</div>

//css
.result - container {
    margin - top: 10px;
}

//server
(function () {
    if (input.keywords != null && input.keywords != '')
        data.items = getCatalogItems(input.keywords);
    else data.items = getFirst100();

    function getCatalogItems(keywords) {
		/*
		var sc = new GlideRecord('sc_cat_item');
		sc.addActiveQuery();
		sc.addQuery('123TEXTQUERY321', keywords);
		sc.addQuery('sys_class_name', 'NOT IN', 'sc_cat_item_wizard,sc_cat_item_content');
		sc.addQuery('sc_catalogs', '0d08b13c3330100c8b837659bba8fb4');
		sc.setLimit(100);
		sc.orderByDesc("ir_query_score");
		sc.query();
		var results = [];
		while (sc.next()) {
			if (!$sp.canReadRecord(sc))
				continue;

			var item = {};
			$sp.getRecordDisplayValues(item, sc, 'name,price,sys_id');
			item.category = sc.getValue('category');
			results.push(item);
		}
		data.total = sc.getRowCount();
		return results;
		*/
        var gr = new GlideRecord('u_404_adventure');
        gr.addQuery('123TEXTQUERY321', keywords);
        gr.setLimit(100);
        gr.query();
        data.total = gr.getRowCount();
        var results = [];
        while (gr.next()) {
            var item = {};
            $sp.getRecordDisplayValues(item, gr, 'u_user,sys_id');
            results.push(item);
        }
        return results;
    }

    function getFirst100() {
        var gr = new GlideRecord('u_404_adventure');
        gr.setLimit(100);
        gr.orderByDesc('sys_updated_on');
        gr.query();
        data.total = gr.getRowCount();
        var results = [];
        while (gr.next()) {
            var item = {};
            $sp.getRecordDisplayValues(item, gr, 'u_user,sys_id');
            results.push(item);
        }
        return results;
    }
})();

//client
function() {
    /* widget controller */
    var c = this;
}