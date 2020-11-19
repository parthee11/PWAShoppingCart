class UI {
    // populating UI
    populateUI(devices) {
        // filtering mobile devices from the data
        let mobileDevices = devices.filter(device => {
            return (device.category === 'mobile')
        });
        // filtering laptop devices from the data
        let laptopDevices = devices.filter(device => {
            return (device.category === 'laptop')
        })
        // filtering headphone category from the data
        let headphoneDevices = devices.filter(device => {
            return (device.category === 'headphone')
        })
        // initialzing output variables
        let mobile_Output = '';
        let laptop_Output = '';
        let headphone_Output = '';
        // function to set values to output variables
        const loopDevices = (typeDevices) => {
            let output = '';
            typeDevices.forEach(typeDevice => {
                // dynamically updating the spec values for headphones
                let specUI = '';
                if(typeDevice.category === 'headphone') {
                    specUI = '<p class="device-spec">Noise Cancellation</p>' 
                } else {
                    specUI = `<p class="device-spec">${typeDevice.ram} GB Ram + ${typeDevice.storage} GB Storage</p>`
                }
                // output variable
                output += `
                    <li class="device">
                        <img src=${typeDevice.image} alt=${typeDevice.name}>
                        <div class="device-details">
                            <p class="device-name">${typeDevice.name}</p>
                            <p class="device-price">Rs. ${typeDevice.price}</p>
                            ${
                                // calling spec ui value - renders based on the type of category
                                specUI
                            }
                            <button class="add-cart" data-id=${typeDevice.id}>
                                Add to Cart <span><i class="lni lni-cart"></i></span>
                            </button>
                        </div>
                    </li>
                `;
            });
            return output;
        }
        // returning values to the output variables using the function
        mobile_Output = loopDevices(mobileDevices);
        laptop_Output = loopDevices(laptopDevices);
        headphone_Output = loopDevices(headphoneDevices);
        // dynamically updating the DOM with output variables values
        document.querySelector('.phones').innerHTML = mobile_Output;
        document.querySelector('.laptops').innerHTML = laptop_Output;    
        document.querySelector('.headphones').innerHTML = headphone_Output;    
    } 
    // get add cart btns
    getAddCartBtns() {
        // getting all the available add cart btns. NodeList is returned if spread operator not used
        const addCartBtns = [...document.querySelectorAll('.add-cart')];
        // saving the buttons to an array variable for later use in cart logic method below
        addCartBtnsDOM = addCartBtns;
        // looping through btns
        addCartBtns.forEach(addCart => {
            let id = parseInt(addCart.dataset.id);
            // checking item in cart
            let inCart = cart.find(cartItem => cartItem.id === id)
            // condition if the item is in cart already
            if(inCart) {
                addCart.innerHTML = 'Added to Cart';
                addCart.disabled = true;
                addCart.classList.add('disabled');
            } else {
                // add cart btn event
                addCart.addEventListener('click', (e) => {
                    // button changes
                    e.target.innerHTML = 'Added to Cart';
                    e.target.disabled = true;
                    addCart.classList.add('disabled');
                    // get device from devices
                    let cartItem = {...Storage.getDevice(id), amount: 1};
                    // add device to cart
                    cart = [...cart, cartItem];
                    // set cart LS
                    Storage.setCartLS(cart);
                    // set cart values
                    this.setCartValues(cart);
                    // display cart item
                    this.addCartItem(cartItem);
                    // prevent default
                    e.preventDefault();
                })
            }
        })
    }
    // set cart values
    setCartValues(cart) {
        let tempTotal = 0;
        cart.map(item => {
            tempTotal += parseInt(item.price) * parseInt(item.amount)
        });
        (cart.length >= 1) ? (cartNotifier.style.display = 'block') : (cartNotifier.style.display = 'none');
        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
    }
    // adding/displaying device to/in cart
    addCartItem(cartItem) {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <div class="device-image">
                <img src=${cartItem.image} alt=${cartItem.name}>
            </div>
            <div class="device-details">
                <p class="device-name">${cartItem.name}</p>
                <p class="device-price">Rs. ${cartItem.price}</p>
                <a href="#" class="remove-device" data-id=${cartItem.id}>Remove</a>
            </div>
            <div class="device-quantity">
                <span class="q q-inc" data-id=${cartItem.id}>
                    <i class="lni lni-chevron-up"></i>
                </span>
                <span class="q q-input">
                    <input type="text" maxlength="1" disabled value=${cartItem.amount}>
                </span>
                <span class="q q-dec" data-id=${cartItem.id}>
                    <i class="lni lni-chevron-down"></i>
                </span>
            </div>
        `;
        // appendling item to list
        cartList.appendChild(li);
    }
    // setting up the app
    setUpApp() {
        cart = Storage.getCartLS();
        this.setCartValues(cart);
        this.populateCart(cart);
    }
    // populating cart
    populateCart(cart) {
        cart.forEach(cartItem => {
            this.addCartItem(cartItem); 
        });
    }
    // cart logic ( remove item, increase / decrease quantity ) 
    cartLogic() {
        cartList.addEventListener('click', (e) => {
            // remove single device
            if(e.target.classList.contains('remove-device')) {
                let removeItem = e.target;
                let id = parseInt(removeItem.dataset.id);
                this.removeDevice(id);
                cartList.removeChild(e.target.parentElement.parentElement);
            } else if(e.target.classList.contains('q-inc')) {
                // increasing the quantity
                let addAmount = e.target;
                let id = parseInt(addAmount.dataset.id);
                let tempDevice = cart.find(cartItem => cartItem.id === id);
                tempDevice.amount = tempDevice.amount + 1;
                Storage.setCartLS(cart);
                this.setCartValues(cart);
                e.target.nextElementSibling.children[0].value = tempDevice.amount;                
            } else if(e.target.classList.contains('q-dec')) {
                // decreasing the quantity
                let decAmount = e.target;
                let id = parseInt(decAmount.dataset.id);
                let tempDevice = cart.find(cartItem => cartItem.id === id);
                tempDevice.amount = tempDevice.amount - 1;
                // if quantity falls below 1, remocve item from cart
                if(tempDevice.amount > 0) {
                    Storage.setCartLS(cart);
                    this.setCartValues(cart);
                    e.target.previousElementSibling.children[0].value = tempDevice.amount; 
                } else {
                    this.removeDevice(id);
                    cartList.removeChild(e.target.parentElement.parentElement);
                }
            }
            // preventing default behavior 
            e.preventDefault();
        })
    }
    // remove device method
    removeDevice(id) {
        cart = cart.filter(cartItem => cartItem.id !== id);
        this.setCartValues(cart);
        Storage.setCartLS(cart);
        // add cart buttons reset
        const addCartBtns = [...document.querySelectorAll('.add-cart')];
        // resetting add cart buttons
        addCartBtns.forEach(addCart => {
            if(parseInt(addCart.dataset.id) === id) {
                addCart.innerHTML = 'Add to Cart <span><i class="lni lni-cart"></i></span>';
                addCart.disabled = false;
                addCart.classList.remove('disabled');
            }
        })
    }
}