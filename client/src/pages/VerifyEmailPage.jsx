import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyEmailPage = () => {
  const {token}  = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          const response = await axios.get(`http://localhost:4000/api/auth/verify/${token}`);
          setMessage(response.data.msg);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch (error) {
          setMessage('Error verifying email. Please try again.');
        }
      } else {
        setMessage('Invalid verification link.');
      }
    };

    verifyEmail();
  }, [token,navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );

};

export default VerifyEmailPage;
