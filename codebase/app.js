"use strict";

const fallbackProjects = [
  {
    stt: 1,
    khoi: "DATA - Nền tảng dữ liệu",
    ma_de: "DATA-001",
    ten_de_tai: "Phát hiện sai lệch báo cáo kinh doanh",
    job_executor: "Kỹ sư chất lượng dữ liệu",
    thuc_trang: "Theo dõi và kiểm tra dữ liệu trước khi đưa vào báo cáo.",
    pain_point: "Các quy tắc cố định khó phát hiện sai lệch nghiệp vụ và thay đổi phân phối dữ liệu.",
    hau_qua: "Báo cáo phải đính chính và quyết định có thể dựa trên dữ liệu sai.",
    quyet_dinh_ai: "Xếp hạng bảng hoặc cột dữ liệu cần được kiểm tra trước.",
    mo_ta_bai_toan:
      "Theo dõi thống kê dữ liệu theo từng lần chạy, so sánh với lịch sử và tạo hồ sơ bất thường có bằng chứng.",
    nguon_su_that: "Data warehouse, metadata schema, data profiling và lịch sử pipeline.",
    xu_ly_mo_ho: "Hiển thị độ tin cậy thấp khi bảng mới chưa đủ lịch sử.",
    gioi_han_tham_quyen: "Không tự sửa, xóa dữ liệu hoặc dừng pipeline.",
    rui_ro_domain: "Cao",
    hitl: "Data steward xác nhận trước khi chặn dataset.",
    tech_stack: "Python; PostgreSQL; Great Expectations; Airflow; dashboard dữ liệu.",
    dau_ra_co_ban: "Danh sách bảng và cột bất thường cùng chỉ số sai lệch.",
    dau_ra_nang_cao: "Liên kết bất thường với lần triển khai gần nhất.",
    metric_eval: "Recall; false positive rate; thời gian phát hiện.",
    max_team: 5,
    don_vi_goi_y: "Doanh nghiệp có data warehouse",
    learner_fit: null,
  },
  {
    stt: 2,
    khoi: "EDU - Giáo dục và nghiên cứu",
    ma_de: "EDU-001",
    ten_de_tai: "Dự báo sinh viên có nguy cơ trượt môn",
    job_executor: "Cố vấn học tập",
    thuc_trang: "Theo dõi kết quả học tập, tiến độ bài tập và mức độ tham gia.",
    pain_point: "Dữ liệu học tập nằm rải rác khiến cố vấn khó phát hiện sớm.",
    hau_qua: "Tăng tỷ lệ trượt môn và thời gian rà soát thủ công.",
    quyet_dinh_ai: "Xếp hạng sinh viên cần được cố vấn liên hệ trước.",
    mo_ta_bai_toan:
      "Tổng hợp tiến độ bài tập, điểm thành phần và số buổi vắng để tạo danh sách hỗ trợ sớm.",
    nguon_su_that: "LMS, điểm danh, điểm số và lịch sử tư vấn.",
    xu_ly_mo_ho: "Hiển thị thiếu dữ liệu thay vì kết luận sinh viên thiếu cố gắng.",
    gioi_han_tham_quyen: "Không tự cảnh cáo học vụ hoặc hạ điểm.",
    rui_ro_domain: "Cao",
    hitl: "Cố vấn xác nhận danh sách trước khi liên hệ.",
    tech_stack: "Python; FastAPI; PostgreSQL; logistic regression; dashboard cố vấn.",
    dau_ra_co_ban: "Danh sách sinh viên cần hỗ trợ và yếu tố rủi ro.",
    dau_ra_nang_cao: "Dự báo nguy cơ theo từng tuần.",
    metric_eval: "Recall; false positive rate; tỷ lệ hoàn thành môn.",
    max_team: 5,
    don_vi_goi_y: "Trường đại học hoặc nền tảng đào tạo",
    learner_fit: null,
  },
  {
    stt: 3,
    khoi: "BO - Back-office và nghiệp vụ nội bộ",
    ma_de: "BO-001",
    ten_de_tai: "Kiểm tra hồ sơ hóa đơn nhà cung cấp",
    job_executor: "Chuyên viên kế toán công nợ phải trả",
    thuc_trang: "Đối chiếu hóa đơn với đơn mua và biên bản nhận hàng.",
    pain_point: "Hóa đơn đến từ nhiều kênh và định dạng khác nhau.",
    hau_qua: "Tăng thời gian xử lý và nguy cơ thanh toán trùng.",
    quyet_dinh_ai: "Xác định hóa đơn đủ điều kiện hay cần bổ sung chứng từ.",
    mo_ta_bai_toan:
      "Trích xuất thông tin hóa đơn và phân loại hồ sơ thành khớp, thiếu dữ liệu hoặc có sai lệch.",
    nguon_su_that: "Hóa đơn, purchase order, hợp đồng và ERP.",
    xu_ly_mo_ho: "Yêu cầu chuyên viên xác minh khi ghép dữ liệu không chắc chắn.",
    gioi_han_tham_quyen: "Không tự phê duyệt hoặc thực hiện thanh toán.",
    rui_ro_domain: "Rất cao",
    hitl: "Kế toán xác nhận mọi sai lệch.",
    tech_stack: "Python; FastAPI; PostgreSQL; OCR; rule engine.",
    dau_ra_co_ban: "Trạng thái hồ sơ, sai lệch và thông tin còn thiếu.",
    dau_ra_nang_cao: "Phát hiện hóa đơn có nguy cơ trùng.",
    metric_eval: "Thời gian xử lý; tỷ lệ đối soát đúng.",
    max_team: 4,
    don_vi_goi_y: "Doanh nghiệp có khối lượng hóa đơn lớn",
    learner_fit: null,
  },
  {
    stt: 4,
    khoi: "AIP",
    ma_de: "AIP-01",
    ten_de_tai: "Phân loại sự cố triển khai mô hình",
    job_executor: "ML Platform Engineer",
    thuc_trang: "Thu thập log, đối chiếu runbook và tạo ticket.",
    pain_point: "Kỹ sư phải đọc log từ nhiều dịch vụ để xác định nguyên nhân.",
    hau_qua: "Mỗi sự cố mất nhiều thời gian phân loại.",
    quyet_dinh_ai: "Phân nhóm lỗi và đề xuất bước kiểm tra tiếp theo.",
    mo_ta_bai_toan: "Tạo checklist điều tra dựa trên log và runbook.",
    nguon_su_that: "Log CI/CD, model serving và incident history.",
    xu_ly_mo_ho: "Trả trạng thái chưa xác định nếu không đủ log.",
    gioi_han_tham_quyen: "Không tự rollback hoặc redeploy.",
    rui_ro_domain: "Cao",
    hitl: "ML Platform Engineer xác nhận hành động.",
    tech_stack: "Python; FastAPI; OpenTelemetry; PostgreSQL.",
    dau_ra_co_ban: "Nhóm lỗi, bằng chứng và checklist.",
    dau_ra_nang_cao: "Timeline và so khớp incident tương tự.",
    metric_eval: "Accuracy; time-to-triage.",
    max_team: 4,
    don_vi_goi_y: "Đội phát triển nền tảng AI",
    learner_fit: null,
  },
];

const interestOptions = [
  { id: "data", label: "Dữ liệu & AI", icon: "⌁" },
  { id: "product", label: "Web / Product", icon: "◫" },
  { id: "education", label: "Giáo dục", icon: "⌂" },
  { id: "finance", label: "Tài chính", icon: "◇" },
  { id: "operations", label: "Vận hành", icon: "↗" },
  { id: "security", label: "An ninh & hệ thống", icon: "◈" },
];

const skillOptions = [
  "Python",
  "SQL",
  "React",
  "Phân tích dữ liệu",
  "Machine Learning",
  "Thiết kế UX",
  "Thuyết trình",
  "Quản lý dự án",
];

const interestRules = {
  data: {
    blockTokens: ["DATA", "AIP", "ITOPS", "DEV"],
    keywords: ["dữ liệu", "data", "mô hình", "python", "sql", "pipeline", "ai"],
    label: "Dữ liệu & AI",
  },
  product: {
    blockTokens: ["O2O", "RET", "VFO", "EDU"],
    keywords: ["khách", "ứng dụng", "web", "sản phẩm", "trải nghiệm", "lead"],
    label: "Web / Product",
  },
  education: {
    blockTokens: ["EDU"],
    keywords: ["học", "sinh viên", "giảng viên", "đào tạo", "lms", "giáo dục"],
    label: "Giáo dục",
  },
  finance: {
    blockTokens: ["FIN", "BO"],
    keywords: ["tài chính", "hóa đơn", "kế toán", "chi phí", "công nợ", "thanh toán"],
    label: "Tài chính",
  },
  operations: {
    blockTokens: ["MFG", "SC", "VHR", "RET", "RAV", "O2O"],
    keywords: ["vận hành", "bảo trì", "sự cố", "tồn kho", "điều phối", "quy trình"],
    label: "Vận hành",
  },
  security: {
    blockTokens: ["VSOC", "ITOPS", "AIP"],
    keywords: ["an ninh", "sự cố", "log", "rủi ro", "hệ thống", "bảo mật"],
    label: "An ninh & hệ thống",
  },
};

const APPEARANCE_STORAGE_KEY = "detai-plus-appearance";
const defaultAppearanceSettings = {
  theme: "system",
  font: "vietnamese",
  reducedMotion: false,
};
const systemColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const appearanceSettings = readAppearanceSettings();
let appearanceTrigger = null;

const API_BASE = window.DETAI_API_BASE || "http://localhost:8001";
const OCR_API_BASE = window.DETAI_OCR_API_BASE || "http://localhost:8080";

