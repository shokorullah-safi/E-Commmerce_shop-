 // Sample data stored in-memory for demo purposes
    const products = [
      {name:'Classic T-Shirt', sku:'TSH-001', price:19.99, stock:120, img:'https://picsum.photos/seed/p1/80/80', desc:'Comfortable cotton t-shirt.'},
      {name:'Running Shoes', sku:'SHO-045', price:79.00, stock:45, img:'https://picsum.photos/seed/p2/80/80', desc:'Lightweight running shoes.'},
      {name:'Leather Wallet', sku:'WAL-010', price:29.5, stock:85, img:'https://picsum.photos/seed/p3/80/80', desc:'Genuine leather wallet.'}
    ];

    const orders = [
      {id:'ORD-1001', customer:'Sara A.', items:2, total:49.98, status:'Delivered', date:'2025-11-29'},
      {id:'ORD-1002', customer:'Omid K.', items:1, total:79.00, status:'Processing', date:'2025-11-30'},
      {id:'ORD-1003', customer:'Laila H.', items:3, total:129.97, status:'Shipped', date:'2025-12-01'}
    ];

    // utilities
    const $ = selector => document.querySelector(selector);
    const $$$ = selector => document.querySelectorAll(selector);

    function renderDashboard(){
      document.getElementById('productsCount').innerText = products.length;
      document.getElementById('ordersCount').innerText = orders.length;
      document.getElementById('customersCount').innerText = 89; // static for demo
      document.getElementById('totalSales').innerText = '$' + (orders.reduce((s,o)=>s+o.total,0)).toFixed(2);

      // orders table
      const ot = document.getElementById('ordersTable'); ot.innerHTML='';
      orders.forEach(o=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.id}</td><td>${o.customer}</td><td>${o.items}</td><td>$${o.total.toFixed(2)}</td><td><span class='badge bg-${o.status==='Delivered'?'success': o.status==='Processing'?'secondary':'info'}'>${o.status}</span></td><td>${o.date}</td>`;
        ot.appendChild(tr);
      });

      // products main table
      const pt = document.querySelector('#productsTable tbody'); pt.innerHTML='';
      products.forEach((p,i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i+1}</td>
          <td><img src="${p.img}" class="avatar" alt=""></td>
          <td>${p.name}</td>
          <td>${p.sku||''}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${i})"><i class='fa-solid fa-pen'></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${i})"><i class='fa-solid fa-trash'></i></button>
          </td>
        `;
        pt.appendChild(tr);
      });

      // top products
      const tp = document.getElementById('topProducts'); tp.innerHTML='';
      products.slice(0,5).forEach((p)=>{
        const li = document.createElement('li'); li.className='list-group-item d-flex align-items-center justify-content-between';
        li.innerHTML = `<div class='d-flex align-items-center gap-2'><img src='${p.img}' class='avatar'><div><div style='font-weight:600'>${p.name}</div><small class='text-muted'>${p.sku||''}</small></div></div><div>$${p.price.toFixed(2)}</div>`;
        tp.appendChild(li);
      });
    }

    function openSection(section){
      ['dashboardSection','productsSection'].forEach(id=>document.getElementById(id).classList.add('d-none'));
      document.getElementById(section).classList.remove('d-none');
      // update active link and title
      $$$('.nav-link').forEach(a=>a.classList.remove('active'));
      const map = {dashboard:'#dashboard','orders':'#orders','products':'#products','customers':'#customers','reports':'#reports','settings':'#settings'};
    }

    // product CRUD
    function resetForm(){
      $('#productForm').reset();
      $('#productIndex').value = '';
    }

    function saveProduct(){
      const idx = $('#productIndex').value;
      const newP = {
        name: $('#pName').value.trim(),
        sku: $('#pSku').value.trim(),
        price: parseFloat($('#pPrice').value)||0,
        stock: parseInt($('#pStock').value)||0,
        img: $('#pImage').value || ('https://picsum.photos/seed/' + Math.random().toString(36).slice(2,6) + '/80/80'),
        desc: $('#pDesc').value || ''
      };
      if(!newP.name){ alert('Product name required'); return; }
      if(idx===''){
        products.unshift(newP);
      } else {
        products[parseInt(idx)] = newP;
      }
      const modalEl = document.getElementById('productModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      resetForm();
      renderDashboard();
      syncProductsSection();
    }

    function editProduct(i){
      const p = products[i];
      $('#productIndex').value = i;
      $('#pName').value = p.name;
      $('#pSku').value = p.sku;
      $('#pPrice').value = p.price;
      $('#pStock').value = p.stock;
      $('#pImage').value = p.img;
      $('#pDesc').value = p.desc;
      const modal = new bootstrap.Modal($('#productModal'));
      modal.show();
    }

    function deleteProduct(i){
      if(!confirm('Delete this product?')) return;
      products.splice(i,1);
      renderDashboard();
      syncProductsSection();
    }

    // products section sync
    function syncProductsSection(){
      const tbody = document.querySelector('#productsSectionTable tbody');
      tbody.innerHTML = '';
      products.forEach((p,i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td><img src='${p.img}' class='avatar'></td><td>${p.name}</td><td>${p.sku||''}</td><td>$${p.price.toFixed(2)}</td><td>${p.stock}</td><td><button class='btn btn-sm btn-outline-primary' onclick='editProduct(${i})'>Edit</button></td>`;
        tbody.appendChild(tr);
      });
    }

    // events
    document.addEventListener('DOMContentLoaded', ()=>{
      renderDashboard();
      syncProductsSection();
      document.getElementById('currentYear').innerText = new Date().getFullYear();

      $('#saveProductBtn').addEventListener('click', saveProduct);
      $('#addProductBtn').addEventListener('click', ()=>{ resetForm(); });

      // simple global search (searches products by name)
      $('#globalSearch').addEventListener('input', (e)=>{
        const q = e.target.value.trim().toLowerCase();
        document.querySelectorAll('#productsTable tbody tr').forEach(tr=>{
          const name = tr.children[2]?.innerText.toLowerCase() || '';
          tr.style.display = name.includes(q)?'':'none';
        });
      });

      // export button simple JSON export
      $('#exportBtn').addEventListener('click', ()=>{
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({products,orders},null,2));
        const a = document.createElement('a'); a.setAttribute('href', dataStr); a.setAttribute('download','ecommerce-data.json');
        document.body.appendChild(a); a.click(); a.remove();
      });


      let products = [];

document.getElementById("productForm").addEventListener("submit", function(e){
    e.preventDefault();

    let p = {
        name: document.getElementById("pname").value,
        price: document.getElementById("pprice").value,
        category: document.getElementById("pcategory").value,
        image: document.getElementById("pimage").value,
        desc: document.getElementById("pdesc").value
    };

    products.push(p);
    renderProducts();
});

function renderProducts() {
    let table = "";

    products.forEach(p => {
        table += `
            <tr>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td>${p.category}</td>
                <td><img src="${p.image}" width="60"></td>
                <td>${p.desc}</td>
            </tr>
        `;
    });

    document.getElementById("productTable").innerHTML = table;
}


let categories = [];

document.getElementById("categoryForm").addEventListener("submit", function(e){
    e.preventDefault();

    let name = document.getElementById("categoryName").value;

    categories.push(name);
    document.getElementById("categoryName").value = "";

    renderCategories();
});

function renderCategories() {
    let rows = "";
    let index = 1;

    categories.forEach((name, i) => {
        rows += `
            <tr>
                <td>${index++}</td>
                <td>${name}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${i})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("categoryTable").innerHTML = rows;
}

function deleteCategory(i) {
    categories.splice(i, 1);
    renderCategories();
}


let orders = [
    { id: "1001", customer: "John Doe", total: 150, status: "pending", date: "2025-01-10" },
    { id: "1002", customer: "Emily Clark", total: 230, status: "delivered", date: "2025-01-11" },
    { id: "1003", customer: "Michael Smith", total: 89, status: "processing", date: "2025-01-12" }
];

function renderOrders() {
    let statusFilter = document.getElementById("statusFilter").value;
    let dateFilter = document.getElementById("dateFilter").value;

    let filtered = orders.filter(o => {
        let pass = true;

        if (statusFilter !== "all" && o.status !== statusFilter) {
            pass = false;
        }

        if (dateFilter && o.date !== dateFilter) {
            pass = false;
        }

        return pass;
    });

    let rows = "";

    filtered.forEach(o => {
        rows += `
            <tr>
                <td>${o.id}</td>
                <td>${o.customer}</td>
                <td>$${o.total}</td>
                <td>
                    <span class="badge bg-${o.status === "pending" ? "warning" : o.status === "processing" ? "info" : "success"}">${o.status}</span>
                </td>
                <td>${o.date}</td>
                <td>
                    <button class="btn btn-primary btn-sm">View</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("ordersTable").innerHTML = rows;
}

function resetFilters() {
    document.getElementById("statusFilter").value = "all";
    document.getElementById("dateFilter").value = "";
    renderOrders();
}

renderOrders();

    });

    