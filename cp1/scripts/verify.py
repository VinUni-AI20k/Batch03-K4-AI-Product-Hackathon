"""Tái tạo toàn bộ con số trong canvas.md và impact-table.md.

Chạy:  python cp1/scripts/verify.py
Cần:   data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv

Mỗi mục in ra tương ứng một con số được trích trong spec — xem
cp1/scripts/README.md để biết số nào nằm ở đâu.
"""
import csv, collections, json, os, re, statistics, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(HERE, '..', '..', 'data', 'vlearn-pack', 'chatlog',
                   'chat_history_anonymized_for_hackathon.csv')
DAYS = 8  # 22/07 -> 29/07/2026

# --- quy tắc đếm (đây là phần phải kiểm lại được) --------------------------
# Tin nhắn học viên có dạng: (Trang N, đoạn được chọn: "X")\n<câu gõ>
PREFIX = re.compile(r'^\(Trang (\d+), đoạn được chọn: "(.*?)"\)\s*(.*)$', re.S)
# Bộ HẸP: chỉ giữ tín hiệu "không truy xuất được nội dung"
STRICT = re.compile(r'không tìm thấy|không thể tìm thấy|chưa tìm thấy'
                    r'|không thể truy cập|không tìm được', re.I)
# Bộ RỘNG: thêm các cách nói khác — có false positive, dùng để lấy biên trên
BROAD = re.compile(STRICT.pattern + r'|rất tiếc|xin lỗi bạn, tôi không|không có thông tin'
                   r'|không đề cập|không hiển thị|cung cấp thêm thông tin|cung cấp nội dung', re.I)
SUMM = re.compile(r'tóm tắt|tóm gọn|tổng hợp|summar|nội dung chính|ý chính|tổng quan', re.I)
DECK = re.compile(r'toàn bộ|tất cả|cả bộ|cả buổi|bài học|bài giảng|hôm nay|ngày hôm'
                  r'|day\s*0?\d|\.pdf|các chủ đề|những nội dung cần|chương|môn', re.I)
PAGE = re.compile(r'slide này|trang này|slide đó|trang \d+|slide \d+|sờ lai này|đoạn này', re.I)

norm = lambda s: re.sub(r'\W+', ' ', s.lower()).strip()


def load():
    rows = list(csv.DictReader(open(CSV, encoding='utf-8')))
    turns, order = collections.defaultdict(dict), []
    for r in rows:
        if r['turn_id'] not in turns:
            order.append(r['turn_id'])
        turns[r['turn_id']][r['role']] = r
    return rows, turns, order


rows, turns, order = load()
tut = lambda t: turns[t].get('tutor', {}).get('content', '') or ''
rat = lambda t: turns[t].get('tutor', {}).get('rating') or ''
uid = lambda t: (turns[t].get('student') or {}).get('user_id')
cid = lambda t: (turns[t].get('student') or turns[t].get('tutor'))['conversation_id']
dcode = lambda t: (turns[t].get('student') or turns[t].get('tutor'))['day_code']


def cits(t):
    try:
        return json.loads(turns[t].get('tutor', {}).get('citations', '') or '[]')
    except ValueError:
        return []


def parse(t):
    """-> (trang, đoạn bôi đen, câu gõ). Trang None nếu không khớp prefix."""
    m = PREFIX.match(turns[t].get('student', {}).get('content', ''))
    return (int(m.group(1)), m.group(2).strip(), m.group(3).strip()) if m else (None, '', '')


question = lambda t: parse(t)[2] or parse(t)[1]
# Có bôi đen thật = đoạn được chọn KHÁC câu gõ (nếu trùng thì UI echo lại câu hỏi)
highlighted = lambda t: norm(parse(t)[1]) != norm(parse(t)[2]) and bool(parse(t)[2])
fails = lambda t: bool(STRICT.search(tut(t)))

