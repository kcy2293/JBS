$(document).ready(function() {
  var rv = new ResetValidator();

  $('#set-password-form').ajaxForm({
    beforeSubmit: function(formData, jqForm, options) {
      rv.hideAlert();
      if (rv.validatePassword($('#pass-tf').val()) == false) {
        return false;
      } else {
        return true;
      }
    },
    success: function(responseText, status, xhr, $form) {
      rv.showSuccess("비밀번호 재설정이 완료되었습니다.");
      setTimeout(function() {
        window.location.href = '/';
      }, 3000);
    },
    error: function() {
      rv.showAlert("죄송합니다. 서버에 문제가 발생되었습니다. 잠시 후 다시 시도해주세요");
    }
  });

  $('#set-password').modal('show');
  $('#set-password').on('shown', function() {
    $('#pass-tf').focus();
  });
});