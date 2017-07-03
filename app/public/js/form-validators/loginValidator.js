function LoginValidator() {
  this.loginErrors = $('.modal-alert');
  this.showLoginError = function(t, m) {
    $('.modal-alert .modal-header h4').text(t);
    $('.modal-alert .modal-body').html(m);
    this.loginErrors.modal('show');
  }
}

LoginValidator.prototype.validateForm = function() {
  if ( $('#user-tf').val() == '') {
    this.showLoginError('Error', 'Username 을 입력해주세요');
    return false;
  } else if ( $('#pass-tf').val() == '') {
    this.showLoginError('Error', 'Password 를 입력해주세요');
    return false;
  } else {
    return true;
  }
};