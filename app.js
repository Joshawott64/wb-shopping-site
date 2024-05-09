import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import session from 'express-session';
import users from './users.json' assert { type: 'json' };
import stuffedAnimalData from './stuffed-animal-data.json' assert { type: 'json' };

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

function getAnimalDetails(animalId) {
  return stuffedAnimalData[animalId];
}

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/all-animals', (req, res) => {
  res.render('all-animals.html.njk', { animals: Object.values(stuffedAnimalData) });
});

app.get('/animal-details/:animalId', (req, res) => {
  const currentAnimal = getAnimalDetails(req.params.animalId)
  res.render('animal-details.html.njk', { animal:  currentAnimal });
});

app.get('/add-to-cart/:animalId', (req, res) => {
  // TODO: Finish add to cart functionality
  // The logic here should be something like:
  // - check if a "cart" exists in the session, and create one (an empty
  // object keyed to the string "cart") if not
  // - check if the desired animal id is in the cart, and if not, put it in
  // - increment the count for that animal id by 1
  // - redirect the user to the cart page
  const currentAnimal = req.params.animalId
  const sess = req.session

  if (!sess.cart) { // if req.session.cart does not exist
    sess.cart = {} // create cart
  }

  if (!(currentAnimal in sess.cart)) { // if currentAnimal is not in cart
    sess.cart[currentAnimal] = 0
  }
  sess.cart[currentAnimal] += 1

  res.redirect('/cart')
});

app.get('/cart', (req, res) => {
  // TODO: Display the contents of the shopping cart.

  // The logic here will be something like:

  // - get the cart object from the session
  // - create an array to hold the animals in the cart, and a variable to hold the total
  // cost of the order
  // - loop over the cart object, and for each animal id:
  //   - get the animal object by calling getAnimalDetails
  //   - compute the total cost for that type of animal
  //   - add this to the order total
  //   - add quantity and total cost as properties on the animal object
  //   - add the animal object to the array created above
  // - pass the total order cost and the array of animal objects to the template

  // Make sure your function can also handle the case where no cart has
  // been added to the session

  const cart = req.session.cart
  console.log('current cart:', cart)
  let cartArray = []
  let grandTotal = 0

  for (let animalId in cart) {
    console.log('current animalId: ', animalId)
    let currentAnimal = getAnimalDetails(animalId)
    console.log('currentAnimal: ', currentAnimal)

    currentAnimal.quantity = cart[animalId] 

    currentAnimal.totalCost = currentAnimal.quantity * currentAnimal.price

    grandTotal += currentAnimal.totalCost

    cartArray.push(currentAnimal)

    console.log('grand total: ', grandTotal)
    
  }
  req.session.cart = cart
  console.log('cartArray: ', cartArray)
 

  res.render('cart.html.njk', {grandTotal: grandTotal, cartArray: cartArray});
});

app.get('/checkout', (req, res) => {
  // Empty the cart.
  req.session.cart = {};
  res.redirect('/all-animals');
});

app.get('/login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.post('/process-login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
