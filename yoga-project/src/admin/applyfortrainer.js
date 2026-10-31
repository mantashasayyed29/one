function ApplyForTrainer({ onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const resume = formData.get('resume');

    onSubmit({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      qualification: formData.get('qualification'),
      resume: resume instanceof File ? resume.name : '',
    });
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <h1>Apply for Trainer</h1>
      <label>
        Full name
        <input name="name" type="text" autoComplete="name" required />
      </label>

      <label>
        Email address
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        Phone number
        <input name="phone" type="tel" autoComplete="tel" />
      </label>

      <label>
        Qualification
        <input
          name="qualification"
          type="text"
          placeholder="Enter your qualifications"
          required
        />
      </label>

      <label>
        Resume
        <input
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          required
        />
      </label>

      <div className="form-actions">
        <button type="submit">Submit application</button>
        <a className="apply-link" href="/">
          Back to home
        </a>
      </div>
    </form>
  );
}

export default ApplyForTrainer;
