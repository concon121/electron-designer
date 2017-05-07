class QuestionEvents {}

QuestionEvents.prototype.events = [];
QuestionEvents.prototype.addEvent = function (eventCallback) {
  this.events.push(eventCallback);
};
QuestionEvents.prototype.bind = function (question) {
  this.events.forEach(function (event) {
    event(question);
  });
};

module.exports = new QuestionEvents();
