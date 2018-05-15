(function executeRule(current, previous /*null when async*/) {

    // when a new record enters, randomly place them in the world

    //get system property values
    var maxX = gs.getProperty('404adv.max.x');
    var maxY = gs.getProperty('404adv.max.y');

    //initialize the record
    if (!current.u_x) current.u_x = Math.floor((Math.random() * maxX) + 1);
    if (!current.u_y) current.u_y = Math.floor((Math.random() * maxY) + 1);
    if (!current.u_direction) current.u_direction = 'north';

})(current, previous);