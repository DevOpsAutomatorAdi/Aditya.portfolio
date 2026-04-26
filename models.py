from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200))
    description = db.Column(db.Text)

    project_link = db.Column(db.String(300))          # Live project / GitHub link
    documentation_link = db.Column(db.String(300))   # Docs link

    images = db.relationship(
        'ProjectImage',
        backref='project',
        lazy=True,
        cascade="all, delete-orphan"
    )


class ProjectImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    image_path = db.Column(db.String(300))   # uploaded local file path
    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id'),
        nullable=False
    )

class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    college_name = db.Column(db.String(200))      # College Name
    degree = db.Column(db.String(100))            # Degree / Diploma
    branch = db.Column(db.String(100))            # Branch / Stream
    duration = db.Column(db.String(50))           # Example: 2021 - 2024
    logo = db.Column(db.String(300))              # Logo image path / URL

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(200))
    company = db.Column(db.String(200))
    description = db.Column(db.Text)

    job_type = db.Column(db.String(50))   # Full-time / Part-time / Internship
    work_mode = db.Column(db.String(50))  # Remote / Hybrid / Onsite
    duration = db.Column(db.String(100))  # e.g. "May 2025 - Present"
    logo = db.Column(db.String(300))  # ✅ NEW (company logo URL or uploaded path)

class Certification(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(200))              # AWS Cloud Practitioner
    organization = db.Column(db.String(200))      # AWS

    issue_month = db.Column(db.String(20))
    issue_year = db.Column(db.String(10))

    expiry_month = db.Column(db.String(20))
    expiry_year = db.Column(db.String(10))

    credential_id = db.Column(db.String(200))
    credential_url = db.Column(db.String(300))

    logo = db.Column(db.String(300))  # certificate logo

# class Certification(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(200))
#     issuer = db.Column(db.String(200))