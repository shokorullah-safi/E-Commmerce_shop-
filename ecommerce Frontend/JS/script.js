
// Save this section as script.js
// Simple JS to power load more, testimonials, map picker and small animations
document.addEventListener('DOMContentLoaded',()=>{
// reveal on scroll
const reveals = document.querySelectorAll('.reveal')
const obs = new IntersectionObserver((entries)=>{
entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show') })
},{threshold:0.12})
reveals.forEach(r=>obs.observe(r))


// Products: load more
const moreBtn = document.getElementById('loadMore')
const productsContainer = document.getElementById('productsGrid')
let visibleCount = 6
moreBtn.addEventListener('click',()=>{
const cards = productsContainer.querySelectorAll('.product-card')
visibleCount += 6
cards.forEach((c,i)=>{
c.style.display = i < visibleCount ? 'block' : 'none'
})
if(visibleCount >= cards.length) moreBtn.style.display='none'
})


// Testimonial carousel (simple)
const testimonials = [
{text:'Fast delivery & great packaging — my family loved the quality!', name:'Aisha R.'},
{text:'Customer support answered all my questions. Five stars.', name:'Bilal K.'},
{text:'Amazing value and free shipping made the purchase easy.', name:'Sara M.'},
]
let tIndex = 0
const tText = document.getElementById('testimonialText')
const tAuthor = document.getElementById('testimonialAuthor')
function showTesti(i){
tText.classList.remove('fade-in')
void tText.offsetWidth
tText.classList.add('fade-in')
tText.textContent = testimonials[i].text
tAuthor.textContent = testimonials[i].name
}
document.getElementById('testiNext').addEventListener('click',()=>{ tIndex=(tIndex+1)%testimonials.length; showTesti(tIndex) })
document.getElementById('testiPrev').addEventListener('click',()=>{ tIndex=(tIndex-1+testimonials.length)%testimonials.length; showTesti(tIndex) })
showTesti(tIndex)


// Map selector
const mapSelect = document.getElementById('mapSelect')
const mapFrame = document.getElementById('mapFrame')
const locations = {
'Kabul, Afghanistan':'https://www.google.com/maps?q=Kabul+Afghanistan&output=embed',
'New York, USA':'https://www.google.com/maps?q=New+York+City+USA&output=embed',
'London, UK':'https://www.google.com/maps?q=London+UK&output=embed',
'Tokyo, Japan':'https://www.google.com/maps?q=Tokyo+Japan&output=embed'
}
mapSelect.addEventListener('change',()=>{ mapFrame.src = locations[mapSelect.value] })


// initial product visibility
const productCards = productsContainer.querySelectorAll('.product-card')
productCards.forEach((c,i)=> c.style.display = i < visibleCount ? 'block' : 'none')
})


/* tiny animation class */
const styleEl = document.createElement('style')
styleEl.innerHTML = `.fade-in{animation:fadeIn .45s ease both}@keyframes fadeIn{from{opacity:0; transform:translateY(8px)}to{opacity:1; transform:none}}`
document.head.appendChild(styleEl)