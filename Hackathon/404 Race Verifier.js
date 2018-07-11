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
        var time_one = new GlideDateTime(current.sys_created_on+'');
        var time_two = new GlideDateTime(gr.sys_created_on+'');
        var time_complete;
        if (time_one < time_two) {
            time_complete = GlideDateTime.subtract(time_one, time_two);
        } else {
            time_complete = GlideDateTime.subtract(time_two, time_one);
        }
        var gdt = new GlideDateTime(time_complete);

        var years = ((parseInt(gdt.getValue().substring(0, 4)) - 1970) * 31557600);
        var months = ((parseInt(gdt.getValue().substring(5, 7)) - 1) * 2592000);
        var days = ((parseInt(gdt.getValue().substring(8, 10)) - 1) * 86400);
        var hours = (parseInt(gdt.getValue().substring(11, 13)) * 3600);
        var minutes = (parseInt(gdt.getValue().substring(14, 16)) * 60);
        var seconds = (parseInt(gdt.getValue().substring(17, 19)));
        var final_score = years + months + days + hours + minutes + seconds;


        grScore.u_score = final_score;

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