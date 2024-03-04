// Import necessary modules and set up your server (e.g., using Express)
const express = require('express'); // Import the Express framework
const sgMail = require('@sendgrid/mail'); // Import the SendGrid library for sending emails
const app = express(); // Create an Express application
const port = 5000; // Define the port number for the server
require('dotenv').config(); // Load environment variables from a .env file
const cors = require('cors'); // Import the CORS middleware for handling cross-origin requests
const sendGridApiKey = process.env.SENDGRID_API_KEY
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
}));
// Set up SendGrid API key
sgMail.setApiKey(sendGridApiKey);

// Set the Referrer-Policy header to "no-referrer"
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// Parse JSON bodies
app.use(express.json());

// Define a route to handle GET requests
app.get('/', (req, res) => {
    res.send('get request is working'); // Send a response indicating that the server is running
});


// Endpoint to send email
app.post('/send-order-confirmation-email', async (req, res) => {
    // console.log("logged in post request", req.body) 
    const { fullName, userEmail, orderID, orderArray,amountLeftToPay } = req.body;
    // console.log(fullName, userEmail, orderID, orderObject, amountPaid)
    // console.log("req.body: ", req.body)

    
    function splitName(fullName) {
        // Split the input string by space
        const parts = fullName.split(' ');
        
        // Return the second part (index 1)
        return parts.length > 1 ? parts[1] : " ";
    }
     function formatNumberWithCommas(value) {
        // Check if value is defined and not null
        if (value !== undefined && value !== null) {
            // Convert the number to a string
            let numberString = value.toString();

            // Use a regular expression to add commas
            numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return numberString;
        }

        // Return a default value or handle the case when value is undefined or null
        return "N/A";
    }

    console.log("an attempt was made to post a request ", req.body)
    try {
  
    
    const emailTemplate = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You just made a payment to Afritech for order <b>#${orderID}</b></title>
    </head>
    <body id="email-template">
        <p class="email-p">
            Hello <b>${splitName(fullName)}</b>, <br>
            You just checked out <b>#${orderID}</b> totaling <b>₦${formatNumberWithCommas(amountLeftToPay)}</b> on Afritech 
        </p>
    
        <h4>Here is your order breakdown:</h4>
        <div className="email-product-list">
            ${orderArray.map((item) => {
                return `
                    <div class="email-product">
                        <div class="email-product-image">
                            <img src="${item.imageGalleryImages[0].imageURL}" class="" width="70" height="70" alt="product image"/>
                        </div>
                        <div class="email-product-title">
                            <h3 class="">${item.name} - ₦${formatNumberWithCommas(item.price)}</h3>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <p>Regards,</p>
        <p>Afritech Team</p>
    </body>
    </html>
    `;
     
        const msg = {
            to: userEmail,
            from: 'afritech19@gmail.com',
            subject: 'You just checked out an order on Afritech',
            text: 'and easy to do anywhere, even with Node.js',
            html:  emailTemplate,
        };
     
        // Send email using SendGrid
        sgMail.send(msg)
            .then(() => {
                console.log('Email sent')
                console.log(msg)
            })
            .catch((error) => {
                console.error(error)
            })
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error sending email:', error.message, error);
        res.status(500).send('Error sending email');
    }
});

app.post('/send-email', async (req, res) => {
    // console.log("logged in post request", req.body) 
    const { fullName, userEmail, orderID, orderObject, amountPaid, transactionNumber, reference, amountLeftToPay } = req.body;
    // console.log(fullName, userEmail, orderID, orderObject, amountPaid)
    console.log("fullname: ", fullName)
console.log("amountLeftToPay - amountPaid: " + eval(orderObject?.leftToPay - amountPaid))
    
    function splitName(fullName) {
        // Split the input string by space
        const parts = fullName.split(' ');
        
        // Return the second part (index 1)
        return parts.length > 1 ? parts[1] : " ";
    }
     function formatNumberWithCommas(value) {
        // Check if value is defined and not null
        if (value !== undefined && value !== null) {
            // Convert the number to a string
            let numberString = value.toString();

            // Use a regular expression to add commas
            numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return numberString;
        }

        // Return a default value or handle the case when value is undefined or null
        return "N/A";
    }

    console.log("an attempt was made to post a request ", req.body)
    try {
  
        const emailTemplateComplete = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You just made a payment to Afritech for order <b>#${orderID}</b></title>
</head>
<body id="email-template">
    <p class="email-p"> 
        Hello <b>${splitName(fullName)}</b>, <br> 
        You just completed your payment for order number <b>#${orderID}</b> 
        <br> Totaling: ₦${formatNumberWithCommas(orderObject.leftToPay)}  
        <br> With transaction number: <b>#${transactionNumber}</b> 
        <br> And transaction reference: <b>#${reference}</b>
    </p>

    <h4>Here is your order breakdown:</h4>
    <div class="email-product-list">
        ${orderObject?.orderProducts?.map((item) => {
            return `
                <div class="email-product">
                    <div class="email-product-image">
                        <img src="${item.imageGalleryImages[0].imageURL}" class="" width="70" height="70" alt="product image"/>
                    </div>
                    <div class="email-product-title">
                        <h3 class="">${item.name} - ₦${formatNumberWithCommas(item.price)}</h3>
                    </div>
                </div>
            `;
        }).join('')}
    </div>

    <p>Regards,</p>
    <p>Afritech Team</p>
</body>
</html>`;
    const emailTemplate = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You just made a payment to Afritech for order <b>#${orderID}</b></title>
    </head>
    <body id="email-template">
        <p class="email-p">
            Hello <b>${splitName(fullName)}</b>, <br>
            You just made a payment of <b>₦${formatNumberWithCommas(amountPaid)}</b> to Afritech for order <b>#${orderID}</b> with transaction numbered: <b>#${transactionNumber}</b> with the transaction reference: <b>#${reference}</b>
        </p>
    
        <h4>Here is your order breakdown:</h4>
        <div className="email-product-list">
            ${orderObject?.orderProducts?.map((item) => {
                return `
                    <div class="email-product">
                        <div class="email-product-image">
                            <img src="${item.imageGalleryImages[0].imageURL}" class="" width="70" height="70" alt="product image"/>
                        </div>
                        <div class="email-product-title">
                            <h3 class="">${item.name} - ₦${formatNumberWithCommas(item.price)}</h3>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    
        <h3>Outstanding balance: ₦${formatNumberWithCommas(orderObject.leftToPay - amountPaid)}</h3>
    
        <p>Regards,</p>
        <p>Afritech Team</p>
    </body>
    </html>
    `;
     
        const msg = {
            to: userEmail,
            from: 'afritech19@gmail.com',
            subject: 'You just made payment on Afritech',
            text: 'and easy to do anywhere, even with Node.js',
            html: (eval(orderObject?.leftToPay - amountPaid == 0)) ? emailTemplateComplete : emailTemplate,
        };
     
        // Send email using SendGrid
        sgMail.send(msg)
            .then(() => {
                console.log('Email sent')
                console.log(msg)
            })
            .catch((error) => {
                console.error(error)
            })
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error sending email:', error.message, error);
        res.status(500).send('Error sending email');
    }
});

app.post('/send-verify-user-account', async (req, res) => {

    try {
  
    
    const emailTemplate = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>A new User Just Registered on Afritech</title>
    </head>
    <body id="email-template">
        <p>Hooray!!! we just got a new user. Hurry up and verify their credentials</p>
    </body>
    </html>
    `;
     
        const msg = {
            to: "afritech19@gmail.com",
            from: 'afritech19@gmail.com',
            subject: 'A new User Just Registered on Afritech',
            text: 'and easy to do anywhere, even with Node.js',
            html:  emailTemplate,
        };
     
        // Send email using SendGrid
        sgMail.send(msg)
            .then(() => {
                console.log('Email sent')
                console.log(msg)
            })
            .catch((error) => {
                console.error(error)
            })
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error sending email:', error.message, error);
        res.status(500).send('Error sending email');
    }
});
// Start the server
app.listen(port, () => {
    console.log(`You are running on port ${port}`);
})