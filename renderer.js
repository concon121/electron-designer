// Third party dependencies
const $ = require('jquery');

// Internal Dependencies
const questionEvents = require('./renderer/question_events');
// Paths to resources

questionEvents.addEvent(function (question) {
  ['#js-fieldset-' + question.id, '#js-form-group-' + question.id, '#' + question.id].forEach(function (item) {
    $(item).click(function () {
      $(this).toggleClass('editable');
    });
  });
});

require('./renderer/control_utils');
