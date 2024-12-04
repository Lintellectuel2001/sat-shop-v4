import { auth, db, storage } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where 
} from 'firebase/firestore';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const cartBtn = document.getElementById('cartBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const productsContainer = document.getElementById('productsContainer');
const categoriesContainer = document.getElementById('categoriesContainer');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Current user state
let currentUser = null;

// Event Listeners
loginBtn.addEventListener('click', () => {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

registerBtn.addEventListener('click', () => {
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
});

cartBtn.addEventListener('click', () => {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
});

// Authentication
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        showAlert('Connexion réussie!', 'success');
    } catch (error) {
        showAlert('Erreur de connexion: ' + error.message, 'danger');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user profile in Firestore
        await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            email: email,
            displayName: name,
            createdAt: new Date()
        });

        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal.hide();
        showAlert('Inscription réussie!', 'success');
    } catch (error) {
        showAlert('Erreur d\'inscription: ' + error.message, 'danger');
    }
});

// Products
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        productsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            productsContainer.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>${product.price} €</strong></p>
                            <button class="btn btn-primary" onclick="addToCart('${doc.id}')">
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        showAlert('Erreur de chargement des produits: ' + error.message, 'danger');
    }
}

// Categories
async function loadCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        categoriesContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const category = doc.data();
            categoriesContainer.innerHTML += `
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <img src="${category.image}" class="card-img-top" alt="${category.name}">
                        <div class="card-body">
                            <h5 class="card-title">${category.name}</h5>
                            <p class="card-text">${category.description}</p>
                            <button class="btn btn-outline-primary" onclick="filterByCategory('${doc.id}')">
                                Voir les produits
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        showAlert('Erreur de chargement des catégories: ' + error.message, 'danger');
    }
}

// Cart
async function addToCart(productId) {
    if (!currentUser) {
        showAlert('Veuillez vous connecter pour ajouter des articles au panier', 'warning');
        return;
    }

    try {
        const cartRef = collection(db, 'carts');
        const q = query(cartRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            // Create new cart
            await addDoc(cartRef, {
                userId: currentUser.uid,
                items: [{
                    productId: productId,
                    quantity: 1
                }],
                updatedAt: new Date()
            });
        } else {
            // Update existing cart
            const cartDoc = querySnapshot.docs[0];
            const cart = cartDoc.data();
            const existingItem = cart.items.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({
                    productId: productId,
                    quantity: 1
                });
            }

            await updateDoc(doc(db, 'carts', cartDoc.id), {
                items: cart.items,
                updatedAt: new Date()
            });
        }

        updateCartCount();
        showAlert('Produit ajouté au panier!', 'success');
    } catch (error) {
        showAlert('Erreur d\'ajout au panier: ' + error.message, 'danger');
    }
}

async function updateCartCount() {
    if (!currentUser) {
        cartCount.textContent = '0';
        return;
    }

    try {
        const cartRef = collection(db, 'carts');
        const q = query(cartRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const cart = querySnapshot.docs[0].data();
            const count = cart.items.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = count.toString();
        }
    } catch (error) {
        console.error('Erreur de mise à jour du compteur:', error);
    }
}

// Utilities
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('main').insertBefore(alertDiv, document.querySelector('main').firstChild);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Auth state observer
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loginBtn.textContent = 'Déconnexion';
        loginBtn.onclick = () => signOut(auth);
        registerBtn.style.display = 'none';
        updateCartCount();
    } else {
        loginBtn.textContent = 'Connexion';
        loginBtn.onclick = () => {
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        };
        registerBtn.style.display = 'block';
        cartCount.textContent = '0';
    }
});

// Initial load
loadProducts();
loadCategories();
