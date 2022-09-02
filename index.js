const fs = require('fs');
const http = require('http');
const url = require('url');

const api = fs.readFileSync('./dev-data/data.json','utf-8');
const products = JSON.parse(api);
const overviewTemplate = fs.readFileSync('./templates/overview.html','utf-8');
const cardTemplate = fs.readFileSync('./templates/card.html','utf-8');
const productTemplate = fs.readFileSync('./templates/product.html','utf-8');

function render(html,data) {
    let content = html;
    for (const [key, value] of Object.entries(data)) {
        content = content.replaceAll(`{{${key}}}`,value);
    }
    return content;
}

const server = http.createServer((req,res) => {
    const path = req.url;
    const {pathname , query} = url.parse(path,true);
    if (pathname === '/' || pathname === '/overview') {
        const cards_html = products.map((item) => {
            item.not_organic = '';
            if (!item.organic) {
                item.not_organic = 'not-organic';
            }
            return render(cardTemplate,item);
        });
        const overviewTemplateView = render(overviewTemplate,{cards: cards_html});
        res.writeHead(200,{'Content-type':'text/html'});
        res.end(overviewTemplateView);
    }
    else if (pathname === '/product') {
        let item = products[query.id];
        item.not_organic = '';
        if (!item.organic) {
            item.not_organic = 'not-organic';
        }
        const productTemplateView = render(productTemplate,products[query.id]);
        res.writeHead(200,{'Content-type':'text/html'});
        res.end(productTemplateView);
    }
    else if (pathname === '/api') {
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(api);
    }
    else{
        res.writeHead(404,{'Content-type':'text/html'});
        res.end('<h1>Page not found</h1>');
    }
    
});

server.listen(3000,'127.0.0.1',() => {
    console.log('started')
});