parsed = [t for t in order if parse(t)[0] is not None]
users = set(uid(t) for t in order if uid(t))
H = lambda s: print('\n' + '=' * 4 + ' ' + s + ' ' + '=' * max(0, 66 - len(s)))
pct = lambda a, b: '%d/%d = %.1f%%' % (a, b, 100.0 * a / b) if b else 'n/a'


def down_rate(g):
    d = sum(1 for t in g if rat(t) == 'down')
    u = sum(1 for t in g if rat(t) == 'up')
    return '%d 👎 / %d 👍 -> %s' % (d, u, ('%.0f%% 👎' % (100.0 * d / (d + u))) if d + u else 'không ai rate')


H('§0 · Nền dữ liệu')
print('turn (1 turn = 1 student + 1 tutor):', len(order))
print('dòng CSV:', len(rows), '· user:', len(users), '· hội thoại:', len(set(cid(t) for t in order)))
print('tin nhắn học viên có context trang:', pct(len(parsed), len(order)))
print('câu trả lời tutor không có citation:',
      pct(sum(1 for t in order if not cits(t)), len(order)))
print('field chưa dùng — follow_ups:',
      sum(1 for t in order if (turns[t].get('tutor', {}).get('follow_ups') or '[]') not in ('[]', '')),
      '· misconceptions:',
      sum(1 for t in order if (turns[t].get('tutor', {}).get('misconceptions') or '[]') not in ('[]', '')))

H('§1 · Tỷ lệ tutor không tra được nội dung')
print('bộ HẸP  :', pct(sum(1 for t in order if fails(t)), len(order)), '<- con số dùng trong spec (biên dưới)')
print('bộ RỘNG :', pct(sum(1 for t in order if BROAD.search(tut(t))), len(order)), '<- biên trên, có false positive')
print('=> con số thật nằm giữa hai biên; spec ghi biên dưới')

H('§2 · Trigger: có bôi đen hay không (bằng chứng chính)')
no_hl = [t for t in parsed if not highlighted(t)]
hl = [t for t in parsed if highlighted(t)]
for name, g in (('gõ tự do (tutor chỉ nhận số trang)', no_hl), ('có bôi đen (text slide vào context)', hl)):
    print('%-38s %s · %s' % (name, pct(sum(1 for t in g if fails(t)), len(g)), down_rate(g)))
print('\nđộ dài đoạn bôi đen KHÔNG phải biến giải thích:')
for lo, hi, lab in ((0, 30, '<30 ký tự'), (30, 200, '30-200'), (200, 10 ** 9, '>200')):
    g = [t for t in hl if lo <= len(parse(t)[1]) < hi]
    if g:
        print('  %-12s %s' % (lab, pct(sum(1 for t in g if fails(t)), len(g))))

H('§3 · Loại trừ giả thuyết "do slide là ảnh"')
# Trang CHẮC CHẮN có text = đã có lượt bôi đen ra >=15 ký tự từ chính trang đó
has_text = set((dcode(t), parse(t)[0]) for t in parsed if highlighted(t) and len(parse(t)[1]) >= 15)
nofail = [t for t in no_hl if fails(t)]
on_texty = [t for t in nofail if (dcode(t), parse(t)[0]) in has_text]
print('(day_code, trang) chắc chắn có text:', len(has_text))
print('ca gõ-tự-do thất bại nằm trên trang đã chứng minh có text:', pct(len(on_texty), len(nofail)))
print('=> số này KHÔNG thể do ảnh; phần còn lại chưa chứng minh được nên ảnh vẫn có thể là nguyên nhân phụ')