const ocrWarningLabels = {
  OCR_LANGUAGE_UNAVAILABLE: "Thiếu gói ngôn ngữ OCR được yêu cầu; agent đã dùng ngôn ngữ có sẵn.",
  OCR_LOW_CONFIDENCE: "Một phần nội dung ảnh có độ tin cậy thấp.",
  NO_MEANINGFUL_TEXT: "Tệp có quá ít nội dung đọc được.",
  PROMPT_INJECTION_DETECTED: "Phát hiện câu lệnh trong tài liệu; agent chỉ coi đó là dữ liệu không tin cậy.",
  LLM_UNAVAILABLE: "Bộ phân tích tùy chọn không khả dụng; agent đã dùng quy tắc cục bộ.",
  LLM_INVALID_JSON: "Kết quả phân tích tùy chọn không hợp lệ; agent đã dùng quy tắc cục bộ.",
  EXTERNAL_PROCESSING_CONSENT_REQUIRED: "Không có đồng ý xử lý ngoài máy; agent chỉ xử lý cục bộ.",
  EXTERNAL_VISION_DISABLED_FOR_PRIVACY: "Ảnh không được gửi ra ngoài vì không thể bảo đảm che PII.",
  TEMP_FILE_DELETE_FAILED: "Không thể xác nhận đã xóa toàn bộ tệp tạm; quản trị viên cần kiểm tra.",
};

const state = {
  stage: "profile",
  activeView: "advisor",
  onboardingStep: 1,
  profileLoaded: false,
  profileName: "",
  profileMajor: "",
  ocrProfile: null,
  ocrRunId: null,
  ocrConfirmed: false,
  ocrRequestToken: 0,
  extractedProjects: [],
  experienceLevel: "unknown",
  interest: null,
  skills: ["Python", "SQL", "Phân tích dữ liệu"],
  teamSize: 4,
  difficulty: "balanced",
  projects: fallbackProjects,
  recommendations: [],
  recommendationMeta: null,
  suggestedTopics: [],
  catalogLimit: 12,
};

const refs = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  applyAppearanceSettings(false);
  bindGlobalEvents();
  renderInitialConversation();
  syncOnboardingSelections();
  renderTopicCatalog();
  openOnboarding(1);
  await loadProjects();
}

function cacheElements() {
  [
    "chatStream",
    "chatInput",
    "sendMessage",
    "composerWrap",
    "composerAttach",
    "profileFileInput",
    "profilePanel",
    "profileEmpty",
    "profileContent",
    "profileName",
    "profileHeadline",
    "profileSkills",
    "profileGoal",
    "skillCount",
    "fitSummary",
    "mobileProfileToggle",
    "openCatalogTop",
    "advisorTab",
    "catalogTab",
    "catalogTabCount",
    "topicExplorer",
    "topicSearch",
    "topicCategory",
    "topicTeamFilter",
    "topicSort",
    "topicResultCount",
    "topicList",
    "catalogEmpty",
    "catalogLoadMoreWrap",
    "loadMoreTopics",
    "clearTopicFilters",
    "emptyClearFilters",
    "catalogSuggestTopic",
    "appearanceModal",
    "closeAppearanceSettings",
    "doneAppearanceSettings",
    "resetAppearanceSettings",
    "reducedMotionToggle",
    "themeColor",
    "onboardingModal",
    "onboardingMobileStep",
    "onboardingFileBtn",
    "onboardingSampleBtn",
    "onboardingFileLabel",
    "onboardingFileMeta",
    "ocrReview",
    "ocrReviewTitle",
    "ocrReviewStatus",
    "ocrRunMeta",
    "ocrReviewError",
    "ocrReviewFields",
    "ocrSkills",
    "ocrExperience",
    "ocrProjects",
    "ocrInterests",
    "ocrWarningWrap",
    "ocrWarnings",
    "ocrConfirmProfile",
    "onboardingOcrGateError",
    "onboardingName",
    "onboardingMajor",
    "onboardingNext1",
    "onboardingNext2",
    "onboardingStep2Error",
    "browseBeforeProfile",
    "completeOnboarding",
    "openSuggestTop",
    "openSuggestFromSidebar",
    "suggestModal",
    "closeSuggest",
    "cancelSuggest",
    "suggestForm",
    "newTopicTitle",
    "newTopicArea",
    "newTopicTeam",
    "newTopicProblem",
    "newTopicSkills",
    "resetDemo",
    "catalogCsvInput",
    "importCatalogCsv",
    "restoreDefaultCatalog",
    "detailBackdrop",
    "detailDrawer",
    "detailCode",
    "detailTitle",
    "detailContent",
    "closeDetail",
    "toast",
  ].forEach((id) => {
    refs[id] = document.getElementById(id);
  });
}

function bindGlobalEvents() {
  document.querySelectorAll("[data-open-settings]").forEach((button) => {
    button.addEventListener("click", openAppearanceModal);
  });
  refs.closeAppearanceSettings.addEventListener("click", closeAppearanceModal);
  refs.doneAppearanceSettings.addEventListener("click", closeAppearanceModal);
  refs.resetAppearanceSettings.addEventListener("click", resetAppearanceSettings);
  refs.appearanceModal.addEventListener("click", (event) => {
    if (event.target === refs.appearanceModal) closeAppearanceModal();
  });
  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.addEventListener("click", () => {
      appearanceSettings.theme = button.dataset.themeOption;
      applyAppearanceSettings();
    });
  });
  document.querySelectorAll("[data-font-option]").forEach((button) => {
    button.addEventListener("click", () => {
      appearanceSettings.font = button.dataset.fontOption;
      applyAppearanceSettings();
    });
  });
  refs.reducedMotionToggle.addEventListener("change", () => {
    appearanceSettings.reducedMotion = refs.reducedMotionToggle.checked;
    applyAppearanceSettings();
  });

  const handleSystemThemeChange = () => {
    if (appearanceSettings.theme === "system") applyAppearanceSettings(false);
  };
  if (typeof systemColorScheme.addEventListener === "function") {
    systemColorScheme.addEventListener("change", handleSystemThemeChange);
  } else {
    systemColorScheme.addListener(handleSystemThemeChange);
  }

  refs.profileFileInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) void readProfileFile(file);
  });

  refs.composerAttach.addEventListener("click", () => openOnboarding(1));
  refs.sendMessage.addEventListener("click", handleTypedMessage);
  refs.chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleTypedMessage();
    }
  });
  refs.chatInput.addEventListener("input", autoResizeComposer);

  [refs.openSuggestTop, refs.openSuggestFromSidebar].forEach((button) => {
    button.addEventListener("click", openSuggestModal);
  });
  [refs.closeSuggest, refs.cancelSuggest].forEach((button) => {
    button.addEventListener("click", closeSuggestModal);
  });
  refs.suggestModal.addEventListener("click", (event) => {
    if (event.target === refs.suggestModal) closeSuggestModal();
  });
  refs.suggestForm.addEventListener("submit", submitTopicSuggestion);

  refs.resetDemo.addEventListener("click", resetDemo);
  refs.importCatalogCsv.addEventListener("click", openCsvPicker);
  refs.catalogCsvInput.addEventListener("change", handleCatalogCsvChange);
  refs.restoreDefaultCatalog.addEventListener("click", restoreDefaultCatalog);
  refs.closeDetail.addEventListener("click", closeDetail);
  refs.detailBackdrop.addEventListener("click", closeDetail);
  refs.mobileProfileToggle.addEventListener("click", () => {
    refs.profilePanel.classList.toggle("is-open");
  });

  refs.openCatalogTop.addEventListener("click", () => switchView("catalog"));
  refs.advisorTab.addEventListener("click", () => switchView("advisor"));
  refs.catalogTab.addEventListener("click", () => switchView("catalog"));
  refs.catalogSuggestTopic.addEventListener("click", openSuggestModal);

  refs.topicSearch.addEventListener("input", resetCatalogAndRender);
  refs.topicCategory.addEventListener("change", resetCatalogAndRender);
  refs.topicTeamFilter.addEventListener("change", resetCatalogAndRender);
  refs.topicSort.addEventListener("change", resetCatalogAndRender);
  refs.loadMoreTopics.addEventListener("click", () => {
    state.catalogLimit += 12;
    renderTopicCatalog();
  });
  [refs.clearTopicFilters, refs.emptyClearFilters].forEach((button) => {
    button.addEventListener("click", clearTopicFilters);
  });

  refs.onboardingFileBtn.addEventListener("click", openFilePicker);
  refs.onboardingSampleBtn.addEventListener("click", useSampleProfile);
  refs.ocrConfirmProfile.addEventListener("click", confirmExtractedProfile);
  [refs.ocrSkills, refs.ocrProjects, refs.ocrInterests, refs.ocrExperience].forEach((field) => {
    field.addEventListener("input", markOcrReviewDirty);
    field.addEventListener("change", markOcrReviewDirty);
  });
  refs.onboardingNext1.addEventListener("click", completeOnboardingStepOne);
  refs.onboardingNext2.addEventListener("click", completeOnboardingStepTwo);
  refs.completeOnboarding.addEventListener("click", finishOnboarding);
  refs.browseBeforeProfile.addEventListener("click", () => {
    closeOnboarding();
    switchView("catalog");
  });
  document.querySelectorAll("[data-onboarding-back]").forEach((button) => {
    button.addEventListener("click", () => goToOnboardingStep(Number(button.dataset.onboardingBack)));
  });
  document.querySelectorAll("[data-onboard-interest]").forEach((button) => {
    button.addEventListener("click", () => {
      state.interest = button.dataset.onboardInterest;
      selectOnboardingOption("[data-onboard-interest]", button);
      refs.onboardingStep2Error.classList.add("is-hidden");
    });
  });
  document.querySelectorAll("[data-onboard-skill]").forEach((button) => {
    button.addEventListener("click", () => toggleOnboardingSkill(button));
  });
  document.querySelectorAll("[data-onboard-team]").forEach((button) => {
    button.addEventListener("click", () => {
      state.teamSize = Number(button.dataset.onboardTeam);
      selectOnboardingOption("[data-onboard-team]", button);
    });
  });
  document.querySelectorAll("[data-onboard-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      state.difficulty = button.dataset.onboardDifficulty;
      selectOnboardingOption("[data-onboard-difficulty]", button);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      state.activeView === "catalog" &&
      !isAnyModalOpen() &&
      document.activeElement?.tagName !== "INPUT"
    ) {
      event.preventDefault();
      refs.topicSearch.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!refs.appearanceModal.classList.contains("is-hidden")) {
      closeAppearanceModal();
      return;
    }
    closeSuggestModal();
    closeDetail();
    refs.profilePanel.classList.remove("is-open");
  });
}

