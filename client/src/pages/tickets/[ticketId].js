import useRequest from '@/hooks/use-request';
import { Router } from 'next/router';

export default function Ticket({ ticket }) {
  const [errorComponent, doRequest] = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errorComponent}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { ticketId } = context.query;
  const client = buildClient(context);
  const { data } = await client.get('/api/tickets/${ticketId}');

  return { props: { ticket: data } };
}