H('§4 · Phạm vi yêu cầu: cả bộ vs một trang')
deck = [t for t in parsed if SUMM.search(question(t)) and DECK.search(question(t)) and not PAGE.search(question(t))]
page = [t for t in parsed if SUMM.search(question(t)) and PAGE.search(question(t)) and not DECK.search(question(t))]
for name, g in (('tóm tắt CẢ BỘ', deck), ('tóm tắt MỘT TRANG', page)):
    ok = [t for t in g if not fails(t)]
    print('%-20s n=%-3d user riêng biệt=%-3d · từ chối thẳng %s · trong số "trả lời được" thì %s không có citation'
          % (name, len(g), len(set(uid(t) for t in g if uid(t))),
             pct(sum(1 for t in g if fails(t)), len(g)),
             pct(sum(1 for t in ok if not cits(t)), len(ok))))
print('=> nhóm "trả lời được nhưng không citation" của CẢ BỘ phần lớn là từ chối nói bằng cách khác')
print('   (kiểm tay 8/8 mẫu) -> thất bại thực của CẢ BỘ cao hơn con số từ-chối-thẳng')

H('§5 · Bảng impact: bao nhiêu người × tần suất')
cand = [
    ('① trang: gõ tự do không tra được', nofail),
    ('② cả bộ: xin tổng quan', deck),
    ('③ trả lời không citation (không kể ①)', [t for t in parsed if not cits(t) and not fails(t)]),
    ('④ citation lệch trang đang xem', [t for t in parsed if cits(t) and parse(t)[0] not in cits(t)]),
    ('⑤ trả lời quá dài (top 25%)', sorted(parsed, key=lambda t: -len(tut(t)))[:len(parsed) // 4]),
]
for name, g in cand:
    us = set(uid(t) for t in g if uid(t))
    print('%-38s %4d lượt · %3d/%d user = %2.0f%% · %4.1f lượt/ngày · %s'
          % (name, len(g), len(us), len(users), 100.0 * len(us) / len(users), 1.0 * len(g) / DAYS, down_rate(g)))

H('§6 · Hai giả thuyết đã kiểm — KHÔNG đứng vững (ghi nhận trung thực)')
conv = collections.defaultdict(list)
for t in order:
    conv[cid(t)].append(t)
print('Giả thuyết A: "bị từ chối thì học viên bỏ cuộc"')
for rule_name, rule in (('bộ HẸP ', fails), ('bộ RỘNG', lambda t: bool(BROAD.search(tut(t))))):
    ref = [c for c, ts in conv.items() if rule(ts[0])]
    ok = [c for c, ts in conv.items() if not rule(ts[0])]
    dr = sum(1 for c in ref if len(conv[c]) == 1)
    do = sum(1 for c in ok if len(conv[c]) == 1)
    print('  %s | câu đầu bị từ chối: %-16s | câu đầu được trả lời: %-18s | lệch %+.1f điểm'
          % (rule_name, pct(dr, len(ref)), pct(do, len(ok)),
             100.0 * dr / len(ref) - 100.0 * do / len(ok)))
print('  => bộ rộng: lệch ~0. Bộ hẹp: lệch ~8 điểm nhưng n=90 nên chưa phân biệt được (z≈1,5, p≈0,14).')
print('  => CHƯA có bằng chứng cho giả thuyết A -> KHÔNG dùng số hội thoại-1-turn làm hậu quả.')
by_len = sorted(order, key=lambda t: -len(tut(t)))
q = len(order) // 4
print('\nGiả thuyết B: "trả lời quá dài gây khó chịu"')
print('  trả lời DÀI nhất 25% :', down_rate(by_len[:q]))
print('  trả lời NGẮN nhất 25%:', down_rate(by_len[-q:]))
print('  độ dài refusal vs trả lời thật: median %d vs %d ký tự'
      % (statistics.median([len(tut(t)) for t in order if fails(t)]),
         statistics.median([len(tut(t)) for t in order if not fails(t)])))
print('  => ĐẢO NGƯỢC giả thuyết B: dài 0% 👎, ngắn 76% 👎. "Quá dài" không phải pain;')
print('     ngắn chỉ là dấu hiệu của câu từ chối. Ứng viên ⑤ bị loại vì lý do này.')

H('§8 · "Tốn gì mỗi lần" — đo từ timestamp')
# Với mỗi lượt bị từ chối, xét các lượt SAU nó trong cùng hội thoại:
#   - học viên có hỏi lại không, mấy lượt nữa mới được trả lời
#   - bao lâu (phút) từ lúc bị từ chối tới lượt hỏi kế tiếp
#   - có bao giờ được giải quyết trong hội thoại đó không
import datetime
ts = lambda t: datetime.datetime.fromisoformat(turns[t]['student']['message_created_at'])
for lab, target in (('① trang (gõ tự do)', [t for t in no_hl if fails(t)]),
                    ('② cả bộ (xin tổng quan)', [t for t in deck if fails(t)])):
    extra, gaps, unresolved, terminal = [], [], 0, 0
    for t in target:
        seq = conv[cid(t)]
        if t not in seq:
            continue
        after = seq[seq.index(t) + 1:]
        if not after:
            terminal += 1
            unresolved += 1
            continue
        gaps.append((ts(after[0]) - ts(t)).total_seconds() / 60.0)
        won = next((i for i, x in enumerate(after, 1) if not fails(x)), None)
        if won is None:
            unresolved += 1
        else:
            extra.append(won)
    n = len(target)
    print('%s — n=%d' % (lab, n))
    print('   hội thoại DỪNG LUÔN tại lượt bị từ chối (câu hỏi không bao giờ được trả lời): %s'
          % pct(terminal, n))
    print('   không được giải quyết trong hội thoại đó:                                    %s' % pct(unresolved, n))
    if extra:
        print('   khi có được trả lời: phải hỏi thêm **%.0f lượt** (median), tệ nhất %d lượt'
              % (statistics.median(extra), max(extra)))
    if gaps:
        print('   khoảng cách tới lượt hỏi kế tiếp: median **%.1f phút** (p90 %.1f phút)'
              % (statistics.median(gaps), sorted(gaps)[int(.9 * len(gaps))]))
print('\nLưu ý đọc số: "phút" là thời gian giữa hai tin nhắn, không phải thời gian học viên')
print('ngồi loay hoay — họ có thể đang nghe giảng. Dùng làm biên trên của chi phí mỗi lần.')

# Bịt lỗ: hội thoại dừng ở lượt bị từ chối — học viên có mở hội thoại KHÁC để hỏi lại không?
day = lambda t: turns[t]['student']['message_created_at'][:10]
first_ts = {}
for t in order:
    if uid(t):
        first_ts.setdefault(cid(t), ts(t))
term = [t for t in no_hl if fails(t) and conv[cid(t)][-1] == t]
retried = 0
for t in term:
    later = [c for c in conv
             if c != cid(t) and first_ts.get(c) and first_ts[c] > ts(t)
             and any(uid(x) == uid(t) for x in conv[c]) and day(conv[c][0]) == day(t)]
    if later:
        retried += 1
print('\nTrong %d lượt bị từ chối mà hội thoại DỪNG LUÔN:' % len(term))
print('  học viên mở hội thoại KHÁC trong cùng ngày (có thể hỏi lại ở đó): %s' % pct(retried, len(term)))
print('  không mở hội thoại nào nữa trong ngày -> bỏ hẳn:                  %s' % pct(len(term) - retried, len(term)))

H('§7 · Quota — chưa dùng được, cần team VLearn xác nhận')
per = collections.Counter()
for t in order:
    if uid(t):
        per[(uid(t), turns[t]['student']['message_created_at'][:10])] += 1
print('(user, ngày) có >=15 câu hỏi:', sum(1 for v in per.values() if v >= 15))
print('cao nhất:', per.most_common(1)[0][0], '=', per.most_common(1)[0][1], 'câu hỏi trong một ngày')
print('=> UI hiện "0/15 câu/ngày" nhưng data có user vượt -> quota mới hoặc BYOK đi vòng')
print()
