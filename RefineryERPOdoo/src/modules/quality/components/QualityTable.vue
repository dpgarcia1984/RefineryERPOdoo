<template>
  <div class="quality-table">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
            <th v-if="showActions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td v-for="column in columns" :key="column.key">
              <template v-if="column.type === 'badge'">
                <span :class="getBadgeClass(item[column.key])">
                  {{ item[column.key] }}
                </span>
              </template>
              <template v-else>
                {{ item[column.key] }}
              </template>
            </td>
            <td v-if="showActions">
              <div class="btn-group">
                <button 
                  v-for="action in actions"
                  :key="action.name"
                  class="btn btn-sm"
                  :class="action.class"
                  @click="action.handler(item)"
                >
                  <i :class="action.icon"></i>
                  {{ action.label }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  label: string
  type?: 'text' | 'badge'
}

interface Action {
  name: string
  label?: string
  icon: string
  class: string
  handler: (item: any) => void
}

const props = defineProps<{
  columns: Column[]
  items: any[]
  actions?: Action[]
  badgeClasses?: Record<string, string>
}>()

const showActions = computed(() => props.actions && props.actions.length > 0)

const getBadgeClass = (value: string) => {
  if (props.badgeClasses && props.badgeClasses[value]) {
    return `badge ${props.badgeClasses[value]}`
  }
  return 'badge bg-secondary'
}
</script>

<style scoped>
.quality-table {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.table {
  margin-bottom: 0;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

.badge {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .table {
    font-size: 0.875rem;
  }
  
  .btn-group .btn {
    padding: 0.2rem 0.4rem;
  }
}
</style>