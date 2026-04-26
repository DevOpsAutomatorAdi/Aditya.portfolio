# ================= BASE IMAGE =================
FROM python:3.11-slim

# ================= SET WORKDIR =================
WORKDIR /app

# ================= SYSTEM DEPENDENCIES =================
RUN apt-get update && apt-get install -y gcc

# ================= COPY PROJECT =================
COPY . .

# ================= INSTALL DEPENDENCIES =================
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# ================= ENV =================
ENV PYTHONUNBUFFERED=1

# ================= EXPOSE PORT =================
EXPOSE 5000

# ================= RUN APP =================
CMD ["python", "app.py"]
