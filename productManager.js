// se define la clase ProductManager
// en esta oportunidad los datos van a persistir en archivo

const fs = require("fs");

const addToFile = async (path, products) => {
  if (fs.existsSync(path)) {
    try {
      await fs.promises.unlink(path);
    } catch (error) {
      console.log(error);
    }
  }
  try {
    await fs.promises.writeFile(path, products);
  } catch (error) {
    console.log(error);
  }
};

const readFile = (path) => {
  if (fs.existsSync(path)) {
    try {
      const data = fs.readFileSync(path, "utf-8");
      return data;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Archivo no existe");
  }
};

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "";
  }

  // método que devuelve el total de productos
  getProducts = () => {
    const data = readFile(this.path);
    this.products = JSON.parse(data);
    return this.products;
  };

  // método para almacenar productos

  addProduct = (title, description, price, thumbnail, code, stock) => {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      products: [],
    };

    // valida que se envíen todos los datos
    if (
      product.code != undefined &&
      product.description != undefined &&
      product.price != undefined &&
      product.stock != undefined &&
      product.thumbnail != undefined &&
      product.title != undefined
    ) {
      product.id =
        this.products.length === 0
          ? 1
          : this.products[this.products.length - 1].id + 1;
      this.products.push(product); // Agrego al array

      addToFile(this.path, JSON.stringify(this.products, null, "\t"));
    } else {
      console.log("Falta algún dato");
    }
  };

  // método que devuelve como objeto los datos del ID que
  // recibe como parámetro

  getProductById = (idProd) => {
    const data = readFile(this.path);
    this.products = JSON.parse(data);
    const pInd = this.products.findIndex((product) => product.id === idProd);

    if (pInd === -1) {
      console.log("Not Found");
      return [];
    }

    return this.products[pInd];
  };

  // función que modifica los datos de un producto
  // recibe como parámetros el ID del producto a modificar y en forma de array las modificaciones
  // a ser realizadas

  updateProduct = (idProd, changes) => {
    const data = readFile(this.path);
    this.products = JSON.parse(data);
    const pInd = this.products.findIndex((product) => product.id === idProd);

    if (pInd === -1) {
      console.log("Not Found");
      return [];
    }

    var i = 0;
    for (i = 0; i <= changes.length; i++) {
      eval("this.products[pInd]." + changes[i]);
    }
    addToFile(this.path, JSON.stringify(this.products, null, "\t"));
  };

  // función que borra un determinado producto.
  // recibe como parámetro el ID del producto
  deleteProduct = (idProd) => {
    const data = readFile(this.path);
    this.products = JSON.parse(data);
    addToFile(
      this.path,
      JSON.stringify(
        this.products.filter((product) => product.id != idProd),
        null,
        "\t"
      )
    );
  };
}

const adminProducts = new ProductManager();

adminProducts.path = "./products.txt";

// alta de productos

adminProducts.addProduct(
  "pinza",
  "pinza pico de loro",
  1500,
  "imagen",
  "PIN3254",
  54
); // se tiene que dar de alta

adminProducts.addProduct(
  "tenaza",
  "tenaza acera templado",
  900,
  "imagen",
  "TEN5214",
  23
); // se tiene que dar de alta

// obtiene todos los productos del archivo
//console.log(adminProducts.getProducts());

// obtiene el objeto del producto cuyo ID se pasa como parámetro (si no existe devuelve un objeto vacio)
//console.log(adminProducts.getProductById(2));

// Realiza cambios en un producto según el ID que se pasa como parámetro
// y la lista de cambios que se pasa como un array
//let changes = ["price=50000","stock=100"]  // array con los cambios a ser realizados en el producto
//adminProducts.updateProduct(1,changes) // invoco a la función que modifica los datos de un producto

// Borra el producto cuyo ID se pasa como parámetro
//adminProducts.deleteProduct(2)
