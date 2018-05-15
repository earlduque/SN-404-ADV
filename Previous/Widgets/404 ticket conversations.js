<div>
    <div ng-if="!data.canRead && !data.isNewRecord">
        ${Requested record not found}
  </div>

    <div ng-if="data.canRead && !data.isNewRecord" class="panel panel-{{options.color}} b ticket_conversation" >
        <div class="panel-heading">

            <div class="h2 panel-title">
                <h2 class="h4 panel-title">{{ data.ticketTitle }}</h2>
                <div class="pull-right">
                    <ul>
                        <li>
                            <a href ng-show="data.showLocationIcon" class="panel-button" ng-click="checkInLocation()" title="{{data.checkInLocMsg}}">
                                <span class="glyphicon glyphicon-globe"></span>
                            </a>
                        </li>
                        <li>
                            <a href class="panel-button" ng-show="isNative" ng-click="scanBarcode()" title="{{data.scanBarcodeMsg}}">
                                <span class="glyphicon glyphicon-barcode"></span>
                            </a>
                        </li><!--
            <li><sp-attachment-button ng-if="data.canWrite && data.canAttach"></sp-attachment-button></li>-->
          </ul>
                </div>
            </div>

        </div>

        <div class="panel-body">
            <div ng-if="data.hasReadableJournalField">
                <form ng-submit="postEntry(data.journalEntry)" id="sand">
                    <div ng-show="data.primaryJournalField" class="input-group">
                        <textarea ng-keypress="keyPress($event)" sn-resize-height="trim" rows="1" id="post-input" class="form-control no-resize overflow-hidden" ng-model='data.journalEntry' ng-attr-placeholder="{{getPlaceholder()}}" autocomplete="off" ng-change="userTyping(data.journalEntry)" />
                        <span class="journal-field-indicator" ng-style="{'background-color': data.useSecondaryJournalField ? data.secondaryJournalField.color : data.primaryJournalField.color}"></span>
                        <span class="input-group-btn" style="vertical-align: top">
                            <input type="submit" class="btn btn-primary" value="{{data.btnLabel}}" ng-disabled="data.isPosting || data.journalEntry.length == 0" />
                        </span>
                    </div>
                    <div ng-if="data.secondaryJournalField && data.secondaryJournalField.can_write">
                        <label class="pull-right"><input type="checkbox" ng-model="data.useSecondaryJournalField" ng-change="updateFormWithJournalFields()" /> {{: :data.secondaryJournalField.label}}</label>
                    </div>
                </form>
                <ul class="list-group m-b-none">
                    <li class="list-group-item user-typing m-t" ng-repeat="u in typing">${{{::u.user_display_name}} is typing}</li>
                </ul>
                <ul class="list-group m-b-none m-t" ng-if="msg">
                    <li class="list-group-item user-typing">{{ msg }}</li>
                </ul>
                <div class="timeline-container">
                    <ul class="timeline">

                        <li class="timeline-item" ng-class="{'timeline-inverted': e.user_sys_id == data.stream.user_sys_id} " ng-repeat="e in data.mergedEntries">
                            <div class="timeline-badge">
                                <sn-avatar ng-if="hasLiveProfile(e.user_sys_id)" primary="getLiveProfileByUserId(e.user_sys_id)" class="avatar-large" show-presence="false" enable-context-menu="false"></sn-avatar>
                            </div>
                            <div class="timeline-panel">
                                <div class="timeline-panel-inner" ng-style="::{'border-color': getFieldColor(e.element)}">
                                    <div class="timeline-heading">
                                        <div class="timeline-title h5">{{: :e.name}} <small class="text-muted">-<sn-time-ago timestamp="::e.sys_created_on" /></small></div>
                                    </div>
                                    <div class="timeline-body">
                                        <div class="sr-only">${Journal type }: {{ e.field_label }}</div>
                                        <p ng-if="e.element != 'attachment'" ng-bind-html="::e.value"></p>
                                        <div ng-if="e.element == 'attachment'">
                                            <a target="_blank" href="/sys_attachment.do?view=true&sys_id={{e.attachment.sys_id}}" title="{{dataViewMsg}}" >
                                                <img ng-if="e.attachment.thumbnail_path" alt="" ng-src="/{{e.attachment.path}}?t=medium" class="img-responsive" />
                                            </a>
                                            <div>
                                                <a href="/sys_attachment.do?sys_id={{e.attachment.sys_id}}" target="_blank" title="{{dataViewMsg}}"><strong>{{ e.attachment.file_name }}</strong></a><br />
                                                {{ e.attachment.size }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="timeline-item timeline-inverted">
                            <div class="timeline-badge">
                                <sn-avatar ng-if="hasLiveProfile(data.stream.user_sys_id)" primary="getLiveProfileByUserId(data.stream.user_sys_id)" class="avatar-large" show-presence="false" enable-context-menu="false"></sn-avatar>
                            </div>
                            <div class="timeline-panel timeline-panel-first-item">
                                <div class="timeline-heading">
                                    <div class="timeline-title h4">{{ data.stream.user_full_name }}</div>
                                    <p>
                                        <small class="text-muted">
                                            <span class="glyphicon glyphicon-time" aria-hidden="true" />
                                            <sn-time-ago timestamp="data.created_on" />
                                        </small>
                                    </p>
                                </div>
                                <div class="timeline-body">
                                    <p>{{ data.number }} ${Created}</p>
                                </div>
                            </div>
                        </li>
                        <li class="timeline-start">
                            <div class="timeline-badge success">
                                ${Start}
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
            <div ng-if="!data.hasReadableJournalField">
                {{ options.no_readable_journal_field_message }}
            </div>
        </div>
    </div>
</div>

//css
.timeline - body > p {
    white - space: pre - wrap;
}

.no - resize {
    resize: none;
}

.journal - field - indicator {
    width: 5px;
    height: 23px;
    position: absolute;
    left: 5px;
    top: 5px;
    z - index: 3;
}

.panel - heading {
    word - wrap: break-word;
}

.avatar - container {
    cursor: default ;
}

ul {
    list - style: none;

    li {
        float: left;
    }
}

.panel - title {
    display: inline;
}

.overflow - hidden {
    overflow: hidden;
}

//server
(function () {
    data.uploadingAttachmentMsg = gs.getMessage("Uploading attachment...");
    data.sharingLocMsg = gs.getMessage("Sharing location...");
    data.scanBarcodeMsg = gs.getMessage("Scan barcode");
    data.checkInLocMsg = gs.getMessage("Check in location");
    data.messagePostedMsg = gs.getMessage("Message has been sent");
    data.viewMsg = gs.getMessage("View");
    data.attachAddedMsg = gs.getMessage("Attachment added");
    data.attachFailMsg = gs.getMessage("Failed to add attachment");
    data.sys_id = input.sys_id || options.sys_id || $sp.getParameter("sys_id");
    data.table = input.table || options.table || $sp.getParameter("table");
    // don't use options.title unless sys_id and table also come from options
    if (options && options.sys_id && options.table)
        data.ticketTitle = options.title;
    data.placeholder = options.placeholder || gs.getMessage("Type your message here...");
    data.placeholderNoEntries = options.placeholderNoEntries || gs.getMessage("Type your message here...");
    data.btnLabel = options.btnLabel || gs.getMessage("Send");
    data.includeExtended = options.includeExtended || false;
    data.use_dynamic_placeholder = options.use_dynamic_placeholder;
    data.isNewRecord = data.sys_id == -1 || gr.isNewRecord();

    var gr = new GlideRecord(data.table);
    if (!gr.isValid())
        return;

    gr.get(data.sys_id);
    if (!gr.canRead())
        return;

    options.no_readable_journal_field_message = options.no_readable_journal_field_message || gs.getMessage("No readable comment field");
    data.number = gr.getDisplayValue('number');
    data.created_on = gr.getValue('sys_created_on');

    if (input) { // if we have input then we're saving
        if (input.journalEntry && input.journalEntryField) {
            if (gr.canWrite(input.journalEntryField)) {
                gr.setDisplayValue(input.journalEntryField, input.journalEntry);
                gr.update();
                $sp.logStat('Comments', data.table, data.sys_id, input.journalEntry);
            }
        }
        data.ticketTitle = input.ticketTitle;
        data.placeholder = input.placeholder;
        data.btnLabel = input.btnLabel;
        data.includeExtended = input.includeExtended;
    } else {
        if (!data.ticketTitle) {
            if (gr.short_description.canRead())
                data.ticketTitle = gr.getDisplayValue("u_user");
            if (!data.ticketTitle)
                data.ticketTitle = data.number;
        }

        $sp.logStat('Task View', data.table, data.sys_id);
    }

    data.canWrite = gr.canWrite();
    data.canAttach = gs.hasRole(gs.getProperty("glide.attachment.role")) && GlideTableDescriptor.get(data.table).getED().getAttribute("no_attachment") != "true";
    data.canRead = gr.canRead();
    data.hasWritableJournalField = false;
    data.hasReadableJournalField = false;
    if (data.canRead && !data.isNewRecord) {
        data.stream = $sp.getStream(data.table, data.sys_id);
        // Journal fields come in correct order already
        // so grab the first 2 writeable fields
        if ('journal_fields' in data.stream) {
            var jf = data.stream.journal_fields;
            for (var i = 0; i < jf.length; i++) {
                if (jf[i].can_read === true)
                    data.hasReadableJournalField = true;
                if (jf[i].can_write === true) {
                    data.hasWritableJournalField = true;
                    if (!data.primaryJournalField)
                        data.primaryJournalField = jf[i];
                    else if (data.includeExtended && !data.secondaryJournalField)
                        data.secondaryJournalField = jf[i];
                    else
                        break;
                }
            }
        }

    }

    data.tableLabel = gr.getLabel();

})()

//client
function spTicketConversation($scope, nowAttachmentHandler, $animate, $rootScope, cabrillo, $timeout, snRecordWatcher, spUtil, spAriaUtil, $http) {
    $scope.showLocationIcon = false;
    $scope.msg = "";
    $scope.isNative = cabrillo.isNative();
    $scope.errorMessages = [];
    var existingEntries = {}
    var skipNextRecordWatchUpdate = false;
    $scope.typing = [];
    if (!$scope.data.hasReadableJournalField && !$scope.data.isNewRecord)
        console.warn("No readable journal field (comments, work notes, etc.) available in the stream for this record");
    if ($scope.page && $scope.page.g_form)
        hideParentJournalFields();

    function hideParentJournalFields() {
        if (!$scope.data.stream)
            return;

        var fields = $scope.data.stream.journal_fields;
        var g_form = $scope.page.g_form;
        for (var f in fields)
            g_form.setDisplay(fields[f].name, false);
    }
    var liveProfiles = {};
    $scope.getLiveProfileByUserId = function (userId) {
        return liveProfiles[userId];
    }

    var pending = {};

    //Little caching implementation to make sure we only get a given user's profile once.
    $scope.hasLiveProfile = function hasLiveProfile(userId) {
        if (liveProfiles[userId])
            return true;
        else if (pending[userId])
            return false;
        else {
            pending[userId] = $http.get('/api/now/live/profiles/sys_user.' + userId).then(function (response) {
                liveProfiles[userId] = {
                    userID: userId,
                    name: response.data.result.name,
                    initials: buildInitials(response.data.result.name),
                    avatar: response.data.result.avatar
                };
            });
            return false;
        }
    }

    function buildInitials(name) {
        if (!name)
            return "--";

        var initials = name.split(" ").map(function (word) {
            return word.toUpperCase();
        }).filter(function (word) {
            return word.match(/^[A-Z]/);
        }).map(function (word) {
            return word.substring(0, 1);
        }).join("");

        return (initials.length > 3) ? initials.substr(0, 3) : initials;
    }


    function setupAttachmentHandler() {
        $scope.attachmentHandler = new nowAttachmentHandler(attachSuccess, appendError);

        function attachSuccess() {
            $rootScope.$broadcast("sp.attachments.update", $scope.data.sys_id);
            spAriaUtil.sendLiveMessage($scope.data.attachAddedMsg);
        }

        function appendError(error) {
            spUtil.addErrorMessage(error.msg + error.fileName);
            $scope.errorMessages.push(error);
            spAriaUtil.sendLiveMessage($scope.data.attachFailMsg);
        }

        $timeout(function () {
            var sizeLimit = 1024 * 1024 * 24; // 24MB
            $scope.attachmentHandler.setParams($scope.data.table, $scope.data.sys_id, sizeLimit);
        })
    }
    setupAttachmentHandler();

    var recordWatcherTimer;
    $scope.$on('record.updated', function (name, data) {
        // Use record watcher update if:
        //	This record was updated AND This widget didn't trigger the update.
        if (data.table_name == $scope.data.table && data.sys_id == $scope.data.sys_id) {
            $timeout.cancel(recordWatcherTimer);
            recordWatcherTimer = $timeout(function () {
                if (skipNextRecordWatchUpdate)
                    skipNextRecordWatchUpdate = false;
                else
                    spUtil.update($scope).then(function (r) {
                        $scope.data.stream = r.stream;
                    });
            }, 250);
        }
    });

    $scope.$on('sp.show_location_icon', function (evt) {
        $scope.data.showLocationIcon = true;
    });

    $rootScope.$on('sp.sessions', function (evt, sessions) {
        $scope.typing = [];
        Object.keys(sessions).forEach(function (session) {
            session = sessions[session];
            if (session.status != 'typing')
                return;

            $scope.typing.push(session);
        })
    })

    $scope.$on('sp.conversation_title.changed', function (evt, text) {
        $scope.data.ticketTitle = text;
    })

    $scope.$watch("data.canWrite", function () {
        $rootScope.$broadcast("sp.record.can_write", $scope.data.canWrite);
    });

    var streamUpdateTimer;
    $scope.$watch("data.stream", function () {
        $timeout.cancel(streamUpdateTimer);
        streamUpdateTimer = $timeout(function () {
            mergeStreamEntries();
        }, 50);
    });

    function mergeStreamEntries() {
        $scope.placeholder = $scope.data.placeholderNoEntries;
        if (!$scope.data.stream || !$scope.data.stream.entries)
            return;

        $scope.placeholder = $scope.data.placeholder;
        var entries = $scope.data.stream.entries;
        if (!$scope.data.mergedEntries) {
            $scope.data.mergedEntries = $scope.data.stream.entries.slice();
            for (var i = 0; i < entries.length; i++) {
                existingEntries[entries[i].sys_id] = true;
            }

            return;
        }

        var mergedEntries = $scope.data.mergedEntries;
        for (var i = entries.length - 1; i >= 0; i--) {
            var curEntry = entries[i];
            if (existingEntries[curEntry.sys_id])
                continue;

            mergedEntries.unshift(curEntry);
            existingEntries[curEntry.sys_id] = true;
        }
    }

    $scope.getPlaceholder = function () {
        if ($scope.data.use_dynamic_placeholder && $scope.data.useSecondaryJournalField)
            return $scope.data.secondaryJournalField.label;
        return $scope.placeholder;
    };

    var colorCache;
    $scope.getFieldColor = function (fieldName) {
        var defaultColor = "transparent";
        if (colorCache) {
            if (fieldName in colorCache)
                return colorCache[fieldName];
            else
                return defaultColor;
        }

        colorCache = {};
        var jf = $scope.data.stream.journal_fields;
        for (var i = 0; i < jf.length; i++) {
            colorCache[jf[i].name] = jf[i].color || defaultColor;
        }
        return $scope.getFieldColor(fieldName);
    }

    $scope.checkInLocation = function () {
        $rootScope.$broadcast("check_in_location");
        $rootScope.$broadcast("location.sharing.start");
    }

    $scope.$on("location.sharing.end", function () {
        $timeout(function () { $scope.msg = "" }, 500);
    })

    $scope.$on("location.sharing.start", function () {
        $scope.msg = $scope.data.sharingLocMsg;
    })

    $scope.scanBarcode = function () {
        $rootScope.$broadcast("scan_barcode");
    }

    $scope.$on("attachment.upload.start", function () {
        $scope.msg = $scope.data.uploadingAttachmentMsg;
    })

    $scope.$on("attachment.upload.stop", function () {
        $scope.msg = "";
        //update the stream so we get the new attachment
        spUtil.update($scope).then(function (r) {
            $scope.data.stream = r.stream;
        });
    });

    $scope.data.isPosting = false;
    $scope.postEntry = function (input) {

        if (!input)
            return;

        input = input.trim();
        $scope.data.journalEntry = input;

        if ($scope.data.useSecondaryJournalField)
            $scope.data.journalEntryField = $scope.data.secondaryJournalField.name;
        else
            $scope.data.journalEntryField = $scope.data.primaryJournalField.name;
        $scope.data.isPosting = true;
        spUtil.update($scope).then(function () {
            $scope.data.isPosting = false;
            reset();
            spAriaUtil.sendLiveMessage($scope.data.messagePostedMsg);
            $timeout(function () {
                $scope.setFocus(); // sets focus back on input, defined in "link"
            });
        });
        skipNextRecordWatchUpdate = true;
        $scope.setFocus(); // sets focus back on input, defined in "link"
    };

    var reset = function () {
        $scope.userTyping("");
        $scope.data.journalEntry = "";
        $scope.data.useSecondaryJournalField = false;
        $scope.data.journalEntryField = "";
    }

    $scope.keyPress = function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            if ($scope.data.journalEntry)
                $scope.postEntry($scope.data.journalEntry);
        }
    }

    $scope.userTyping = function (input) {
        var status = "viewing";
        if (input.length)
            status = "typing";

        $scope.$emit("record.typing", { status: status, value: input, table: $scope.data.table, sys_id: $scope.data.sys_id });
        $scope.updateFormWithJournalFields();
    }

    $scope.updateFormWithJournalFields = function () {
        var fieldName, fieldToClear = "";
        if ($scope.data.useSecondaryJournalField) {
            fieldName = $scope.data.secondaryJournalField.name;
            fieldToClear = $scope.data.primaryJournalField.name;
        } else {
            fieldName = $scope.data.primaryJournalField.name;
            fieldToClear = "";
        }
        $scope.$emit("activity_stream_is_changed", { "fieldName": fieldName, "fieldToClear": fieldToClear, "input": $scope.data.journalEntry });
    }
}

//link
function(scope, elm) {
    // Set the focus back on the input for IE11
    scope.setFocus = function () {
        var input = $(elm[0]).find('textarea#post-input');
        if (input[0])
            input[0].focus();
    }

}

//demo data
{
    "options": {
        "sys_id": -1,
            "table": "incident"
    }
}

//option schema
[{ "hint": "Placeholder text shows selected journal field", "name": "use_dynamic_placeholder", "label": "Use dynamic placeholder", "type": "boolean" }, { "hint": "Message to show when record has no readable journal field", "name": "no_readable_journal_field_message", "default_value": "", "label": "No readable journal field message", "type": "string" }]