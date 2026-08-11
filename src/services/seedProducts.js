import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const sampleProducts = [
  {
    name: "Oversized Hoodie",
    price: 49.99,
    category: "Hoodies",
    description: "Soft cotton hoodie in oversized fit.",
    imageURL: "https://placehold.co/500x500/1f2937/f9fafb/png?text=Oversized+Hoodie"
  },
  {
    name: "Graphic Zip Hoodie",
    price: 59.99,
    category: "Hoodies",
    description: "Full-zip hoodie with bold street graphic on the back.",
    imageURL: "https://placehold.co/500x500/374151/f9fafb/png?text=Graphic+Zip+Hoodie"
  },
  {
    name: "Washed Vintage Hoodie",
    price: 54.5,
    category: "Hoodies",
    description: "Acid-washed pullover hoodie with a relaxed vintage feel.",
    imageURL: "https://placehold.co/500x500/4b5563/f9fafb/png?text=Vintage+Hoodie"
  },
  {
    name: "Classic Logo Tee",
    price: 24.99,
    category: "T-Shirts",
    description: "Heavyweight cotton tee with embroidered chest logo.",
    imageURL: "https://placehold.co/500x500/111827/f9fafb/png?text=Classic+Logo+Tee"
  },
  {
    name: "Boxy Street Tee",
    price: 29.99,
    category: "T-Shirts",
    description: "Boxy-fit tee with dropped shoulders and screen print.",
    imageURL: "https://placehold.co/500x500/1e3a5f/f9fafb/png?text=Boxy+Street+Tee"
  },
  {
    name: "Acid Wash Tee",
    price: 27.5,
    category: "T-Shirts",
    description: "Garment-dyed acid wash tee in faded charcoal.",
    imageURL: "https://placehold.co/500x500/52525b/f9fafb/png?text=Acid+Wash+Tee"
  },
  {
    name: "Retro Court Sneakers",
    price: 89.99,
    category: "Sneakers",
    description: "Low-top leather sneakers with a retro basketball silhouette.",
    imageURL: "https://placehold.co/500x500/7c2d12/f9fafb/png?text=Retro+Court"
  },
  {
    name: "Chunky Runner Sneakers",
    price: 109.99,
    category: "Sneakers",
    description: "Chunky-sole runners with layered mesh and suede panels.",
    imageURL: "https://placehold.co/500x500/78350f/f9fafb/png?text=Chunky+Runner"
  },
  {
    name: "Canvas High Tops",
    price: 69.99,
    category: "Sneakers",
    description: "Classic canvas high-tops with rubber toe cap.",
    imageURL: "https://placehold.co/500x500/312e81/f9fafb/png?text=Canvas+High+Tops"
  },
  {
    name: "Corduroy Bucket Hat",
    price: 22.0,
    category: "Accessories",
    description: "Soft corduroy bucket hat with tonal stitching.",
    imageURL: "https://placehold.co/500x500/365314/f9fafb/png?text=Bucket+Hat"
  },
  {
    name: "Crossbody Utility Bag",
    price: 34.99,
    category: "Accessories",
    description: "Water-resistant crossbody bag with multiple pockets.",
    imageURL: "https://placehold.co/500x500/0f766e/f9fafb/png?text=Utility+Bag"
  },
  {
    name: "Chunky Beanie",
    price: 18.5,
    category: "Accessories",
    description: "Ribbed knit beanie with fold-over cuff.",
    imageURL: "https://placehold.co/500x500/6b21a8/f9fafb/png?text=Chunky+Beanie"
  }
];

export async function seedProducts() {
  const productsRef = collection(db, "products");
  const existing = await getDocs(productsRef);
  if (!existing.empty) {
    return { added: 0, skipped: true };
  }
  for (const product of sampleProducts) {
    await addDoc(productsRef, product);
  }
  return { added: sampleProducts.length, skipped: false };
}
