import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiMapPin, FiStar, FiPhone, FiMail, FiFilter } from 'react-icons/fi';
import './FindLawyer.css';

const SPECS = ['All', 'Criminal Law', 'Family Law', 'Property Law', 'Consumer Rights', 'Labour Law', 'Cyber Law', 'Corporate Law', 'Tax Law'];
const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Lucknow', 'Jaipur'];

export default function FindLawyer() {
  const [lawyers, setLawyers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [city, setCity]         = useState('All Cities');
  const [spec, setSpec]         = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchLawyers(); }, []);

  const fetchLawyers = async (p = {}) => {
    setLoading(true);
    try { const r = await axios.get('/api/lawyers', { params: p }); setLawyers(r.data); }
    catch { setLawyers([]); }
    finally { setLoading(false); }
  };

  const handleSearch = () => {
    const p = {};
    if (search) p.search = search;
    if (city !== 'All Cities') p.city = city;
    if (spec !== 'All') p.specialization = spec;
    fetchLawyers(p);
  };

  return (
    <div className="lawyers-page">
      <div className="container">
        <div className="page-head fade-up">
          <div className="page-head-icon"><FiSearch size={24} /></div>
          <div>
            <h1 className="page-head-title">Find a<br />Lawyer</h1>
            <p className="page-head-desc">Connect with Indian advocates by specialisation and city.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar fade-up">
          <div className="search-row">
            <div className="search-field">
              <FiSearch size={15} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search by name, specialisation, or city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSearch}><FiSearch size={14} /> Search</button>
          </div>

          <div className="filter-row">
            <FiFilter size={13} style={{ color: 'var(--text-faint)' }} />
            <select className="city-select" value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="spec-filters">
              {SPECS.map(s => (
                <button key={s} className={`spec-pill ${spec === s ? 'active' : ''}`} onClick={() => setSpec(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-state"><div className="loading-ring" /><p>Finding lawyers…</p></div>
        ) : lawyers.length === 0 ? (
          <div className="empty-state">
            <h3>No lawyers found</h3>
            <p>Adjust your filters.</p>
          </div>
        ) : (
          <div className="lawyers-grid">
            {lawyers.map((l, i) => (
              <div key={l._id || i} className="lawyer-card fade-up" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setSelected(l)}>
                <div className="lc-top">
                  <div className="lc-avatar">{l.name.split(' ').slice(-1)[0][0]}</div>
                  <div className="lc-info">
                    <div className="lc-name">
                      {l.name}
                      {l.isVerified && <span className="verified-mark">✓ Verified</span>}
                    </div>
                    <div className="lc-loc"><FiMapPin size={11} />{l.city}, {l.state}</div>
                    <div className="lc-exp">{l.experience} yrs experience</div>
                  </div>
                  <div className="lc-rating"><FiStar size={13} />{l.rating}</div>
                </div>

                <div className="lc-specs">
                  {l.specialization?.slice(0, 3).map((s, si) => <span key={si} className="lc-spec">{s}</span>)}
                  {l.specialization?.length > 3 && <span className="lc-spec-more">+{l.specialization.length - 3}</span>}
                </div>

                <div className="lc-langs">
                  {l.languages?.map((lg, li) => <span key={li} className="lc-lang">{lg}</span>)}
                </div>

                <div className="lc-actions">
                  <a href={`tel:${l.phone}`} className="lc-btn" onClick={e => e.stopPropagation()}><FiPhone size={12} /> Call</a>
                  <a href={`mailto:${l.email}`} className="lc-btn" onClick={e => e.stopPropagation()}><FiMail size={12} /> Email</a>
                  <button className="lc-btn" onClick={e => { e.stopPropagation(); setSelected(l); }}>View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selected && (
          <div className="modal-bg" onClick={() => setSelected(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <button className="modal-x" onClick={() => setSelected(null)}>✕</button>
              <div className="modal-head">
                <div className="modal-avatar">{selected.name.split(' ').slice(-1)[0][0]}</div>
                <div>
                  <div className="modal-name">{selected.name}</div>
                  <div className="modal-loc"><FiMapPin size={12} />{selected.city}, {selected.state}</div>
                  <div className="modal-rating"><FiStar size={13} />{selected.rating} · {selected.experience} yrs experience</div>
                  {selected.isVerified && <span className="verified-mark" style={{ marginTop: 6, display: 'inline-flex' }}></span>}
                </div>
              </div>
              {selected.about && <p className="modal-about">{selected.about}</p>}
              <div className="modal-sec">
                <div className="modal-sec-label">Specialisations</div>
                <div className="lc-specs">{selected.specialization?.map((s,i) => <span key={i} className="lc-spec">{s}</span>)}</div>
              </div>
              <div className="modal-sec">
                <div className="modal-sec-label">Languages</div>
                <div className="lc-langs">{selected.languages?.map((l,i) => <span key={i} className="lc-lang">{l}</span>)}</div>
              </div>
              {selected.barCouncilNo && (
                <div className="modal-sec">
                  <div className="modal-sec-label"></div>
                  <div className="modal-bar-no">{selected.barCouncilNo}</div>
                </div>
              )}
              <div className="modal-contact">
                <a href={`tel:${selected.phone}`} className="btn btn-primary"><FiPhone size={13} />{selected.phone}</a>
                <a href={`mailto:${selected.email}`} className="btn btn-secondary"><FiMail size={13} />{selected.email}</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
