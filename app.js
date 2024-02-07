const categories=document.getElementById('categories')
const products=document.getElementById('products')
const cartCount=document.getElementById('cartCount')
const heroBlock=document.querySelector('.heroBlock')
const cCart=document.querySelector('#onCart')

const _shopUrl='https://fakestoreapi.com/products/'

async function getShop(){
    const res=await fetch(_shopUrl)
    const data=await res.json()
    console.log(data);
    showCotegories(data)
    renderProducts(data.slice(0, 4))
}

getShop()
function showCotegories(arr){
    let newCategories=[]

    const categoriesFilter=arr.filter(el=>{
        if(el.category.name && !newCategories.includes(el.category.name)){
            newCategories.push(el.category.name)
        }
    })

    console.log(newCategories);

    categories.innerHTML=''
    for (const name of newCategories) {
        categories.innerHTML+=`
        <li>${name}</li>
        `
    }
}
function renderProducts(arr){
    products.innerHTML=''
    for (const product of arr) {
        products.innerHTML+=`
    <div onclick='getItemBuId(${product.id})' class="card" style="width: 18rem; ">
        <img src=${product.image} class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.category}</p>
        <h6>${product.price}$</h6>
  </div>
</div>
        
        `
    }
}

async function getItemBuId(id){
    const res=await fetch(_shopUrl+id)
    const data=await res.json()
    console.log(data);
    showOneCard(data);
}
getItemBuId(2)

function showOneCard(obj){
    products.innerHTML=''
    products.innerHTML+=`
    <div class="card" style="width: 22rem;">
      <img src=${obj.image} class="card-img-top" alt="...">
  <div class="card-body">
      <h5 class="card-title">${obj.title}</h5>
      <p class="card-text">${obj.category}</p>
      <h4>${obj.price}$</h4>
      <a href="#" onclick='addItemToCart(${obj.id})' class="btn btn-primary">Добавить в корзину!</a>
   </div>
 </div>
    `
}
let arrCart=[]

async function addItemToCart(id){
    const res = await fetch(_shopUrl + id);
    const data = await res.json();
    console.log(data);


    const existingItem = arrCart.find(item => item.id === data.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        data.quantity = 1;
        arrCart.push(data);
    }

    const cartData = JSON.stringify(arrCart);
    localStorage.setItem('cart', cartData);
    getItemFromCart(cartData);
}

cCart.onclick=()=>{ 
    products.innerHTML=''
    heroBlock.innerHTML='' 
    showCotegories.innerHTML=''
    showOneCard.innerHTML=''
    showCart(arrCart) 

  } 

  function showCart(arr){ 
    heroBlock.innerHTML='' 

    let totalSumma = 0;

    arr.forEach((item, index) => { 
        const itemElement = document.createElement('div');
        itemElement.classList.add('d-flex', 'justify-content-between');
        itemElement.dataset.index = index;
        itemElement.innerHTML = `
            <img src='${item.image}' style='max-width: 30%' /> 
            <div> 
                <h2>${item.title}</h2> 
                <h5>${item.category}</h5> 
            </div> 
            <h1>${item.price}</h1> 
            <div> 
                <button class="plus-btn">+</button> 
                <span>${item.quantity}</span> 
                <button class="minus-btn">-</button> 
            </div> 
            <button class="remove-btn">x</button> 
        `;
        heroBlock.appendChild(itemElement);

        totalSumma += item.price * item.quantity;

    }); 

    const totalBlock = document.createElement('h4');
    totalBlock.textContent = `Total: ${totalSumma}$`;
    heroBlock.appendChild(totalBlock);

    const plusButtons = document.querySelectorAll('.plus-btn');
    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.parentElement.parentElement.dataset.index;
            arr[index].quantity++;
            showCart(arr)
        });
    });
    const minusButtons = document.querySelectorAll('.minus-btn');
    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.parentElement.parentElement.dataset.index;
            if (arr[index].quantity > 1) {
                arr[index].quantity--;
            } else {
                arr.splice(index, 1); 
            }
            showCart(arr);
        });
    });

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.parentElement.dataset.index;
            arr.splice(index, 1);
            showCart(arr);
        });
    });
}