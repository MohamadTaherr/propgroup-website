// Firebase configuration (your provided config)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAWBYacv1Z24NAG2Ar-iyPvqYuPBTpvwFc",
    authDomain: "propgroup-5fbee.firebaseapp.com",
    projectId: "propgroup-5fbee",
    storageBucket: "propgroup-5fbee.firebasestorage.app",
    messagingSenderId: "331503839485",
    appId: "1:331503839485:web:3ec921668ff97a57d9b694",
    measurementId: "G-J2G6YE912N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Auth state listener
onAuthStateChanged(auth, user => {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const userEmail = document.getElementById('user-email');

    if (user) {
        // User is signed in
        authLinks.classList.add('d-none');
        userInfo.classList.remove('d-none');
        userEmail.textContent = user.email;
    } else {
        // User is signed out
        authLinks.classList.remove('d-none');
        userInfo.classList.add('d-none');
        userEmail.textContent = '';
    }
});

// Sign up
const handleSignUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Signed up as:', user.email);
            // Close modal or update UI
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Sign up error:', errorMessage);
            alert(`Sign up error: ${errorMessage}`);
        });
};

// Login
const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Logged in as:', user.email);
            // Close modal or update UI
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error:', errorMessage);
            alert(`Login error: ${errorMessage}`);
        });
};

// Logout
const handleLogout = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('User logged out');
    }).catch((error) => {
        // An error happened.
        console.error('Logout error:', error);
    });
};

// Sample property data
const sampleProperties = [
    {
        id: 1,
        title: "Modern Downtown Penthouse",
        price: "$850,000",
        location: "Downtown, Metropolitan City",
        type: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: "2,200 sq ft",
        badge: "Featured"
    },
    {
        id: 2,
        title: "Luxury Family Home",
        price: "$1,200,000",
        location: "Suburban Heights",
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        area: "3,500 sq ft",
        badge: "New"
    },
    {
        id: 3,
        title: "Contemporary Condo",
        price: "$450,000",
        location: "Riverside District",
        type: "condo",
        bedrooms: 2,
        bathrooms: 2,
        area: "1,400 sq ft",
        badge: "Hot Deal"
    },
    {
        id: 4,
        title: "Commercial Office Space",
        price: "$2,500,000",
        location: "Business District",
        type: "commercial",
        bedrooms: 0,
        bathrooms: 4,
        area: "8,000 sq ft",
        badge: "Investment"
    },
    {
        id: 5,
        title: "Waterfront Villa",
        price: "$3,200,000",
        location: "Coastal Area",
        type: "house",
        bedrooms: 5,
        bathrooms: 4,
        area: "4,800 sq ft",
        badge: "Luxury"
    },
    {
        id: 6,
        title: "Urban Loft",
        price: "$680,000",
        location: "Arts District",
        type: "apartment",
        bedrooms: 2,
        bathrooms: 1,
        area: "1,800 sq ft",
        badge: "Trendy"
    }
];

