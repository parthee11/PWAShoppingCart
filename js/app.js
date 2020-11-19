const cartBtn = document.querySelector('.cart-btn');
const cartMenu = document.querySelector('.cart-menu');
const closeCart = document.querySelector('.close-cart');
const shopBelow = document.querySelector('.shop-below-btn');
const cartTotal = document.querySelector('.cart-total h3 span');
const cartNotifier = document.querySelector('.cart-notifier');
const cartList = document.querySelector('.cart-list');

// cart
let cart = [];
// addCartbtns
let addCartBtnsDOM = [];

// functions
// cart menu
const cartMenuHandler = (e) => {
    cartMenu.classList.toggle('open-cart');
    sideMenu.classList.remove('open-menu');
}

const cartMenuEmptySpaceClose = (e) => {
    e.target.classList.contains('cart-menu') && (
        cartMenu.classList.remove('open-cart')
    );
}

const closeCartHandler = (e) => {
    cartMenu.classList.remove('open-cart');
}

// jumbotron cta
const smoothScrollHandler = (e) => {
    const href = e.target.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop - 70;
    scroll({
        top: offsetTop,
        behavior: 'smooth'
    });
    e.preventDefault();
}

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', () => {
    // events
    // cart menu
    cartBtn.addEventListener('click', cartMenuHandler);
    cartMenu.addEventListener('click', cartMenuEmptySpaceClose);
    closeCart.addEventListener('click', closeCartHandler);
    // jumbotron cta
    shopBelow.addEventListener('click', smoothScrollHandler);  

    // ****** instantiating Classes ***** //  
    const ui = new UI();
    const devices = new Devices();

    ui.setUpApp();

    // getting the devices
    devices.getDevices()
        .then(devices => {
            ui.populateUI(devices);
            Storage.setDevicesLS(devices);
        })
        .then(() => {
            ui.getAddCartBtns();
            ui.cartLogic();
        })
        .catch(err => {
            console.log(err)
        }) 
})