import useRequest from '@/hooks/use-request';
import { Router } from 'next/router';
import { useState } from 'react';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState();

  const [errorComponent, doRequest] = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  const onBlurHandler = (e) => {
    const value = parseFloat(price);
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            onBlur={onBlurHandler}
            name="price"
            className="form-control"
          />
        </div>
        {errorComponent}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
