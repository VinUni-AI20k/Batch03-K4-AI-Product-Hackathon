(function () {
  "use strict";

  const privacy = window.CRVLearnPrivacyRules;
  const input = document.querySelector("#input");
  const sendButton = document.querySelector("#btnSend");
  const composer = document.querySelector(".composer");
  if (!privacy || !input || !sendButton || !composer) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "privacy-guard.css";
  document.head.appendChild(stylesheet);

  const note = document.createElement("div");
  note.id = "privacyNote";
  note.className = "privacy-note";
  note.innerHTML =
    "🛡️ Không nhập thông tin cá nhân, mật khẩu hoặc API key vào hội thoại. " +
    "Khi bật AI thật, nội dung bạn gửi sẽ được chuyển tới nhà cung cấp AI đang chọn.";

  const alertBox = document.createElement("section");
  alertBox.id = "privacyAlert";
  alertBox.className = "privacy-alert";
  alertBox.hidden = true;
  alertBox.tabIndex = -1;
  alertBox.setAttribute("role", "alert");
  alertBox.setAttribute("aria-live", "assertive");
  alertBox.innerHTML =
    '<strong>⚠️ Có thể bạn đang nhập thông tin riêng tư</strong>' +
    '<div class="privacy-alert__details"></div>' +
    '<div class="privacy-alert__actions">' +
      '<button type="button" class="privacy-redact">Che thông tin</button>' +
      '<button type="button" class="privacy-edit">Sửa lại</button>' +
      '<button type="button" class="privacy-send-anyway" hidden>Vẫn gửi</button>' +
    "</div>";

  composer.parentNode.insertBefore(note, composer);
  composer.parentNode.insertBefore(alertBox, composer);

  const details = alertBox.querySelector(".privacy-alert__details");
  const redactButton = alertBox.querySelector(".privacy-redact");
  const editButton = alertBox.querySelector(".privacy-edit");
  const sendAnywayButton = alertBox.querySelector(".privacy-send-anyway");
  let currentResult = privacy.analyze("");
  let bypassValue = null;

  const describedBy = (input.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .filter(Boolean);
  describedBy.push(note.id, alertBox.id);
  input.setAttribute("aria-describedby", Array.from(new Set(describedBy)).join(" "));

  function labelsFor(findings) {
    return Array.from(new Set(findings.map(function (finding) {
      return finding.label;
    })));
  }

  function render(result, isSendAttempt) {
    currentResult = result;
    if (!result.hasSensitive) {
      alertBox.hidden = true;
      sendAnywayButton.hidden = true;
      input.classList.remove("privacy-detected");
      input.removeAttribute("aria-invalid");
      return;
    }

    const labels = labelsFor(result.findings);
    details.textContent =
      "Phát hiện: " + labels.join(", ") + ". " +
      (isSendAttempt
        ? "Nội dung chưa được gửi. Hãy che, sửa lại hoặc xác nhận vẫn gửi."
        : "Hệ thống mới chỉ kiểm tra trên thiết bị và chưa gửi nội dung này.");
    alertBox.hidden = false;
    sendAnywayButton.hidden = !isSendAttempt;
    input.classList.add("privacy-detected");
    input.setAttribute("aria-invalid", "true");
  }

  function refresh(isSendAttempt) {
    const result = privacy.analyze(input.value);
    render(result, Boolean(isSendAttempt));
    return result;
  }

  function shouldBlockSend() {
    if (bypassValue !== null && bypassValue === input.value) {
      bypassValue = null;
      return false;
    }
    const result = refresh(true);
    if (!result.hasSensitive) return false;
    alertBox.focus({ preventScroll: true });
    alertBox.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return true;
  }

  input.addEventListener("input", function () {
    bypassValue = null;
    refresh(false);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    if (!shouldBlockSend()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener("click", function (event) {
    const target = event.target instanceof Element
      ? event.target.closest("#btnSend")
      : null;
    if (!target || !shouldBlockSend()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  redactButton.addEventListener("click", function () {
    const result = privacy.analyze(input.value);
    input.value = privacy.mask(input.value, result.findings);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  });

  editButton.addEventListener("click", function () {
    input.focus();
  });

  sendAnywayButton.addEventListener("click", function () {
    bypassValue = input.value;
    sendButton.click();
    queueMicrotask(function () {
      refresh(false);
    });
  });

  const apiKeyInput = document.querySelector("#apiKey");
  if (apiKeyInput) {
    const keyNotice = document.createElement("span");
    keyNotice.id = "privacyKeyNotice";
    keyNotice.className = "privacy-key-hint";
    keyNotice.textContent =
      "Chỉ dán key vào trường này; đừng gửi key trong ô hội thoại. Key được lưu cục bộ theo cấu hình hiện tại.";
    apiKeyInput.insertAdjacentElement("afterend", keyNotice);
    apiKeyInput.setAttribute("aria-describedby", keyNotice.id);
  }
})();
