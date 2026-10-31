import { useEffect, useState } from 'react';
import './App.css';
import ApplyForTrainer from './admin/applyfortrainer';
import TrainerSelection from './admin/trainer';
import TrainerProfile from './admin/trainerprojil';

function App() {
  const [page, setPage] = useState(window.location.pathname);
  const [profile, setProfile] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    function handlePopState() {
      setPage(window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigateTo(path) {
    window.history.pushState(null, '', path);
    setPage(path);
  }

  function handleApplicationSubmit(details) {
    setProfile(details);
    setSelectedTrainer(null);
    navigateTo('/profile');
  }

  return (
    <main className="App">
      <div className="brand-name">YOGA AURA</div>
      {page === '/apply' ? (
        <ApplyForTrainer onSubmit={handleApplicationSubmit} />
      ) : page === '/admin/trainer' ? (
        profile ? (
          <TrainerSelection
            profile={profile}
            selectedTrainer={selectedTrainer}
            onSelectTrainer={setSelectedTrainer}
            onBack={() => navigateTo('/profile')}
          />
        ) : (
          <section className="profile-details">
            <h1>No applicant to review</h1>
            <p>Submit a trainer application before opening the admin review.</p>
            <a className="apply-link" href="/">
              Back to home
            </a>
          </section>
        )
      ) : page === '/profile' && profile ? (
        <TrainerProfile
          profile={profile}
          onOpenTrainerReview={() => navigateTo('/admin/trainer')}
        />
      ) : page === '/profile' ? (
        <p>No application details found. Please submit the form first.</p>
      ) : (
        <>
        <section className="home-hero">
          <div className="home-copy">
            <p className="home-eyebrow">A mindful community for teachers</p>
            <h1>Teach with presence. Grow with purpose.</h1>
            <p className="home-description">
              Bring your practice to a community that believes in thoughtful
              movement, steady growth, and making space for everyone.
            </p>
            <a className="apply-link home-apply-link" href="#trainer-application">
              Apply as a trainer <span aria-hidden="true">&rarr;</span>
            </a>
            <p className="home-note">A calmer way to share what you love.</p>
          </div>
          <div className="home-visual">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=85"
              alt="A yoga teacher practicing in a quiet studio"
            />
            <span className="image-caption">BREATHE · MOVE · BELONG</span>
          </div>
        </section>
        <section className="home-application" id="trainer-application">
          <p className="home-eyebrow">Start your journey with us</p>
          <ApplyForTrainer onSubmit={handleApplicationSubmit} />
        </section>
        </>
      )}
    </main>
  );
}

export default App;
