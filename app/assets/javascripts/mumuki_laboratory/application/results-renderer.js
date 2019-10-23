(() => {

  // ==========================
  // View function for building
  // the results UI
  // ==========================

  function _messageForStatus(status) {
    if (!["errored", "failed", "passed_with_warnings", "passed"].includes(status)) {
      throw `Unsupported status ${status}`;
    }
    return mumuki.translate(status);
  }

  function _iconForStatus(status) {
    switch (status) {
      case "errored":              return "fa-minus-circle";
      case "failed":               return "fa-times-circle";
      case "passed_with_warnings": return "fa-exclamation-circle";
      case "passed":               return "fa-check-circle";
    }
  }

  function _closeModalButtonHtml() {
    return `<button class="btn btn-success btn-block mu-close-modal">${mumuki.translate('keep_learning')}</button>`;
  }

  function _retryButtonHtml() {
    const retryMessage = mumuki.translate('retry_exercise');
    return `<button class="btn btn-success btn-block submission-control" id="kids-btn-retry" data-dismiss="modal" aria-label="${retryMessage}"> ${retryMessage}</button>`;
  }

  function _nextExerciseButton() {
    return `
      <a class="btn btn-success btn-block" role="button" href="../exercises/${mumuki.currentExerciseId + 1}.html">
        ${mumuki.translate('next_exercise')} <i class="fa fa-chevron-right"></i>
      </a>`; // TODO missing exercise title
  }

  mumuki.classForStatus = function (status) {
    switch (status) {
      case "passed": return "success";
      case "failed": return "danger";
      case "passed_with_warnings": return "warning";
      case "errored": return "broken";
      case "pending": return "muted";
    }
  };

  mumuki.renderTitleHtml = function (status) {
    return `<h4 class="text-${mumuki.classForStatus(status)}"><strong><i class="fa ${_iconForStatus(status)}"></i>${_messageForStatus(status)}</strong></h4>`;
  };

  mumuki.renderButtonHtml = function (status) {
    return `
      <div class="row">
        <div class="col-md-12">
          <div class="actions">
            ${status === 'passed' ? _nextExerciseButton() : _retryButtonHtml()}
          </div>
        </div>
      </div>`;
  };

  mumuki.renderCorollaryHtml = function (status, exercise) {
    const statusClass = mumuki.classForStatus(status);
    if (exercise.layout == 'input_kids') {
      return `
        <div class="mu-kids-callout-${statusClass}">
        </div>
        <img class="capital-animation mu-kids-corollary-animation"/>
        <div class="mu-last-box">
          ${exercise.corollary}
        </div>`;
    } else {
      return `
        <div class="bs-callout bs-callout-${statusClass}">
          <h4 class="text-${statusClass}">
            <strong><i class="fa ${_iconForStatus(status)}"></i>${_messageForStatus(status)}</strong>
          </h4>
        </div>
        <div>
          ${status === 'passed' ? exercise.corollary : ''}
        </div>
        ${mumuki.renderButtonHtml(status)}`;
    }
  };

  function _renderExpectationHtml (result) {
    const status = result.result ? 'passed' : 'failed';
    return `
      <li>
        <i class="text-${mumuki.classForStatus(status)} fa ${_iconForStatus(status)}"></i>
        ${mulang.I18n.translate(result.expectation.binding, result.expectation.inspection)}
      </li>`;
  }

  mumuki.renderExpectationsHtml = function (exercise, results) {
    return `
      <div class="results-item">
        ${exercise.layout == 'input_kids' ? '' : `<strong>${mumuki.translate('unmeet_expectations')}</strong>`}
        <ul class="results-list">
          ${results.map(_renderExpectationHtml).join('\n')}
        </ul>
      </div>`;
  };



})();
