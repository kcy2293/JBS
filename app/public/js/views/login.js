$(document).ready(function() {
  var lv = new LoginValidator();
  var lc = new LoginController();
  // main login form //
  $("#form-login").ajaxForm({
    beforeSubmit : function(formData, jqForm, options) {
      if (lv.validateForm() == false) {
        return false;
      } else {
        console.log(formData);
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
});