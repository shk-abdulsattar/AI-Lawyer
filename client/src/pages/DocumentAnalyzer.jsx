import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { FiUpload, FiFileText, FiAlertCircle, FiCheckCircle, FiX, FiZap } from 'react-icons/fi';
import './DocumentAnalyzer.css';

export default function DocumentAnalyzer() {
  const [file, setFile]         = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [pasteText, setPaste]   = useState('');
  const [mode, setMode]         = useState('upload');

  const onDrop = useCallback((files) => {
    if (files.length > 0) { setFile(files[0]); setError(null); setAnalysis(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1, maxSize: 10 * 1024 * 1024
  });

  const analyseFile = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    const form = new FormData();
    form.append('document', file);
    try {
      const r = await axios.post('/api/documents/analyze', form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
      setAnalysis(r.data);
    } catch (e) { setError(e.response?.data?.error || 'Analysis failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const analyseText = async () => {
    if (!pasteText.trim()) return;
    setLoading(true); setError(null);
    try {
      const r = await axios.post('/api/documents/analyze-text', { text: pasteText, fileName: 'Pasted Document' });
      setAnalysis(r.data);
    } catch (e) { setError(e.response?.data?.error || 'Analysis failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const fmt = (b) => b < 1024 ? `${b} B` : b < 1024*1024 ? `${(b/1024).toFixed(1)} KB` : `${(b/1024/1024).toFixed(1)} MB`;

  return (
    <div className="doc-page">
      <div className="container">
        <div className="page-head fade-up">
          <div className="page-head-icon"><FiFileText size={24} /></div>
          <div>
            <h1 className="page-head-title">Check Legal<br />Documents</h1>
            <p className="page-head-desc">Upload or paste any agreement or notice to get a simple summary and check for hidden risks in easy English.</p>
          </div>
        </div>

        {!analysis ? (
          <div className="doc-layout">
            <div className="mode-switch fade-up">
              <button className={`mode-opt ${mode === 'upload' ? 'active' : ''}`} onClick={() => setMode('upload')}>
                <FiUpload size={13} /> Upload File
              </button>
              <button className={`mode-opt ${mode === 'paste' ? 'active' : ''}`} onClick={() => setMode('paste')}>
                <FiFileText size={13} /> Paste Text
              </button>
            </div>

            {mode === 'upload' ? (
              <>
                <div {...getRootProps()} className={`dropzone fade-up ${isDragActive ? 'dragging' : ''} ${file ? 'has-file' : ''}`}>
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="file-prev">
                      <span className="file-prev-icon">📄</span>
                      <div>
                        <div className="file-prev-name">{file.name}</div>
                        <div className="file-prev-size">{fmt(file.size)}</div>
                      </div>
                      <button className="file-remove" onClick={e => { e.stopPropagation(); setFile(null); }}>
                        <FiX size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="dz-inner">
                      <span className="dz-icon"><FiUpload size={36} /></span>
                      <h3>{isDragActive ? 'Drop file here' : 'Drag & Drop Legal Document'}</h3>
                      <p>or click to browse</p>
                      <div className="dz-formats">
                        {['PDF', 'TXT', 'DOC', 'DOCX'].map(f => <span key={f} className="dz-fmt">{f}</span>)}
                      </div>
                      <div className="dz-size">Max 10 MB</div>
                    </div>
                  )}
                </div>
                {file && (
                  <button className="btn btn-primary analyse-btn" onClick={analyseFile} disabled={loading}>
                    {loading ? <><div className="spinner" /> Analysing…</> : <><FiZap size={14} /> Analyse Document</>}
                  </button>
                )}
              </>
            ) : (
              <>
                <textarea
                  className="paste-box fade-up"
                  value={pasteText}
                  onChange={e => setPaste(e.target.value)}
                  placeholder={"Paste the legal document text here…\n\n(e.g., rental agreement, legal notice, FIR copy, contract terms)"}
                  rows={13}
                />
                {pasteText.trim() && (
                  <button className="btn btn-primary analyse-btn" onClick={analyseText} disabled={loading}>
                    {loading ? <><div className="spinner" /> Analysing…</> : <><FiZap size={14} /> Analyse Text</>}
                  </button>
                )}
              </>
            )}

            {error && (
              <div className="err-box fade-in"><FiAlertCircle size={16} />{error}</div>
            )}

            <div className="doc-types fade-up">
              <div className="doc-types-label">Documents we analyse</div>
              <div className="doc-types-grid">
                {[
                  ['📜','Rental / Lease Agreements'],['⚖️','Legal Notices'],
                  ['🚨','FIR Copies'],['📋','Employment Contracts'],
                  ['🏠','Sale Deeds & Property Docs'],['💼','Business Agreements'],
                  ['📑','Court Orders & Judgments'],['🏦','Loan & Finance Documents'],
                ].map(([e, l], i) => (
                  <div key={i} className="dt-item">
                    <span className="dt-emoji">{e}</span><span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="result-wrap fade-up">
            <div className="result-meta">
              <div className="result-meta-left">
                <FiCheckCircle size={22} className="result-ok" />
                <div>
                  <div className="result-filename">{analysis.fileName}</div>
                  <div className="result-when">Analysed · {new Date(analysis.analyzedAt).toLocaleString('en-IN')}</div>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => { setAnalysis(null); setFile(null); setPaste(''); }}>
                <FiX size={13} /> Analyse Another
              </button>
            </div>
            <div className="result-body">
              <div className="md"><ReactMarkdown>{analysis.analysis}</ReactMarkdown></div>
            </div>
            <div className="result-notice">
              This analysis is AI-generated for informational purposes only. For legal proceedings, consult a qualified advocate.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
