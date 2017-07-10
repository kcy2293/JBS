function LoginController() {
  // bind event listeners to button clicks //
  $('#login #forgot-password').click(function() {
    $("#cancel").html('Cancel');
    $('#retrieve-password-submit').show();
    $('#get-credentials').modal('show');
  });

  $('#retrieve-password-submit').click(function() {
    $('#get-credentials-form').submit();
  });

  $('#login .button-remember-me').click(function(e) {
    var span = $(this).find('span');
    if (span.hasClass('glyphicon-unchecked')) {
      span.addClass('glyphicon-ok');
      span.removeClass('glyphicon-unchecked');
    } else {
      span.removeClass('glyphicon-ok');
      span.addClass('glyphicon-unchecked');
    }
  });

  $('#get-credentials').on('shown.bs.modal', function() {
    $('#email-tf').focus();
  });

  $('#get-credentials').on('hidden.bs.modal', function() {
    $('#user-tf').focus();
  });
}