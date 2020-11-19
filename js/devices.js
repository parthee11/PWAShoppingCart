class Devices {
    async getDevices() {
        let response = await fetch('./db/devices.json');
        let data = await response.json();
        let devices = data.items;
        devices = devices.map(device => {
            const { category, name, price } = device.fields;
            const { ram, storage } = device.fields.spec;
            const { id } = device.sys;
            const image = device.fields.image.fields.file.url;
            return {
                id: id, 
                category: category, 
                name: name, 
                price: price,  
                ram: ram, 
                storage: storage, 
                image: image
            }
        }) 
        return devices;
    } 
}