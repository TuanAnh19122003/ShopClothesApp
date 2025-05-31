const faker = require('faker');
const fs = require('fs');
faker.locale = "vi";


const CLOTHING_CATEGORIES = [
    "Áo thun", "Áo sơ mi", "Áo khoác", "Quần jeans", "Quần short", "Đầm", "Váy", "Đồ bộ", "Đồ thể thao", "Áo len"
];

const getRandomProductName = (category) => {
    const adjectives = ["Cao cấp", "Thời trang", "Nữ tính", "Nam tính", "Cổ điển", "Hiện đại", "Basic", "Form rộng", "Slim-fit"];
    const materials = ["cotton", "jeans", "nỉ", "kate", "lanh", "thun lạnh"];
    return `${category} ${faker.random.arrayElement(adjectives)} ${faker.random.arrayElement(materials)}`;
};

const randomCategories = () => {
    return CLOTHING_CATEGORIES.map(name => ({
        id: faker.datatype.uuid(),
        name
    }));
};

const randomProducts = (n = 30, categories) => {
    const products = [];
    for (let i = 0; i < n; i++) {
        const category = faker.random.arrayElement(categories);
        products.push({
            id: faker.datatype.uuid(),
            name: getRandomProductName(category.name),
            price: Number(faker.commerce.price(100000, 1000000, 0)), // VND
            image: faker.image.fashion(),
            categoryId: category.id,
            description: faker.commerce.productDescription(),
        });
    }
    return products;
};

const randomUsers = (n = 10) => {
    const users = [];
    for (let i = 0; i < n; i++) {
        users.push({
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            avatar: faker.image.avatar(),
            password: faker.internet.password(8, false, /[A-Za-z0-9]/)
        });
    }
    return users;
};

const randomCarts = (users, products) => {
    const carts = [];
    for (const user of users) {
        const numItems = faker.datatype.number({ min: 1, max: 5 });
        const productSamples = faker.random.arrayElements(products, numItems);
        for (const product of productSamples) {
            carts.push({
                id: faker.datatype.uuid(),
                userId: user.id,
                productId: product.id,
                quantity: faker.datatype.number({ min: 1, max: 3 }),
            });
        }
    }
    return carts;
};

const randomFavorites = (users, products) => {
    const favorites = [];
    for (const user of users) {
        const favItems = faker.random.arrayElements(products, faker.datatype.number({ min: 1, max: 5 }));
        for (const product of favItems) {
            favorites.push({
                id: faker.datatype.uuid(),
                userId: user.id,
                productId: product.id,
            });
        }
    }
    return favorites;
};

const randomInvoices = (users) => {
    const invoices = [];
    for (const user of users) {
        const numInvoices = faker.datatype.number({ min: 1, max: 3 });
        for (let i = 0; i < numInvoices; i++) {
            invoices.push({
                id: faker.datatype.uuid(),
                userId: user.id,
                date: faker.date.past(),
                totalAmount: 0,
            });
        }
    }
    return invoices;
};


// MAIN
(() => {
    const categories = randomCategories();
    const products = randomProducts(30, categories);
    const users = randomUsers(10);
    const carts = randomCarts(users, products);
    const favorites = randomFavorites(users, products);
    const invoices = randomInvoices(users);

    const db = {
        categories,
        products,
        users,
        carts,
        favorites,
        invoices,
    };

    fs.writeFile('./db.json', JSON.stringify(db, null, 2), () => {
        console.log('Write successfully');
    });
})();
