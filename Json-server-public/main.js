const jsonServer = require('json-server')
const queryString = require('query-string');
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  }else if (req.method === 'PATCH' || req.method === 'PUT'){
    req.body.updatedAt = Date.now();
  }
  next()
})
router.render = (req, res) => {
  const headers = res.getHeaders();
  const totalCount = headers['x-total-count'];
  console.log(req)
  console.log(totalCount)
  if(req.originalMethod === 'GET' && totalCount){
    const queryParams = queryString.parse(req._parsedOriginalUrl.query);
    const result = {
      data: res.locals.data,
      pagination:{
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCount)
      }
    }
  return res.jsonp(result)
  }
  res.jsonp(res.locals.data)
}
// Use default router
server.use('/api',router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})