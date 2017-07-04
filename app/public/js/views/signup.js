$(document).ready(function() {
  var av = new AccountValidator();
  var sc = new SignupController();

  $("#account-form").ajaxForm({
    beforeSubmit: function(formData, jqForm, options) {
      // form check
      return av.validateForm();
    },
    success: function(responseText, status, xhr, $form) {
      if (status == 'success')
        $('.modal-alert').modal('show');
    },
    error: function(e) {
      if (e.status == 404) {
        av.showErrors(['서버 오류. 잠시 후에 다시 시도해주세요']);
      } else if (e.responseText == 'email-taken') {
        av.showInvalidEmail();
      } else if (e.responseText == 'username-taken') {
        av.showInvalidUserName();
      }
    }
  });

  $('#account-form h2').text('회원가입');
  $('#account-form #sub1').text('간단한 개인정보를 입력해주세요');
  $('#account-form #sub2').text('계정명과 비밀번호를 입력해주세요');
  $('#account-form-btn1').html('취소');
  $('#account-form-btn2').html('가입');

  $('.modal-alert').modal({show: false, keyboard: false, backdrop: 'static'});
  $('.modal-alert .modal-header h4').text('가입완료!!');
  $('.modal-alert .modal-body p').html('계성이 생성되었습니다. </br> OK 버튼을 누르시면 로그인 페이지로 이동합니다.');

});