function renderInitialConversation() {
  refs.chatStream.innerHTML = "";
  addAssistantMessage(`
    <p>Chào bạn! Mình là <strong>Mai</strong>, trợ lý giúp bạn tìm đề tài phù hợp với sở thích và kỹ năng.</p>
    <p>Thông tin ban đầu được thu thập trong một cửa sổ riêng để bạn nhìn rõ toàn bộ hồ sơ trước khi nhận gợi ý.</p>
    <div class="inline-actions">
      <button class="button primary small" data-action="open-onboarding">Thiết lập hồ sơ</button>
      <button class="button secondary small" data-action="browse-catalog">Xem kho đề tài</button>
    </div>
  `);
  refs.chatStream
    .querySelector('[data-action="open-onboarding"]')
    .addEventListener("click", () => openOnboarding(1));
  refs.chatStream
    .querySelector('[data-action="browse-catalog"]')
    .addEventListener("click", () => switchView("catalog"));
}

async function loadProjects() {
  try {
    const response = await fetch("../mock-data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      state.projects = data.filter((item) => item && item.ma_de && item.ten_de_tai);
    }
  } catch {
    state.projects = fallbackProjects;
  }
  buildCategoryFilter();
  renderTopicCatalog();
}

function openOnboarding(step = state.profileLoaded ? 2 : 1) {
  refs.onboardingModal.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";
  syncOnboardingSelections();
  goToOnboardingStep(step);
}

function closeOnboarding() {
  refs.onboardingModal.classList.add("is-hidden");
  if (refs.suggestModal.classList.contains("is-hidden") && refs.detailDrawer.classList.contains("is-hidden")) {
    document.body.style.overflow = "";
  }
}

function goToOnboardingStep(step) {
  state.onboardingStep = Math.min(3, Math.max(1, step));
  document.querySelectorAll("[data-onboarding-step]").forEach((section) => {
    section.classList.toggle("is-hidden", Number(section.dataset.onboardingStep) !== state.onboardingStep);
  });
  document.querySelectorAll("[data-onboarding-progress]").forEach((item) => {
    const itemStep = Number(item.dataset.onboardingProgress);
    item.classList.toggle("is-active", itemStep === state.onboardingStep);
    item.classList.toggle("is-complete", itemStep < state.onboardingStep);
  });
  refs.onboardingMobileStep.textContent = `Bước ${state.onboardingStep} / 3`;
  refs.onboardingStep2Error.classList.add("is-hidden");
}

function syncOnboardingSelections() {
  document.querySelectorAll("[data-onboard-interest]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.onboardInterest === state.interest);
  });
  document.querySelectorAll("[data-onboard-skill]").forEach((button) => {
    button.classList.toggle("is-selected", state.skills.includes(button.dataset.onboardSkill));
  });
  document.querySelectorAll("[data-onboard-team]").forEach((button) => {
    button.classList.toggle("is-selected", Number(button.dataset.onboardTeam) === state.teamSize);
  });
  document.querySelectorAll("[data-onboard-difficulty]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.onboardDifficulty === state.difficulty);
  });
}

async function readProfileFile(file) {
  resetOcrReview();
  const requestToken = state.ocrRequestToken;
  refs.ocrReview.classList.remove("is-hidden");
  refs.ocrReviewTitle.textContent = "Đang xử lý an toàn";
  refs.ocrReviewStatus.textContent = "Đang đọc";
  refs.onboardingFileLabel.textContent = file.name;
  refs.onboardingFileMeta.textContent = `${formatFileSize(file.size)} · Đang gửi tới agent đọc hồ sơ`;
  refs.onboardingFileBtn.disabled = true;
  refs.onboardingSampleBtn.disabled = true;
  setOcrProgress(["upload"], "read");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("use_llm", "false");
  formData.append("language_hint", "vie+eng");
  formData.append("consent_external_processing", "false");

  try {
    const response = await fetch(`${OCR_API_BASE}/api/ocr/parse`, {
      method: "POST",
      body: formData,
    });
    const payload = await response.json().catch(() => ({}));
    if (requestToken !== state.ocrRequestToken) return;
    if (!response.ok) {
      throw new Error(payload?.detail?.message || `Agent đọc hồ sơ trả về lỗi ${response.status}.`);
    }

    state.ocrProfile = payload.profile;
    state.ocrRunId = payload.run_id;
    state.ocrConfirmed = false;
    renderExtractedProfile(payload);
    refs.onboardingFileMeta.textContent = `${formatFileSize(file.size)} · Đã đọc xong, cần bạn xác nhận`;
  } catch (error) {
    if (requestToken !== state.ocrRequestToken) return;
    const message =
      error instanceof TypeError
        ? "Không kết nối được agent đọc hồ sơ tại cổng 8080. Bạn vẫn có thể tự điền hồ sơ."
        : error.message;
    refs.ocrReviewTitle.textContent = "Chưa thể đọc hồ sơ";
    refs.ocrReviewStatus.textContent = "Có lỗi";
    refs.ocrReviewError.textContent = message;
    refs.ocrReviewError.classList.remove("is-hidden");
    refs.onboardingFileMeta.textContent = `${formatFileSize(file.size)} · Chưa xử lý được`;
    setOcrProgress(["upload"], null, "read");
  } finally {
    if (requestToken === state.ocrRequestToken) {
      refs.onboardingFileBtn.disabled = false;
      refs.onboardingSampleBtn.disabled = false;
    }
  }
}

function renderExtractedProfile(payload) {
  const profile = payload.profile || {};
  const skills = (profile.skills || []).map((skill) => skill.name).filter(Boolean);
  const projects = (profile.projects || [])
    .map((project) => project.title || String(project.description || "").split("\n")[0])
    .filter(Boolean);
  const interests = (profile.interests || []).filter(Boolean);
  const questions = (profile.uncertain_fields || [])
    .map((item) => item.question_for_user)
    .filter(Boolean);
  const warningCodes = [...new Set([...(payload.warnings || []), ...(profile.warnings || [])])];

  refs.ocrSkills.value = skills.join(", ");
  refs.ocrProjects.value = projects.join("\n");
  refs.ocrInterests.value = interests.join(", ");
  refs.ocrExperience.value = ["beginner", "intermediate", "advanced", "unknown"].includes(
    profile.experience_level,
  )
    ? profile.experience_level
    : "unknown";
  refs.ocrRunMeta.textContent = `Run ID: ${payload.run_id} · Văn bản thô không được hiển thị hoặc lưu trong nhật ký.`;
  refs.ocrRunMeta.classList.remove("is-hidden");
  refs.ocrReviewTitle.textContent = "Kiểm tra hồ sơ agent đã đọc";
  refs.ocrReviewStatus.textContent = "Cần xác nhận";
  refs.ocrReviewFields.classList.remove("is-hidden");
  refs.ocrReviewError.classList.add("is-hidden");

  const notices = [
    ...warningCodes.map((code) => ocrWarningLabels[code] || `Cảnh báo xử lý: ${code}`),
    ...questions,
  ];
  refs.ocrWarnings.innerHTML = notices.map((notice) => `<li>${escapeHtml(notice)}</li>`).join("");
  refs.ocrWarningWrap.classList.toggle("is-hidden", notices.length === 0);
  setOcrProgress(["upload", "read", "privacy", "analyze"], "confirm");
}

function confirmExtractedProfile() {
  if (!state.ocrProfile) return;
  const skills = splitProfileValues(refs.ocrSkills.value);
  const projects = refs.ocrProjects.value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const interests = splitProfileValues(refs.ocrInterests.value);

  state.skills = skills;
  state.extractedProjects = projects;
  state.experienceLevel = refs.ocrExperience.value;
  state.interest = inferInterestFromOcr(interests) || state.interest;
  state.ocrConfirmed = true;

  refs.ocrReviewStatus.textContent = "Đã xác nhận";
  refs.ocrConfirmProfile.textContent = "Đã xác nhận · Bấm để cập nhật";
  refs.onboardingOcrGateError.classList.add("is-hidden");
  setOcrProgress(["upload", "read", "privacy", "analyze", "confirm"]);
  syncOnboardingSelections();
}

function markOcrReviewDirty() {
  if (!state.ocrProfile) return;
  state.ocrConfirmed = false;
  refs.ocrReviewStatus.textContent = "Cần xác nhận lại";
  refs.ocrConfirmProfile.textContent = "Xác nhận hồ sơ đã đọc";
  setOcrProgress(["upload", "read", "privacy", "analyze"], "confirm");
}

function splitProfileValues(value) {
  return [...new Set(value.split(/[,;\n]/).map((item) => item.trim()).filter(Boolean))];
}

function inferInterestFromOcr(interests) {
  const corpus = normalize(interests.join(" "));
  return (
    interestOptions.find((option) => {
      const rule = interestRules[option.id];
      return (
        corpus.includes(normalize(rule.label)) ||
        rule.keywords.some((keyword) => corpus.includes(normalize(keyword)))
      );
    })?.id || null
  );
}

function setOcrProgress(completed, active = null, failed = null) {
  document.querySelectorAll("[data-ocr-progress]").forEach((item) => {
    const stage = item.dataset.ocrProgress;
    item.classList.toggle("is-complete", completed.includes(stage));
    item.classList.toggle("is-active", stage === active);
    item.classList.toggle("is-failed", stage === failed);
  });
}

