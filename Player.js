(function executeRule(current, previous /*null when async*/) {

    var validDirections = ['face', 'turn', 'look'];

    var already_facing = 'You are already facing that direction';
    var new_facing = 'You are now facing';
    var bad_direction = 'Face where? North? Left? Up? I do not know of';
    var you_turned = 'You turned';
    var spin_around = 'You spin wildly but you are still facing';

    var newComment = current.comments.getJournalEntry(1).split('\n');
    var newInput = newComment[1].split(' ');
    var adminComment = '';

    if (validDirections.indexOf(newInput[0]) > -1) {
        if (current.u_direction == newInput[1]) {
            buildComment(already_facing);
        } else if ((current.u_direction == 'up' || current.u_direction == 'down') && (newInput[1] == 'left' || newInput[1] == 'right')) {
            buildComment(spin_around, current.u_direction.toString());
        } else {
            switch (newInput[1]) {
                case 'north': current.u_direction = 'north'; buildComment(new_facing, newInput[1]); break;
                case 'east': current.u_direction = 'east'; buildComment(new_facing, newInput[1]); break;
                case 'south': current.u_direction = 'south'; buildComment(new_facing, newInput[1]); break;
                case 'west': current.u_direction = 'west'; buildComment(new_facing, newInput[1]); break;
                case 'up': current.u_direction = 'up'; buildComment(new_facing, newInput[1]); break;
                case 'down': current.u_direction = 'down'; buildComment(new_facing, newInput[1]); break;
                case 'left': current.u_direction = newCompassDirection(current.u_direction.toString(), 'left'); buildComment(you_turned, newInput[1]); break;
                case 'right': current.u_direction = newCompassDirection(current.u_direction.toString(), 'right'); buildComment(you_turned, newInput[1]); break;
                default: buildComment(bad_direction, newInput[1]);
            }
        }

        var currentID = current.sys_id;

        current.update();

        var gr2 = new GlideRecord('u_404_adventure');
        gr2.get(currentID);
        gr2.comments.setJournalEntry(adminComment, 'admin');
        gr2.update();

    }

    function buildComment(text, variable) {
        if (variable) {
            adminComment = text + ' ' + variable;
        } else {
            adminComment = text;
        }
    }

    function newCompassDirection(currentDirection, turnDirection) {
        var newDirection = '';
        if (turnDirection == 'left') {
            switch (currentDirection) {
                case 'north': newDirection = 'west'; break;
                case 'east': newDirection = 'north'; break;
                case 'south': newDirection = 'east'; break;
                case 'west': newDirection = 'south'; break;
            }
        } else if (turnDirection == 'right') {
            switch (currentDirection) {
                case 'north': newDirection = 'east'; break;
                case 'east': newDirection = 'south'; break;
                case 'south': newDirection = 'west'; break;
                case 'west': newDirection = 'north'; break;
            }
        }
        return newDirection;
    }

})(current, previous);