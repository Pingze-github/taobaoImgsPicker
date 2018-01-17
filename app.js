
const express = require('express');

const imgsPicker = require('./imgsPicker');

const port = 669;

const app = express();

app.use(express.static('public'));

app.get('/pick', async (req, res) => {
  const text = req.query.key;
  const imgs = await imgsPicker(text);
  if (!imgs) return res.send({Code: 1, Msg: '解析失败', Data:{}})
  res.send({Code: 0, Msg: '解析成功', Data:{imgs}})
});

app.listen(port, () => {
  console.log('Server start @', port);
});
