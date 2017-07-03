function LoginController() {
  // bind event listeners to button clicks //
  $('#login #forgot-password').click(function() {
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
}