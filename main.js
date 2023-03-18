const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

let isInStock = function(){
  const url = 'https://mellowclimbing.com';
  axios.get(url)
  .then(response => {
    // Load the HTML of the page using Cheerio
    const $ = cheerio.load(response.data);
    const content = $('body').html();

    fs.readFile('/Users/ggrossman/Desktop/inStock/previous_version.html', 'utf8', (error, data) => {
      if (error) throw error;

      // Compare the current and previous versions of the website
      if (content !== data) {
        console.log('Website Updated!');
        openPage();
        // Save the current version of the website to a file
        fs.writeFile('previous_version.html', content, (error) => {
          if (error) throw error;
        });
      } else {
        console.log("Website hasn't changed");
        //sendEmail();
      }
    });
  })
  .catch(error => {
    console.log(error);
  });
}

let openPage = function(){
  (async () => {
    const browser = await puppeteer.launch({ 
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false 
    });
    const page = await browser.newPage();
    await page.goto('https://mellowclimbing.com/');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyT');
    await page.keyboard.up('Control');
  })();
}

let sendEmail = function(){
  // create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'aol',
    auth: {
      user: 'emailreminder618@aol.om',
      pass: 'reminderemailpassword618'
    }
  });

// setup email data with unicode symbols
let mailOptions = {
  from: '"Your Name" <your_email@gmail.com>', // sender address
  to: 'ggrossman@colgate.edu', // list of receivers
  subject: 'Test ✔', // Subject line
  text: 'Website updated!', // plain text body
  html: '<b>Hello world?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
});
}

isInStock();
setInterval(isInStock, 5000); // Time in milliseconds