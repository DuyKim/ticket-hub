import axios from 'axios';

export default function client({ req }) {
  return axios.create({
    baseURL: 'https://ticketing-duykim.cloud.okteto.net',
    headers: req.headers,
  });
}
