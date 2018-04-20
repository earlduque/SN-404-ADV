//Coordinate Checker Business Rule. run before update and when x or y changes
(function executeRule(current, previous /*null when async*/) {

    var gr = new GlideRecord('u_404_objects');
    gr.addQuery('u_user', current.u_user);
    gr.query();
    while (gr.next()) {
        gr.u_x = current.u_x;
        gr.u_y = current.u_y;
    }

})(current, previous);