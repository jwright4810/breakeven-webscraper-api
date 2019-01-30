const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document; 

const Nightmare = require('nightmare');
      nightmare = Nightmare();
const app = express(); 
app.use(bodyParser.json()); 
app.use(cors()); 

let $ = jQuery = require('jquery')(window); 

let futPrices = {};




app.get('/', (req, res) => {
    (function () {
        nightmare.goto('https://www.cmegroup.com/trading/agricultural/livestock/feeder-cattle_quotes_globex.html')
        .wait(2000)
        .evaluate(function(){
    
            const futObj = {}; 
            
            let rows = document.getElementById('quotesFuturesProductTable1').rows;
            
            for(let i = 1; i < rows.length; i++) {
               futObj[rows[i].cells[1].innerText] = rows[i].cells[3].innerText;  
            }
            
            return futObj; 
        })
        .end()
        .then(result => {
            for(let props in result) {
                futPrices[props] = result[props]; 
            }
            res.json('scraper executed')
        })
        .catch(err => console.log(err))
    })(); 
})  


app.get('/setprices', (req, res) => {
    res.json(futPrices)
})



app.listen(process.env.PORT || 3000, () => {
    console.log('app is running on port 3000'); 
})
                     
// app.listen( 3001, () => {
//     console.log('app is running on port 3000'); 
// })
    


