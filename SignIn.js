import React, { useState } from 'react';
import axios from 'axios';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signin', formData);
      alert(response.data.message);
      localStorage.setItem('token', response.data.token);
    } catch (err) {
      alert('Error: ' + err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
