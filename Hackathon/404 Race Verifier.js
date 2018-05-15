(function executeRule(current, previous /*null when async*/) {

    var objectInstance = current.u_object_instance+'';
    var objectName = current.u_object_name+'';
    var lookFor = '';

    if (objectInstance == 'A') {
        lookFor = 'B';
    } else if (objectInstance == 'B') {
        lookFor = 'A';
    }


    var gr = new GlideRecord('u_404_objects');
    gr.addQuery('u_game', 'race');
    gr.addNotNullQuery('u_user');
    gr.addQuery('u_object_name', objectName);
    gr.addQuery('u_object_instance', lookFor);
    gr.addQuery('u_x', current.u_x);
    gr.addQuery('u_y', current.u_y);
    gr.query();
    if (gr.next()) {
        submitScore();
    }

    function submitScore() {
        var grScore = new GlideRecord('u_404_scores');
        grScore.initialize();
        grScore.u_game = 'Race';
        var winner = current.u_user + '';
        var winner2 = gr.u_user + '';
        if (winner == winner2) {
            grScore.u_names = winner;
            sendComment(winner);
        } else {
            grScore.u_names = winner + ',' + winner2;
            sendComment(winner);
            sendComment(winner2);
        }
        grScore.u_score = 10;
        grScore.insert();
    }

    function sendComment(userID) {
        /* turning off while it still makes dupe records
        var gr2 = new GlideRecord('u_404_adventures');
        gr2.get(userID);
        //gs.log('404: ' + userID + ' ' + gr2.number);
        gr2.comments.setJournalEntry('An item you are carrying disappears in a flash of light', 'u_404_dm');
        //gr2.setWorkflow(false);
        gr2.update();
        */
        sendDeletes();
    }

    function sendDeletes() {
        current.deleteRecord();
        gr.deleteRecord();
    }

})(current, previous);