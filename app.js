
const express = require('express');

const imgsPicker = require('./imgsPicker');

const port = 669;

const app = express();

app.use(express.static('public'));

app.get('/pick', async (req, res) => {
  const text = req.query.key;
  const start = Date.now();
  console.log('开始解析', new Date().toLocaleString());
  const imgs = await imgsPicker(text);
  console.log('完成解析，耗时', Date.now() - start, new Date().toLocaleString());
  if (!imgs) return res.send({Code: 1, Msg: '解析失败', Data:{}})
  res.send({Code: 0, Msg: '解析成功', Data:{imgs}})
});

app.listen(port, () => {
  console.log('Server start @', port);
});
