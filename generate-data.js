const faker = require('faker'); //Thư viện faker dùng để random data
const fs = require('fs'); //fs có nghĩa là file system
 
// Set locale to use Vietnamese
faker.locale = 'vi';

// Random data
// console.log(faker.commerce.department());
// console.log(faker.commerce.productName());
// console.log(faker.commerce.productDescription());
// console.log(faker.random.uuid());
// console.log(faker.image.imageUrl());
// console.log(faker.name.findName());

const randomCategoryList = (n) => {
    if( n <= 0 ) return [];
    const categoryList = [];
    // loop and push category
    Array.from(new Array(n)).forEach(() => {
        const category = {
            id: faker.random.uuid(),
            name: faker.commerce.department(),
            createdAt: Date.now(),
            updateAt: Date.now(),
        }
        categoryList.push(category);
    })
    return categoryList;
}

const randomProductList = (categoryList , numberOfProducts) => {
    if(numberOfProducts <= 0) return [];
    const productList = [];
    // random data. Phải  duyệt qua 2 vòng lặp
    for(const category of categoryList){
        Array.from(new Array(numberOfProducts)).forEach(() => {
            const product = {
                categoryId: category.id,
                id: faker.random.uuid(),
                name: faker.commerce.productName(),
                color: faker.commerce.color(),
                // Giá tiền nên parse về kiểu số vì faker nó chỉ trả về kiểu chuỗi nên ta phải ép kiểu
                price: Number.parseFloat(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                createdAt: Date.now(),
                updateAt: Date.now(),
                thumbnailUrl: faker.image.imageUrl(400,400) //truyền vào width và height
            }
            productList.push(product);
        });
    }

    return productList;
}

// IFFE
(() => {
    // Random data
    const categoryList = randomCategoryList(4);
    const productList = randomProductList(categoryList, 5); //Ứng với mỗi categoryList random ra 1 số lượng product nhất định
    // prepare db object
    const db = {
        categories: categoryList,
        products: productList,
        profile: {
            name: "Po",
        },
    };

    // Write db object to db.json
    fs.writeFile("db.json",JSON.stringify(db), () => {
        console.log("Generate data successfully");
    });
})();