// Load and display properties
function loadProperties() {
    const container = document.getElementById('properties-container');
    if (!container) return;

    container.innerHTML = '';
    
    sampleProperties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
            <div class="property-image">
                <div class="property-badge">${property.badge}</div>
            </div>
            <div class="property-info">
                <div class="property-price">${property.price}</div>
                <div class="property-title">${property.title}</div>
                <div class="property-location"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-map-pin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="11" r="3"></circle><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path></svg> ${property.location}</div>
                <div class="property-features">
                    ${property.bedrooms > 0 ? `<div class="feature"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bed" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 7v11h18v-11z"></path><path d="M3 14h18"></path><path d="M8 11v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"></path></svg> ${property.bedrooms} Beds</div>` : ''}
                    <div class="feature"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bath" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1z"></path><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25"></path><path d="M4 21l1 -1.5"></path><path d="M20 21l-1 -1.5"></path></svg> ${property.bathrooms} Baths</div>
                    <div class="feature"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-ruler" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"></path><path d="M4 8l2 0"></path><path d="M4 12l3 0"></path><path d="M4 16l2 0"></path><path d="M8 4l0 2"></path><path d="M12 4l0 3"></path><path d="M16 4l0 2"></path></svg> ${property.area}</div>
                </div>
            </div>
        `;
        
        propertyCard.addEventListener('click', () => {
            alert(`Viewing details for: ${property.title}\nPrice: ${property.price}\nLocation: ${property.location}`);
        });
        
        container.appendChild(propertyCard);
    });
}

// Search properties function
window.searchProperties = function() {
    const location = document.getElementById('location').value.toLowerCase();
    const propertyType = document.getElementById('property-type').value;
    const budget = document.getElementById('budget').value;
    
    let filteredProperties = sampleProperties;
    
    if (location) {
        filteredProperties = filteredProperties.filter(prop => 
            prop.location.toLowerCase().includes(location)
        );
    }
    
    if (propertyType) {
        filteredProperties = filteredProperties.filter(prop => 
            prop.type === propertyType
        );
    }
    
    if (budget) {
        // Simple budget filtering logic
        filteredProperties = filteredProperties.filter(prop => {
            const price = parseInt(prop.price.replace(/[$,]/g, ''));
            switch(budget) {
                case '0-100k': return price <= 100000;
                case '100k-300k': return price > 100000 && price <= 300000;
                case '300k-500k': return price > 300000 && price <= 500000;
                case '500k+': return price > 500000;
                default: return true;
            }
        });
    }
    
    displayFilteredProperties(filteredProperties);
    
    // Scroll to properties section
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
};

function displayFilteredProperties(properties) {
    const container = document.getElementById('properties-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (properties.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2rem;">No properties found matching your criteria.</p>';
        return;
    }
    
    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
            <div class="property-image">
                <div class="property-badge">${property.badge}</div>
            </div>
            <div class="property-info">
                <div class="property-price">${property.price}</div>
                <div class="property-title">${property.title}</div>
                <div class="property-location"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-map-pin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="12" cy="11" r="3"></circle><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path></svg> ${property.location}</div>
                <div class="property-features">
                    ${property.bedrooms > 0 ? `<div class="feature"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bed" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 7v11h18v-11z"></path><path d="M3 14h18"></path><path d="M8 11v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"></path></svg> ${property.bedrooms} Beds</div>` : ''}
                    <div class="feature"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bath" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1z"></path><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25"></path><path d="M4 21l1 -1.5"></path><path d="M20 21l-1 -1.5"></path></svg> ${property.bathrooms} Baths</div>
                    <div class="feature"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-ruler" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"></path><path d="M4 8l2 0"></path><path d="M4 12l3 0"></path><path d="M4 16l2 0"></path><path d="M8 4l0 2"></path><path d="M12 4l0 3"></path><path d="M16 4l0 2"></path></svg> ${property.area}</div>
                </div>
            </div>
        `;
        
        propertyCard.addEventListener('click', () => {
            alert(`Viewing details for: ${property.title}\nPrice: ${property.price}\nLocation: ${property.location}`);
        });
        
        container.appendChild(propertyCard);
    });
}

// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    animateStats();
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date()
            };
            
            try {
                // Add contact form submission to Firestore
                await addDoc(collection(db, 'contacts'), formData);
                alert('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
            }
        });
    }

    // Modal handling
    console.log("Setting up modal listeners...");
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');

    const closeBtns = document.querySelectorAll('.close-btn');

    loginBtn.addEventListener('click', () => {
        console.log("Login button clicked");
        loginModal.classList.remove('d-none');
    });
    signupBtn.addEventListener('click', () => {
        console.log("Signup button clicked");
        signupModal.classList.remove('d-none');
    });
    logoutBtn.addEventListener('click', handleLogout);

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.add('d-none');
            signupModal.classList.add('d-none');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('d-none');
        }
        if (e.target === signupModal) {
            signupModal.classList.add('d-none');
        }
    });

    // Form submissions
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        handleLogin(email, password);
        loginModal.classList.add('d-none');
    });

    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        handleSignUp(email, password);
        signupModal.classList.add('d-none');
    });
});

// Animate statistics counters
function animateStats() {
    const stats = [
        { id: 'properties-sold', target: 500 },
        { id: 'happy-clients', target: 750 },
        { id: 'years-experience', target: 12 },
        { id: 'team-members', target: 25 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateCounter(element, stat.target);
        }
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 20);
}

// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinksContainer) {
        mobileMenu.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
        });
    }
});

// Export for use in other modules if needed
export { db, analytics, sampleProperties };
