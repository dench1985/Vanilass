

const SERVER_URL = 'https://api.valantis.store:41000/';

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
        getFromApi({
            "action": "get_items",
            "params": { "ids": idish.result }
        })


            .then((product) => {
                const noDublicats = {}

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



function getFromApi(action) {
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
                return x.text()
                    .then((str) => {
                        console.log(str);

                        return getFromApi(action)
                    })

            }

            return x.json()
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
        if (inputName.value != "") {
            x.push(inputName.value == prod.product)
        }
        if (inputPrice.value != "") {
            x.push(inputPrice.value == prod.price)
        }
        if (inputBrand.value != "") {
            x.push(inputBrand.value == prod.brand)
        }
        return x.every((v) => v == true)
    })

    globalProductMax =nootDublicat.length

    const arr = nootDublicat.slice(offset, offset + limit)

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