function resetOcrReview() {
  state.ocrRequestToken += 1;
  state.ocrProfile = null;
  state.ocrRunId = null;
  state.ocrConfirmed = false;
  state.extractedProjects = [];
  state.experienceLevel = "unknown";
  refs.ocrReview.classList.add("is-hidden");
  refs.ocrReviewFields.classList.add("is-hidden");
  refs.ocrRunMeta.classList.add("is-hidden");
  refs.ocrReviewError.classList.add("is-hidden");
  refs.ocrWarningWrap.classList.add("is-hidden");
  refs.onboardingOcrGateError.classList.add("is-hidden");
  refs.ocrSkills.value = "";
  refs.ocrProjects.value = "";
  refs.ocrInterests.value = "";
  refs.ocrExperience.value = "unknown";
  refs.ocrWarnings.innerHTML = "";
  refs.ocrConfirmProfile.textContent = "Xác nhận hồ sơ đã đọc";
  refs.onboardingFileBtn.disabled = false;
  refs.onboardingSampleBtn.disabled = false;
  setOcrProgress([]);
}

function populateProfileFromSimulatedFile(file) {
  resetOcrReview();
  refs.onboardingFileLabel.textContent = file.name;
  refs.onboardingFileMeta.textContent = `${formatFileSize(file.size)} · Hồ sơ mẫu đã được điền`;
  refs.onboardingName.value = "Trần Minh Anh";
  refs.onboardingMajor.value = "Hệ thống thông tin";
  state.profileName = refs.onboardingName.value;
  state.profileMajor = refs.onboardingMajor.value;
  state.interest = state.interest || "data";
  state.skills = ["Python", "SQL", "Phân tích dữ liệu"];
  syncOnboardingSelections();
}

function useSampleProfile() {
  populateProfileFromSimulatedFile({
    name: "ho-so-mau-minh-anh.pdf",
    size: 248000,
  });
}

function completeOnboardingStepOne() {
  if (state.ocrProfile && !state.ocrConfirmed) {
    refs.onboardingOcrGateError.classList.remove("is-hidden");
    refs.ocrConfirmProfile.focus();
    return;
  }
  const name = refs.onboardingName.value.trim();
  const major = refs.onboardingMajor.value.trim();
  if (name) refs.onboardingName.removeAttribute("aria-invalid");
  else refs.onboardingName.setAttribute("aria-invalid", "true");
  if (major) refs.onboardingMajor.removeAttribute("aria-invalid");
  else refs.onboardingMajor.setAttribute("aria-invalid", "true");
  if (!name || !major) {
    (!name ? refs.onboardingName : refs.onboardingMajor).focus();
    return;
  }
  state.profileName = name;
  state.profileMajor = major;
  goToOnboardingStep(2);
}

function completeOnboardingStepTwo() {
  if (!state.interest || state.skills.length === 0) {
    refs.onboardingStep2Error.classList.remove("is-hidden");
    return;
  }
  goToOnboardingStep(3);
}

function toggleOnboardingSkill(button) {
  const skill = button.dataset.onboardSkill;
  if (state.skills.includes(skill)) {
    state.skills = state.skills.filter((item) => item !== skill);
  } else {
    state.skills.push(skill);
  }
  button.classList.toggle("is-selected", state.skills.includes(skill));
  refs.onboardingStep2Error.classList.add("is-hidden");
}

function selectOnboardingOption(selector, selectedButton) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("is-selected", button === selectedButton);
  });
}

async function finishOnboarding() {
  state.profileLoaded = true;
  state.profileName = refs.onboardingName.value.trim() || "Trần Minh Anh";
  state.profileMajor = refs.onboardingMajor.value.trim() || "Hệ thống thông tin";
  refs.profileName.textContent = state.profileName;
  refs.profileHeadline.textContent = `Sinh viên · ${state.profileMajor}`;
  const avatar = document.querySelector(".profile-avatar");
  if (avatar) avatar.textContent = getInitials(state.profileName);
  refs.profileGoal.textContent = `Muốn làm sản phẩm thuộc hướng ${interestRules[state.interest]?.label || "Dữ liệu & AI"}, có thể demo và đo kết quả rõ ràng.`;
  revealProfile();
  updateProfileSkills();
  refs.fitSummary.classList.remove("is-hidden");
  updateNav("results");
  closeOnboarding();
  switchView("advisor");

  refs.chatStream.innerHTML = "";
  addAssistantMessage(`
    <p>Chào <strong>${escapeHtml(state.profileName)}</strong>! Hồ sơ đã hoàn tất trong cửa sổ thiết lập.</p>
    <p>Mình đang ưu tiên hướng <strong>${escapeHtml(interestRules[state.interest]?.label || "Dữ liệu & AI")}</strong>, kỹ năng ${escapeHtml(state.skills.join(", "))} và phạm vi nhóm ${state.teamSize} người.</p>
  `);
  await resolveAndRenderRecommendations();
  state.catalogLimit = 12;
  renderTopicCatalog();
}

async function resolveAndRenderRecommendations() {
  const loadingBlock = renderRecommendationLoading();
  try {
    const { recommendations, meta } = await getRecommendationsFromAI();
    loadingBlock.remove();
    if (!recommendations.length) {
      state.recommendations = [];
      state.recommendationMeta = meta;
      renderRecommendationEmpty(meta);
      return;
    }
    state.recommendations = recommendations;
    state.recommendationMeta = meta;
    renderRecommendations();
  } catch (error) {
    loadingBlock.remove();
    state.recommendations = getRecommendations();
    state.recommendationMeta = { source: "fallback_rule", error: error.message };
    renderRecommendations();
  }
}

function renderRecommendationLoading() {
  const block = document.createElement("div");
  block.className = "interactive-block active-interactive";
  block.innerHTML = `
    <section class="analysis-card">
      <div class="analysis-head">
        <span class="analysis-spinner"></span>
        <div>
          <strong>Đang đối chiếu hồ sơ với kho đề tài...</strong>
          <span>Gọi model AI xếp hạng và giải thích theo hồ sơ của bạn.</span>
        </div>
      </div>
    </section>
  `;
  refs.chatStream.appendChild(block);
  scrollChat();
  return block;
}

function renderRecommendationEmpty(meta) {
  addAssistantMessage(`
    <p>Mình chưa tìm được đề tài đủ khớp với hồ sơ hiện tại${meta?.overallNote ? `: ${escapeHtml(meta.overallNote)}` : "."}</p>
    <p>Bạn có thể chọn lại lĩnh vực quan tâm, bổ sung thêm kỹ năng, hoặc bấm "Không thấy đề tài phù hợp?" để gửi góp ý đề tài mới.</p>
  `);
  const block = document.createElement("div");
  block.className = "interactive-block";
  block.innerHTML = `
    <section class="result-actions">
      <button class="button secondary small" id="suggestAfterEmpty" type="button">Không thấy đề tài phù hợp?</button>
    </section>
  `;
  refs.chatStream.appendChild(block);
  block.querySelector("#suggestAfterEmpty").addEventListener("click", openSuggestModal);
  scrollChat();
}

function switchView(view) {
  state.activeView = view === "catalog" ? "catalog" : "advisor";
  const catalogActive = state.activeView === "catalog";
  refs.chatStream.classList.toggle("is-hidden", catalogActive);
  refs.composerWrap.classList.toggle("is-hidden", catalogActive);
  refs.topicExplorer.classList.toggle("is-hidden", !catalogActive);
  refs.advisorTab.classList.toggle("is-active", !catalogActive);
  refs.catalogTab.classList.toggle("is-active", catalogActive);
  refs.advisorTab.setAttribute("aria-selected", String(!catalogActive));
  refs.catalogTab.setAttribute("aria-selected", String(catalogActive));
  if (catalogActive) renderTopicCatalog();
}

function buildCategoryFilter() {
  const current = refs.topicCategory.value;
  const categories = [...new Set(state.projects.map((project) => project.khoi).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "vi"),
  );
  refs.topicCategory.innerHTML = `
    <option value="">Tất cả lĩnh vực</option>
    ${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}
  `;
  if (categories.includes(current)) refs.topicCategory.value = current;
  refs.catalogTabCount.textContent = state.projects.length;
}

function resetCatalogAndRender() {
  state.catalogLimit = 12;
  renderTopicCatalog();
}

function clearTopicFilters() {
  refs.topicSearch.value = "";
  refs.topicCategory.value = "";
  refs.topicTeamFilter.value = "";
  refs.topicSort.value = "recommended";
  resetCatalogAndRender();
}

function getFilteredTopics() {
  const query = normalize(refs.topicSearch.value.trim());
  const queryTokens = query.split(/\s+/).filter(Boolean);
  const category = refs.topicCategory.value;
  const team = Number(refs.topicTeamFilter.value);

  const filtered = state.projects
    .filter((project) => {
      const corpus = normalize(
        [
          project.ma_de,
          project.khoi,
          project.ten_de_tai,
          project.job_executor,
          project.pain_point,
          project.mo_ta_bai_toan,
          project.tech_stack,
        ]
          .filter(Boolean)
          .join(" "),
      );
      const matchesQuery = queryTokens.every((token) => corpus.includes(token));
      const matchesCategory = !category || project.khoi === category;
      const maxTeam = Number(project.max_team) || 4;
      const matchesTeam = !team || maxTeam <= team;
      return matchesQuery && matchesCategory && matchesTeam;
    })
    .map((project) => {
      const ranking = scoreCatalogProject(project, queryTokens);
      return {
        ...project,
        match: ranking.score,
        reasons: ranking.reasons,
      };
    });

  const sort = refs.topicSort.value;
  filtered.sort((a, b) => {
    if (sort === "az") return String(a.ten_de_tai).localeCompare(String(b.ten_de_tai), "vi");
    if (sort === "za") return String(b.ten_de_tai).localeCompare(String(a.ten_de_tai), "vi");
    if (sort === "code") return String(a.ma_de).localeCompare(String(b.ma_de), "vi", { numeric: true });
    if (sort === "team") return (Number(a.max_team) || 4) - (Number(b.max_team) || 4);
    return b.match - a.match || String(a.ma_de).localeCompare(String(b.ma_de), "vi", { numeric: true });
  });
  return filtered;
}

