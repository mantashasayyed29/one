import { useState } from 'react';

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatClassDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function TrainerSelection({
  profile,
  selectedTrainer,
  onSelectTrainer,
  onBack,
}) {
  const [dateError, setDateError] = useState('');
  const isSelected = selectedTrainer?.email === profile.email;
  const completedClassDates = selectedTrainer?.completedClassDates || [];

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onSelectTrainer({
      ...profile,
      studentMeetingUrl: formData.get('studentMeetingUrl'),
      completedClassDates: [],
    });
  }

  function handleClassDateSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const classDate = formData.get('classDate');
    const today = getLocalDateString(new Date());

    if (typeof classDate !== 'string' || !classDate || classDate > today) {
      setDateError('Enter a class date that is today or earlier.');
      return;
    }

    if (completedClassDates.includes(classDate)) {
      setDateError('This class date has already been added.');
      return;
    }

    setDateError('');
    onSelectTrainer({
      ...selectedTrainer,
      completedClassDates: [...completedClassDates, classDate].sort(),
    });
    form.reset();
  }

  return (
    <section className="admin-trainer-page">
      <p className="home-eyebrow">Admin · Trainer review</p>
      <h1>Trainer selection</h1>
      <p className="admin-trainer-intro">
        Review the applicant after the Zoom interview. Selecting them here is a
        frontend-only confirmation; email invitations and dashboard access will
        be connected when the backend is ready.
      </p>

      <section className="profile-details" aria-label="Applicant details">
        <h2>Applicant details</h2>
        <p>
          <strong>Full name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email address:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone number:</strong> {profile.phone || 'Not provided'}
        </p>
        <p>
          <strong>Qualification:</strong> {profile.qualification}
        </p>
        <p>
          <strong>Resume:</strong> {profile.resume}
        </p>
        <p>
          <strong>Selection status:</strong>{' '}
          {isSelected ? 'Selected as trainer' : 'Awaiting interview decision'}
        </p>
      </section>

      {isSelected ? (
        <>
          <p className="trainer-selection-success" role="status">
            {profile.name} has been selected as a trainer. The meeting link and
            completed class dates are saved for this page session.
          </p>
          <p>
            <strong>Student session meeting:</strong>{' '}
            <a
              href={selectedTrainer.studentMeetingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open meeting link
            </a>
          </p>
          <section className="completed-classes" aria-labelledby="completed-classes-heading">
            <h2 id="completed-classes-heading">
              Completed classes ({completedClassDates.length})
            </h2>
            {completedClassDates.length > 0 ? (
              <ul className="completed-class-list">
                {completedClassDates.map((classDate) => (
                  <li key={classDate}>{formatClassDate(classDate)}</li>
                ))}
              </ul>
            ) : (
              <p>No completed classes have been added yet.</p>
            )}
          </section>
          <form
            className="application-form admin-trainer-form"
            onSubmit={handleClassDateSubmit}
          >
            <h2>Record a completed class</h2>
            <label>
              Class date
              <input
                name="classDate"
                type="date"
                max={getLocalDateString(new Date())}
                required
                onChange={() => setDateError('')}
              />
            </label>
            {dateError && (
              <p className="admin-trainer-error" role="alert">
                {dateError}
              </p>
            )}
            <button type="submit">Add completed class date</button>
          </form>
        </>
      ) : (
        <form className="application-form admin-trainer-form" onSubmit={handleSubmit}>
          <h2>Confirm trainer selection</h2>
          <label className="interview-clear-check">
            <input name="interviewCleared" type="checkbox" required />
            Zoom interview successfully cleared
          </label>

          <label>
            Student session meeting link
            <input
              name="studentMeetingUrl"
              type="url"
              placeholder="https://zoom.us/j/..."
              pattern="https?://.*"
              title="Enter a meeting link beginning with http:// or https://."
              required
            />
          </label>

          <p className="admin-trainer-note">
            This demo saves the selection only in the current page session. It
            does not send an email, create login credentials, or create a Zoom
            meeting.
          </p>
          <button type="submit">Select as trainer</button>
        </form>
      )}
      <button
        className="admin-review-button"
        type="button"
        onClick={onBack}
      >
        Back to application details
      </button>
    </section>
  );
}

export default TrainerSelection;
