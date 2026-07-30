import { PEERS } from '@/lib/constants';

export function PeerStack() {
  return (
    <div className="peer-stack" title="Bạn học cùng lớp">
      {PEERS.map((p, pi) => (
        <div key={pi} className="peer-wrap">
          <div className="peer">{p.initial}</div>
          <div className="peer-card">
            <div className="pc-head">
              <div className="pc-avatar">{p.initial}</div>
              <div>
                <div className="pc-name">{p.name}</div>
                <span className="pc-role">{p.role}</span>
              </div>
            </div>
            <div className="pc-desc">{p.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
