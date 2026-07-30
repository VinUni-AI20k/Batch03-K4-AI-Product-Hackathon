const fs = require("fs");
const path = require("path");

const evalDir = fs.existsSync(path.join(process.cwd(), "eval", "golden-set.json"))
  ? path.join(process.cwd(), "eval")
  : __dirname;
const root = path.resolve(evalDir, "..");
const datasetPath = path.join(evalDir, "golden-set.json");
const catalogPath = path.join(root, "mock-data.json");

const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const catalogCodes = new Set(catalog.map((item) => item.ma_de));

const allowedActions = new Set([
  "recommend",
  "explain",
  "compare",
  "clarify",
  "refuse_and_redirect",
  "no_match",
]);
const expectedGroups = {
  normal_recommendation: 12,
  source_truth: 6,
  ambiguity_missing_info: 8,
  out_of_scope_authority: 6,
  domain_specific_risk: 5,
  rare_edge: 3,
};
const minimumRiskCoverage = {
  source_truth: 6,
  ambiguity_missing_info: 8,
  out_of_scope_authority: 6,
  domain_specific: 5,
};

const errors = [];
const cases = Array.isArray(dataset.cases) ? dataset.cases : [];
const ids = new Set();
const groupCounts = {};
const riskCounts = {};
let adaptedRealCount = 0;

if (dataset.case_count !== 40) errors.push(`case_count phải bằng 40, nhận ${dataset.case_count}`);
if (cases.length !== 40) errors.push(`cases phải có 40 phần tử, nhận ${cases.length}`);

for (const testCase of cases) {
  const label = testCase.id || "<missing-id>";
  if (!testCase.id) errors.push("Có case thiếu id");
  if (ids.has(testCase.id)) errors.push(`Trùng id: ${testCase.id}`);
  ids.add(testCase.id);

  groupCounts[testCase.group] = (groupCounts[testCase.group] || 0) + 1;
  riskCounts[testCase.risk_layer] = (riskCounts[testCase.risk_layer] || 0) + 1;

  if (!testCase.input || !testCase.input.user_message) {
    errors.push(`${label}: thiếu input.user_message`);
  }
  if (!testCase.expected || !allowedActions.has(testCase.expected.action)) {
    errors.push(`${label}: expected.action không hợp lệ`);
  }
  if (!Array.isArray(testCase.expected?.required_behaviors) || testCase.expected.required_behaviors.length === 0) {
    errors.push(`${label}: required_behaviors phải là mảng không rỗng`);
  }
  if (!Array.isArray(testCase.expected?.forbidden_behaviors) || testCase.expected.forbidden_behaviors.length === 0) {
    errors.push(`${label}: forbidden_behaviors phải là mảng không rỗng`);
  }
  if (!testCase.origin?.kind || !Array.isArray(testCase.origin.refs) || testCase.origin.refs.length === 0) {
    errors.push(`${label}: origin phải có kind và refs`);
  }

  if (testCase.origin?.kind === "adapted_real_chatlog") {
    adaptedRealCount += 1;
    for (const ref of testCase.origin.refs) {
      if (!/^chatlog:T\d{4}\/M\d{4}$/.test(ref)) {
        errors.push(`${label}: ref chatlog không đúng dạng Txxxx/Mxxxx: ${ref}`);
      }
    }
  }

  for (const code of testCase.expected?.acceptable_codes || []) {
    if (!catalogCodes.has(code)) errors.push(`${label}: mã đề tài không tồn tại: ${code}`);
  }
  for (const ref of testCase.origin?.refs || []) {
    const match = /^mock-data\.json:([A-Z0-9-]+)$/.exec(ref);
    if (match && !catalogCodes.has(match[1])) {
      errors.push(`${label}: source ref không tồn tại trong catalogue: ${match[1]}`);
    }
  }

  const teamSize = testCase.input?.profile?.team_size;
  if (teamSize !== undefined && (!Number.isInteger(teamSize) || teamSize < 1 || teamSize > 10)) {
    errors.push(`${label}: profile.team_size không hợp lệ`);
  }
}

for (const [group, expectedCount] of Object.entries(expectedGroups)) {
  if ((groupCounts[group] || 0) !== expectedCount) {
    errors.push(`Nhóm ${group} phải có ${expectedCount} case, nhận ${groupCounts[group] || 0}`);
  }
}
for (const [risk, minimum] of Object.entries(minimumRiskCoverage)) {
  if ((riskCounts[risk] || 0) < minimum) {
    errors.push(`Risk layer ${risk} cần ít nhất ${minimum} case, nhận ${riskCounts[risk] || 0}`);
  }
}
if (adaptedRealCount < 10) {
  errors.push(`Cần ít nhất 10 case adapted_real_chatlog, nhận ${adaptedRealCount}`);
}

if (errors.length) {
  console.error("Golden set INVALID:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Golden set VALID");
console.log(`- cases: ${cases.length}`);
console.log(`- adapted real chatlog cases: ${adaptedRealCount}`);
console.log(`- groups: ${JSON.stringify(groupCounts)}`);
console.log(`- risk layers: ${JSON.stringify(riskCounts)}`);
