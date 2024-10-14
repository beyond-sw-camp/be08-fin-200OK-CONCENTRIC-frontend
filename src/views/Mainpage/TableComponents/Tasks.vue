<template>
  <div class="card mb-4">
    <div class="card-header pb-0 d-flex justify-content-between align-items-center">
      <h5>Tasks</h5>
      <div class="d-inline-flex align-items-center">
        <button type="button" class="btn btn-primary ms-auto" @click="sortTasks">
          <a class="mx-1">
            <i class="fa fa-bars"></i>
          </a>
          정렬
        </button>
        <button type="button" class="btn btn-success ms-3" @click="showAddTaskModal">
          + New Task
        </button>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-2">
        <table class="table align-items-center justify-content-center mb-3">
          <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
            </th>
            <th v-for="(column, index) in columns" :key="index" class="position-relative" @click="toggleSortOrder(column.key)">
              {{ column.label }}
              <div v-if="sortOrder.key === column.key" class="sort-icons">
                <i v-if="sortOrder.order === 'asc'" class="fa fa-arrow-up"></i>
                <i v-else class="fa fa-arrow-down"></i>
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="task in tasks" :key="task.id" :class="{ 'table-active': selectedTasks.includes(task.id) }">
            <td>
              <input type="checkbox" v-model="selectedTasks" :value="task.id" />
            </td>
            <td v-if="editingTask.id === task.id && editingTask.column === 'title'">
              <input v-model="task.title" @blur="stopEditing" @keyup.enter="stopEditing" />
            </td>
            <td v-else @click="startEditing(task, 'title')">{{ task.title }}</td>

            <td v-if="editingTask.id === task.id && editingTask.column === 'startDate'">
              <input type="datetime-local" v-model="task.startDate" @blur="stopEditing" @keyup.enter="stopEditing" />
            </td>
            <td v-else @click="startEditing(task, 'startDate')">{{ formatDateTime(task.startDate) }}</td>

            <td v-if="editingTask.id === task.id && editingTask.column === 'endDate'">
              <input type="datetime-local" v-model="task.endDate" @blur="stopEditing" @keyup.enter="stopEditing" />
            </td>
            <td v-else @click="startEditing(task, 'endDate')">{{ formatDateTime(task.endDate) }}</td>

            <td v-if="editingTask.id === task.id && editingTask.column === 'status'">
              <select v-model="task.status" @blur="stopEditing" @change="stopEditing">
                <option value="ACTIVE">진행 중</option>
                <option value="INACTIVE">중지</option>
                <option value="COMPLETED">완료</option>
              </select>
            </td>
            <td v-else @click="startEditing(task, 'status')">{{ task.status }}</td>

            <td v-if="editingTask.id === task.id && editingTask.column === 'importance'">
              <input type="number" v-model="task.importance" min="0" max="5" @blur="stopEditing" @keyup.enter="stopEditing" />
            </td>
            <td v-else @click="startEditing(task, 'importance')">{{ task.importance }}</td>

            <td>
              <div class="progress flex-grow-1 ml-auto" style="width: 60%">
                <div
                    class="progress-bar bg-gradient-success"
                    role="progressbar"
                    :aria-valuenow="task.progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :style="{ width: task.progress + '%' }"
                ></div>
              </div>
              <span>{{ task.progress }}%</span>
            </td>
          </tr>
          <tr>
            <td colspan="7" class="text-start">
              <button class="btn shadow-none" @click="showAddTaskModal">+ New Task</button>
              <button type="button" class="btn btn-link text-danger ms-3" @click="deleteSelectedTasks" v-if="selectedTasks.length > 0">
                - Delete Selected Tasks
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <AddSchedule
        :isVisible="modals.addTaskModal"
        @close="closeAddTaskModal"
        @confirm="handleAddTaskConfirm"
    />
  </div>
</template>

<script>
import axios from 'axios';
import AddSchedule from "@/views/Mainpage/TableComponents/AddSchedule.vue";

export default {
  components: {
    AddSchedule,
  },
  data() {
    return {
      columns: [
        { key: 'title', label: '제목' },
        { key: 'startDate', label: '시작 날짜' },
        { key: 'endDate', label: '종료 날짜' },
        { key: 'status', label: '상태' },
        { key: 'importance', label: '중요도' },
        { key: 'progress', label: '완료율' },
      ],
      tasks: [],
      editingTask: {
        id: null,
        column: null,
      },
      modals: {
        addTaskModal: false,
      },
      selectedTasks: [],
      selectAll: false,
      sortOrder: {
        key: '',
        order: 'asc',
      },
    };
  },
  methods: {
    async fetchSchedules() {
      try {
        const response = await axios.get('/schedule/list');
        this.tasks = response.data;
      } catch (error) {
        console.error('일정을 불러오는 중 오류가 발생했습니다.', error);
      }
    },
    startEditing(task, column) {
      this.editingTask.id = task.id;
      this.editingTask.column = column;
    },
    stopEditing() {
      this.editingTask.id = null;
      this.editingTask.column = null;
    },
    async deleteTask(taskId) {
      try {
        await axios.delete(`/schedule/delete/${taskId}`);
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      } catch (error) {
        console.error('일정 삭제 중 오류가 발생했습니다.', error);
      }
    },
    async deleteSelectedTasks() {
      try {
        for (const taskId of this.selectedTasks) {
          await axios.delete(`/schedule/delete/${taskId}`);
        }
        this.tasks = this.tasks.filter(task => !this.selectedTasks.includes(task.id));
        this.selectedTasks = [];
        this.selectAll = false;
      } catch (error) {
        console.error('선택된 일정 삭제 중 오류가 발생했습니다.', error);
      }
    },
    showAddTaskModal() {
      this.modals.addTaskModal = true;
    },
    closeAddTaskModal() {
      this.modals.addTaskModal = false;
    },
    async handleAddTaskConfirm(newTask) {
      try {
        const response = await axios.post('/schedule/create', newTask);
        this.tasks.push(response.data);
      } catch (error) {
        console.error('새 일정을 추가하는 중 오류가 발생했습니다.', error);
      } finally {
        this.closeAddTaskModal();
      }
    },
    sortTasks() {
      this.tasks.sort((a, b) => a.importance - b.importance);
    },
    toggleSortOrder(columnKey) {
      if (this.sortOrder.key === columnKey) {
        this.sortOrder.order = this.sortOrder.order === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOrder.key = columnKey;
        this.sortOrder.order = 'asc';
      }
      this.sortTasksByKey();
    },
    sortTasksByKey() {
      this.tasks.sort((a, b) => {
        if (this.sortOrder.order === 'asc') {
          return a[this.sortOrder.key] > b[this.sortOrder.key] ? 1 : -1;
        } else {
          return a[this.sortOrder.key] < b[this.sortOrder.key] ? 1 : -1;
        }
      });
    },
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      return new Date(dateTime).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedTasks = this.tasks.map(task => task.id);
      } else {
        this.selectedTasks = [];
      }
    },
  },
  created() {
    this.fetchSchedules();
  },
};
</script>

<style scoped>
h1 {
  font-family: 'Consolas', sans-serif;
  color: #8A9BF9;
}
p {
  font-size: 24px;
}
.sort-icons {
  display: inline-block;
  margin-left: 5px;
}
.table-active {
  background-color: #e0f7fa !important;
}
</style>
