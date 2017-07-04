function AccountValidator() {
  this.formFields = [$('#name-tf'), $('#email-tf'), $('#user-tf'), $('#pass-tf')];
  this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg')];

  this.alert = $('.modal-form-errors');
  this.alert.modal({ show: false, keyboard: true, backdrop: true});

  this.validateName = function(s) {
    return s.length >= 3;
  };

  this.validatePassword = function(s) {
    if ($('#userId').val() && s === '') {
      return true;
    } else {
      return s.length >= 6;
    }
  };

  this.validateEmail = function(e) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(e);
  };

  this.showErrors = function(a) {
    $('.modal-form-errors .modal-body p').text('다음과 같은 오류가 있습니다 : ');
    var ul = $('.modal-form-errors .modal-body ul');
    ul.empty();
    for (var i = 0 ; i < a.length ; i++) {
      ul.append('<li>' + a[i] + '</li>');
    }
    this.alert.modal('show');
  };
}

AccountValidator.prototype.showInvalidEmail = function() {
  this.controlGroups[1].addClass('has-error');
  this.showErrors(['이메일 주소가 이미 사용중입니다.'])
};

AccountValidator.prototype.showInvalidUserName = function() {
  this.controlGroups[2].addClass('has-error');
  this.showErrors(['계정이름이 이미 사용중입니다.'])
};
AccountValidator.prototype.validateForm = function() {
  var e = [];
  for (var i = 0 ; i < this.controlGroups.length ; i++) {
    this.controlGroups[i].removeClass('has-error');
  }

  if (this.validateName(this.formFields[0].val()) == false) {
    this.controlGroups[0].addClass('has-error');
    e.push('이름을 입력해주세요');
  }
  if (this.validateEmail(this.formFields[1].val()) == false) {
    this.controlGroups[1].addClass('has-error');
    e.push('올바른 이메일 주소를 입력해주세요');
  }
  if (this.validatePassword(this.formFields[3].val()) == false) {
    this.controlGroups[3].addClass('has-error');
    e.push('비밀번호는 최소 6자 이상 입력해주세요');
  }

  if (e.length) this.showErrors(e);
  return e.length === 0;
};
