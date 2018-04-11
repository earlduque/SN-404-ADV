//Player Business Rule, run after comments changes
(function executeRule(current, previous /*null when async*/) {

    var validDirections = ['face', 'turn', 'look'];
    var validSpeech = ['say', 'whisper', 'scream', 'shout'];
    var validMoves = ['go', 'move', 'walk'];
    var validMoveDirections = ['forward'];
    var validX = [1, 10]; //width of area
    var validY = [1, 10]; //length of area

    //directions
    var directions = {
        already_facing: 'You are already facing that direction',
        new_facing: 'You are now facing',
        bad_direction: 'What do you mean? I do not know of',
        you_turned: 'You turned',
        spin_around: 'You spin wildly but you are still facing'
    };
    //speech
    var speech = {
        no_one_responds: 'No one seems to hear you.',
        no_input: 'Go on...'
    };
    //responses
    var responses = {
        "hello": 'Hello there :)',
        "help me": "Try things like:\nmove forward\nface north\nturn left\nsay hello.",
        "how are you": "Quite well, thank you.",
        "help": "Try things like:\nmove forward\nface north\nturn left\nsay hello.",
        "howdy": "There's a snake in my boot!"
    };
    //movement
    var moves = {
        bad_move: 'Where do you want to',
        you_moved: 'You have moved forward',
        bad_direction: 'Try forward',
        up_or_down: 'You might want to change the way you are facing first.',
        wall: 'You are facing a wall'
    };

    var newComment = current.comments.getJournalEntry(1).split('\n');
    var newCommand = newComment[1].split(' ');
    var newInput = newComment[1].toString().slice(newCommand[0].length + 1).trim().replace(/\b[-.,()&$?#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
    var commentToDM = newComment[1] + '';
    var adminComment = '';

    if (validDirections.indexOf(newCommand[0]) > -1) {
        if (current.u_direction == newCommand[1]) {
            buildComment(directions.already_facing);
        } else if ((current.u_direction == 'up' || current.u_direction == 'down') && (newCommand[1] == 'left' || newCommand[1] == 'right' || newCommand[1] == 'around')) {
            buildComment(directions.spin_around, current.u_direction.toString());
        } else {
            switch (newCommand[1]) {
                case 'north': current.u_direction = 'north'; buildComment(directions.new_facing, newCommand[1]); break;
                case 'east': current.u_direction = 'east'; buildComment(directions.new_facing, newCommand[1]); break;
                case 'south': current.u_direction = 'south'; buildComment(directions.new_facing, newCommand[1]); break;
                case 'west': current.u_direction = 'west'; buildComment(directions.new_facing, newCommand[1]); break;
                case 'up': current.u_direction = 'up'; buildComment(directions.new_facing, newCommand[1]); break;
                case 'down': current.u_direction = 'down'; buildComment(directions.new_facing, newCommand[1]); break;
                case 'left': current.u_direction = newCompassDirection(current.u_direction.toString(), 'left'); buildComment(directions.you_turned, newCommand[1]); break;
                case 'right': current.u_direction = newCompassDirection(current.u_direction.toString(), 'right'); buildComment(directions.you_turned, newCommand[1]); break;
                case 'around': current.u_direction = newCompassDirection(current.u_direction.toString(), 'around'); buildComment(directions.you_turned, newCommand[1]); break;
                default: buildComment(directions.bad_direction, newCommand[1]);
            }
        }
    } else if (validSpeech.indexOf(newCommand[0]) > -1) {
        if (newCommand[1]) {
            buildCommentToAllHere(newCommand[0], newInput);
        } else {
            buildComment(speech.no_input);
        }
    } else if (validMoves.indexOf(newCommand[0]) > -1) {
        if (newCommand[1] && validMoveDirections.indexOf(newCommand[1]) == -1) {
            buildComment(moves.bad_direction);
        } else if (newCommand[1] && validMoveDirections.indexOf(newCommand[1]) > -1) {
            newMove(newCommand[1]);
            //buildComment(moves.you_moved, newCommand[1]);
        } else {
            buildComment(moves.bad_move, newCommand[0], '', '?');
        }
    } else {
        if (commentToDM in responses) buildComment(responses[commentToDM] + '');
    }

    //
    //begin functions
    //

    function buildComment(text, variable, before, after) {
        if (variable || before || after) {
            if (!variable) { variable = ''; } else { variable = ' ' + variable; }
            if (before) { before += ' '; } else { before = ''; }
            if (!after) { after = ''; } else { after = ' ' + after; }
            adminComment = before + text + variable + after;
        } else {
            adminComment = text;
        }

        var currentID = current.sys_id;
        current.update();

        var gr2 = new GlideRecord('u_404_adventure');
        gr2.get(currentID);
        gr2.comments.setJournalEntry(adminComment, 'u_404_dm');
        //gr2.setWorkflow(false);
        gr2.update();
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
        } else if (turnDirection == 'around') {
            switch (currentDirection) {
                case 'north': newDirection = 'south'; break;
                case 'east': newDirection = 'west'; break;
                case 'south': newDirection = 'north'; break;
                case 'west': newDirection = 'east'; break;
            }
        }
        return newDirection;
    }

    function newMove(direction) {
        var u_x = current.u_x;
        var u_y = current.u_y;
        var u_direction = current.u_direction + '';
        var hit_wall = false;
        if (u_direction == 'north') {
            if (u_y + 1 > validY[1]) {
                hit_wall = true;
            } else {
                pushCoordsY(u_y + 1);
                buildComment(moves.you_moved);
            }
        } else if (u_direction == 'south') {
            if (u_y - 1 < validY[0]) {
                hit_wall = true;
            } else {
                pushCoordsY(u_y - 1);
                buildComment(moves.you_moved);
            }
        } else if (u_direction == 'west') {
            if (u_x - 1 < validX[0]) {
                hit_wall = true;
            } else {
                pushCoordsX(u_x - 1);
                buildComment(moves.you_moved);
            }
        } else if (u_direction == 'east') {
            if (u_x + 1 > validX[1]) {
                hit_wall = true;
            } else {
                pushCoordsX(u_x + 1);
                buildComment(moves.you_moved);
            }
        } else {
            buildComment(moves.up_or_down);
        }
        if (hit_wall) buildComment(moves.wall);
    }

    function pushCoordsY(newCoord) {
        current.u_y = newCoord;
        checkForOthers();
    }

    function pushCoordsX(newCoord) {
        current.u_x = newCoord;
        checkForOthers();
    }

    function checkForOthers() {
        var grCheckCoord = new GlideRecord('u_404_adventure');
        grCheckCoord.addQuery('u_user', '!=', current.u_user);
        grCheckCoord.addQuery('u_x', current.u_x);
        grCheckCoord.addQuery('u_y', current.u_y);
        grCheckCoord.query();

        if (grCheckCoord.getRowCount() > 0) {
            buildComment('Someone else is here');
        }
    }

    function buildCommentToAllHere(how, message) {
        var grCommentToAllHere = new GlideRecord('u_404_adventure');
        grCommentToAllHere.addQuery('u_user', '!=', current.u_user);
        grCommentToAllHere.addQuery('u_x', current.u_x);
        grCommentToAllHere.addQuery('u_y', current.u_y);
        grCommentToAllHere.query();
        if (grCommentToAllHere.getRowCount() == 0) buildComment(speech.no_one_responds);
        while (grCommentToAllHere.next()) {
            grCommentToAllHere.comments.setJournalEntry(how + 's ' + message, current.u_user.user_name);
            grCommentToAllHere.update();
        }
    }

})(current, previous);