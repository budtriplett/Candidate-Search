import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchSavedCandidates = () => {
      const storedCandidates = localStorage.getItem('savedCandidates');
      if (storedCandidates) {
        setSavedCandidates(JSON.parse(storedCandidates)); 
      }
    };
    fetchSavedCandidates();
  }, []);

  const handleRemoveCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== id);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  return (
    <div className="kanban-board">
      <h1>Potential Candidates</h1>

      <div className="kanban-column">
        <div className="candidate-list">
          {savedCandidates.length === 0 ? (
            <p>No saved candidates found.</p>
          ) : (
            savedCandidates.map((candidate) => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-columns">
                  <div className="candidate-column">
                    <h3>Avatar</h3>
                    <img src={candidate.avatar_url} alt={candidate.login} className="avatar" />
                  </div>
                  <div className="candidate-column">
                    <h3>Name</h3>
                    <p>{candidate.name || candidate.login}</p>
                  </div>
                  <div className="candidate-column">
                    <h3>Location</h3>
                    <p>{candidate.location || 'Location not provided'}</p>
                  </div>
                  <div className="candidate-column">
                    <h3>Email</h3>
                    <p>{candidate.email || 'Email not provided'}</p>
                  </div>
                  <div className="candidate-column">
                    <h3>Company</h3>
                    <p>{candidate.company || 'No company available'}</p>
                  </div>
                  <div className="candidate-column">
                    <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                      View Profile
                    </a>
                  </div>
                  <div className="candidate-column">
                    <button onClick={() => handleRemoveCandidate(candidate.id)} className="remove-btn">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedCandidates;
