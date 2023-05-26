"use client";
import { useState } from "react";

type AddProductFn = (
  title: string,
  description: string,
  images: Set<string>
) => void;

interface Product {
  readonly name: string;
  readonly description: string;
  readonly images: Set<string>;
}

export default function CreateStore() {
  const [products, setProducts] = useState(new Set() as Set<Product>);

  const addProduct: AddProductFn = function (name, description, images) {
    products.add({
      name,
      description,
      images,
    });
    setProducts(new Set(products));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const { name, description } = Object.fromEntries(formData.entries());
    form.reset();
  }


  return (
    <>
      <h1>Create A Store</h1>
      <form id="storeForm" onSubmit={handleSubmit}>
        <label>
          Name
          <input id="storeName" type="text" required />
        </label>
        <br />
        <label>
          Description
          <textarea id="storeDescription" />
        </label>
        <br />
      </form>
      <AddProduct addProduct={addProduct} />

      <input type="submit" form="storeForm" value="create store" />
      <ListOfProducts products={products} setProducts={setProducts} />
    </>
  );
}

function AddProduct({ addProduct }: { addProduct: AddProductFn }) {
  const [images, setImages] = useState(new Set() as Set<string>);

  function displayImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = URL.createObjectURL(e.target.files[0]);
      images.add(file);
      setImages(new Set(images));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const { name, description } = Object.fromEntries(formData.entries());
    addProduct(name as string, description as string, new Set(images));
    setImages(new Set());
    form.reset();
  }

  return (
    <>
      <h2>Add Products</h2>
      <form method="post" onSubmit={handleSubmit}>
        <label>
          Product Name
          <input name="name" type="text" required />
        </label>
        <br />
        <label>
          Product Description
          <textarea name="description" required />
        </label>
        <br />
        <label>
          add image
          <input type="file" accept="image/*" onChange={displayImage} />
        </label>
        <br />
        <button type="submit">Add Product</button>
      </form>
      <ListOfImages images={images} setImages={setImages} />
    </>
  );
}

function ListOfImages({
  images,
  setImages,
}: {
  images: Set<string>;
  setImages: (a: Set<string>) => void;
}) {
  function handleRemove(id: string) {
    images.delete(id);
    setImages(new Set(images));
  }
  const listofImages = [...images].map((img, idx: number) => {
    return (
      <li key={idx}>
        <img alt="todo" src={img} />
        <button type="button" onClick={() => handleRemove(img)}>
          Remove
        </button>
      </li>
    );
  });
  return <ul>{listofImages}</ul>;
}

function ListOfProducts({
  products,
  setProducts,
}: {
  products: Set<Product>;
  setProducts: (a: Set<Product>) => void;
}) {
  function handleRemove(product: Product) {
    products.delete(product);
    setProducts(new Set(products));
  }

  const liItems = [...products].map((product: Product, idx: number) => {
    return (
      <li key={idx}>
        {product.name}
        <button type="button" onClick={() => handleRemove(product)}>
          Remove
        </button>
      </li>
    );
  });
  return <ul>{liItems}</ul>;
}
