<template>
    <div>
      <!-- Restore Button -->
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        :data-bs-target="`#restoreTaskModal${task.id}`"
      >
        Restore Task
      </button>
  
      <!-- Restore Modal -->
      <div
        class="modal fade"
        :id="`restoreTaskModal${task.id}`"
        tabindex="-1"
        aria-labelledby="modalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Restore Task</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to restore this task?</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="restoreTask"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from "bootstrap";
  import axiosInstance from "../axios";
  
  export default {
    name: "RestoreTaskComponent",
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    methods: {
      async restoreTask() {
        try {
          const response = await axiosInstance.post(`/tasks/restore/${this.task.id}`);
          if (response.data.success) {
            this.$emit("taskUpdated");
            const modalElement = document.getElementById(`restoreTaskModal${this.task.id}`);
            const modalInstance = Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            } else {
              new Modal(modalElement).hide();
            }
            alert(response.data.message); // Show success message
          }
        } catch (error) {
          console.error("Error restoring task:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .invalid-feedback {
    display: block;
  }
  </style>
  