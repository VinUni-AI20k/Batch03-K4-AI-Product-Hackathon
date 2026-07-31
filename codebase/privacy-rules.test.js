"use strict";

const assert = require("node:assert/strict");
const privacy = require("./privacy-rules.js");

function ids(text) {
  return privacy.analyze(text).findings.map(function (finding) {
    return finding.id;
  });
}

assert.equal(
  privacy.analyze("Giải thích giúp tôi Context Window ở trang 14.").hasSensitive,
  false
);
assert.equal(
  privacy.analyze("Tính chi phí cho 2 triệu input token và 1 triệu output token.").hasSensitive,
  false
);
assert.ok(ids("Liên hệ tôi qua an.nguyen+learn@example.com nhé.").includes("email"));
assert.ok(ids("Số điện thoại của tôi là 0912 345 678.").includes("phone"));
assert.ok(ids("CCCD của tôi là 001203004567.").includes("government-id"));
assert.ok(ids("MSSV của tôi là HE123456.").includes("student-id"));
assert.ok(ids("Ngày sinh của tôi là 09/11/2001.").includes("date-of-birth"));
assert.ok(ids("Địa chỉ nhà tôi là 25 Nguyễn Trãi, Hà Nội.").includes("home-address"));
assert.ok(ids("Tôi tên là Nguyễn Văn An.").includes("full-name"));
assert.ok(ids("Số tài khoản của tôi là 1234 5678 9012.").includes("bank-account"));
assert.ok(ids("Mật khẩu của tôi là MatKhau!234").includes("credential"));
const syntheticApiKey = ["sk", "ant-api03", "abcdefghijklmnopqrstu"].join("-");
assert.ok(ids("Key là " + syntheticApiKey).includes("api-secret"));
assert.ok(ids("Thẻ của tôi: 4111 1111 1111 1111").includes("payment-card"));
assert.equal(privacy.passesLuhn("4111111111111111"), true);
assert.equal(privacy.passesLuhn("4111111111111112"), false);

const privateText = "Email an.nguyen@example.com, gọi 0912345678.";
const result = privacy.analyze(privateText);
const masked = privacy.mask(privateText, result.findings);
assert.equal(masked.includes("an.nguyen@example.com"), false);
assert.equal(masked.includes("0912345678"), false);
assert.equal(privacy.analyze(masked).hasSensitive, false);

console.log("privacy-rules: all tests passed");
