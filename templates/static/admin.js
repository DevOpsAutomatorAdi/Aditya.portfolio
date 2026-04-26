const API = "http://127.0.0.1:5000";

/* ================= HELPER ================= */
async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("❌ Fetch Error:", err);
        alert("Error: " + err.message);
    }
}

/* ================= PROJECT ================= */
async function addProject() {
    console.log("➡️ Adding project...");

    const formData = new FormData();

    formData.append("title", document.getElementById("p_title").value);
    formData.append("description", document.getElementById("p_desc").value);
    formData.append("project_link", document.getElementById("p_link").value);
    formData.append("documentation_link", document.getElementById("p_doc").value);

    const files = document.getElementById("p_images").files;

    for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
    }

    await safeFetch(`${API}/add-project`, {
        method: "POST",
        body: formData
    });

    alert("Project Added ✅");
    loadProjects();
}

async function loadProjects() {
    console.log("📦 Loading projects...");

    const data = await safeFetch(`${API}/projects`);

    const container = document.getElementById("projectList");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(p => {
        container.innerHTML += `
            <div class="list-item">
                <span>${p.title}</span>
                <button class="delete-btn" onclick="deleteProject(${p.id})">❌</button>
            </div>
        `;
    });
}

async function deleteProject(id) {
    await safeFetch(`${API}/delete-project/${id}`, {
        method: "DELETE"
    });

    loadProjects();
}

/* ================= EDUCATION ================= */

async function addEducation() {
    console.log("➡️ Adding education...");

    const formData = new FormData();
    formData.append("college", document.getElementById("college").value);
    formData.append("degree", document.getElementById("degree").value);
    formData.append("branch", document.getElementById("branch").value);
    formData.append("duration", document.getElementById("edu_duration").value);

    const file = document.getElementById("edu_logo").files[0];
    if (file) formData.append("logo", file);

    await safeFetch(`${API}/add-education`, {
        method: "POST",
        body: formData
    });

    alert("Education Added ✅");
    loadEducation();
}

async function loadEducation() {
    const res = await fetch(`${API}/education`);
    const data = await res.json();

    const container = document.getElementById("educationList");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(e => {
        container.innerHTML += `
            <div class="list-item">
                <span>${e.college_name}</span>
                <button class="delete-btn" onclick="deleteEducation(${e.id})">❌</button>
            </div>
        `;
    });
}

async function deleteEducation(id) {
    await fetch(`${API}/delete-education/${id}`, {
        method: "DELETE"
    });

    loadEducation();
}

function editEducation(id, collegeVal, degreeVal, branchVal, durationVal) {
    college.value = collegeVal;
    degree.value = degreeVal;
    branch.value = branchVal;
    edu_duration.value = durationVal;

    const btn = document.getElementById("edu_btn");
    btn.innerText = "Update Education";
    btn.onclick = () => updateEducation(id);
}

async function updateEducation(id) {
    let logoPath = null;

    const file = document.getElementById("edu_logo")?.files[0];

    if (file) {
        logoPath = await uploadFile(file);
    }

    const data = {
        college_name: college.value,
        degree: degree.value,
        branch: branch.value,
        duration: edu_duration.value
    };

    if (logoPath) {
        data.logo = logoPath;
    }

    await fetch(`${API}/education/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    resetEducationForm();
    loadEducation();
}
/* ================= EXPERIENCE ================= */

/* ================= ADD / UPDATE EXPERIENCE ================= */
async function addExperience() {

    const role = document.getElementById("role").value;
    const company = document.getElementById("company").value;
    const description = document.getElementById("exp_desc").value;

    // ✅ UPDATE MODE
    if (window.editExpId) {
        try {
            await fetch(`${API}/update-experience/${window.editExpId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role,
                    company,
                    description
                })
            });

            alert("Experience Updated ✅");
            window.editExpId = null;

        } catch (err) {
            console.error(err);
            alert("Update failed ❌");
        }
    }

    // 🟢 ADD MODE
    else {
        try {
            const formData = new FormData();

            formData.append("role", role);
            formData.append("company", company);
            formData.append("description", description);
            formData.append("job_type", document.getElementById("job_type").value);
            formData.append("work_mode", document.getElementById("work_mode").value);
            formData.append("duration", document.getElementById("exp_duration").value);

            const file = document.getElementById("exp_logo").files[0];
            if (file) formData.append("logo", file);

            await fetch(`${API}/add-experience`, {
                method: "POST",
                body: formData
            });

            alert("Experience Added ✅");

        } catch (err) {
            console.error(err);
            alert("Add failed ❌");
        }
    }

    loadExperience();
}

