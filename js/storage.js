class Storage {
    // there is no need to instantiate the method if is declared as static
    static setDevicesLS(devices) {
        localStorage.setItem('devices', JSON.stringify(devices))
    }
    static getDevice(id) {
        let devices = JSON.parse(localStorage.getItem('devices'))
        return devices.find(device => device.id === id )
    }
    static setCartLS(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCartLS() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}