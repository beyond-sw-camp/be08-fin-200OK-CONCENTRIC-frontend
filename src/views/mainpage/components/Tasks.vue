<template>
  <div class="card mb-4" style="min-height: 600px;">
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
              <input type="datetime-local" v-model="task.startDate" @blur="stopEditing" @keyup.enter="stopEditing" @change="validateDates" :max="task.endDate" />
            </td>
            <td v-else @click="startEditing(task, 'startDate')">{{ formatDateTime(task.startDate) }}</td>

            <td v-if="editingTask.id === task.id && editingTask.column === 'endDate'">
              <input type="datetime-local" v-model="task.endDate" @blur="stopEditing" @keyup.enter="stopEditing" @change="validateDates" :min="task.startDate" />
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
                    :aria-valuenow="task.progress !== undefined && task.progress !== null ? task.progress : 0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :style="{ width: (task.progress !== undefined && task.progress !== null ? task.progress : 0) + '%' }"
                ></div>
              </div>
              <span>{{ task.progress !== undefined && task.progress !== null ? task.progress + '%' : '0%' }}</span>
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
    <AddTask
        :isVisible="modals.addTaskModal"
        @close="closeAddTaskModal"
        @confirm="handleAddTaskConfirm"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import AddTask from "@/views/mainpage/components/AddTask.vue";

export default {
  components: {
    AddTask
  },
  setup() {
    const columns = ref([
      { key: 'title', label: '제목' },
      { key: 'startDate', label: '시작 날짜' },
      { key: 'endDate', label: '종료 날짜' },
      { key: 'status', label: '상태' },
      { key: 'importance', label: '중요도' },
      { key: 'progress', label: '완료율' },
    ]);

    const tasks = ref([]);
    const editingTask = reactive({ id: null, column: null });
    const modals = reactive({ addTaskModal: false });
    const selectedTasks = ref([]);
    const selectAll = ref(false);
    const sortOrder = reactive({ key: '', order: 'asc' });

    const fetchTasks = async () => {
      try {
        const response = await axios.get('/schedule/list');
        tasks.value = response.data;
      } catch (error) {
        console.error('일정을 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    const startEditing = (task, column) => {
      editingTask.id = task.id;
      editingTask.column = column;
    };

    const stopEditing = async () => {
      if (editingTask.id) {
        const task = tasks.value.find(t => t.id === editingTask.id);

        const updatedTask = {
          title: task.title,
          description: task.description,
          status: task.status,
          startDate: task.startDate,
          endDate: task.endDate,
          importance: task.importance,
          startNotification: task.startNotification,
          endNotification: task.endNotification,
        };

        if (new Date(updatedTask.startDate) > new Date(updatedTask.endDate)) {
          console.error('시작일은 종료일보다 늦을 수 없습니다.');
          return;
        }

        try {
          const response = await axios.put(`/schedule/update/${task.id}`, updatedTask);
          Object.assign(task, response.data);
          console.log('일정이 성공적으로 수정되었습니다.');
        } catch (error) {
          console.error('일정을 수정하는 중 오류가 발생했습니다.', error);
        }
      }

      editingTask.id = null;
      editingTask.column = null;
    };

    const deleteSelectedTasks = async () => {
      try {
        for (const taskId of selectedTasks.value) {
          await axios.delete(`/schedule/delete/${taskId}`);
        }
        tasks.value = tasks.value.filter(task => !selectedTasks.value.includes(task.id));
        selectedTasks.value = [];
        selectAll.value = false;
      } catch (error) {
        console.error('선택된 일정 삭제 중 오류가 발생했습니다.', error);
      }
    };

    const showAddTaskModal = () => {
      modals.addTaskModal = true;
    };

    const closeAddTaskModal = () => {
      modals.addTaskModal = false;
    };

    const handleAddTaskConfirm = async (newTask) => {
      try {
        const response = await axios.post('/schedule/create', newTask);
        tasks.value.push(response.data);
      } catch (error) {
        console.error('새 일정을 추가하는 중 오류가 발생했습니다.', error);
      } finally {
        closeAddTaskModal();
      }
    };

    const sortTasks = () => {
      tasks.value.sort((a, b) => a.importance - b.importance);
    };

    const toggleSortOrder = (columnKey) => {
      if (sortOrder.key === columnKey) {
        sortOrder.order = sortOrder.order === 'asc' ? 'desc' : 'asc';
      } else {
        sortOrder.key = columnKey;
        sortOrder.order = 'asc';
      }
      sortTasksByKey();
    };

    const sortTasksByKey = () => {
      tasks.value.sort((a, b) => {
        if (sortOrder.order === 'asc') {
          return a[sortOrder.key] > b[sortOrder.key] ? 1 : -1;
        } else {
          return a[sortOrder.key] < b[sortOrder.key] ? 1 : -1;
        }
      });
    };

    const formatDateTime = (dateTime) => {
      if (!dateTime) return '';
      return new Date(dateTime).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedTasks.value = tasks.value.map(task => task.id);
      } else {
        selectedTasks.value = [];
      }
    };

    const validateDates = () => {
      tasks.value.forEach(task => {
        if (new Date(task.startDate) > new Date(task.endDate)) {
          task.endDate = task.startDate;
        }
      });
    };

    onMounted(fetchTasks);

    return {
      columns,
      tasks,
      editingTask,
      modals,
      selectedTasks,
      selectAll,
      sortOrder,
      startEditing,
      stopEditing,
      deleteSelectedTasks,
      showAddTaskModal,
      closeAddTaskModal,
      handleAddTaskConfirm,
      sortTasks,
      toggleSortOrder,
      sortTasksByKey,
      formatDateTime,
      toggleSelectAll,
      validateDates,
    };
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