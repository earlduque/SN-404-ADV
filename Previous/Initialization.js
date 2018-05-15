//Initialization Business Rule. run before insert or update if X or Y is empty or if direction is empty
(function executeRule(current, previous /*null when async*/) {

    // Add your code here
    if (!current.u_x) current.u_x = Math.floor((Math.random() * 10) + 1);
    if (!current.u_y) current.u_y = Math.floor((Math.random() * 10) + 1);
    if (!current.u_direction) current.u_direction = 'north';

})(current, previous);