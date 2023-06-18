import buildClient from '@/api/build-client';

export default function OrderIndex({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
}

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get('/api/orders');

  return { props: { orders: data } };
}
