(() => {

  const OfflineMode = new class {
    // Runs solution by evaluating it locally
    runNewSolution(exerciseId, solution, _bridge) {
      return mumuki.runSolutionOffline(exerciseId, solution);
    }

    // Renders progress from SubmissionsStore
    renderExercisesProgressBar() {
      $('.progress-list-item').each((_, it) => this._updateProgressListItemClass($(it)));
    }

    configureExerciseEditorValue() {
      const lastSubmission = mumuki.SubmissionsStore.getLastSubmission(mumuki.currentExerciseId);
      if (lastSubmission) {
        // TODO extract
        if (lastSubmission.content.solution) {
          $('#mu-custom-editor-value').val(lastSubmission.content.solution.content);
        } else {
          mumuki.editor.setContent(lastSubmission.content['solution[content]']);
        }
      }
    }

    _updateProgressListItemClass(a) {
      const exerciseId = a.data('mu-exercise-id');
      const status = mumuki.SubmissionsStore.getLastSubmissionStatus(exerciseId);
      a.attr('class', mumuki.progressListItemClassForStatus(status, exerciseId == mumuki.currentExerciseId));
    }
  }

  const OnlineMode = new class {
    // Runs solution by sending it to server
    runNewSolution(exerciseId, solution, bridge) {
      return bridge.submitCurrentExerciseSolution(exerciseId, solution);
    }

    // Does nothing. Progress is rendered by server
    renderExercisesProgressBar() {
    }

    // Does nothing. Editor value is configured by server
    configureExerciseEditorValue() {
    }

  }

  mumuki.goOnline = function () {
    mumuki.Connection = OnlineMode;
  };

  mumuki.goOffline = function () {
    mumuki.Connection = OfflineMode;
  };

  mumuki.goOffline();
})();
