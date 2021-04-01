const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
// Khai báo query-string
const queryString = require('query-string')

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
  // Nếu như phương thức gửi lên là POST thì tự động thêm 2 trường createdAt, updatedAt
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  }
  // Nếu như phương thức gửi lên là PATCH thì tự động thêm trường updatedAt
  else if(req.method === 'PATCH')
  {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use('/api',router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})

router.render = (req, res) => {
  // Check GET with pagination
  // If yes, custom output
  const headers = res.getHeaders(); //Lấy ra các headers
  const totalCountHeader = headers['x-total-count']; //Lấy ra tiêu đề x-total-count trong headers
  if(req.method === 'GET' && totalCountHeader)
  {
    const queryParams = queryString.parse(req._parsedUrl.query);
    console.log(queryParams); //Khi ta gủi req paginate nó sẽ lấy ra 1 object có _limit và _page
    const result = {
      data: res.locals.data,
      pagination: {
        // Vì khi ta lấy dữ liệu thông qua queryParams về nó đều là kiểu string nên ta phải ép kiểu về số hết
        _page: Number.parseInt(queryParams._page) || 1, //Nếu trường _page không tồn tại thì gán giá trị cho trường _page là 1
        _limit: Number.parseInt(queryParams._limit) || 10, //Nếu trường _limit không tồn tại thì gán giá trị cho trường _limit là 10
        _totalRows: Number.parseInt(totalCountHeader),
      },
    };
    return res.jsonp(result);
  }


  // Otherwise, keep default behavior
  res.jsonp(res.locals.data); //Hiển thị ra dữ liệu bình thường như khi ta gọi http://localhost:3000/api/products/
}