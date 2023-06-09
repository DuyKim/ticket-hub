import axios from 'axios';
import { useState } from 'react';

export default function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState([]);

  const doRequest = async () => {
    try {
      setErrors([]);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const errorComponent = errors.length > 0 && (
    <div className="alert alert-danger">
      <h4>Oops...</h4>
      <ul className="my-0">
        {errors.map((error) => (
          <li key={error.message}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
  return [errorComponent, doRequest];
}
