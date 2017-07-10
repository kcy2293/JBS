let EM = {};
module.exports = EM;

EM.server = require('emailjs/email').server.connect({
  host: 'smtp.gmail.com',
  user: 'kcy2293@gmail.com',
  password: 'passwd',
  ssl: true
});

EM.dispatchResetPasswordLink = (account, callback) => {
  EM.server.send({
    from : 'JBS <do-not-reply@gmail.com>',
    to: account.email,
    subject : 'JBS 비밀번호 재설정',
    text : '아래 이메일로 재설정 해주세요',
    attachment: EM.composeEmail(account)
  }, callback );
};

EM.composeEmail = (o) => {
  const link = 'http://localhost/reset-password?e=' + o.email + '&p=' + o.pass;
  let html = "<html><body>";
  html += "안녕하세요 " + o.name + " 님,<br><br>";
  html += "당신의 계정명은 <b>" + o.user + "</b> 입니다.<br><br>";
  html += "<a href='" + link + "'>여기를 클릭하셔서 비밀번호를 재설정해주세요.</a><br><br>";
  html += "감사합니다.";
  html += "</body></html>";

  return [{data: html, alternative: true}];
};