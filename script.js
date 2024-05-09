var cartArray = JSON.parse(localStorage.getItem('cartArray')) || [];

const getData = async (userInput) => {
  const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${userInput}=1&country=IN&category_id=aps`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'ca018f4c75mshd6fd5a64e1318d2p12b45ajsn0b5e62393f33', 'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const mainData = result.data.products;
    console.log(mainData);
    mainData.map((val, index) => {
      renderContent(val, index);
    });

  }
  catch (error) {
    console.error(error);
  }
}

let seachBtn = document.querySelector('#searchBtn');

seachBtn.addEventListener('click', () => {
  let inputValue = document.querySelector('.inputValue').value;
  console.log(inputValue)
  getData(inputValue);
})

let asin = [];
function renderContent(val, index) {
  asin.push(val.asin);
  document.querySelector('#products').innerHTML += `<div class="col-lg-3 col-md-4 col-sm-6 my-4 d-flex justify-content-center">
      <div class="card" style="width:18rem;">
          <img src="${val.product_photo}" class="card-img-top p-2" height="290px" alt="...">
          <div class="card-body">
          <h5 class="card-title">${val.product_title}</h5>
          <p class="card-text">${val.delivery}</p>
          <a href="${val.product_url}" class="btn btn-primary">Buy Now</a>
          <button onclick="productDetails(${index})" class="btn btn-outline-primary">Click Me</button>
          </div>
      </div>
      <div>`
}

// accessing asin and redirect to product page

function productDetails(index) {
  console.log(asin[index]);
  localStorage.setItem('asin', asin[index]);
  window.location.href = "productInfo.html";
}



// Showing product details on the product page
var productsInfo;
async function loadProductData() {
  let asin = localStorage.getItem('asin')
  const url = `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${asin}&country=IN`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'ca018f4c75mshd6fd5a64e1318d2p12b45ajsn0b5e62393f33', 'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    productsInfo = result.data;

    document.querySelector('#productInfo').innerHTML = `
      <div class="col-md-6 col-sm-12">
      <img src="${productsInfo.product_photo}"
          alt="some image" height="570px" width="530px" class="border">
      </div>
      <div class="col-md-6 col-sm-12">
        <h3 class="mt-2 mt-sm-5">${productsInfo.product_title}</h3>
        <img src="https://capforge.com/wp-content/uploads/2022/02/amazons-choice.png" alt="" height="30px"
          width="120px">
        <p>${productsInfo.sales_volume}</p>
        <h3>₹${productsInfo.product_price}</h3>
        <button class="btn btn-outline-dark my-4" onclick=itemAddedtoCart(productsInfo)>Add to cart</button>
      </div>`
    console.log(productsInfo.sales_volume)
    console.log(productsInfo.delivery)

  } catch (error) {
    console.error(error);
  }
  cartNumber()
}

// ********************************************************************
function cartNumber() {
  var itemsOnCart = JSON.parse(localStorage.getItem('cartArray'));
  cartLength = itemsOnCart.length;
  document.querySelector(".cartText").innerHTML = `${cartLength}`;
}

// ***************** Cart *******************
// var currentitem;
function cart() {
  cartNumber()
  let cartContainer = document.querySelector('#cartContainer');
  var items = JSON.parse(localStorage.getItem('cartArray'));
  if (items === null || items === "") {
    cartContainer.innerHTML = `<p>Your cart is Empty.</p>`
  }
  items.forEach(item => {
    cartContainer.innerHTML += `<li class="row cartItems border">
  <div class="col-md-3 p-3">
    <img
      src="${item.product_photo}"
      alt="some image" height="180px" width="240px">
  </div>
  <div class="col-md-8 p-3"><h3>${item.product_title}</h3>
    <div class="subrow my-3">
        <select name="qty" id="qty" value="qty: 1">
          <option value="volvo">Qty: 1</option>
          <option value="saab">2</option>
          <option value="opel">3</option>
          <option value="audi">4</option>
        </select>
        <button href="#" style="color:blue;text-decoration: underline;margin-block:5px"  id="deleteBtn">Delete</button>
    </div>
  </div>
  <div class="col-md-1 p-3 mt-4">
    <span style="font-weight: 600;">${item.product_original_price
      }</span>
  </div>
</li>`;
  });

  let cartList = document.querySelectorAll('.cartItems #deleteBtn');
  console.log(cartList);
  cartList.forEach((listItem, index) => {
    listItem.addEventListener('click', () => {
      cartArray.splice(index, 1);
      localStorage.setItem('cartArray', JSON.stringify(cartArray));
      location.reload()
    })
  })
}


function itemAddedtoCart(cartitems) {
  cartArray.unshift(cartitems);
  console.log(cartArray);
  localStorage.setItem('cartArray', JSON.stringify(cartArray));
  cartNumber()
}








