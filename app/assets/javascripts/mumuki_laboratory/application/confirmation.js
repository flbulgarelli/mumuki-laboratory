mumuki.load(function () {
  $('.btn-confirmation').on('click change', function (evt) {
    var token = new mumuki.CsrfToken();

    $.ajax(token.newRequest({
      method: 'POST',
      url: $(this).data('confirmation-url'),
      xhrFields: {withCredentials: true},
      success: function(data){
        mumuki.updateCurrentExerciseProgressBarAndShowModal(data);
      }
    }));

    return true;
  });
});