/* ================= LOAD EXPERIENCE ================= */
async function loadExperience() {
    const res = await fetch(`${API}/experience`);
    const data = await res.json();

    const container = document.getElementById("experienceList");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(e => {
        container.innerHTML += `
            <div class="list-item">
                <span>${e.role} - ${e.company}</span>

                <div>
                    <button onclick="editExperience(${e.id}, \`${e.role}\`, \`${e.company}\`, \`${e.description}\`)">✏️</button>
                    <button class="delete-btn" onclick="deleteExperience(${e.id})">❌</button>
                </div>
            </div>
        `;
    });
}

/* ================= DELETE EXPERIENCE ================= */
async function deleteExperience(id) {
    try {
        await fetch(`${API}/delete-experience/${id}`, {
            method: "DELETE"
        });

        loadExperience();

    } catch (err) {
        console.error(err);
        alert("Delete failed ❌");
    }
}

/* ================= EDIT EXPERIENCE ================= */
function editExperience(id, role, company, description) {
    document.getElementById("role").value = role;
    document.getElementById("company").value = company;
    document.getElementById("exp_desc").value = description;

    window.editExpId = id;
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    loadExperience();
});
/* ================= CERTIFICATIONS ================= */
/* ================= LOAD CERTIFICATIONS ================= */
async function loadCertifications() {
    const res = await fetch(`${API}/certifications`);
    const data = await res.json();

    const container = document.getElementById("certList"); // ✅ FIXED
    if (!container) return;

    container.innerHTML = "";

    data.forEach(c => {
        container.innerHTML += `
            <div class="list-item">
                <span>${c.name} - ${c.organization}</span>

                <div>
                    <button onclick="editCertification(${c.id}, \`${c.name}\`, \`${c.organization}\`)">✏️</button>
                    <button class="delete-btn" onclick="deleteCertification(${c.id})">❌</button>
                </div>
            </div>
        `;
    });
}


/* ================= ADD / UPDATE ================= */
async function addCertification() {

    // ✅ UPDATE MODE
    if (window.editCertId) {

        await fetch(`${API}/update-certification/${window.editCertId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById("cert_name").value,
                organization: document.getElementById("cert_org").value
            })
        });

        alert("Certification Updated ✅");

        window.editCertId = null;
        document.getElementById("cert_btn").innerText = "➕ Add Certification";
    }

    // ✅ ADD MODE
    else {
        const formData = new FormData();

        formData.append("name", document.getElementById("cert_name").value);
        formData.append("organization", document.getElementById("cert_org").value);
        formData.append("issue_month", document.getElementById("issue_month").value);
        formData.append("issue_year", document.getElementById("issue_year").value);
        formData.append("expiry_month", document.getElementById("expiry_month").value);
        formData.append("expiry_year", document.getElementById("expiry_year").value);
        formData.append("credential_id", document.getElementById("credential_id").value);
        formData.append("credential_url", document.getElementById("credential_url").value);

        const file = document.getElementById("cert_logo").files[0];
        if (file) formData.append("logo", file);

        await fetch(`${API}/add-certification`, {
            method: "POST",
            body: formData
        });

        alert("Certification Added ✅");
    }

    loadCertifications();
}


/* ================= DELETE ================= */
async function deleteCertification(id) {

    if (!confirm("Delete this certification?")) return;

    await fetch(`${API}/delete-certification/${id}`, {
        method: "DELETE"
    });

    loadCertifications();
}


/* ================= EDIT ================= */
function editCertification(id, name, organization) {

    document.getElementById("cert_name").value = name;
    document.getElementById("cert_org").value = organization;

    window.editCertId = id;

    document.getElementById("cert_btn").innerText = "Update Certification";
}


/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
    loadCertifications();
});