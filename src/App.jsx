import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { getCandidateByEmail, getJobsList, applyToJob } from './services/api'
import './App.css'

function App() {
  const EMAIL = 'EMAIL';

  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [repoUrls, setRepoUrls] = useState({});
  const [statuses, setStatuses] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const cand = await getCandidateByEmail(EMAIL);
        setCandidate(cand);
        const jobsData = await getJobsList();
        setJobs(jobsData);
      } catch (err) {
        setGlobalError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleUrlChange = (jobId, value) => {
    setRepoUrls(prev => ({ ...prev, [jobId]: value.trim() }));
    if (statuses[jobId] === 'error') {
      setStatuses(prev => ({ ...prev, [jobId]: 'idle' }));
    }
  };

  const handleApply = async (jobId) => {
    const url = repoUrls[jobId] || '';

    if (!url) {
      setStatuses(prev => ({ ...prev, [jobId]: 'error' }));
      setGlobalError('Por favor ingresa la URL de tu repositorio');
      return;
    }

    if (!url.includes('github.com')) {
      setStatuses(prev => ({ ...prev, [jobId]: 'error' }));
      setGlobalError('La URL debe ser un repositorio válido de GitHub');
      return;
    }

    setStatuses(prev => ({ ...prev, [jobId]: 'loading' }));
    setGlobalError(null);

    try {
      await applyToJob({
        uuid: candidate.uuid,
        candidateId: candidate.candidateId,
        jobId,
        repoUrl: url,
      });
      setStatuses(prev => ({ ...prev, [jobId]: 'success' }));
    } catch (err) {
      setStatuses(prev => ({ ...prev, [jobId]: 'error' }));
      setGlobalError(err.message || 'Error al enviar la postulación');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="container">
      <div className="header">
        <img
          src={reactLogo}
          alt="React Logo"
          className="react-logo"
        />
      </div>
      <h1>Posiciones abiertas - Nimble Gravity</h1>

      {globalError && <div className="error">{globalError}</div>}

      <ul className="job-list">
        {jobs.map(job => {
          const status = statuses[job.id] || 'idle';
          const url = repoUrls[job.id] || '';

          return (
            <li key={job.id} className="job-item">
              <div className="job-info">
                <strong>{job.title}</strong>
              </div>

              <div className="job-apply">
                <input
                  type="url"
                  value={url}
                  onChange={e => handleUrlChange(job.id, e.target.value)}
                  placeholder="https://github.com/..."
                  disabled={status === 'success'}
                />

                <button
                  onClick={() => handleApply(job.id)}
                  disabled={status === 'loading' || status === 'success' || !candidate || !url}
                >
                  {status === 'loading' ? 'Enviando...' :
                    status === 'success' ? '¡Listo!' :
                      status === 'error' ? 'Reintentar' : 'Postularme'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {jobs.length === 0 && <p>No hay posiciones disponibles.</p>}
    </div>
  );
}

export default App;