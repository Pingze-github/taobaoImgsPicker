
const request = require('request');
const cheerio = require('cheerio');


module.exports = main;

if (!module.parent) {
  const text = 'http://www.dwntme.com/h.ZZswHZI';
  main(text);
}

async function main(text) {
  let url;
  if (text.includes('点击链接，再选择浏览器打开')) {
    url = parseUrlFromText(text);
    if (!url) return console.warn('Can not parse short url from text');
  }
  else url = text;
  return await getImgsFromUrl(url)
}

function parseUrlFromText(text) {
  const matches = text.match(/(http:.+) /);
  if (matches) return matches[1]
}

async function getImgsFromUrl(url) {
  if (url.includes('www.dwntme.com')) {
    url = await getRealUrl(url);
    if (!url) return console.warn('Can not find the main Url');
  }
  const descUrl = await getDescUrl(url);
  if (!descUrl) return console.warn('Can not find descUrl');
  const imgs = await getDescImgs(descUrl);
  if (!imgs) return console.warn('Can not find imgs');
  return imgs;
}

async function getDescImgs(url) {
  const html = await requestP(url);
  const $ = cheerio.load(html);
  const imgs = [];
  $('img').each((i, ele) => {
    imgs.push($(ele).attr('src'));
  });
  return imgs;
}

async function getDescUrl(url) {
  const html = await requestP(url);
  const matches = html.match(/location\.protocol==='http:' \? '(.+?)'/);
  if (matches) return 'http:' + matches[1];
}

async function getRealUrl(url) {
  const html = await requestP(url);
  const matches = html.match(/url = '(.+?)';/);
  if (matches) return matches[1];
}

async function requestP(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, res) => {
      if (err) return reject(err);
      resolve(res.body);
    })
  });
}


