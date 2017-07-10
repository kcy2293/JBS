$(document).ready(function() {
  var lv = new LoginValidator();
  var lc = new LoginController();
  // main login form //
  $("#form-login").ajaxForm({
    beforeSubmit : function(formData, jqForm, options) {
      if (lv.validateForm() == false) {
        return false;
      } else {
        formData.push({
          name: 'remember-me',
          value: $('.button-remember-me-glyph').hasClass('glyphicon-ok')
        });
        return true;
      }
    },
    success : function(responseText, status, xhr, $form) {
      if (status == 'success') window.location.href = '/home';
    },
    error : function(e) {
      if (e.status == 404) {
        lv.showLoginError('오류', '서버 오류. 잠시 후에 다시 시도해주세요');
      } else {
        lv.showLoginError('Login 실패', 'username 또는 password 를 다시 확인하고 입력해주세요');
      }
    }
  });

  $('#user-tf').focus();

  var ev = new EmailValidator();

  $('#get-credentials-form').ajaxForm({
    url: '/lost-password',
    beforeSubmit: function(formData, jqForm, options) {
      if (ev.validateEmail($('#email-tf').val())) {
        ev.hideEmailAlert();
        return true;
      } else {
        ev.showEmailAlert('<b>Error!</b> 올바른 이메일주소를 입력해주세요');
        return false;
      }
    },
    success: function(responseText, status, xhr, $form) {
      $('#cancel').html('OK');
      $('#retrieve-password-submit').hide();
      ev.showEmailSuccess("비밀번호를 재설정하는 방법을 이메일로 확인하세요");
    },
    error: function(e) {
      if (e.responseText == 'email-not-found') {
        ev.showEmailAlert("해당 이메일로 가입된 정보가 없습니다.");
      } else {
        $('#cancel').html('OK');
        $('#retrieve-password-submit').hide();
        ev.showEmailAlert('죄송합니다. 시스템에 문제가 있습니다. 잠시 후 다시 시도해주세요');
      }
    }
  });
});