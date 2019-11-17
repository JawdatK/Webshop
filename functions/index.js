const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

exports.firestoreEmail = functions.firestore
    .document('users/{userId}/orders/{orderId}') 
    .onCreate((snap, context)=> {

        const userId = context.params.userId;
        const createdData = snap.data(); // data that was created
        
        const db = admin.firestore()

        return db.collection('users').doc(userId)
                 .get()
                 .then(doc => {

                    const user = doc.data()

                    const msg1 = {
                        to: user.email,
                        from: 'webshopemailservice@gmail.com',
                        //subject:  'WebShop Order confirmation',
                        // text: `Hey ${toName}. You have a new follower!!! `,
                        // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,
            
                        // custom templates
                        templateId: '4d0cd37e-c2bb-48fc-9504-f77f89deabb5', // sendgrid template id
                        substitutionWrappers: ['{{', '}}'],
                        substitutions: {
                        name: createdData.deliveryAddress.firstName + " " + createdData.deliveryAddress.lastName,
                        orderNum: context.params.orderId, 
                        orderDate: createdData.date,
                        street: createdData.deliveryAddress.street,
                        zip: createdData.deliveryAddress.zip,
                        city: createdData.deliveryAddress.city,
                        email: user.email,
                        phoneNum: createdData.deliveryAddress.phone,
                        totalItems: createdData.totalQuantity,
                        totalPrice: createdData.totalPrice,
                        orderUrl: "https://dv508-team-3.firebaseapp.com/view-orders/" + createdData.id,
                        //and other custom properties here
                        }
                    };

                    const msg2 = {
                        to: user.email,
                        from: 'webshopemailservice@gmail.com',
                        //subject:  'WebShop Order status',
                        // text: `Hey ${toName}. You have a new follower!!! `,
                        // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,
            
                        // custom templates
                        templateId: 'd8df9699-c848-490f-9a5e-39d314271d8a', 
                        substitutionWrappers: ['{{', '}}'],
                        substitutions: {
                        name: createdData.deliveryAddress.firstName + " " + createdData.deliveryAddress.lastName,
                        // and other custom properties here
                        }
                    };

                    return sgMail.send(msg1) && sgMail.send(msg2)
                })
                .then(() => console.log('email sent!') )
                .catch(err => console.log(err) )
                     

});