function scoreCatalogProject(project, queryTokens = []) {
  const rule = interestRules[state.interest] || interestRules.data;
  const block = normalize(project.khoi || "");
  const title = normalize(project.ten_de_tai || "");
  const corpus = normalize(
    [project.khoi, project.ten_de_tai, project.pain_point, project.mo_ta_bai_toan, project.tech_stack]
      .filter(Boolean)
      .join(" "),
  );
  let score = state.profileLoaded ? 56 : 70;
  const reasons = [];

  if (state.profileLoaded && rule.blockTokens.some((token) => block.startsWith(normalize(token)))) {
    score += 22;
    reasons.push(`Thuộc hướng ${rule.label} bạn quan tâm.`);
  }

  if (state.profileLoaded) {
    const skillMatches = state.skills.filter((skill) =>
      normalize(skill)
        .split(/\s+/)
        .some((token) => token.length > 2 && corpus.includes(token)),
    );
    score += Math.min(15, skillMatches.length * 5);
    if (skillMatches.length) reasons.push(`Tận dụng ${skillMatches.slice(0, 3).join(", ")}.`);
    if ((Number(project.max_team) || 4) >= state.teamSize) {
      score += 6;
      reasons.push(`Phù hợp nhóm ${state.teamSize} người.`);
    }
  }

  queryTokens.forEach((token) => {
    if (title.includes(token)) score += 8;
    else if (corpus.includes(token)) score += 3;
  });

  return {
    score: Math.min(97, Math.max(68, score)),
    reasons: reasons.length
      ? reasons.slice(0, 3)
      : [
          "Có bài toán, người thực hiện và kết quả đầu ra rõ ràng.",
          `Có thể triển khai với nhóm tối đa ${Number(project.max_team) || 4} người.`,
        ],
  };
}

function renderTopicCatalog() {
  if (!refs.topicList) return;
  const topics = getFilteredTopics();
  const visibleTopics = topics.slice(0, state.catalogLimit);
  refs.topicResultCount.textContent = topics.length;
  refs.topicList.innerHTML = visibleTopics.map(topicCardTemplate).join("");
  refs.catalogEmpty.classList.toggle("is-hidden", topics.length !== 0);
  refs.topicList.classList.toggle("is-hidden", topics.length === 0);
  refs.catalogLoadMoreWrap.classList.toggle("is-hidden", topics.length === 0 || visibleTopics.length >= topics.length);
  const hasFilters =
    refs.topicSearch.value.trim() ||
    refs.topicCategory.value ||
    refs.topicTeamFilter.value ||
    refs.topicSort.value !== "recommended";
  refs.clearTopicFilters.classList.toggle("is-hidden", !hasFilters);

  refs.topicList.querySelectorAll("[data-catalog-code]").forEach((card) => {
    const open = () => {
      const project = visibleTopics.find((item) => item.ma_de === card.dataset.catalogCode);
      if (project) openProjectDetail(project);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function topicCardTemplate(project) {
  const tags = getProjectTags(project);
  return `
    <article
      class="topic-card"
      data-catalog-code="${escapeHtml(project.ma_de)}"
      tabindex="0"
      role="button"
      aria-label="Xem chi tiết ${escapeHtml(project.ten_de_tai)}"
    >
      <div class="topic-card-head">
        <span class="topic-code">${escapeHtml(project.ma_de)}</span>
        <span class="topic-team">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="9" cy="8" r="3" />
            <path d="M3.5 19c.4-4 2.3-6 5.5-6s5.1 2 5.5 6M16 6a3 3 0 0 1 0 5.8M16.5 14c2.5.4 3.8 2.1 4 5" />
          </svg>
          Tối đa ${Number(project.max_team) || 4}
        </span>
      </div>
      <h3>${escapeHtml(project.ten_de_tai)}</h3>
      <p>${escapeHtml(project.mo_ta_bai_toan || project.pain_point || project.quyet_dinh_ai || "")}</p>
      <div class="topic-card-footer">
        <div class="topic-card-tags">
          ${state.profileLoaded ? `<span class="mini-tag">${project.match}% phù hợp</span>` : ""}
          ${tags.slice(0, 2).map((tag) => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <span class="topic-open">
          Chi tiết
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </span>
      </div>
    </article>
  `;
}

function readAppearanceSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(APPEARANCE_STORAGE_KEY) || "{}");
    return {
      theme: ["system", "light", "dark"].includes(saved.theme)
        ? saved.theme
        : defaultAppearanceSettings.theme,
      font: ["vietnamese", "system"].includes(saved.font)
        ? saved.font
        : defaultAppearanceSettings.font,
      reducedMotion: Boolean(saved.reducedMotion),
    };
  } catch {
    return { ...defaultAppearanceSettings };
  }
}

function applyAppearanceSettings(persist = true) {
  const resolvedTheme = appearanceSettings.theme === "system"
    ? (systemColorScheme.matches ? "dark" : "light")
    : appearanceSettings.theme;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themePreference = appearanceSettings.theme;
  document.documentElement.dataset.font = appearanceSettings.font;
  document.documentElement.dataset.reducedMotion = String(appearanceSettings.reducedMotion);

  if (refs.themeColor) {
    refs.themeColor.content = resolvedTheme === "dark" ? "#0b1211" : "#fbfaf6";
  }

  if (persist) {
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(appearanceSettings));
    } catch {
      // The UI still works when storage is blocked by the browser.
    }
  }

  renderAppearanceSettings();
}

function renderAppearanceSettings() {
  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    const selected = button.dataset.themeOption === appearanceSettings.theme;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.querySelectorAll("[data-font-option]").forEach((button) => {
    const selected = button.dataset.fontOption === appearanceSettings.font;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  if (refs.reducedMotionToggle) {
    refs.reducedMotionToggle.checked = appearanceSettings.reducedMotion;
  }
}

function openAppearanceModal(event) {
  appearanceTrigger = event?.currentTarget || document.activeElement;
  renderAppearanceSettings();
  refs.appearanceModal.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => refs.closeAppearanceSettings.focus(), 40);
}

function closeAppearanceModal() {
  refs.appearanceModal.classList.add("is-hidden");
  if (!isAnyModalOpen()) document.body.style.overflow = "";
  if (appearanceTrigger instanceof HTMLElement && appearanceTrigger.isConnected) {
    appearanceTrigger.focus();
  }
}

function resetAppearanceSettings() {
  appearanceSettings.theme = defaultAppearanceSettings.theme;
  appearanceSettings.font = defaultAppearanceSettings.font;
  appearanceSettings.reducedMotion = defaultAppearanceSettings.reducedMotion;
  applyAppearanceSettings();
}

function isAnyModalOpen() {
  return (
    !refs.appearanceModal.classList.contains("is-hidden") ||
    !refs.onboardingModal.classList.contains("is-hidden") ||
    !refs.suggestModal.classList.contains("is-hidden") ||
    !refs.detailDrawer.classList.contains("is-hidden")
  );
}

function openFilePicker() {
  refs.profileFileInput.value = "";
  refs.profileFileInput.click();
}

function openCsvPicker() {
  refs.catalogCsvInput.value = "";
  refs.catalogCsvInput.click();
}

async function handleCatalogCsvChange(event) {
  const [file] = event.target.files;
  if (file) await handleCatalogCsvImport(file);
}

async function handleCatalogCsvImport(file) {
  try {
    if (!file.size || !file.name.toLowerCase().endsWith(".csv")) {
      return showToast({ title: "Tệp không hợp lệ", message: "Vui lòng chọn tệp CSV có dữ liệu." });
    }
    let text = await file.text();
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
    const rows = parseCsv(text);
    if (rows.length < 2) {
      return showToast({ title: "Tệp CSV không có dữ liệu", message: "Cần ít nhất 1 dòng đề tài ngoài header." });
    }
    const header = rows[0].map((h) => h.trim());
    if (!header.includes("ma_de") || !header.includes("ten_de_tai")) {
      return showToast({ title: "Thiếu cột bắt buộc", message: "Cần có cột ma_de và ten_de_tai trong header." });
    }
    const accepted = [];
    let skipped = 0;
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const obj = {};
      header.forEach((key, i) => { obj[key] = (row[i] ?? "").trim(); });
      if (!obj.ma_de || !obj.ten_de_tai) { skipped++; continue; }
      obj.max_team = Number(obj.max_team) || 4;
      obj.stt = Number(obj.stt) || null;
      if (obj.learner_fit === "") obj.learner_fit = null;
      accepted.push(obj);
    }
    if (accepted.length === 0) {
      return showToast({ title: "Không có đề tài hợp lệ", message: "Tất cả các dòng đều thiếu ma_de hoặc ten_de_tai." });
    }
    state.projects = accepted;
    clearTopicFilters();
    buildCategoryFilter();
    renderTopicCatalog();
    showToast({
      title: "Đã nhập kho đề tài",
      message: `${accepted.length} đề tài được thêm${skipped ? `, ${skipped} dòng bị bỏ qua` : ""}.`,
    });
  } catch (error) {
    showToast({ title: "Không đọc được tệp CSV", message: "Vui lòng kiểm tra định dạng rồi thử lại." });
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field); field = "";
    } else if (ch === "\n" || ch === "\r") {
      row.push(field); rows.push(row); row = []; field = "";
      if (ch === "\r" && text[i + 1] === "\n") i++;
    } else field += ch;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  while (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") rows.pop();
  return rows;
}

async function restoreDefaultCatalog() {
  await loadProjects();
  showToast({
    title: "Đã khôi phục kho đề tài",
    message: `Kho đề tài mặc định đã được nạp (${state.projects.length} đề tài).`,
  });
}

