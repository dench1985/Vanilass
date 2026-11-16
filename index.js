

const SERVER_URL = 'https://api.valantis.store:41000/';

const demoProducts = {
    result: [
        { id: '1', product: 'Кольцо', price: 5000, brand: 'Sokolov' },
        { id: '2', product: 'Серьги', price: 8000, brand: 'Sunlight' },
        { id: '3', product: 'Браслет', price: 3000, brand: 'Sokolov' },
        { id: '4', product: 'Часы', price: 12000, brand: 'Casio' },
         { id: '5', product: 'Колье', price: 6500, brand: 'Sokolov' },
        { id: '6', product: 'Кольцо', price: 9000, brand: 'Sunlight' },
        { id: '7', product: 'Подвеска', price: 5000, brand: null }
    ]
};

const currentDate = new Date().toISOString().slice(0, 10).replace(/[-]/g, "")

const glav = document.querySelector('.product-container')

const [leftBtn, rightBtn] = document.querySelectorAll('.buttons button')

const [inputName, inputPrice, inputBrand] = document.querySelectorAll('.filters input')

let globalProductMax

getFromApi({
    "action": "get_ids",
    "params": {}

})
    .then((idish) => {
       return getFromApi({
            "action": "get_items",
            "params": { "ids": idish.result }
        })


            .then((product) => {
                

                for (let prod in product.result) {
                    if (noDublicats[product.result[prod].id]) {


                    }
                }

                let offset = 0;
                let limit = 50;

                addProductToPage(product, offset, limit)

                leftBtn.addEventListener('click', () => {
                    if (offset != 0) {
                        offset -= limit
                        addProductToPage(product, offset, limit)
                    }
                    
                     
                })
                rightBtn.addEventListener('click', () => {
                    if ( offset + limit < globalProductMax ) {
                        offset += limit
                         addProductToPage(product, offset, limit)
                    }                  
                   
            })
               
                document.querySelectorAll('.filters input').forEach(field => {
                    field.addEventListener('input', () => {
                        offset = 0
                        addProductToPage(product, offset, limit)

                    })
                })
            })
    })

  .catch((error) => {
        let offset = 0;
        const limit = 2;

addProductToPage(demoProducts, offset, limit);

leftBtn.addEventListener('click', () => {
    if (offset > 0) {
        offset -= limit;
        addProductToPage(demoProducts, offset, limit);
    }
});

rightBtn.addEventListener('click', () => {
    if (offset + limit < globalProductMax) {
        offset += limit;
        addProductToPage(demoProducts, offset, limit);
    }
});
      glav.insertAdjacentHTML(
    'beforebegin',
    '<p class="demo-notice">Демонстрационный режим — показаны тестовые товары.</p>'
);
document.querySelectorAll('.filters input').forEach((field) => {
    field.addEventListener('input', () => {
        offset = 0;
        addProductToPage(demoProducts, offset, limit);
    });
});
        console.error('Ошибка загрузки товаров:', error);
    });

function getFromApi(action, retryCount = 0) {
    return fetch(SERVER_URL, {
        method: "POST",
        headers: {
            "X-Auth": md5("Valantis_" + currentDate),
            "Content-type": "application/json"
        },
        body: JSON.stringify(action),
    })

.then((x) => {
    if (x.status === 500) {
        return x.text().then((str) => {
            console.log(str);

            if (retryCount >= 2) {
                throw new Error(
                    'Сервер вернул ошибку 500 после трёх попыток'
                );
            }

            return getFromApi(action, retryCount + 1);
        });
    }

    return x.json();
})
}
function divText(str) {
    const x = document.createElement('div')
    x.append(str)
    return x
}

function addProductToPage(product, offset, limit) {
    glav.textContent = '';
    let noDublicats = {}

    let nootDublicat = []

    for (let prod of product.result) {
        if (noDublicats[prod.id]) {
            continue;
        }
        noDublicats[prod.id] = true;
        nootDublicat.push(prod)
    }

    nootDublicat = nootDublicat.filter((prod) => {
        const x = []
        

if (inputName.value.trim() !== '') {
    x.push(
        prod.product
            .toLowerCase()
            .includes(inputName.value.trim().toLowerCase())
    );
}

if (inputPrice.value !== '') {
    x.push(inputPrice.value == prod.price);
}

if (inputBrand.value.trim() !== '') {
    x.push(
        (prod.brand ?? '')
            .toLowerCase()
            .includes(inputBrand.value.trim().toLowerCase())
    );
}

return x.every((value) => value === true);
    })

    globalProductMax =nootDublicat.length

    const arr = nootDublicat.slice(offset, offset + limit)
       
    if (arr.length === 0) {
    glav.textContent = 'Товары не найдены';
    return;
}
    for (let i = 0; i < arr.length; i++) {

        const one_li = document.createElement('li')
        one_li.append(
            divText(arr[i].id),
            divText(arr[i].product),
            divText(arr[i].price),
            divText(arr[i].brand)
        )
        glav.append(one_li)
    }

}

