(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=i(r);fetch(r.href,a)}})();function E(t){const e=t.startsWith("/")?t:`/${t}`;return e==="/"?"/LushaiTravels/":`${"/LushaiTravels/".replace(/\/$/,"")}${e}`}function U(t){const e="/LushaiTravels/".replace(/\/$/,"");return e?t===e||t===`${e}/`?"/":t.startsWith(`${e}/`)?t.slice(e.length)||"/":t||"/":t||"/"}const w={get:t=>{try{return JSON.parse(localStorage.getItem(t))}catch{return null}},set:(t,e)=>localStorage.setItem(t,JSON.stringify(e)),remove:t=>localStorage.removeItem(t)};function M(){return w.get("lt_user")}function te(t){w.set("lt_user",t)}function ee(){w.remove("lt_user"),window.router.navigate("/")}function O(){return!!M()}function Se(t){var s;const e=w.get("lt_users")||[];if(e.find(r=>r.email===t.email))throw new Error("Email already registered");const i={...t,id:Date.now(),role:"user",createdAt:new Date().toISOString(),avatar:(s=t.fullName)==null?void 0:s.charAt(0).toUpperCase()};return e.push(i),w.set("lt_users",e),te(i),i}function ie(t){var r;const e=w.get("lt_users")||[];if(e.find(a=>a.email===t.email))throw new Error("Email already registered");const i={...t,id:Date.now(),role:"host",status:"pending",createdAt:new Date().toISOString(),avatar:(r=t.name)==null?void 0:r.charAt(0).toUpperCase()};e.push(i),w.set("lt_users",e);const s=w.get("lt_listings")||[];return s.push({...t.listing,hostId:i.id,status:"pending",id:`listing-${Date.now()}`}),w.set("lt_listings",s),te(i),i}function Be(t,e){const s=(w.get("lt_users")||[]).find(r=>r.email===t&&r.password===e);if(!s)throw new Error("Invalid email or password");return te(s),s}function K(t){return(w.get("lt_reviews")||[]).filter(i=>i.listingId===t)}function ye(t){const e=w.get("lt_reviews")||[],i={...t,id:Date.now(),createdAt:new Date().toISOString()};return e.unshift(i),w.set("lt_reviews",e),i}function Te(t){const e=w.get("lt_bookings")||[],i={...t,id:`LT-${Date.now()}`,status:"confirmed",createdAt:new Date().toISOString()};return e.unshift(i),w.set("lt_bookings",e),w.set("lt_last_booking",i),i}function Me(){const t=M();return t?(w.get("lt_bookings")||[]).filter(i=>i.userId===t.id):[]}function Ae(){return w.get("lt_last_booking")}function ae(){return w.get("lt_wishlist")||[]}function fe(t){const e=ae(),i=e.indexOf(t);return i===-1?e.push(t):e.splice(i,1),w.set("lt_wishlist",e),e.includes(t)}function be(t){return ae().includes(t)}function u(t,e="",i="success"){let s=document.querySelector(".toast");s||(s=document.createElement("div"),s.className="toast",document.body.appendChild(s)),s.className=`toast ${i}`,s.innerHTML=`<div class="toast-title">${i==="success"?"✅":"❌"} ${t}</div>${e?`<div class="toast-msg">${e}</div>`:""}`,s.classList.add("show"),setTimeout(()=>s.classList.remove("show"),4e3)}function I(t){return Array.from({length:5},(e,i)=>`<span style="color:${i<Math.round(t)?"#fbbf24":"#334155"};font-size:0.9rem">★</span>`).join("")}function xe(t){return t.length?(t.reduce((e,i)=>e+i.rating,0)/t.length).toFixed(1):0}function le(){window.scrollTo({top:0,behavior:"smooth"})}function de(){var a,o,d;const t=document.getElementById("navbar-container"),e=M(),i=E;t.innerHTML=`
    <nav id="navbar">
      <div class="container nav-inner">
        <a href="${i("/")}" class="nav-logo" data-link>Lushai<span>Trips</span></a>
        <div class="nav-links">
          <a href="${i("/")}" data-link>Home</a>
          <a href="${i("/discover")}" data-link>Discover</a>
          <a href="${i("/stays")}" data-link>Stays</a>
          <a href="${i("/guides")}" data-link>Guides</a>
          <a href="${i("/transport")}" data-link>Transport</a>
          <a href="${i("/surprise")}" data-link>🎲 Surprise Me</a>
        </div>
        <div class="nav-cta">
          ${e?`
            <div class="nav-avatar" id="nav-user-btn" title="${e.fullName||e.name}">${e.avatar||"👤"}</div>
          `:`
            <a href="${i("/login")}" class="btn btn-secondary btn-sm" data-link>Log in</a>
            <a href="${i("/signup-user")}" class="btn btn-primary btn-sm" data-link>Sign up</a>
          `}
          <div class="nav-hamburger" id="hamburger">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <a href="${i("/")}" data-link>🏠 Home</a>
      <a href="${i("/discover")}" data-link>🗺️ Discover</a>
      <a href="${i("/stays")}" data-link>🏡 Stays</a>
      <a href="${i("/guides")}" data-link>👨‍🏫 Guides</a>
      <a href="${i("/transport")}" data-link>🚗 Transport</a>
      <a href="${i("/surprise")}" data-link>🎲 Surprise Me</a>
      <div style="height:1px;background:var(--glass-border);margin:8px 0"></div>
      ${e?`
        <a href="${i("/profile")}" data-link>👤 My Profile</a>
        ${e.role==="host"?`<a href="${i("/host-dashboard")}" data-link>🏠 Host Dashboard</a>`:""}
        <a href="#" id="mobile-logout">🚪 Log out</a>
      `:`
        <a href="${i("/login")}" data-link>Log in</a>
        <a href="${i("/signup-user")}" class="btn btn-primary" data-link style="text-align:center">Sign up</a>
      `}
    </div>
  `,window.addEventListener("scroll",()=>{var n;(n=document.getElementById("navbar"))==null||n.classList.toggle("scrolled",window.scrollY>30)}),(a=document.getElementById("hamburger"))==null||a.addEventListener("click",()=>{var n;(n=document.getElementById("mobile-menu"))==null||n.classList.toggle("open")}),(o=document.getElementById("nav-user-btn"))==null||o.addEventListener("click",()=>{var c;const n=document.createElement("div");n.style.cssText="position:fixed;top:70px;right:24px;background:var(--bg2);border:1px solid var(--glass-border);border-radius:var(--radius);padding:8px;z-index:2000;min-width:180px;animation:fadeIn 0.2s ease",n.innerHTML=`
      <a href="${i("/profile")}" data-link style="display:block;padding:10px 14px;border-radius:8px;color:var(--text-muted);transition:var(--transition)" onmouseover="this.style.background='var(--glass)'" onmouseout="this.style.background=''">👤 My Profile</a>
      ${(e==null?void 0:e.role)==="host"?`<a href="${i("/host-dashboard")}" data-link style="display:block;padding:10px 14px;border-radius:8px;color:var(--text-muted);transition:var(--transition)" onmouseover="this.style.background='var(--glass)'" onmouseout="this.style.background=''">🏠 Host Dashboard</a>`:`<a href="${i("/host-signup-stay")}" data-link style="display:block;padding:10px 14px;border-radius:8px;color:var(--text-muted)" onmouseover="this.style.background='var(--glass)'" onmouseout="this.style.background=''">🏡 Become a Host</a>`}
      <div style="height:1px;background:var(--glass-border);margin:4px 0"></div>
      <button id="dd-logout" style="width:100%;padding:10px 14px;border-radius:8px;background:none;color:#f87171;text-align:left;font-size:0.9rem;cursor:pointer;border:none">🚪 Log out</button>
    `,document.body.appendChild(n),n.querySelectorAll("[data-link]").forEach(p=>{p.addEventListener("click",m=>{m.preventDefault(),window.router.navigate(p.getAttribute("href")),n.remove()})}),setTimeout(()=>document.addEventListener("click",()=>n.remove(),{once:!0}),100),(c=n.querySelector("#dd-logout"))==null||c.addEventListener("click",()=>{ee()})}),(d=document.getElementById("mobile-logout"))==null||d.addEventListener("click",n=>{n.preventDefault(),ee()});const s=U(location.pathname);document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(n=>{const c=n.getAttribute("href");if(!c||c==="#")return;U(new URL(c,window.location.origin).pathname)===s&&n.classList.add("active")})}function Pe(){const t=document.getElementById("footer-container"),e=E;t.innerHTML=`
    <footer id="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">LushaiTrips</div>
            <p style="font-size:0.9rem;color:var(--text-dim);max-width:280px;margin-bottom:20px">Discover, plan, and randomly explore Mizoram's hidden gems. The Northeast's most exciting travel platform.</p>
            <div style="display:flex;gap:12px">
              <a href="#" style="width:38px;height:38px;background:var(--glass);border:1px solid var(--glass-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:var(--transition)" onmouseover="this.style.background='var(--emerald-800)'" onmouseout="this.style.background='var(--glass)'">📘</a>
              <a href="#" style="width:38px;height:38px;background:var(--glass);border:1px solid var(--glass-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:var(--transition)" onmouseover="this.style.background='var(--emerald-800)'" onmouseout="this.style.background='var(--glass)'">📸</a>
              <a href="#" style="width:38px;height:38px;background:var(--glass);border:1px solid var(--glass-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:var(--transition)" onmouseover="this.style.background='var(--emerald-800)'" onmouseout="this.style.background='var(--glass)'">🐦</a>
            </div>
          </div>
          <div>
            <div class="footer-heading">Explore</div>
            <a href="${e("/discover")}" class="footer-link" data-link>All Destinations</a>
            <a href="${e("/stays")}" class="footer-link" data-link>Homestays & Hotels</a>
            <a href="${e("/guides")}" class="footer-link" data-link>Local Guides</a>
            <a href="${e("/transport")}" class="footer-link" data-link>Transport</a>
            <a href="${e("/surprise")}" class="footer-link" data-link>🎲 Surprise Me</a>
          </div>
          <div>
            <div class="footer-heading">Host</div>
            <a href="${e("/host-signup-stay")}" class="footer-link" data-link>List Your Stay</a>
            <a href="${e("/host-signup-guide")}" class="footer-link" data-link>Register as Guide</a>
            <a href="${e("/host-signup-transport")}" class="footer-link" data-link>List Transport</a>
            <a href="${e("/host-dashboard")}" class="footer-link" data-link>Host Dashboard</a>
          </div>
          <div>
            <div class="footer-heading">Company</div>
            <a href="#" class="footer-link">About Mizoram</a>
            <a href="#" class="footer-link">Travel Tips</a>
            <a href="#" class="footer-link">Safety Guide</a>
            <a href="#" class="footer-link">Contact Us</a>
            <a href="#" class="footer-link">Privacy Policy</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 LushaiTrips. Made with 💚 in Mizoram, India. | Payments secured by <strong>Razorpay</strong> | Maps by <strong>Leaflet</strong></p>
        </div>
      </div>
    </footer>
  `}const Ce="modulepreload",De=function(t){return"/LushaiTravels/"+t},ce={},He=function(e,i,s){let r=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),d=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));r=Promise.allSettled(i.map(n=>{if(n=De(n),n in ce)return;ce[n]=!0;const c=n.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${p}`))return;const m=document.createElement("link");if(m.rel=c?"stylesheet":Ce,c||(m.as="script"),m.crossOrigin="",m.href=n,d&&m.setAttribute("nonce",d),document.head.appendChild(m),c)return new Promise((v,b)=>{m.addEventListener("load",v),m.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${n}`)))})}))}function a(o){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=o,window.dispatchEvent(d),!d.defaultPrevented)throw o}return r.then(o=>{for(const d of o||[])d.status==="rejected"&&a(d.reason);return e().catch(a)})},q=[{id:"vantawng-falls",name:"Vantawng Falls",tagline:"India's tallest waterfall in Mizoram",type:"waterfall",tags:["adventure","nature","waterfall"],difficulty:"Moderate",district:"Serchhip",lat:23.0932,lng:92.7534,rating:4.8,reviews:124,coverImage:"/images/2018080738-1024x576.jpg",images:["/images/2018080738-1024x576.jpg","/images/2019072384.jpg","/images/View-of-Vantawng-Waterfall-Cover-Photo-840x425.jpg"],description:"Vantawng Falls, plunging 750 feet into a deep gorge, is the tallest waterfall in Mizoram and one of the most spectacular in Northeast India. Surrounded by lush subtropical forests and mist, this is a must-visit for nature lovers and adventure seekers alike.",highlights:["750-ft plunge pool","Jungle trek","Wildlife sightings","Photography paradise"],bestTime:"October – March",nearbyAttractions:["Serchhip town","Tuirial River","Local bamboo villages"],duration:"1-2 days",category:"adventure"},{id:"phawngpui-peak",name:"Phawngpui Peak",tagline:"Blue Mountain — the highest point in Mizoram",type:"mountain",tags:["adventure","trekking","scenic"],difficulty:"Hard",district:"Lawngtlai",lat:22.4869,lng:93.0248,rating:4.9,reviews:87,coverImage:"/images/Website-Blog-Image-Size-26.jpg",images:["/images/Website-Blog-Image-Size-26.jpg","/images/Website-Blog-Image-Size-29.jpg","/images/Website-Feature-Image-Size-10.jpg"],description:"Standing at 2,157 metres, Phawngpui (Blue Mountain) is the highest peak in Mizoram, offering breathtaking panoramic views of Myanmar across rolling blue-hazed ridges. The national park here protects rare orchids, Himalayan black bears, and hollock gibbons.",highlights:["Sunrise panoramas","Rare orchid species","Wildlife viewing","Cloud sea views"],bestTime:"November – February",nearbyAttractions:["Phawngpui National Park","Sangau border outpost"],duration:"2-3 days",category:"adventure"},{id:"tam-dil-lake",name:"Tam Dil Lake",tagline:"Mirror-still lake in a pine-forested valley",type:"lake",tags:["relaxation","nature","lake"],difficulty:"Easy",district:"Saitual",lat:23.6177,lng:92.8894,rating:4.6,reviews:93,coverImage:"/images/tamdil-lake-mizoram.jpeg",images:["/images/tamdil-lake-mizoram.jpeg","/images/2019072338-1024x576.jpg","/images/2019072384-1-olw9h396o5jhwh510ctk9bwfep94no9o510c4tj0ju.jpg"],description:"Tam Dil Lake is a serene natural lake nested among tall pine trees, perfect for a peaceful picnic, boating, or simply relaxing in nature. The calm waters reflect the surrounding hills like a mirror at dawn, making it a favourite for photographers.",highlights:["Boating","Picnic spots","Pine forest walks","Photography"],bestTime:"Year-round (best Sep – Mar)",nearbyAttractions:["Saitual town","Kelkang","Aizawl (85 km)"],duration:"1 day",category:"relaxation"},{id:"reiek-tlang",name:"Reiek Tlang",tagline:"Rolling hills with traditional Mizo heritage village",type:"hill",tags:["culture","nature","relaxation"],difficulty:"Easy",district:"Mamit",lat:23.7152,lng:92.5694,rating:4.5,reviews:78,coverImage:"/images/caption.jpg",images:["/images/caption.jpg","/images/caption%20(1).jpg","/images/reiek-tlang-view-point-ailawng-mammit-tourist-attraction-XPHYubeNTg.jpg"],description:"Reiek Tlang is a picturesque hill retreat just 30 km from Aizawl, home to a reconstructed traditional Mizo village, walking trails, and breathtaking hillside views. Sunrise here is particularly magical with layers of hills fading into the horizon.",highlights:["Traditional Mizo village","Hiking trails","Sunrise views","Cultural exhibits"],bestTime:"October – April",nearbyAttractions:["Aizawl","Hmuifang","Durtlang Hills"],duration:"1 day",category:"culture"},{id:"palak-dil",name:"Palak Dil Lake",tagline:"Mizoram's largest natural lake, ringed by jungle",type:"lake",tags:["nature","wildlife","relaxation"],difficulty:"Easy",district:"Saiha",lat:22.1627,lng:92.9261,rating:4.7,reviews:56,coverImage:"/images/626bdb1307952_Palak%20lake.jpg",images:["/images/626bdb1307952_Palak%20lake.jpg","/images/626bdb1b5a442_PALAK%20lake%202.jpg","/images/palak-lake-aizawl-mizoram-1-attr-hero.jpeg"],description:"Palak Dil, Mizoram's largest natural lake, lies in the remote Saiha district near the Myanmar border. The lake is surrounded by dense subtropical forest and is a prime migratory bird watching destination. The silence here is extraordinary.",highlights:["Bird watching","Boat rides","Wildlife","Remote wilderness"],bestTime:"November – February",nearbyAttractions:["Saiha town","Phawngpui (nearby)"],duration:"2 days",category:"relaxation"},{id:"champhai",name:"Champhai Valley",tagline:"The fruit bowl of Mizoram with stunning valley views",type:"valley",tags:["nature","culture","relaxation"],difficulty:"Easy",district:"Champhai",lat:23.4692,lng:93.3224,rating:4.6,reviews:102,coverImage:"/images/Paddy-fields-at-Champhai-Mizoram.webp",images:["/images/Paddy-fields-at-Champhai-Mizoram.webp","/images/House-in-a-paddy-field-in-Champhai.webp","/images/1694632131_sweeping_meadows_at_champhai.jpg.webp","/images/6054f244a637b2d8c9a63aa0c66b7056_1000x1000.jpg","/images/62addaa694e9f_Champhai%20Zawl.jpg"],description:'Champhai is known as the "Rice Bowl of Mizoram" and sits at the gateway to Myanmar. The valley is dotted with fruit orchards, paddy fields, and dramatic ridgeline sunsets. Its border town character adds a unique cultural flavour.',highlights:["Valley views","Fruit orchards","Museum","Myanmar border"],bestTime:"October – March",nearbyAttractions:["Rih Dil Lake (Myanmar)","Murlen National Park","Tamdil"],duration:"2-3 days",category:"relaxation"},{id:"murlen-national-park",name:"Murlen National Park",tagline:"One of Northeast India's finest biodiversity hotspots",type:"wildlife",tags:["wildlife","adventure","nature"],difficulty:"Moderate",district:"Champhai",lat:23.65,lng:93.35,rating:4.8,reviews:43,coverImage:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",images:["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80","https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80","https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80"],description:"Murlen National Park, spanning over 100 sq km of pristine forest, is home to leopards, clouded leopards, gibbons, hornbills, and over 150 bird species. Trekking through its silent, ancient forests is a transformative experience.",highlights:["Leopard habitat","Hornbill spotting","Jungle camping","Bird watching"],bestTime:"November – April",nearbyAttractions:["Champhai","Phawngpui Peak"],duration:"2-3 days",category:"adventure"},{id:"hmuifang",name:"Hmuifang Hill Resort",tagline:"Cloud-kissed hill with Aizawl valley panoramas",type:"hill",tags:["relaxation","nature","scenic"],difficulty:"Easy",district:"Aizawl",lat:23.5,lng:92.79,rating:4.4,reviews:67,coverImage:"https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",images:["https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80","https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&q=80"],description:`Just 54 km from Aizawl, Hmuifang is a hill station known as "Mizoram's Shimla." The hilltop resort offers stunning views of the surrounding valleys and the Tlawng River below. Pine forests, cool mountain air, and misty mornings make it ideal for relaxation.`,highlights:["Valley panoramas","Pine forest","Cool climate","Birding"],bestTime:"October – March",nearbyAttractions:["Aizawl","Reiek Tlang","Durtlang"],duration:"1 day",category:"relaxation"},{id:"lengteng-wildlife",name:"Lengteng Wildlife Sanctuary",tagline:"Rare wildlife in Mizoram's remote northeast",type:"wildlife",tags:["wildlife","adventure","nature"],difficulty:"Hard",district:"Champhai",lat:23.85,lng:93.4,rating:4.6,reviews:29,coverImage:"https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80",images:["https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80","https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80"],description:"The Lengteng Wildlife Sanctuary covers 60 sq km of pristine high-altitude forest, sheltering some of Mizoram's rarest species. The journey itself — through remote villages and winding mountain roads — is half the adventure.",highlights:["Rare hornbills","Pristine forest","Remote trails","Camping"],bestTime:"November – March",nearbyAttractions:["Champhai","Murlen National Park"],duration:"2-3 days",category:"adventure"},{id:"lunglei",name:"Lunglei Hills",tagline:`The "Bridge of the Rocks" — Mizoram's southern capital`,type:"hill",tags:["culture","nature","relaxation"],difficulty:"Easy",district:"Lunglei",lat:22.8917,lng:92.7349,rating:4.3,reviews:58,coverImage:"https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&q=80",images:["https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&q=80","https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80","https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80"],description:'Lunglei, the second largest city in Mizoram, sits dramatically on a ridge above verdant valleys. The name means "bridge of rocks." Explore local bazaars, colonial-era churches, and the sweeping viewpoints overlooking the Tlawng river basin.',highlights:["Rock viewpoints","Local markets","Heritage churches","Valley walks"],bestTime:"October – April",nearbyAttractions:["Saikuti Beach","Khawbung","Vantawng Falls (3 hrs)"],duration:"1-2 days",category:"culture"},{id:"aizawl-city",name:"Aizawl City",tagline:"The hilltop capital — where Mizoram's heart beats",type:"city",tags:["culture","food","relaxation"],difficulty:"Easy",district:"Aizawl",lat:23.7271,lng:92.7176,rating:4.5,reviews:211,coverImage:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",images:["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80","https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80"],description:"Aizawl, perched dramatically on ridges at 1,132 m elevation, is one of India's most unique capital cities. Explore the old market (Bara Bazar), taste Mizo cuisine, visit the state museum, and experience the warmth of Mizo hospitality.",highlights:["Bara Bazar","Mizo cuisine","State Museum","Durtlang Hills"],bestTime:"Year-round",nearbyAttractions:["Reiek Tlang","Hmuifang","Tam Dil Lake"],duration:"2-3 days",category:"culture"},{id:"tuipui-river",name:"Tuipui River",tagline:"Pristine river valley for kayaking and fishing",type:"river",tags:["adventure","nature","water"],difficulty:"Moderate",district:"Saiha",lat:22.05,lng:92.9,rating:4.4,reviews:32,coverImage:"https://images.unsplash.com/photo-1503264116251-35a269479413?w=800&q=80",images:["https://images.unsplash.com/photo-1503264116251-35a269479413?w=800&q=80","https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80","https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&q=80"],description:"The Tuipui River flows through the remotest district of Mizoram, creating stunning gorges, crystal-clear pools, and beaches. This is one of the best spots in Northeast India for river kayaking, fishing, and wild camping.",highlights:["Kayaking","Fishing","Wild camping","Gorge walks"],bestTime:"November – March",nearbyAttractions:["Saiha","Palak Dil Lake","Phawngpui"],duration:"2-3 days",category:"adventure"}],je=[{id:"all",label:"All",icon:"🗺️"},{id:"adventure",label:"Adventure",icon:"🧗"},{id:"relaxation",label:"Relaxation",icon:"🌿"},{id:"culture",label:"Culture",icon:"🏛️"},{id:"wildlife",label:"Wildlife",icon:"🦅"},{id:"budget",label:"Budget",icon:"💰"}];function Re(){const t=E,e=q.slice(0,6);return`
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-pattern"></div>
      <div class="hero-glow"></div>
      <div class="hero-glow2"></div>
      <div class="container hero-content" style="padding-top:100px">
        <div class="hero-badge">🌿 Mizoram #1 Discovery Platform</div>
        <h1 class="hero-title">Explore <span class="gradient-text">Mizoram's</span><br>Hidden Gems</h1>
        <p class="hero-subtitle">Don't know where to go? Let the app decide. Discover waterfalls, mountain peaks, and secret lakes across the Lushai Hills.</p>
        <div class="hero-actions">
          <a href="${t("/surprise")}" class="btn btn-amber btn-lg" data-link>🎲 Surprise Me</a>
          <a href="${t("/discover")}" class="btn btn-secondary btn-lg" data-link>Explore Destinations</a>
        </div>
        <div class="hero-stats">
          <div class="stat-item"><div class="stat-num">50+</div><div class="stat-label">Destinations</div></div>
          <div class="stat-item"><div class="stat-num">200+</div><div class="stat-label">Happy Travelers</div></div>
          <div class="stat-item"><div class="stat-num">15+</div><div class="stat-label">Verified Hosts</div></div>
          <div class="stat-item"><div class="stat-num">4.8★</div><div class="stat-label">Avg Rating</div></div>
        </div>
      </div>
      <div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);animation:float 2s ease-in-out infinite;color:var(--text-muted);font-size:1.5rem">↓</div>
    </section>

    <!-- Surprise Strip -->
    <section class="surprise-section section-sm">
      <div class="container text-center">
        <div class="section-label">✨ Our Unique Feature</div>
        <h2 style="margin-bottom:12px">Don't Plan. Just Go.</h2>
        <p style="max-width:500px;margin:0 auto 32px">One tap — get a destination, itinerary, and stay suggestion instantly.</p>
        <a href="${t("/surprise")}" class="btn btn-primary btn-lg" data-link>🎲 Try Surprise Me</a>
      </div>
    </section>

    <!-- Featured Destinations -->
    <section class="section">
      <div class="container">
        <div class="section-label">🗺️ Top Picks</div>
        <div class="flex-between" style="margin-bottom:40px;flex-wrap:wrap;gap:16px">
          <h2 class="section-title" style="margin:0">Featured Destinations</h2>
          <a href="${t("/discover")}" class="btn btn-outline" data-link>View All →</a>
        </div>
        <div class="grid-3">
          ${e.map(i=>`
            <div class="card destination-card animate-in" data-href="/destination/${i.id}">
              <div class="card-img-wrap">
                <img src="${i.coverImage}" alt="${i.name}" loading="lazy" />
                <div class="card-badge">${i.type.toUpperCase()}</div>
                <div class="card-rating">${I(i.rating)} <span>${i.rating}</span></div>
              </div>
              <div class="card-body">
                <h4 class="card-title">${i.name}</h4>
                <div class="card-meta" style="margin-bottom:10px">📍 ${i.district} &nbsp;•&nbsp; ⏱ ${i.duration}</div>
                <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${i.tagline}</p>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  ${i.tags.map(s=>`<span class="tag">${s}</span>`).join("")}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section" style="background:var(--bg2)">
      <div class="container text-center">
        <div class="section-label">🚀 Simple Process</div>
        <h2 style="margin-bottom:48px">How LushaiTrips Works</h2>
        <div class="grid-3">
          ${[{icon:"🎲",step:"1",title:"Discover or Surprise",desc:"Browse 50+ destinations or hit Surprise Me and let us pick the perfect trip for you."},{icon:"📅",step:"2",title:"Book Your Stay",desc:"Choose from verified homestays, lodges, and campsites. Book guides and transport in one place."},{icon:"🌄",step:"3",title:"Explore Mizoram",desc:"Show up, follow your itinerary, and experience Northeast India's best-kept secret."}].map(i=>`
            <div class="card card-body text-center animate-in">
              <div style="font-size:3rem;margin-bottom:16px">${i.icon}</div>
              <div style="width:32px;height:32px;background:var(--emerald-700);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem;margin:0 auto 16px">${i.step}</div>
              <h4 style="margin-bottom:10px">${i.title}</h4>
              <p style="font-size:0.9rem">${i.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- Top Stays Preview -->
    <section class="section">
      <div class="container">
        <div class="section-label">🏡 Top Rated</div>
        <div class="flex-between" style="margin-bottom:40px;flex-wrap:wrap;gap:16px">
          <h2 style="margin:0">Loved by Travelers</h2>
          <a href="${t("/stays")}" class="btn btn-outline" data-link>All Stays →</a>
        </div>
        <div class="grid-3" id="home-stays-grid"></div>
      </div>
    </section>

    <!-- Services Strip -->
    <section class="section" style="background:var(--bg2)">
      <div class="container">
        <h2 class="text-center" style="margin-bottom:40px">Everything You Need</h2>
        <div class="grid-4">
          ${[{icon:"🏡",title:"Homestays",desc:"Authentic Mizo homes",href:"/stays"},{icon:"👨‍🏫",title:"Local Guides",desc:"Expert local experts",href:"/guides"},{icon:"🚗",title:"Transport",desc:"Cars, bikes & more",href:"/transport"},{icon:"⭐",title:"Reviews",desc:"Real verified stays",href:"/stays"}].map(i=>`
            <a href="${t(i.href)}" class="card card-body text-center" data-link style="cursor:pointer">
              <div style="font-size:2.5rem;margin-bottom:12px">${i.icon}</div>
              <h4 style="margin-bottom:6px">${i.title}</h4>
              <p style="font-size:0.85rem">${i.desc}</p>
            </a>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="section" style="background:linear-gradient(135deg,var(--emerald-900),var(--bg3))">
      <div class="container text-center">
        <h2 style="margin-bottom:16px">Have a Stay or Service to List?</h2>
        <p style="margin-bottom:32px;max-width:500px;margin-left:auto;margin-right:auto">Join our curated network of Mizoram hosts. List your homestay, guide service, or transport.</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <a href="${t("/host-signup-stay")}" class="btn btn-primary btn-lg" data-link>🏡 List Your Stay</a>
          <a href="${t("/host-signup-guide")}" class="btn btn-secondary btn-lg" data-link>👨‍🏫 Become a Guide</a>
          <a href="${t("/host-signup-transport")}" class="btn btn-secondary btn-lg" data-link>🚗 List Transport</a>
        </div>
      </div>
    </section>
  `}function qe(){document.querySelectorAll("[data-href]").forEach(t=>{t.addEventListener("click",()=>window.router.navigate(t.dataset.href))}),He(async()=>{const{stays:t}=await Promise.resolve().then(()=>Ue);return{stays:t}},void 0).then(({stays:t})=>{const e=document.getElementById("home-stays-grid");e&&(e.innerHTML=t.slice(0,3).map(i=>`
      <div class="card stay-card animate-in" data-href="/stay/${i.id}">
        <div class="card-img-wrap">
          <img src="${i.coverImage}" alt="${i.name}" loading="lazy" />
          <div class="card-badge">${i.type.toUpperCase()}</div>
          ${i.topRated?'<div style="position:absolute;top:12px;right:12px;background:rgba(245,158,11,0.9);padding:3px 10px;border-radius:50px;font-size:0.72rem;font-weight:700;color:#000">🔥 TOP RATED</div>':""}
          <div class="card-rating">${I(i.rating)} <span>${i.rating}</span></div>
        </div>
        <div class="card-body">
          <h4 class="card-title">${i.name}</h4>
          <div class="card-meta" style="margin-bottom:8px">📍 ${i.location}</div>
          <div class="flex-between">
            <span class="price">₹${i.price.toLocaleString()}<span>/night</span></span>
            <span style="font-size:0.8rem;color:var(--text-muted)">👥 up to ${i.maxGuests}</span>
          </div>
        </div>
      </div>
    `).join(""),document.querySelectorAll(".stay-card[data-href]").forEach(i=>{i.addEventListener("click",()=>window.router.navigate(i.dataset.href))}))})}let Y="all",V="";function Ne(){return`
    <section class="page-hero">
      <div class="container">
        <div class="section-label">🗺️ All Destinations</div>
        <h1>Discover Mizoram</h1>
        <p style="max-width:600px;margin-bottom:32px">Waterfalls, mountain peaks, hidden lakes, wildlife sanctuaries and cultural heartlands — explore them all.</p>
        <div style="position:relative;max-width:500px">
          <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--text-dim);font-size:1.1rem">🔍</span>
          <input type="text" id="discover-search" class="form-input" placeholder="Search destinations…" style="padding-left:44px;border-radius:50px" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Category filter chips -->
        <div class="filter-chips" id="cat-filters" style="justify-content:flex-start;margin-bottom:40px">
          ${je.map(t=>`<div class="chip ${t.id==="all"?"active":""}" data-cat="${t.id}">${t.icon} ${t.label}</div>`).join("")}
        </div>

        <!-- Hidden Gems -->
        <div style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(245,158,11,0.05));border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-lg);padding:28px;margin-bottom:48px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
            <span style="font-size:1.5rem">💎</span>
            <div>
              <div style="font-weight:700;font-size:1.1rem">Hidden Gems</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">Off the beaten path — few tourists, maximum magic</div>
            </div>
          </div>
          <div class="grid-4" id="hidden-gems-grid"></div>
        </div>

        <!-- All Destinations Grid -->
        <div class="flex-between" style="margin-bottom:24px">
          <h3 id="results-count">All Destinations</h3>
        </div>
        <div class="grid-3" id="destinations-grid"></div>
      </div>
    </section>
  `}function Ge(){var t;Z(),Fe(),document.querySelectorAll(".chip[data-cat]").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".chip[data-cat]").forEach(i=>i.classList.remove("active")),e.classList.add("active"),Y=e.dataset.cat,Z()})}),(t=document.getElementById("discover-search"))==null||t.addEventListener("input",e=>{V=e.target.value.toLowerCase(),Z()})}function We(){return q.filter(t=>{const e=Y==="all"||t.category===Y||t.tags.includes(Y),i=!V||t.name.toLowerCase().includes(V)||t.district.toLowerCase().includes(V)||t.type.toLowerCase().includes(V);return e&&i})}function Z(){const t=We(),e=document.getElementById("destinations-grid"),i=document.getElementById("results-count");if(i&&(i.textContent=`${t.length} Destination${t.length!==1?"s":""}`),!!e){if(!t.length){e.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-dim)">😕 No destinations found. Try a different filter.</div>';return}e.innerHTML=t.map(s=>Ve(s)).join(""),e.querySelectorAll("[data-href]").forEach(s=>{s.addEventListener("click",()=>window.router.navigate(s.dataset.href))})}}function Fe(){const t=q.filter(i=>i.reviews<50),e=document.getElementById("hidden-gems-grid");e&&(e.innerHTML=t.slice(0,4).map(i=>`
    <div class="card" data-href="/destination/${i.id}" style="cursor:pointer">
      <div class="card-img-wrap" style="height:160px">
        <img src="${i.coverImage}" alt="${i.name}" loading="lazy" />
        <div class="card-badge">💎 HIDDEN GEM</div>
      </div>
      <div class="card-body" style="padding:14px">
        <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">${i.name}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">📍 ${i.district}</div>
      </div>
    </div>
  `).join(""),e.querySelectorAll("[data-href]").forEach(i=>{i.addEventListener("click",()=>window.router.navigate(i.dataset.href))}))}function Ve(t){const e={Easy:"#10b981",Moderate:"#f59e0b",Hard:"#ef4444"}[t.difficulty]||"#94a3b8";return`
    <div class="card destination-card animate-in" data-href="/destination/${t.id}">
      <div class="card-img-wrap">
        <img src="${t.coverImage}" alt="${t.name}" loading="lazy" />
        <div class="card-badge">${t.type.toUpperCase()}</div>
        <div class="card-rating">${I(t.rating)} <span>${t.rating} (${t.reviews})</span></div>
      </div>
      <div class="card-body">
        <h4 class="card-title">${t.name}</h4>
        <div class="card-meta" style="margin-bottom:10px">
          📍 ${t.district} &nbsp;•&nbsp; ⏱ ${t.duration} &nbsp;•&nbsp;
          <span style="color:${e};font-weight:600">${t.difficulty}</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${t.tagline}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;color:var(--text-muted)">
          <span>🌤 Best: ${t.bestTime}</span>
          <span class="btn btn-outline btn-sm">Explore →</span>
        </div>
      </div>
    </div>
  `}const Q=[{id:"itin-1",destinationId:"vantawng-falls",days:1,title:"1-Day: Vantawng Falls Trail",category:"adventure",stayId:"vantawng-lodge",plan:[{day:1,activities:["7 AM: Arrive Thenzawl","9 AM: Trek to Vantawng Falls (750ft drop!)","12 PM: Picnic lunch near the falls","2 PM: Village walk & bamboo crafts","5 PM: Sunset from ridge viewpoint","7 PM: Mizo dinner at Vantawng Lodge"]}]},{id:"itin-2",destinationId:"phawngpui-peak",days:3,title:"3-Day: Blue Mountain Summit",category:"adventure",stayId:null,plan:[{day:1,activities:["Drive to Lawngtlai (8 hrs from Aizawl)","Base camp setup","Sunset from lower ridge","Campfire dinner"]},{day:2,activities:["5 AM: Summit attempt (2,157m)","10 AM: Myanmar panorama at peak","Afternoon: Wildlife trail","Stargazing night"]},{day:3,activities:["Dawn photography","Rare orchid walk with guide","Return journey","Buy Puan textile souvenirs"]}]},{id:"itin-3",destinationId:"tam-dil-lake",days:1,title:"1-Day: Tam Dil Lake Escape",category:"relaxation",stayId:"tamdil-lakehouse",plan:[{day:1,activities:["9 AM: Drive from Aizawl (2 hrs)","11 AM: Morning boat ride on the lake","1 PM: Lakeside picnic lunch","3 PM: Pine forest walk","5 PM: Golden hour on the lake","7 PM: Return or stay overnight"]}]},{id:"itin-4",destinationId:"champhai",days:2,title:"2-Day: Champhai Valley & Myanmar Views",category:"relaxation",stayId:"champhai-farmstay",plan:[{day:1,activities:["Morning: Drive to Champhai (157 km)","Afternoon: Farm visit & fruit picking","Evening: Myanmar border viewpoint sunset","Night: Traditional Mizo dinner with family"]},{day:2,activities:["Dawn: Valley fog photography","Morning: Champhai museum & market","Afternoon: Murlen National Park entry","Evening: Return to Aizawl"]}]},{id:"itin-5",destinationId:"reiek-tlang",days:1,title:"1-Day: Reiek Heritage Village",category:"culture",stayId:"bamboo-haven",plan:[{day:1,activities:["8 AM: Depart Aizawl","9:30 AM: Reiek traditional village walk","11 AM: Mizo cultural exhibits","1 PM: Lunch at village café","3 PM: Hilltop panoramic viewpoint","5 PM: Return or Bamboo Haven overnight"]}]},{id:"itin-6",destinationId:"palak-dil",days:2,title:"2-Day: Palak Dil & Saiha Wilderness",category:"wildlife",stayId:null,plan:[{day:1,activities:["Early morning departure from Aizawl","Afternoon: Arrive Saiha","Evening: Palak Dil lake sunset cruise","Night: Forest lodge stay"]},{day:2,activities:["5 AM: Bird watching (migratory species)","Morning: Jungle trail with local guide","Afternoon: Return journey"]}]}],A=[{id:"bamboo-haven",name:"Bamboo Haven Homestay",type:"Homestay",host:{name:"Liana Hnamte",avatar:"LH",phone:"+91 98765 43210",since:"2022"},location:"Reiek Village, Mamit District",lat:23.7152,lng:92.5694,price:1800,maxGuests:4,rooms:2,rating:4.9,reviews:47,coverImage:"https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",images:["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80","https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80","https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80","https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"],amenities:["WiFi","Parking","Home-cooked Food","Hot Water","Valley View","Bonfire"],description:"Nestled in traditional Mizo style on the slopes of Reiek Hill, Bamboo Haven offers an intimate, authentic experience. Wake up to misty valley views, eat home-cooked Mizo meals, and fall asleep to the sounds of the forest. Our family has lived here for generations.",about:"Liana and her family offer warm Mizo hospitality in their traditional home.",nearbyAttractions:["Reiek Heritage Village (5 min)","Hmuifang (45 min)","Aizawl (35 km)"],checkIn:"14:00",checkOut:"11:00",rules:["No smoking inside","Quiet hours after 10 PM","No outside food","Pets on request"],topRated:!0,verified:!0,tags:["hidden-gem","budget-friendly"]},{id:"champhai-farmstay",name:"Champhai Valley Farmstay",type:"Homestay",host:{name:"Mimi Lalhmangaihi",avatar:"ML",phone:"+91 65432 10987",since:"2022"},location:"Champhai, Champhai District",lat:23.4692,lng:93.3224,price:1500,maxGuests:4,rooms:2,rating:4.6,reviews:54,coverImage:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",images:["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80","https://images.unsplash.com/photo-1474978528675-4a50a4508dc4?w=800&q=80","https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80","https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"],amenities:["Organic Farm","Home-cooked Food","Fruit Picking","Valley View","Parking","Hot Water"],description:"Experience life on a working Mizo farm in the fruit bowl of Champhai. Pick fresh oranges, help with the harvest, cook traditional recipes, and fall asleep looking at Myanmar across the valley. The most authentic rural Mizoram experience.",about:"Mimi's family has farmed this land for 3 generations. She loves sharing Mizo culture through food.",nearbyAttractions:["Myanmar border viewpoint","Champhai museum","Murlen National Park (2 hrs)"],checkIn:"14:00",checkOut:"11:00",rules:["Farm work is optional but encouraged","Organic produce only","Early breakfast at 7 AM"],topRated:!1,verified:!0,tags:["farm-experience","budget-friendly"]},{id:"tamdil-lakehouse",name:"Tam Dil Lakehouse",type:"Hotel",host:{name:"Robert Lalthanmawia",avatar:"RL",phone:"+91 54321 09876",since:"2020"},location:"Tam Dil, Saitul District",lat:23.6177,lng:92.8894,price:3200,maxGuests:2,rooms:1,rating:4.9,reviews:89,coverImage:"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",images:["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80","https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80","https://images.unsplash.com/photo-1602343168117-bb8ded4c97a2?w=800&q=80","https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"],amenities:["Lakefront Room","Kayaking","WiFi","AC","Restaurant","Hot Water","Parking","Sunrise View"],description:"Perched right on the edge of the mirror-calm Tam Dil Lake, this boutique lakehouse offers Mizoram's most romantic stay. The floor-to-ceiling windows reflect the lake, the pine forest, and the stars. Breakfast is served on your private deck.",about:"Robert built this lakehouse himself, inspired by Scandinavian architecture and Mizo craftsmanship.",nearbyAttractions:["Tam Dil Lake (on property)","Tam Dil sanctuary","Saitul (30 min)"],checkIn:"15:00",checkOut:"11:00",rules:["Adults only","No loud parties","Checkout strictly at 11 AM"],topRated:!0,verified:!0,tags:["romantic","lakefront","premium"]}],Ue=Object.freeze(Object.defineProperty({__proto__:null,stays:A},Symbol.toStringTag,{value:"Module"})),Oe=[{id:"all",label:"✨ Any Vibe",icon:"🎲"},{id:"adventure",label:"🧗 Adventure"},{id:"relaxation",label:"🌿 Relaxation"},{id:"culture",label:"🏛️ Culture"},{id:"wildlife",label:"🦅 Wildlife"},{id:"budget",label:"💰 Budget"}];let J="all",X=!1;function _e(){return`
    <section class="page-hero text-center">
      <div class="container">
        <div class="hero-badge" style="justify-content:center">🎲 Our Signature Feature</div>
        <h1>Surprise Me</h1>
        <p class="hero-subtitle" style="margin:0 auto">Don't know where to go? Let LushaiTrips pick your perfect Mizoram adventure — destination, itinerary, and stay included.</p>
      </div>
    </section>

    <section class="section">
      <div class="container text-center">
        <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:20px">Filter by vibe (optional)</p>
        <div class="filter-chips" id="surprise-filters">
          ${Oe.map(t=>`<div class="chip ${t.id==="all"?"active":""}" data-filter="${t.id}">${t.label}</div>`).join("")}
        </div>

        <button class="dice-btn" id="dice-btn" title="Surprise Me!">🎲</button>
        <p style="color:var(--text-muted);margin-top:-16px;margin-bottom:32px">Tap the dice to discover</p>

        <!-- Rolling animation -->
        <div id="rolling" class="hidden">
          <div class="loading-spinner"></div>
          <p style="margin-top:16px;color:var(--text-muted);animation:pulse-glow 1s infinite">Finding your perfect trip…</p>
        </div>

        <!-- Result -->
        <div class="surprise-result" id="surprise-result">
          <div class="result-card" id="result-card"></div>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:24px">
            <button class="btn btn-secondary" id="reroll-btn">🎲 Try Another</button>
            <button class="btn btn-primary" id="book-result-btn">Book This Trip →</button>
          </div>
        </div>
      </div>
    </section>
  `}function Ye(){var t,e;document.querySelectorAll(".chip[data-filter]").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".chip[data-filter]").forEach(s=>s.classList.remove("active")),i.classList.add("active"),J=i.dataset.filter})}),(t=document.getElementById("dice-btn"))==null||t.addEventListener("click",pe),(e=document.getElementById("reroll-btn"))==null||e.addEventListener("click",pe)}function pe(){if(X)return;X=!0;const t=document.getElementById("rolling"),e=document.getElementById("surprise-result"),i=document.getElementById("dice-btn");e.classList.remove("show"),t.classList.remove("hidden"),i.style.animation="spin 0.5s linear infinite",setTimeout(()=>{var d,n;t.classList.add("hidden"),i.style.animation="float 3s ease-in-out infinite";const s=J==="all"?q:q.filter(c=>c.category===J||c.tags.includes(J)),r=s[Math.floor(Math.random()*s.length)]||q[0],a=Q.find(c=>c.destinationId===r.id)||Q[Math.floor(Math.random()*Q.length)],o=A.find(c=>c.id===(a==null?void 0:a.stayId))||A[Math.floor(Math.random()*A.length)];document.getElementById("result-card").innerHTML=Je(r,a,o),e.classList.add("show"),(d=document.getElementById("book-result-btn"))==null||d.addEventListener("click",()=>{window.router.navigate(`/stay/${o.id}`)}),(n=document.getElementById("view-dest-btn"))==null||n.addEventListener("click",()=>{window.router.navigate(`/destination/${r.id}`)}),X=!1},1800)}function Je(t,e,i){return`
    <img src="${t.coverImage}" alt="${t.name}" class="result-img" />
    <div class="result-body text-left">
      <div class="duration-badge">📅 ${(e==null?void 0:e.days)||1}-Day Trip • ${t.district} District</div>
      <h2 style="margin-bottom:8px">${(e==null?void 0:e.title)||t.name+" Adventure"}</h2>
      <p style="margin-bottom:20px">${t.description.slice(0,160)}…</p>

      <h4 style="margin-bottom:12px">📍 Your Itinerary</h4>
      <ul class="itinerary-list">
        ${((e==null?void 0:e.plan)||[]).flatMap(s=>s.activities.slice(0,3).map(r=>`<li><span class="day-badge">Day ${s.day}</span> ${r}</li>`)).slice(0,6).join("")}
      </ul>

      ${i?`
        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:20px;margin-top:24px">
          <div style="font-size:0.8rem;font-weight:700;color:var(--emerald-400);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px">🏡 Suggested Stay</div>
          <div style="display:flex;align-items:center;gap:14px">
            <img src="${i.coverImage}" style="width:72px;height:72px;border-radius:12px;object-fit:cover" />
            <div>
              <div style="font-weight:700;margin-bottom:4px">${i.name}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">${i.type} • ${i.location}</div>
              <div style="color:var(--emerald-400);font-weight:700;margin-top:4px">₹${i.price.toLocaleString()}/night</div>
            </div>
          </div>
        </div>
      `:""}

      <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap">
        ${t.highlights.map(s=>`<span class="tag">✓ ${s}</span>`).join("")}
      </div>
      <button class="btn btn-outline mt-16" id="view-dest-btn">View Destination Details</button>
    </div>
  `}function Ke(t){const e=E,i=q.find(o=>o.id===t);if(!i)return'<div class="page-hero container"><h1>Destination not found</h1></div>';const s=A.filter(o=>o.location.toLowerCase().includes(i.district.toLowerCase())).slice(0,2),r=K(`dest-${t}`),a=xe(r);return`
    <!-- Gallery Hero -->
    <div style="padding-top:76px">
      <div class="gallery container" style="margin-top:20px">
        <div class="gallery-main" onclick="openLightbox(0,'${t}')">
          <img src="${i.images[0]}" alt="${i.name}" />
        </div>
        ${i.images.slice(1,3).map((o,d)=>`
          <div class="gallery-thumb" onclick="openLightbox(${d+1},'${t}')">
            <img src="${o}" alt="${i.name} ${d+2}" />
          </div>
        `).join("")}
        ${i.images[3]?`
          <div class="gallery-thumb gallery-more" data-more="📷 View all" onclick="openLightbox(3,'${t}')">
            <img src="${i.images[3]}" alt="more" />
          </div>`:""}
      </div>
    </div>

    <div class="container">
      <div class="detail-layout">
        <!-- Left: Info -->
        <div>
          <!-- Title -->
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:8px">
            <h1 style="font-size:clamp(1.8rem,4vw,2.8rem)">${i.name}</h1>
            <button id="wishlist-btn" style="background:var(--glass);border:1px solid var(--glass-border);border-radius:50%;width:46px;height:46px;font-size:1.3rem;cursor:pointer;flex-shrink:0;transition:var(--transition)">${be(`dest-${t}`)?"❤️":"🤍"}</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:20px">
            <div style="display:flex;gap:4px;align-items:center">${I(i.rating)} <strong>${i.rating}</strong> <span style="color:var(--text-muted)">(${i.reviews} reviews)</span></div>
            <span style="color:var(--text-dim)">•</span>
            <span>📍 ${i.district} District</span>
            <span style="color:var(--text-dim)">•</span>
            <span>⏱ ${i.duration}</span>
            <span style="color:var(--text-dim)">•</span>
            <span style="color:${{Easy:"#10b981",Moderate:"#f59e0b",Hard:"#ef4444"}[i.difficulty]}">● ${i.difficulty}</span>
          </div>

          <div class="divider-h"></div>
          <h3 style="margin-bottom:12px">About this Place</h3>
          <p style="margin-bottom:24px">${i.description}</p>

          <!-- Highlights -->
          <h3 style="margin-bottom:16px">✨ Highlights</h3>
          <div class="amenities-grid" style="margin-bottom:32px">
            ${i.highlights.map(o=>`<div class="amenity-item"><span class="amenity-icon">✅</span><span class="amenity-label">${o}</span></div>`).join("")}
          </div>

          <!-- Best time & Nearby -->
          <div class="grid-2" style="margin-bottom:32px">
            <div class="card card-body">
              <div style="font-size:1.5rem;margin-bottom:8px">🌤</div>
              <div style="font-weight:700;margin-bottom:4px">Best Time to Visit</div>
              <div style="color:var(--text-muted)">${i.bestTime}</div>
            </div>
            <div class="card card-body">
              <div style="font-size:1.5rem;margin-bottom:8px">🗺️</div>
              <div style="font-weight:700;margin-bottom:4px">Nearby Attractions</div>
              <ul style="list-style:none;color:var(--text-muted);font-size:0.9rem">${i.nearbyAttractions.map(o=>`<li>• ${o}</li>`).join("")}</ul>
            </div>
          </div>

          <!-- Map -->
          <h3 style="margin-bottom:16px">📍 Location</h3>
          <div id="dest-map" class="map-container" style="margin-bottom:32px"></div>

          <!-- Tags -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px">
            ${i.tags.map(o=>`<span class="tag">${o}</span>`).join("")}
          </div>

          <!-- Reviews -->
          <div class="divider-h"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px">
            <h3>${a>0?`⭐ ${a} · `:""}${r.length} Review${r.length!==1?"s":""}</h3>
            <button class="btn btn-outline btn-sm" id="write-review-btn">✍️ Write a Review</button>
          </div>

          <div id="reviews-list">
            ${r.length?r.map(o=>we(o)).join(""):'<p style="color:var(--text-muted)">No reviews yet. Be the first!</p>'}
          </div>

          <!-- Write Review (hidden) -->
          <div id="review-form" class="hidden" style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:28px;margin-top:24px">
            <h4 style="margin-bottom:20px">Share Your Experience</h4>
            <div class="form-group">
              <label class="form-label">Rating</label>
              <div class="star-input" id="star-input">
                ${[5,4,3,2,1].map(o=>`<input type="radio" name="rating" id="r${o}" value="${o}"><label for="r${o}">★</label>`).join("")}
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Your Review</label>
              <textarea class="form-textarea" id="review-text" placeholder="Tell others about your experience…"></textarea>
            </div>
            <button class="btn btn-primary" id="submit-review-btn">Submit Review</button>
          </div>

          <!-- Nearby Stays -->
          ${s.length?`
            <div class="divider-h"></div>
            <h3 style="margin-bottom:24px">🏡 Stays Near ${i.name}</h3>
            <div class="grid-2">
              ${s.map(o=>`
                <div class="card" data-href="/stay/${o.id}" style="cursor:pointer">
                  <div class="card-img-wrap" style="height:160px"><img src="${o.coverImage}" alt="${o.name}" loading="lazy" /></div>
                  <div class="card-body">
                    <div style="font-weight:700">${o.name}</div>
                    <div style="display:flex;justify-content:space-between;margin-top:8px">
                      <span class="price" style="font-size:1rem">₹${o.price.toLocaleString()}<span>/night</span></span>
                      <span>${I(o.rating)} ${o.rating}</span>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          `:""}
        </div>

        <!-- Right: Quick actions -->
        <div>
          <div class="booking-widget">
            <div style="font-family:var(--font-head);font-size:1.1rem;font-weight:700;margin-bottom:12px">🌄 Plan a Trip Here</div>
            <div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:20px">Find stays, guides, and transport for ${i.name}.</div>
            <a href="${e("/stays")}" class="btn btn-primary w-full" data-link style="justify-content:center;margin-bottom:12px">🏡 Browse Stays</a>
            <a href="${e("/guides")}" class="btn btn-secondary w-full" data-link style="justify-content:center;margin-bottom:12px">👨‍🏫 Hire a Guide</a>
            <a href="${e("/transport")}" class="btn btn-secondary w-full" data-link style="justify-content:center;margin-bottom:20px">🚗 Book Transport</a>
            <a href="${e("/surprise")}" class="btn btn-amber w-full" data-link style="justify-content:center">🎲 Surprise Me</a>
            <div class="divider-h"></div>
            <div style="font-size:0.85rem;color:var(--text-muted);text-align:center">🔒 Secure payments via Razorpay</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div class="lightbox" id="lightbox">
      <button class="lightbox-close" id="lb-close">✕</button>
      <button class="lightbox-prev" id="lb-prev">‹</button>
      <img id="lb-img" src="" alt="Gallery" />
      <button class="lightbox-next" id="lb-next">›</button>
    </div>
  `}function Ze(t){var r,a,o,d,n,c;const e=q.find(p=>p.id===t);if(!e)return;setTimeout(()=>{const p=document.getElementById("dest-map");if(!p||p._leaflet_id)return;const m=L.map("dest-map").setView([e.lat,e.lng],11);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(m),L.marker([e.lat,e.lng]).addTo(m).bindPopup(`<b>${e.name}</b><br>${e.district} District`).openPopup()},100);const i=e.images;let s=0;window.openLightbox=p=>{s=p,document.getElementById("lb-img").src=i[s],document.getElementById("lightbox").classList.add("open")},(r=document.getElementById("lb-close"))==null||r.addEventListener("click",()=>document.getElementById("lightbox").classList.remove("open")),(a=document.getElementById("lb-prev"))==null||a.addEventListener("click",()=>{s=(s-1+i.length)%i.length,document.getElementById("lb-img").src=i[s]}),(o=document.getElementById("lb-next"))==null||o.addEventListener("click",()=>{s=(s+1)%i.length,document.getElementById("lb-img").src=i[s]}),(d=document.getElementById("wishlist-btn"))==null||d.addEventListener("click",()=>{const p=document.getElementById("wishlist-btn"),m=fe(`dest-${t}`);p.textContent=m?"❤️":"🤍",u(m?"Added to Wishlist":"Removed from Wishlist")}),(n=document.getElementById("write-review-btn"))==null||n.addEventListener("click",()=>{if(!O()){u("Login required","Please log in to write a review","error");return}document.getElementById("review-form").classList.toggle("hidden")}),(c=document.getElementById("submit-review-btn"))==null||c.addEventListener("click",()=>{var f,y,g;const p=parseInt(((f=document.querySelector('input[name="rating"]:checked'))==null?void 0:f.value)||0),m=(g=(y=document.getElementById("review-text"))==null?void 0:y.value)==null?void 0:g.trim();if(!p){u("Please select a rating","","error");return}if(!m){u("Please write your review","","error");return}const v=M();ye({listingId:`dest-${t}`,rating:p,text:m,userName:v.fullName||v.name,userAvatar:v.avatar}),u("Review submitted! ⭐"),document.getElementById("review-form").classList.add("hidden");const b=K(`dest-${t}`);document.getElementById("reviews-list").innerHTML=b.map(h=>we(h)).join("")}),document.querySelectorAll("[data-href]").forEach(p=>{p.addEventListener("click",()=>window.router.navigate(p.dataset.href))})}function we(t){var e;return`
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${t.userAvatar||((e=t.userName)==null?void 0:e.charAt(0))||"?"}</div>
        <div class="review-meta">
          <div class="review-name">${t.userName}</div>
          <div class="review-date">${new Date(t.createdAt).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</div>
        </div>
        <div style="margin-left:auto">${I(t.rating)}</div>
      </div>
      <p class="review-text">${t.text}</p>
      <span class="verified-badge">✅ Verified Visit</span>
    </div>
  `}function Qe(){return`
    <section class="page-hero">
      <div class="container">
        <div class="section-label">🏡 Where to Stay</div>
        <h1>Stays in Mizoram</h1>
        <p style="max-width:600px;margin-bottom:32px">Handpicked homestays, lodges, and camps. Every host is verified and every experience is authentic.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          ${["All","Homestay","Hotel","Lodge","Camping"].map((t,e)=>`<div class="chip ${e===0?"active":""}" data-type="${t.toLowerCase()}">${t}</div>`).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid-3" id="stays-grid"></div>
      </div>
    </section>
  `}function Xe(){let t="all";const e=()=>{const i=t==="all"?A:A.filter(s=>s.type.toLowerCase()===t);document.getElementById("stays-grid").innerHTML=i.map(et).join(""),document.querySelectorAll("[data-href]").forEach(s=>s.addEventListener("click",()=>window.router.navigate(s.dataset.href)))};e(),document.querySelectorAll(".chip[data-type]").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".chip[data-type]").forEach(s=>s.classList.remove("active")),i.classList.add("active"),t=i.dataset.type,e()})})}function et(t){return`
    <div class="card stay-card" data-href="/stay/${t.id}">
      <div class="card-img-wrap">
        <img src="${t.coverImage}" alt="${t.name}" loading="lazy" />
        <div class="card-badge">${t.type.toUpperCase()}</div>
        ${t.topRated?'<div style="position:absolute;top:12px;right:12px;background:rgba(245,158,11,0.9);backdrop-filter:blur(8px);padding:4px 10px;border-radius:50px;font-size:0.72rem;font-weight:700;color:#000">🔥 TOP RATED</div>':""}
        <div class="card-rating">${I(t.rating)} <span>${t.rating} (${t.reviews})</span></div>
      </div>
      <div class="card-body">
        <h4 class="card-title">${t.name}</h4>
        <div class="card-meta" style="margin-bottom:8px">📍 ${t.location}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          ${t.amenities.slice(0,3).map(e=>`<span class="tag" style="font-size:0.72rem">${e}</span>`).join("")}
          ${t.amenities.length>3?`<span class="tag" style="font-size:0.72rem">+${t.amenities.length-3} more</span>`:""}
        </div>
        <div class="flex-between">
          <span class="price">₹${t.price.toLocaleString()}<span>/night</span></span>
          <span style="font-size:0.8rem;color:var(--text-muted)">👥 Max ${t.maxGuests}</span>
        </div>
      </div>
    </div>
  `}function tt(t){const e=A.find(r=>r.id===t);if(!e)return'<div class="page-hero container"><h1>Stay not found</h1></div>';const i=K(t),s=xe(i);return`
    <div style="padding-top:76px">
      <!-- Gallery -->
      <div class="container" style="margin-top:20px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px">
          <div>
            <h1 style="font-size:clamp(1.5rem,3vw,2.2rem);margin-bottom:6px">${e.name}</h1>
            <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:0.9rem;color:var(--text-muted)">
              ${I(s>0?s:e.rating)} <strong style="color:var(--text)">${s>0?s:e.rating}</strong>
              <span>(${i.length||e.reviews} reviews)</span> •
              <span>📍 ${e.location}</span> •
              ${e.verified?'<span style="color:var(--emerald-400)">✅ Verified</span>':""}
              ${e.topRated?'<span class="top-rated-badge">🔥 Top Rated</span>':""}
            </div>
          </div>
          <div style="display:flex;gap:10px">
            <button id="wishlist-btn" style="background:var(--glass);border:1px solid var(--glass-border);border-radius:50px;padding:8px 16px;color:var(--text);cursor:pointer;font-size:0.9rem">${be(t)?"❤️ Saved":"🤍 Save"}</button>
          </div>
        </div>

        <!-- Photo Gallery -->
        <div class="gallery" style="margin-bottom:0">
          <div class="gallery-main" onclick="openStayLightbox(0)"><img src="${e.images[0]}" alt="${e.name}" /></div>
          ${e.images.slice(1,3).map((r,a)=>`<div class="gallery-thumb" onclick="openStayLightbox(${a+1})"><img src="${r}" alt="${e.name}" /></div>`).join("")}
          ${e.images[3]?`<div class="gallery-thumb gallery-more" data-more="📷 All photos" onclick="openStayLightbox(3)"><img src="${e.images[3]}" alt="more" /></div>`:""}
        </div>
        <div style="margin-bottom:4px;margin-top:6px">
          <span style="font-size:0.75rem;color:var(--emerald-400);background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);padding:3px 10px;border-radius:50px">📸 Real Photos Verified</span>
        </div>
      </div>

      <div class="container">
        <div class="detail-layout">
          <!-- LEFT -->
          <div>
            <!-- Host Info -->
            <div style="display:flex;align-items:center;gap:16px;padding:24px 0;border-bottom:1px solid var(--glass-border);margin-bottom:28px">
              <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--emerald-600),var(--emerald-800));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.3rem;flex-shrink:0">${e.host.avatar}</div>
              <div>
                <div style="font-weight:700;font-size:1rem">${e.type} hosted by ${e.host.name}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">Hosting since ${e.host.since} · ${e.rooms} room${e.rooms>1?"s":""} · Up to ${e.maxGuests} guests</div>
              </div>
            </div>

            <h3 style="margin-bottom:12px">About this place</h3>
            <p style="margin-bottom:28px">${e.description}</p>

            <h3 style="margin-bottom:16px">🛎 Amenities</h3>
            <div class="amenities-grid" style="margin-bottom:32px">
              ${e.amenities.map(r=>`<div class="amenity-item"><span class="amenity-icon">${{WiFi:"📶",Parking:"🅿️","Home-cooked Food":"🍛","Breakfast Included":"🥐","Hot Water":"🚿","Valley View":"🌄",Bonfire:"🔥","Waterfall View":"💦","Guide Service":"🧭","Tents Provided":"⛺",Campfire:"🔥","Meals Included":"🍽️","Mountain Guide":"🧗",Stargazing:"🔭","Trekking Gear":"🎒","Organic Farm":"🌱","Fruit Picking":"🍊",Kayaking:"🚣",AC:"❄️",Restaurant:"🍴","Sunrise View":"🌅",Lakefront:"💧"}[r]||"✓"}</span><span class="amenity-label">${r}</span></div>`).join("")}
            </div>

            <h3 style="margin-bottom:16px">📅 Availability & Rules</h3>
            <div class="grid-2" style="margin-bottom:32px">
              <div class="card card-body">
                <div style="font-weight:700;margin-bottom:12px">Check-in / Check-out</div>
                <div style="color:var(--text-muted);font-size:0.9rem">Check-in: <strong style="color:var(--text)">${e.checkIn}</strong></div>
                <div style="color:var(--text-muted);font-size:0.9rem;margin-top:6px">Check-out: <strong style="color:var(--text)">${e.checkOut}</strong></div>
              </div>
              <div class="card card-body">
                <div style="font-weight:700;margin-bottom:12px">House Rules</div>
                <ul style="list-style:none;font-size:0.85rem;color:var(--text-muted)">
                  ${e.rules.map(r=>`<li style="margin-bottom:4px">• ${r}</li>`).join("")}
                </ul>
              </div>
            </div>

            <h3 style="margin-bottom:16px">📍 Location</h3>
            <div id="stay-map" class="map-container" style="margin-bottom:32px"></div>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:8px">📍 ${e.location}</p>
            <div style="margin-bottom:32px">
              ${e.nearbyAttractions.map(r=>`<div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px">→ ${r}</div>`).join("")}
            </div>

            <!-- Reviews -->
            <div class="divider-h"></div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px">
              <h3>${s>0?`⭐ ${s} · `:`⭐ ${e.rating} · `}${i.length||e.reviews} Reviews</h3>
              <button class="btn btn-outline btn-sm" id="write-review-btn">✍️ Write a Review</button>
            </div>
            <div id="reviews-list">
              ${i.length?i.map(r=>se(r)).join(""):at()}
            </div>
            <div id="review-form" class="hidden" style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:28px;margin-top:24px">
              <h4 style="margin-bottom:20px">Share Your Experience</h4>
              <div class="form-group">
                <label class="form-label">Rating</label>
                <div class="star-input">${[5,4,3,2,1].map(r=>`<input type="radio" name="rating" id="r${r}" value="${r}"><label for="r${r}">★</label>`).join("")}</div>
              </div>
              <div class="form-group">
                <label class="form-label">Your Review</label>
                <textarea class="form-textarea" id="review-text" placeholder="Tell others about your experience…"></textarea>
              </div>
              <button class="btn btn-primary" id="submit-review-btn">Submit Review</button>
            </div>
          </div>

          <!-- RIGHT: Booking Widget -->
          <div>
            <div class="booking-widget">
              <div class="booking-price">
                <span class="price" style="font-size:1.6rem">₹${e.price.toLocaleString()}</span>
                <span style="color:var(--text-muted)">/night</span>
                <div style="display:flex;gap:4px;margin-top:6px">${I(s>0?s:e.rating)} <span style="font-size:0.85rem;color:var(--text-muted)">${i.length||e.reviews} reviews</span></div>
              </div>
              <div class="booking-dates">
                <div class="booking-date-field"><label>CHECK-IN</label><input type="date" id="checkin-date" /></div>
                <div class="booking-date-field"><label>CHECK-OUT</label><input type="date" id="checkout-date" /></div>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em">Guests</label>
                <select class="form-select" id="guests-count">
                  ${Array.from({length:e.maxGuests},(r,a)=>`<option value="${a+1}">${a+1} guest${a>0?"s":""}</option>`).join("")}
                </select>
              </div>
              <div id="price-breakdown" style="margin-bottom:16px"></div>
              <button class="btn btn-primary w-full" id="book-now-btn" style="justify-content:center;font-size:1rem;padding:16px">Reserve & Pay →</button>
              <p style="text-align:center;font-size:0.8rem;color:var(--text-muted);margin-top:12px">🔒 Secured by Razorpay · You won't be charged yet</p>

              <div class="divider-h"></div>
              <div style="font-weight:700;margin-bottom:12px">Contact Host</div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px">📞 ${e.host.phone}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">💬 Usually replies within 2 hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lightbox" id="lightbox">
      <button class="lightbox-close" id="lb-close">✕</button>
      <button class="lightbox-prev" id="lb-prev">‹</button>
      <img id="lb-img" src="" alt="Gallery" />
      <button class="lightbox-next" id="lb-next">›</button>
    </div>
  `}function it(t){var c,p,m,v,b,f,y;const e=A.find(g=>g.id===t);if(!e)return;const i=new Date,s=new Date(i);s.setDate(s.getDate()+1);const r=g=>g.toISOString().split("T")[0],a=document.getElementById("checkin-date"),o=document.getElementById("checkout-date");a&&(a.value=r(i)),o&&(o.value=r(s));const d=()=>{const g=new Date(a==null?void 0:a.value),h=new Date(o==null?void 0:o.value),x=Math.max(1,Math.round((h-g)/864e5)),k=x*e.price,$=document.getElementById("price-breakdown");$&&($.innerHTML=`
      <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted);margin-bottom:6px">
        <span>₹${e.price.toLocaleString()} × ${x} night${x>1?"s":""}</span><span>₹${(x*e.price).toLocaleString()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted);margin-bottom:6px">
        <span>Service fee</span><span>₹${Math.round(k*.05).toLocaleString()}</span>
      </div>
      <div style="height:1px;background:var(--glass-border);margin:10px 0"></div>
      <div style="display:flex;justify-content:space-between;font-weight:700">
        <span>Total</span><span>₹${Math.round(k*1.05).toLocaleString()}</span>
      </div>
    `)};d(),a==null||a.addEventListener("change",d),o==null||o.addEventListener("change",d),(c=document.getElementById("book-now-btn"))==null||c.addEventListener("click",()=>{var z;const g=a==null?void 0:a.value,h=o==null?void 0:o.value,x=(z=document.getElementById("guests-count"))==null?void 0:z.value;if(!g||!h){u("Please select dates","","error");return}const k=Math.max(1,Math.round((new Date(h)-new Date(g))/864e5)),$=Math.round(k*e.price*1.05);window.router.navigate(`/book/${t}?checkin=${g}&checkout=${h}&guests=${x}&total=${$}`)});let n=0;window.openStayLightbox=g=>{n=g,document.getElementById("lb-img").src=e.images[n],document.getElementById("lightbox").classList.add("open")},(p=document.getElementById("lb-close"))==null||p.addEventListener("click",()=>document.getElementById("lightbox").classList.remove("open")),(m=document.getElementById("lb-prev"))==null||m.addEventListener("click",()=>{n=(n-1+e.images.length)%e.images.length,document.getElementById("lb-img").src=e.images[n]}),(v=document.getElementById("lb-next"))==null||v.addEventListener("click",()=>{n=(n+1)%e.images.length,document.getElementById("lb-img").src=e.images[n]}),(b=document.getElementById("wishlist-btn"))==null||b.addEventListener("click",()=>{const g=document.getElementById("wishlist-btn"),h=fe(t);g.textContent=h?"❤️ Saved":"🤍 Save",u(h?"Added to Wishlist!":"Removed from Wishlist")}),setTimeout(()=>{const g=document.getElementById("stay-map");if(!g||g._leaflet_id)return;const h=L.map("stay-map").setView([e.lat,e.lng],12);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(h),L.marker([e.lat,e.lng]).addTo(h).bindPopup(`<b>${e.name}</b>`).openPopup()},100),(f=document.getElementById("write-review-btn"))==null||f.addEventListener("click",()=>{if(!O()){u("Login required","Please log in to write a review","error");return}document.getElementById("review-form").classList.toggle("hidden")}),(y=document.getElementById("submit-review-btn"))==null||y.addEventListener("click",()=>{var k,$,z;const g=parseInt(((k=document.querySelector('input[name="rating"]:checked'))==null?void 0:k.value)||0),h=(z=($=document.getElementById("review-text"))==null?void 0:$.value)==null?void 0:z.trim();if(!g||!h){u("Please fill all fields","","error");return}const x=M();ye({listingId:t,rating:g,text:h,userName:x.fullName||x.name,userAvatar:x.avatar}),u("Review submitted! ⭐"),document.getElementById("review-form").classList.add("hidden"),document.getElementById("reviews-list").innerHTML=K(t).map(S=>se(S)).join("")})}function se(t){var e;return`
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${t.userAvatar||((e=t.userName)==null?void 0:e.charAt(0))||"?"}</div>
        <div class="review-meta">
          <div class="review-name">${t.userName}</div>
          <div class="review-date">${new Date(t.createdAt).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</div>
        </div>
        <div style="margin-left:auto">${I(t.rating)}</div>
      </div>
      <p class="review-text">${t.text}</p>
      <span class="verified-badge">✅ Verified Guest</span>
    </div>
  `}function at(t){return[{userName:"Priya Sharma",userAvatar:"P",rating:5,text:"Absolutely magical experience! The host was so welcoming and the views were breathtaking. Will definitely come back.",createdAt:"2026-01-15T00:00:00Z"},{userName:"Rahul Das",userAvatar:"R",rating:4,text:"Beautiful location and authentic Mizo food. A bit remote but that's the charm! Highly recommended for nature lovers.",createdAt:"2026-02-20T00:00:00Z"}].map(i=>se(i)).join("")}const re=[{id:"guide-zova",name:"Zova Lalchhuanawma",avatar:"ZL",title:"Expert Trekking & Wildlife Guide",experience:"10 years",languages:["English","Mizo","Hindi"],specialties:["Phawngpui Trek","Wildlife Spotting","Bird Watching","Photography Tours"],rating:4.9,reviews:88,price:1,priceUnit:"per day",location:"Aizawl (covers all districts)",phone:"+91 98765 11111",email:"zova.guide@lushaitrips.com",coverImage:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",images:["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"],bio:"Born and raised in the highlands of Mizoram, Zova has led over 300 trekking expeditions across the Lushai Hills. He's passionate about protecting Mizoram's biodiversity and sharing it with travellers. A certified wilderness first responder and birding enthusiast.",certifications:["First Aid Certified","Wildlife Institute of India","Ministry of Tourism Certified"],verified:!0,available:!0,tags:["trekking","wildlife","birding"]},{id:"guide-mary",name:"Mary Vanlalruati",avatar:"MV",title:"Cultural & Heritage Tour Guide",experience:"7 years",languages:["English","Mizo","Hindi","Bengali"],specialties:["Aizawl City Tours","Mizo Culture","Traditional Weaving","Village Walks"],rating:4.8,reviews:62,price:1200,priceUnit:"per day",location:"Aizawl",phone:"+91 87654 22222",email:"mary.guide@lushaitrips.com",coverImage:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",images:["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80"],bio:"Mary holds a Master's degree in Mizo history and has been sharing her culture with visitors for 7 years. She can take you deep into the soul of Mizo traditions — from bamboo weaving to traditional music, from ancient rituals to modern Aizawl.",certifications:["Ministry of Tourism Certified","Heritage Interpreter (INTACH)"],verified:!0,available:!0,tags:["culture","heritage","city-tour"]},{id:"guide-rema",name:"Rema Chhakchhuak",avatar:"RC",title:"Adventure Sports & River Guide",experience:"5 years",languages:["English","Mizo"],specialties:["River Kayaking","Rappelling","Jungle Camping","Night Trekking"],rating:4.7,reviews:41,price:1800,priceUnit:"per day",location:"Serchhip / South Mizoram",phone:"+91 76543 33333",email:"rema.guide@lushaitrips.com",coverImage:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",images:["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80","https://images.unsplash.com/photo-1503264116251-35a269479413?w=800&q=80","https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"],bio:"Rema is the go-to guide for adrenaline seekers in Mizoram. He specialises in river kayaking on the pristine Tuipui and Tlawng rivers, rappelling near Vantawng Falls, and multi-day jungle camping expeditions.",certifications:["Swift Water Rescue Certified","Wilderness First Aid","Adventure Tourism Certified"],verified:!0,available:!0,tags:["adventure","kayaking","camping"]}],oe=[{id:"transport-raj",name:"Raj Mizoram Travels",owner:"Rajesh Chhakchhuak",avatar:"RC",type:"Car & SUV Rental",vehicles:[{name:"Toyota Innova Crysta",capacity:7,price:3500,priceUnit:"per day (fuel incl.)"},{name:"Maruti Ertiga",capacity:7,price:2500,priceUnit:"per day (fuel incl.)"},{name:"Mahindra Bolero",capacity:9,price:3e3,priceUnit:"per day (fuel incl.)"}],rating:4.8,reviews:76,phone:"+91 98765 44444",email:"raj.travels@lushaitrips.com",location:"Aizawl (airport pickup available)",coverImage:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",images:["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80","https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800&q=80"],description:"Raj Mizoram Travels offers reliable, comfortable transport across Mizoram's mountain roads with experienced local drivers who know every route. Airport pickup, multi-day hire, and custom itinerary drops available.",features:["Airport Pickup","AC Vehicles","Experienced Drivers","Night Driving","All Districts"],verified:!0,available:!0},{id:"transport-zara",name:"Zara Mountain Bikes",owner:"Zaramsanga Colney",avatar:"ZC",type:"Motorcycle & Bike Rental",vehicles:[{name:"Royal Enfield Himalayan",capacity:2,price:1800,priceUnit:"per day"},{name:"Honda CB350",capacity:2,price:1400,priceUnit:"per day"},{name:"Mountain Bicycle",capacity:1,price:400,priceUnit:"per day"}],rating:4.6,reviews:38,phone:"+91 87654 55555",email:"zara.bikes@lushaitrips.com",location:"Aizawl",coverImage:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",images:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80","https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80"],description:"Explore Mizoram the way it was meant to be explored — on two wheels. Our fleet of well-maintained Royal Enfields and Honda bikes are ideal for the winding mountain roads of Mizoram. Helmets, riding gear, and maps provided.",features:["Helmets Included","Riding Gear","Route Maps","Breakdown Assistance","Delivery to Hotel"],verified:!0,available:!0},{id:"transport-lal",name:"Lal Shared Sumo Service",owner:"Lalbiakzuala",avatar:"LB",type:"Shared Sumo / Van",vehicles:[{name:"Tata Sumo (Shared)",capacity:10,price:350,priceUnit:"per seat per route"},{name:"Force Traveller Van",capacity:16,price:4500,priceUnit:"per day (private)"}],rating:4.4,reviews:55,phone:"+91 76543 66666",email:"lal.sumo@lushaitrips.com",location:"Aizawl (all major routes)",coverImage:"https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80",images:["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80","https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800&q=80","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80"],description:"Budget-friendly shared Sumo services connect all major towns and tourist spots. Perfect for solo travellers or groups on a budget. Private van hire also available for custom tours and group trips.",features:["Budget Friendly","All Major Routes","Daily Departures","Group Discounts","Private Option"],verified:!0,available:!0}];function st(){return`
    <section class="page-hero">
      <div class="container">
        <div class="section-label">👨‍🏫 Expert Local Guides</div>
        <h1>Hire a Guide</h1>
        <p style="max-width:600px;margin-bottom:32px">Every guide is certified, locally born, and passionately knowledgeable about Mizoram's terrain, culture, and wildlife.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid-3" id="guides-grid"></div>
        <div style="margin-top:60px;background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(245,158,11,0.05));border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xl);padding:48px;text-align:center">
          <div style="font-size:2.5rem;margin-bottom:16px">🧭</div>
          <h2 style="margin-bottom:12px">Are You a Local Expert?</h2>
          <p style="max-width:480px;margin:0 auto 28px">Join LushaiTrips as a certified guide. Share your knowledge of Mizoram's hidden trails, wildlife, and culture.</p>
          <a href="${E("/host-signup-guide")}" class="btn btn-primary btn-lg" data-link>Register as a Guide</a>
        </div>
      </div>
    </section>
  `}function rt(){const t=document.getElementById("guides-grid");t&&(t.innerHTML=re.map(e=>`
    <div class="card" data-href="/guide/${e.id}" style="cursor:pointer">
      <div class="card-img-wrap" style="height:240px">
        <img src="${e.coverImage}" alt="${e.name}" loading="lazy" style="object-position:top" />
        ${e.verified?'<div class="card-badge" style="background:rgba(16,185,129,0.9);color:#fff">✅ VERIFIED</div>':""}
        <div class="card-rating">${I(e.rating)} <span>${e.rating} (${e.reviews})</span></div>
      </div>
      <div class="card-body">
        <h4 class="card-title">${e.name}</h4>
        <div style="font-size:0.85rem;color:var(--emerald-400);font-weight:600;margin-bottom:6px">${e.title}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:10px">📍 ${e.location} &nbsp;•&nbsp; 🗓 ${e.experience}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          ${e.languages.map(i=>`<span class="tag" style="font-size:0.72rem">🗣 ${i}</span>`).join("")}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          ${e.specialties.slice(0,2).map(i=>`<span class="tag">${i}</span>`).join("")}
        </div>
        <div class="flex-between">
          <span class="price" style="font-size:1.1rem">₹${e.price.toLocaleString()}<span>/${e.priceUnit.split(" ")[1]}</span></span>
          <span class="btn btn-outline btn-sm">View & Book</span>
        </div>
      </div>
    </div>
  `).join(""),t.querySelectorAll("[data-href]").forEach(e=>e.addEventListener("click",()=>window.router.navigate(e.dataset.href))))}function ot(t){const e=re.find(i=>i.id===t);return e?`
    <div style="padding-top:76px">
      <div class="container" style="margin-top:24px">
        <div class="detail-layout">
          <div>
            <div style="display:flex;gap:24px;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap">
              <img src="${e.coverImage}" alt="${e.name}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;object-position:top;border:3px solid var(--emerald-500);flex-shrink:0" />
              <div>
                <h1 style="font-size:clamp(1.5rem,3vw,2rem);margin-bottom:4px">${e.name}</h1>
                <div style="color:var(--emerald-400);font-weight:600;margin-bottom:8px">${e.title}</div>
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:8px">${I(e.rating)} <strong>${e.rating}</strong> <span style="color:var(--text-muted)">(${e.reviews} reviews)</span></div>
                <div style="font-size:0.9rem;color:var(--text-muted)">📍 ${e.location} &nbsp;•&nbsp; 🗓 ${e.experience} experience</div>
              </div>
            </div>
            <div class="divider-h"></div>
            <h3 style="margin-bottom:12px">About ${e.name}</h3>
            <p style="margin-bottom:24px">${e.bio}</p>
            <h3 style="margin-bottom:16px">🎯 Specialties</h3>
            <div class="amenities-grid" style="margin-bottom:28px">
              ${e.specialties.map(i=>`<div class="amenity-item"><span class="amenity-icon">🏔</span><span class="amenity-label">${i}</span></div>`).join("")}
            </div>
            <h3 style="margin-bottom:16px">🗣 Languages</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px">
              ${e.languages.map(i=>`<span class="tag">${i}</span>`).join("")}
            </div>
            <h3 style="margin-bottom:16px">📜 Certifications</h3>
            <div style="margin-bottom:32px">
              ${e.certifications.map(i=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--glass-border)"><span style="color:var(--emerald-400)">✅</span><span style="font-size:0.9rem;color:var(--text-muted)">${i}</span></div>`).join("")}
            </div>
            <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:24px">
              <h4 style="margin-bottom:16px">📸 Gallery</h4>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
                ${e.images.slice(1).map((i,s)=>`<img src="${i}" alt="${e.name} ${s+2}" style="width:100%;height:130px;object-fit:cover;border-radius:var(--radius-sm)" />`).join("")}
              </div>
            </div>
          </div>
          <div>
            <div class="booking-widget">
              <div class="booking-price"><span class="price" style="font-size:1.6rem">₹${e.price.toLocaleString()}</span><span style="color:var(--text-muted)">/${e.priceUnit}</span></div>
              <div class="form-group mt-16"><label class="form-label">Select Date</label><input type="date" class="form-input" id="guide-date" /></div>
              <div class="form-group"><label class="form-label">Trip Type</label>
                <select class="form-select" id="guide-trip">
                  ${e.specialties.map(i=>`<option>${i}</option>`).join("")}
                </select>
              </div>
              <div class="form-group"><label class="form-label">Group Size</label>
                <select class="form-select" id="guide-group">
                  ${[1,2,3,4,5,6].map(i=>`<option value="${i}">${i} person${i>1?"s":""}</option>`).join("")}
                </select>
              </div>
              <button class="btn btn-primary w-full" id="book-guide-btn" style="justify-content:center;padding:16px;margin-bottom:12px">Book Guide →</button>
              <p style="text-align:center;font-size:0.8rem;color:var(--text-muted)">🔒 Secured by Razorpay</p>
              <div class="divider-h"></div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px">📞 ${e.phone}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">📧 ${e.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `:'<div class="page-hero container"><h1>Guide not found</h1></div>'}function nt(t){var r;const e=re.find(a=>a.id===t);if(!e)return;const i=new Date().toISOString().split("T")[0],s=document.getElementById("guide-date");s&&(s.value=i),(r=document.getElementById("book-guide-btn"))==null||r.addEventListener("click",()=>{var d;const a=(d=document.getElementById("guide-date"))==null?void 0:d.value,o=e.price;window.router.navigate(`/book/guide-${t}?date=${a}&total=${o}&type=guide&name=${encodeURIComponent(e.name)}`)})}function lt(){return`
    <section class="page-hero">
      <div class="container">
        <div class="section-label">🚗 Get Around Mizoram</div>
        <h1>Book Transport</h1>
        <p style="max-width:600px;margin-bottom:32px">From airport pickups to multi-day SUV hire and Royal Enfield adventures — we've got every journey covered.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid-3" id="transport-grid"></div>
        <div style="margin-top:60px;background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(245,158,11,0.05));border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xl);padding:48px;text-align:center">
          <div style="font-size:2.5rem;margin-bottom:16px">🚌</div>
          <h2 style="margin-bottom:12px">Have a Vehicle to List?</h2>
          <p style="max-width:480px;margin:0 auto 28px">Join our transport network and earn by connecting travellers with reliable rides across Mizoram.</p>
          <a href="${E("/host-signup-transport")}" class="btn btn-primary btn-lg" data-link>List Your Transport</a>
        </div>
      </div>
    </section>
  `}function dt(){const t=document.getElementById("transport-grid");t&&(t.innerHTML=oe.map(e=>`
    <div class="card" data-href="/transport/${e.id}" style="cursor:pointer">
      <div class="card-img-wrap">
        <img src="${e.coverImage}" alt="${e.name}" loading="lazy" />
        <div class="card-badge">${e.type.toUpperCase()}</div>
        <div class="card-rating">${I(e.rating)} <span>${e.rating} (${e.reviews})</span></div>
      </div>
      <div class="card-body">
        <h4 class="card-title">${e.name}</h4>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:10px">👤 ${e.owner} &nbsp;•&nbsp; 📍 ${e.location}</div>
        <div style="margin-bottom:14px">
          ${e.vehicles.slice(0,2).map(i=>`
            <div style="display:flex;justify-content:space-between;font-size:0.85rem;padding:6px 0;border-bottom:1px solid var(--glass-border)">
              <span style="color:var(--text-muted)">🚗 ${i.name}</span>
              <span style="color:var(--emerald-400);font-weight:600">₹${i.price.toLocaleString()}</span>
            </div>
          `).join("")}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          ${e.features.slice(0,3).map(i=>`<span class="tag" style="font-size:0.72rem">${i}</span>`).join("")}
        </div>
        <span class="btn btn-outline btn-sm w-full" style="justify-content:center">View & Book</span>
      </div>
    </div>
  `).join(""),t.querySelectorAll("[data-href]").forEach(e=>e.addEventListener("click",()=>window.router.navigate(e.dataset.href))))}function ct(t){const e=oe.find(i=>i.id===t);return e?`
    <div style="padding-top:76px">
      <div class="container" style="margin-top:24px">
        <div class="detail-layout">
          <div>
            <div style="margin-bottom:24px">
              <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
                <h1 style="font-size:clamp(1.5rem,3vw,2rem)">${e.name}</h1>
                ${e.verified?'<span style="color:var(--emerald-400);font-size:0.85rem">✅ Verified Provider</span>':""}
              </div>
              <div style="display:flex;gap:4px;align-items:center;margin-bottom:8px">${I(e.rating)} <strong>${e.rating}</strong> <span style="color:var(--text-muted)">(${e.reviews} reviews)</span></div>
              <div style="font-size:0.9rem;color:var(--text-muted)">📍 ${e.location} &nbsp;•&nbsp; 👤 ${e.owner}</div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px;border-radius:var(--radius);overflow:hidden">
              ${e.images.map((i,s)=>`<img src="${i}" alt="${e.name}" style="width:100%;height:180px;object-fit:cover;${s===0?"grid-column:1/3;height:260px":""}" loading="lazy" />`).join("")}
            </div>

            <h3 style="margin-bottom:12px">About this Service</h3>
            <p style="margin-bottom:28px">${e.description}</p>

            <h3 style="margin-bottom:16px">🚗 Available Vehicles</h3>
            <div style="margin-bottom:32px">
              ${e.vehicles.map(i=>`
                <div class="card card-body" style="margin-bottom:12px;padding:20px">
                  <div class="flex-between">
                    <div>
                      <div style="font-weight:700;margin-bottom:4px">${i.name}</div>
                      <div style="font-size:0.85rem;color:var(--text-muted)">👥 Up to ${i.capacity} passengers</div>
                    </div>
                    <div style="text-align:right">
                      <div class="price" style="font-size:1.1rem">₹${i.price.toLocaleString()}</div>
                      <div style="font-size:0.8rem;color:var(--text-muted)">${i.priceUnit}</div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>

            <h3 style="margin-bottom:16px">✨ Features</h3>
            <div class="amenities-grid">
              ${e.features.map(i=>`<div class="amenity-item"><span class="amenity-icon">✅</span><span class="amenity-label">${i}</span></div>`).join("")}
            </div>
          </div>
          <div>
            <div class="booking-widget">
              <div style="font-family:var(--font-head);font-size:1.1rem;font-weight:700;margin-bottom:4px">Book Transport</div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:20px">Select vehicle and dates</div>
              <div class="form-group">
                <label class="form-label">Vehicle</label>
                <select class="form-select" id="vehicle-select">
                  ${e.vehicles.map(i=>`<option value="${i.price}">${i.name} — ₹${i.price.toLocaleString()} ${i.priceUnit}</option>`).join("")}
                </select>
              </div>
              <div class="form-group"><label class="form-label">Pickup Date</label><input type="date" class="form-input" id="pickup-date" /></div>
              <div class="form-group"><label class="form-label">Drop-off Date</label><input type="date" class="form-input" id="dropoff-date" /></div>
              <div class="form-group"><label class="form-label">Pickup Location</label><input type="text" class="form-input" id="pickup-loc" placeholder="e.g. Aizawl Airport" /></div>
              <div id="transport-total" style="background:var(--glass);border-radius:var(--radius-sm);padding:14px;margin-bottom:16px;font-size:0.9rem;color:var(--text-muted)">Select vehicle and dates to see total</div>
              <button class="btn btn-primary w-full" id="book-transport-btn" style="justify-content:center;padding:16px;margin-bottom:12px">Book Now →</button>
              <p style="text-align:center;font-size:0.8rem;color:var(--text-muted)">🔒 Razorpay Secured</p>
              <div class="divider-h"></div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px">📞 ${e.phone}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">📧 ${e.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `:'<div class="page-hero container"><h1>Not found</h1></div>'}function pt(t){var o;const e=oe.find(d=>d.id===t);if(!e)return;const i=new Date,s=new Date(i);s.setDate(s.getDate()+1);const r=d=>d.toISOString().split("T")[0];document.getElementById("pickup-date").value=r(i),document.getElementById("dropoff-date").value=r(s);const a=()=>{var b,f,y;const d=parseInt(((b=document.getElementById("vehicle-select"))==null?void 0:b.value)||0),n=new Date((f=document.getElementById("pickup-date"))==null?void 0:f.value),c=new Date((y=document.getElementById("dropoff-date"))==null?void 0:y.value),p=Math.max(1,Math.round((c-n)/864e5)),m=d*p,v=document.getElementById("transport-total");return v&&(v.innerHTML=`<div class="flex-between"><span>₹${d.toLocaleString()} × ${p} day${p>1?"s":""}</span><strong style="color:var(--text)">₹${m.toLocaleString()}</strong></div>`),m};a(),["vehicle-select","pickup-date","dropoff-date"].forEach(d=>{var n;return(n=document.getElementById(d))==null?void 0:n.addEventListener("change",a)}),(o=document.getElementById("book-transport-btn"))==null||o.addEventListener("click",()=>{const d=a();window.router.navigate(`/book/${t}?total=${d}&type=transport&name=${encodeURIComponent(e.name)}`)})}const mt="rzp_test_SXRQlAUuikOAUn";function ut(t,e){var m,v,b,f;const i=e.get("checkin")||"",s=e.get("checkout")||"",r=e.get("guests")||"1",a=parseInt(e.get("total")||2e3),o=e.get("type")||"stay",d=e.get("name")?decodeURIComponent(e.get("name")):"",c=A.find(y=>y.id===t)||{name:d||t,coverImage:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",type:o},p=i&&s?Math.max(1,Math.round((new Date(s)-new Date(i))/864e5)):1;return`
    <section class="page-hero" style="padding-bottom:40px">
      <div class="container">
        <h1 style="font-size:clamp(1.5rem,3vw,2.2rem)">Complete Your Booking</h1>
        <p style="color:var(--text-muted)">You're almost there — secure your trip now.</p>
      </div>
    </section>

    <section style="padding-bottom:80px">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 400px;gap:40px;align-items:start">
          <!-- Left: Payment form -->
          <div>
            ${O()?"":`
              <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:20px;margin-bottom:28px">
                <div style="font-weight:700;margin-bottom:6px">⚠️ Login Required</div>
                <div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:12px">Please log in to complete your booking.</div>
                <a href="${E("/login")}" class="btn btn-primary btn-sm" data-link>Log in to Continue</a>
              </div>
            `}

            

            <h3 style="margin-bottom:20px">Your Information</h3>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="pay-name" placeholder="Your full name" value="${((m=M())==null?void 0:m.fullName)||((v=M())==null?void 0:v.name)||""}" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="pay-email" placeholder="email@example.com" value="${((b=M())==null?void 0:b.email)||""}" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-input" id="pay-phone" placeholder="+91 98765 43210" value="${((f=M())==null?void 0:f.phone)||""}" />
              </div>
              <div class="form-group">
                <label class="form-label">Special Requests</label>
                <input type="text" class="form-input" id="pay-notes" placeholder="e.g. early check-in, dietary needs" />
              </div>
            </div>

            <div class="divider-h"></div>
            <h3 style="margin-bottom:16px">Payment Method</h3>
            <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius);padding:24px;margin-bottom:28px">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
                <span style="font-size:1.5rem">🔒</span>
                <div>
                  <div style="font-weight:700">Secure Payment via Razorpay</div>
                  <div style="font-size:0.85rem;color:var(--text-muted)">Your payment info is never stored on our servers</div>
                </div>
              </div>
              <div style="display:flex;gap:16px;flex-wrap:wrap">
                ${["UPI / GPay / PhonePe","Debit / Credit Card","Net Banking","Wallets"].map(y=>`<div style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:var(--text-muted)"><span style="color:var(--emerald-400)">✓</span>${y}</div>`).join("")}
              </div>
            </div>

            <button class="btn btn-primary btn-lg w-full" id="pay-btn" style="justify-content:center;font-size:1.1rem" ${O()?"":'disabled style="opacity:0.5;cursor:not-allowed;justify-content:center;font-size:1.1rem"'}>
              ${`🔒 Pay ₹${a.toLocaleString()} with Razorpay`}
            </button>
            <p style="text-align:center;font-size:0.8rem;color:var(--text-muted);margin-top:10px">By booking, you agree to our Terms & Conditions and Cancellation Policy.</p>
          </div>

          <!-- Right: Summary card -->
          <div>
            <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-lg);overflow:hidden;position:sticky;top:100px">
              <img src="${c.coverImage}" alt="${c.name}" style="width:100%;height:200px;object-fit:cover" />
              <div style="padding:24px">
                <div style="font-size:0.75rem;font-weight:700;color:var(--emerald-400);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">${c.type||"Stay"}</div>
                <h4 style="margin-bottom:8px">${c.name}</h4>
                ${i?`
                  <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px">📅 ${new Date(i+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})} → ${new Date(s+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                  <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px">👥 ${r} guest${r>1?"s":""} · ${p} night${p>1?"s":""}</div>
                `:""}
                <div class="divider-h" style="margin:16px 0"></div>
                <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted);margin-bottom:8px">
                  <span>Subtotal</span><span>₹${Math.round(a/1.05).toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted);margin-bottom:8px">
                  <span>Service fee (5%)</span><span>₹${Math.round(a-a/1.05).toLocaleString()}</span>
                </div>
                <div class="divider-h" style="margin:12px 0"></div>
                <div style="display:flex;justify-content:space-between;font-weight:800;font-size:1.1rem">
                  <span>Total</span><span class="text-emerald">₹${a.toLocaleString()}</span>
                </div>
                <div style="margin-top:12px;font-size:0.8rem;color:var(--text-muted);text-align:center">🛡 Free cancellation within 24 hrs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}function gt(t,e){var c;const i=parseInt(e.get("total")||2e3),s=e.get("checkin")||"",r=e.get("checkout")||"",a=e.get("guests")||"1",o=e.get("type")||"stay",d=e.get("name")?decodeURIComponent(e.get("name")):t,n=A.find(p=>p.id===t);(c=document.getElementById("pay-btn"))==null||c.addEventListener("click",()=>{var g,h,x,k,$,z,S;if(!O()){u("Please log in first","","error");return}const p=(h=(g=document.getElementById("pay-name"))==null?void 0:g.value)==null?void 0:h.trim(),m=(k=(x=document.getElementById("pay-email"))==null?void 0:x.value)==null?void 0:k.trim(),v=(z=($=document.getElementById("pay-phone"))==null?void 0:$.value)==null?void 0:z.trim();if(!p||!m||!v){u("Please fill all fields","","error");return}const f={userId:M().id,listingId:t,listingName:(n==null?void 0:n.name)||d,listingType:o,checkin:s,checkout:r,guests:a,total:i,guestName:p,guestEmail:m,guestPhone:v,notes:((S=document.getElementById("pay-notes"))==null?void 0:S.value)||""},y={key:mt,amount:i*100,currency:"INR",name:"LushaiTrips",description:(n==null?void 0:n.name)||d,image:"https://via.placeholder.com/100x100/065f46/ffffff?text=LT",prefill:{name:p,email:m,contact:v},theme:{color:"#059669"},handler:function(T){const C=Te({...f,razorpayPaymentId:T.razorpay_payment_id});u("Payment Successful! 🎉",`Ref: ${C.id}`),setTimeout(()=>window.router.navigate("/booking-confirmed"),800)},modal:{ondismiss:()=>u("Payment cancelled","","error")}};try{new Razorpay(y).open()}catch{u("Razorpay not loaded","Please check your internet connection","error")}})}function vt(){var i;const t=E,e=Ae();return`
    <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:120px 24px 60px">
      <div style="max-width:600px;width:100%;text-align:center">
        <div style="font-size:5rem;margin-bottom:16px;animation:float 2s ease-in-out infinite">✅</div>
        <h1 style="font-size:2.5rem;margin-bottom:12px;background:linear-gradient(135deg,var(--emerald-400),var(--amber-400));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Booking Confirmed!</h1>
        <p style="font-size:1.1rem;color:var(--text-muted);margin-bottom:32px">Your Mizoram adventure is locked in. Get ready for an unforgettable experience. 🌄</p>

        ${e?`
          <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-xl);padding:32px;margin-bottom:32px;text-align:left">
            <div style="font-size:0.75rem;font-weight:700;color:var(--emerald-400);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:16px">Booking Details</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Booking ID</span><strong style="color:var(--emerald-400)">${e.id}</strong></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Property</span><strong>${e.listingName}</strong></div>
            ${e.checkin?`<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Check-in</span><strong>${new Date(e.checkin+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long"})}</strong></div>`:""}
            ${e.checkout?`<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Check-out</span><strong>${new Date(e.checkout+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long"})}</strong></div>`:""}
            ${e.guests?`<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Guests</span><strong>${e.guests}</strong></div>`:""}
            <div style="height:1px;background:var(--glass-border);margin:16px 0"></div>
            <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:800"><span>Total Paid</span><span style="color:var(--emerald-400)">₹${(i=e.total)==null?void 0:i.toLocaleString()}</span></div>
          </div>
        `:""}

        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius);padding:20px;margin-bottom:32px;text-align:left">
          <div style="font-weight:700;margin-bottom:12px">📋 What happens next?</div>
          ${["📧 Confirmation sent to your email","📞 Host will contact you within 24 hours","🗺️ Your itinerary is ready in My Bookings","⭐ After your stay, leave a review to help others"].map(s=>`<div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:8px">${s}</div>`).join("")}
        </div>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="${t("/profile")}" class="btn btn-primary btn-lg" data-link>View My Bookings</a>
          <a href="${t("/discover")}" class="btn btn-secondary btn-lg" data-link>Explore More</a>
        </div>
      </div>
    </div>
  `}function ht(){}function yt(){return`
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">LushaiTrips</div>
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-sub">Log in to manage your bookings and trips</p>

        <button class="social-btn" id="google-btn">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>

        <div class="divider"><span>or continue with email</span></div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="login-email" placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="login-password" placeholder="••••••••" />
        </div>

        <div style="text-align:right;margin-bottom:20px">
          <a href="#" style="font-size:0.85rem;color:var(--emerald-400)">Forgot password?</a>
        </div>

        <button class="btn btn-primary w-full" id="login-btn" style="justify-content:center;padding:14px">Log In</button>

        <div class="auth-switch mt-16">Don't have an account? <a href="${E("/signup-user")}" data-link>Sign up</a></div>
        <div class="auth-switch" style="margin-top:8px">Are you a host? <a href="${E("/host-signup-stay")}" data-link>Register your property →</a></div>
      </div>
    </div>
  `}function ft(){var t,e,i;(t=document.getElementById("login-btn"))==null||t.addEventListener("click",()=>{var a,o,d;const s=(o=(a=document.getElementById("login-email"))==null?void 0:a.value)==null?void 0:o.trim(),r=(d=document.getElementById("login-password"))==null?void 0:d.value;if(!s||!r){u("Please fill all fields","","error");return}try{Be(s,r),u("Welcome back! 👋"),setTimeout(()=>window.router.navigate("/"),500)}catch(n){u(n.message,"","error")}}),(e=document.getElementById("login-password"))==null||e.addEventListener("keydown",s=>{var r;s.key==="Enter"&&((r=document.getElementById("login-btn"))==null||r.click())}),(i=document.getElementById("google-btn"))==null||i.addEventListener("click",()=>{u("Google login coming soon!","Use email login for now.")})}function bt(){return`
    <div class="auth-page">
      <div class="auth-card" style="max-width:520px">
        <div class="auth-logo">LushaiTrips</div>
        <h2 class="auth-title">Create your account</h2>
        <p class="auth-sub">Join thousands exploring Mizoram's hidden gems</p>

        <button class="social-btn" id="google-signup-btn">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Sign up with Google
        </button>
        <button class="social-btn" id="phone-signup-btn">📱 Sign up with Phone OTP</button>

        <div class="divider"><span>or sign up with email</span></div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="su-name" placeholder="Jane Doe" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-input" id="su-phone" placeholder="+91 98765 43210" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="su-email" placeholder="you@example.com" />
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" id="su-password" placeholder="Min 8 characters" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" class="form-input" id="su-confirm" placeholder="Repeat password" />
          </div>
        </div>

        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:14px;margin-bottom:20px;font-size:0.8rem;color:var(--text-muted)">
          By signing up, you agree to our <a href="#" style="color:var(--emerald-400)">Terms of Service</a> and <a href="#" style="color:var(--emerald-400)">Privacy Policy</a>.
        </div>

        <button class="btn btn-primary w-full" id="signup-btn" style="justify-content:center;padding:14px">Create Account 🎲</button>
        <div class="auth-switch mt-16">Already have an account? <a href="${E("/login")}" data-link>Log in</a></div>
        <div class="auth-switch" style="margin-top:8px">Want to host? <a href="${E("/host-signup-stay")}" data-link>Register as Host →</a></div>
      </div>
    </div>
  `}function xt(){var t,e,i;(t=document.getElementById("signup-btn"))==null||t.addEventListener("click",()=>{var n,c,p,m,v,b,f,y;const s=(c=(n=document.getElementById("su-name"))==null?void 0:n.value)==null?void 0:c.trim(),r=(m=(p=document.getElementById("su-email"))==null?void 0:p.value)==null?void 0:m.trim(),a=(b=(v=document.getElementById("su-phone"))==null?void 0:v.value)==null?void 0:b.trim(),o=(f=document.getElementById("su-password"))==null?void 0:f.value,d=(y=document.getElementById("su-confirm"))==null?void 0:y.value;if(!s||!r||!a||!o){u("Please fill all fields","","error");return}if(o!==d){u("Passwords do not match","","error");return}if(o.length<8){u("Password must be at least 8 characters","","error");return}try{Se({fullName:s,email:r,phone:a,password:o}),u("Account created! Welcome 🎉"),setTimeout(()=>window.router.navigate("/discover"),600)}catch(g){u(g.message,"","error")}}),(e=document.getElementById("google-signup-btn"))==null||e.addEventListener("click",()=>u("Google signup coming soon!")),(i=document.getElementById("phone-signup-btn"))==null||i.addEventListener("click",()=>u("OTP signup coming soon!"))}let B=1;const G=5,l={};let P=[];const wt=["Basic Info","Property","Stay Details","Photos","Rules & Submit"];function kt(){return`
    <div style="min-height:100vh;padding:100px 24px 60px;background:linear-gradient(135deg,var(--bg) 0%,var(--bg2) 50%,var(--bg3) 100%)">
      <div style="max-width:700px;margin:0 auto">
        <div style="text-align:center;margin-bottom:40px">
          <div class="auth-logo" style="font-size:2rem;margin-bottom:8px">LushaiTrips</div>
          <h2 style="margin-bottom:8px">List Your Property</h2>
          <p style="color:var(--text-muted)">Join our trusted network of Mizoram hosts</p>
        </div>

        <!-- Stepper -->
        <div class="stepper" id="stepper">${ke()}</div>

        <!-- Steps -->
        <div class="card card-body" style="padding:40px" id="step-container">
          ${$e(1)}
        </div>

        <!-- Navigation -->
        <div style="display:flex;justify-content:space-between;margin-top:24px">
          <button class="btn btn-secondary" id="prev-btn" style="${B===1?"visibility:hidden":""}">← Back</button>
          <div style="color:var(--text-dim);font-size:0.85rem;align-self:center">Step ${B} of ${G}</div>
          <button class="btn btn-primary" id="next-btn">${B===G?"🚀 Submit Listing":"Next →"}</button>
        </div>
      </div>
    </div>
  `}function ke(){return Array.from({length:G},(t,e)=>{const i=e+1;return`
      <div class="step ${i<B?"done":i===B?"active":""}">
        <div class="step-wrapper">
          <div class="step-circle">${i<B?"✓":i}</div>
          <div class="step-label">${wt[e]}</div>
        </div>
      </div>
      ${i<G?'<div class="step-line"></div>':""}
    `}).join("")}function $e(t){switch(t){case 1:return`
      <h3 style="margin-bottom:24px">👤 Step 1: Basic Information</h3>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Your Full Name *</label><input type="text" class="form-input" id="h-name" placeholder="E.g. Liana Hnamte" value="${l.name||""}" /></div>
        <div class="form-group"><label class="form-label">Phone Number *</label><input type="tel" class="form-input" id="h-phone" placeholder="+91 98765 43210" value="${l.phone||""}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Email Address *</label><input type="email" class="form-input" id="h-email" placeholder="you@example.com" value="${l.email||""}" /></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Password *</label><input type="password" class="form-input" id="h-password" placeholder="Min 8 characters" /></div>
        <div class="form-group"><label class="form-label">Confirm Password *</label><input type="password" class="form-input" id="h-confirm" placeholder="Repeat password" /></div>
      </div>
      </div>`;case 2:return`
      <h3 style="margin-bottom:24px">🏠 Step 2: Property Information</h3>
      <div class="form-group"><label class="form-label">Property Name *</label><input type="text" class="form-input" id="h-prop-name" placeholder="E.g. Bamboo Haven Homestay" value="${l.propName||""}" /></div>
      <div class="form-group">
        <label class="form-label">Property Type *</label>
        <div class="check-group" id="prop-type-group">
          ${["Homestay","Hotel","Camping","Lodge","Farmstay","Guesthouse"].map(e=>`
            <label class="chip" style="cursor:pointer;display:flex;align-items:center;gap:8px">
              <input type="radio" name="prop-type" value="${e}" ${l.propType===e?"checked":""} style="accent-color:var(--emerald-500)" />
              ${e}
            </label>
          `).join("")}
        </div>
      </div>
      <div class="form-group"><label class="form-label">Full Address *</label><textarea class="form-textarea" id="h-address" placeholder="Village, District, PIN code" style="min-height:80px">${l.address||""}</textarea></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">District *</label>
          <select class="form-select" id="h-district">
            <option value="">Select District</option>
            ${["Aizawl","Lunglei","Champhai","Kolasib","Lawngtlai","Mamit","Saiha","Serchhip","Saitual","Hnahthial","Khawzawl"].map(e=>`<option ${l.district===e?"selected":""}>${e}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Google Maps Link <span style="font-size:0.8rem;color:var(--text-dim)">(optional)</span></label><input type="url" class="form-input" id="h-maps" placeholder="https://maps.google.com/..." value="${l.mapsLink||""}" /></div>
      </div>`;case 3:return`
      <h3 style="margin-bottom:24px">🛏️ Step 3: Stay Details</h3>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Number of Rooms *</label><input type="number" class="form-input" id="h-rooms" min="1" max="50" placeholder="e.g. 3" value="${l.rooms||""}" /></div>
        <div class="form-group"><label class="form-label">Max Guests *</label><input type="number" class="form-input" id="h-guests" min="1" max="50" placeholder="e.g. 6" value="${l.maxGuests||""}" /></div>
      </div>
      <div class="form-group">
        <label class="form-label">Price per Night (₹) *</label>
        <input type="number" class="form-input" id="h-price" min="500" placeholder="e.g. 2000" value="${l.price||""}" />
        <span class="form-hint">Platform takes 10% commission. You receive 90%.</span>
      </div>
      <div class="form-group">
        <label class="form-label">Amenities</label>
        <div class="check-group" style="flex-wrap:wrap">
          ${["WiFi","Parking","Home-cooked Food","Breakfast Included","Hot Water","Valley View","Bonfire","AC","Private Bathroom","Kitchen Access","Laundry","Waterfall View","Farm Access","Stargazing"].map(e=>`
            <label class="check-item">
              <input type="checkbox" name="amenity" value="${e}" ${(l.amenities||[]).includes(e)?"checked":""} />
              <label>${e}</label>
            </label>
          `).join("")}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">About Your Place *</label>
        <textarea class="form-textarea" id="h-description" placeholder="Describe what makes your place special — views, atmosphere, what guests will love…" style="min-height:140px">${l.description||""}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Nearby Attractions</label>
        <input type="text" class="form-input" id="h-nearby" placeholder="e.g. Vantawng Falls (2 km), Thenzawl market" value="${l.nearby||""}" />
      </div>`;case 4:return`
      <h3 style="margin-bottom:8px">📸 Step 4: Photos</h3>
      <p style="color:var(--text-muted);margin-bottom:24px;font-size:0.9rem">High-quality photos get 3× more bookings. Minimum 3 photos required. First photo will be your cover image.</p>
      <div class="upload-zone" id="photo-upload-zone" onclick="document.getElementById('photo-input').click()">
        <div style="font-size:2.5rem;margin-bottom:12px">📷</div>
        <div style="font-weight:700;margin-bottom:6px">Upload Property Photos</div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">JPG or PNG • Max 5MB each • Minimum 3 required</div>
        <div style="font-size:0.8rem;color:var(--emerald-400)">💡 Include: exterior, bedroom, bathroom, view, dining area</div>
        <input type="file" id="photo-input" multiple accept="image/*" style="display:none" />
      </div>
      <div class="upload-preview" id="photo-preview" style="margin-top:16px"></div>
      <div id="photo-count" style="margin-top:10px;font-size:0.85rem;color:var(--text-muted)">${P.length>0?P.length+" photo(s) uploaded":"No photos uploaded yet"}</div>`;case 5:return`
      <h3 style="margin-bottom:24px">📜 Step 5: Rules & Submission</h3>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Check-in Time *</label><input type="time" class="form-input" id="h-checkin" value="${l.checkIn||"14:00"}" /></div>
        <div class="form-group"><label class="form-label">Check-out Time *</label><input type="time" class="form-input" id="h-checkout" value="${l.checkOut||"11:00"}" /></div>
      </div>
      <div class="form-group">
        <label class="form-label">House Rules</label>
        <textarea class="form-textarea" id="h-rules" placeholder="e.g. No smoking inside&#10;Quiet hours after 10 PM&#10;No outside guests after 9 PM&#10;Pets on request" style="min-height:120px">${l.rules||""}</textarea>
        <span class="form-hint">One rule per line</span>
      </div>
      <div class="form-group">
        <label class="form-label">Cancellation Policy</label>
        <select class="form-select" id="h-cancel">
          <option value="flexible" ${l.cancellation==="flexible"?"selected":""}>Flexible — Full refund 24 hours before</option>
          <option value="moderate" ${l.cancellation==="moderate"?"selected":""}>Moderate — Full refund 5 days before</option>
          <option value="strict" ${l.cancellation==="strict"?"selected":""}>Strict — 50% refund up to 1 week before</option>
        </select>
      </div>
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius);padding:24px;margin-bottom:20px">
        <div style="font-weight:700;margin-bottom:12px">✅ What happens after submission?</div>
        ${["Our team reviews your listing within 24–48 hours","We verify your ID and property photos","Once approved, your listing goes live on LushaiTrips","You receive 90% of every booking directly to your account"].map(e=>`<div style="display:flex;gap:10px;margin-bottom:8px;font-size:0.9rem;color:var(--text-muted)"><span style="color:var(--emerald-400)">→</span>${e}</div>`).join("")}
      </div>
      <label class="check-item" style="margin-bottom:20px">
        <input type="checkbox" id="h-agree" />
        <label style="font-size:0.9rem">I agree to LushaiTrips <a href="#" style="color:var(--emerald-400)">Host Terms & Conditions</a> and confirm all information is accurate.</label>
      </label>`}}function $t(t){var e,i,s,r,a,o,d,n,c,p,m,v,b,f,y,g,h,x,k,$,z,S,T,C,H,j,R,D,W;switch(t){case 1:l.name=(i=(e=document.getElementById("h-name"))==null?void 0:e.value)==null?void 0:i.trim(),l.email=(r=(s=document.getElementById("h-email"))==null?void 0:s.value)==null?void 0:r.trim(),l.phone=(o=(a=document.getElementById("h-phone"))==null?void 0:a.value)==null?void 0:o.trim(),l.password=(d=document.getElementById("h-password"))==null?void 0:d.value;const _=(n=document.getElementById("h-confirm"))==null?void 0:n.value;return!l.name||!l.email||!l.phone||!l.password?(u("Please fill all required fields","","error"),!1):l.password!==_?(u("Passwords do not match","","error"),!1):l.password.length<8?(u("Password must be 8+ characters","","error"),!1):!0;case 2:return l.propName=(p=(c=document.getElementById("h-prop-name"))==null?void 0:c.value)==null?void 0:p.trim(),l.propType=(m=document.querySelector('input[name="prop-type"]:checked'))==null?void 0:m.value,l.address=(b=(v=document.getElementById("h-address"))==null?void 0:v.value)==null?void 0:b.trim(),l.district=(f=document.getElementById("h-district"))==null?void 0:f.value,l.mapsLink=(g=(y=document.getElementById("h-maps"))==null?void 0:y.value)==null?void 0:g.trim(),!l.propName||!l.propType||!l.address||!l.district?(u("Please fill all required fields","","error"),!1):!0;case 3:return l.rooms=(h=document.getElementById("h-rooms"))==null?void 0:h.value,l.maxGuests=(x=document.getElementById("h-guests"))==null?void 0:x.value,l.price=(k=document.getElementById("h-price"))==null?void 0:k.value,l.amenities=[...document.querySelectorAll('input[name="amenity"]:checked')].map(N=>N.value),l.description=(z=($=document.getElementById("h-description"))==null?void 0:$.value)==null?void 0:z.trim(),l.nearby=(T=(S=document.getElementById("h-nearby"))==null?void 0:S.value)==null?void 0:T.trim(),!l.rooms||!l.maxGuests||!l.price||!l.description?(u("Please fill all required fields","","error"),!1):!0;case 4:return P.length<3?(u("Please upload at least 3 photos","","error"),!1):(l.images=P,!0);case 5:return l.checkIn=(C=document.getElementById("h-checkin"))==null?void 0:C.value,l.checkOut=(H=document.getElementById("h-checkout"))==null?void 0:H.value,l.rules=(R=(j=document.getElementById("h-rules"))==null?void 0:j.value)==null?void 0:R.trim(),l.cancellation=(D=document.getElementById("h-cancel"))==null?void 0:D.value,(W=document.getElementById("h-agree"))!=null&&W.checked?!0:(u("Please agree to Terms & Conditions","","error"),!1)}}function me(t){B=t,document.getElementById("stepper").innerHTML=ke(),document.getElementById("step-container").innerHTML=$e(t),document.getElementById("prev-btn").style.visibility=t===1?"hidden":"visible",document.getElementById("next-btn").textContent=t===G?"🚀 Submit Listing":"Next →",ze(t),window.scrollTo({top:0,behavior:"smooth"})}function ze(t){var e;t===4&&((e=document.getElementById("photo-input"))==null||e.addEventListener("change",i=>{[...i.target.files].forEach(r=>{const a=new FileReader;a.onload=o=>{var m;P.push(o.target.result);const d=document.getElementById("photo-preview"),n=document.getElementById("photo-count"),c=document.createElement("div");c.className="upload-img-wrap";const p=P.length-1;c.innerHTML=`<img src="${o.target.result}" alt="upload" />${p===0?'<div style="position:absolute;bottom:4px;left:4px;background:rgba(16,185,129,0.9);color:#fff;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:700">COVER</div>':""}<button class="remove-img" data-idx="${p}">✕</button>`,d==null||d.appendChild(c),n&&(n.textContent=P.length+" photo(s) uploaded"),(m=c.querySelector(".remove-img"))==null||m.addEventListener("click",v=>{P.splice(p,1),c.remove(),n&&(n.textContent=P.length+" photo(s) uploaded")})},a.readAsDataURL(r)})}))}function Ee(){var t,e;P=[],ze(1),(t=document.getElementById("next-btn"))==null||t.addEventListener("click",()=>{var i,s;$t(B)&&(B===G?zt():(me(B+1),(i=document.getElementById("next-btn"))==null||i.addEventListener("click",()=>{}),(s=document.getElementById("prev-btn"))==null||s.addEventListener("click",()=>{}),Ee()))}),(e=document.getElementById("prev-btn"))==null||e.addEventListener("click",()=>{B>1&&me(B-1)})}function zt(){var t,e;try{ie({name:l.name,email:l.email,phone:l.phone,password:l.password,avatar:(t=l.name)==null?void 0:t.charAt(0).toUpperCase(),listing:{name:l.propName,type:l.propType,address:l.address,district:l.district,rooms:l.rooms,maxGuests:l.maxGuests,price:l.price,amenities:l.amenities,description:l.description,images:l.images,checkIn:l.checkIn,checkOut:l.checkOut,rules:(e=l.rules)==null?void 0:e.split(`
`).filter(Boolean),cancellation:l.cancellation}}),B=1,P=[],u("Listing submitted for review! 🎉","We'll review within 48 hours."),setTimeout(()=>window.router.navigate("/host-dashboard"),800)}catch(i){u(i.message,"","error")}}let F=[];function Et(){return`
    <div style="min-height:100vh;padding:100px 24px 60px;background:linear-gradient(135deg,var(--bg) 0%,var(--bg2) 50%,var(--bg3) 100%)">
      <div style="max-width:680px;margin:0 auto">
        <div style="text-align:center;margin-bottom:40px">
          <div class="auth-logo" style="font-size:2rem;margin-bottom:8px">LushaiTrips</div>
          <h2 style="margin-bottom:8px">Register as a Guide</h2>
          <p style="color:var(--text-muted)">Share your knowledge of Mizoram's trails, culture, and wildlife</p>
        </div>

        <div class="card card-body" style="padding:40px">
          <h3 style="margin-bottom:24px">👤 Personal Information</h3>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Full Name *</label><input type="text" class="form-input" id="g-name" placeholder="Your full name" /></div>
            <div class="form-group"><label class="form-label">Phone *</label><input type="tel" class="form-input" id="g-phone" placeholder="+91 98765 43210" /></div>
          </div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Email *</label><input type="email" class="form-input" id="g-email" placeholder="you@example.com" /></div>
            <div class="form-group"><label class="form-label">Password *</label><input type="password" class="form-input" id="g-password" placeholder="Min 8 characters" /></div>
          </div>

          <div class="divider-h"></div>
          <h3 style="margin-bottom:24px">🧭 Guide Details</h3>

          <div class="form-group"><label class="form-label">Professional Title *</label><input type="text" class="form-input" id="g-title" placeholder="e.g. Expert Trekking & Wildlife Guide" /></div>

          <div class="form-group">
            <label class="form-label">Years of Experience *</label>
            <select class="form-select" id="g-exp">
              <option value="">Select experience</option>
              ${["1 year","2 years","3 years","4 years","5 years","6 years","7 years","8 years","9 years","10+ years"].map(t=>`<option>${t}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Languages Spoken *</label>
            <div class="check-group">
              ${["English","Mizo","Hindi","Bengali","Assamese","Manipuri"].map(t=>`<label class="chip" style="cursor:pointer;display:flex;align-items:center;gap:6px"><input type="checkbox" name="g-lang" value="${t}" style="accent-color:var(--emerald-500)" />${t}</label>`).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Specialties * <span style="font-size:0.8rem;color:var(--text-dim)">(select all that apply)</span></label>
            <div class="check-group" style="flex-wrap:wrap">
              ${["Trekking","Bird Watching","Wildlife Spotting","Photography Tours","Village Walks","Cultural Tours","River Kayaking","Night Trekking","Jungle Camping","Cycling Tours","Heritage Walks","Botanical Walks"].map(t=>`<label class="chip" style="cursor:pointer;display:flex;align-items:center;gap:6px"><input type="checkbox" name="g-spec" value="${t}" style="accent-color:var(--emerald-500)" />${t}</label>`).join("")}
            </div>
          </div>

          <div class="form-group"><label class="form-label">Your Base Location *</label>
            <select class="form-select" id="g-location">
              <option value="">Select district</option>
              ${["Aizawl","Lunglei","Champhai","Kolasib","Lawngtlai","Mamit","Saiha","Serchhip","Saitual","Hnahthial","Khawzawl"].map(t=>`<option>${t}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Price per Day (₹) *</label>
            <input type="number" class="form-input" id="g-price" min="500" placeholder="e.g. 1500" />
            <span class="form-hint">Recommended: ₹1,000–₹2,500/day for Mizoram guides</span>
          </div>

          <div class="form-group"><label class="form-label">Bio / About You *</label><textarea class="form-textarea" id="g-bio" placeholder="Tell travelers about yourself — your experience, passion, and what makes you a unique guide…" style="min-height:140px"></textarea></div>

          <div class="form-group">
            <label class="form-label">Certifications <span style="font-size:0.8rem;color:var(--text-dim)">(one per line)</span></label>
            <textarea class="form-textarea" id="g-certs" placeholder="e.g. Ministry of Tourism Certified&#10;First Aid Certified&#10;Wildlife Institute of India" style="min-height:80px"></textarea>
          </div>

          <div class="divider-h"></div>
          <h3 style="margin-bottom:16px">📸 Profile & Gallery Photos</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px">Upload a clear profile photo and photos from your past guiding trips (min 2 photos)</p>
          <div class="upload-zone" onclick="document.getElementById('g-photos').click()">
            <div style="font-size:2rem;margin-bottom:8px">📷</div>
            <div style="font-weight:600;margin-bottom:4px">Upload Photos</div>
            <div style="font-size:0.8rem;color:var(--text-dim)">First photo = profile photo • JPG or PNG</div>
            <input type="file" id="g-photos" multiple accept="image/*" style="display:none" />
          </div>
          <div class="upload-preview" id="g-photo-preview" style="margin-top:12px"></div>

          <label class="check-item" style="margin-bottom:24px">
            <input type="checkbox" id="g-agree" />
            <label style="font-size:0.9rem">I certify all information is accurate and agree to LushaiTrips <a href="#" style="color:var(--emerald-400)">Guide Terms</a></label>
          </label>

          <button class="btn btn-primary w-full" id="submit-guide-btn" style="justify-content:center;padding:16px;font-size:1rem">Submit Guide Application 🧭</button>
        </div>
      </div>
    </div>
  `}function Lt(){var t,e;F=[],(t=document.getElementById("g-photos"))==null||t.addEventListener("change",i=>{[...i.target.files].forEach(s=>{const r=new FileReader;r.onload=a=>{var n,c;F.push(a.target.result);const o=document.createElement("div");o.className="upload-img-wrap";const d=F.length-1;o.innerHTML=`<img src="${a.target.result}" alt="upload" />${d===0?'<div style="position:absolute;bottom:4px;left:4px;background:rgba(16,185,129,0.9);color:#fff;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:700">PROFILE</div>':""}<button class="remove-img">✕</button>`,(n=document.getElementById("g-photo-preview"))==null||n.appendChild(o),(c=o.querySelector(".remove-img"))==null||c.addEventListener("click",()=>{F.splice(d,1),o.remove()})},r.readAsDataURL(s)})}),(e=document.getElementById("submit-guide-btn"))==null||e.addEventListener("click",()=>{var f,y,g,h,x,k,$,z,S,T,C,H,j,R,D,W,_;const i=(y=(f=document.getElementById("g-name"))==null?void 0:f.value)==null?void 0:y.trim(),s=(h=(g=document.getElementById("g-email"))==null?void 0:g.value)==null?void 0:h.trim(),r=(k=(x=document.getElementById("g-phone"))==null?void 0:x.value)==null?void 0:k.trim(),a=($=document.getElementById("g-password"))==null?void 0:$.value,o=(S=(z=document.getElementById("g-title"))==null?void 0:z.value)==null?void 0:S.trim(),d=(C=(T=document.getElementById("g-bio"))==null?void 0:T.value)==null?void 0:C.trim(),n=(H=document.getElementById("g-price"))==null?void 0:H.value,c=(j=document.getElementById("g-location"))==null?void 0:j.value,p=(R=document.getElementById("g-exp"))==null?void 0:R.value,m=[...document.querySelectorAll('input[name="g-lang"]:checked')].map(N=>N.value),v=[...document.querySelectorAll('input[name="g-spec"]:checked')].map(N=>N.value),b=(W=(D=document.getElementById("g-certs"))==null?void 0:D.value)==null?void 0:W.split(`
`).filter(Boolean);if(!i||!s||!r||!a||!o||!d||!n||!c||!p||!m.length||!v.length){u("Please fill all required fields","","error");return}if(!((_=document.getElementById("g-agree"))!=null&&_.checked)){u("Please agree to Terms","","error");return}try{ie({name:i,email:s,phone:r,password:a,avatar:i.charAt(0).toUpperCase(),listing:{type:"guide",title:o,experience:p,languages:m,specialties:v,price:n,location:c,bio:d,certifications:b,images:F}}),u("Guide application submitted! 🎉","We'll review within 48 hours."),setTimeout(()=>window.router.navigate("/host-dashboard"),800)}catch(N){u(N.message,"","error")}})}function It(){return`
    <div style="min-height:100vh;padding:100px 24px 60px;background:linear-gradient(135deg,var(--bg) 0%,var(--bg2) 50%,var(--bg3) 100%)">
      <div style="max-width:680px;margin:0 auto">
        <div style="text-align:center;margin-bottom:40px">
          <div class="auth-logo" style="font-size:2rem;margin-bottom:8px">LushaiTrips</div>
          <h2 style="margin-bottom:8px">List Your Transport</h2>
          <p style="color:var(--text-muted)">Connect travelers with reliable rides across Mizoram's mountain roads</p>
        </div>

        <div class="card card-body" style="padding:40px">
          <h3 style="margin-bottom:24px">👤 Personal Information</h3>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Full Name *</label><input type="text" class="form-input" id="t-name" placeholder="Your full name" /></div>
            <div class="form-group"><label class="form-label">Phone *</label><input type="tel" class="form-input" id="t-phone" placeholder="+91 98765 43210" /></div>
          </div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Email *</label><input type="email" class="form-input" id="t-email" placeholder="you@example.com" /></div>
            <div class="form-group"><label class="form-label">Password *</label><input type="password" class="form-input" id="t-password" placeholder="Min 8 characters" /></div>
          </div>

          <div class="divider-h"></div>
          <h3 style="margin-bottom:24px">🚗 Business Details</h3>

          <div class="form-group"><label class="form-label">Business / Service Name *</label><input type="text" class="form-input" id="t-biz" placeholder="e.g. Raj Mizoram Travels" /></div>

          <div class="form-group">
            <label class="form-label">Service Type *</label>
            <div class="check-group">
              ${["Car & SUV Rental","Motorcycle & Bike Rental","Shared Sumo / Van","Private Van Hire","Airport Transfer","Tempo Traveller"].map(t=>`<label class="chip" style="cursor:pointer;display:flex;align-items:center;gap:6px"><input type="radio" name="t-type" value="${t}" style="accent-color:var(--emerald-500)" />${t}</label>`).join("")}
            </div>
          </div>

          <div class="form-group"><label class="form-label">Base Location *</label>
            <select class="form-select" id="t-location">
              <option value="">Select district</option>
              ${["Aizawl","Lunglei","Champhai","Kolasib","Lawngtlai","Mamit","Saiha","Serchhip"].map(t=>`<option>${t}</option>`).join("")}
            </select>
          </div>

          <div class="divider-h"></div>
          <h3 style="margin-bottom:16px">🚘 Your Vehicles</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:20px">Add details for each vehicle you offer</p>

          <div id="vehicles-container">
            ${Le(0)}
          </div>
          <button class="btn btn-outline btn-sm" id="add-vehicle-btn" style="margin-bottom:28px">+ Add Another Vehicle</button>

          <div class="form-group">
            <label class="form-label">Features & Services</label>
            <div class="check-group" style="flex-wrap:wrap">
              ${["Airport Pickup","AC Vehicles","Night Driving","Driver Provided","Fuel Included","All Districts","Breakdown Assistance","Child Seats","Helmets Included","Riding Gear","Route Maps","Delivery to Hotel"].map(t=>`<label class="chip" style="cursor:pointer;display:flex;align-items:center;gap:6px"><input type="checkbox" name="t-feat" value="${t}" style="accent-color:var(--emerald-500)" />${t}</label>`).join("")}
            </div>
          </div>

          <div class="form-group"><label class="form-label">Description *</label><textarea class="form-textarea" id="t-desc" placeholder="Describe your service — coverage areas, experience, what makes you reliable…" style="min-height:120px"></textarea></div>

          <div class="divider-h"></div>
          <h3 style="margin-bottom:16px">📸 Vehicle Photos</h3>
          <div class="upload-zone" onclick="document.getElementById('t-photos').click()">
            <div style="font-size:2rem;margin-bottom:8px">🚗</div>
            <div style="font-weight:600;margin-bottom:4px">Upload Vehicle Photos</div>
            <div style="font-size:0.8rem;color:var(--text-dim)">Min 2 photos — exterior, interior • JPG or PNG</div>
            <input type="file" id="t-photos" multiple accept="image/*" style="display:none" />
          </div>
          <div class="upload-preview" id="t-photo-preview" style="margin-top:12px"></div>

          <div class="divider-h"></div>
          <div class="form-group">
            <label class="form-label">Driving License / RC Book * <span style="font-size:0.8rem;color:var(--text-dim)">(upload document)</span></label>
            <div class="upload-zone" onclick="document.getElementById('t-license').click()" style="padding:20px">
              <div style="font-size:1.5rem;margin-bottom:6px">📄</div>
              <div style="font-size:0.9rem;font-weight:600">Upload License / RC</div>
              <input type="file" id="t-license" accept=".jpg,.png,.pdf" style="display:none" />
            </div>
            <div id="t-license-preview" style="font-size:0.85rem;color:var(--emerald-400);margin-top:6px"></div>
          </div>

          <label class="check-item" style="margin-bottom:24px">
            <input type="checkbox" id="t-agree" />
            <label style="font-size:0.9rem">I certify all information is accurate and agree to LushaiTrips <a href="#" style="color:var(--emerald-400)">Transport Partner Terms</a></label>
          </label>

          <button class="btn btn-primary w-full" id="submit-transport-btn" style="justify-content:center;padding:16px;font-size:1rem">Submit Transport Listing 🚗</button>
        </div>
      </div>
    </div>
  `}let ue=1;function Le(t){return`
    <div class="card card-body" style="padding:20px;margin-bottom:16px;${t>0?"position:relative":""}">
      ${t>0?'<button class="remove-img" style="position:absolute;top:12px;right:12px;width:24px;height:24px" onclick="this.parentElement.remove()">✕</button>':""}
      <div style="font-weight:700;margin-bottom:16px;font-size:0.9rem;color:var(--emerald-400)">Vehicle ${t+1}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Vehicle Name *</label><input type="text" class="form-input" placeholder="e.g. Toyota Innova Crysta" /></div>
        <div class="form-group"><label class="form-label">Passenger Capacity *</label><input type="number" class="form-input" min="1" max="30" placeholder="e.g. 7" /></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Price (₹) *</label><input type="number" class="form-input" placeholder="e.g. 3500" /></div>
        <div class="form-group"><label class="form-label">Price Unit</label>
          <select class="form-select"><option>per day (fuel incl.)</option><option>per day (fuel extra)</option><option>per km</option><option>per seat per route</option></select>
        </div>
      </div>
    </div>
  `}function St(){var e,i,s,r;let t=[];(e=document.getElementById("add-vehicle-btn"))==null||e.addEventListener("click",()=>{ue++,document.getElementById("vehicles-container").insertAdjacentHTML("beforeend",Le(ue-1))}),(i=document.getElementById("t-photos"))==null||i.addEventListener("change",a=>{[...a.target.files].forEach(o=>{const d=new FileReader;d.onload=n=>{var p,m;t.push(n.target.result);const c=document.createElement("div");c.className="upload-img-wrap",c.innerHTML=`<img src="${n.target.result}" alt="v" /><button class="remove-img">✕</button>`,(p=document.getElementById("t-photo-preview"))==null||p.appendChild(c),(m=c.querySelector(".remove-img"))==null||m.addEventListener("click",()=>{t.splice(t.indexOf(n.target.result),1),c.remove()})},d.readAsDataURL(o)})}),(s=document.getElementById("t-license"))==null||s.addEventListener("change",a=>{a.target.files[0]&&(document.getElementById("t-license-preview").textContent="✅ "+a.target.files[0].name)}),(r=document.getElementById("submit-transport-btn"))==null||r.addEventListener("click",()=>{var f,y,g,h,x,k,$,z,S,T,C,H,j,R;const a=(y=(f=document.getElementById("t-name"))==null?void 0:f.value)==null?void 0:y.trim(),o=(h=(g=document.getElementById("t-email"))==null?void 0:g.value)==null?void 0:h.trim(),d=(k=(x=document.getElementById("t-phone"))==null?void 0:x.value)==null?void 0:k.trim(),n=($=document.getElementById("t-password"))==null?void 0:$.value,c=(S=(z=document.getElementById("t-biz"))==null?void 0:z.value)==null?void 0:S.trim(),p=(T=document.querySelector('input[name="t-type"]:checked'))==null?void 0:T.value,m=(C=document.getElementById("t-location"))==null?void 0:C.value,v=(j=(H=document.getElementById("t-desc"))==null?void 0:H.value)==null?void 0:j.trim(),b=[...document.querySelectorAll('input[name="t-feat"]:checked')].map(D=>D.value);if(!a||!o||!d||!n||!c||!p||!m||!v){u("Please fill all required fields","","error");return}if(!((R=document.getElementById("t-agree"))!=null&&R.checked)){u("Please agree to Terms","","error");return}try{ie({name:a,email:o,phone:d,password:n,avatar:a.charAt(0).toUpperCase(),listing:{type:"transport",name:c,serviceType:p,location:m,description:v,features:b,images:t}}),u("Transport listing submitted! 🎉","We'll review within 48 hours."),setTimeout(()=>window.router.navigate("/host-dashboard"),800)}catch(D){u(D.message,"","error")}})}function Bt(){const t=E,e=M();if(!e)return`<div class="page-hero container"><h1>Please <a href="${t("/login")}" data-link style="color:var(--emerald-400)">log in</a> to view your profile</h1></div>`;const i=Me(),s=ae(),r=A.filter(a=>s.includes(a.id));return`
    <section class="page-hero" style="padding-bottom:40px">
      <div class="container">
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
          <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--emerald-500),var(--emerald-800));display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;flex-shrink:0">${e.avatar||"👤"}</div>
          <div>
            <h1 style="font-size:clamp(1.5rem,3vw,2rem);margin-bottom:4px">${e.fullName||e.name}</h1>
            <div style="color:var(--text-muted);font-size:0.9rem">${e.email} · Member since ${new Date(e.createdAt).getFullYear()}</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="logout-btn" style="margin-left:auto">🚪 Log Out</button>
        </div>
      </div>
    </section>

    <section style="padding-bottom:80px">
      <div class="container">
        <div class="tabs" id="profile-tabs">
          <button class="tab-btn active" data-tab="bookings">📅 My Bookings (${i.length})</button>
          <button class="tab-btn" data-tab="wishlist">❤️ Wishlist (${r.length})</button>
          <button class="tab-btn" data-tab="account">👤 Account</button>
        </div>

        <!-- Bookings -->
        <div id="tab-bookings">
          ${i.length?i.map(a=>{var o;return`
            <div class="card card-body" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
              <div style="flex:1;min-width:200px">
                <div style="font-weight:700;margin-bottom:4px">${a.listingName}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">📅 ${a.checkin?new Date(a.checkin+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):new Date(a.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">Ref: <strong style="color:var(--emerald-400)">${a.id}</strong></div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;font-size:1.1rem;color:var(--emerald-400)">₹${(o=a.total)==null?void 0:o.toLocaleString()}</div>
                <span class="badge badge-approved">✅ Confirmed</span>
              </div>
            </div>
          `}).join(""):`
            <div style="text-align:center;padding:60px;color:var(--text-muted)">
              <div style="font-size:4rem;margin-bottom:16px">🏕️</div>
              <h3 style="margin-bottom:12px">No bookings yet</h3>
              <p style="margin-bottom:24px">Start exploring Mizoram's hidden gems!</p>
              <a href="${t("/discover")}" class="btn btn-primary" data-link>Discover Destinations</a>
            </div>
          `}
        </div>

        <!-- Wishlist -->
        <div id="tab-wishlist" class="hidden">
          ${r.length?`
            <div class="grid-3">${r.map(a=>`
              <div class="card" data-href="/stay/${a.id}" style="cursor:pointer">
                <div class="card-img-wrap"><img src="${a.coverImage}" alt="${a.name}" loading="lazy" /><div class="card-rating">${I(a.rating)} ${a.rating}</div></div>
                <div class="card-body"><h4 class="card-title">${a.name}</h4><div class="price">₹${a.price.toLocaleString()}<span>/night</span></div></div>
              </div>`).join("")}
            </div>`:`
            <div style="text-align:center;padding:60px;color:var(--text-muted)">
              <div style="font-size:4rem;margin-bottom:16px">🤍</div>
              <h3 style="margin-bottom:12px">Your wishlist is empty</h3>
              <p style="margin-bottom:24px">Save stays you love while browsing</p>
              <a href="${t("/stays")}" class="btn btn-primary" data-link>Browse Stays</a>
            </div>`}
        </div>

        <!-- Account -->
        <div id="tab-account" class="hidden">
          <div class="card card-body" style="max-width:500px">
            <h3 style="margin-bottom:24px">Account Information</h3>
            <div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input" value="${e.fullName||e.name||""}" readonly /></div>
            <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" value="${e.email||""}" readonly /></div>
            <div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-input" value="${e.phone||""}" readonly /></div>
            <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:14px;font-size:0.85rem;color:var(--text-muted);margin-bottom:20px">
              💡 To update your information, please contact us at <a href="mailto:support@lushaitrips.com" style="color:var(--emerald-400)">support@lushaitrips.com</a>
            </div>
            ${e.role!=="host"?`
              <div class="divider-h"></div>
              <h4 style="margin-bottom:12px">Become a Host</h4>
              <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:16px">List your property, guide service, or transport on LushaiTrips.</p>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <a href="${t("/host-signup-stay")}" class="btn btn-outline btn-sm" data-link>🏡 List Stay</a>
                <a href="${t("/host-signup-guide")}" class="btn btn-outline btn-sm" data-link>🧭 List Guide</a>
                <a href="${t("/host-signup-transport")}" class="btn btn-outline btn-sm" data-link>🚗 List Transport</a>
              </div>`:""}
          </div>
        </div>
      </div>
    </section>
  `}function Tt(){var e;(e=document.getElementById("logout-btn"))==null||e.addEventListener("click",()=>{ee()});const t=document.querySelectorAll(".tab-btn[data-tab]");t.forEach(i=>{i.addEventListener("click",()=>{var s;t.forEach(r=>r.classList.remove("active")),i.classList.add("active"),document.querySelectorAll('[id^="tab-"]').forEach(r=>r.classList.add("hidden")),(s=document.getElementById(`tab-${i.dataset.tab}`))==null||s.classList.remove("hidden")})}),document.querySelectorAll("[data-href]").forEach(i=>i.addEventListener("click",()=>window.router.navigate(i.dataset.href)))}function Mt(){const t=E,e=M();if(!e)return`<div class="page-hero container"><h1>Please <a href="${t("/login")}" data-link style="color:var(--emerald-400)">log in</a></h1></div>`;if(e.role!=="host")return`<div class="page-hero container"><h1>Host access only. <a href="${t("/host-signup-stay")}" data-link style="color:var(--emerald-400)">Become a Host →</a></h1></div>`;const i=(w.get("lt_listings")||[]).filter(a=>a.hostId===e.id),s=(w.get("lt_bookings")||[]).filter(a=>i.some(o=>o.id===a.listingId)),r=s.reduce((a,o)=>a+(o.total||0)*.9,0);return`
    <section class="page-hero" style="padding-bottom:40px">
      <div class="container">
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--emerald-500),var(--emerald-800));display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800">${e.avatar}</div>
          <div>
            <h1 style="font-size:clamp(1.5rem,3vw,2rem);margin-bottom:4px">Host Dashboard</h1>
            <div style="color:var(--text-muted)">Welcome back, ${e.name} · <span class="${e.status==="pending"?"badge badge-pending":"badge badge-approved"}">${e.status==="pending"?"⏳ Pending Approval":"✅ Active Host"}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section style="padding-bottom:80px">
      <div class="container">
        ${e.status==="pending"?`
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:24px;margin-bottom:32px">
            <div style="font-weight:700;font-size:1.1rem;margin-bottom:8px">⏳ Your listing is under review</div>
            <div style="color:var(--text-muted);font-size:0.9rem">Our team reviews new listings within 24–48 hours. You'll receive an email once approved. In the meantime, you can preview your listing below.</div>
          </div>
        `:""}

        <!-- Stats -->
        <div class="grid-4" style="margin-bottom:40px">
          ${[{icon:"🏠",label:"Active Listings",value:i.length},{icon:"📅",label:"Total Bookings",value:s.length},{icon:"💰",label:"Total Earnings",value:`₹${Math.round(r).toLocaleString()}`},{icon:"⭐",label:"Avg Rating",value:"4.8"}].map(a=>`
            <div class="card card-body text-center">
              <div style="font-size:2rem;margin-bottom:8px">${a.icon}</div>
              <div style="font-family:var(--font-head);font-size:1.8rem;font-weight:800;color:var(--text);margin-bottom:4px">${a.value}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">${a.label}</div>
            </div>
          `).join("")}
        </div>

        <div class="tabs" id="host-tabs">
          <button class="tab-btn active" data-tab="listings">🏠 Listings</button>
          <button class="tab-btn" data-tab="bookings">📅 Bookings</button>
          <button class="tab-btn" data-tab="add">+ Add New</button>
        </div>

        <!-- Listings tab -->
        <div id="tab-listings">
          ${i.length?i.map(a=>{var o,d,n;return`
            <div class="card card-body" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
              <div style="flex:1;min-width:200px">
                <div style="font-weight:700;margin-bottom:4px">${a.name||((o=a.listing)==null?void 0:o.name)||"Unnamed Listing"}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">📍 ${a.district||((d=a.listing)==null?void 0:d.location)||"—"}</div>
                <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Price: ₹${a.price||((n=a.listing)==null?void 0:n.price)||"—"}/night</div>
              </div>
              <span class="${a.status==="pending"?"badge badge-pending":"badge badge-approved"}">${a.status==="pending"?"⏳ Under Review":"✅ Live"}</span>
            </div>
          `}).join(""):`
            <div style="text-align:center;padding:60px;color:var(--text-muted)">
              <div style="font-size:4rem;margin-bottom:16px">🏠</div>
              <h3 style="margin-bottom:12px">No listings yet</h3>
              <p style="margin-bottom:24px">Add your first property, guide service, or transport below.</p>
            </div>
          `}
        </div>

        <!-- Bookings tab -->
        <div id="tab-bookings" class="hidden">
          ${s.length?s.map(a=>`
            <div class="card card-body" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
              <div style="flex:1">
                <div style="font-weight:700;margin-bottom:4px">${a.listingName}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">👤 ${a.guestName} · 📞 ${a.guestPhone}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">📅 ${a.checkin||"N/A"} → ${a.checkout||"N/A"} · 👥 ${a.guests||"—"} guests</div>
                <div style="font-size:0.75rem;color:var(--text-dim);margin-top:4px">Ref: ${a.id}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;color:var(--emerald-400)">₹${Math.round((a.total||0)*.9).toLocaleString()} <span style="font-size:0.75rem;color:var(--text-dim)">(your share)</span></div>
                <span class="badge badge-approved">✅ Confirmed</span>
              </div>
            </div>
          `).join(""):`
            <div style="text-align:center;padding:60px;color:var(--text-muted)">
              <div style="font-size:4rem;margin-bottom:16px">📅</div>
              <h3 style="margin-bottom:12px">No bookings yet</h3>
              <p>Bookings will appear here once guests book your listing.</p>
            </div>
          `}
        </div>

        <!-- Add listing tab -->
        <div id="tab-add" class="hidden">
          <div class="grid-3">
            ${[{icon:"🏡",title:"Add Stay",desc:"List a homestay, hotel, lodge, or camping site",href:"/host-signup-stay"},{icon:"🧭",title:"Register as Guide",desc:"Offer trekking, wildlife, or cultural tour services",href:"/host-signup-guide"},{icon:"🚗",title:"List Transport",desc:"Cars, bikes, SUVs, shared Sumo or vans",href:"/host-signup-transport"}].map(a=>`
              <a href="${t(a.href)}" class="card card-body text-center" data-link style="cursor:pointer">
                <div style="font-size:3rem;margin-bottom:16px">${a.icon}</div>
                <h4 style="margin-bottom:8px">${a.title}</h4>
                <p style="font-size:0.9rem;margin-bottom:20px">${a.desc}</p>
                <span class="btn btn-primary btn-sm" style="margin:0 auto">Get Started →</span>
              </a>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `}function At(){const t=document.querySelectorAll(".tab-btn[data-tab]");t.forEach(e=>{e.addEventListener("click",()=>{var i;t.forEach(s=>s.classList.remove("active")),e.classList.add("active"),document.querySelectorAll('[id^="tab-"]').forEach(s=>s.classList.add("hidden")),(i=document.getElementById(`tab-${e.dataset.tab}`))==null||i.classList.remove("hidden")})})}const ge={"/":{render:Re,init:qe,footer:!0},"/discover":{render:Ne,init:Ge,footer:!0},"/surprise":{render:_e,init:Ye,footer:!0},"/stays":{render:Qe,init:Xe,footer:!0},"/guides":{render:st,init:rt,footer:!0},"/transport":{render:lt,init:dt,footer:!0},"/booking-confirmed":{render:vt,init:ht,footer:!1},"/login":{render:yt,init:ft,footer:!1},"/signup-user":{render:bt,init:xt,footer:!1},"/host-signup-stay":{render:kt,init:Ee,footer:!1},"/host-signup-guide":{render:Et,init:Lt,footer:!1},"/host-signup-transport":{render:It,init:St,footer:!1},"/profile":{render:Bt,init:Tt,footer:!0},"/host-dashboard":{render:Mt,init:At,footer:!0}};function Pt(t){if(ge[t])return{route:ge[t],params:{}};if(t.startsWith("/destination/")){const e=t.slice(13);return{route:{render:()=>Ke(e),init:()=>Ze(e),footer:!0},params:{id:e}}}if(t.startsWith("/stay/")){const e=t.slice(6);return{route:{render:()=>tt(e),init:()=>it(e),footer:!0},params:{id:e}}}if(t.startsWith("/guide/")){const e=t.slice(7);return{route:{render:()=>ot(e),init:()=>nt(e),footer:!0},params:{id:e}}}if(t.startsWith("/transport/")){const e=t.slice(11);return{route:{render:()=>ct(e),init:()=>pt(e),footer:!0},params:{id:e}}}if(t.startsWith("/book/")){const e=t.slice(6);return{route:{render:()=>null,init:()=>null,footer:!1,booking:e},params:{id:e}}}return{route:{render:()=>`<div style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:120px 24px"><div><div style="font-size:5rem;margin-bottom:16px">🗺️</div><h1 style="margin-bottom:12px">Page Not Found</h1><p style="margin-bottom:24px;color:var(--text-muted)">Looks like this trail doesn't exist.</p><a href="${E("/")}" class="btn btn-primary" data-link>Back to Home</a></div></div>`,init:()=>{},footer:!0},params:{}}}function Ct(t){const e=t.trim(),i=e.indexOf("?"),s=i>=0?e.slice(0,i):e,r=i>=0?e.slice(i):"",a="/LushaiTravels/".replace(/\/$/,"");return!!a&&(s===a||s.startsWith(`${a}/`))?s+r:E(s)+r}async function Ie(t){const e=Ct(t),i=new URL(e,window.location.origin);history.pushState({},"",i.pathname+i.search+i.hash),await ne(U(i.pathname),i.searchParams)}async function ne(t,e=new URLSearchParams){var a;const i=document.getElementById("page-content"),s=document.getElementById("footer-container");if(t.startsWith("/book/")){const o=t.slice(6);i.innerHTML=ut(o,e),s.innerHTML="",de(),ve(),gt(o,e),le();return}const{route:r}=Pt(t);de(),i.innerHTML=r.render()||"",r.footer?Pe():s.innerHTML="",ve(),(a=r.init)==null||a.call(r),le()}function ve(){document.querySelectorAll("[data-link]").forEach(t=>{t.removeEventListener("click",he),t.addEventListener("click",he)})}function he(t){t.preventDefault();const e=t.currentTarget.getAttribute("href");e&&e!=="#"&&Ie(e)}window.router={navigate:Ie};window.addEventListener("popstate",()=>{ne(U(location.pathname),new URLSearchParams(location.search))});ne(U(location.pathname),new URLSearchParams(location.search));
