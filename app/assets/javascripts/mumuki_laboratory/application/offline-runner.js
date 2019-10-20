(() => {
  const BasicOfflineTestRunner = new class {
    // This basic runner does not perform any test evaluation, but sets a default
    // passed state, with no test results. This could be improved in the future.
    runTests(solution, exercise, result) {
      result.status = "passed";
      result.test_results = []
    }
  }

  const MulangOfflineExpectationsRunner = new class {
    _getMulangCode(solution, exercise, result) {
      return result.mulangAst ? mulang.astCode(result.mulangAst) : mulang.nativeCode(exercise.language, solution);
    }

    _expectationsFailed(analysisResult) {
      return analysisResult.expectationResults.some((it) => !it.result);
    }

    _renderExpectationResults(exercise, analysisResult) {
      mulang.locale = mumuki.locale;
      result.expectations_html = mumuki.renderExpectationsHtml(exercise, analysisResult.expectationResults);
    }

    _updateStatus(analysisResult, result) {
      if (this._expectationsFailed(analysisResult) && result.status == 'passed') {
        result.status = 'passed_with_warnings';
      }
    }

    runExpectations(solution, exercise, result) {
      try {
        const analysisResult = this
                                ._getMulangCode(solution, exercise, result)
                                .analyse({ expectations: exercise.expectations });

        this._updateStatus(analysisResult, result);
        this._renderExpectationResults(exercise, analysisResult);
      } catch (e) {
        console.warn(`[Mumuki::Laboratory::OfflineRunner] Mulang crashed with ${JSON.stringify(e)}`);
      }
    }
  }

  function initialOfflineResult() {
    return {
      // FIXME use a roadmap
      guide_finished_by_solution: false,
      // Attemps will be not considered when offline
      remaining_attempts_html: null
    };
  }

  mumuki.runSolutionOffline = function (exerciseId, solution) {
    console.log('[Mumuki::Laboratory::OfflineRunner] Running solution...');

    const exercise = mumuki.ExercisesStore.find(exerciseId);

    let result = initialOfflineResult();

    mumuki.offlineTestRunner.runTests(solution, exercise, result);
    mumuki.offlineExpectationsRunner.runExpectations(solution, exercise, result);

    console.log(`[Mumuki::Laboratory::OfflineRunner] Done. Status is ${result.status}...`)
    return Promise.resolve(result);
  };

  // Runners may call this function to set offline test runners
  mumuki.registerOfflineTestRunner = function (runner) {
    mumuki.offlineTestRunner = runner;
  };

  // Runners may call this function to set offline expectation runners
  mumuki.registerOfflineExpectationsRunner = function (runner) {
    mumuki.offlineExpectationsRunner = runner;
  };

  mumuki.load(() => {
    mumuki.registerOfflineTestRunner(BasicOfflineTestRunner)
    mumuki.registerOfflineExpectationsRunner(MulangOfflineExpectationsRunner)
  });
})();


