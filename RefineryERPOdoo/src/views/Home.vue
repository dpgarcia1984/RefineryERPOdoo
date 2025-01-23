<template>
  <div class="home">
    <div class="container py-4">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">Welcome to ERP Refinery Management System</h1>
          <p class="lead">
            Integrated Management System for Petroleum Refinery with Quality Management Module
          </p>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Quality Management</h5>
              <p class="card-text">Manage quality processes, documents, and audits.</p>
              <router-link to="/quality" class="btn btn-primary">
                Go to Quality Module
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Documents</h5>
              <p class="card-text">Access and manage quality documentation.</p>
              <router-link to="/quality/documents" class="btn btn-primary">
                View Documents
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Processes</h5>
              <p class="card-text">Monitor and manage business processes.</p>
              <router-link to="/quality/processes" class="btn btn-primary">
                View Processes
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Audits</h5>
              <p class="card-text">Track and manage quality audits.</p>
              <router-link to="/quality/audits" class="btn btn-primary">
                View Audits
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">System Overview</h5>
              <p class="card-text">
                This integrated management system helps ensure compliance with:
              </p>
              <ul class="list-unstyled">
                <li><i class="fas fa-check text-success me-2"></i> ISO 9001: Quality Management</li>
                <li><i class="fas fa-check text-success me-2"></i> ISO 45001: Occupational Health and Safety</li>
                <li><i class="fas fa-check text-success me-2"></i> ISO 50001: Energy Management</li>
                <li><i class="fas fa-check text-success me-2"></i> ISO 14001: Environmental Management</li>
                <li><i class="fas fa-check text-success me-2"></i> ISO 17025: Laboratory Competence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home view component
</script>

<style scoped>
.home {
  padding: 1rem;
}

.card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card:hover {
  transform: translateY(-2px);
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.list-unstyled li {
  padding: 0.5rem 0;
}
</style>