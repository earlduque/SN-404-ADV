//Coordinate Checker Business Rule. run after insert or update and when comments changes
(function executeRule(current, previous /*null when async*/) {

    // Add your code here
    var gr = new GlideRecord('u_404_adventure');
    gr.addQuery('u_user', '!=', current.u_user);
    gr.query();

    if (gr.getRowCount() > 0) {
        buildComment('Someone else is here');
    }

    function buildComment(text, variable, before, after) {
        if (variable || before || after) {
            adminComment = before + ' ' + text + ' ' + variable + ' ' + after;
        } else {
            adminComment = text;
        }

        var currentID = current.sys_id;
        current.update();

        var gr2 = new GlideRecord('u_404_adventure');
        gr2.get(currentID);
        gr2.comments.setJournalEntry(adminComment, 'u_404_dm');
        gr2.setWorkflow(false);
        gr2.update();
    }

})(current, previous);