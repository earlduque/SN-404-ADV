<div class="panel panel-{{options.color}} b ticket_conversation">
  <div class="panel-heading">

    <div class="h2 panel-title">
      <h2 class="h4 panel-title">Totems</h2>
    </div>
  </div>
  <div class="panel-body">
    <div ng-if="data.totemRecords > 0">
      <div ng-repeat="item in data.totems | orderBy: 'rank'">
{{item.rank}}. {{item.users}}: {{item.time}}
      </div>
    </div>
    <div ng-if="data.totemRecords == 0">
      No registered scores.
    </div>
  </div>
</div>
<div class="panel panel-{{options.color}} b ticket_conversation">
  <div class="panel-heading">

    <div class="h2 panel-title">
      <h2 class="h4 panel-title">Minesweeper</h2>
    </div>
  </div>
  <div class="panel-body">
    <div ng-if="data.minesweeperRecords > 0">
      <div ng-repeat="item in data.minesweeper | orderBy: 'rank'">
{{item.rank}}. {{item.users}}: {{item.score}}
      </div>
    </div>
    <div ng-if="data.minesweeperRecords == 0">
      No registered scores.
    </div>
  </div>
</div>

//server
(function() {
	/* populate the 'data' object */
	/* e.g., data.table = $sp.getValue('table'); */
	var totems = data.totems = [];
	
	var gr = new GlideRecord('u_404_scores');
	gr.addQuery('u_game', 'totems');
	gr.addQuery('u_active', true);
	gr.orderBy('u_time');
	gr.setLimit(5);
	gr.query();
	data.totemRecords = gr.getRowCount();
	var i = 1;
	
	while (gr.next()){
		var item = {};
		item.rank = i;
		i++;
		item.users = gr.u_users.getDisplayValue() +'';
		item.time = gr.u_time.getDisplayValue() +'';
		totems.push(item);
	}
	
	var minesweeper = data.minesweeper = [];
	
	var gr2 = new GlideRecord('u_404_scores');
	gr2.addQuery('u_game', 'minesweeper');
	gr2.addQuery('u_active', true);
	gr2.orderByDesc('u_score');
	gr2.setLimit(5);
	gr2.query();
	data.minesweeperRecords = gr.getRowCount();
	var j = 1;
	
	while (gr2.next()){
		var item = {};
		item.rank = j;
		j++;
		item.users = gr2.u_users.getDisplayValue() +'';
		item.score = gr2.u_score +'';
		minesweeper.push(item);
	}

})();

	//client
function() {
	/* widget controller */
	var c = this;
}