import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';
import { searchGithub, searchGithubUser } from '../api/API';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>(() => {
    return JSON.parse(localStorage.getItem('savedCandidates') || '[]');
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchGithub();

        if (data.error) {
          setError(data.error);
        } else {
          const detailedCandidates = await Promise.all(
            data.map(async (candidate: Candidate) => {
              try {
                const details = await searchGithubUser(candidate.login);
                return { ...candidate, ...details };
              } catch (error) {
                console.error(`Error fetching details for ${candidate.login}:`, error);
                return candidate;
              }
            })
          );
          setCandidates(detailedCandidates);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to fetch candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleAcceptCandidate = () => {
    if (candidates[currentIndex]) {
      const updatedSavedCandidates = [...savedCandidates, candidates[currentIndex]];
      setSavedCandidates(updatedSavedCandidates);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedSavedCandidates));
    }
    handleNextCandidate();
  };

  const handleNextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCandidates([]);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (candidates.length === 0) return <p>No more candidates available.</p>;

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="candidate-search">
      <h1>Candidate Search</h1>

      <div className="candidate-card">
        <img src={currentCandidate.avatar_url} alt={currentCandidate.login} className="avatar" />
        <div className="candidate-info">
          <h3>{currentCandidate.name || currentCandidate.login}</h3>
          <p>{currentCandidate.company || 'No company available'}</p>
          <p>{currentCandidate.location || 'Location not provided'}</p>
          <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        </div>
      </div>

      <div className="buttons">
        <button onClick={handleNextCandidate}>-</button>
        <button onClick={handleAcceptCandidate}>+</button>
      </div>
    </div>
  );
};

export default CandidateSearch;