const API = "http://127.0.0.1:5000";

/* ================= PROJECTS ================= */
async function loadProjects() {
    const res = await fetch(`${API}/projects`);
    const data = await res.json();

    const container = document.getElementById("projects-container");
    if (!container) return;

    container.innerHTML = "";

    data.forEach((p, index) => {

        let imagesHTML = "";

        if (p.images && p.images.length > 0) {
            imagesHTML = `
                <div class="slider">
                    <img src="${API}/uploads/${p.images[0]}" 
                         class="project-img" 
                         id="img-${index}"
                         onerror="this.style.display='none'">

                    ${p.images.length > 1 ? `
                        <button class="prev" onclick="changeSlide(${index}, -1)">⬅</button>
                        <button class="next" onclick="changeSlide(${index}, 1)">➡</button>
                    ` : ""}
                </div>
            `;
        }

        container.innerHTML += `
            <div class="project-card">
                ${imagesHTML}
                <h3>${p.title || ""}</h3>
                <p>${p.description || ""}</p>

                <div class="project-links">
                    ${p.project_link ? `<a href="${p.project_link}" target="_blank">🔗 Github</a>` : ""}
                    ${p.documentation_link ? `<a href="${p.documentation_link}" target="_blank">📄 Docs</a>` : ""}
                </div>
            </div>
        `;
    });

    window.projectData = data;
    window.projectIndex = {};
}

/* ================= SLIDER ================= */
function changeSlide(projectIdx, direction) {
    const images = window.projectData[projectIdx].images;

    if (!window.projectIndex[projectIdx]) {
        window.projectIndex[projectIdx] = 0;
    }

    let current = window.projectIndex[projectIdx] + direction;

    if (current < 0) current = images.length - 1;
    if (current >= images.length) current = 0;

    window.projectIndex[projectIdx] = current;

    document.getElementById(`img-${projectIdx}`).src =
        `${API}/uploads/${images[current]}`;
}

/* ================= EDUCATION ================= */
// async function loadEducation() {
//     const res = await fetch(`${API}/education`);
//     const data = await res.json();

//     const container = document.getElementById("education");
//     if (!container) return;

//     container.innerHTML = "";

//     data.forEach(e => {
//         container.innerHTML += `
//             <div class="edu-card">
//                 ${e.logo ? `<img src="${API}/uploads/${e.logo}" class="edu-logo">` : ""}
//                 <h3>${e.degree || ""}</h3>
//                 <p>${e.college_name || ""}</p>
//                 <p>${e.duration || ""}</p>
//             </div>
//         `;
//     });
// }

async function loadEducation() {
    const res = await fetch(`${API}/education`);
    const data = await res.json();

    const container = document.getElementById("education");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(e => {
        container.innerHTML += `
            <div class="edu-card">

                <div class="edu-left">
                    ${e.logo ? `<img src="/uploads/${e.logo}" class="edu-logo">` : ""}
                </div>

                <div class="edu-right">
                    <h3>${e.college_name || ""}</h3>

                    <p class="edu-degree">
                        ${e.degree || ""} ${e.branch ? "- " + e.branch : ""}
                    </p>

                    <p class="edu-duration">
                        ${e.duration || ""}
                    </p>
                </div>

            </div>
        `;
    });
}
/* ================= EXPERIENCE ================= */
async function loadExperience() {
    const res = await fetch(`${API}/experience`);
    const data = await res.json();

    const container = document.getElementById("experience");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(e => {
        container.innerHTML += `
            <div class="exp-card">
                ${e.logo ? `<img src="${API}/uploads/${e.logo}" class="exp-logo">` : ""}
                <h3>${e.role || ""}</h3>
                <p><b>${e.company || ""}</b></p>
                <p>${e.duration || ""}</p>
                <p>${e.description || ""}</p>
            </div>
        `;
    });
}

/* ================= CERTIFICATIONS ================= */
/* ================= CERTIFICATIONS ================= */

async function loadCertifications() {
    try {
        const res = await fetch(`${API}/certifications`);
        const data = await res.json();

        const container = document.getElementById("certifications");
        if (!container) return;

        container.innerHTML = "";

        data.forEach(c => {

            container.innerHTML += `
                <div class="cert-card">

                    ${c.logo ? `
                        <img src="${API}/uploads/${c.logo}" 
                             class="cert-logo"
                             onerror="this.style.display='none'">
                    ` : ""}

                    <h3>${c.name || ""}</h3>

                    <p class="cert-org">${c.organization || ""}</p>

                    <p class="cert-date">
                        ${c.issue_month || ""} ${c.issue_year || ""}
                        ${c.expiry_year ? ` - ${c.expiry_month || ""} ${c.expiry_year}` : ""}
                    </p>

                    ${c.credential_url ? `
                        <a href="${c.credential_url}" 
                           target="_blank" 
                           class="cert-link">
                           🔗 View Credential
                        </a>
                    ` : ""}
                </div>
            `;
        });

    } catch (err) {
        console.error("Error loading certifications:", err);
    }
}


/* ================= SMOOTH SCROLL ================= */
document.querySelectorAll("nav a").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

/* ================= HERO BUTTON ================= */
const heroBtn = document.querySelector(".hero-btn");

if (heroBtn) {
    heroBtn.addEventListener("click", () => {
        document.querySelector("#about").scrollIntoView({
            behavior: "smooth"
        });
    });
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
    loadEducation();
    loadExperience();
    loadCertifications();
});


// /* ================= ADD / UPDATE ================= */
// async function addCertification() {

//     // ✅ UPDATE MODE
//     if (window.editCertId) {

//         await fetch(`${API}/update-certification/${window.editCertId}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 name: document.getElementById("cert_name").value,
//                 organization: document.getElementById("cert_org").value
//             })
//         });

//         alert("Certification Updated ✅");
//         window.editCertId = null;
//     }

//     // ✅ ADD MODE
//     else {
//         const formData = new FormData();

//         formData.append("name", document.getElementById("cert_name").value);
//         formData.append("organization", document.getElementById("cert_org").value);
//         formData.append("issue_month", document.getElementById("issue_month").value);
//         formData.append("issue_year", document.getElementById("issue_year").value);
//         formData.append("expiry_month", document.getElementById("expiry_month").value);
//         formData.append("expiry_year", document.getElementById("expiry_year").value);
//         formData.append("credential_id", document.getElementById("credential_id").value);
//         formData.append("credential_url", document.getElementById("credential_url").value);

//         const file = document.getElementById("cert_logo").files[0];
//         if (file) formData.append("logo", file);

//         await fetch(`${API}/add-certification`, {
//             method: "POST",
//             body: formData
//         });

//         alert("Certification Added ✅");
//     }

//     loadCertifications();
// }


