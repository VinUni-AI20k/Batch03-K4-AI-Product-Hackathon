(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CRVLearnPrivacyRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SEVERITY_RANK = Object.freeze({
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
  });

  const RULES = Object.freeze([
    {
      id: "api-secret",
      label: "API key hoặc access token",
      severity: "critical",
      placeholder: "API KEY / TOKEN",
      patterns: [
        /\bAIza[0-9A-Za-z_-]{20,}\b/g,
        /\bsk-(?:ant-)?[0-9A-Za-z_-]{16,}\b/g,
        /\bgh[pousr]_[0-9A-Za-z]{20,}\b/g,
        /\bxox[baprs]-[0-9A-Za-z-]{16,}\b/g,
        /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g
      ]
    },
    {
      id: "credential",
      label: "mật khẩu, OTP hoặc mã bí mật",
      severity: "critical",
      placeholder: "THÔNG TIN ĐĂNG NHẬP",
      captureGroup: 1,
      patterns: [
        /(?:mật\s*khẩu|password|passcode|mã\s*otp|otp|mã\s*pin|pin|api[\s_-]*key|access[\s_-]*token|secret)\s*(?:của\s+tôi\s*)?(?:là|=|:)\s*([^\s,;]{4,})/giu,
        /\bbearer\s+([A-Za-z0-9._~+/=-]{16,})/giu
      ]
    },
    {
      id: "payment-card",
      label: "số thẻ thanh toán",
      severity: "critical",
      placeholder: "SỐ THẺ",
      patterns: [/\b(?:\d[ -]?){13,19}\b/g],
      validate: function (value) {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 13 && digits.length <= 19 && passesLuhn(digits);
      }
    },
    {
      id: "bank-account",
      label: "số tài khoản ngân hàng",
      severity: "critical",
      placeholder: "SỐ TÀI KHOẢN",
      captureGroup: 1,
      patterns: [
        /(?:số\s*tài\s*khoản|stk|bank\s*account)\s*(?:của\s+tôi\s*)?(?:là|=|:)?\s*([0-9][0-9 .-]{6,22}[0-9])/giu
      ],
      validate: function (value) {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 20;
      }
    },
    {
      id: "government-id",
      label: "CCCD/CMND/hộ chiếu",
      severity: "high",
      placeholder: "GIẤY TỜ ĐỊNH DANH",
      captureGroup: 1,
      patterns: [
        /(?:cccd|cmnd|căn\s*cước(?:\s*công\s*dân)?|chứng\s*minh(?:\s*nhân\s*dân)?|passport|hộ\s*chiếu)\s*(?:của\s+tôi\s*)?(?:là|=|:|số)?\s*([A-Z0-9][A-Z0-9 .-]{7,17})/giu
      ],
      validate: function (value) {
        const compact = value.replace(/[\s.-]/g, "");
        return /^[A-Z0-9]{8,16}$/i.test(compact);
      }
    },
    {
      id: "government-id-12",
      label: "dãy 12 số có thể là CCCD",
      severity: "high",
      placeholder: "DÃY SỐ ĐỊNH DANH",
      patterns: [/\b\d{3}[ .-]?\d{3}[ .-]?\d{3}[ .-]?\d{3}\b/g]
    },
    {
      id: "phone",
      label: "số điện thoại",
      severity: "high",
      placeholder: "SỐ ĐIỆN THOẠI",
      patterns: [/(?:\+?84|0)[ .-]?[35789](?:[ .-]?\d){8}\b/g],
      validate: function (value) {
        let digits = value.replace(/\D/g, "");
        if (digits.startsWith("84")) digits = "0" + digits.slice(2);
        return /^0[35789]\d{8}$/.test(digits);
      }
    },
    {
      id: "email",
      label: "địa chỉ email",
      severity: "medium",
      placeholder: "EMAIL",
      patterns: [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi]
    },
    {
      id: "student-id",
      label: "mã số học viên/sinh viên",
      severity: "medium",
      placeholder: "MÃ HỌC VIÊN",
      captureGroup: 1,
      patterns: [
        /(?:mssv|mã\s*số\s*(?:sinh\s*viên|học\s*viên)|student\s*id)\s*(?:của\s+tôi\s*)?(?:là|=|:)?\s*([A-Z0-9][A-Z0-9_-]{4,19})/giu
      ]
    },
    {
      id: "date-of-birth",
      label: "ngày sinh",
      severity: "medium",
      placeholder: "NGÀY SINH",
      captureGroup: 1,
      patterns: [
        /(?:ngày\s*sinh|sinh\s*ngày|date\s*of\s*birth|dob)\s*(?:của\s+tôi\s*)?(?:là|=|:)?\s*((?:0?[1-9]|[12]\d|3[01])[./-](?:0?[1-9]|1[0-2])[./-](?:19|20)\d{2})/giu
      ]
    },
    {
      id: "home-address",
      label: "địa chỉ nhà",
      severity: "high",
      placeholder: "ĐỊA CHỈ NHÀ",
      captureGroup: 1,
      patterns: [
        /(?:địa\s*chỉ(?:\s*nhà)?|nhà\s*tôi\s*ở|tôi\s*sống\s*tại)\s*(?:của\s*tôi\s*)?(?:là|=|:|ở)?\s*([^,;\n]{8,100}(?:,\s*[^;\n]{2,50}){0,3})/giu
      ],
      validate: function (value) {
        return /\p{L}/u.test(value) && /\d/.test(value);
      }
    },
    {
      id: "full-name",
      label: "họ tên",
      severity: "medium",
      placeholder: "HỌ TÊN",
      captureGroup: 1,
      patterns: [
        /(?:tôi\s*tên\s*là|họ\s*(?:và|&)\s*tên(?:\s*của\s*tôi)?|my\s*name\s*is)\s*[:=-]?\s*([\p{Lu}][\p{L}'’-]+(?:\s+[\p{Lu}][\p{L}'’-]+){1,5})/giu
      ]
    }
  ]);

  function passesLuhn(digits) {
    let sum = 0;
    let doubleNext = false;
    for (let index = digits.length - 1; index >= 0; index -= 1) {
      let digit = Number(digits[index]);
      if (doubleNext) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      doubleNext = !doubleNext;
    }
    return sum % 10 === 0;
  }

  function clonePattern(pattern) {
    const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
    return new RegExp(pattern.source, flags);
  }

  function locateCapturedValue(match, captureGroup) {
    const value = captureGroup ? match[captureGroup] : match[0];
    if (!value) return null;
    const offset = captureGroup ? match[0].indexOf(value) : 0;
    if (offset < 0) return null;
    return {
      value: value,
      start: match.index + offset,
      end: match.index + offset + value.length
    };
  }

  function overlaps(left, right) {
    return left.start < right.end && right.start < left.end;
  }

  function analyze(text) {
    const source = String(text || "");
    const candidates = [];

    RULES.forEach(function (rule) {
      rule.patterns.forEach(function (pattern) {
        const regex = clonePattern(pattern);
        let match;
        while ((match = regex.exec(source)) !== null) {
          const located = locateCapturedValue(match, rule.captureGroup);
          if (!located) continue;
          if (rule.validate && !rule.validate(located.value, source, match)) continue;
          candidates.push({
            id: rule.id,
            label: rule.label,
            severity: rule.severity,
            placeholder: rule.placeholder,
            start: located.start,
            end: located.end,
            value: located.value
          });
          if (match[0].length === 0) regex.lastIndex += 1;
        }
      });
    });

    candidates.sort(function (left, right) {
      if (left.start !== right.start) return left.start - right.start;
      const severityDelta = SEVERITY_RANK[right.severity] - SEVERITY_RANK[left.severity];
      if (severityDelta) return severityDelta;
      return (right.end - right.start) - (left.end - left.start);
    });

    const findings = [];
    candidates.forEach(function (candidate) {
      if (!findings.some(function (kept) { return overlaps(candidate, kept); })) {
        findings.push(candidate);
      }
    });

    const highestSeverity = findings.reduce(function (highest, finding) {
      return SEVERITY_RANK[finding.severity] > SEVERITY_RANK[highest]
        ? finding.severity
        : highest;
    }, "low");

    return {
      hasSensitive: findings.length > 0,
      highestSeverity: findings.length ? highestSeverity : null,
      findings: findings
    };
  }

  function mask(text, findings) {
    let output = String(text || "");
    const ordered = (findings || analyze(output).findings)
      .slice()
      .sort(function (left, right) { return right.start - left.start; });

    ordered.forEach(function (finding) {
      const replacement = "[ĐÃ ẨN: " + finding.placeholder + "]";
      output = output.slice(0, finding.start) + replacement + output.slice(finding.end);
    });
    return output;
  }

  return Object.freeze({
    rules: RULES,
    analyze: analyze,
    mask: mask,
    passesLuhn: passesLuhn
  });
});