async function simulateProfileUpload(file) {
  if (state.profileLoaded) return;
  state.profileLoaded = true;
  document.getElementById("uploadBlock")?.remove();

  addUserMessage(
    `
      <div class="file-bubble">
        <span class="file-icon">${fileExtension(file.name)}</span>
        <span class="file-meta">
          <strong>${escapeHtml(file.name)}</strong>
          <span>${formatFileSize(file.size)} · Hồ sơ mô phỏng</span>
        </span>
      </div>
    `,
    true,
  );

  const typing = addTyping();
  await wait(750);
  typing.remove();
  revealProfile();
  updateNav("questions");

  addAssistantMessage(`
    <p>Mình đã <strong>mô phỏng trích xuất</strong> hồ sơ. Đây là những gì mình hiểu:</p>
    <div class="extracted-summary">
      <div class="summary-row"><span>Chuyên ngành</span><strong>Hệ thống thông tin</strong></div>
      <div class="summary-row"><span>Điểm mạnh</span><strong>Python · SQL · Phân tích dữ liệu</strong></div>
      <div class="summary-row"><span>Mục tiêu</span><strong>Làm được prototype để demo</strong></div>
    </div>
    <p>Thông tin này đã đúng với hồ sơ mẫu chưa?</p>
    <div class="inline-actions">
      <button class="button primary small" data-action="confirm-profile">Đúng rồi, tiếp tục</button>
      <button class="button secondary small" data-action="edit-profile">Chỉnh sửa nhanh</button>
    </div>
  `);

  refs.chatStream.querySelector('[data-action="confirm-profile"]').addEventListener("click", askInterest);
  refs.chatStream.querySelector('[data-action="edit-profile"]').addEventListener("click", () => {
    addUserMessage("Mình muốn bổ sung kỹ năng ở bước tiếp theo.");
    askInterest();
  });
}

function revealProfile() {
  refs.profileEmpty.classList.add("is-hidden");
  refs.profileContent.classList.remove("is-hidden");
  updateProfileSkills();
}

function askInterest() {
  disableInlineActions();
  addUserMessage("Đúng rồi, tiếp tục nhé.");
  state.stage = "questions";

  window.setTimeout(() => {
    addAssistantMessage(`
      <p>Tuyệt! Câu đầu tiên: <strong>lĩnh vực nào khiến bạn muốn dành vài tuần để đào sâu nhất?</strong></p>
    `);
    renderInterestQuestion();
  }, 260);
}

function renderInterestQuestion() {
  removeActiveInteractive();
  const block = document.createElement("div");
  block.className = "interactive-block active-interactive";
  block.innerHTML = `
    <section class="question-card">
      <h3>1. Chọn một hướng bạn hứng thú</h3>
      <p>Không cần chọn hướng bạn giỏi nhất — hãy chọn hướng khiến bạn tò mò.</p>
      <div class="option-grid">
        ${interestOptions
          .map(
            (option) => `
              <button class="choice-button" type="button" data-interest="${option.id}">
                <span class="choice-icon">${option.icon}</span>
                ${option.label}
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
  refs.chatStream.appendChild(block);
  block.querySelectorAll("[data-interest]").forEach((button) => {
    button.addEventListener("click", () => selectInterest(button.dataset.interest));
  });
  scrollChat();
}

function selectInterest(interest) {
  state.interest = interest;
  const label = interestRules[interest].label;
  removeActiveInteractive();
  addUserMessage(label);
  refs.profileGoal.textContent = `Muốn làm sản phẩm thuộc hướng ${label}, có thể demo và đo kết quả rõ ràng.`;

  window.setTimeout(() => {
    addAssistantMessage(`
      <p>Đã rõ. Bây giờ chọn những kỹ năng bạn <strong>có thể trực tiếp đóng góp</strong> cho nhóm.</p>
    `);
    renderSkillQuestion();
  }, 250);
}

function renderSkillQuestion() {
  const block = document.createElement("div");
  block.className = "interactive-block active-interactive";
  block.innerHTML = `
    <section class="question-card">
      <h3>2. Bạn tự tin với kỹ năng nào?</h3>
      <p>Có thể chọn nhiều kỹ năng. Hồ sơ mẫu đã đánh dấu sẵn 3 mục.</p>
      <div class="multi-choice-grid">
        ${skillOptions
          .map(
            (skill) => `
              <button
                class="skill-choice ${state.skills.includes(skill) ? "is-selected" : ""}"
                type="button"
                data-skill="${skill}"
              >${skill}</button>
            `,
          )
          .join("")}
      </div>
      <div class="question-footer">
        <small id="selectedSkillHint">${state.skills.length} kỹ năng đã chọn</small>
        <button class="button primary small" id="confirmSkills" type="button">Tiếp tục</button>
      </div>
    </section>
  `;
  refs.chatStream.appendChild(block);
  block.querySelectorAll("[data-skill]").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = button.dataset.skill;
      if (state.skills.includes(skill)) {
        if (state.skills.length === 1) return;
        state.skills = state.skills.filter((item) => item !== skill);
      } else {
        state.skills.push(skill);
      }
      button.classList.toggle("is-selected");
      block.querySelector("#selectedSkillHint").textContent = `${state.skills.length} kỹ năng đã chọn`;
      updateProfileSkills();
    });
  });
  block.querySelector("#confirmSkills").addEventListener("click", () => {
    removeActiveInteractive();
    addUserMessage(state.skills.join(" · "));
    renderPreferenceQuestionDelayed();
  });
  scrollChat();
}

function renderPreferenceQuestionDelayed() {
  window.setTimeout(() => {
    addAssistantMessage(`
      <p>Câu cuối cùng: bạn muốn một đề tài <strong>vừa sức hay thử thách</strong>, và nhóm có bao nhiêu người?</p>
    `);
    renderPreferenceQuestion();
  }, 260);
}

function renderPreferenceQuestion() {
  const block = document.createElement("div");
  block.className = "interactive-block active-interactive";
  block.innerHTML = `
    <section class="question-card">
      <h3>3. Chọn cách bạn muốn thực hiện</h3>
      <p>Thông tin này giúp lọc phạm vi và độ khó phù hợp.</p>
      <div class="preference-row">
        <div class="preference-group">
          <span>Quy mô nhóm</span>
          <div class="segmented" data-segment="team">
            ${[3, 4, 5]
              .map(
                (size) =>
                  `<button type="button" data-team="${size}" class="${size === state.teamSize ? "is-selected" : ""}">${size} người</button>`,
              )
              .join("")}
          </div>
        </div>
        <div class="preference-group">
          <span>Mức thử thách</span>
          <div class="segmented" data-segment="difficulty">
            <button type="button" data-difficulty="easy">Vừa sức</button>
            <button type="button" data-difficulty="balanced" class="is-selected">Cân bằng</button>
            <button type="button" data-difficulty="hard">Thử thách</button>
          </div>
        </div>
      </div>
      <div class="question-footer">
        <small>Có thể đổi lựa chọn sau khi xem kết quả</small>
        <button class="button primary small" id="findProjects" type="button">Tìm đề tài phù hợp</button>
      </div>
    </section>
  `;
  refs.chatStream.appendChild(block);

  block.querySelectorAll("[data-team]").forEach((button) => {
    button.addEventListener("click", () => {
      state.teamSize = Number(button.dataset.team);
      selectWithinSegment(button);
    });
  });
  block.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      state.difficulty = button.dataset.difficulty;
      selectWithinSegment(button);
    });
  });
  block.querySelector("#findProjects").addEventListener("click", runRecommendationSimulation);
  scrollChat();
}

async function runRecommendationSimulation() {
  removeActiveInteractive();
  const difficultyLabels = {
    easy: "vừa sức",
    balanced: "cân bằng",
    hard: "thử thách",
  };
  addUserMessage(`Nhóm ${state.teamSize} người · Mức ${difficultyLabels[state.difficulty]}`);
  updateNav("results");
  refs.fitSummary.classList.remove("is-hidden");

  const block = document.createElement("div");
  block.className = "interactive-block active-interactive";
  block.innerHTML = `
    <section class="analysis-card">
      <div class="analysis-head">
        <span class="analysis-spinner"></span>
        <div>
          <strong>Đang đối chiếu hồ sơ với kho đề tài...</strong>
          <span>Luồng mô phỏng bằng quy tắc cố định, không gọi AI.</span>
        </div>
      </div>
      <div class="analysis-steps">
        <div class="analysis-step" data-analysis-step="1">So khớp lĩnh vực quan tâm</div>
        <div class="analysis-step" data-analysis-step="2">Đối chiếu kỹ năng và công nghệ</div>
        <div class="analysis-step" data-analysis-step="3">Kiểm tra phạm vi nhóm và độ khó</div>
      </div>
    </section>
  `;
  refs.chatStream.appendChild(block);
  scrollChat();

  for (let index = 1; index <= 3; index += 1) {
    await wait(430);
    block.querySelector(`[data-analysis-step="${index}"]`).classList.add("is-done");
  }

  await wait(380);
  state.recommendations = getRecommendations();
  block.remove();
  renderRecommendations();
}

