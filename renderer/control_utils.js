const $ = require('jquery');
const uuidV1 = require('uuid/v1');
const mustache = require('mustache');
const username = require('username');
const path = require('path');

const file = require('./file_utils');
const questionEvents = require('./question_events');

const pageTemplate = path.join(__dirname, '../views/base_template.mustache');
const questionsTemplate = path.join(__dirname, '../views/partials/questions.mustache');
const baseModelPath = path.join(__dirname, '../json/base_model.json');

class ControlUtils {
  constructor() {
    const self = this;
    file.read(baseModelPath, function (content) {
      self.baseModel = JSON.parse(content);
      self.setupAddControl(self.baseModel);
      self.setupDeleteControls(self.baseModel);
      self.setupEditControls(self.baseModel);
      self.setupSelectAll();
      self.renderPage();
    });
  }
}

ControlUtils.prototype.baseModel = {};

ControlUtils.prototype.setupAddControl = function (baseModel) {
  const self = this;
  $('.add-control').click(function () {
    var json = $(this).data('json');
    console.log(json);
    file.read(json, function (content) {
      var jsonControl = JSON.parse(content);
      jsonControl.id = uuidV1();
      baseModel.questions.push(jsonControl);
      console.log(baseModel);
      self.renderPage();
    });
  });
};

ControlUtils.prototype.setupDeleteControls = function (baseModel) {
  $('#delete-control').click(function () {
    $('.editable').each(function (item) {
      var id = $(this).attr('id');
      id = id.replace('js-fieldset-', '');
      id = id.replace('js-form-group-', '');
      baseModel.questions.forEach(function (item) {
        if (item.id === id) {
          var index = baseModel.questions.indexOf(item);
          if (index > -1) {
            baseModel.questions.splice(index, 1);
          }
          return false;
        }
      });
      $(this).remove();
    });
  });
};

ControlUtils.prototype.setupEditControls = function (baseModel) {
  const self = this;
  $('#edit-control').click(function () {
    console.log('Edited a control');
    if ($('.editable').length > 0) {
      var questionNumber = 1;
      var questions = [];
      self.preRenderEditEvents();
      $('.editable').each(function (index, item) {
        var question;
        var id = $(this).attr('id');
        console.log(index, item, id);
        id = id.replace('js-fieldset-', '');
        id = id.replace('js-form-group-', '');
        questions.push({
          isLabel: true,
          id: 'input-' + id,
          labelText: 'Question ' + questionNumber,
          isVisible: true
        });
        baseModel.questions.forEach(function (item) {
          if (item.id === id) {
            question = item;
            console.log(question);
            return false;
          }
        });

        for (var property in question) {
          var value = '' + question[property];
          console.log(value);
          if (property !== 'id' && !property.startsWith('is')) {
            if (question.hasOwnProperty(property)) {
              console.log('do stuff!');
              questions.push({
                isText: true,
                id: property + '_' + id,
                labelText: property,
                isVisible: true,
                isRequired: true,
                answerValue: question[property]
              });
            }
          }
        }
        questionNumber++;
      });
      file.read(questionsTemplate, function (template) {
        $('#edit-control-inputs').empty().prepend(mustache.render(template, {
          questions: questions
        }, window.JSTmpl));
      });
      self.postRenderEditEvents();
    }
  });
};

ControlUtils.prototype.getQuestionById = function (id) {
  var toReturn;
  this.baseModel.questions.forEach(function (question) {
    if (question.id === id) {
      toReturn = question;
      return false;
    }
  });
  return toReturn;
};

ControlUtils.prototype.saveEdits = function (self) {
  $('#edit-control').removeClass('active');
  $('#base_panel').removeClass('overlayed');
  $('#edit-control-inputs input').each(function (index, item) {
    console.log(index, item);
    var elementId = $(item).attr('id');
    var value = $(item).val();
    var lastIndex = elementId.lastIndexOf('_');
    var property = elementId.substr(0, lastIndex);
    var id = elementId.substr(lastIndex + 1);
    var question = self.getQuestionById(id);
    console.log(question, value, id);
    question[property] = value;
  });
  self.renderPage();
};

ControlUtils.prototype.preRenderEditEvents = function () {
  $('#edit-control-inputs').empty();
  $('#edit-control').toggleClass('active');
  $('#base_panel').toggleClass('overlayed');
};

ControlUtils.prototype.postRenderEditEvents = function () {
  const self = this;
  $('#exitEdit').click(function () {
    $('#edit-control').removeClass('active');
    $('#base_panel').removeClass('overlayed');
  });
  $('#saveEdit').click(function () {
    self.saveEdits(self);
  });
};

ControlUtils.prototype.renderPage = function () {
  const self = this;
  var user = username.sync();
  var timestamp = new Date();
  self.baseModel.headings.lastActivity = 'The last activity was by user ' + user + ' on ' + timestamp;
  file.read(pageTemplate, function (template) {
    $('#designer_panel').empty().prepend(mustache.render(template, self.baseModel, window.JSTmpl));
    self.baseModel.questions.forEach(function (question) {
      questionEvents.bind(question);
    });
    if ($('#select-all').hasClass('active')) {
      $('#questions > div').each(function (index, item) {
        $(item).addClass('editable');
      });
    }
  });
};

ControlUtils.prototype.setupSelectAll = function () {
  $('#select-all').click(function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $('#questions > div').each(function (index, item) {
        $(item).removeClass('editable');
      });
    } else {
      $(this).addClass('active');
      $('#questions > div').each(function (index, item) {
        $(item).addClass('editable');
      });
    }
  });
};

module.exports = new ControlUtils();
