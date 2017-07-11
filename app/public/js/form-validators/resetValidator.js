function ResetValidator() {
  this.setPassword = $('#set-password');
  this.setPassword.modal({ show: false, keyboard: false, backdrop: 'static'});
  this.setPasswordAlert = $('#set-password .alert');
}

ResetValidator.prototype.validatePassword = function(s) {
  if (s.length >= 6) {
    return true;
  } else {
    this.showAlert('비밀번호는 최소한 6자 이상으로 설정해주세요');
    return false;
  }
};

ResetValidator.prototype.showAlert = function(m) {
  this.setPasswordAlert.attr('class', 'alert alert-danger');
  this.setPasswordAlert.html(m);
  this.setPasswordAlert.show();
};

ResetValidator.prototype.hideAlert = function() {
  this.setPasswordAlert.hide();
};

ResetValidator.prototype.showSuccess = function(m) {
  this.setPasswordAlert.attr('class', 'alert alert-success');
  this.setPasswordAlert.html(m);
  this.setPasswordAlert.fadeIn(500);
};