async function getRecommendationsFromAI() {
  const response = await fetch(`${API_BASE}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      interest: state.interest || "data",
      skills: state.skills,
      team_size: state.teamSize,
      difficulty: state.difficulty,
      profile_major: state.profileMajor || null,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`recommend_api_${response.status}: ${detail.slice(0, 200)}`);
  }

  const payload = await response.json();
  const byCode = new Map(state.projects.map((project) => [project.ma_de, project]));
  const recommendations = (payload.selections || [])
    .map((selection) => {
      const project = byCode.get(selection.ma_de);
      if (!project) return null;
      return {
        ...project,
        match: null,
        reasons: selection.reasons || [],
        riskNote: selection.risk_note || "",
      };
    })
    .filter(Boolean);

  return {
    recommendations,
    meta: {
      source: "ai",
      confidence: payload.confidence || "low",
      overallNote: payload.overall_note || "",
      traceId: payload.trace_id || null,
    },
  };
}

function getRecommendations() {
  const rule = interestRules[state.interest] || interestRules.data;
  const skillTokens = state.skills.flatMap((skill) => normalize(skill).split(/\s+/)).filter((token) => token.length > 2);

  const scored = state.projects.map((project, index) => {
    const block = normalize(project.khoi || "");
    const corpus = normalize(
      [
        project.khoi,
        project.ten_de_tai,
        project.pain_point,
        project.mo_ta_bai_toan,
        project.tech_stack,
        project.don_vi_goi_y,
      ]
        .filter(Boolean)
        .join(" "),
    );
    let score = 48;
    const reasons = [];

    if (rule.blockTokens.some((token) => block.startsWith(normalize(token)))) {
      score += 25;
      reasons.push(`Thuộc đúng hướng ${rule.label} bạn đã chọn.`);
    }

    const interestMatches = rule.keywords.filter((keyword) => corpus.includes(normalize(keyword)));
    score += Math.min(15, interestMatches.length * 4);
    if (interestMatches.length) {
      reasons.push(`Bài toán có liên hệ với ${interestMatches.slice(0, 3).join(", ")}.`);
    }

    const skillMatches = state.skills.filter((skill) => {
      const tokens = normalize(skill).split(/\s+/);
      return tokens.some((token) => token.length > 2 && corpus.includes(token));
    });
    score += Math.min(14, skillMatches.length * 5);
    if (skillMatches.length) {
      reasons.push(`Tận dụng được ${skillMatches.slice(0, 3).join(", ")}.`);
    }

    const maxTeam = Number(project.max_team) || 4;
    if (maxTeam >= state.teamSize) {
      score += 7;
      reasons.push(`Phạm vi phù hợp nhóm ${state.teamSize} người.`);
    } else {
      score -= 4;
    }

    if (state.difficulty === "hard" && corpus.includes("machine learning")) score += 5;
    if (state.difficulty === "easy" && corpus.includes("rule engine")) score += 4;

    score += Math.max(0, 3 - (index % 4));
    return {
      ...project,
      match: Math.min(97, Math.max(68, score)),
      reasons: reasons.slice(0, 3),
      skillMatches,
    };
  });

  const chosen = [];
  for (const project of scored.sort((a, b) => b.match - a.match || String(a.ma_de).localeCompare(String(b.ma_de)))) {
    const prefix = String(project.ma_de).split("-")[0];
    if (!chosen.some((item) => String(item.ma_de).startsWith(prefix)) || chosen.length >= 2) {
      chosen.push(project);
    }
    if (chosen.length === 3) break;
  }
  return chosen;
}

function renderRecommendations() {
  state.stage = "results";
  const meta = state.recommendationMeta;
  const isFallback = meta?.source === "fallback_rule";
  const isLowConfidence = meta?.source === "ai" && meta?.confidence === "low";

  let introHtml;
  if (isFallback) {
    introHtml = `
      <p>Mình đã tìm thấy <strong>${state.recommendations.length} đề tài</strong> bằng quy tắc cố định — model AI hiện không phản hồi được (${escapeHtml(meta.error || "lỗi không rõ")}), nên phần xếp hạng và lý do này chưa được model kiểm chứng.</p>
    `;
  } else if (isLowConfidence) {
    introHtml = `
      <p>Mình đã tìm thấy <strong>${state.recommendations.length} đề tài</strong>, nhưng chưa chắc đây là lựa chọn tốt nhất${meta.overallNote ? `: ${escapeHtml(meta.overallNote)}` : " — hồ sơ chưa cho đủ tín hiệu để phân biệt rõ giữa các đề tài."}</p>
      <p>Bạn nên đọc kỹ lý do từng đề tài trước khi chọn, hoặc bổ sung thêm kỹ năng cụ thể để mình xếp hạng chính xác hơn.</p>
    `;
  } else {
    introHtml = `
      <p>Mình đã tìm thấy <strong>${state.recommendations.length} đề tài phù hợp nhất</strong>. Lý do được model AI sinh ra dựa trên hồ sơ và nội dung từng đề tài — bấm vào từng đề tài để xem chi tiết và rủi ro cần lưu ý.</p>
    `;
  }
  addAssistantMessage(introHtml);

  const block = document.createElement("div");
  block.className = "interactive-block";
  block.innerHTML = `
    <section>
      <div class="recommendation-intro">
        <div>
          <h3>Đề tài dành cho hồ sơ của bạn</h3>
          <p>Bấm vào từng đề tài để xem cách setup và kế hoạch thực hiện.</p>
        </div>
        <span class="result-count">TOP ${state.recommendations.length} / ${state.projects.length} ĐỀ TÀI</span>
      </div>
      <div class="recommendation-list">
        ${state.recommendations.map(recommendationCardTemplate).join("")}
      </div>
      <div class="result-actions">
        <button class="button ghost small" id="askSetup" type="button">Hướng dẫn mình bắt đầu</button>
        <button class="button secondary small" id="suggestAfterResults" type="button">Không thấy đề tài phù hợp?</button>
      </div>
    </section>
  `;
  refs.chatStream.appendChild(block);

  block.querySelectorAll("[data-project-code]").forEach((card) => {
    const open = () => {
      const project = state.recommendations.find((item) => item.ma_de === card.dataset.projectCode);
      if (project) openProjectDetail(project);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
  block.querySelector("#askSetup").addEventListener("click", () => {
    addUserMessage("Hướng dẫn mình bắt đầu với đề tài đầu tiên.");
    openProjectDetail(state.recommendations[0], true);
  });
  block.querySelector("#suggestAfterResults").addEventListener("click", openSuggestModal);
  scrollChat();
}

function recommendationCardTemplate(project) {
  const tags = getProjectTags(project);
  const scoreHtml =
    project.match === null || project.match === undefined
      ? `<div class="match-score match-score-ai" title="Xếp hạng bởi model AI, không quy đổi thành %">AI</div>`
      : `<div class="match-score">${project.match}<span>%</span></div>`;
  return `
    <article
      class="recommendation-card"
      data-project-code="${escapeHtml(project.ma_de)}"
      tabindex="0"
      role="button"
      aria-label="Xem đề tài ${escapeHtml(project.ten_de_tai)}"
    >
      ${scoreHtml}
      <div class="recommendation-main">
        <div class="recommendation-meta">
          <span>${escapeHtml(project.ma_de)}</span>
          <i></i>
          <span>Tối đa ${Number(project.max_team) || 4} người</span>
        </div>
        <h4>${escapeHtml(project.ten_de_tai)}</h4>
        <p>${escapeHtml(project.mo_ta_bai_toan || project.quyet_dinh_ai || "")}</p>
        <div class="recommendation-tags">
          ${tags.map((tag) => `<span class="mini-tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
      <span class="card-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
      </span>
    </article>
  `;
}

function openProjectDetail(project, announce = false) {
  refs.detailCode.textContent = `${project.ma_de} · ${project.khoi || "Đề tài"}`;
  refs.detailTitle.textContent = project.ten_de_tai;
  const reasons = project.reasons?.length
    ? project.reasons
    : [
        "Phù hợp với hướng quan tâm đã chọn.",
        "Có thể tận dụng bộ kỹ năng trong hồ sơ.",
        `Phạm vi có thể chia cho nhóm ${state.teamSize} người.`,
      ];
  const isAiSourced = project.match === null || project.match === undefined;
  const scoreRowHtml = isAiSourced
    ? `
    <div class="drawer-score-row">
      <span class="drawer-score drawer-score-ai">AI</span>
      <div>
        <strong>Xếp hạng bởi model AI</strong>
        <span>Lý do bên dưới do model sinh ra từ hồ sơ và nội dung đề tài — không phải điểm số cố định.</span>
      </div>
    </div>`
    : `
    <div class="drawer-score-row">
      <span class="drawer-score">${project.match || 88}%</span>
      <div>
        <strong>Mức phù hợp mô phỏng</strong>
        <span>Tính bằng quy tắc cố định từ câu trả lời của bạn.</span>
      </div>
    </div>`;

  refs.detailContent.innerHTML = `
    ${scoreRowHtml}

    <section class="drawer-section">
      <h3>Vấn đề cần giải quyết</h3>
      <p>${escapeHtml(project.mo_ta_bai_toan || project.pain_point || project.quyet_dinh_ai || "")}</p>
    </section>

    <section class="drawer-section">
      <h3>Vì sao phù hợp với bạn</h3>
      <ul class="reason-list">
        ${reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
      </ul>
    </section>

    ${
      project.riskNote
        ? `
    <section class="drawer-section drawer-section-risk">
      <h3>Cần lưu ý</h3>
      <p>${escapeHtml(project.riskNote)}</p>
    </section>`
        : ""
    }

    <section class="drawer-section">
      <h3>Setup prototype trong 4 bước</h3>
      <ol class="setup-list">
        <li>
          <strong>Chốt lát cắt demo</strong>
          <span>Chọn một người dùng, một quyết định trung tâm và một kết quả đo được.</span>
        </li>
        <li>
          <strong>Tạo 10–20 mẫu dữ liệu giả</strong>
          <span>Dùng schema từ nguồn sự thật: ${escapeHtml(shorten(project.nguon_su_that || "dữ liệu đầu vào", 110))}</span>
        </li>
        <li>
          <strong>Dựng flow có thể bấm hết</strong>
          <span>Input → kiểm tra dữ liệu → kết quả → người dùng xác nhận hoặc sửa.</span>
        </li>
        <li>
          <strong>Kiểm thử 5 ca tốt + 5 ca khó</strong>
          <span>Đo: ${escapeHtml(shorten(project.metric_eval || "độ chính xác và thời gian xử lý", 110))}</span>
        </li>
      </ol>
    </section>

    <section class="drawer-section">
      <h3>Stack gợi ý</h3>
      <div class="tech-block">${escapeHtml(project.tech_stack || "HTML · CSS · JavaScript · dữ liệu JSON giả")}</div>
    </section>

    <div class="drawer-actions">
      <button class="button primary" id="chooseProject" type="button">Chọn đề tài này</button>
      <button class="button secondary" id="copyChecklist" type="button">Sao chép checklist</button>
    </div>
  `;

  refs.detailBackdrop.classList.remove("is-hidden");
  refs.detailDrawer.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";

  document.getElementById("chooseProject").addEventListener("click", () => {
    closeDetail();
    switchView("advisor");
    addUserMessage(`Mình chọn đề tài ${project.ma_de}.`);
    window.setTimeout(() => {
      addAssistantMessage(`
        <p>Đã chốt! Bước tiếp theo là viết một câu mô tả ngắn theo mẫu: <strong>“Giúp [người dùng] quyết định [việc gì] dựa trên [bằng chứng nào]”.</strong></p>
        <p>Với ${escapeHtml(project.ma_de)}, bạn có thể bắt đầu từ quyết định: “${escapeHtml(shorten(project.quyet_dinh_ai || project.ten_de_tai, 150))}”</p>
      `);
    }, 220);
  });

  document.getElementById("copyChecklist").addEventListener("click", async (event) => {
    const text = [
      `Đề tài: ${project.ten_de_tai}`,
      "1. Chốt lát cắt demo",
      "2. Tạo 10–20 mẫu dữ liệu giả",
      "3. Dựng flow input → kết quả → xác nhận",
      "4. Kiểm thử 5 ca tốt + 5 ca khó",
      `Stack: ${project.tech_stack || "HTML, CSS, JavaScript"}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      event.currentTarget.textContent = "Đã sao chép ✓";
    } catch {
      event.currentTarget.textContent = "Checklist đã sẵn sàng";
    }
  });

  if (announce) {
    window.setTimeout(() => {
      addAssistantMessage(`
        <p>Mình đã mở <strong>kế hoạch setup 4 bước</strong> ở bảng bên phải. Bạn có thể sao chép checklist hoặc chọn luôn đề tài.</p>
      `);
    }, 250);
  }
}

function closeDetail() {
  refs.detailBackdrop.classList.add("is-hidden");
  refs.detailDrawer.classList.add("is-hidden");
  if (refs.suggestModal.classList.contains("is-hidden") && refs.onboardingModal.classList.contains("is-hidden")) {
    document.body.style.overflow = "";
  }
}

function openSuggestModal() {
  refs.suggestModal.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => refs.newTopicTitle.focus(), 80);
}

function closeSuggestModal() {
  refs.suggestModal.classList.add("is-hidden");
  if (refs.detailDrawer.classList.contains("is-hidden") && refs.onboardingModal.classList.contains("is-hidden")) {
    document.body.style.overflow = "";
  }
}

function submitTopicSuggestion(event) {
  event.preventDefault();
  if (!refs.suggestForm.reportValidity()) return;

  const suggestion = {
    id: `NEW-${String(state.suggestedTopics.length + 1).padStart(3, "0")}`,
    title: refs.newTopicTitle.value.trim(),
    area: refs.newTopicArea.value,
    team: refs.newTopicTeam.value,
    problem: refs.newTopicProblem.value.trim(),
    skills: refs.newTopicSkills.value.trim(),
  };
  state.suggestedTopics.push(suggestion);
  closeSuggestModal();
  refs.suggestForm.reset();

  addUserMessage(`
    <p><strong>Đề xuất ${escapeHtml(suggestion.id)}</strong></p>
    <p>${escapeHtml(suggestion.title)} · ${escapeHtml(suggestion.area)} · ${escapeHtml(suggestion.team)}</p>
  `);
  window.setTimeout(() => {
    addAssistantMessage(`
      <p>Đã ghi nhận ý tưởng <strong>${escapeHtml(suggestion.id)}</strong> trong phiên demo.</p>
      <p>Bước kiểm tra tiếp theo nên là: xác định người thực hiện công việc hiện tại và một hậu quả có thể đo được từ vấn đề “${escapeHtml(shorten(suggestion.problem, 130))}”.</p>
    `);
  }, 260);
  showToast();
}

function handleTypedMessage() {
  const text = refs.chatInput.value.trim();
  if (!text) return;
  refs.chatInput.value = "";
  autoResizeComposer();
  addUserMessage(escapeHtml(text));

  const lower = normalize(text);
  window.setTimeout(() => {
    if (!state.profileLoaded) {
      addAssistantMessage(`
        <p>Hãy hoàn tất cửa sổ <strong>Thiết lập hồ sơ</strong> trước để mình có đủ thông tin tạo gợi ý.</p>
      `);
      window.setTimeout(() => openOnboarding(1), 300);
      return;
    }

    if (state.stage !== "results") {
      addAssistantMessage(`
        <p>Mình đã ghi nhận câu trả lời. Bạn có thể dùng các lựa chọn ngay phía trên để tiếp tục đến bước gợi ý đề tài.</p>
      `);
      return;
    }

    if (lower.includes("setup") || lower.includes("bat dau") || lower.includes("thuc hien")) {
      openProjectDetail(state.recommendations[0], true);
      return;
    }

    if (lower.includes("de xuat") || lower.includes("y tuong moi")) {
      openSuggestModal();
      return;
    }

    addAssistantMessage(`
      <p>Trong prototype này, mình dùng câu trả lời dựng sẵn. Bạn có thể <strong>bấm một đề tài</strong> để xem setup, hoặc chọn <strong>Góp ý đề tài</strong> để gửi ý tưởng mới.</p>
    `);
  }, 380);
}

function updateProfileSkills() {
  refs.profileSkills.innerHTML = state.skills
    .map((skill) => `<span class="profile-tag">${escapeHtml(skill)}</span>`)
    .join("");
  refs.skillCount.textContent = `${state.skills.length} kỹ năng`;
}

function updateNav(stage) {
  const order = ["profile", "questions", "results"];
  const activeIndex = order.indexOf(stage);
  document.querySelectorAll("[data-nav-step]").forEach((step) => {
    const index = order.indexOf(step.dataset.navStep);
    step.classList.toggle("is-active", index === activeIndex);
    step.classList.toggle("is-complete", index < activeIndex);
  });
  state.stage = stage;
}

function addAssistantMessage(html) {
  return addMessage("assistant", html);
}

function addUserMessage(html, isTrustedHtml = false) {
  return addMessage("user", isTrustedHtml ? html : `<p>${html}</p>`);
}

function addMessage(role, html) {
  const message = document.createElement("article");
  message.className = `message ${role}`;
  message.innerHTML = `
    <div class="message-avatar">${role === "assistant" ? "M" : "MA"}</div>
    <div class="message-body">
      <div class="bubble">${html}</div>
      <span class="message-time">${formatTime()}</span>
    </div>
  `;
  refs.chatStream.appendChild(message);
  scrollChat();
  return message;
}

function addTyping() {
  const message = document.createElement("article");
  message.className = "message assistant";
  message.innerHTML = `
    <div class="message-avatar">M</div>
    <div class="message-body">
      <div class="bubble typing"><i></i><i></i><i></i></div>
    </div>
  `;
  refs.chatStream.appendChild(message);
  scrollChat();
  return message;
}

function disableInlineActions() {
  refs.chatStream.querySelectorAll(".inline-actions button").forEach((button) => {
    button.disabled = true;
    button.style.opacity = "0.55";
    button.style.pointerEvents = "none";
  });
}

function removeActiveInteractive() {
  refs.chatStream.querySelector(".active-interactive")?.remove();
}

function selectWithinSegment(button) {
  button.parentElement.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("is-selected", item === button);
  });
}

function showToast(options) {
  const titleEl = refs.toast.querySelector("strong");
  const messageEl = refs.toast.querySelector("span");
  if (options && typeof options === "object") {
    if (options.title) titleEl.textContent = options.title;
    if (options.message) messageEl.textContent = options.message;
  }
  refs.toast.classList.remove("is-hidden");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => refs.toast.classList.add("is-hidden"), 3200);
}

function resetDemo() {
  state.stage = "profile";
  state.activeView = "advisor";
  state.onboardingStep = 1;
  state.profileLoaded = false;
  state.profileName = "";
  state.profileMajor = "";
  state.ocrProfile = null;
  state.ocrRunId = null;
  state.ocrConfirmed = false;
  state.extractedProjects = [];
  state.experienceLevel = "unknown";
  state.interest = null;
  state.skills = ["Python", "SQL", "Phân tích dữ liệu"];
  state.teamSize = 4;
  state.difficulty = "balanced";
  state.recommendations = [];
  state.catalogLimit = 12;
  refs.profileFileInput.value = "";
  resetOcrReview();
  refs.onboardingName.value = "";
  refs.onboardingMajor.value = "";
  refs.onboardingFileLabel.textContent = "Tải hồ sơ PDF, DOCX hoặc ảnh";
  refs.onboardingFileMeta.textContent = "PDF, DOCX, PNG hoặc JPG · tối đa 5 MB";
  refs.profileEmpty.classList.remove("is-hidden");
  refs.profileContent.classList.add("is-hidden");
  refs.fitSummary.classList.add("is-hidden");
  refs.profilePanel.classList.remove("is-open");
  closeDetail();
  closeSuggestModal();
  clearTopicFilters();
  updateNav("profile");
  renderInitialConversation();
  syncOnboardingSelections();
  switchView("advisor");
  openOnboarding(1);
}

function getProjectTags(project) {
  const corpus = normalize(project.tech_stack || "");
  const candidates = ["Python", "SQL", "FastAPI", "PostgreSQL", "React", "OCR", "Dashboard"];
  const matched = candidates.filter((tag) => corpus.includes(normalize(tag)));
  if (matched.length >= 2) return matched.slice(0, 3);
  return [...matched, ...state.skills].filter((item, index, array) => array.indexOf(item) === index).slice(0, 3);
}

function autoResizeComposer() {
  refs.chatInput.style.height = "34px";
  refs.chatInput.style.height = `${Math.min(refs.chatInput.scrollHeight, 100)}px`;
}

function scrollChat() {
  window.requestAnimationFrame(() => {
    refs.chatStream.scrollTo({
      top: refs.chatStream.scrollHeight,
      behavior: "smooth",
    });
  });
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shorten(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}…` : text;
}

function fileExtension(filename) {
  const extension = String(filename).split(".").pop().toUpperCase();
  return ["PDF", "DOC", "DOCX", "TXT"].includes(extension) ? extension : "DOC";
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "Tệp mẫu";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime() {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "HV";
  return `${words[0][0] || ""}${words.length > 1 ? words[words.length - 1][0] : ""}`.toUpperCase();
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}