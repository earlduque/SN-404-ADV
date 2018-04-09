(function executeRule(current, previous /*null when async*/) {

    var validDirections = ['face', 'turn', 'look'];
    var validSpeech = ['say', 'whisper', 'scream', 'shout'];

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
        no_one_responds: ' something into the air but no one responds.',
    };
    //responses
    var responses = {
        "hello": 'Hello there :)',
        "help me": "You're smart, you can figure it out.",
        "how are you": "Quite well, thank you.",
        "help": "No.",
        "howdy": "There's a snake in my boot!"
    };

    var newComment = current.comments.getJournalEntry(1).split('\n');
    var newCommand = newComment[1].split(' ');
    var newInput = newComment[1].toString().slice(newCommand[0].length + 1).replace(/\b[-.,()&$?#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
    var adminComment = '';

    if (validDirections.indexOf(newCommand[0]) > -1) {
        if (current.u_direction == newCommand[1]) {
            buildComment(directions.already_facing);
        } else if ((current.u_direction == 'up' || current.u_direction == 'down') && (newCommand[1] == 'left' || newCommand[1] == 'right')) {
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
                default: buildComment(directions.bad_direction, newCommand[1]);
            }
        }
    } else if (validSpeech.indexOf(newCommand[0]) > -1) {
        if (newInput in responses) {
            buildComment(responses[newInput] + '');
        } else if (newCommand[1]) {
            buildComment('You ' + newCommand[0] + speech.no_one_responds + ' ');
        } else {
            buildComment('Go on...');
        }
    }

    function buildComment(text, variable) {
        if (variable) {
            adminComment = text + ' ' + variable;
        } else {
            adminComment = text;
        }

        var currentID = current.sys_id;
        current.update();

        var gr2 = new GlideRecord('u_404_adventure');
        gr2.get(currentID);
        gr2.comments.setJournalEntry(adminComment, 'u_404_dm');
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
        }
        return newDirection;
    }

})(current, previous);