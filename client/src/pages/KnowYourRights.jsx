import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import './KnowYourRights.css';

export default function KnowYourRights() {
  const [cats, setCats]         = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState({});

  useEffect(() => {
    axios.get('/api/rights')
      .then(r => setCats(r.data))
      .catch(() => setCats([]))
      .finally(() => setLoading(false));
  }, []);

  const fetchRight = async (id) => {
    const r = await axios.get(`/api/rights/${id}`);
    setSelected(r.data);
    setOpen({});
  };

  const toggle = (i) => setOpen(p => ({ ...p, [i]: !p[i] }));

  if (loading) return (
    <div className="rights-page">
      <div className="container pg-loading">
        <div className="pg-ring" /><p>Loading rights database…</p>
      </div>
    </div>
  );

  return (
    <div className="rights-page">
      <div className="container">
        <div className="rights-hero fade-up">
          <span className="rights-badge">EASY LEGAL GUIDES · BASIC RIGHTS</span>
          <h1 className="rights-title">Know Your Legal Rights</h1>
          <p className="rights-subtitle">Simple guides to help you understand your basic legal rights as a tenant, worker, consumer, and citizen in India.</p>
        </div>

        {!selected ? (
          <div className="rights-grid fade-up">
            {cats.map((c, i) => (
              <button key={c.id} className="rights-cat-btn" onClick={() => fetchRight(c.id)} style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="rc-icon">{c.icon}</span>
                <span className="rc-category">{c.category}</span>
                <span className="rc-title">{c.title}</span>
                <span className="rc-summary">{c.summary}</span>
                <span className="rc-law">{c.law}</span>
                <span className="rc-open">Explore →</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="right-detail fade-up">
            <button className="btn btn-ghost" style={{ width: 'fit-content', marginBottom: 4 }} onClick={() => setSelected(null)}>
              <FiArrowLeft size={14} /> All Rights
            </button>

            <div className="right-detail-header">
              <span className="rdh-icon">{selected.icon}</span>
              <div>
                <div className="rdh-cat">{selected.category}</div>
                <h2 className="rdh-title">{selected.title}</h2>
                <div className="rdh-law">{selected.law}</div>
                <p className="rdh-summary">{selected.summary}</p>
              </div>
            </div>

            <div className="sections">
              {selected.sections?.map((s, i) => (
                <div key={i} className="sec-item">
                  <button className="sec-btn" onClick={() => toggle(i)}>
                    <div className="sec-btn-left">
                      <span className="sec-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="sec-title">{s.title}</span>
                    </div>
                    <FiChevronDown size={16} className={`sec-chevron ${open[i] ? 'open' : ''}`} />
                  </button>
                  {open[i] && (
                    <div className="sec-body">
                      <p className="sec-desc">{s.description}</p>
                      <div className="key-pts">
                        {s.keyPoints?.map((p, pi) => (
                          <div key={pi} className="key-pt">
                            <span className="key-pt-bullet" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rights-disc">
              <span>⚠️</span>
              <div>
                <strong style={{ color: 'var(--gold)' }}>Disclaimer:</strong> This information is for general educational purposes about Indian law. Laws may be amended. Always consult a qualified advocate for proceedings.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
