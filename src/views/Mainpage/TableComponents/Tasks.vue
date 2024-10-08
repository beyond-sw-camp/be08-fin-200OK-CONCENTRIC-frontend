<template>
  <div class="card mb-4">
    <div class="card-header pb-0 d-flex justify-content-between align-items-center">
      <h5>Tasks</h5>
      <button type="button" class="btn btn-primary ms-auto">
        <a class="mx-1">
          <i class="fa fa-bars"></i>
        </a>
        정렬
      </button>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-2">
        <table class="table align-items-center justify-content-center mb-3">
          <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index" colspan="1" class="position-relative" @mouseenter="showIcon(index)" @mouseleave="hideIcon(index)">
                <span v-if="!column.isEditing" @click="editColumn(index)" class="btn mb-0 shadow-none">
                  {{ column.label || 'New Column' }}
                </span>
              <DropdownComponent
                  v-else
                  :options="columnOptions"
                  @columnSelected="updateColumnLabel(index, $event)"
              />

              <i
                  v-show="iconVisible === index"
                  class="fa fa-minus-circle position-absolute text-danger"
                  @click="removeColumn(index)"
                  style="top: 50%; right: 10px; transform: translateY(-50%); cursor: pointer; z-index: 10;"
              ></i>
            </th>
            <th>
              <button class="btn btn-primary btn-sm mx-2 py-1 mb-0" @click="addColumn">+&nbsp;New</button>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="task in tasks" :key="task.id" @mouseenter="hoverRow = task.id" @mouseleave="hoverRow = null">
            <td v-for="(column, index) in columns" :key="index" @click="startEditingTask(task.id, column.key)">
              <div v-if="column.key === 'completion' && !isEditingTask(task.id, column.key)">
                <span class="me-2">{{ task[column.key] }}</span>
                <div class="progress flex-grow-1 ml-auto" style="width: 40%">
                  <div
                      class="progress-bar bg-gradient-success"
                      role="progressbar"
                      :aria-valuenow="task[column.key].replace('%', '')"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: task[column.key] }"
                  ></div>
                </div>
              </div>
              <div v-else-if="column.key === 'completion' && isEditingTask(task.id, column.key)">
                <input
                    v-model="task[column.key]"
                    class="form-control form-control-alternative"
                    ref="input_{{task.id}}_{{column.key}}"
                    @blur="stopEditingTask(task.id, column.key)"
                    @keyup.enter="stopEditingTask(task.id, column.key)"
                />
              </div>

              <div v-else-if="isEditingTask(task.id, column.key)">
                <input
                    v-model="task[column.key]"
                    class="form-control form-control-alternative"
                    ref="input_{{task.id}}_{{column.key}}"
                    @blur="stopEditingTask(task.id, column.key)"
                    @keyup.enter="stopEditingTask(task.id, column.key)"
                />
              </div>
              <div v-else>
                {{ task[column.key] || '' }}
              </div>
            </td>
            <td class="position-relative">
              <i
                  v-show="hoverRow === task.id"
                  class="fa fa-minus-circle position-absolute text-danger"
                  style="top: 50%; right: 75%; transform: translateY(-50%); cursor: pointer; z-index: 10;"
                  @click="openModal(task.id)"
              ></i>
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn shadow-none" @click="addTask">+&nbsp;New Task</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalDeleteRow
        :isVisible="modals.modal1"
        title="Delete?"
        @close="closeModal"
        @confirm="handleConfirm"
    >
      <p>Task will be deleted</p>
    </ModalDeleteRow>
  </div>
</template>

<script>
import DropdownComponent from '../../components/ContentsDropdown.vue';
import axios from 'axios';
import ModalDeleteRow from "@/views/components/ModalDeleteRow.vue";

export default {
  components: {
    ModalDeleteRow,
    DropdownComponent
  },
  data() {
    return {
      hoverRow: null,
      iconVisible: null,
      hoverColumn: null,
      selectedTaskId: null,
      modals: {
        modal1: false,
      },
      mainImage: require('@/assets/img/애옹.png'),
      columns: [
        {key: 'projectName', label: '프로젝트명', isEditing: false},
        {key: 'budget', label: '예산', isEditing: false},
        {key: 'status', label: '상태', isEditing: false},
        {key: 'completion', label: '완료율', isEditing: false},
      ],
      tasks: [
        {id: 1, projectName: 'Spotify', budget: '$2,500', status: '진행 중', completion: '60%'},
        {id: 2, projectName: 'Invision', budget: '$5,000', status: '완료', completion: '100%'},
        {id: 3, projectName: 'Jira', budget: '$3,400', status: '취소됨', completion: '30%'},
        {id: 4, projectName: 'Slack', budget: '$1,000', status: '취소됨', completion: '0%'},
        {id: 5, projectName: 'Webdev', budget: '$14,000', status: '진행 중', completion: '80%'},
        {id: 6, projectName: 'Adobe XD', budget: '$2,300', status: '완료', completion: '100%'},
      ],
      columnOptions: ['projectName', 'budget', 'status', 'completion'],
      editingTask: {
        taskId: null,
        columnKey: null
      }
    };
  },
  methods: {
    showIcon(index) {
      this.iconVisible = index;
    },
    hideIcon(index) {
      this.iconVisible = null;
    },
    addColumn() {
      this.columns.push({ key: '', label: '', isEditing: true });
    },
    editColumn(index) {
      this.columns[index].isEditing = true;
    },
    updateColumnLabel(index, selectedValue) {
      this.columns[index].key = selectedValue;
      this.columns[index].label = this.getLabelForKey(selectedValue);
      this.columns[index].isEditing = false;
    },
    removeColumn(index) {
      this.columns.splice(index, 1);
    },
    getLabelForKey(key) {
      const labelMap = {
        projectName: '프로젝트명',
        budget: '예산',
        status: '상태',
        completion: '완료율',
        deadline: '마감 기한',
        department: '소속',
        type: '유형',
        content: '내용',
      };
      return labelMap[key] || '새 열';
    },

    addTask() {
      const newTaskId = this.tasks.length + 1;
      const newTask = {
        id: newTaskId,
        projectName: '',
        budget: '',
        status: '',
        completion: '0%'
      };
      this.tasks.push(newTask);
    },
    startEditingTask(taskId, columnKey) {
      this.editingTask.taskId = taskId;
      this.editingTask.columnKey = columnKey;
      this.$nextTick(() => {
        const inputRef = this.$refs[`input_${taskId}_${columnKey}`];
        if (inputRef) {
          inputRef.focus();
        }
      });
    },
    stopEditingTask(taskId, columnKey) {
      if (this.editingTask.taskId === taskId && this.editingTask.columnKey === columnKey) {
        this.editingTask.taskId = null;
        this.editingTask.columnKey = null;
      }
    },
    isEditingTask(taskId, columnKey) {
      return this.editingTask.taskId === taskId && this.editingTask.columnKey === columnKey;
    },

    async fetchData() {
      try {
        const response = await axios.get('/api/getTasks');
        this.tasks = response.data.tasks;
        this.columns = response.data.columns;
      } catch (error) {
        console.error('데이터를 불러오지 못했습니다.', error);
      }
    },

    openModal(taskId) {
      this.selectedTaskId = taskId;
      this.modals.modal1 = true;
    },
    closeModal() {
      this.selectedTaskId = null;
      this.modals.modal1 = false;
    },
    handleConfirm(){
      this.tasks = this.tasks.filter(task => task.id !== this.selectedTaskId);
      this.closeModal();
    }
  }
};
</script>
