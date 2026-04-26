from flask import Flask, render_template, request, jsonify, send_from_directory
from models import db, Project, ProjectImage, Education, Experience, Certification
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__,
            template_folder="templates",
            static_folder="templates/static",
            static_url_path="/static")

CORS(app)

# ================= CONFIG =================
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio.db'
app.config['UPLOAD_FOLDER'] = 'templates/static/uploads'   # ✅ FIXED

db.init_app(app)
migrate = Migrate(app, db)

# ================= INIT DB =================
with app.app_context():
    db.create_all()

# ================= FILE SERVE =================
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('templates/static/uploads', filename)   # ✅ FIXED

# ================= SAVE FILE =================
def save_file(file):
    if not file or file.filename == "":
        return None

    filename = secure_filename(file.filename)

    # Ensure folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(path)

    return filename

# ================= ROUTES =================
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

# ================= PROJECT =================
@app.route("/add-project", methods=["POST"])
def add_project():
    try:
        project = Project(
            title=request.form.get("title"),
            description=request.form.get("description"),
            project_link=request.form.get("project_link"),
            documentation_link=request.form.get("documentation_link")
        )

        db.session.add(project)
        db.session.commit()

        files = request.files.getlist("images")

        for file in files:
            filename = save_file(file)
            if filename:
                db.session.add(ProjectImage(image_path=filename, project_id=project.id))

        db.session.commit()

        return {"message": "Project added"}

    except Exception as e:
        print("❌ Project Error:", e)
        return {"error": str(e)}, 500


@app.route("/projects")
def get_projects():
    projects = Project.query.all()

    return jsonify([{
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "project_link": p.project_link,
        "documentation_link": p.documentation_link,
        "images": [img.image_path for img in p.images]
    } for p in projects])


@app.route("/delete-project/<int:id>", methods=["DELETE"])
def delete_project(id):
    project = Project.query.get(id)
    db.session.delete(project)
    db.session.commit()
    return {"message": "deleted"}


@app.route("/update-project/<int:id>", methods=["PUT"])
def update_project(id):
    project = Project.query.get(id)

    project.title = request.json.get("title")
    project.description = request.json.get("description")
    project.project_link = request.json.get("project_link")
    project.documentation_link = request.json.get("documentation_link")

    db.session.commit()
    return {"message": "updated"}


# ================= EDUCATION =================
@app.route("/add-education", methods=["POST"])
def add_education():
    try:
        filename = save_file(request.files.get("logo"))

        edu = Education(
            college_name=request.form.get("college"),
            degree=request.form.get("degree"),
            branch=request.form.get("branch"),
            duration=request.form.get("duration"),
            logo=filename
        )

        db.session.add(edu)
        db.session.commit()

        return {"message": "added"}

    except Exception as e:
        print("❌ Education Error:", e)
        return {"error": str(e)}, 500


@app.route("/education")
def get_education():
    data = Education.query.all()

    return jsonify([{
        "id": e.id,
        "college_name": e.college_name,
        "degree": e.degree,
        "branch": e.branch,
        "duration": e.duration,
        "logo": e.logo
    } for e in data])


@app.route("/delete-education/<int:id>", methods=["DELETE"])
def delete_education(id):
    edu = Education.query.get(id)
    db.session.delete(edu)
    db.session.commit()
    return {"message": "deleted"}


@app.route("/update-education/<int:id>", methods=["PUT"])
def update_education(id):
    edu = Education.query.get(id)

    edu.college_name = request.json.get("college")
    edu.degree = request.json.get("degree")
    edu.branch = request.json.get("branch")
    edu.duration = request.json.get("duration")

    db.session.commit()
    return {"message": "updated"}


# ================= EXPERIENCE =================
@app.route("/add-experience", methods=["POST"])
def add_experience():
    try:
        filename = save_file(request.files.get("logo"))

        exp = Experience(
            role=request.form.get("role"),
            company=request.form.get("company"),
            description=request.form.get("description"),
            job_type=request.form.get("job_type"),
            work_mode=request.form.get("work_mode"),
            duration=request.form.get("duration"),
            logo=filename
        )

        db.session.add(exp)
        db.session.commit()

        return {"message": "added"}

    except Exception as e:
        print("❌ Experience Error:", e)
        return {"error": str(e)}, 500


@app.route("/experience")
def get_experience():
    data = Experience.query.all()

    return jsonify([{
        "id": e.id,
        "role": e.role,
        "company": e.company,
        "description": e.description,
        "job_type": e.job_type,
        "work_mode": e.work_mode,
        "duration": e.duration,
        "logo": e.logo
    } for e in data])

@app.route("/delete-experience/<int:id>", methods=["DELETE"])
def delete_experience(id):
    exp = Experience.query.get(id)

    if not exp:
        return {"error": "Experience not found"}, 404

    db.session.delete(exp)
    db.session.commit()

    return {"message": "deleted"}

@app.route("/update-experience/<int:id>", methods=["PUT"])
def update_experience(id):
    exp = Experience.query.get(id)

    exp.role = request.json.get("role")
    exp.company = request.json.get("company")
    exp.description = request.json.get("description")

    db.session.commit()
    return {"message": "updated"}


# ================= CERTIFICATION =================
@app.route("/add-certification", methods=["POST"])
def add_cert():
    try:
        filename = save_file(request.files.get("logo"))

        cert = Certification(
            name=request.form.get("name"),
            organization=request.form.get("organization"),
            issue_month=request.form.get("issue_month"),
            issue_year=request.form.get("issue_year"),
            expiry_month=request.form.get("expiry_month"),
            expiry_year=request.form.get("expiry_year"),
            credential_id=request.form.get("credential_id"),
            credential_url=request.form.get("credential_url"),
            logo=filename
        )

        db.session.add(cert)
        db.session.commit()

        return {"message": "added"}

    except Exception as e:
        print("❌ Certification Error:", e)
        return {"error": str(e)}, 500


@app.route("/certifications")
def get_cert():
    data = Certification.query.all()

    return jsonify([{
        "id": c.id,
        "name": c.name,
        "organization": c.organization,
        "issue_year": c.issue_year,
        "credential_url": c.credential_url,
        "logo": c.logo
    } for c in data])


@app.route("/delete-certification/<int:id>", methods=["DELETE"])
def delete_cert(id):
    cert = Certification.query.get(id)
    db.session.delete(cert)
    db.session.commit()
    return {"message": "deleted"}


@app.route("/update-certification/<int:id>", methods=["PUT"])
def update_cert(id):
    cert = Certification.query.get(id)

    cert.name = request.json.get("name")
    cert.organization = request.json.get("organization")

    db.session.commit()
    return {"message": "updated"}


# ================= RUN =================
# ================= RUN =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
