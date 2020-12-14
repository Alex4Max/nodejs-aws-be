import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cache from './cache.js';

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.all('/*', (req, res) => {
  const { originalUrl, method, body } = req;

  console.log('originalUrl: ', originalUrl);
  console.log('method: ', method);
  console.log('body: ', body);

  const recipient = originalUrl.split('/')[1];
  console.log('recipient: ', recipient);

  const urlPath = originalUrl.split('/')[2] ? `${originalUrl}` : '';

  const recipientURL = process.env[recipient];
  if(recipientURL) {
    const axiosConfig = {
      method,
      url: `${recipientURL}${urlPath}`,
      ...(Object.keys(body || {}).length > 0 && { data: body }),
    };
    console.log('axiosConfig: ', axiosConfig);

    const cachedData = cache.get(recipientURL);
    if (cachedData) {
      console.log('Data from cache: ', cachedData);
      res.json(cachedData);
    } else {
      axios(axiosConfig)
        .then(({ data }) => {
          console.log('Data from recipient: ', data);
          cache.put(recipientURL, data, 2 * 60 * 1000);

          res.json(data);
        })
        .catch((error) => {
          console.log('Error occurred: ', JSON.stringify(error));
          if (error.response) {
            const { status, data } = error.response;
            res.status(status).json(data);
          } else {
            res.status(502).json({ error: 'Something goes wrong. Sorry' });
          }
        });
    }
  } else {
    res.status(502).json({ error: `The BFF service is not aware of this URL ${originalUrl}` });
  }
});

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
