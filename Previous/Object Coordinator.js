// Business Rule for u_404_objects, run before x or y change and when user is not empty and if instance is A or B
(function executeRule(current, previous /*null when async*/) {

    // Add your code here
    var gr = new GlideRecord('u_404_objects');
    gr.addNotNullQuery('u_user');
    gr.addQuery('u_x', current.u_x);
    gr.addQuery('u_y', current.u_y);
    gr.addQuery('sys_id', '!=', current.sys_id);
    gr.addQuery('u_object_name', current.u_object_name);
    if (current.u_object_instance == 'A') {
        gr.addQuery('u_object_instance', 'B');
    } else if (current.u_object_instance == 'B') {
        gr.addQuery('u_object_instance', 'A');
    }
    gr.query();
    gs.log('404: ' + gr.getRowCount());
    if (gr.next()) {
        var gr2 = new GlideRecord('u_404_adventure');
        gr2.addQuery('u_user', current.u_user);
        gr2.setLimit(1);
        gr2.next();
        gr2.comments.setJournalEntry('Your ' + current.u_object_name + ' disintegrates.\nA chime is heard in the distance.', 'u_404_dm');
        gr2.update();
        /*
        var user1 = current.u_user.sys_id + '';
        var user2 = gr.u_user.sys_id + '';
        var samePerson = user1 == user2;

        var gr3 = new GlideRecord('u_404_scores');
        gr3.initialize();
        gr3.active = true;
        gr3.u_game = current.u_game;
        if (samePerson) {
            gr3.u_users = user1;
        } else {
            gr3.u_users = user1 + ',' + user2;
        }
        gr3.u_time = gs.nowDateTime();
        gr3.insert();
        */
    }
})(current, previous);