import buildClient from '@/api/build-client';
import useRequest from '@/hooks/use-request';
import { Router } from 'next/router';
import { useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [errorComponent, doRequest] = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired!</div>;
  }

  return (
    <div>
      <p>Time left to pay: {msLeft} seconds</p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51NAuhnLTrkqQD856STNCM5EudKDpxKGll2N5oizidAWxkDq3IJiEQyersbzPwMKZrUW7Lmi8sI78qMqa7GZXEXHC00xqYlwNqS"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errorComponent}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { orderId } = context.query;
  const client = buildClient(context);
  const { data } = client.get(`/api/orders/${orderId}`);

  return { props: { order: data } };
}
