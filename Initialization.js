//Initialization Business Rule. run before insert or update if X or Y is empty
(function executeRule(current, previous /*null when async*/) {

    // Add your code here
    current.u_x = Math.floor((Math.random() * 10) + 1);
    current.u_y = Math.floor((Math.random() * 10) + 1);

})(current, previous);